import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { ForbiddenError, requirePermission } from '@/lib/permissions';
import { PERMISSIONS } from '@/constants/permissions';
import { MEDIA_ENTITY_TYPE, MEDIA_TYPE } from '@/constants/media';
import type { MediaEntityType, MediaType } from '@/constants/media';
import {
  uploadMediaAsset,
  MediaValidationError,
  MediaEntityNotFoundError,
} from '@/server/media/media.service';

// POST /api/manager/media/upload
// Body: multipart/form-data
//   file       — image file (image/jpeg | image/png | image/webp, max 5MB)
//   entityType — 'product' | 'outfit'
//   entityId   — UUID of the product or outfit
//   mediaType  — 'product_mockup' | 'product_transparent' | 'outfit_cover' | 'outfit_anchor'

export async function POST(request: Request) {
  // ── Auth ──────────────────────────────────────────────────────────────────
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // ── Parse form data ───────────────────────────────────────────────────────
  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json({ error: 'Invalid multipart form data' }, { status: 400 });
  }

  const file = formData.get('file');
  const entityType = formData.get('entityType');
  const entityId = formData.get('entityId');
  const mediaType = formData.get('mediaType');

  // ── Validate fields ───────────────────────────────────────────────────────
  if (!(file instanceof File)) {
    return NextResponse.json({ error: 'Missing or invalid file field' }, { status: 400 });
  }

  const validEntityTypes = Object.values(MEDIA_ENTITY_TYPE) as string[];
  if (typeof entityType !== 'string' || !validEntityTypes.includes(entityType)) {
    return NextResponse.json(
      { error: `Invalid entityType. Allowed: ${validEntityTypes.join(', ')}` },
      { status: 400 },
    );
  }

  if (typeof entityId !== 'string' || entityId.trim() === '') {
    return NextResponse.json({ error: 'Missing entityId' }, { status: 400 });
  }

  const validMediaTypes = Object.values(MEDIA_TYPE) as string[];
  if (typeof mediaType !== 'string' || !validMediaTypes.includes(mediaType)) {
    return NextResponse.json(
      { error: `Invalid mediaType. Allowed: ${validMediaTypes.join(', ')}` },
      { status: 400 },
    );
  }

  // ── Permission checks ─────────────────────────────────────────────────────
  // Base permission required for all uploads
  // Entity-specific permission based on mediaType (per 04-permission-matrix.md)
  const entitySpecificPermission =
    mediaType === MEDIA_TYPE.PRODUCT_MOCKUP || mediaType === MEDIA_TYPE.PRODUCT_TRANSPARENT
      ? PERMISSIONS.PRODUCTS_UPLOAD_MOCKUP
      : PERMISSIONS.OUTFITS_UPDATE;

  try {
    await requirePermission(session.userId, PERMISSIONS.MEDIA_UPLOAD);
    await requirePermission(session.userId, entitySpecificPermission);
  } catch (error) {
    if (error instanceof ForbiddenError) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    throw error;
  }

  // ── Upload ────────────────────────────────────────────────────────────────
  try {
    const arrayBuffer = await file.arrayBuffer();
    const fileBuffer = Buffer.from(arrayBuffer);

    const result = await uploadMediaAsset({
      fileBuffer,
      mimeType: file.type,
      fileSize: file.size,
      entityType: entityType as MediaEntityType,
      entityId: entityId.trim(),
      mediaType: mediaType as MediaType,
      uploadedBy: session.userId,
    });

    return NextResponse.json({ ok: true, ...result });
  } catch (error) {
    if (error instanceof MediaValidationError) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    if (error instanceof MediaEntityNotFoundError) {
      return NextResponse.json({ error: error.message }, { status: 404 });
    }
    console.error(
      '[api/manager/media/upload] Upload error:',
      error instanceof Error ? error.message : String(error),
    );
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
