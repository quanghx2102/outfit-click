'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';

type TaxonomyKind = 'style' | 'outfitType';

const KIND_PATH: Record<TaxonomyKind, string> = {
  style: 'styles',
  outfitType: 'outfit-types',
};

interface ToggleStatusProps {
  kind: TaxonomyKind;
  id: string;
  status: string;
}

export function ToggleTaxonomyStatusButton({ kind, id, status }: ToggleStatusProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const nextStatus = status === 'active' ? 'inactive' : 'active';

  function handleClick() {
    setError(null);
    startTransition(async () => {
      try {
        const res = await fetch(`/api/manager/taxonomy/${KIND_PATH[kind]}/${id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: nextStatus }),
        });
        if (!res.ok) {
          const data = (await res.json()) as { error?: string };
          setError(data.error ?? 'Cập nhật thất bại');
          return;
        }
        router.refresh();
      } catch {
        setError('Lỗi mạng.');
      }
    });
  }

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={handleClick}
        disabled={isPending}
        className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 transition-colors hover:bg-slate-50 disabled:opacity-50"
      >
        {isPending ? 'Đang xử lý…' : status === 'active' ? 'Vô hiệu hoá' : 'Kích hoạt'}
      </button>
      {error && <span className="text-xs text-red-600">{error}</span>}
    </div>
  );
}

interface DeleteProps {
  kind: TaxonomyKind;
  id: string;
  outfitCount: number;
}

export function DeleteTaxonomyButton({ kind, id, outfitCount }: DeleteProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function handleClick() {
    if (outfitCount > 0) return;
    if (!window.confirm('Xoá mục này? Hành động không thể hoàn tác.')) return;

    setError(null);
    startTransition(async () => {
      try {
        const res = await fetch(`/api/manager/taxonomy/${KIND_PATH[kind]}/${id}`, {
          method: 'DELETE',
        });
        if (!res.ok) {
          const data = (await res.json()) as { error?: string };
          setError(data.error ?? 'Xoá thất bại');
          return;
        }
        router.refresh();
      } catch {
        setError('Lỗi mạng.');
      }
    });
  }

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={handleClick}
        disabled={isPending || outfitCount > 0}
        title={outfitCount > 0 ? 'Đang được sử dụng bởi outfit, không thể xoá' : undefined}
        className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-red-600 transition-colors hover:bg-red-50 disabled:cursor-not-allowed disabled:text-slate-300 disabled:hover:bg-transparent"
      >
        {isPending ? 'Đang xoá…' : 'Xoá'}
      </button>
      {error && <span className="text-xs text-red-600">{error}</span>}
    </div>
  );
}
