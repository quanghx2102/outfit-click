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
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
      <Table>
        <TableHeader>
          <TableRow className="bg-slate-50">
            <TableHead className="w-16">Cover</TableHead>
            <TableHead>Name</TableHead>
            <TableHead className="w-28">Code</TableHead>
            <TableHead className="w-28">Status</TableHead>
            <TableHead className="w-20 text-center">Products</TableHead>
            <TableHead className="w-40">Published At</TableHead>
            <TableHead className="w-12" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((outfit) => (
            <TableRow key={outfit.id} className="hover:bg-slate-50">
              <TableCell>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={outfit.coverImageUrl}
                  alt={outfit.name}
                  className="h-12 w-12 rounded-xl object-cover"
                />
              </TableCell>
              <TableCell className="max-w-xs">
                <Link
                  href={`/manager/outfits/${outfit.id}`}
                  className="line-clamp-2 text-sm font-medium text-slate-900 hover:text-slate-600"
                >
                  {outfit.name}
                </Link>
                {(outfit.style || outfit.outfitType) && (
                  <div className="mt-1 flex flex-wrap gap-1">
                    {outfit.style && (
                      <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-600">
                        {outfit.style.name}
                      </span>
                    )}
                    {outfit.outfitType && (
                      <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-600">
                        {outfit.outfitType.name}
                      </span>
                    )}
                  </div>
                )}
              </TableCell>
              <TableCell>
                <span className="font-mono text-xs text-slate-500">{outfit.outfitCode}</span>
              </TableCell>
              <TableCell>
                <StatusBadge status={outfit.status} />
              </TableCell>
              <TableCell className="text-center text-sm text-slate-600">
                {outfit.productCount}
              </TableCell>
              <TableCell className="text-xs text-slate-500">
                {formatDate(outfit.publishedAt)}
              </TableCell>
              <TableCell>
                <Link
                  href={`/manager/outfits/${outfit.id}`}
                  className="inline-flex h-8 items-center rounded-lg px-2.5 text-xs font-medium text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900"
                >
                  Edit
                </Link>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
