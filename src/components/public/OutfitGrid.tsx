import type { ReactNode } from 'react';

interface OutfitGridProps {
  children: ReactNode;
}

export default function OutfitGrid({ children }: OutfitGridProps) {
  return (
    <div className="grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-3 sm:gap-x-5 lg:grid-cols-4 lg:gap-x-6">
      {children}
    </div>
  );
}
