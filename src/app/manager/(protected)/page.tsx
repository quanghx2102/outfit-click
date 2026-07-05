import Link from 'next/link';
import { requireAuth } from '@/lib/require-auth';
import { getAnalyticsScope } from '@/lib/permissions';
import {
  getAnalyticsOverview,
  getAnalyticsOverviewOwn,
  getTopOutfits,
  getTopOutfitsOwn,
  getTopProducts,
  getTopProductsOwn,
} from '@/server/analytics/analytics.service';
import { listSyncLogs } from '@/server/sync/sync-log.service';
import PageHeader from '@/components/manager/PageHeader';
import StatusBadge from '@/components/manager/StatusBadge';
import { getProductDisplayImage } from '@/lib/utils';
import {
  Shirt,
  ShoppingBag,
  Eye,
  MousePointerClick,
  TrendingUp,
  RefreshCw,
} from 'lucide-react';
import { MANAGER_ROUTES } from '@/constants/routes';

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
  return (ctr * 100).toFixed(2) + '%';
}

function formatDateTime(d: Date | null): string {
  if (!d) return '—';
  return d.toISOString().replace('T', ' ').slice(0, 16);
}

interface StatCardProps {
  label: string;
  value: string;
  sub?: string;
  icon: React.ReactNode;
  iconBg?: string;
  accent?: string;
}

function StatCard({ label, value, sub, icon, iconBg = '#F3F4F6', accent }: StatCardProps) {
  return (
    <div
      className="rounded-2xl border p-5 transition-shadow hover:shadow-md"
      style={{ borderColor: '#E5E7EB', background: '#FFFFFF' }}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p
            className="text-[10px] font-bold uppercase"
            style={{ letterSpacing: '0.15em', color: '#6B7280' }}
          >
            {label}
          </p>
          <p className="mt-2 text-3xl font-bold tracking-tight" style={{ color: accent ?? '#111827' }}>
            {value}
          </p>
          {sub && (
            <p className="mt-1 text-[11px]" style={{ color: '#9CA3AF' }}>{sub}</p>
          )}
        </div>
        <div
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
          style={{ background: iconBg }}
        >
          {icon}
        </div>
      </div>
    </div>
  );
}

function EmptyDashboard() {
  return (
    <div
      className="flex flex-col items-center justify-center rounded-2xl border border-dashed py-24 text-center"
      style={{ borderColor: '#E5E7EB', background: '#FFFFFF' }}
    >
      <div
        className="mb-4 flex h-14 w-14 items-center justify-center rounded-full"
        style={{ background: '#F9FAFB' }}
      >
        <TrendingUp size={22} style={{ color: '#D1D5DB' }} />
      </div>
      <p className="text-sm font-medium" style={{ color: '#6B7280' }}>Chưa có dữ liệu phân tích</p>
      <p className="mt-1.5 max-w-xs text-xs" style={{ color: '#9CA3AF' }}>
        Dữ liệu sẽ xuất hiện khi outfit được xuất bản và có lượt xem.
      </p>
    </div>
  );
}

export default async function ManagerDashboardPage() {
  const user = await requireAuth();
  const scope = await getAnalyticsScope(user.id);

  const now = new Date();
  const range = { from: subDays(now, 7), to: now };

  const [overview, topOutfits, topProducts, syncLogsResult] = await Promise.all([
    scope === 'all'
      ? getAnalyticsOverview(range)
      : scope === 'own'
        ? getAnalyticsOverviewOwn(range, user.id)
        : null,
    scope === 'all'
      ? getTopOutfits(range, 5)
      : scope === 'own'
        ? getTopOutfitsOwn(range, user.id, 5)
        : [],
    scope === 'all'
      ? getTopProducts(range, 5)
      : scope === 'own'
        ? getTopProductsOwn(range, user.id, 5)
        : [],
    scope !== 'none'
      ? listSyncLogs({ page: 1, limit: 5 })
      : { items: [], total: 0 },
  ]);

  const hasData =
    overview &&
    (overview.totalViews > 0 ||
      overview.outfitCounts.active > 0 ||
      overview.productCounts.active > 0);

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Tổng quan"
        description="Thống kê tổng quan của trang outfit affiliate."
      />

      {!overview || !hasData ? (
        <EmptyDashboard />
      ) : (
        <>
          {/* Stat cards */}
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-6">
            <StatCard
              label="Tổng Outfit"
              value={fmtNumber(overview.outfitCounts.active + overview.outfitCounts.draft + overview.outfitCounts.hidden)}
              sub={`${overview.outfitCounts.active} đang hoạt động`}
              icon={<Shirt size={17} style={{ color: '#374151' }} />}
              iconBg="#F3F4F6"
            />
            <StatCard
              label="Outfit Đang Hoạt Động"
              value={fmtNumber(overview.outfitCounts.active)}
              sub={`${overview.outfitCounts.draft} bản nháp · ${overview.outfitCounts.hidden} đã ẩn`}
              icon={<Shirt size={17} style={{ color: '#374151' }} />}
              iconBg="#F3F4F6"
            />
            <StatCard
              label="Tổng Sản Phẩm"
              value={fmtNumber(overview.productCounts.active + overview.productCounts.inactive)}
              sub={`${overview.productCounts.active} đang hoạt động`}
              icon={<ShoppingBag size={17} style={{ color: '#374151' }} />}
              iconBg="#F3F4F6"
            />
            <StatCard
              label="Tổng Lượt Click"
              value={fmtNumber(overview.validClicks)}
              sub="7 ngày gần đây"
              icon={<MousePointerClick size={17} style={{ color: '#2563EB' }} />}
              iconBg="#EFF6FF"
            />
            <StatCard
              label="Tổng Lượt Xem"
              value={fmtNumber(overview.totalViews)}
              sub="7 ngày gần đây"
              icon={<Eye size={17} style={{ color: '#0EA5E9' }} />}
              iconBg="#F0F9FF"
            />
            <StatCard
              label="CTR"
              value={fmtCtr(overview.ctr)}
              sub="Click / Xem"
              icon={<TrendingUp size={17} style={{ color: '#D97706' }} />}
              iconBg="#FFFBEB"
              accent="#D97706"
            />
          </div>

          {/* Bottom section: Sync Logs + Top Outfits + Top Products */}
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Recent Sync Logs */}
            <div
              className="rounded-2xl border"
              style={{ borderColor: '#E5E7EB', background: '#FFFFFF' }}
            >
              <div
                className="flex items-center justify-between px-5 py-4"
                style={{ borderBottom: '1px solid #F3F4F6' }}
              >
                <div>
                  <p className="text-[14px] font-semibold" style={{ color: '#111827' }}>Đồng bộ gần đây</p>
                </div>
                <Link
                  href={MANAGER_ROUTES.SYNC_LOGS}
                  className="text-[12px] font-medium transition-opacity hover:opacity-60"
                  style={{ color: '#9A7654' }}
                >
                  Xem tất cả →
                </Link>
              </div>
              <div className="divide-y" style={{ '--tw-divide-color': '#F9FAFB' } as React.CSSProperties}>
                {syncLogsResult.items.length === 0 ? (
                  <p className="px-5 py-6 text-sm text-center" style={{ color: '#9CA3AF' }}>Chưa có lịch sử đồng bộ.</p>
                ) : (
                  syncLogsResult.items.map((log) => (
                    <div key={log.id} className="flex items-start gap-3 px-5 py-3">
                      <div
                        className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full"
                        style={{ background: '#F3F4F6' }}
                      >
                        <RefreshCw size={12} style={{ color: '#6B7280' }} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-[13px] font-medium" style={{ color: '#111827' }}>
                          {log.urlSuffix}{log.groupId ? ` · ${log.groupId}` : ''}
                        </p>
                        <p className="text-[11px]" style={{ color: '#9CA3AF' }}>
                          Đã lấy {log.totalFetched} sản phẩm
                        </p>
                        <p className="text-[10px] font-mono" style={{ color: '#D1D5DB' }}>
                          {formatDateTime(log.startedAt)}
                        </p>
                      </div>
                      <StatusBadge status={log.status} />
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Top Clicked Outfits */}
            <div
              className="rounded-2xl border"
              style={{ borderColor: '#E5E7EB', background: '#FFFFFF' }}
            >
              <div
                className="flex items-center justify-between px-5 py-4"
                style={{ borderBottom: '1px solid #F3F4F6' }}
              >
                <p className="text-[14px] font-semibold" style={{ color: '#111827' }}>Outfit Được Click Nhiều Nhất</p>
                <span className="text-[11px] font-medium" style={{ color: '#9CA3AF' }}>Click</span>
              </div>
              <div className="divide-y" style={{ '--tw-divide-color': '#F9FAFB' } as React.CSSProperties}>
                {topOutfits.length === 0 ? (
                  <p className="px-5 py-6 text-sm text-center" style={{ color: '#9CA3AF' }}>Chưa có dữ liệu.</p>
                ) : (
                  topOutfits.map((outfit) => (
                    <div key={outfit.outfitId} className="flex items-center gap-3 px-5 py-3">
                      <div
                        className="h-10 w-10 shrink-0 overflow-hidden rounded-xl"
                        style={{ background: '#F3F4F6' }}
                      >
                        {outfit.coverImageUrl && (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={outfit.coverImageUrl}
                            alt={outfit.name}
                            className="h-full w-full object-cover"
                          />
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-[13px] font-medium" style={{ color: '#111827' }}>
                          {outfit.name}
                        </p>
                        <p className="font-mono text-[10px]" style={{ color: '#9CA3AF' }}>
                          {outfit.outfitCode}
                        </p>
                      </div>
                      <span className="shrink-0 text-[13px] font-bold" style={{ color: '#374151' }}>
                        {outfit.clickCount}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Top Clicked Products */}
            <div
              className="rounded-2xl border"
              style={{ borderColor: '#E5E7EB', background: '#FFFFFF' }}
            >
              <div
                className="flex items-center justify-between px-5 py-4"
                style={{ borderBottom: '1px solid #F3F4F6' }}
              >
                <p className="text-[14px] font-semibold" style={{ color: '#111827' }}>Sản Phẩm Được Click Nhiều Nhất</p>
                <span className="text-[11px] font-medium" style={{ color: '#9CA3AF' }}>Click</span>
              </div>
              <div className="divide-y" style={{ '--tw-divide-color': '#F9FAFB' } as React.CSSProperties}>
                {topProducts.length === 0 ? (
                  <p className="px-5 py-6 text-sm text-center" style={{ color: '#9CA3AF' }}>Chưa có dữ liệu.</p>
                ) : (
                  topProducts.map((product) => (
                    <div key={product.productId} className="flex items-center gap-3 px-5 py-3">
                      <div
                        className="h-10 w-10 shrink-0 overflow-hidden rounded-xl"
                        style={{ background: '#F3F4F6' }}
                      >
                        {(product.mockupImageUrl || product.imageUrl) && (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={getProductDisplayImage({ imageUrl: product.imageUrl, mockupImageUrl: product.mockupImageUrl })}
                            alt={product.name}
                            className="h-full w-full object-cover"
                          />
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="line-clamp-2 text-[13px] font-medium" style={{ color: '#111827' }}>
                          {product.name}
                        </p>
                      </div>
                      <span className="shrink-0 text-[13px] font-bold" style={{ color: '#374151' }}>
                        {product.clickCount}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
