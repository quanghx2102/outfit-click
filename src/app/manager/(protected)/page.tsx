import { requireAuth } from '@/lib/require-auth';
import { getAnalyticsScope } from '@/lib/permissions';
import {
  getAnalyticsOverview,
  getAnalyticsOverviewOwn,
} from '@/server/analytics/analytics.service';
import PageHeader from '@/components/manager/PageHeader';
import {
  Shirt,
  ShoppingBag,
  Eye,
  MousePointerClick,
  TrendingUp,
} from 'lucide-react';

function subDays(date: Date, days: number): Date {
  const d = new Date(date);
  d.setDate(d.getDate() - days);
  return d;
}

function fmtNumber(n: number): string {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + 'M';
  if (n >= 1000) return (n / 1000).toFixed(1) + 'k';
  return String(n);
}

function fmtCtr(ctr: number): string {
  return (ctr * 100).toFixed(1) + '%';
}

interface StatCardProps {
  label: string;
  value: string;
  sub?: string;
  icon: React.ReactNode;
  iconBg?: string;
}

function StatCard({ label, value, sub, icon, iconBg = 'bg-slate-100' }: StatCardProps) {
  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">{label}</p>
          <p className="mt-2.5 text-3xl font-bold tracking-tight text-slate-950">{value}</p>
          {sub && <p className="mt-1 text-[11px] text-slate-400">{sub}</p>}
        </div>
        <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${iconBg}`}>
          {icon}
        </div>
      </div>
    </div>
  );
}

function EmptyDashboard() {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-white py-24 text-center">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-slate-50">
        <TrendingUp size={22} className="text-slate-300" />
      </div>
      <p className="text-sm font-medium text-slate-500">No analytics data yet</p>
      <p className="mt-1.5 max-w-xs text-xs text-slate-400">
        Data will appear once outfits are published and viewed.
      </p>
    </div>
  );
}

export default async function ManagerDashboardPage() {
  const user = await requireAuth();
  const scope = await getAnalyticsScope(user.id);

  const now = new Date();
  const range = { from: subDays(now, 30), to: now };

  const overview =
    scope === 'all'
      ? await getAnalyticsOverview(range)
      : scope === 'own'
        ? await getAnalyticsOverviewOwn(range, user.id)
        : null;

  const hasData =
    overview &&
    (overview.totalViews > 0 ||
      overview.outfitCounts.active > 0 ||
      overview.productCounts.active > 0);

  return (
    <div>
      <PageHeader
        title="Dashboard"
        description="Overview · last 30 days"
      />

      {!overview || !hasData ? (
        <EmptyDashboard />
      ) : (
        <div className="space-y-6">
          {/* ── Stat cards ── */}
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4 xl:grid-cols-5">
            <StatCard
              label="Active Outfits"
              value={fmtNumber(overview.outfitCounts.active)}
              sub={`${overview.outfitCounts.draft} draft · ${overview.outfitCounts.hidden} hidden`}
              icon={<Shirt size={17} className="text-slate-600" />}
              iconBg="bg-slate-100"
            />
            <StatCard
              label="Active Products"
              value={fmtNumber(overview.productCounts.active)}
              sub={`${overview.productCounts.inactive} inactive`}
              icon={<ShoppingBag size={17} className="text-slate-600" />}
              iconBg="bg-slate-100"
            />
            <StatCard
              label="Total Views"
              value={fmtNumber(overview.totalViews)}
              sub="Last 30 days"
              icon={<Eye size={17} className="text-sky-500" />}
              iconBg="bg-sky-50"
            />
            <StatCard
              label="Valid Clicks"
              value={fmtNumber(overview.validClicks)}
              sub="Last 30 days"
              icon={<MousePointerClick size={17} className="text-emerald-500" />}
              iconBg="bg-emerald-50"
            />
            <StatCard
              label="CTR"
              value={fmtCtr(overview.ctr)}
              sub="Clicks / Views"
              icon={<TrendingUp size={17} className="text-rose-400" />}
              iconBg="bg-rose-50"
            />
          </div>

          {/* ── Quick tips ── */}
          <div className="rounded-2xl border border-slate-100 bg-white px-6 py-5">
            <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
              Quick tips
            </p>
            <ul className="space-y-2 text-sm text-slate-500">
              <li className="flex items-start gap-2">
                <span className="mt-0.5 text-slate-300">→</span>
                Go to <strong className="font-semibold text-slate-700">Products</strong> to update DNA and upload mockups.
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-0.5 text-slate-300">→</span>
                Go to <strong className="font-semibold text-slate-700">Outfits</strong> to create or publish outfits.
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-0.5 text-slate-300">→</span>
                Go to <strong className="font-semibold text-slate-700">Analytics</strong> for detailed click and view reports.
              </li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
