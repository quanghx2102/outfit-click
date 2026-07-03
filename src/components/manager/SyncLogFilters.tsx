'use client';

import { useCallback, useTransition } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { SYNC_STATUS } from '@/constants/status';

const selectClass =
  'h-8 rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring/50 disabled:opacity-50';

interface SyncLogFiltersProps {
  fromStr: string;
  toStr: string;
}

export default function SyncLogFilters({ fromStr, toStr }: SyncLogFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

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
      <select
        value={status}
        onChange={(e) => navigate({ status: e.target.value || null })}
        className={selectClass}
        disabled={isPending}
      >
        <option value="">All statuses</option>
        {Object.values(SYNC_STATUS).map((s) => (
          <option key={s} value={s}>
            {s.replace(/_/g, ' ')}
          </option>
        ))}
      </select>

      <form
        className="flex flex-wrap items-center gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          const fd = new FormData(e.currentTarget);
          const from = fd.get('from') as string;
          const to = fd.get('to') as string;
          navigate({ from: from || null, to: to || null });
        }}
      >
        <div className="flex items-center gap-1.5">
          <label htmlFor="sync-from" className="whitespace-nowrap text-sm text-gray-600">
            From
          </label>
          <Input
            id="sync-from"
            name="from"
            type="date"
            key={fromStr}
            defaultValue={fromStr}
            className="h-8 w-36 text-sm"
          />
        </div>
        <div className="flex items-center gap-1.5">
          <label htmlFor="sync-to" className="whitespace-nowrap text-sm text-gray-600">
            To
          </label>
          <Input
            id="sync-to"
            name="to"
            type="date"
            key={toStr}
            defaultValue={toStr}
            className="h-8 w-36 text-sm"
          />
        </div>
        <Button type="submit" variant="outline" size="sm" disabled={isPending}>
          Apply
        </Button>
      </form>

      {isPending && <span className="text-xs text-gray-500">Loading…</span>}
    </div>
  );
}
