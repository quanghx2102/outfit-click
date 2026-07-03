import { cn } from '@/lib/utils';

const STATUS_MAP: Record<string, { label: string; className: string }> = {
  // shared 'active' — product / outfit / user
  active:              { label: 'Active',          className: 'bg-emerald-100 text-emerald-700' },
  // product
  inactive:            { label: 'Inactive',        className: 'bg-amber-100 text-amber-700' },
  missing_from_source: { label: 'Missing',         className: 'bg-rose-100 text-rose-700' },
  // shared 'deleted' — product / outfit / user
  deleted:             { label: 'Deleted',         className: 'bg-red-100 text-red-700' },
  // outfit
  draft:               { label: 'Draft',           className: 'bg-slate-100 text-slate-600' },
  hidden:              { label: 'Hidden',          className: 'bg-amber-100 text-amber-700' },
  // user
  disabled:            { label: 'Disabled',        className: 'bg-slate-100 text-slate-600' },
  // sync
  running:             { label: 'Running',         className: 'bg-sky-100 text-sky-700' },
  success:             { label: 'Success',         className: 'bg-emerald-100 text-emerald-700' },
  partial_success:     { label: 'Partial Success', className: 'bg-amber-100 text-amber-700' },
  failed:              { label: 'Failed',          className: 'bg-red-100 text-red-700' },
};

interface StatusBadgeProps {
  status: string;
  className?: string;
}

export default function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = STATUS_MAP[status];
  const label = config?.label ?? status;
  const colorClass = config?.className ?? 'bg-slate-100 text-slate-600';

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium',
        colorClass,
        className,
      )}
    >
      {label}
    </span>
  );
}
