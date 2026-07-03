'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
        showMsg('success', 'Mockup uploaded successfully.');
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
    <div className="flex flex-col gap-6">
      {msg && (
        <div
          className={`rounded-lg px-4 py-2.5 text-sm ${
            msg.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
          }`}
        >
          {msg.text}
        </div>
      )}

      {/* Image section */}
      <Card>
        <CardHeader>
          <CardTitle>Product Image</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="flex flex-wrap items-start gap-4">
            <div className="flex flex-col items-start gap-1">
              <span className="text-xs text-muted-foreground">
                Display {hasMockup ? '(mockup)' : '(source)'}
              </span>
              {/* external URL from API/R2 — next/image requires domain config */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={displayImage}
                alt={product.name}
                className="h-40 w-40 rounded-lg border object-cover"
              />
            </div>
            {hasMockup && (
              <div className="flex flex-col items-start gap-1">
                <span className="text-xs text-muted-foreground">Source (original)</span>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={product.imageUrl}
                  alt="original"
                  className="h-20 w-20 rounded-lg border object-cover opacity-60"
                />
              </div>
            )}
          </div>

          {canUploadMockup && (
            <div className="flex items-center gap-3">
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
              >
                {saving === 'mockup' ? 'Uploading…' : hasMockup ? 'Replace Mockup' : 'Upload Mockup'}
              </Button>
              {hasMockup && (
                <span className="text-xs text-muted-foreground">Uploading will replace the current mockup.</span>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* DNA section — show if user can edit OR DNA already exists (read display) */}
      {(canUpdateDna || product.productDna) && (
        <Card>
          <CardHeader>
            <CardTitle>Product DNA</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            <Textarea
              value={dna}
              onChange={(e) => setDna(e.target.value)}
              placeholder="Mô tả sản phẩm dùng cho workflow AI fashion affiliate…"
              rows={6}
              disabled={!canUpdateDna || isBusy}
            />
            {canUpdateDna && (
              <div className="flex justify-end">
                <Button size="sm" disabled={isBusy} onClick={saveDna}>
                  {saving === 'dna' ? 'Saving…' : 'Save DNA'}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Status section */}
      {canUpdate && (
        <Card>
          <CardHeader>
            <CardTitle>Status</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center gap-6">
            <div className="flex gap-4">
              {(['active', 'inactive'] as const).map((s) => (
                <label key={s} className="flex cursor-pointer items-center gap-2 text-sm">
                  <input
                    type="radio"
                    name="product-status"
                    value={s}
                    checked={status === s}
                    onChange={() => setStatus(s)}
                    disabled={isBusy}
                    className="h-4 w-4 accent-primary"
                  />
                  <span className="capitalize">{s}</span>
                </label>
              ))}
            </div>
            <Button size="sm" disabled={isBusy} onClick={saveStatus}>
              {saving === 'status' ? 'Saving…' : 'Save Status'}
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
