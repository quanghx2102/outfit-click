'use client';

import { useState, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { OUTFIT_STATUS } from '@/constants/status';
import { generateSlug } from '@/lib/slug';
import type { StyleOption, OutfitTypeOption } from '@/server/outfits/outfit.service';

const selectClass =
  'h-9 w-full rounded-xl border border-slate-200 bg-white px-3 text-[13px] text-slate-700 outline-none transition-colors focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-1 disabled:opacity-50';

// Serializable subset — no Date fields
export type OutfitFormData = {
  id: string;
  outfitCode: string;
  name: string;
  slug: string;
  description: string | null;
  coverImageUrl: string;
  styleId: string | null;
  outfitTypeId: string | null;
  status: string;
};

interface OutfitFormProps {
  mode: 'create' | 'edit';
  initialData?: OutfitFormData;
  outfitId?: string;
  styleOptions: StyleOption[];
  outfitTypeOptions: OutfitTypeOption[];
  canUpdate?: boolean;
  canPublish?: boolean;
  canHide?: boolean;
}

type Saving = 'fields' | 'cover' | null;
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

export default function OutfitForm({
  mode,
  initialData,
  outfitId,
  styleOptions,
  outfitTypeOptions,
  canUpdate = true,
  canPublish = false,
  canHide = false,
}: OutfitFormProps) {
  const router = useRouter();
  const coverInputRef = useRef<HTMLInputElement>(null);

  const [name, setName] = useState(initialData?.name ?? '');
  const [slug, setSlug] = useState(initialData?.slug ?? '');
  const [description, setDescription] = useState(initialData?.description ?? '');
  const [styleId, setStyleId] = useState(initialData?.styleId ?? '');
  const [outfitTypeId, setOutfitTypeId] = useState(initialData?.outfitTypeId ?? '');
  const [status, setStatus] = useState(initialData?.status ?? 'draft');
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [slugManual, setSlugManual] = useState(mode === 'edit');
  const [saving, setSaving] = useState<Saving>(null);
  const [msg, setMsg] = useState<Msg>(null);

  const isBusy = saving !== null;
  const isCreate = mode === 'create';

  function showMsg(type: 'success' | 'error', text: string) {
    setMsg({ type, text });
    if (type === 'success') setTimeout(() => setMsg(null), 3000);
  }

  const handleNameChange = useCallback(
    (val: string) => {
      setName(val);
      if (!slugManual) {
        setSlug(generateSlug(val));
      }
    },
    [slugManual],
  );

  const handleSlugChange = useCallback((val: string) => {
    setSlug(val);
    setSlugManual(true);
  }, []);

  function handleCoverSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setCoverFile(file);
    setCoverPreview(URL.createObjectURL(file));
  }

  async function handleCreate() {
    if (!name.trim()) { showMsg('error', 'Name is required.'); return; }
    if (!slug.trim()) { showMsg('error', 'Slug is required.'); return; }
    if (!coverFile) { showMsg('error', 'Cover image is required.'); return; }

    setSaving('fields');
    setMsg(null);

    const fd = new FormData();
    fd.append('name', name.trim());
    fd.append('slug', slug.trim());
    fd.append('description', description.trim());
    if (styleId) fd.append('styleId', styleId);
    if (outfitTypeId) fd.append('outfitTypeId', outfitTypeId);
    fd.append('coverFile', coverFile);

    try {
      const res = await fetch('/api/manager/outfits', { method: 'POST', body: fd });
      const data = (await res.json()) as { id?: string; error?: string };
      if (!res.ok) {
        showMsg('error', data.error ?? 'Failed to create outfit.');
        return;
      }
      router.push(`/manager/outfits/${data.id}`);
    } catch {
      showMsg('error', 'Network error.');
    } finally {
      setSaving(null);
    }
  }

  async function handleSaveFields() {
    if (!name.trim()) { showMsg('error', 'Name is required.'); return; }
    if (!slug.trim()) { showMsg('error', 'Slug is required.'); return; }

    setSaving('fields');
    setMsg(null);

    try {
      const res = await fetch(`/api/manager/outfits/${outfitId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          slug: slug.trim(),
          description: description.trim() || null,
          styleId: styleId || null,
          outfitTypeId: outfitTypeId || null,
          status,
        }),
      });
      const data = (await res.json()) as { error?: string };
      if (!res.ok) {
        showMsg('error', data.error ?? 'Failed to save.');
        return;
      }
      showMsg('success', 'Saved.');
      router.refresh();
    } catch {
      showMsg('error', 'Network error.');
    } finally {
      setSaving(null);
    }
  }

  async function handleCoverUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setSaving('cover');
    setMsg(null);

    const fd = new FormData();
    fd.append('file', file);
    fd.append('entityType', 'outfit');
    fd.append('entityId', outfitId!);
    fd.append('mediaType', 'outfit_cover');

    try {
      const res = await fetch('/api/manager/media/upload', { method: 'POST', body: fd });
      const data = (await res.json()) as { error?: string };
      if (!res.ok) {
        showMsg('error', data.error ?? 'Upload failed.');
      } else {
        showMsg('success', 'Cover updated.');
        router.refresh();
      }
    } catch {
      showMsg('error', 'Network error.');
    } finally {
      setSaving(null);
      if (coverInputRef.current) coverInputRef.current.value = '';
    }
  }

  const statusOptions = (Object.values(OUTFIT_STATUS) as string[]).filter((s) => {
    if (s === 'deleted') return false;
    if (s === 'active' && !canPublish) return false;
    if (s === 'hidden' && !canHide) return false;
    return true;
  });

  return (
    <div className="flex flex-col gap-5">
      <InlineMsg msg={msg} />

      {/* ── Cover Image ── */}
      <Panel title="Cover Image">
        {(coverPreview ?? initialData?.coverImageUrl) && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={coverPreview ?? initialData!.coverImageUrl}
            alt="Cover preview"
            className="mb-4 h-48 w-auto max-w-xs rounded-xl border border-slate-100 object-cover"
          />
        )}

        {isCreate ? (
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="cover-create" className="text-[12px] font-medium text-slate-600">
              Cover Image <span className="text-red-400">*</span>
            </Label>
            <input
              id="cover-create"
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleCoverSelect}
              disabled={isBusy}
              className="text-sm text-slate-500 file:mr-3 file:rounded-xl file:border file:border-slate-200 file:bg-white file:px-3 file:py-1 file:text-[12px] file:font-medium file:text-slate-600 file:transition-colors hover:file:border-slate-950 hover:file:text-slate-950"
            />
            <p className="text-[11px] text-slate-400">JPG, PNG, or WEBP. Max 5MB.</p>
          </div>
        ) : (
          canUpdate && (
            <div className="flex items-center gap-3">
              <input
                ref={coverInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="hidden"
                onChange={handleCoverUpload}
                disabled={isBusy}
              />
              <Button
                variant="outline"
                size="sm"
                disabled={isBusy}
                onClick={() => coverInputRef.current?.click()}
                className="rounded-xl border-slate-200 text-slate-700 hover:border-slate-950 hover:text-slate-950"
              >
                {saving === 'cover' ? 'Uploading…' : 'Replace Cover'}
              </Button>
              <span className="text-[11px] text-slate-400">JPG, PNG, or WEBP. Max 5MB.</span>
            </div>
          )
        )}
      </Panel>

      {/* ── Basic Info ── */}
      <Panel title="Basic Info">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="outfit-name" className="text-[12px] font-medium text-slate-600">
              Name <span className="text-red-400">*</span>
            </Label>
            <Input
              id="outfit-name"
              value={name}
              onChange={(e) => handleNameChange(e.target.value)}
              placeholder="e.g. Phối đồ đi chơi nữ năng động"
              disabled={(!isCreate && !canUpdate) || isBusy}
              maxLength={255}
              className="rounded-xl border-slate-200 text-[13px] text-slate-700 placeholder:text-slate-300 focus-visible:ring-slate-950"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="outfit-slug" className="text-[12px] font-medium text-slate-600">
              Slug <span className="text-red-400">*</span>
            </Label>
            <Input
              id="outfit-slug"
              value={slug}
              onChange={(e) => handleSlugChange(e.target.value)}
              placeholder="phoi-do-di-choi-nu-nang-dong"
              disabled={(!isCreate && !canUpdate) || isBusy}
              maxLength={255}
              className="rounded-xl border-slate-200 font-mono text-[13px] text-slate-700 placeholder:text-slate-300 focus-visible:ring-slate-950"
            />
            <p className="text-[11px] text-slate-400">
              Auto-generated from name. Lowercase, digits, hyphens. Must be unique.
            </p>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="outfit-description" className="text-[12px] font-medium text-slate-600">
              Description
            </Label>
            <Textarea
              id="outfit-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Mô tả outfit, phong cách, dịp phù hợp..."
              rows={5}
              disabled={(!isCreate && !canUpdate) || isBusy}
              className="rounded-xl border-slate-200 text-[13px] text-slate-700 placeholder:text-slate-300 focus-visible:ring-slate-950"
            />
          </div>
        </div>
      </Panel>

      {/* ── Classification ── */}
      <Panel title="Classification">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="outfit-style" className="text-[12px] font-medium text-slate-600">
              Style
            </Label>
            <select
              id="outfit-style"
              value={styleId}
              onChange={(e) => setStyleId(e.target.value)}
              className={selectClass}
              disabled={(!isCreate && !canUpdate) || isBusy}
            >
              <option value="">— No style —</option>
              {styleOptions.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="outfit-type" className="text-[12px] font-medium text-slate-600">
              Outfit Type
            </Label>
            <select
              id="outfit-type"
              value={outfitTypeId}
              onChange={(e) => setOutfitTypeId(e.target.value)}
              className={selectClass}
              disabled={(!isCreate && !canUpdate) || isBusy}
            >
              <option value="">— No type —</option>
              {outfitTypeOptions.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </Panel>

      {/* ── Status (edit only) ── */}
      {!isCreate && canUpdate && statusOptions.length > 0 && (
        <Panel title="Status">
          <div className="flex flex-col gap-3">
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className={selectClass}
              disabled={isBusy}
            >
              {statusOptions.map((s) => (
                <option key={s} value={s}>
                  {s.charAt(0).toUpperCase() + s.slice(1)}
                </option>
              ))}
            </select>
            {(canPublish || canHide) && (
              <div className="flex flex-wrap gap-2">
                {canPublish && (
                  <Button
                    size="sm"
                    variant="default"
                    disabled={isBusy || status === 'active'}
                    onClick={() => setStatus('active')}
                    className="rounded-xl bg-emerald-600 text-[12px] text-white hover:bg-emerald-700"
                  >
                    Set Publish
                  </Button>
                )}
                {canHide && (
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={isBusy || status === 'hidden'}
                    onClick={() => setStatus('hidden')}
                    className="rounded-xl border-slate-200 text-[12px] text-slate-600 hover:text-slate-950"
                  >
                    Set Hidden
                  </Button>
                )}
                {canUpdate && (
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={isBusy || status === 'draft'}
                    onClick={() => setStatus('draft')}
                    className="rounded-xl border-slate-200 text-[12px] text-slate-600 hover:text-slate-950"
                  >
                    Set Draft
                  </Button>
                )}
              </div>
            )}
            <p className="text-[11px] text-slate-400">
              Click &ldquo;Save Changes&rdquo; to apply status update.
            </p>
          </div>
        </Panel>
      )}

      {/* ── Submit ── */}
      {(isCreate || canUpdate) && (
        <div className="flex justify-end">
          <Button
            disabled={isBusy}
            onClick={isCreate ? handleCreate : handleSaveFields}
            className="rounded-xl bg-slate-950 px-6 text-white hover:bg-slate-800"
          >
            {saving === 'fields'
              ? isCreate
                ? 'Creating…'
                : 'Saving…'
              : isCreate
                ? 'Create Outfit'
                : 'Save Changes'}
          </Button>
        </div>
      )}
    </div>
  );
}
