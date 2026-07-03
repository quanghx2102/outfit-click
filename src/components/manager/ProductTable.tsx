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
import type { ProductListItem } from '@/server/products/product.service';
import { getProductDisplayImage } from '@/lib/utils';

function formatDate(date: Date | null): string {
  if (!date) return '—';
  return new Intl.DateTimeFormat('vi-VN', {
    dateStyle: 'short',
    timeStyle: 'short',
  }).format(new Date(date));
}

function DnaIndicator({ has }: { has: boolean }) {
  return has ? (
    <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-emerald-600">
      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
      DNA
    </span>
  ) : (
    <span className="inline-flex items-center gap-1.5 text-[11px] text-slate-300">
      <span className="h-1.5 w-1.5 rounded-full bg-slate-200" />
      No DNA
    </span>
  );
}

function MockupIndicator({ has }: { has: boolean }) {
  return has ? (
    <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-sky-600">
      <span className="h-1.5 w-1.5 rounded-full bg-sky-500" />
      Mockup
    </span>
  ) : (
    <span className="inline-flex items-center gap-1.5 text-[11px] text-slate-300">
      <span className="h-1.5 w-1.5 rounded-full bg-slate-200" />
      No Mockup
    </span>
  );
}

interface ProductTableProps {
  items: ProductListItem[];
}

export default function ProductTable({ items }: ProductTableProps) {
  if (items.length === 0) {
    return null;
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
      <Table>
        <TableHeader>
          <TableRow className="border-slate-100 bg-slate-50/80 hover:bg-slate-50/80">
            <TableHead className="w-[68px] pl-5 text-[10px] font-bold uppercase tracking-widest text-slate-400">
              Image
            </TableHead>
            <TableHead className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
              Name
            </TableHead>
            <TableHead className="w-32 text-[10px] font-bold uppercase tracking-widest text-slate-400">
              Source
            </TableHead>
            <TableHead className="w-28 text-[10px] font-bold uppercase tracking-widest text-slate-400">
              Status
            </TableHead>
            <TableHead className="w-24 text-[10px] font-bold uppercase tracking-widest text-slate-400">
              DNA
            </TableHead>
            <TableHead className="w-28 text-[10px] font-bold uppercase tracking-widest text-slate-400">
              Mockup
            </TableHead>
            <TableHead className="w-36 text-[10px] font-bold uppercase tracking-widest text-slate-400">
              Last Synced
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((product) => (
            <TableRow key={product.id} className="border-slate-100 transition-colors hover:bg-slate-50/60">
              <TableCell className="pl-5">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={getProductDisplayImage(product)}
                  alt={product.name}
                  className="h-14 w-14 rounded-xl border border-slate-100 object-cover"
                />
              </TableCell>
              <TableCell className="max-w-xs">
                <Link
                  href={`/manager/products/${product.id}`}
                  className="line-clamp-2 text-[13px] font-medium text-slate-900 transition-colors hover:text-slate-500"
                >
                  {product.name}
                </Link>
              </TableCell>
              <TableCell>
                <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-0.5 text-[11px] font-semibold text-slate-600">
                  {product.urlSuffix}
                </span>
              </TableCell>
              <TableCell>
                <StatusBadge status={product.status} />
              </TableCell>
              <TableCell>
                <DnaIndicator has={product.hasDna} />
              </TableCell>
              <TableCell>
                <MockupIndicator has={product.hasMockup} />
              </TableCell>
              <TableCell className="text-[11px] text-slate-400">
                {formatDate(product.lastSyncedAt)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
