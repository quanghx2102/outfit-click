'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { generateSlug } from '@/lib/slug';

type TaxonomyKind = 'style' | 'outfitType';
type ItemForEdit = { id: string; name: string; slug: string };

interface Props {
  mode: 'create' | 'edit';
  kind: TaxonomyKind;
  item?: ItemForEdit;
  trigger: React.ReactNode;
}

const KIND_PATH: Record<TaxonomyKind, string> = {
  style: 'styles',
  outfitType: 'outfit-types',
};

const KIND_LABEL: Record<TaxonomyKind, string> = {
  style: 'phong cách',
  outfitType: 'loại outfit',
};

export default function TaxonomyFormDialog({ mode, kind, item, trigger }: Props) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const [name, setName] = useState(item?.name ?? '');
  const [slug, setSlug] = useState(item?.slug ?? '');
  const [slugManual, setSlugManual] = useState(mode === 'edit');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  function handleOpen() {
    setName(item?.name ?? '');
    setSlug(item?.slug ?? '');
    setSlugManual(mode === 'edit');
    setError(null);
    setSuccess(false);
    setOpen(true);
  }

  function handleNameChange(val: string) {
    setName(val);
    if (!slugManual) setSlug(generateSlug(val));
  }

  function handleSlugChange(val: string) {
    setSlug(val);
    setSlugManual(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    startTransition(async () => {
      try {
        const path = KIND_PATH[kind];
        const res =
          mode === 'create'
            ? await fetch(`/api/manager/taxonomy/${path}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, slug: slug || undefined }),
              })
            : await fetch(`/api/manager/taxonomy/${path}/${item!.id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, slug }),
              });

        if (!res.ok) {
          const data = (await res.json()) as { error?: string };
          setError(data.error ?? (mode === 'create' ? 'Tạo thất bại' : 'Cập nhật thất bại'));
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
          <div className="w-full max-w-md rounded-2xl bg-white shadow-xl">
            <div className="border-b border-slate-100 px-6 py-4">
              <h2 className="text-sm font-semibold text-slate-900">
                {mode === 'create'
                  ? `Tạo ${KIND_LABEL[kind]}`
                  : `Chỉnh sửa ${KIND_LABEL[kind]}`}
              </h2>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4 px-6 py-5">
              <div className="flex flex-col gap-1">
                <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                  Tên
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  required
                  maxLength={100}
                  className="rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-900 outline-none focus:border-slate-950 focus:ring-1 focus:ring-slate-950"
                  placeholder={kind === 'style' ? 'VD: Boho' : 'VD: Đi biển'}
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                  Slug
                </label>
                <input
                  type="text"
                  value={slug}
                  onChange={(e) => handleSlugChange(e.target.value)}
                  required
                  maxLength={120}
                  className="rounded-xl border border-slate-200 px-3 py-2 font-mono text-sm text-slate-900 outline-none focus:border-slate-950 focus:ring-1 focus:ring-slate-950"
                  placeholder="di-bien"
                />
                <p className="text-xs text-slate-400">Tự động tạo từ tên. Phải là duy nhất.</p>
              </div>

              {error && (
                <p className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>
              )}
              {success && (
                <p className="rounded-xl bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
                  {mode === 'create' ? 'Đã tạo!' : 'Đã cập nhật!'}
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
                  {isPending ? 'Đang lưu…' : mode === 'create' ? 'Tạo' : 'Lưu thay đổi'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
