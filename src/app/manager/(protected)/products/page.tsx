import { Suspense } from 'react';
import Link from 'next/link';
import { requireAuth } from '@/lib/require-auth';
import { getProductScope } from '@/lib/permissions';
import { listProducts, getDistinctUrlSuffixes } from '@/server/products/product.service';
import { PRODUCT_STATUS } from '@/constants/status';
import type { ProductStatus } from '@/constants/status';
import ProductFilters from '@/components/manager/ProductFilters';
import ProductTable from '@/components/manager/ProductTable';
import PageHeader from '@/components/manager/PageHeader';
import EmptyState from '@/components/manager/EmptyState';

const PAGE_SIZE = 50;
const VALID_STATUSES = new Set<string>(Object.values(PRODUCT_STATUS));

type PageSearchParams = {
  keyword?: string;
  urlSuffix?: string;
  status?: string;
  page?: string;
};

export default async function ManagerProductsPage({
  searchParams,
}: {
  searchParams: Promise<PageSearchParams>;
}) {
  const [user, params] = await Promise.all([requireAuth(), searchParams]);

  const scope = await getProductScope(user.id);

  if (scope === 'none') {
    return (
      <main className="p-6 lg:p-8">
        <PageHeader title="Products" />
        <p className="text-sm text-slate-500">You do not have permission to view products.</p>
      </main>
    );
  }

  const keyword = params.keyword?.trim() || undefined;
  const urlSuffix = params.urlSuffix || undefined;
  const status =
    params.status && VALID_STATUSES.has(params.status)
      ? (params.status as ProductStatus)
      : undefined;
  const page = Math.max(1, parseInt(params.page ?? '1', 10) || 1);

  const [result, urlSuffixOptions] = await Promise.all([
    listProducts({ keyword, urlSuffix, status, page, limit: PAGE_SIZE }, scope, user.id),
    getDistinctUrlSuffixes(),
  ]);

  const totalPages = Math.ceil(result.total / PAGE_SIZE);

  function buildPageUrl(p: number): string {
    const query = new URLSearchParams();
    if (keyword) query.set('keyword', keyword);
    if (urlSuffix) query.set('urlSuffix', urlSuffix);
    if (status) query.set('status', status);
    if (p > 1) query.set('page', String(p));
    const qs = query.toString();
    return `/manager/products${qs ? `?${qs}` : ''}`;
  }

  const description =
    result.total === 0
      ? scope === 'assigned'
        ? 'No products assigned to you.'
        : 'No products found.'
      : `${result.total} product${result.total !== 1 ? 's' : ''} total${scope === 'assigned' ? ' (assigned to you)' : ''}`;

  return (
    <main className="flex flex-col gap-6 p-6 lg:p-8">
      <PageHeader
        title="Products"
        description="Internal products synced from the affiliate source. No public product pages."
      />

      {/* Suspense required because ProductFilters uses useSearchParams */}
      <Suspense>
        <ProductFilters urlSuffixOptions={urlSuffixOptions} />
      </Suspense>

      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-500">{description}</p>
      </div>

      {result.items.length === 0 ? (
        <EmptyState
          title="No products found"
          description="Try adjusting your filters or wait for the next sync."
        />
      ) : (
        <ProductTable items={result.items} />
      )}

      {totalPages > 1 && (
        <div className="flex items-center justify-between text-sm text-slate-600">
          <span>
            Page {page} of {totalPages}
          </span>
          <div className="flex gap-2">
            {page > 1 && (
              <Link
                href={buildPageUrl(page - 1)}
                className="inline-flex h-8 items-center rounded-xl border border-slate-200 bg-white px-3 text-sm hover:bg-slate-50"
              >
                Previous
              </Link>
            )}
            {page < totalPages && (
              <Link
                href={buildPageUrl(page + 1)}
                className="inline-flex h-8 items-center rounded-xl border border-slate-200 bg-white px-3 text-sm hover:bg-slate-50"
              >
                Next
              </Link>
            )}
          </div>
        </div>
      )}
    </main>
  );
}
