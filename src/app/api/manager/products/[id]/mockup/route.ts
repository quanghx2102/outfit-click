import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { ForbiddenError, getUserPermissions } from '@/lib/permissions';
import { getProductById } from '@/server/products/product.service';
import {
  uploadMediaAsset,
  MediaValidationError,
  MediaEntityNotFoundError,
} from '@/server/media/media.service';
import { PERMISSIONS } from '@/constants/permissions';
import { MEDIA_ENTITY_TYPE, MEDIA_TYPE } from '@/constants/media';
import type { DataScope } from '@/lib/permissions';

type Params = { params: Promise<{ id: string }> };

function deriveScope(permissions: string[]): DataScope {
  if (permissions.includes(PERMISSIONS.PRODUCTS_VIEW_ALL)) return 'all';
  if (permissions.includes(PERMISSIONS.PRODUCTS_VIEW_ASSIGNED)) return 'assigned';
  return 'none';
}

// POST /api/manager/products/[id]/mockup
// Body: multipart/form-data  { file: File }
// Uploads product mockup image, updates product.mockupImageUrl, records media_asset.
export async function POST(request: NextRequest, { params }: Params) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const [permissions, { id }] = await Promise.all([getUserPermissions(session.userId), params]);

  const scope = deriveScope(permissions);
  if (scope === 'none') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  if (
    !permissions.includes(PERMISSIONS.MEDIA_UPLOAD) ||
    !permissions.includes(PERMISSIONS.PRODUCTS_UPLOAD_MOCKUP)
  ) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const product = await getProductById(id, scope, session.userId);
  if (!product) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json({ error: 'Invalid multipart form data' }, { status: 400 });
  }

  const file = formData.get('file');
  if (!(file instanceof File)) {
    return NextResponse.json({ error: 'Missing or invalid file field' }, { status: 400 });
  }

  try {
    const arrayBuffer = await file.arrayBuffer();
    const fileBuffer = Buffer.from(arrayBuffer);

    const result = await uploadMediaAsset({
      fileBuffer,
      mimeType: file.type,
      fileSize: file.size,
      entityType: MEDIA_ENTITY_TYPE.PRODUCT,
      entityId: id,
      mediaType: MEDIA_TYPE.PRODUCT_MOCKUP,
      uploadedBy: session.userId,
    });

    return NextResponse.json({ ok: true, ...result });
  } catch (error) {
    if (error instanceof ForbiddenError) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    if (error instanceof MediaValidationError) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    if (error instanceof MediaEntityNotFoundError) {
      return NextResponse.json({ error: error.message }, { status: 404 });
    }
    console.error(
      '[POST /api/manager/products/:id/mockup]',
      error instanceof Error ? error.message : error,
    );
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
