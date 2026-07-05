'use client';

import { useState, useTransition } from 'react';

export default function RawJsonViewer({ productId }: { productId: string }) {
  const [open, setOpen] = useState(false);
  const [json, setJson] = useState<unknown>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleOpen() {
    setOpen(true);
    if (json !== null) return;
    setError(null);

    startTransition(async () => {
      try {
        const res = await fetch(`/api/manager/products/${productId}?rawJson=1`);
        if (!res.ok) {
          const data = (await res.json()) as { error?: string };
          setError(data.error ?? 'Không thể tải Raw JSON');
          return;
        }
        const data = (await res.json()) as { rawJson: unknown };
        setJson(data.rawJson);
      } catch {
        setError('Lỗi mạng.');
      }
    });
  }

  return (
    <>
      <button
        onClick={handleOpen}
        className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50"
      >
        Xem Raw JSON
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="flex w-full max-w-3xl flex-col overflow-hidden rounded-2xl bg-white shadow-xl" style={{ maxHeight: '80vh' }}>
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
              <h2 className="text-sm font-semibold text-slate-900">Raw JSON — API Response</h2>
              <button
                onClick={() => setOpen(false)}
                className="text-slate-400 hover:text-slate-900"
              >
                ✕
              </button>
            </div>
            <div className="flex-1 overflow-y-auto bg-slate-950 p-5">
              {isPending && (
                <p className="text-xs text-slate-400">Đang tải…</p>
              )}
              {error && (
                <p className="text-xs text-red-400">{error}</p>
              )}
              {!isPending && !error && json !== null && (
                <pre className="whitespace-pre-wrap break-all font-mono text-[11px] leading-relaxed text-slate-300">
                  {JSON.stringify(json, null, 2)}
                </pre>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
