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
    <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-700">
      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
      DNA
    </span>
  ) : (
    <span className="inline-flex items-center gap-1 text-xs text-slate-400">
      <span className="h-1.5 w-1.5 rounded-full bg-slate-300" />
      No DNA
    </span>
  );
}

function MockupIndicator({ has }: { has: boolean }) {
  return has ? (
    <span className="inline-flex items-center gap-1 text-xs font-medium text-sky-700">
      <span className="h-1.5 w-1.5 rounded-full bg-sky-500" />
      Mockup
    </span>
  ) : (
    <span className="inline-flex items-center gap-1 text-xs text-slate-400">
      <span className="h-1.5 w-1.5 rounded-full bg-slate-300" />
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
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
      <Table>
        <TableHeader>
          <TableRow className="bg-slate-50 hover:bg-slate-50">
            <TableHead className="w-16 pl-4">Image</TableHead>
            <TableHead>Name</TableHead>
            <TableHead className="w-36">Source</TableHead>
            <TableHead className="w-28">Status</TableHead>
            <TableHead className="w-28">DNA</TableHead>
            <TableHead className="w-28">Mockup</TableHead>
            <TableHead className="w-40">Last Synced</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((product) => (
            <TableRow key={product.id} className="hover:bg-slate-50">
              <TableCell className="pl-4">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={getProductDisplayImage(product)}
                  alt={product.name}
                  className="h-12 w-12 rounded-xl object-cover"
                />
              </TableCell>
              <TableCell className="max-w-xs">
                <Link
                  href={`/manager/products/${product.id}`}
                  className="line-clamp-2 text-sm font-medium text-slate-900 hover:underline"
                >
                  {product.name}
                </Link>
              </TableCell>
              <TableCell>
                <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-700">
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
              <TableCell className="text-xs text-slate-500">
                {formatDate(product.lastSyncedAt)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
