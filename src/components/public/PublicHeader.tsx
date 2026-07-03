'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { PUBLIC_ROUTES, SEO_CONFIG } from '@/constants/routes';

const NAV_LINKS = [{ label: 'Outfit', href: PUBLIC_ROUTES.OUTFITS }];

export default function PublicHeader() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 bg-white">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link
          href={PUBLIC_ROUTES.HOME}
          className="text-sm font-bold uppercase tracking-[0.15em] text-slate-950"
        >
          {SEO_CONFIG.SITE_NAME}
        </Link>

        <nav aria-label="Main navigation">
          <ul className="flex items-center gap-1">
            {NAV_LINKS.map(({ label, href }) => {
              const isActive = pathname.startsWith(href);
              return (
                <li key={href}>
                  <Link
                    href={href}
                    className={`rounded-xl px-3 py-1.5 text-sm transition-colors ${
                      isActive
                        ? 'bg-slate-100 font-medium text-slate-950'
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-950'
                    }`}
                  >
                    {label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </header>
  );
}
