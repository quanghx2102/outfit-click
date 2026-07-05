'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';

// ─── Reset Password ───────────────────────────────────────────────────────────

export function ResetPasswordButton({ userId }: { userId: string }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isPending, startTransition] = useTransition();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    startTransition(async () => {
      try {
        const res = await fetch(`/api/manager/users/${userId}/password`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ newPassword: password }),
        });

        if (!res.ok) {
          const data = (await res.json()) as { error?: string };
          setError(data.error ?? 'Đặt lại mật khẩu thất bại');
          return;
        }

        setSuccess(true);
        router.refresh();
        setTimeout(() => setOpen(false), 800);
      } catch {
        setError('Lỗi mạng.');
      }
    });
  }

  return (
    <>
      <button
        onClick={() => { setOpen(true); setPassword(''); setError(null); setSuccess(false); }}
        className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50"
      >
        Đặt lại mật khẩu
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-sm rounded-2xl bg-white shadow-xl">
            <div className="border-b border-slate-100 px-6 py-4">
              <h2 className="text-sm font-semibold text-slate-900">Đặt lại mật khẩu</h2>
            </div>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4 px-6 py-5">
              <div className="flex flex-col gap-1">
                <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                  Mật khẩu mới
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={8}
                  className="rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-slate-950 focus:ring-1 focus:ring-slate-950"
                  placeholder="Tối thiểu 8 ký tự"
                />
              </div>
              {error && <p className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>}
              {success && <p className="rounded-xl bg-emerald-50 px-3 py-2 text-sm text-emerald-700">Đã đặt lại mật khẩu!</p>}
              <div className="flex justify-end gap-2">
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
                  {isPending ? 'Đang lưu…' : 'Đặt lại'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

// ─── Toggle Status ────────────────────────────────────────────────────────────

export function ToggleUserStatusButton({
  userId,
  currentStatus,
}: {
  userId: string;
  currentStatus: string;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const isActive = currentStatus === 'active';

  function handleToggle() {
    setError(null);
    startTransition(async () => {
      try {
        const res = await fetch(`/api/manager/users/${userId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: isActive ? 'disabled' : 'active' }),
        });

        if (!res.ok) {
          const data = (await res.json()) as { error?: string };
          setError(data.error ?? 'Cập nhật trạng thái thất bại');
          return;
        }

        router.refresh();
      } catch {
        setError('Lỗi mạng.');
      }
    });
  }

  return (
    <div className="flex flex-col items-start gap-1">
      <button
        onClick={handleToggle}
        disabled={isPending}
        className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors disabled:opacity-50 ${
          isActive
            ? 'border-red-200 text-red-600 hover:bg-red-50'
            : 'border-emerald-200 text-emerald-700 hover:bg-emerald-50'
        }`}
      >
        {isPending ? 'Đang cập nhật…' : isActive ? 'Vô hiệu hoá' : 'Kích hoạt'}
      </button>
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}
