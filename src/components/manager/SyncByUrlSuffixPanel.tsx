'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { RefreshCw } from 'lucide-react';

interface GroupResult {
  groupId: string;
  groupName: string;
  status: string;
  totalFetched: number;
  totalCreated: number;
  totalUpdated: number;
  totalDeactivated: number;
  error?: string;
}

interface SyncResult {
  ok: boolean;
  urlSuffix: string;
  totalGroups: number;
  totalFetched: number;
  totalCreated: number;
  totalUpdated: number;
  totalDeactivated: number;
  groups: GroupResult[];
  errors?: string[];
}

/** Inline panel variant — renders as a card directly on the page (no dialog). */
export default function SyncByUrlSuffixPanel() {
  const router = useRouter();
  const [urlSuffix, setUrlSuffix] = useState('');
  const [isPending, startTransition] = useTransition();
  const [result, setResult] = useState<SyncResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  function handleReset() {
    setResult(null);
    setError(null);
    setUrlSuffix('');
  }

  async function handleSync(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setResult(null);

    startTransition(async () => {
      try {
        const res = await fetch('/api/manager/products/sync-by-url-suffix', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ urlSuffix: urlSuffix.trim() }),
        });

        const data = (await res.json()) as SyncResult & { error?: string };

        if (!res.ok) {
          setError(data.error ?? 'Đồng bộ thất bại');
          return;
        }

        setResult(data);
        router.refresh();
      } catch {
        setError('Lỗi mạng. Vui lòng thử lại.');
      }
    });
  }

  return (
    <div
      className="rounded-2xl border p-6"
      style={{ borderColor: '#E5E7EB', background: '#FFFFFF' }}
    >
      <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:gap-10">
        {/* Left: form */}
        <div className="flex-1">
          <h2 className="text-[15px] font-semibold" style={{ color: '#111827' }}>
            Đồng bộ sản phẩm từ nguồn
          </h2>
          <p className="mt-1 text-sm" style={{ color: '#6B7280' }}>
            Nhập urlSuffix để đồng bộ toàn bộ sản phẩm từ nguồn đó.
          </p>

          <form onSubmit={handleSync} className="mt-4 flex items-end gap-3">
            <div className="flex flex-col gap-1.5">
              <label
                className="text-[11px] font-semibold uppercase"
                style={{ letterSpacing: '0.1em', color: '#6B7280' }}
              >
                urlSuffix
              </label>
              <input
                type="text"
                value={urlSuffix}
                onChange={(e) => setUrlSuffix(e.target.value)}
                required
                disabled={isPending}
                className="w-60 rounded-xl border px-3 py-2 font-mono text-sm outline-none focus:ring-1"
                style={{ borderColor: '#E5E7EB', color: '#111827' }}
                placeholder="e.g. outfitsdepoday"
              />
            </div>
            <button
              type="submit"
              disabled={isPending || !urlSuffix.trim()}
              className="inline-flex items-center gap-2 rounded-xl px-5 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-85 disabled:opacity-50"
              style={{ background: '#9A7654' }}
            >
              <RefreshCw size={14} className={isPending ? 'animate-spin' : ''} />
              {isPending ? 'Đang đồng bộ…' : 'Đồng bộ sản phẩm'}
            </button>
            {result && (
              <button
                type="button"
                onClick={handleReset}
                className="rounded-xl border px-4 py-2 text-sm font-medium transition-colors hover:bg-gray-50"
                style={{ borderColor: '#E5E7EB', color: '#6B7280' }}
              >
                Đặt lại
              </button>
            )}
          </form>

          {error && (
            <p className="mt-3 rounded-xl bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>
          )}
        </div>

        {/* Right: result summary */}
        {result && (
          <div className="min-w-[280px]">
            <div className="mb-3 flex items-center justify-between">
              <p className="text-[11px] font-bold uppercase" style={{ letterSpacing: '0.1em', color: '#6B7280' }}>
                Kết quả đồng bộ
              </p>
              <span
                className="rounded-full px-2 py-0.5 text-[11px] font-semibold"
                style={{ background: '#DCFCE7', color: '#166534' }}
              >
                Hoàn thành
              </span>
            </div>
            <div className="grid grid-cols-5 gap-3">
              {[
                { label: 'Nhóm', value: result.totalGroups },
                { label: 'Đã lấy', value: result.totalFetched },
                { label: 'Tạo mới', value: result.totalCreated },
                { label: 'Cập nhật', value: result.totalUpdated },
                { label: 'Tạm ẩn', value: result.totalDeactivated },
              ].map(({ label, value }) => (
                <div key={label} className="flex flex-col">
                  <span className="text-xl font-bold" style={{ color: '#111827' }}>{value}</span>
                  <span className="text-[10px]" style={{ color: '#9CA3AF' }}>{label}</span>
                </div>
              ))}
            </div>

            {result.groups.length > 0 && (
              <div
                className="mt-4 max-h-48 overflow-y-auto rounded-xl border"
                style={{ borderColor: '#F3F4F6' }}
              >
                <table className="min-w-full text-xs">
                  <thead>
                    <tr style={{ background: '#F9FAFB', borderBottom: '1px solid #F3F4F6' }}>
                      {['Nhóm', 'Đã lấy', 'Mới', 'Cập nhật', 'Trạng thái'].map((h) => (
                        <th key={h} className="px-3 py-2 text-left text-[10px] font-bold uppercase" style={{ color: '#9CA3AF' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {result.groups.map((g) => (
                      <tr key={g.groupId} style={{ borderTop: '1px solid #F9FAFB' }}>
                        <td className="px-3 py-2">
                          <p className="font-medium" style={{ color: '#374151' }}>{g.groupName}</p>
                          {g.error && <p className="text-red-500">{g.error}</p>}
                        </td>
                        <td className="px-3 py-2" style={{ color: '#6B7280' }}>{g.totalFetched}</td>
                        <td className="px-3 py-2" style={{ color: '#16A34A' }}>{g.totalCreated}</td>
                        <td className="px-3 py-2" style={{ color: '#2563EB' }}>{g.totalUpdated}</td>
                        <td className="px-3 py-2">
                          <span
                            className="rounded-full px-2 py-0.5 text-[10px] font-semibold"
                            style={
                              g.status === 'success'
                                ? { background: '#DCFCE7', color: '#166534' }
                                : g.status === 'partial_success'
                                ? { background: '#FEF3C7', color: '#92400E' }
                                : { background: '#FEE2E2', color: '#991B1B' }
                            }
                          >
                            {g.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
