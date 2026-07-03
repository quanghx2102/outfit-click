import { Suspense } from 'react';
import Link from 'next/link';
import { requireAuth } from '@/lib/require-auth';
import { getOutfitScope, getUserPermissions } from '@/lib/permissions';
import {
  listOutfits,
  getDistinctStyles,
  getDistinctOutfitTypes,
} from '@/server/outfits/outfit.service';
import { OUTFIT_STATUS } from '@/constants/status';
import type { OutfitStatus } from '@/constants/status';
import { PERMISSIONS } from '@/constants/permissions';
import { MANAGER_ROUTES } from '@/constants/routes';
import OutfitFilters from '@/components/manager/OutfitFilters';
import OutfitTable from '@/components/manager/OutfitTable';
import PageHeader from '@/components/manager/PageHeader';
import EmptyState from '@/components/manager/EmptyState';

const PAGE_SIZE = 50;
const VALID_STATUSES = new Set<string>(Object.values(OUTFIT_STATUS));

type PageSearchParams = {
  keyword?: string;
  status?: string;
  styleId?: string;
  outfitTypeId?: string;
  page?: string;
};

export default async function ManagerOutfitsPage({
  searchParams,
}: {
  searchParams: Promise<PageSearchParams>;
}) {
  const [user, params] = await Promise.all([requireAuth(), searchParams]);

  const [scope, permissions] = await Promise.all([
    getOutfitScope(user.id),
    getUserPermissions(user.id),
  ]);
  const canCreate = permissions.includes(PERMISSIONS.OUTFITS_CREATE);

  if (scope === 'none') {
    return (
      <div className="p-6 lg:p-8">
        <PageHeader title="Outfits" />
        <p className="text-sm text-slate-500">You do not have permission to view outfits.</p>
      </div>
    );
  }

  const keyword = params.keyword?.trim() || undefined;
  const status =
    params.status && VALID_STATUSES.has(params.status)
      ? (params.status as OutfitStatus)
      : undefined;
  const styleId = params.styleId || undefined;
  const outfitTypeId = params.outfitTypeId || undefined;
  const page = Math.max(1, parseInt(params.page ?? '1', 10) || 1);

  const [result, styleOptions, outfitTypeOptions] = await Promise.all([
    listOutfits(
      { keyword, status, styleId, outfitTypeId, page, limit: PAGE_SIZE },
      scope,
      user.id,
    ),
    getDistinctStyles(),
    getDistinctOutfitTypes(),
  ]);

  const totalPages = Math.ceil(result.total / PAGE_SIZE);

  function buildPageUrl(p: number): string {
    const query = new URLSearchParams();
    if (keyword) query.set('keyword', keyword);
    if (status) query.set('status', status);
    if (styleId) query.set('styleId', styleId);
    if (outfitTypeId) query.set('outfitTypeId', outfitTypeId);
    if (p > 1) query.set('page', String(p));
    const qs = query.toString();
    return `/manager/outfits${qs ? `?${qs}` : ''}`;
  }

  return (
    <div className="flex flex-col gap-6 p-6 lg:p-8">
      <PageHeader
        title="Outfits"
        description={`${result.total} outfit${result.total !== 1 ? 's' : ''} total${scope === 'own' ? ' (created by you)' : ''}`}
        actions={
          canCreate && (
            <Link
              href={`${MANAGER_ROUTES.OUTFITS}/new`}
              className="inline-flex h-9 shrink-0 items-center rounded-xl bg-slate-950 px-4 text-sm font-medium text-white transition-colors hover:bg-slate-800"
            >
              + Create Outfit
            </Link>
          )
        }
      />

      {/* Suspense required because OutfitFilters uses useSearchParams */}
      <Suspense>
        <OutfitFilters styleOptions={styleOptions} outfitTypeOptions={outfitTypeOptions} />
      </Suspense>

      {result.items.length === 0 ? (
        <EmptyState
          title="No outfits found"
          description="Try adjusting the filters or create a new outfit."
        />
      ) : (
        <OutfitTable items={result.items} />
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
                className="inline-flex h-8 items-center rounded-xl border border-slate-200 bg-white px-3 text-sm transition-colors hover:bg-slate-50 hover:text-slate-950"
              >
                Previous
              </Link>
            )}
            {page < totalPages && (
              <Link
                href={buildPageUrl(page + 1)}
                className="inline-flex h-8 items-center rounded-xl border border-slate-200 bg-white px-3 text-sm transition-colors hover:bg-slate-50 hover:text-slate-950"
              >
                Next
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
