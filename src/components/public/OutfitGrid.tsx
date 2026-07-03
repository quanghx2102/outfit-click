import type { ReactNode } from 'react';

interface OutfitGridProps {
  children: ReactNode;
}

export default function OutfitGrid({ children }: OutfitGridProps) {
  return (
    <div className="grid grid-cols-2 gap-x-3 gap-y-8 sm:grid-cols-3 sm:gap-x-4 lg:grid-cols-4">
      {children}
    </div>
  );
}
