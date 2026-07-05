'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';

type Role = { id: string; name: string; code: string };
type UserForEdit = {
  id: string;
  name: string;
  email: string;
  roles: Role[];
};

interface Props {
  mode: 'create' | 'edit';
  user?: UserForEdit;
  allRoles: Role[];
  trigger: React.ReactNode;
}

export default function UserFormDialog({ mode, user, allRoles, trigger }: Props) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const [name, setName] = useState(user?.name ?? '');
  const [email, setEmail] = useState(user?.email ?? '');
  const [password, setPassword] = useState('');
  const [selectedRoles, setSelectedRoles] = useState<string[]>(
    user?.roles.map((r) => r.id) ?? [],
  );
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  function toggleRole(id: string) {
    setSelectedRoles((prev) =>
      prev.includes(id) ? prev.filter((r) => r !== id) : [...prev, id],
    );
  }

  function handleOpen() {
    setName(user?.name ?? '');
    setEmail(user?.email ?? '');
    setPassword('');
    setSelectedRoles(user?.roles.map((r) => r.id) ?? []);
    setError(null);
    setSuccess(false);
    setOpen(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    startTransition(async () => {
      try {
        let res: Response;

        if (mode === 'create') {
          res = await fetch('/api/manager/users', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password, roleIds: selectedRoles }),
          });

          if (!res.ok) {
            const data = (await res.json()) as { error?: string };
            setError(data.error ?? 'Tạo tài khoản thất bại');
            return;
          }

          const created = (await res.json()) as { user: { id: string } };

          // Roles were already set at creation time
          void created;
        } else if (mode === 'edit' && user) {
          res = await fetch(`/api/manager/users/${user.id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email }),
          });

          if (!res.ok) {
            const data = (await res.json()) as { error?: string };
            setError(data.error ?? 'Cập nhật thất bại');
            return;
          }

          // Assign roles separately
          const rolesRes = await fetch(`/api/manager/users/${user.id}/roles`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ roleIds: selectedRoles }),
          });

          if (!rolesRes.ok) {
            const data = (await rolesRes.json()) as { error?: string };
            setError(data.error ?? 'Gán vai trò thất bại');
            return;
          }
        }

        setSuccess(true);
        router.refresh();
        setTimeout(() => setOpen(false), 800);
      } catch {
        setError('Lỗi mạng. Vui lòng thử lại.');
      }
    });
  }

  return (
    <>
      <span onClick={handleOpen} style={{ cursor: 'pointer' }}>
        {trigger}
      </span>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white shadow-xl">
            <div className="border-b border-slate-100 px-6 py-4">
              <h2 className="text-sm font-semibold text-slate-900">
                {mode === 'create' ? 'Thêm nhân viên' : 'Chỉnh sửa nhân sự'}
              </h2>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4 px-6 py-5">
              <div className="flex flex-col gap-1">
                <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                  Họ tên
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-900 outline-none focus:border-slate-950 focus:ring-1 focus:ring-slate-950"
                  placeholder="Họ và tên"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-900 outline-none focus:border-slate-950 focus:ring-1 focus:ring-slate-950"
                  placeholder="email@example.com"
                />
              </div>

              {mode === 'create' && (
                <div className="flex flex-col gap-1">
                  <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                    Mật khẩu
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={8}
                    className="rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-900 outline-none focus:border-slate-950 focus:ring-1 focus:ring-slate-950"
                    placeholder="Tối thiểu 8 ký tự"
                  />
                </div>
              )}

              <div className="flex flex-col gap-2">
                <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                  Vai trò
                </label>
                <div className="flex flex-wrap gap-2">
                  {allRoles.map((role) => {
                    const checked = selectedRoles.includes(role.id);
                    return (
                      <button
                        key={role.id}
                        type="button"
                        onClick={() => toggleRole(role.id)}
                        className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
                          checked
                            ? 'border-slate-950 bg-slate-950 text-white'
                            : 'border-slate-200 bg-white text-slate-600 hover:border-slate-400'
                        }`}
                      >
                        {role.name}
                      </button>
                    );
                  })}
                  {allRoles.length === 0 && (
                    <p className="text-xs text-slate-400">Chưa có vai trò nào. Hãy tạo vai trò trước.</p>
                  )}
                </div>
              </div>

              {error && (
                <p className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>
              )}
              {success && (
                <p className="rounded-xl bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
                  {mode === 'create' ? 'Đã tạo tài khoản!' : 'Đã cập nhật!'}
                </p>
              )}

              <div className="flex justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  disabled={isPending}
                  className="rounded-xl border border-slate-200 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 disabled:opacity-50"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="rounded-xl bg-slate-950 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-50"
                >
                  {isPending
                    ? 'Đang lưu…'
                    : mode === 'create'
                      ? 'Tạo tài khoản'
                      : 'Lưu thay đổi'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
