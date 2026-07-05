import { Suspense } from 'react';
import { requireAuth } from '@/lib/require-auth';
import { hasPermission } from '@/lib/permissions';
import { PERMISSIONS } from '@/constants/permissions';
import { listRolesWithPermissions, listAllPermissions } from '@/server/roles/role.service';
import PageHeader from '@/components/manager/PageHeader';
import StatusBadge from '@/components/manager/StatusBadge';
import EmptyState from '@/components/manager/EmptyState';
import RoleFormDialog from '@/components/manager/RoleFormDialog';
import { ShieldCheck } from 'lucide-react';

const MODULE_LABELS: Record<string, string> = {
  dashboard: 'Tổng quan',
  users: 'Nhân sự',
  roles: 'Vai trò',
  products: 'Sản phẩm',
  outfits: 'Outfit',
  taxonomy: 'Phong cách & Loại',
  analytics: 'Phân tích',
  media: 'Media',
  sync: 'Đồng bộ',
  settings: 'Cài đặt',
};

const MODULE_ORDER = ['dashboard', 'products', 'outfits', 'taxonomy', 'analytics', 'sync', 'media', 'users', 'roles', 'settings'];

function groupByModule(
  permissions: { id: string; name: string; code: string; module: string }[],
): Map<string, { id: string; name: string; code: string }[]> {
  const map = new Map<string, { id: string; name: string; code: string }[]>();
  for (const p of permissions) {
    const list = map.get(p.module) ?? [];
    list.push({ id: p.id, name: p.name, code: p.code });
    map.set(p.module, list);
  }
  return map;
}

function sortModules(keys: string[]): string[] {
  return [...keys].sort((a, b) => {
    const ai = MODULE_ORDER.indexOf(a);
    const bi = MODULE_ORDER.indexOf(b);
    if (ai === -1 && bi === -1) return (MODULE_LABELS[a] ?? a).localeCompare(MODULE_LABELS[b] ?? b);
    if (ai === -1) return 1;
    if (bi === -1) return -1;
    return ai - bi;
  });
}

export default async function ManagerRolesPage() {
  const user = await requireAuth();

  const [canView, canManage] = await Promise.all([
    hasPermission(user.id, PERMISSIONS.ROLES_VIEW),
    hasPermission(user.id, PERMISSIONS.ROLES_MANAGE),
  ]);

  if (!canView) {
    return (
      <div className="p-8">
        <PageHeader title="Vai trò & Quyền" />
        <p className="text-sm" style={{ color: '#6B7280' }}>Bạn không có quyền xem vai trò.</p>
      </div>
    );
  }

  const [roles, allPermissions] = await Promise.all([
    listRolesWithPermissions(),
    listAllPermissions(),
  ]);

  const createRoleAction = canManage ? (
    <Suspense>
      <RoleFormDialog
        mode="create"
        allPermissions={allPermissions}
        trigger={
          <button
            className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-85"
            style={{ background: '#9A7654' }}
          >
            <ShieldCheck size={15} />
            Tạo vai trò
          </button>
        }
      />
    </Suspense>
  ) : null;

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Vai trò & Quyền"
        description="Quản lý vai trò và phân quyền."
        actions={createRoleAction}
      />

      {roles.length === 0 ? (
        <EmptyState title="Chưa có vai trò" description="Chưa có vai trò nào được tạo." action={createRoleAction} />
      ) : (
        <div className="flex flex-col gap-4">
          {roles.map((role) => {
            const grouped = groupByModule(role.permissions);
            const modules = sortModules(Array.from(grouped.keys()));
            const isSystemRole = role.code === 'admin';
            const totalPermCount = role.permissions.length;

            return (
              <div
                key={role.id}
                className="overflow-hidden rounded-2xl border"
                style={{ borderColor: '#E5E7EB', background: '#FFFFFF' }}
              >
                {/* Role header */}
                <div
                  className="flex items-start justify-between gap-4 px-6 py-5"
                  style={{ borderBottom: '1px solid #F3F4F6' }}
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="text-[15px] font-bold" style={{ color: '#111827' }}>{role.name}</h2>
                      <StatusBadge status={role.status} />
                      {isSystemRole && (
                        <span
                          className="inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold uppercase"
                          style={{ background: '#FEF3C7', color: '#92400E', letterSpacing: '0.1em' }}
                        >
                          Hệ thống
                        </span>
                      )}
                    </div>
                    <p className="mt-0.5 font-mono text-xs" style={{ color: '#9CA3AF' }}>{role.code}</p>
                    {role.description && (
                      <p className="mt-1 text-[13px]" style={{ color: '#6B7280' }}>{role.description}</p>
                    )}
                    <p className="mt-2 text-[11px]" style={{ color: '#9CA3AF' }}>
                      {modules.length} module · {totalPermCount} quyền
                    </p>
                  </div>

                  <div className="flex shrink-0 items-start gap-4">
                    {/* User count badge */}
                    <div className="text-right">
                      <p className="text-2xl font-bold" style={{ color: '#111827' }}>{role.userCount}</p>
                      <p className="text-xs" style={{ color: '#9CA3AF' }}>nhân sự</p>
                    </div>

                    {canManage && (
                      <Suspense>
                        <RoleFormDialog
                          mode="edit"
                          role={{
                            id: role.id,
                            name: role.name,
                            code: role.code,
                            description: role.description,
                            permissions: role.permissions,
                          }}
                          allPermissions={allPermissions}
                          trigger={
                            <button
                              className="rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors hover:bg-gray-50"
                              style={{ borderColor: '#E5E7EB', color: '#374151' }}
                            >
                              Sửa
                            </button>
                          }
                        />
                      </Suspense>
                    )}
                  </div>
                </div>

                {/* Permissions grouped by module */}
                {role.permissions.length === 0 ? (
                  <p className="px-6 py-4 text-sm" style={{ color: '#9CA3AF' }}>Chưa có quyền nào được gán.</p>
                ) : (
                  <div className="divide-y px-6 py-4" style={{ '--tw-divide-opacity': 1 } as React.CSSProperties}>
                    {modules.map((mod) => {
                      const perms = grouped.get(mod) ?? [];
                      return (
                        <div key={mod} className="flex gap-5 py-3 first:pt-0 last:pb-0">
                          {/* Module label */}
                          <div className="flex w-24 shrink-0 items-start gap-1.5 pt-0.5">
                            <span
                              className="text-[11px] font-bold uppercase"
                              style={{ letterSpacing: '0.1em', color: '#6B7280' }}
                            >
                              {MODULE_LABELS[mod] ?? mod}
                            </span>
                            <span
                              className="ml-1 rounded-full px-1.5 py-0.5 text-[10px] font-semibold"
                              style={{ background: '#F3F4F6', color: '#6B7280' }}
                            >
                              {perms.length}/{(allPermissions.filter(p => p.module === mod)).length}
                            </span>
                          </div>

                          {/* Permission chips */}
                          <div className="flex flex-wrap gap-1.5">
                            {perms.map((p) => (
                              <span
                                key={p.id}
                                className="inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-medium"
                                style={{ background: '#EFF6FF', color: '#1D4ED8' }}
                                title={p.code}
                              >
                                {p.name}
                              </span>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
