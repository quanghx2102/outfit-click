'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';

type Permission = { id: string; name: string; code: string; module: string };
type RoleForEdit = {
  id: string;
  name: string;
  code: string;
  description: string | null;
  permissions: Permission[];
};

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

interface Props {
  mode: 'create' | 'edit';
  role?: RoleForEdit;
  allPermissions: Permission[];
  trigger: React.ReactNode;
}

function groupByModule(perms: Permission[]): Map<string, Permission[]> {
  const map = new Map<string, Permission[]>();
  for (const p of perms) {
    const list = map.get(p.module) ?? [];
    list.push(p);
    map.set(p.module, list);
  }
  return map;
}

export default function RoleFormDialog({ mode, role, allPermissions, trigger }: Props) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const [name, setName] = useState(role?.name ?? '');
  const [code, setCode] = useState(role?.code ?? '');
  const [description, setDescription] = useState(role?.description ?? '');
  const [selectedPerms, setSelectedPerms] = useState<string[]>(
    role?.permissions.map((p) => p.id) ?? [],
  );
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const grouped = groupByModule(allPermissions);
  const modules = Array.from(grouped.keys()).sort(
    (a, b) => (MODULE_LABELS[a] ?? a).localeCompare(MODULE_LABELS[b] ?? b),
  );

  function togglePerm(id: string) {
    setSelectedPerms((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id],
    );
  }

  function toggleModule(mod: string) {
    const modPerms = (grouped.get(mod) ?? []).map((p) => p.id);
    const allSelected = modPerms.every((id) => selectedPerms.includes(id));
    if (allSelected) {
      setSelectedPerms((prev) => prev.filter((id) => !modPerms.includes(id)));
    } else {
      setSelectedPerms((prev) => [...new Set([...prev, ...modPerms])]);
    }
  }

  function handleOpen() {
    setName(role?.name ?? '');
    setCode(role?.code ?? '');
    setDescription(role?.description ?? '');
    setSelectedPerms(role?.permissions.map((p) => p.id) ?? []);
    setError(null);
    setSuccess(false);
    setOpen(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    startTransition(async () => {
      try {
        let roleId: string;

        if (mode === 'create') {
          const res = await fetch('/api/manager/roles', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, code, description: description || undefined, permissionIds: selectedPerms }),
          });

          if (!res.ok) {
            const data = (await res.json()) as { error?: string };
            setError(data.error ?? 'Tạo vai trò thất bại');
            return;
          }

          const created = (await res.json()) as { role: { id: string } };
          roleId = created.role.id;
        } else if (mode === 'edit' && role) {
          const res = await fetch(`/api/manager/roles/${role.id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, description: description || null }),
          });

          if (!res.ok) {
            const data = (await res.json()) as { error?: string };
            setError(data.error ?? 'Cập nhật vai trò thất bại');
            return;
          }

          roleId = role.id;

          // Update permissions
          const permsRes = await fetch(`/api/manager/roles/${roleId}/permissions`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ permissionIds: selectedPerms }),
          });

          if (!permsRes.ok) {
            const data = (await permsRes.json()) as { error?: string };
            setError(data.error ?? 'Cập nhật quyền thất bại');
            return;
          }
        } else {
          return;
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
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/40 p-4 py-8">
          <div className="w-full max-w-2xl rounded-2xl bg-white shadow-xl">
            <div className="border-b border-slate-100 px-6 py-4">
              <h2 className="text-sm font-semibold text-slate-900">
                {mode === 'create' ? 'Tạo vai trò' : 'Chỉnh sửa vai trò'}
              </h2>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-5 px-6 py-5">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="flex flex-col gap-1">
                  <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                    Tên vai trò
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-900 outline-none focus:border-slate-950 focus:ring-1 focus:ring-slate-950"
                    placeholder="VD: Nhân viên sản phẩm"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                    Mã code
                  </label>
                  <input
                    type="text"
                    value={code}
                    onChange={(e) => setCode(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
                    required
                    disabled={mode === 'edit'}
                    className="rounded-xl border border-slate-200 px-3 py-2 font-mono text-sm text-slate-900 outline-none focus:border-slate-950 focus:ring-1 focus:ring-slate-950 disabled:bg-slate-50 disabled:text-slate-400"
                    placeholder="e.g. product_staff"
                  />
                  {mode === 'edit' && (
                    <p className="text-xs text-slate-400">Mã code không thể thay đổi sau khi tạo</p>
                  )}
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                  Mô tả (tuỳ chọn)
                </label>
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-900 outline-none focus:border-slate-950 focus:ring-1 focus:ring-slate-950"
                  placeholder="Mô tả ngắn về vai trò này"
                />
              </div>

              <div className="flex flex-col gap-3">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                  Quyền hạn
                </p>
                <div className="max-h-80 overflow-y-auto rounded-xl border border-slate-200">
                  {modules.map((mod) => {
                    const modPerms = grouped.get(mod) ?? [];
                    const allModSelected = modPerms.every((p) => selectedPerms.includes(p.id));
                    const someModSelected = modPerms.some((p) => selectedPerms.includes(p.id));

                    return (
                      <div key={mod} className="border-b border-slate-100 last:border-0">
                        <button
                          type="button"
                          onClick={() => toggleModule(mod)}
                          className="flex w-full items-center gap-2 px-4 py-2.5 text-left hover:bg-slate-50"
                        >
                          <span
                            className={`h-4 w-4 shrink-0 rounded border text-xs flex items-center justify-center ${
                              allModSelected
                                ? 'border-slate-950 bg-slate-950 text-white'
                                : someModSelected
                                  ? 'border-slate-400 bg-slate-100 text-slate-600'
                                  : 'border-slate-200 bg-white'
                            }`}
                          >
                            {allModSelected ? '✓' : someModSelected ? '−' : ''}
                          </span>
                          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                            {MODULE_LABELS[mod] ?? mod}
                          </span>
                          <span className="ml-auto text-xs text-slate-400">
                            {modPerms.filter((p) => selectedPerms.includes(p.id)).length}/{modPerms.length}
                          </span>
                        </button>

                        <div className="flex flex-wrap gap-2 px-4 pb-3">
                          {modPerms.map((perm) => {
                            const checked = selectedPerms.includes(perm.id);
                            return (
                              <button
                                key={perm.id}
                                type="button"
                                onClick={() => togglePerm(perm.id)}
                                title={perm.code}
                                className={`rounded-full border px-2.5 py-0.5 text-xs font-medium transition-colors ${
                                  checked
                                    ? 'border-slate-950 bg-slate-950 text-white'
                                    : 'border-slate-200 bg-white text-slate-600 hover:border-slate-400'
                                }`}
                              >
                                {perm.name}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                  {allPermissions.length === 0 && (
                    <p className="px-4 py-4 text-sm text-slate-400">
                      Chưa có quyền nào. Hãy chạy seed script trước.
                    </p>
                  )}
                </div>
                <p className="text-xs text-slate-400">
                  Đã chọn {selectedPerms.length} quyền
                </p>
              </div>

              {error && (
                <p className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>
              )}
              {success && (
                <p className="rounded-xl bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
                  {mode === 'create' ? 'Đã tạo vai trò!' : 'Đã cập nhật vai trò!'}
                </p>
              )}

              <div className="flex justify-end gap-2 border-t border-slate-100 pt-4">
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
                      ? 'Tạo vai trò'
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
