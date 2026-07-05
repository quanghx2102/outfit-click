import Link from 'next/link';
import { notFound } from 'next/navigation';
import { requireAuth } from '@/lib/require-auth';
import { getUserPermissions } from '@/lib/permissions';
import { getProductById } from '@/server/products/product.service';
import { PERMISSIONS } from '@/constants/permissions';
import { MANAGER_ROUTES } from '@/constants/routes';
import PageHeader from '@/components/manager/PageHeader';
import StatusBadge from '@/components/manager/StatusBadge';
import ProductEditForm from '@/components/manager/ProductEditForm';
import RawJsonViewer from '@/components/manager/RawJsonViewer';
import type { DataScope } from '@/lib/permissions';

type Props = { params: Promise<{ id: string }> };

function formatDate(date: Date | null): string {
  if (!date) return '—';
  return new Intl.DateTimeFormat('vi-VN', { dateStyle: 'short', timeStyle: 'short' }).format(
    new Date(date),
  );
}

function InfoPanel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
      <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">{title}</p>
      {children}
    </div>
  );
}

export default async function ManagerProductDetailPage({ params }: Props) {
  const [user, { id }] = await Promise.all([requireAuth(), params]);
  const permissions = await getUserPermissions(user.id);

  const scope: DataScope = permissions.includes(PERMISSIONS.PRODUCTS_VIEW_ALL)
    ? 'all'
    : permissions.includes(PERMISSIONS.PRODUCTS_VIEW_ASSIGNED)
      ? 'assigned'
      : 'none';

  if (scope === 'none') {
    return (
      <main className="p-6 lg:p-8">
        <p className="text-sm text-slate-400">Bạn không có quyền xem sản phẩm này.</p>
      </main>
    );
  }

  const product = await getProductById(id, scope, user.id);
  if (!product) notFound();

  const canUpdateDna = permissions.includes(PERMISSIONS.PRODUCTS_UPDATE_DNA);
  const canUpdate = permissions.includes(PERMISSIONS.PRODUCTS_UPDATE);
  const canUploadMockup = permissions.includes(PERMISSIONS.PRODUCTS_UPLOAD_MOCKUP);

  return (
    <main className="flex flex-col gap-5 p-6 lg:p-8">
      {/* Back */}
      <Link
        href={MANAGER_ROUTES.PRODUCTS}
        className="w-fit text-[12px] font-medium text-slate-400 transition-colors hover:text-slate-900"
      >
        ← Quay lại Sản phẩm
      </Link>

      {/* Header */}
      <PageHeader
        title={product.name}
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <StatusBadge status={product.status} />
            {product.productDna ? (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-600">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                DNA
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-50 px-2.5 py-0.5 text-[11px] font-medium text-slate-400">
                <span className="h-1.5 w-1.5 rounded-full bg-slate-200" />
                Chưa có DNA
              </span>
            )}
            {product.mockupImageUrl ? (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-sky-50 px-2.5 py-0.5 text-[11px] font-semibold text-sky-600">
                <span className="h-1.5 w-1.5 rounded-full bg-sky-500" />
                Ảnh mockup
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-50 px-2.5 py-0.5 text-[11px] font-medium text-slate-400">
                <span className="h-1.5 w-1.5 rounded-full bg-slate-200" />
                Chưa có mockup
              </span>
            )}
          </div>
        }
      />

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1fr_280px]">
        {/* Left: form */}
        <ProductEditForm
          product={{
            id: product.id,
            name: product.name,
            imageUrl: product.imageUrl,
            mockupImageUrl: product.mockupImageUrl,
            productDna: product.productDna,
            status: product.status,
          }}
          canUpdateDna={canUpdateDna}
          canUpdate={canUpdate}
          canUploadMockup={canUploadMockup}
        />

        {/* Right: read-only metadata */}
        <div className="flex flex-col gap-4">
          <InfoPanel title="Thông tin nguồn">
            <dl className="flex flex-col gap-2.5 text-[13px]">
              <div className="flex justify-between gap-2">
                <dt className="shrink-0 text-slate-400">Nguồn</dt>
                <dd>
                  <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[11px] font-semibold text-slate-600">
                    {product.urlSuffix}
                  </span>
                </dd>
              </div>
              {product.externalGroupName && (
                <div className="flex justify-between gap-2">
                  <dt className="shrink-0 text-slate-400">Nhóm</dt>
                  <dd className="text-right text-[11px] text-slate-700">{product.externalGroupName}</dd>
                </div>
              )}
              <div className="flex justify-between gap-2">
                <dt className="shrink-0 text-slate-400">Link ID</dt>
                <dd className="break-all font-mono text-[11px] text-slate-600">{product.externalLinkId}</dd>
              </div>
              {product.externalItemId && (
                <div className="flex justify-between gap-2">
                  <dt className="shrink-0 text-slate-400">Item ID</dt>
                  <dd className="break-all font-mono text-[11px] text-slate-600">{product.externalItemId}</dd>
                </div>
              )}
              {product.externalGroupId && (
                <div className="flex justify-between gap-2">
                  <dt className="shrink-0 text-slate-400">Group ID</dt>
                  <dd className="break-all font-mono text-[11px] text-slate-600">{product.externalGroupId}</dd>
                </div>
              )}
            </dl>
          </InfoPanel>

          <InfoPanel title="Liên kết">
            <dl className="flex flex-col gap-3 text-[13px]">
              <div className="flex flex-col gap-1">
                <dt className="text-slate-400">URL Affiliate</dt>
                <dd>
                  {product.affiliateUrl ? (
                    <a
                      href={product.affiliateUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="break-all text-[11px] text-sky-500 hover:underline"
                    >
                      {product.affiliateUrl}
                    </a>
                  ) : (
                    <span className="text-[11px] text-slate-300">—</span>
                  )}
                </dd>
              </div>
              {product.h5Link && (
                <div className="flex flex-col gap-1">
                  <dt className="text-slate-400">H5 / Deep Link</dt>
                  <dd>
                    <a
                      href={product.h5Link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="break-all text-[11px] text-sky-500 hover:underline"
                    >
                      {product.h5Link}
                    </a>
                  </dd>
                </div>
              )}
            </dl>
          </InfoPanel>

          <InfoPanel title="Dữ liệu thô">
            <RawJsonViewer productId={product.id} />
          </InfoPanel>

          <InfoPanel title="Thời gian">
            <dl className="flex flex-col gap-2.5 text-[13px]">
              <div className="flex justify-between gap-2">
                <dt className="text-slate-400">Đồng bộ lần cuối</dt>
                <dd className="text-[11px] text-slate-600">{formatDate(product.lastSyncedAt)}</dd>
              </div>
              <div className="flex justify-between gap-2">
                <dt className="text-slate-400">Ngày tạo</dt>
                <dd className="text-[11px] text-slate-600">{formatDate(product.createdAt)}</dd>
              </div>
              <div className="flex justify-between gap-2">
                <dt className="text-slate-400">Cập nhật</dt>
                <dd className="text-[11px] text-slate-600">{formatDate(product.updatedAt)}</dd>
              </div>
            </dl>
          </InfoPanel>
        </div>
      </div>
    </main>
  );
}
