import Link from 'next/link';
import { requireAuth } from '@/lib/require-auth';
import { hasPermission } from '@/lib/permissions';
import { PERMISSIONS } from '@/constants/permissions';
import { listMediaAssets } from '@/server/media/media.service';
import PageHeader from '@/components/manager/PageHeader';
import EmptyState from '@/components/manager/EmptyState';
import MediaGrid from '@/components/manager/MediaGrid';

const PAGE_SIZE = 60;

type PageSearchParams = {
  page?: string;
};

export default async function ManagerMediaPage({
  searchParams,
}: {
  searchParams: Promise<PageSearchParams>;
}) {
  const [user, params] = await Promise.all([requireAuth(), searchParams]);

  const [canView, canDelete] = await Promise.all([
    hasPermission(user.id, PERMISSIONS.MEDIA_UPLOAD),
    hasPermission(user.id, PERMISSIONS.MEDIA_DELETE),
  ]);

  if (!canView) {
    return (
      <div className="p-8">
        <PageHeader title="Media" description="Danh sách hình ảnh đã tải lên Cloudflare R2." />
        <p className="text-sm" style={{ color: '#6B7280' }}>Bạn không có quyền xem media.</p>
      </div>
    );
  }

  const page = Math.max(1, parseInt(params.page ?? '1', 10) || 1);
  const result = await listMediaAssets({ page, limit: PAGE_SIZE });
  const totalPages = Math.ceil(result.total / PAGE_SIZE);

  function buildPageUrl(p: number): string {
    const query = new URLSearchParams();
    if (p > 1) query.set('page', String(p));
    const qs = query.toString();
    return `/manager/media${qs ? `?${qs}` : ''}`;
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Media"
        description="Danh sách hình ảnh đã tải lên Cloudflare R2."
      />

      <p className="text-sm" style={{ color: '#6B7280' }}>
        {result.total.toLocaleString()} ảnh
      </p>

      {result.items.length === 0 ? (
        <EmptyState title="Chưa có media" description="Chưa có hình ảnh nào được tải lên." />
      ) : (
        <MediaGrid
          items={result.items.map((item) => ({
            ...item,
            createdAt: item.createdAt.toISOString(),
          }))}
          canDelete={canDelete}
        />
      )}

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
