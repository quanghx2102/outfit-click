import { cn } from '@/lib/utils';

interface LoadingStateProps {
  rows?: number;
  className?: string;
}

export default function LoadingState({ rows = 5, className }: LoadingStateProps) {
  return (
    <div className={cn('space-y-3', className)} aria-label="Loading…" aria-busy>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="h-12 animate-pulse rounded-xl bg-slate-100" />
      ))}
    </div>
  );
}
