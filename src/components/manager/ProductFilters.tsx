'use client';

import { useCallback, useTransition } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { PRODUCT_STATUS } from '@/constants/status';

const selectClass =
  'h-8 rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring/50 disabled:opacity-50';

function statusLabel(s: string): string {
  if (s === 'missing_from_source') return 'Missing from source';
  return s.charAt(0).toUpperCase() + s.slice(1);
}

interface ProductFiltersProps {
  urlSuffixOptions: string[];
}

export default function ProductFilters({ urlSuffixOptions }: ProductFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const keyword = searchParams.get('keyword') ?? '';
  const urlSuffix = searchParams.get('urlSuffix') ?? '';
  const status = searchParams.get('status') ?? '';

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
          placeholder="Search by name..."
          className="w-64"
        />
        <Button type="submit" variant="outline" size="sm" disabled={isPending}>
          Search
        </Button>
      </form>

      <select
        value={urlSuffix}
        onChange={(e) => navigate({ urlSuffix: e.target.value || null })}
        className={selectClass}
        disabled={isPending}
      >
        <option value="">All sources</option>
        {urlSuffixOptions.map((s) => (
          <option key={s} value={s}>
            {s}
          </option>
        ))}
      </select>

      <select
        value={status}
        onChange={(e) => navigate({ status: e.target.value || null })}
        className={selectClass}
        disabled={isPending}
      >
        <option value="">All statuses</option>
        {(Object.values(PRODUCT_STATUS) as string[])
          .filter((s) => s !== 'deleted')
          .map((s) => (
            <option key={s} value={s}>
              {statusLabel(s)}
            </option>
          ))}
      </select>

      {isPending && <span className="text-xs text-gray-500">Loading…</span>}
    </div>
  );
}
