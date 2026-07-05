import { requireAuth } from '@/lib/require-auth';
import { hasPermission } from '@/lib/permissions';
import { PERMISSIONS } from '@/constants/permissions';
import { listTaxonomy } from '@/server/taxonomy/taxonomy.service';
import PageHeader from '@/components/manager/PageHeader';
import StatusBadge from '@/components/manager/StatusBadge';
import EmptyState from '@/components/manager/EmptyState';
import TaxonomyFormDialog from '@/components/manager/TaxonomyFormDialog';
import { ToggleTaxonomyStatusButton, DeleteTaxonomyButton } from '@/components/manager/TaxonomyActions';

function TaxonomySection({
  title,
  kind,
  items,
  canManage,
}: {
  title: string;
  kind: 'style' | 'outfitType';
  items: Awaited<ReturnType<typeof listTaxonomy>>;
  canManage: boolean;
}) {
  const createTrigger = canManage ? (
    <TaxonomyFormDialog
      mode="create"
      kind={kind}
      trigger={
        <button className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-50">
          + Thêm
        </button>
      }
    />
  ) : null;

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
      <div className="flex items-center justify-between gap-4 border-b border-slate-100 px-6 py-4">
        <h2 className="text-[15px] font-bold text-slate-900">{title}</h2>
        {createTrigger}
      </div>

      {items.length === 0 ? (
        <EmptyState title="Chưa có mục nào" description="Hãy thêm mục đầu tiên." className="rounded-none border-0" />
      ) : (
        <div className="divide-y divide-slate-100">
          {items.map((item) => (
            <div key={item.id} className="flex items-center justify-between gap-4 px-6 py-3">
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[13px] font-medium text-slate-900">{item.name}</span>
                  <StatusBadge status={item.status} />
                </div>
                <p className="mt-0.5 font-mono text-[11px] text-slate-400">{item.slug}</p>
              </div>
              <div className="flex shrink-0 items-center gap-3">
                <span className="text-[11px] text-slate-400">{item.outfitCount} outfit</span>
                {canManage && (
                  <>
                    <TaxonomyFormDialog
                      mode="edit"
                      kind={kind}
                      item={{ id: item.id, name: item.name, slug: item.slug }}
                      trigger={
                        <button className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 transition-colors hover:bg-slate-50">
                          Sửa
                        </button>
                      }
                    />
                    <ToggleTaxonomyStatusButton kind={kind} id={item.id} status={item.status} />
                    <DeleteTaxonomyButton kind={kind} id={item.id} outfitCount={item.outfitCount} />
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default async function ManagerTaxonomyPage() {
  const user = await requireAuth();

  const [canView, canManage] = await Promise.all([
    hasPermission(user.id, PERMISSIONS.TAXONOMY_VIEW),
    hasPermission(user.id, PERMISSIONS.TAXONOMY_MANAGE),
  ]);

  if (!canView) {
    return (
      <div className="p-6 lg:p-8">
        <PageHeader title="Phong cách & Loại Outfit" />
        <p className="text-sm text-slate-500">Bạn không có quyền xem mục này.</p>
      </div>
    );
  }

  const [styles, outfitTypes] = await Promise.all([
    listTaxonomy('style'),
    listTaxonomy('outfitType'),
  ]);

  return (
    <div className="flex flex-col gap-6 p-6 lg:p-8">
      <PageHeader
        title="Phong cách & Loại Outfit"
        description="Quản lý danh mục phong cách và loại outfit dùng để phân loại khi tạo outfit."
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <TaxonomySection
          title="Phong cách"
          kind="style"
          items={styles}
          canManage={canManage}
        />
        <TaxonomySection
          title="Loại Outfit"
          kind="outfitType"
          items={outfitTypes}
          canManage={canManage}
        />
      </div>
    </div>
  );
}
