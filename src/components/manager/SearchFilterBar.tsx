import { cn } from '@/lib/utils';

interface SearchFilterBarProps {
  children: React.ReactNode;
  className?: string;
}

export default function SearchFilterBar({ children, className }: SearchFilterBarProps) {
  return (
    <div className={cn('flex flex-wrap items-end gap-3', className)}>
      {children}
    </div>
  );
}
