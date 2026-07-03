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
  BarChart2,
} from 'lucide-react';

function subDays(date: Date, days: number): Date {
  const d = new Date(date);
  d.setDate(d.getDate() - days);
  return d;
}

function fmtNumber(n: number): string {
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
  accent?: string;
}

function StatCard({ label, value, sub, icon, accent = 'bg-slate-50' }: StatCardProps) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-slate-400">{label}</p>
          <p className="mt-2 text-3xl font-bold text-slate-900">{value}</p>
          {sub && <p className="mt-1 text-xs text-slate-500">{sub}</p>}
        </div>
        <div className={`rounded-lg p-2.5 ${accent}`}>{icon}</div>
      </div>
    </div>
  );
}

function EmptyDashboard() {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 bg-white py-20 text-center">
      <BarChart2 size={40} className="text-slate-300" />
      <p className="mt-4 text-sm font-medium text-slate-500">No analytics data yet</p>
      <p className="mt-1 text-xs text-slate-400">
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
        description="Overview for the last 30 days"
      />

      {!overview || !hasData ? (
        <EmptyDashboard />
      ) : (
        <div className="space-y-6">
          {/* Stats row */}
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4 xl:grid-cols-5">
            <StatCard
              label="Active Outfits"
              value={fmtNumber(overview.outfitCounts.active)}
              sub={`${overview.outfitCounts.draft} draft · ${overview.outfitCounts.hidden} hidden`}
              icon={<Shirt size={18} className="text-slate-600" />}
              accent="bg-slate-100"
            />
            <StatCard
              label="Active Products"
              value={fmtNumber(overview.productCounts.active)}
              sub={`${overview.productCounts.inactive} inactive`}
              icon={<ShoppingBag size={18} className="text-slate-600" />}
              accent="bg-slate-100"
            />
            <StatCard
              label="Total Views"
              value={fmtNumber(overview.totalViews)}
              sub="Last 30 days"
              icon={<Eye size={18} className="text-blue-500" />}
              accent="bg-blue-50"
            />
            <StatCard
              label="Valid Clicks"
              value={fmtNumber(overview.validClicks)}
              sub="Last 30 days"
              icon={<MousePointerClick size={18} className="text-emerald-500" />}
              accent="bg-emerald-50"
            />
            <StatCard
              label="CTR"
              value={fmtCtr(overview.ctr)}
              sub="Clicks / Views"
              icon={<TrendingUp size={18} className="text-rose-500" />}
              accent="bg-rose-50"
            />
          </div>

          {/* Summary hint */}
          <div className="rounded-xl border border-slate-200 bg-white px-6 py-5">
            <p className="text-sm font-medium text-slate-700">Quick tips</p>
            <ul className="mt-3 space-y-2 text-sm text-slate-500">
              <li>→ Go to <strong>Products</strong> to update DNA and upload mockups.</li>
              <li>→ Go to <strong>Outfits</strong> to create or publish outfits.</li>
              <li>→ Go to <strong>Analytics</strong> for detailed click and view reports.</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
