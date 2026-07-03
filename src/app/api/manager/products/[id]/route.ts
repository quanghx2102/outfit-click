import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { getUserPermissions, ForbiddenError } from '@/lib/permissions';
import {
  getProductById,
  updateProductFields,
  getProductRawJson,
} from '@/server/products/product.service';
import { PERMISSIONS } from '@/constants/permissions';
import type { DataScope } from '@/lib/permissions';
import type { UpdateProductInput } from '@/server/products/product.service';

type Params = { params: Promise<{ id: string }> };

const UPDATABLE_STATUSES = new Set(['active', 'inactive']);

function deriveScope(permissions: string[]): DataScope {
  if (permissions.includes(PERMISSIONS.PRODUCTS_VIEW_ALL)) return 'all';
  if (permissions.includes(PERMISSIONS.PRODUCTS_VIEW_ASSIGNED)) return 'assigned';
  return 'none';
}

export async function GET(req: NextRequest, { params }: Params) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const [permissions, { id }] = await Promise.all([
    getUserPermissions(session.userId),
    params,
  ]);

  const scope = deriveScope(permissions);
  if (scope === 'none') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  // ?rawJson=1 — return raw API JSON for debugging
  if (req.nextUrl.searchParams.get('rawJson') === '1') {
    if (!permissions.includes(PERMISSIONS.PRODUCTS_VIEW_ALL)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    const rawJson = await getProductRawJson(id);
    if (rawJson === null) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }
    return NextResponse.json({ rawJson });
  }

  const product = await getProductById(id, scope, session.userId);
  if (!product) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  return NextResponse.json(product);
}

export async function PATCH(req: NextRequest, { params }: Params) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let body: Record<string, unknown>;
  try {
    body = (await req.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const hasDnaField = Object.prototype.hasOwnProperty.call(body, 'productDna');
  const hasMockupField = Object.prototype.hasOwnProperty.call(body, 'mockupImageUrl');
  const hasStatusField = Object.prototype.hasOwnProperty.call(body, 'status');

  if (!hasDnaField && !hasMockupField && !hasStatusField) {
    return NextResponse.json({ error: 'No updatable fields provided' }, { status: 400 });
  }

  if (hasStatusField) {
    const s = body.status;
    if (typeof s !== 'string' || !UPDATABLE_STATUSES.has(s)) {
      return NextResponse.json(
        { error: 'Invalid status. Must be active or inactive.' },
        { status: 400 },
      );
    }
  }

  try {
    const [permissions, { id }] = await Promise.all([
      getUserPermissions(session.userId),
      params,
    ]);

    const scope = deriveScope(permissions);
    if (scope === 'none') throw new ForbiddenError();

    const product = await getProductById(id, scope, session.userId);
    if (!product) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    if (hasDnaField && !permissions.includes(PERMISSIONS.PRODUCTS_UPDATE_DNA)) {
      throw new ForbiddenError();
    }
    if (hasMockupField && !permissions.includes(PERMISSIONS.PRODUCTS_UPLOAD_MOCKUP)) {
      throw new ForbiddenError();
    }
    if (hasStatusField && !permissions.includes(PERMISSIONS.PRODUCTS_UPDATE)) {
      throw new ForbiddenError();
    }

    const input: UpdateProductInput = {};
    if (hasDnaField) {
      const raw = body.productDna;
      input.productDna =
        typeof raw === 'string' && raw.trim() !== '' ? raw.trim() : null;
    }
    if (hasMockupField) {
      const raw = body.mockupImageUrl;
      input.mockupImageUrl =
        typeof raw === 'string' && raw.trim() !== '' ? raw.trim() : null;
    }
    if (hasStatusField) {
      input.status = body.status as 'active' | 'inactive';
    }

    const updated = await updateProductFields(id, input);
    return NextResponse.json(updated);
  } catch (error) {
    if (error instanceof ForbiddenError) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    console.error(
      '[PATCH /api/manager/products/:id]',
      error instanceof Error ? error.message : error,
    );
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
