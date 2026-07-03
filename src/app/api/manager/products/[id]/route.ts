import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { getUserPermissions, ForbiddenError } from '@/lib/permissions';
import {
  getProductById,
  updateProductFields,
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

export async function GET(_req: NextRequest, { params }: Params) {
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
  const hasStatusField = Object.prototype.hasOwnProperty.call(body, 'status');

  if (!hasDnaField && !hasStatusField) {
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

    // Verify product access before updating
    const product = await getProductById(id, scope, session.userId);
    if (!product) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    if (hasDnaField && !permissions.includes(PERMISSIONS.PRODUCTS_UPDATE_DNA)) {
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
