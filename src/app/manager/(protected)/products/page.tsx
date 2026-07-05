import { Suspense } from 'react';
import Link from 'next/link';
import { requireAuth } from '@/lib/require-auth';
import { getProductScope, hasPermission } from '@/lib/permissions';
import { listProducts, getDistinctUrlSuffixes, getDistinctGroupIds } from '@/server/products/product.service';
import { PRODUCT_STATUS } from '@/constants/status';
import { PERMISSIONS } from '@/constants/permissions';
import type { ProductStatus } from '@/constants/status';
import ProductFilters from '@/components/manager/ProductFilters';
import ProductTable from '@/components/manager/ProductTable';
import PageHeader from '@/components/manager/PageHeader';
import EmptyState from '@/components/manager/EmptyState';
import SyncByUrlSuffixPanel from '@/components/manager/SyncByUrlSuffixPanel';

const PAGE_SIZE = 50;
const VALID_STATUSES = new Set<string>(Object.values(PRODUCT_STATUS));

function parseBoolParam(v: string | undefined): boolean | undefined {
  if (v === 'true') return true;
  if (v === 'false') return false;
  return undefined;
}

type PageSearchParams = {
  keyword?: string;
  urlSuffix?: string;
  externalGroupId?: string;
  status?: string;
  hasMockup?: string;
  hasProductDna?: string;
  page?: string;
};

export default async function ManagerProductsPage({
  searchParams,
}: {
  searchParams: Promise<PageSearchParams>;
}) {
  const [user, params] = await Promise.all([requireAuth(), searchParams]);

  const [scope, canSync] = await Promise.all([
    getProductScope(user.id),
    hasPermission(user.id, PERMISSIONS.SYNC_RUN),
  ]);

  if (scope === 'none') {
    return (
      <div className="p-8">
        <PageHeader title="Sản phẩm" description="Đồng bộ, bổ sung thông tin và quản lý sản phẩm affiliate." />
        <p className="text-sm" style={{ color: '#6B7280' }}>Bạn không có quyền xem sản phẩm.</p>
      </div>
    );
  }

  const keyword = params.keyword?.trim() || undefined;
  const urlSuffix = params.urlSuffix || undefined;
  const externalGroupId = params.externalGroupId || undefined;
  const status =
    params.status && VALID_STATUSES.has(params.status)
      ? (params.status as ProductStatus)
      : undefined;
  const hasMockup = parseBoolParam(params.hasMockup);
  const hasProductDna = parseBoolParam(params.hasProductDna);
  const page = Math.max(1, parseInt(params.page ?? '1', 10) || 1);

  const [result, urlSuffixOptions, groupIdOptions] = await Promise.all([
    listProducts(
      { keyword, urlSuffix, externalGroupId, status, hasMockup, hasProductDna, page, limit: PAGE_SIZE },
      scope,
      user.id,
    ),
    getDistinctUrlSuffixes(),
    getDistinctGroupIds(urlSuffix),
  ]);

  const totalPages = Math.ceil(result.total / PAGE_SIZE);

  function buildPageUrl(p: number): string {
    const query = new URLSearchParams();
    if (keyword) query.set('keyword', keyword);
    if (urlSuffix) query.set('urlSuffix', urlSuffix);
    if (externalGroupId) query.set('externalGroupId', externalGroupId);
    if (status) query.set('status', status);
    if (hasMockup !== undefined) query.set('hasMockup', String(hasMockup));
    if (hasProductDna !== undefined) query.set('hasProductDna', String(hasProductDna));
    if (p > 1) query.set('page', String(p));
    const qs = query.toString();
    return `/manager/products${qs ? `?${qs}` : ''}`;
  }

  const totalLabel =
    result.total === 0
      ? scope === 'assigned'
        ? 'Không có sản phẩm nào được giao cho bạn.'
        : 'Không tìm thấy sản phẩm nào.'
      : `${result.total.toLocaleString()} sản phẩm${scope === 'assigned' ? ' (được giao cho bạn)' : ''}`;

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Sản phẩm"
        description="Đồng bộ, bổ sung thông tin và quản lý sản phẩm affiliate."
        actions={
          canSync ? (
            <span className="text-sm font-medium" style={{ color: '#6B7280' }}>
              ↓ Đồng bộ bên dưới
            </span>
          ) : null
        }
      />

      {/* Sync panel — inline card */}
      {canSync && (
        <Suspense>
          <SyncByUrlSuffixPanel />
        </Suspense>
      )}

      {/* Filter bar */}
      <div
        className="rounded-2xl border p-4"
        style={{ borderColor: '#E5E7EB', background: '#FFFFFF' }}
      >
        <Suspense>
          <ProductFilters urlSuffixOptions={urlSuffixOptions} groupIdOptions={groupIdOptions} />
        </Suspense>
      </div>

      {/* Results count */}
      <div className="flex items-center justify-between">
        <p className="text-sm" style={{ color: '#6B7280' }}>{totalLabel}</p>
      </div>

      {/* Table or empty state */}
      {result.items.length === 0 ? (
        <EmptyState
          title="Chưa có sản phẩm"
          description={canSync ? 'Đồng bộ sản phẩm bằng cách nhập urlSuffix ở trên.' : 'Thử điều chỉnh bộ lọc.'}
        />
      ) : (
        <ProductTable items={result.items} />
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between text-sm" style={{ color: '#6B7280' }}>
          <span>Trang {page} / {totalPages}</span>
          <div className="flex gap-2">
            {page > 1 && (
              <Link
                href={buildPageUrl(page - 1)}
                className="inline-flex h-8 items-center rounded-xl border px-3 text-sm transition-colors hover:bg-gray-50"
                style={{ borderColor: '#E5E7EB' }}
              >
                Trước
              </Link>
            )}
            {page < totalPages && (
              <Link
                href={buildPageUrl(page + 1)}
                className="inline-flex h-8 items-center rounded-xl border px-3 text-sm transition-colors hover:bg-gray-50"
                style={{ borderColor: '#E5E7EB' }}
              >
                Tiếp
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
