import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { getUserPermissions } from '@/lib/permissions';
import { PERMISSIONS } from '@/constants/permissions';
import {
  getOutfitById,
  getOutfitProducts,
  addProductToOutfit,
  DuplicateProductError,
  ProductNotActiveError,
} from '@/server/outfits/outfit.service';
import { listProductsForPicker, getDistinctUrlSuffixes } from '@/server/products/product.service';
import type { DataScope } from '@/lib/permissions';

type Params = { params: Promise<{ id: string }> };

function deriveScope(permissions: string[]): DataScope {
  if (permissions.includes(PERMISSIONS.OUTFITS_VIEW_ALL)) return 'all';
  if (permissions.includes(PERMISSIONS.OUTFITS_VIEW_OWN)) return 'own';
  return 'none';
}

export async function GET(req: NextRequest, { params }: Params) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const [permissions, { id }] = await Promise.all([getUserPermissions(session.userId), params]);
  const scope = deriveScope(permissions);
  if (scope === 'none') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const searchParams = req.nextUrl.searchParams;
  const pickerMode = searchParams.get('picker') === '1';

  if (pickerMode) {
    if (!permissions.includes(PERMISSIONS.OUTFITS_ADD_PRODUCT)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    const keyword = searchParams.get('keyword') ?? undefined;
    const urlSuffix = searchParams.get('urlSuffix') ?? undefined;
    const [products, urlSuffixes] = await Promise.all([
      listProductsForPicker({ keyword, urlSuffix }),
      getDistinctUrlSuffixes(),
    ]);
    return NextResponse.json({ products, urlSuffixes });
  }

  const outfit = await getOutfitById(id, scope, session.userId);
  if (!outfit) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  const products = await getOutfitProducts(id);
  return NextResponse.json(products);
}

export async function POST(req: NextRequest, { params }: Params) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const [permissions, { id }] = await Promise.all([getUserPermissions(session.userId), params]);

  if (!permissions.includes(PERMISSIONS.OUTFITS_ADD_PRODUCT)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const scope = deriveScope(permissions);
  if (scope === 'none') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const outfit = await getOutfitById(id, scope, session.userId);
  if (!outfit) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  let body: { productId?: unknown };
  try {
    body = (await req.json()) as { productId?: unknown };
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  if (typeof body.productId !== 'string' || !body.productId.trim()) {
    return NextResponse.json({ error: 'productId is required.' }, { status: 400 });
  }

  try {
    await addProductToOutfit(id, body.productId.trim(), session.userId);
    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (error) {
    if (error instanceof DuplicateProductError) {
      return NextResponse.json({ error: error.message }, { status: 409 });
    }
    if (error instanceof ProductNotActiveError) {
      return NextResponse.json({ error: error.message }, { status: 422 });
    }
    console.error(
      '[POST /api/manager/outfits/:id/products]',
      error instanceof Error ? error.message : error,
    );
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
