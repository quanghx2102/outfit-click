import Link from 'next/link';
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

function YesBadge() {
  return (
    <span
      className="inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-semibold"
      style={{ background: '#DCFCE7', color: '#166534' }}
    >
      Yes
    </span>
  );
}

function NoBadge() {
  return (
    <span
      className="inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-semibold"
      style={{ background: '#FEE2E2', color: '#991B1B' }}
    >
      No
    </span>
  );
}

interface ProductTableProps {
  items: ProductListItem[];
}

export default function ProductTable({ items }: ProductTableProps) {
  if (items.length === 0) return null;

  return (
    <div
      className="overflow-hidden rounded-2xl border"
      style={{ borderColor: '#E5E7EB', background: '#FFFFFF' }}
    >
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr style={{ background: '#F9FAFB', borderBottom: '1px solid #E5E7EB' }}>
              {['Sản phẩm', 'Nguồn', 'Nhóm', 'Mockup', 'DNA', 'Trạng thái', 'Đồng bộ lần cuối', 'Thao tác'].map((h) => (
                <th
                  key={h}
                  className="px-4 py-3 text-left text-[10px] font-bold uppercase"
                  style={{ letterSpacing: '0.1em', color: '#6B7280' }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {items.map((product, idx) => (
              <tr
                key={product.id}
                className="transition-colors hover:bg-gray-50/60"
                style={{
                  borderTop: idx === 0 ? 'none' : '1px solid #F3F4F6',
                  height: '72px',
                }}
              >
                {/* Product */}
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div
                      className="h-14 w-14 shrink-0 overflow-hidden rounded-xl"
                      style={{ border: '1px solid #E5E7EB', background: '#F9FAFB' }}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={getProductDisplayImage(product)}
                        alt={product.name}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="min-w-0">
                      <Link
                        href={`/manager/products/${product.id}`}
                        className="line-clamp-2 text-[13px] font-medium transition-colors hover:opacity-60"
                        style={{ color: '#111827' }}
                      >
                        {product.name}
                      </Link>
                    </div>
                  </div>
                </td>

                {/* Source / urlSuffix */}
                <td className="px-4 py-3">
                  <span
                    className="inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold"
                    style={{ background: '#F3F4F6', color: '#374151' }}
                  >
                    {product.urlSuffix}
                  </span>
                </td>

                {/* Group */}
                <td className="px-4 py-3">
                  {product.externalGroupName ? (
                    <span className="text-[12px]" style={{ color: '#6B7280' }}>
                      {product.externalGroupName}
                    </span>
                  ) : (
                    <span style={{ color: '#D1D5DB' }}>—</span>
                  )}
                </td>

                {/* Mockup */}
                <td className="px-4 py-3">
                  {product.hasMockup ? <YesBadge /> : <NoBadge />}
                </td>

                {/* DNA */}
                <td className="px-4 py-3">
                  {product.hasDna ? <YesBadge /> : <NoBadge />}
                </td>

                {/* Status */}
                <td className="px-4 py-3">
                  <StatusBadge status={product.status} />
                </td>

                {/* Last synced */}
                <td className="whitespace-nowrap px-4 py-3 text-[11px]" style={{ color: '#9CA3AF' }}>
                  {formatDate(product.lastSyncedAt)}
                </td>

                {/* Actions */}
                <td className="px-4 py-3">
                  <Link
                    href={`/manager/products/${product.id}`}
                    className="inline-flex items-center rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors hover:bg-gray-50"
                    style={{ borderColor: '#E5E7EB', color: '#374151' }}
                    title="Chỉnh sửa sản phẩm"
                  >
                    Sửa
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
