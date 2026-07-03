'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { getProductDisplayImage } from '@/lib/utils';

// Serializable subset of ProductDetail — excludes Date fields (not needed by the form)
export type ProductFormData = {
  id: string;
  name: string;
  imageUrl: string;
  mockupImageUrl: string | null;
  productDna: string | null;
  status: string;
};

interface ProductEditFormProps {
  product: ProductFormData;
  canUpdateDna: boolean;
  canUpdate: boolean;
  canUploadMockup: boolean;
}

type Saving = 'dna' | 'status' | 'mockup' | null;
type Msg = { type: 'success' | 'error'; text: string } | null;

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
      <p className="mb-4 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">{title}</p>
      {children}
    </div>
  );
}

function InlineMsg({ msg }: { msg: Msg }) {
  if (!msg) return null;
  return (
    <div
      className={`rounded-xl px-4 py-2.5 text-sm font-medium ${
        msg.type === 'success'
          ? 'bg-emerald-50 text-emerald-700'
          : 'bg-red-50 text-red-700'
      }`}
    >
      {msg.text}
    </div>
  );
}

export default function ProductEditForm({
  product,
  canUpdateDna,
  canUpdate,
  canUploadMockup,
}: ProductEditFormProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [dna, setDna] = useState(product.productDna ?? '');
  const [status, setStatus] = useState<'active' | 'inactive'>(
    product.status === 'inactive' ? 'inactive' : 'active',
  );
  const [saving, setSaving] = useState<Saving>(null);
  const [msg, setMsg] = useState<Msg>(null);

  const isBusy = saving !== null;

  function showMsg(type: 'success' | 'error', text: string) {
    setMsg({ type, text });
    if (type === 'success') setTimeout(() => setMsg(null), 3000);
  }

  async function patchProduct(body: Record<string, unknown>): Promise<boolean> {
    const res = await fetch(`/api/manager/products/${product.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      const data = (await res.json()) as { error?: string };
      showMsg('error', data.error ?? 'Request failed.');
      return false;
    }
    return true;
  }

  async function saveDna() {
    setSaving('dna');
    setMsg(null);
    try {
      const ok = await patchProduct({ productDna: dna.trim() || null });
      if (ok) {
        showMsg('success', 'Product DNA saved.');
        router.refresh();
      }
    } catch {
      showMsg('error', 'Network error.');
    } finally {
      setSaving(null);
    }
  }

  async function saveStatus() {
    setSaving('status');
    setMsg(null);
    try {
      const ok = await patchProduct({ status });
      if (ok) {
        showMsg('success', 'Status updated.');
        router.refresh();
      }
    } catch {
      showMsg('error', 'Network error.');
    } finally {
      setSaving(null);
    }
  }

  async function handleMockupChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setSaving('mockup');
    setMsg(null);

    const fd = new FormData();
    fd.append('file', file);
    fd.append('entityType', 'product');
    fd.append('entityId', product.id);
    fd.append('mediaType', 'product_mockup');

    try {
      const res = await fetch('/api/manager/media/upload', { method: 'POST', body: fd });
      if (!res.ok) {
        const data = (await res.json()) as { error?: string };
        showMsg('error', data.error ?? 'Upload failed.');
      } else {
        showMsg('success', 'Mockup uploaded.');
        router.refresh();
      }
    } catch {
      showMsg('error', 'Network error.');
    } finally {
      setSaving(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  }

  const displayImage = getProductDisplayImage(product);
  const hasMockup = !!product.mockupImageUrl;

  return (
    <div className="flex flex-col gap-5">
      <InlineMsg msg={msg} />

      {/* ── Image ── */}
      <Panel title="Product Image">
        <div className="flex flex-wrap items-start gap-5">
          <div className="flex flex-col gap-1.5">
            <p className="text-[11px] text-slate-400">
              {hasMockup ? 'Display (mockup)' : 'Display (source)'}
            </p>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={displayImage}
              alt={product.name}
              className="h-40 w-40 rounded-xl border border-slate-100 object-cover"
            />
          </div>
          {hasMockup && (
            <div className="flex flex-col gap-1.5">
              <p className="text-[11px] text-slate-400">Source (original)</p>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={product.imageUrl}
                alt="original"
                className="h-24 w-24 rounded-xl border border-slate-100 object-cover opacity-50"
              />
            </div>
          )}
        </div>

        {canUploadMockup && (
          <div className="mt-4 flex items-center gap-3">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="hidden"
              onChange={handleMockupChange}
              disabled={isBusy}
            />
            <Button
              variant="outline"
              size="sm"
              disabled={isBusy}
              onClick={() => fileInputRef.current?.click()}
              className="rounded-xl border-slate-200 text-slate-700 hover:border-slate-950 hover:text-slate-950"
            >
              {saving === 'mockup' ? 'Uploading…' : hasMockup ? 'Replace Mockup' : 'Upload Mockup'}
            </Button>
            {hasMockup && (
              <span className="text-[11px] text-slate-400">
                Will replace the current mockup.
              </span>
            )}
          </div>
        )}
      </Panel>

      {/* ── Product DNA ── */}
      {(canUpdateDna || product.productDna) && (
        <Panel title="Product DNA">
          <Textarea
            value={dna}
            onChange={(e) => setDna(e.target.value)}
            placeholder="Product description for AI fashion affiliate workflow…"
            rows={7}
            disabled={!canUpdateDna || isBusy}
            className="rounded-xl border-slate-200 text-sm text-slate-700 placeholder:text-slate-300 focus-visible:ring-slate-950"
          />
          {canUpdateDna && (
            <div className="mt-3 flex justify-end">
              <Button
                size="sm"
                disabled={isBusy}
                onClick={saveDna}
                className="rounded-xl bg-slate-950 text-white hover:bg-slate-800"
              >
                {saving === 'dna' ? 'Saving…' : 'Save DNA'}
              </Button>
            </div>
          )}
        </Panel>
      )}

      {/* ── Status ── */}
      {canUpdate && (
        <Panel title="Status">
          <div className="flex items-center gap-6">
            <div className="flex gap-5">
              {(['active', 'inactive'] as const).map((s) => (
                <label key={s} className="flex cursor-pointer items-center gap-2 text-sm">
                  <input
                    type="radio"
                    name="product-status"
                    value={s}
                    checked={status === s}
                    onChange={() => setStatus(s)}
                    disabled={isBusy}
                    className="h-4 w-4 accent-slate-950"
                  />
                  <span className="capitalize text-slate-700">{s}</span>
                </label>
              ))}
            </div>
            <Button
              size="sm"
              disabled={isBusy}
              onClick={saveStatus}
              className="rounded-xl bg-slate-950 text-white hover:bg-slate-800"
            >
              {saving === 'status' ? 'Saving…' : 'Save Status'}
            </Button>
          </div>
        </Panel>
      )}
    </div>
  );
}
