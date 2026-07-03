'use client';

import { useCallback, useTransition } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface AnalyticsDateFilterProps {
  fromStr: string;
  toStr: string;
}

export default function AnalyticsDateFilter({ fromStr, toStr }: AnalyticsDateFilterProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const navigate = useCallback(
    (from: string, to: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set('from', from);
      params.set('to', to);
      startTransition(() => {
        router.push(`${pathname}?${params.toString()}`);
      });
    },
    [router, pathname, searchParams],
  );

  return (
    <form
      className="flex flex-wrap items-center gap-3"
      onSubmit={(e) => {
        e.preventDefault();
        const fd = new FormData(e.currentTarget);
        const from = fd.get('from') as string;
        const to = fd.get('to') as string;
        if (from && to) navigate(from, to);
      }}
    >
      <div className="flex items-center gap-2">
        <label htmlFor="analytics-from" className="whitespace-nowrap text-sm text-gray-600">
          From
        </label>
        <Input
          id="analytics-from"
          name="from"
          type="date"
          key={fromStr}
          defaultValue={fromStr}
          className="h-8 w-36 text-sm"
          required
        />
      </div>
      <div className="flex items-center gap-2">
        <label htmlFor="analytics-to" className="whitespace-nowrap text-sm text-gray-600">
          To
        </label>
        <Input
          id="analytics-to"
          name="to"
          type="date"
          key={toStr}
          defaultValue={toStr}
          className="h-8 w-36 text-sm"
          required
        />
      </div>
      <Button type="submit" variant="outline" size="sm" disabled={isPending}>
        Apply
      </Button>
      {isPending && <span className="text-xs text-gray-500">Loading…</span>}
    </form>
  );
}
