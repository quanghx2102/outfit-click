import Link from 'next/link';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import StatusBadge from '@/components/manager/StatusBadge';
import type { OutfitListItem } from '@/server/outfits/outfit.service';

function formatDate(date: Date | null): string {
  if (!date) return '—';
  return new Intl.DateTimeFormat('vi-VN', {
    dateStyle: 'short',
    timeStyle: 'short',
  }).format(new Date(date));
}

interface OutfitTableProps {
  items: OutfitListItem[];
}

export default function OutfitTable({ items }: OutfitTableProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
      <Table>
        <TableHeader>
          <TableRow className="border-slate-100 bg-slate-50/80 hover:bg-slate-50/80">
            <TableHead className="w-[68px] pl-5 text-[10px] font-bold uppercase tracking-widest text-slate-400">
              Ảnh bìa
            </TableHead>
            <TableHead className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
              Tên
            </TableHead>
            <TableHead className="w-28 text-[10px] font-bold uppercase tracking-widest text-slate-400">
              Mã
            </TableHead>
            <TableHead className="w-28 text-[10px] font-bold uppercase tracking-widest text-slate-400">
              Trạng thái
            </TableHead>
            <TableHead className="w-20 text-center text-[10px] font-bold uppercase tracking-widest text-slate-400">
              Sản phẩm
            </TableHead>
            <TableHead className="w-40 text-[10px] font-bold uppercase tracking-widest text-slate-400">
              Ngày đăng
            </TableHead>
            <TableHead className="w-12" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((outfit) => (
            <TableRow key={outfit.id} className="border-slate-100 transition-colors hover:bg-slate-50/60">
              <TableCell className="pl-5">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={outfit.coverImageUrl}
                  alt={outfit.name}
                  className="h-14 w-14 rounded-xl border border-slate-100 object-cover"
                />
              </TableCell>
              <TableCell className="max-w-xs">
                <Link
                  href={`/manager/outfits/${outfit.id}`}
                  className="line-clamp-2 text-[13px] font-medium text-slate-900 transition-colors hover:text-slate-500"
                >
                  {outfit.name}
                </Link>
                {(outfit.style ?? outfit.outfitType) && (
                  <div className="mt-1.5 flex flex-wrap gap-1">
                    {outfit.style && (
                      <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-500">
                        {outfit.style.name}
                      </span>
                    )}
                    {outfit.outfitType && (
                      <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-500">
                        {outfit.outfitType.name}
                      </span>
                    )}
                  </div>
                )}
              </TableCell>
              <TableCell>
                <span className="font-mono text-[11px] font-semibold text-slate-500">
                  {outfit.outfitCode}
                </span>
              </TableCell>
              <TableCell>
                <StatusBadge status={outfit.status} />
              </TableCell>
              <TableCell className="text-center text-[13px] font-medium text-slate-600">
                {outfit.productCount}
              </TableCell>
              <TableCell className="text-[11px] text-slate-400">
                {formatDate(outfit.publishedAt)}
              </TableCell>
              <TableCell>
                <Link
                  href={`/manager/outfits/${outfit.id}`}
                  className="inline-flex h-7 items-center rounded-lg px-2.5 text-[12px] font-medium text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900"
                >
                  Sửa
                </Link>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
