import { requireAuth } from '@/lib/require-auth';
import { hasPermission } from '@/lib/permissions';
import { PERMISSIONS } from '@/constants/permissions';
import { listRolesWithPermissions } from '@/server/roles/role.service';
import PageHeader from '@/components/manager/PageHeader';
import StatusBadge from '@/components/manager/StatusBadge';
import EmptyState from '@/components/manager/EmptyState';

// Group permissions by module label
const MODULE_LABELS: Record<string, string> = {
  dashboard: 'Dashboard',
  users: 'Users',
  roles: 'Roles',
  products: 'Products',
  outfits: 'Outfits',
  analytics: 'Analytics',
  media: 'Media',
  sync: 'Sync',
  settings: 'Settings',
};

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

export default async function ManagerRolesPage() {
  const user = await requireAuth();
  const canView = await hasPermission(user.id, PERMISSIONS.ROLES_VIEW);

  if (!canView) {
    return (
      <main className="p-6">
        <PageHeader title="Roles & Permissions" />
        <p className="text-sm text-slate-500">You do not have permission to view roles.</p>
      </main>
    );
  }

  const roles = await listRolesWithPermissions();

  return (
    <main className="flex flex-col gap-6 p-6">
      <PageHeader
        title="Roles & Permissions"
        description={`${roles.length} role${roles.length !== 1 ? 's' : ''} defined`}
      />

      {roles.length === 0 ? (
        <EmptyState title="No roles found" description="No roles have been created yet." />
      ) : (
        <div className="flex flex-col gap-4">
          {roles.map((role) => {
            const grouped = groupByModule(role.permissions);
            const modules = Array.from(grouped.keys()).sort(
              (a, b) => (MODULE_LABELS[a] ?? a).localeCompare(MODULE_LABELS[b] ?? b),
            );

            return (
              <div key={role.id} className="rounded-2xl border border-slate-200 bg-white">
                {/* Role header */}
                <div className="flex items-start justify-between gap-4 border-b border-slate-100 px-5 py-4">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h2 className="text-sm font-semibold text-slate-900">{role.name}</h2>
                      <StatusBadge status={role.status} />
                    </div>
                    <p className="mt-0.5 font-mono text-xs text-slate-400">{role.code}</p>
                    {role.description && (
                      <p className="mt-1 text-xs text-slate-500">{role.description}</p>
                    )}
                  </div>
                  <div className="shrink-0 text-right">
                    <p className="text-lg font-bold text-slate-900">{role.userCount}</p>
                    <p className="text-xs text-slate-400">user{role.userCount !== 1 ? 's' : ''}</p>
                  </div>
                </div>

                {/* Permissions grouped by module */}
                {role.permissions.length === 0 ? (
                  <p className="px-5 py-4 text-sm text-slate-400">No permissions assigned.</p>
                ) : (
                  <div className="divide-y divide-slate-50 px-5 py-4">
                    {modules.map((mod) => (
                      <div key={mod} className="flex gap-4 py-3 first:pt-0 last:pb-0">
                        <span className="w-24 shrink-0 pt-0.5 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                          {MODULE_LABELS[mod] ?? mod}
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {(grouped.get(mod) ?? []).map((p) => (
                            <span
                              key={p.id}
                              className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-700"
                              title={p.code}
                            >
                              {p.name}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </main>
  );
}
