import { Suspense } from 'react';
import { requireAuth } from '@/lib/require-auth';
import { hasPermission } from '@/lib/permissions';
import { PERMISSIONS } from '@/constants/permissions';
import { listUsers } from '@/server/users/user.service';
import { listRolesWithPermissions } from '@/server/roles/role.service';
import PageHeader from '@/components/manager/PageHeader';
import StatusBadge from '@/components/manager/StatusBadge';
import EmptyState from '@/components/manager/EmptyState';
import UserFormDialog from '@/components/manager/UserFormDialog';
import { ResetPasswordButton, ToggleUserStatusButton } from '@/components/manager/UserActions';
import { UserPlus } from 'lucide-react';

function formatDate(d: Date | null): string {
  if (!d) return '—';
  return d.toISOString().replace('T', ' ').slice(0, 16);
}

function UserAvatar({ name, avatarUrl }: { name: string; avatarUrl: string | null }) {
  const initials = name
    .split(' ')
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  if (avatarUrl) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={avatarUrl} alt="" className="h-9 w-9 rounded-full object-cover" />;
  }
  return (
    <div
      className="flex h-9 w-9 items-center justify-center rounded-full text-[12px] font-bold text-white"
      style={{ background: '#374151' }}
    >
      {initials}
    </div>
  );
}

export default async function ManagerUsersPage() {
  const user = await requireAuth();

  const [canView, canCreate, canUpdate] = await Promise.all([
    hasPermission(user.id, PERMISSIONS.USERS_VIEW),
    hasPermission(user.id, PERMISSIONS.USERS_CREATE),
    hasPermission(user.id, PERMISSIONS.USERS_UPDATE),
  ]);

  if (!canView) {
    return (
      <div className="p-8">
        <PageHeader title="Nhân sự" />
        <p className="text-sm" style={{ color: '#6B7280' }}>Bạn không có quyền xem danh sách nhân sự.</p>
      </div>
    );
  }

  const [users, allRoles] = await Promise.all([
    listUsers(),
    listRolesWithPermissions(),
  ]);

  const roleOptions = allRoles.map((r) => ({ id: r.id, name: r.name, code: r.code }));

  const addStaffAction = canCreate ? (
    <Suspense>
      <UserFormDialog
        mode="create"
        allRoles={roleOptions}
        trigger={
          <button
            className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-85"
            style={{ background: '#9A7654' }}
          >
            <UserPlus size={15} />
            Thêm nhân viên
          </button>
        }
      />
    </Suspense>
  ) : null;

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Nhân sự"
        description="Quản lý tài khoản nhân viên và quyền truy cập."
        actions={addStaffAction}
      />

      {users.length === 0 ? (
        <EmptyState
          title="Chưa có nhân sự"
          description="Chưa có tài khoản nhân viên nào được tạo."
          action={addStaffAction}
        />
      ) : (
        <div
          className="overflow-hidden rounded-2xl border"
          style={{ borderColor: '#E5E7EB', background: '#FFFFFF' }}
        >
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr style={{ background: '#F9FAFB', borderBottom: '1px solid #E5E7EB' }}>
                  {['Nhân sự', 'Vai trò', 'Trạng thái', 'Đăng nhập lần cuối', 'Ngày tạo', ...(canUpdate ? ['Thao tác'] : [])].map((h) => (
                    <th
                      key={h}
                      className="px-5 py-3 text-left text-[10px] font-bold uppercase"
                      style={{ letterSpacing: '0.1em', color: '#6B7280' }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {users.map((u, idx) => (
                  <tr
                    key={u.id}
                    className="transition-colors hover:bg-gray-50/60"
                    style={{ borderTop: idx === 0 ? 'none' : '1px solid #F3F4F6' }}
                  >
                    {/* User */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <UserAvatar name={u.name} avatarUrl={u.avatarUrl} />
                        <div className="min-w-0">
                          <p className="text-[13px] font-semibold" style={{ color: '#111827' }}>{u.name}</p>
                          <p className="text-[11px]" style={{ color: '#9CA3AF' }}>{u.email}</p>
                        </div>
                      </div>
                    </td>

                    {/* Roles */}
                    <td className="px-5 py-4">
                      {u.roles.length === 0 ? (
                        <span style={{ color: '#D1D5DB', fontSize: '12px' }}>—</span>
                      ) : (
                        <div className="flex flex-wrap gap-1">
                          {u.roles.map((r) => (
                            <span
                              key={r.id}
                              className="inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-medium"
                              style={{ background: '#F3F4F6', color: '#374151' }}
                            >
                              {r.name}
                            </span>
                          ))}
                        </div>
                      )}
                    </td>

                    {/* Status */}
                    <td className="whitespace-nowrap px-5 py-4">
                      <StatusBadge status={u.status} />
                    </td>

                    {/* Last Login */}
                    <td className="whitespace-nowrap px-5 py-4 font-mono text-[11px]" style={{ color: '#9CA3AF' }}>
                      {formatDate(u.lastLoginAt)}
                    </td>

                    {/* Created */}
                    <td className="whitespace-nowrap px-5 py-4 font-mono text-[11px]" style={{ color: '#9CA3AF' }}>
                      {formatDate(u.createdAt)}
                    </td>

                    {/* Actions */}
                    {canUpdate && (
                      <td className="px-5 py-4">
                        <div className="flex flex-wrap items-center gap-2">
                          <Suspense>
                            <UserFormDialog
                              mode="edit"
                              user={{ id: u.id, name: u.name, email: u.email, roles: u.roles }}
                              allRoles={roleOptions}
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
                          <ToggleUserStatusButton userId={u.id} currentStatus={u.status} />
                          <ResetPasswordButton userId={u.id} />
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
