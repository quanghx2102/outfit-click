import Link from 'next/link';
import { notFound } from 'next/navigation';
import { requireAuth } from '@/lib/require-auth';
import { getUserPermissions } from '@/lib/permissions';
import {
  getOutfitById,
  getOutfitProducts,
  getDistinctStyles,
  getDistinctOutfitTypes,
} from '@/server/outfits/outfit.service';
import { PERMISSIONS } from '@/constants/permissions';
import { MANAGER_ROUTES } from '@/constants/routes';
import PageHeader from '@/components/manager/PageHeader';
import StatusBadge from '@/components/manager/StatusBadge';
import OutfitForm from '@/components/manager/OutfitForm';
import ProductPicker from '@/components/manager/ProductPicker';
import type { DataScope } from '@/lib/permissions';

type Props = { params: Promise<{ id: string }> };

function formatDate(date: Date | null): string {
  if (!date) return '—';
  return new Intl.DateTimeFormat('vi-VN', { dateStyle: 'short', timeStyle: 'short' }).format(
    new Date(date),
  );
}

export default async function ManagerOutfitEditPage({ params }: Props) {
  const [user, { id }] = await Promise.all([requireAuth(), params]);
  const [permissions, styleOptions, outfitTypeOptions] = await Promise.all([
    getUserPermissions(user.id),
    getDistinctStyles(),
    getDistinctOutfitTypes(),
  ]);

  const scope: DataScope = permissions.includes(PERMISSIONS.OUTFITS_VIEW_ALL)
    ? 'all'
    : permissions.includes(PERMISSIONS.OUTFITS_VIEW_OWN)
      ? 'own'
      : 'none';

  if (scope === 'none') {
    return (
      <div className="p-6 lg:p-8">
        <p className="text-sm text-slate-500">You do not have permission to view this outfit.</p>
      </div>
    );
  }

  const [outfit, outfitProducts] = await Promise.all([
    getOutfitById(id, scope, user.id),
    getOutfitProducts(id),
  ]);
  if (!outfit) notFound();

  const canUpdate = permissions.includes(PERMISSIONS.OUTFITS_UPDATE);
  const canPublish = permissions.includes(PERMISSIONS.OUTFITS_PUBLISH);
  const canHide = permissions.includes(PERMISSIONS.OUTFITS_HIDE);
  const canAddProduct = permissions.includes(PERMISSIONS.OUTFITS_ADD_PRODUCT);
  const canRemoveProduct = permissions.includes(PERMISSIONS.OUTFITS_REMOVE_PRODUCT);

  const serializedProducts = outfitProducts.map((p) => ({
    ...p,
    addedAt: p.addedAt.toISOString(),
  }));

  return (
    <div className="flex flex-col gap-6 p-6 lg:p-8">
      <div>
        <Link
          href={MANAGER_ROUTES.OUTFITS}
          className="mb-3 inline-flex text-sm text-slate-500 transition-colors hover:text-slate-900"
        >
          ← Back to Outfits
        </Link>
        <PageHeader
          title={outfit.name}
          actions={
            <div className="flex items-center gap-2">
              <StatusBadge status={outfit.status} />
              <span className="font-mono text-sm text-slate-500">{outfit.outfitCode}</span>
            </div>
          }
        />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_280px]">
        {/* Left: editable form */}
        <OutfitForm
          mode="edit"
          initialData={{
            id: outfit.id,
            outfitCode: outfit.outfitCode,
            name: outfit.name,
            slug: outfit.slug,
            description: outfit.description,
            coverImageUrl: outfit.coverImageUrl,
            styleId: outfit.styleId,
            outfitTypeId: outfit.outfitTypeId,
            status: outfit.status,
          }}
          outfitId={outfit.id}
          styleOptions={styleOptions}
          outfitTypeOptions={outfitTypeOptions}
          canUpdate={canUpdate}
          canPublish={canPublish}
          canHide={canHide}
        />

        {/* Right: read-only metadata */}
        <div className="flex flex-col gap-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-4">
            <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
              Outfit Info
            </p>
            <dl className="flex flex-col gap-2 text-sm">
              <div className="flex justify-between gap-2">
                <dt className="text-slate-500">Code</dt>
                <dd>
                  <span className="font-mono text-slate-900">{outfit.outfitCode}</span>
                </dd>
              </div>
              <div className="flex justify-between gap-2">
                <dt className="text-slate-500">Slug</dt>
                <dd className="break-all text-xs text-slate-700">{outfit.slug}</dd>
              </div>
              {outfit.style && (
                <div className="flex justify-between gap-2">
                  <dt className="text-slate-500">Style</dt>
                  <dd>
                    <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-700">
                      {outfit.style.name}
                    </span>
                  </dd>
                </div>
              )}
              {outfit.outfitType && (
                <div className="flex justify-between gap-2">
                  <dt className="text-slate-500">Type</dt>
                  <dd>
                    <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-700">
                      {outfit.outfitType.name}
                    </span>
                  </dd>
                </div>
              )}
            </dl>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-4">
            <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
              Timestamps
            </p>
            <dl className="flex flex-col gap-2 text-sm">
              {outfit.publishedAt && (
                <div className="flex justify-between gap-2">
                  <dt className="text-slate-500">Published</dt>
                  <dd className="text-xs text-slate-700">{formatDate(outfit.publishedAt)}</dd>
                </div>
              )}
              <div className="flex justify-between gap-2">
                <dt className="text-slate-500">Created</dt>
                <dd className="text-xs text-slate-700">{formatDate(outfit.createdAt)}</dd>
              </div>
              <div className="flex justify-between gap-2">
                <dt className="text-slate-500">Updated</dt>
                <dd className="text-xs text-slate-700">{formatDate(outfit.updatedAt)}</dd>
              </div>
            </dl>
          </div>
        </div>
      </div>

      {/* Products section */}
      <ProductPicker
        outfitId={outfit.id}
        initialProducts={serializedProducts}
        canAdd={canAddProduct}
        canRemove={canRemoveProduct}
      />
    </div>
  );
}
