import { Suspense } from 'react';
import { requireAuth } from '@/lib/require-auth';
import { getAnalyticsScope } from '@/lib/permissions';
import {
  getAnalyticsOverview,
  getTopOutfits,
  getTopProducts,
  getAnalyticsOverviewOwn,
  getTopOutfitsOwn,
  getTopProductsOwn,
} from '@/server/analytics/analytics.service';
import { getProductDisplayImage } from '@/lib/utils';
import AnalyticsDateFilter from '@/components/manager/AnalyticsDateFilter';
import PageHeader from '@/components/manager/PageHeader';
import EmptyState from '@/components/manager/EmptyState';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function toDateStr(d: Date): string {
  return d.toISOString().slice(0, 10);
}

function parseQueryDate(str: string | undefined, fallback: Date): Date {
  if (!str) return new Date(fallback);
  const d = new Date(str + 'T00:00:00.000Z');
  return isNaN(d.getTime()) ? new Date(fallback) : d;
}

function formatCtr(ctr: number): string {
  return (ctr * 100).toFixed(2) + '%';
}

function formatNum(n: number): string {
  return n.toLocaleString('vi-VN');
}

// ─── Types ────────────────────────────────────────────────────────────────────

type PageSearchParams = {
  from?: string;
  to?: string;
};

// ─── Sub-components ───────────────────────────────────────────────────────────

function StatCard({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5">
      <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">{label}</p>
      <div className="mt-3">{children}</div>
    </div>
  );
}

function StatRow({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-slate-500">{label}</span>
      <span className={`font-semibold ${accent ? 'text-emerald-600' : 'text-slate-800'}`}>
        {value}
      </span>
    </div>
  );
}

function StatCards({
  overview,
  outfitLabel,
  productLabel,
}: {
  overview: Awaited<ReturnType<typeof getAnalyticsOverview>>;
  outfitLabel: string;
  productLabel: string;
}) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
      <StatCard label={outfitLabel}>
        <div className="space-y-1.5">
          <StatRow label="Active" value={formatNum(overview.outfitCounts.active)} accent />
          <StatRow label="Draft" value={formatNum(overview.outfitCounts.draft)} />
          <StatRow label="Hidden" value={formatNum(overview.outfitCounts.hidden)} />
        </div>
      </StatCard>

      <StatCard label={productLabel}>
        <div className="space-y-1.5">
          <StatRow label="Active" value={formatNum(overview.productCounts.active)} accent />
          <StatRow label="Inactive" value={formatNum(overview.productCounts.inactive)} />
        </div>
      </StatCard>

      <StatCard label="Views">
        <p className="text-2xl font-bold text-slate-900">{formatNum(overview.totalViews)}</p>
        <p className="mt-1 text-xs text-slate-400">in date range</p>
      </StatCard>

      <StatCard label="Valid Clicks">
        <p className="text-2xl font-bold text-slate-900">{formatNum(overview.validClicks)}</p>
        <p className="mt-1 text-xs text-slate-400">in date range</p>
      </StatCard>

      <StatCard label="CTR">
        <p className="text-2xl font-bold text-slate-900">{formatCtr(overview.ctr)}</p>
        <p className="mt-1 text-xs text-slate-400">valid clicks / views</p>
      </StatCard>
    </div>
  );
}

function TopLists({
  topOutfits,
  topProducts,
  outfitListNote,
  productListNote,
}: {
  topOutfits: Awaited<ReturnType<typeof getTopOutfits>>;
  topProducts: Awaited<ReturnType<typeof getTopProducts>>;
  outfitListNote: string;
  productListNote: string;
}) {
  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
        <div className="border-b border-slate-100 px-5 py-4">
          <h2 className="text-sm font-semibold text-slate-900">Top Outfits by Click</h2>
          <p className="mt-0.5 text-xs text-slate-400">{outfitListNote}</p>
        </div>
        {topOutfits.length === 0 ? (
          <p className="p-5 text-sm text-slate-500">No click data in this period.</p>
        ) : (
          <ol className="divide-y divide-slate-100">
            {topOutfits.map((outfit, i) => (
              <li key={outfit.outfitId} className="flex items-center gap-3 px-5 py-3 hover:bg-slate-50">
                <span className="w-5 shrink-0 text-xs font-medium text-slate-400">{i + 1}</span>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={outfit.coverImageUrl}
                  alt=""
                  className="h-9 w-9 shrink-0 rounded-xl object-cover"
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-slate-900">{outfit.name}</p>
                  <p className="font-mono text-xs text-slate-400">{outfit.outfitCode}</p>
                </div>
                <span className="shrink-0 text-sm font-bold text-slate-900">
                  {formatNum(outfit.clickCount)}
                </span>
              </li>
            ))}
          </ol>
        )}
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
        <div className="border-b border-slate-100 px-5 py-4">
          <h2 className="text-sm font-semibold text-slate-900">Top Products by Click</h2>
          <p className="mt-0.5 text-xs text-slate-400">{productListNote}</p>
        </div>
        {topProducts.length === 0 ? (
          <EmptyState title="No click data" description="No click data in this period." className="m-4 py-8" />
        ) : (
          <ol className="divide-y divide-slate-100">
            {topProducts.map((product, i) => (
              <li key={product.productId} className="flex items-center gap-3 px-5 py-3 hover:bg-slate-50">
                <span className="w-5 shrink-0 text-xs font-medium text-slate-400">{i + 1}</span>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={getProductDisplayImage(product)}
                  alt=""
                  className="h-9 w-9 shrink-0 rounded-xl object-cover"
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-slate-900">{product.name}</p>
                  <p className="text-xs text-slate-400">{product.urlSuffix}</p>
                </div>
                <span className="shrink-0 text-sm font-bold text-slate-900">
                  {formatNum(product.clickCount)}
                </span>
              </li>
            ))}
          </ol>
        )}
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function ManagerAnalyticsPage({
  searchParams,
}: {
  searchParams: Promise<PageSearchParams>;
}) {
  const [user, params] = await Promise.all([requireAuth(), searchParams]);

  const scope = await getAnalyticsScope(user.id);

  if (scope === 'none') {
    return (
      <main className="p-6">
        <PageHeader title="Analytics" />
        <p className="text-sm text-slate-500">You do not have permission to view analytics.</p>
      </main>
    );
  }

  const today = new Date();
  const thirtyDaysAgo = new Date(today);
  thirtyDaysAgo.setUTCDate(today.getUTCDate() - 30);

  const fromStr = params.from ?? toDateStr(thirtyDaysAgo);
  const toStr = params.to ?? toDateStr(today);

  const from = parseQueryDate(params.from, thirtyDaysAgo);
  const to = parseQueryDate(params.to, today);
  to.setUTCHours(23, 59, 59, 999);

  const range = { from, to };

  if (scope === 'all') {
    const [overview, topOutfits, topProducts] = await Promise.all([
      getAnalyticsOverview(range),
      getTopOutfits(range, 10),
      getTopProducts(range, 10),
    ]);

    return (
      <main className="flex flex-col gap-6 p-6">
        <PageHeader title="Analytics" description="System-wide overview" />

        <Suspense>
          <AnalyticsDateFilter fromStr={fromStr} toStr={toStr} />
        </Suspense>

        <StatCards overview={overview} outfitLabel="Outfits" productLabel="Products" />

        <TopLists
          topOutfits={topOutfits}
          topProducts={topProducts}
          outfitListNote="valid clicks in selected date range"
          productListNote="valid clicks in selected date range"
        />
      </main>
    );
  }

  const [overview, topOutfits, topProducts] = await Promise.all([
    getAnalyticsOverviewOwn(range, user.id),
    getTopOutfitsOwn(range, user.id, 10),
    getTopProductsOwn(range, user.id, 10),
  ]);

  return (
    <main className="flex flex-col gap-6 p-6">
      <PageHeader title="Analytics" description="Your outfits & assigned products" />

      <Suspense>
        <AnalyticsDateFilter fromStr={fromStr} toStr={toStr} />
      </Suspense>

      <StatCards overview={overview} outfitLabel="Your Outfits" productLabel="Assigned Products" />

      <TopLists
        topOutfits={topOutfits}
        topProducts={topProducts}
        outfitListNote="your outfits — valid clicks in selected date range"
        productListNote="assigned to you — valid clicks in selected date range"
      />
    </main>
  );
}
