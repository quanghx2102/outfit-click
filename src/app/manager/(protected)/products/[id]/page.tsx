import Link from 'next/link';
import { notFound } from 'next/navigation';
import { requireAuth } from '@/lib/require-auth';
import { getUserPermissions } from '@/lib/permissions';
import { getProductById } from '@/server/products/product.service';
import { PERMISSIONS } from '@/constants/permissions';
import { MANAGER_ROUTES } from '@/constants/routes';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import PageHeader from '@/components/manager/PageHeader';
import StatusBadge from '@/components/manager/StatusBadge';
import ProductEditForm from '@/components/manager/ProductEditForm';
import type { DataScope } from '@/lib/permissions';

type Props = { params: Promise<{ id: string }> };

function formatDate(date: Date | null): string {
  if (!date) return '—';
  return new Intl.DateTimeFormat('vi-VN', { dateStyle: 'short', timeStyle: 'short' }).format(
    new Date(date),
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
        <p className="text-sm text-slate-500">You do not have permission to view this product.</p>
      </main>
    );
  }

  const product = await getProductById(id, scope, user.id);
  if (!product) notFound();

  const canUpdateDna = permissions.includes(PERMISSIONS.PRODUCTS_UPDATE_DNA);
  const canUpdate = permissions.includes(PERMISSIONS.PRODUCTS_UPDATE);
  const canUploadMockup = permissions.includes(PERMISSIONS.PRODUCTS_UPLOAD_MOCKUP);

  return (
    <main className="flex flex-col gap-6 p-6 lg:p-8">
      {/* Back nav */}
      <Link
        href={MANAGER_ROUTES.PRODUCTS}
        className="w-fit text-sm text-slate-500 hover:text-slate-900 hover:underline"
      >
        ← Back to Products
      </Link>

      {/* Header with status indicators */}
      <PageHeader
        title={product.name}
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <StatusBadge status={product.status} />
            {product.productDna ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-medium text-emerald-700">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                DNA
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-500">
                <span className="h-1.5 w-1.5 rounded-full bg-slate-300" />
                No DNA
              </span>
            )}
            {product.mockupImageUrl ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-sky-100 px-2.5 py-0.5 text-xs font-medium text-sky-700">
                <span className="h-1.5 w-1.5 rounded-full bg-sky-500" />
                Mockup
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-500">
                <span className="h-1.5 w-1.5 rounded-full bg-slate-300" />
                No Mockup
              </span>
            )}
          </div>
        }
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_300px]">
        {/* Left: editable form */}
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
          <Card>
            <CardHeader>
              <CardTitle>Source Info</CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="flex flex-col gap-2 text-sm">
                <div className="flex justify-between gap-2">
                  <dt className="shrink-0 text-muted-foreground">Source</dt>
                  <dd>
                    <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-700">
                      {product.urlSuffix}
                    </span>
                  </dd>
                </div>
                {product.externalGroupName && (
                  <div className="flex justify-between gap-2">
                    <dt className="shrink-0 text-muted-foreground">Group</dt>
                    <dd className="text-right text-xs">{product.externalGroupName}</dd>
                  </div>
                )}
                <div className="flex justify-between gap-2">
                  <dt className="shrink-0 text-muted-foreground">Link ID</dt>
                  <dd className="break-all font-mono text-xs">{product.externalLinkId}</dd>
                </div>
                {product.externalItemId && (
                  <div className="flex justify-between gap-2">
                    <dt className="shrink-0 text-muted-foreground">Item ID</dt>
                    <dd className="break-all font-mono text-xs">{product.externalItemId}</dd>
                  </div>
                )}
                {product.externalGroupId && (
                  <div className="flex justify-between gap-2">
                    <dt className="shrink-0 text-muted-foreground">Group ID</dt>
                    <dd className="break-all font-mono text-xs">{product.externalGroupId}</dd>
                  </div>
                )}
              </dl>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Links</CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="flex flex-col gap-3 text-sm">
                <div className="flex flex-col gap-1">
                  <dt className="text-muted-foreground">Affiliate URL</dt>
                  <dd>
                    {product.affiliateUrl ? (
                      <a
                        href={product.affiliateUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="break-all text-xs text-blue-600 hover:underline"
                      >
                        {product.affiliateUrl}
                      </a>
                    ) : (
                      <span className="text-xs text-muted-foreground">—</span>
                    )}
                  </dd>
                </div>
                {product.h5Link && (
                  <div className="flex flex-col gap-1">
                    <dt className="text-muted-foreground">H5 / Deep Link</dt>
                    <dd>
                      <a
                        href={product.h5Link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="break-all text-xs text-blue-600 hover:underline"
                      >
                        {product.h5Link}
                      </a>
                    </dd>
                  </div>
                )}
              </dl>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Timestamps</CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="flex flex-col gap-2 text-sm">
                <div className="flex justify-between gap-2">
                  <dt className="text-muted-foreground">Last Synced</dt>
                  <dd className="text-xs">{formatDate(product.lastSyncedAt)}</dd>
                </div>
                <div className="flex justify-between gap-2">
                  <dt className="text-muted-foreground">Created</dt>
                  <dd className="text-xs">{formatDate(product.createdAt)}</dd>
                </div>
                <div className="flex justify-between gap-2">
                  <dt className="text-muted-foreground">Updated</dt>
                  <dd className="text-xs">{formatDate(product.updatedAt)}</dd>
                </div>
              </dl>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
