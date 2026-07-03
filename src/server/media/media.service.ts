// Server-only: Node.js runtime. Do not import in client components or Edge runtime.

import { prisma } from '@/lib/db';
import { uploadToR2, deleteFromR2 } from '@/lib/r2';
import { MEDIA_ENTITY_TYPE, MEDIA_TYPE } from '@/constants/media';
import type { MediaEntityType, MediaType } from '@/constants/media';

// ─── Validation constants ────────────────────────────────────────────────────

export const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp'] as const;
export type AllowedMimeType = (typeof ALLOWED_MIME_TYPES)[number];

export const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5MB

const MIME_TO_EXT: Record<AllowedMimeType, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
};

// ─── Error ───────────────────────────────────────────────────────────────────

// Thrown for client-caused validation errors (MIME, size, consistency).
// Route handler maps this to 400.
export class MediaValidationError extends Error {
  readonly status = 400;
  constructor(message: string) {
    super(message);
    this.name = 'MediaValidationError';
  }
}

// Thrown when the target entity (product/outfit) does not exist.
// Route handler maps this to 404.
export class MediaEntityNotFoundError extends Error {
  readonly status = 404;
  constructor(message: string) {
    super(message);
    this.name = 'MediaEntityNotFoundError';
  }
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

// File key structure from 09-storage-media.md:
// products/{productId}/mockup/{timestamp}.{ext}
// products/{productId}/transparent/{timestamp}.{ext}
// outfits/{outfitId}/cover/{timestamp}.{ext}
// outfits/{outfitId}/anchor/{timestamp}.{ext}
function buildFileKey(entityId: string, mediaType: MediaType, ext: string): string {
  const folderMap: Record<MediaType, string> = {
    [MEDIA_TYPE.PRODUCT_MOCKUP]: `products/${entityId}/mockup`,
    [MEDIA_TYPE.PRODUCT_TRANSPARENT]: `products/${entityId}/transparent`,
    [MEDIA_TYPE.OUTFIT_COVER]: `outfits/${entityId}/cover`,
    [MEDIA_TYPE.OUTFIT_ANCHOR]: `outfits/${entityId}/anchor`,
  };
  return `${folderMap[mediaType]}/${Date.now()}.${ext}`;
}

// ─── Types ───────────────────────────────────────────────────────────────────

export type UploadMediaInput = {
  fileBuffer: Buffer;
  mimeType: string;
  fileSize: number;
  entityType: MediaEntityType;
  entityId: string;
  mediaType: MediaType;
  uploadedBy: string;
};

export type UploadMediaResult = {
  mediaAssetId: string;
  fileKey: string;
  fileUrl: string;
};

// ─── Service ─────────────────────────────────────────────────────────────────

export async function uploadMediaAsset(input: UploadMediaInput): Promise<UploadMediaResult> {
  const { fileBuffer, mimeType, fileSize, entityType, entityId, mediaType, uploadedBy } = input;

  // Validate MIME type (do not trust file extension — per 09-storage-media.md §10)
  if (!ALLOWED_MIME_TYPES.includes(mimeType as AllowedMimeType)) {
    throw new MediaValidationError(
      `Unsupported file type: ${mimeType}. Allowed: ${ALLOWED_MIME_TYPES.join(', ')}`,
    );
  }

  // Validate file size
  if (fileSize > MAX_FILE_SIZE_BYTES) {
    throw new MediaValidationError(
      `File too large: ${fileSize} bytes. Max allowed: ${MAX_FILE_SIZE_BYTES} bytes (5 MB)`,
    );
  }

  // Validate entityType ↔ mediaType consistency
  const isProductMedia =
    mediaType === MEDIA_TYPE.PRODUCT_MOCKUP || mediaType === MEDIA_TYPE.PRODUCT_TRANSPARENT;
  const isOutfitMedia =
    mediaType === MEDIA_TYPE.OUTFIT_COVER || mediaType === MEDIA_TYPE.OUTFIT_ANCHOR;

  if (isProductMedia && entityType !== MEDIA_ENTITY_TYPE.PRODUCT) {
    throw new MediaValidationError(
      `mediaType '${mediaType}' requires entityType '${MEDIA_ENTITY_TYPE.PRODUCT}'`,
    );
  }
  if (isOutfitMedia && entityType !== MEDIA_ENTITY_TYPE.OUTFIT) {
    throw new MediaValidationError(
      `mediaType '${mediaType}' requires entityType '${MEDIA_ENTITY_TYPE.OUTFIT}'`,
    );
  }

  // Verify entity exists BEFORE uploading — avoids orphaned R2 files and gives a clear 404.
  if (isProductMedia) {
    const product = await prisma.product.findUnique({
      where: { id: entityId },
      select: { id: true },
    });
    if (!product) throw new MediaEntityNotFoundError(`Product not found: ${entityId}`);
  } else {
    const outfit = await prisma.outfit.findUnique({
      where: { id: entityId },
      select: { id: true },
    });
    if (!outfit) throw new MediaEntityNotFoundError(`Outfit not found: ${entityId}`);
  }

  // Build R2 file key
  const ext = MIME_TO_EXT[mimeType as AllowedMimeType];
  const fileKey = buildFileKey(entityId, mediaType, ext);

  // Upload to R2
  const { fileUrl } = await uploadToR2({
    fileKey,
    body: fileBuffer,
    contentType: mimeType,
  });

  // Persist DB records. On failure, best-effort delete the just-uploaded R2 file
  // so it doesn't become an orphan.
  try {
    const mediaAsset = await prisma.mediaAsset.create({
      data: {
        entityType,
        entityId,
        mediaType,
        fileUrl,
        fileKey,
        mimeType,
        fileSize: BigInt(fileSize),
        uploadedBy,
      },
    });

    // Update entity image URL (per 09-storage-media.md §7)
    if (mediaType === MEDIA_TYPE.PRODUCT_MOCKUP) {
      await prisma.product.update({
        where: { id: entityId },
        data: { mockupImageUrl: fileUrl },
      });
    } else if (mediaType === MEDIA_TYPE.OUTFIT_COVER) {
      await prisma.outfit.update({
        where: { id: entityId },
        data: { coverImageUrl: fileUrl },
      });
    }

    return { mediaAssetId: mediaAsset.id, fileKey, fileUrl };
  } catch (dbError) {
    // Best-effort R2 cleanup — log failure but always re-throw the original DB error.
    await deleteFromR2(fileKey).catch((cleanupError) => {
      console.error(
        '[media.service] R2 cleanup failed for orphaned file:',
        fileKey,
        cleanupError instanceof Error ? cleanupError.message : String(cleanupError),
      );
    });
    throw dbError;
  }
}
