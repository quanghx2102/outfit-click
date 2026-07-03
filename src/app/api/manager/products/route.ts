import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { getProductScope } from '@/lib/permissions';
import { listProducts } from '@/server/products/product.service';
import { PRODUCT_STATUS } from '@/constants/status';
import type { ProductStatus } from '@/constants/status';

const VALID_STATUSES = new Set<string>(Object.values(PRODUCT_STATUS));

export async function GET(request: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const scope = await getProductScope(session.userId);
  if (scope === 'none') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const { searchParams } = request.nextUrl;
  const keyword = searchParams.get('keyword') || undefined;
  const urlSuffix = searchParams.get('urlSuffix') || undefined;
  const rawStatus = searchParams.get('status');
  const status =
    rawStatus && VALID_STATUSES.has(rawStatus) ? (rawStatus as ProductStatus) : undefined;
  const page = Math.max(1, parseInt(searchParams.get('page') ?? '1', 10) || 1);
  const limit = Math.min(
    100,
    Math.max(1, parseInt(searchParams.get('limit') ?? '50', 10) || 50),
  );

  try {
    const result = await listProducts(
      { keyword, urlSuffix, status, page, limit },
      scope,
      session.userId,
    );
    return NextResponse.json(result);
  } catch (error) {
    console.error('[GET /api/manager/products]', error instanceof Error ? error.message : error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
