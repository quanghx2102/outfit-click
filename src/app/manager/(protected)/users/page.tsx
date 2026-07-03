import { requireAuth } from '@/lib/require-auth';
import { hasPermission } from '@/lib/permissions';
import { PERMISSIONS } from '@/constants/permissions';
import { listUsers } from '@/server/users/user.service';
import PageHeader from '@/components/manager/PageHeader';
import StatusBadge from '@/components/manager/StatusBadge';
import EmptyState from '@/components/manager/EmptyState';

function formatDate(d: Date | null): string {
  if (!d) return '—';
  return d.toISOString().replace('T', ' ').slice(0, 16) + ' UTC';
}

function UserAvatar({ name, avatarUrl }: { name: string; avatarUrl: string | null }) {
  if (avatarUrl) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={avatarUrl} alt="" className="h-8 w-8 rounded-full object-cover" />;
  }
  const initials = name
    .split(' ')
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
  return (
    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-200 text-xs font-semibold text-slate-600">
      {initials}
    </div>
  );
}

export default async function ManagerUsersPage() {
  const user = await requireAuth();
  const canView = await hasPermission(user.id, PERMISSIONS.USERS_VIEW);

  if (!canView) {
    return (
      <main className="p-6">
        <PageHeader title="Users" />
        <p className="text-sm text-slate-500">You do not have permission to view users.</p>
      </main>
    );
  }

  const users = await listUsers();

  return (
    <main className="flex flex-col gap-6 p-6">
      <PageHeader
        title="Users"
        description={`${users.length} user${users.length !== 1 ? 's' : ''} total`}
      />

      {users.length === 0 ? (
        <EmptyState title="No users found" description="No users have been created yet." />
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">
                <th className="px-5 py-3">User</th>
                <th className="px-5 py-3">Roles</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3">Last Login</th>
                <th className="px-5 py-3">Created</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-slate-50">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <UserAvatar name={u.name} avatarUrl={u.avatarUrl} />
                      <div className="min-w-0">
                        <p className="font-medium text-slate-900">{u.name}</p>
                        <p className="text-xs text-slate-400">{u.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3">
                    {u.roles.length === 0 ? (
                      <span className="text-xs text-slate-400">—</span>
                    ) : (
                      <div className="flex flex-wrap gap-1">
                        {u.roles.map((r) => (
                          <span
                            key={r.id}
                            className="inline-flex items-center rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600"
                          >
                            {r.name}
                          </span>
                        ))}
                      </div>
                    )}
                  </td>
                  <td className="whitespace-nowrap px-5 py-3">
                    <StatusBadge status={u.status} />
                  </td>
                  <td className="whitespace-nowrap px-5 py-3 font-mono text-xs text-slate-400">
                    {formatDate(u.lastLoginAt)}
                  </td>
                  <td className="whitespace-nowrap px-5 py-3 font-mono text-xs text-slate-400">
                    {formatDate(u.createdAt)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}
