import type { ReactNode } from 'react';
import PublicHeader from '@/components/public/PublicHeader';
import PublicFooter from '@/components/public/PublicFooter';

export default function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <PublicHeader />
      <div className="flex flex-1 flex-col">{children}</div>
      <PublicFooter />
    </>
  );
}
