'use client';

import { useState, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { getProductDisplayImage } from '@/lib/utils';

// Serialized for Server→Client boundary (Date → ISO string)
export interface SerializedOutfitProductItem {
  outfitProductId: string;
  productId: string;
  name: string;
  imageUrl: string;
  mockupImageUrl: string | null;
  urlSuffix: string;
  status: string;
  addedAt: string;
}

interface PickerProductItem {
  id: string;
  name: string;
  imageUrl: string;
  mockupImageUrl: string | null;
  urlSuffix: string;
}

interface PickerApiResponse {
  products: PickerProductItem[];
  urlSuffixes: string[];
}

const selectClass =
  'h-9 rounded-xl border border-slate-200 bg-white px-2.5 text-[13px] text-slate-700 outline-none transition-colors focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-1 disabled:opacity-50';

interface ProductPickerProps {
  outfitId: string;
  initialProducts: SerializedOutfitProductItem[];
  canAdd?: boolean;
  canRemove?: boolean;
}

function ActionMsg({ msg }: { msg: { type: 'success' | 'error'; text: string } | null }) {
  if (!msg) return null;
  return (
    <div
      className={`rounded-xl px-3 py-2 text-[13px] font-medium ${
        msg.type === 'error' ? 'bg-red-50 text-red-700' : 'bg-emerald-50 text-emerald-700'
      }`}
    >
      {msg.text}
    </div>
  );
}

export default function ProductPicker({
  outfitId,
  initialProducts,
  canAdd = false,
  canRemove = false,
}: ProductPickerProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const [keyword, setKeyword] = useState('');
  const [urlSuffixFilter, setUrlSuffixFilter] = useState('');
  const [pickerProducts, setPickerProducts] = useState<PickerProductItem[]>([]);
  const [urlSuffixes, setUrlSuffixes] = useState<string[]>([]);
  const [pickerLoading, setPickerLoading] = useState(false);
  const [pickerError, setPickerError] = useState<string | null>(null);

  const [adding, setAdding] = useState<string | null>(null);
  const [removing, setRemoving] = useState<string | null>(null);
  const [actionMsg, setActionMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(
    null,
  );

  const addedProductIds = useMemo(
    () => new Set(initialProducts.map((p) => p.productId)),
    [initialProducts],
  );

  const fetchPickerProducts = useCallback(
    async (kw: string, suffix: string) => {
      setPickerLoading(true);
      setPickerError(null);
      const qs = new URLSearchParams({ picker: '1' });
      if (kw.trim()) qs.set('keyword', kw.trim());
      if (suffix) qs.set('urlSuffix', suffix);

      try {
        const res = await fetch(`/api/manager/outfits/${outfitId}/products?${qs.toString()}`);
        if (!res.ok) {
          setPickerError('Failed to load products.');
          return;
        }
        const data = (await res.json()) as PickerApiResponse;
        setPickerProducts(data.products);
        if (data.urlSuffixes.length > 0) {
          setUrlSuffixes((prev) => (prev.length === 0 ? data.urlSuffixes : prev));
        }
      } catch {
        setPickerError('Network error.');
      } finally {
        setPickerLoading(false);
      }
    },
    [outfitId],
  );

  function handleOpenChange(isOpen: boolean) {
    setOpen(isOpen);
    if (isOpen) {
      setKeyword('');
      setUrlSuffixFilter('');
      setActionMsg(null);
      void fetchPickerProducts('', '');
    }
  }

  function handleUrlSuffixChange(value: string) {
    setUrlSuffixFilter(value);
    void fetchPickerProducts(keyword, value);
  }

  function handleSearch() {
    void fetchPickerProducts(keyword, urlSuffixFilter);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') handleSearch();
  }

  async function handleAdd(productId: string) {
    setAdding(productId);
    setActionMsg(null);
    try {
      const res = await fetch(`/api/manager/outfits/${outfitId}/products`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId }),
      });
      const data = (await res.json()) as { error?: string };
      if (!res.ok) {
        setActionMsg({ type: 'error', text: data.error ?? 'Failed to add product.' });
        return;
      }
      router.refresh();
    } catch {
      setActionMsg({ type: 'error', text: 'Network error.' });
    } finally {
      setAdding(null);
    }
  }

  async function handleRemove(productId: string) {
    setRemoving(productId);
    setActionMsg(null);
    try {
      const res = await fetch(`/api/manager/outfits/${outfitId}/products/${productId}`, {
        method: 'DELETE',
      });
      if (!res.ok) {
        const data = (await res.json()) as { error?: string };
        setActionMsg({ type: 'error', text: data.error ?? 'Failed to remove product.' });
        return;
      }
      router.refresh();
    } catch {
      setActionMsg({ type: 'error', text: 'Network error.' });
    } finally {
      setRemoving(null);
    }
  }

  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
      {/* Section header */}
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
            Products in Outfit
          </p>
          <p className="mt-0.5 text-[13px] font-medium text-slate-700">
            {initialProducts.length} product{initialProducts.length !== 1 ? 's' : ''} added
          </p>
        </div>

        {canAdd && (
          <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogTrigger
              render={
                <Button
                  size="sm"
                  variant="outline"
                  className="shrink-0 rounded-xl border-slate-200 text-[12px] font-semibold text-slate-700 hover:border-slate-950 hover:text-slate-950"
                >
                  + Add Product
                </Button>
              }
            />
            <DialogContent className="flex max-h-[85vh] flex-col sm:max-w-2xl">
              <DialogHeader>
                <DialogTitle className="text-base font-semibold text-slate-950">
                  Add Product to Outfit
                </DialogTitle>
              </DialogHeader>

              {/* Search controls */}
              <div className="flex gap-2">
                <Input
                  placeholder="Search by name…"
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="flex-1 rounded-xl border-slate-200 text-[13px] focus-visible:ring-slate-950"
                  disabled={pickerLoading}
                />
                {urlSuffixes.length > 0 && (
                  <select
                    value={urlSuffixFilter}
                    onChange={(e) => handleUrlSuffixChange(e.target.value)}
                    className={selectClass + ' w-36'}
                    disabled={pickerLoading}
                  >
                    <option value="">All sources</option>
                    {urlSuffixes.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                )}
                <Button
                  size="sm"
                  onClick={handleSearch}
                  disabled={pickerLoading}
                  className="rounded-xl bg-slate-950 text-white hover:bg-slate-800"
                >
                  {pickerLoading ? 'Loading…' : 'Search'}
                </Button>
              </div>

              {pickerError && (
                <p className="text-[13px] font-medium text-red-600">{pickerError}</p>
              )}
              <ActionMsg msg={actionMsg} />

              {/* Product grid — scrollable */}
              <div className="flex-1 overflow-y-auto pr-1">
                {pickerProducts.length === 0 && !pickerLoading ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <p className="text-sm text-slate-400">No active products found.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                    {pickerProducts.map((p) => {
                      const isAdded = addedProductIds.has(p.id);
                      const isAdding = adding === p.id;
                      return (
                        <div
                          key={p.id}
                          className={`flex flex-col gap-2 rounded-xl border p-2 transition-all ${
                            isAdded
                              ? 'border-emerald-200 bg-emerald-50/50'
                              : 'border-slate-100 bg-white hover:border-slate-200'
                          }`}
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={getProductDisplayImage(p)}
                            alt={p.name}
                            className="aspect-[4/5] w-full rounded-lg object-cover"
                          />
                          <p className="line-clamp-2 text-[12px] font-medium leading-snug text-slate-700">
                            {p.name}
                          </p>
                          <span className="w-fit rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-500">
                            {p.urlSuffix}
                          </span>
                          <Button
                            size="sm"
                            variant={isAdded ? 'secondary' : 'default'}
                            disabled={isAdded || isAdding}
                            onClick={() => void handleAdd(p.id)}
                            className={`mt-auto w-full rounded-xl text-[12px] ${
                              isAdded
                                ? 'bg-emerald-100 text-emerald-700'
                                : 'bg-slate-950 text-white hover:bg-slate-800'
                            }`}
                          >
                            {isAdding ? 'Adding…' : isAdded ? '✓ Added' : 'Add'}
                          </Button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* Inline action message (outside dialog) */}
      {actionMsg && !open && (
        <div className="mb-4">
          <ActionMsg msg={actionMsg} />
        </div>
      )}

      {/* Selected products grid */}
      {initialProducts.length === 0 ? (
        <div className="flex flex-col items-center gap-2 py-10 text-center">
          <p className="text-sm text-slate-400">No products added yet.</p>
          {canAdd && (
            <p className="text-[12px] text-slate-300">
              Click &ldquo;+ Add Product&rdquo; to get started.
            </p>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {initialProducts.map((p) => {
            const isRemoving = removing === p.productId;
            return (
              <div
                key={p.outfitProductId}
                className="flex flex-col gap-2 rounded-xl border border-slate-100 bg-slate-50/50 p-2 transition-all hover:border-slate-200"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={getProductDisplayImage(p)}
                  alt={p.name}
                  className="aspect-[4/5] w-full rounded-lg border border-slate-100 object-cover"
                />
                <div className="flex flex-col gap-1.5">
                  <p className="line-clamp-2 text-[12px] font-medium leading-snug text-slate-700">
                    {p.name}
                  </p>
                  <span className="w-fit rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-500">
                    {p.urlSuffix}
                  </span>
                </div>
                {canRemove && (
                  <Button
                    size="sm"
                    variant="destructive"
                    disabled={isRemoving}
                    onClick={() => void handleRemove(p.productId)}
                    className="mt-auto w-full rounded-xl text-[12px]"
                  >
                    {isRemoving ? 'Removing…' : 'Remove'}
                  </Button>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
