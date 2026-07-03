'use client';

import { useCallback, useTransition } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { OUTFIT_STATUS } from '@/constants/status';
import type { StyleOption, OutfitTypeOption } from '@/server/outfits/outfit.service';

const selectClass =
  'h-8 rounded-xl border border-slate-200 bg-white px-2.5 text-sm text-slate-700 outline-none transition-colors focus-visible:ring-2 focus-visible:ring-slate-950/20 disabled:opacity-50';

function statusLabel(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

interface OutfitFiltersProps {
  styleOptions: StyleOption[];
  outfitTypeOptions: OutfitTypeOption[];
}

export default function OutfitFilters({ styleOptions, outfitTypeOptions }: OutfitFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const keyword = searchParams.get('keyword') ?? '';
  const status = searchParams.get('status') ?? '';
  const styleId = searchParams.get('styleId') ?? '';
  const outfitTypeId = searchParams.get('outfitTypeId') ?? '';

  const navigate = useCallback(
    (overrides: Record<string, string | null>) => {
      const params = new URLSearchParams(searchParams.toString());
      for (const [k, v] of Object.entries(overrides)) {
        if (!v) params.delete(k);
        else params.set(k, v);
      }
      params.delete('page');
      startTransition(() => {
        router.push(`${pathname}?${params.toString()}`);
      });
    },
    [router, pathname, searchParams],
  );

  return (
    <div className="flex flex-wrap items-center gap-3">
      <form
        className="flex gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          const fd = new FormData(e.currentTarget);
          navigate({ keyword: (fd.get('keyword') as string)?.trim() || null });
        }}
      >
        <Input
          name="keyword"
          key={keyword}
          defaultValue={keyword}
          placeholder="Search name or code..."
          className="w-64"
        />
        <Button type="submit" variant="outline" size="sm" disabled={isPending}>
          Search
        </Button>
      </form>

      <select
        value={status}
        onChange={(e) => navigate({ status: e.target.value || null })}
        className={selectClass}
        disabled={isPending}
      >
        <option value="">All statuses</option>
        {(Object.values(OUTFIT_STATUS) as string[])
          .filter((s) => s !== 'deleted')
          .map((s) => (
            <option key={s} value={s}>
              {statusLabel(s)}
            </option>
          ))}
      </select>

      <select
        value={styleId}
        onChange={(e) => navigate({ styleId: e.target.value || null })}
        className={selectClass}
        disabled={isPending}
      >
        <option value="">All styles</option>
        {styleOptions.map((s) => (
          <option key={s.id} value={s.id}>
            {s.name}
          </option>
        ))}
      </select>

      <select
        value={outfitTypeId}
        onChange={(e) => navigate({ outfitTypeId: e.target.value || null })}
        className={selectClass}
        disabled={isPending}
      >
        <option value="">All types</option>
        {outfitTypeOptions.map((t) => (
          <option key={t.id} value={t.id}>
            {t.name}
          </option>
        ))}
      </select>

      {isPending && <span className="text-xs text-slate-500">Loading…</span>}
    </div>
  );
}
