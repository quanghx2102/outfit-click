'use client';

import { useState } from 'react';
import { Trash2, Loader2 } from 'lucide-react';

export type MediaGridItem = {
  id: string;
  entityType: string;
  entityId: string;
  mediaType: string;
  fileUrl: string;
  mimeType: string | null;
  fileSize: string | null;
  createdAt: string;
  uploaderName: string | null;
};

interface MediaGridProps {
  items: MediaGridItem[];
  canDelete: boolean;
}

function formatBytes(bytes: string | null): string {
  if (!bytes) return '—';
  const n = Number(bytes);
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
  return `${(n / (1024 * 1024)).toFixed(1)} MB`;
}

function formatDate(iso: string): string {
  return new Date(iso).toISOString().replace('T', ' ').slice(0, 16);
}

export default function MediaGrid({ items: initialItems, canDelete }: MediaGridProps) {
  const [items, setItems] = useState(initialItems);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleDelete(id: string) {
    if (!confirm('Xóa ảnh này khỏi R2 và hệ thống? Hành động không thể hoàn tác.')) return;

    setDeletingId(id);
    setError(null);
    try {
      const res = await fetch(`/api/manager/media/${id}`, { method: 'DELETE' });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error ?? `Xóa thất bại (${res.status})`);
      }
      setItems((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Xóa thất bại');
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="flex flex-col gap-4">
      {error && (
        <div
          className="rounded-xl border px-4 py-2 text-sm"
          style={{ borderColor: '#FCA5A5', background: '#FEF2F2', color: '#B91C1C' }}
        >
          {error}
        </div>
      )}

      <div className="grid grid-cols-3 gap-3 sm:grid-cols-5 md:grid-cols-7 lg:grid-cols-10">
        {items.map((item) => (
          <div
            key={item.id}
            className="group relative overflow-hidden rounded-2xl border"
            style={{ borderColor: '#E5E7EB', background: '#FFFFFF' }}
          >
            <div className="aspect-[9/16] w-full overflow-hidden" style={{ background: '#F3F4F6' }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={item.fileUrl}
                alt={item.mediaType}
                className="h-full w-full object-contain transition-transform group-hover:scale-105"
                loading="lazy"
              />
            </div>

            <div className="flex flex-col gap-1 p-3">
              <span
                className="w-fit rounded-full px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide"
                style={{ background: '#F3F4F6', color: '#374151' }}
              >
                {item.mediaType}
              </span>
              <p className="truncate text-[11px]" style={{ color: '#6B7280' }}>
                {item.entityType} · {item.entityId.slice(0, 8)}
              </p>
              <p className="text-[11px]" style={{ color: '#9CA3AF' }}>
                {formatBytes(item.fileSize)} · {formatDate(item.createdAt)}
              </p>
              {item.uploaderName && (
                <p className="truncate text-[11px]" style={{ color: '#9CA3AF' }}>
                  bởi {item.uploaderName}
                </p>
              )}
            </div>

            {canDelete && (
              <button
                type="button"
                onClick={() => handleDelete(item.id)}
                disabled={deletingId === item.id}
                className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full opacity-0 transition-opacity group-hover:opacity-100 disabled:opacity-100"
                style={{ background: 'rgba(17,24,39,0.75)', color: '#FFFFFF' }}
                aria-label="Xóa ảnh"
                title="Xóa ảnh"
              >
                {deletingId === item.id ? (
                  <Loader2 size={14} className="animate-spin" />
                ) : (
                  <Trash2 size={14} />
                )}
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
