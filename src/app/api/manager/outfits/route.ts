import { randomUUID } from 'crypto';
import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { ForbiddenError, getOutfitScope, requirePermission } from '@/lib/permissions';
import { listOutfits, createOutfit } from '@/server/outfits/outfit.service';
import { generateOutfitCode } from '@/lib/outfit-code';
import { uploadToR2 } from '@/lib/r2';
import { deleteFromR2 } from '@/lib/r2';
import { isValidSlug } from '@/lib/slug';
import { prisma } from '@/lib/db';
import { PERMISSIONS } from '@/constants/permissions';
import { MEDIA_ENTITY_TYPE, MEDIA_TYPE } from '@/constants/media';
import { OUTFIT_STATUS } from '@/constants/status';
import type { OutfitStatus } from '@/constants/status';

const ALLOWED_MIME_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp']);
const MIME_TO_EXT: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
};
const MAX_FILE_SIZE = 5 * 1024 * 1024;

const VALID_STATUSES = new Set<string>(Object.values(OUTFIT_STATUS));

export async function GET(request: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const scope = await getOutfitScope(session.userId);
  if (scope === 'none') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const { searchParams } = request.nextUrl;
  const keyword = searchParams.get('keyword') || undefined;
  const rawStatus = searchParams.get('status');
  const status =
    rawStatus && VALID_STATUSES.has(rawStatus) ? (rawStatus as OutfitStatus) : undefined;
  const styleId = searchParams.get('styleId') || undefined;
  const outfitTypeId = searchParams.get('outfitTypeId') || undefined;
  const page = Math.max(1, parseInt(searchParams.get('page') ?? '1', 10) || 1);
  const limit = Math.min(
    100,
    Math.max(1, parseInt(searchParams.get('limit') ?? '50', 10) || 50),
  );

  try {
    const result = await listOutfits(
      { keyword, status, styleId, outfitTypeId, page, limit },
      scope,
      session.userId,
    );
    return NextResponse.json(result);
  } catch (error) {
    console.error('[GET /api/manager/outfits]', error instanceof Error ? error.message : error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST /api/manager/outfits
// Body: multipart/form-data
//   name         — required, max 255
//   slug         — required, valid slug format
//   description  — optional
//   styleId      — optional UUID
//   outfitTypeId — optional UUID
//   coverFile    — required image file (max 5MB)
export async function POST(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await requirePermission(session.userId, PERMISSIONS.OUTFITS_CREATE);
  } catch (error) {
    if (error instanceof ForbiddenError) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    throw error;
  }

  // ── Parse multipart form ─────────────────────────────────────────────────────
  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json({ error: 'Invalid multipart form data' }, { status: 400 });
  }

  const name = (formData.get('name') as string | null)?.trim() ?? '';
  const slug = (formData.get('slug') as string | null)?.trim() ?? '';
  const description = (formData.get('description') as string | null)?.trim() ?? '';
  const styleId = (formData.get('styleId') as string | null)?.trim() || undefined;
  const outfitTypeId = (formData.get('outfitTypeId') as string | null)?.trim() || undefined;
  const coverFile = formData.get('coverFile');

  // ── Validate text fields ─────────────────────────────────────────────────────
  if (!name || name.length > 255) {
    return NextResponse.json({ error: 'Name is required (max 255 chars).' }, { status: 400 });
  }
  if (!slug) {
    return NextResponse.json({ error: 'Slug is required.' }, { status: 400 });
  }
  if (!isValidSlug(slug)) {
    return NextResponse.json(
      { error: 'Invalid slug. Use lowercase letters, digits, and hyphens only.' },
      { status: 400 },
    );
  }

  // ── Validate cover file ──────────────────────────────────────────────────────
  if (!(coverFile instanceof File)) {
    return NextResponse.json({ error: 'Cover image is required.' }, { status: 400 });
  }
  if (!ALLOWED_MIME_TYPES.has(coverFile.type)) {
    return NextResponse.json(
      { error: 'Invalid file type. Allowed: JPEG, PNG, WEBP.' },
      { status: 400 },
    );
  }
  if (coverFile.size > MAX_FILE_SIZE) {
    return NextResponse.json({ error: 'File too large. Max 5MB.' }, { status: 400 });
  }

  // ── Generate IDs ─────────────────────────────────────────────────────────────
  let outfitCode: string;
  try {
    outfitCode = await generateOutfitCode();
  } catch {
    return NextResponse.json({ error: 'Failed to generate outfit code.' }, { status: 500 });
  }

  const outfitId = randomUUID();
  const ext = MIME_TO_EXT[coverFile.type];
  const fileKey = `outfits/${outfitId}/cover/${Date.now()}.${ext}`;

  // ── Upload cover to R2 ───────────────────────────────────────────────────────
  const arrayBuffer = await coverFile.arrayBuffer();
  const fileBuffer = Buffer.from(arrayBuffer);

  let fileUrl: string;
  try {
    const result = await uploadToR2({ fileKey, body: fileBuffer, contentType: coverFile.type });
    fileUrl = result.fileUrl;
  } catch (error) {
    console.error('[POST /api/manager/outfits] R2 upload failed:', error instanceof Error ? error.message : error);
    return NextResponse.json({ error: 'Cover upload failed.' }, { status: 500 });
  }

  // ── Create outfit + media_asset in DB ────────────────────────────────────────
  try {
    const outfit = await createOutfit(
      { id: outfitId, outfitCode, name, slug, description: description || undefined, coverImageUrl: fileUrl, styleId, outfitTypeId },
      session.userId,
    );

    await prisma.mediaAsset.create({
      data: {
        entityType: MEDIA_ENTITY_TYPE.OUTFIT,
        entityId: outfitId,
        mediaType: MEDIA_TYPE.OUTFIT_COVER,
        fileUrl,
        fileKey,
        mimeType: coverFile.type,
        fileSize: BigInt(coverFile.size),
        uploadedBy: session.userId,
      },
    });

    return NextResponse.json({ id: outfit.id, outfitCode: outfit.outfitCode, name: outfit.name, slug: outfit.slug }, { status: 201 });
  } catch (error) {
    // Best-effort R2 cleanup on DB failure
    await deleteFromR2(fileKey).catch((e) => {
      console.error('[POST /api/manager/outfits] R2 cleanup failed:', e instanceof Error ? e.message : e);
    });

    // Slug unique constraint
    const isUniqueViolation =
      typeof error === 'object' &&
      error !== null &&
      'code' in error &&
      (error as { code: string }).code === 'P2002';
    if (isUniqueViolation) {
      return NextResponse.json({ error: 'Slug is already taken.' }, { status: 409 });
    }

    console.error('[POST /api/manager/outfits]', error instanceof Error ? error.message : error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
