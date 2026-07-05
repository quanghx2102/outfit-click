'use client';

import { useCallback, useTransition } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { PRODUCT_STATUS } from '@/constants/status';

const selectClass =
  'h-8 rounded-xl border border-slate-200 bg-white px-2.5 text-sm text-slate-700 outline-none focus-visible:ring-1 focus-visible:ring-slate-950 disabled:opacity-50';

function statusLabel(s: string): string {
  const map: Record<string, string> = {
    active: 'Đang hoạt động',
    inactive: 'Tạm ẩn',
    missing_from_source: 'Không còn trong nguồn',
  };
  return map[s] ?? (s.charAt(0).toUpperCase() + s.slice(1));
}

interface ProductFiltersProps {
  urlSuffixOptions: string[];
  groupIdOptions?: string[];
}

export default function ProductFilters({ urlSuffixOptions, groupIdOptions = [] }: ProductFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const keyword = searchParams.get('keyword') ?? '';
  const urlSuffix = searchParams.get('urlSuffix') ?? '';
  const status = searchParams.get('status') ?? '';
  const externalGroupId = searchParams.get('externalGroupId') ?? '';
  const hasMockup = searchParams.get('hasMockup') ?? '';
  const hasProductDna = searchParams.get('hasProductDna') ?? '';

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
          placeholder="Tìm theo tên..."
          className="w-56 rounded-xl border-slate-200 text-sm"
        />
        <Button type="submit" variant="outline" size="sm" disabled={isPending} className="rounded-xl">
          Tìm
        </Button>
      </form>

      <select
        value={urlSuffix}
        onChange={(e) => navigate({ urlSuffix: e.target.value || null })}
        className={selectClass}
        disabled={isPending}
      >
        <option value="">Tất cả nguồn</option>
        {urlSuffixOptions.map((s) => (
          <option key={s} value={s}>{s}</option>
        ))}
      </select>

      <select
        value={status}
        onChange={(e) => navigate({ status: e.target.value || null })}
        className={selectClass}
        disabled={isPending}
      >
        <option value="">Tất cả trạng thái</option>
        {(Object.values(PRODUCT_STATUS) as string[])
          .filter((s) => s !== 'deleted')
          .map((s) => (
            <option key={s} value={s}>{statusLabel(s)}</option>
          ))}
      </select>

      {groupIdOptions.length > 0 && (
        <select
          value={externalGroupId}
          onChange={(e) => navigate({ externalGroupId: e.target.value || null })}
          className={selectClass}
          disabled={isPending}
        >
          <option value="">Tất cả nhóm</option>
          {groupIdOptions.map((g) => (
            <option key={g} value={g}>{g}</option>
          ))}
        </select>
      )}

      <select
        value={hasMockup}
        onChange={(e) => navigate({ hasMockup: e.target.value || null })}
        className={selectClass}
        disabled={isPending}
      >
        <option value="">Mockup: tất cả</option>
        <option value="true">Có mockup</option>
        <option value="false">Chưa có mockup</option>
      </select>

      <select
        value={hasProductDna}
        onChange={(e) => navigate({ hasProductDna: e.target.value || null })}
        className={selectClass}
        disabled={isPending}
      >
        <option value="">DNA: tất cả</option>
        <option value="true">Có DNA</option>
        <option value="false">Chưa có DNA</option>
      </select>

      {isPending && <span className="text-xs text-slate-500">Đang tải…</span>}
    </div>
  );
}
