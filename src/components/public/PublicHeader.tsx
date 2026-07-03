'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { PUBLIC_ROUTES, SEO_CONFIG } from '@/constants/routes';

const NAV_LINKS = [{ label: 'Outfits', href: PUBLIC_ROUTES.OUTFITS }];

export default function PublicHeader() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-100 bg-white/95 backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link
          href={PUBLIC_ROUTES.HOME}
          className="flex items-center gap-2 text-slate-950 transition-opacity hover:opacity-70"
          aria-label={SEO_CONFIG.SITE_NAME}
        >
          <span className="text-xs font-black uppercase tracking-[0.22em] text-slate-950">
            {SEO_CONFIG.SITE_NAME}
          </span>
        </Link>

        {/* Nav */}
        <nav aria-label="Main navigation">
          <ul className="flex items-center gap-0.5">
            {NAV_LINKS.map(({ label, href }) => {
              const isActive = pathname.startsWith(href);
              return (
                <li key={href}>
                  <Link
                    href={href}
                    className={[
                      'rounded-xl px-4 py-2 text-xs font-semibold uppercase tracking-widest transition-colors',
                      isActive
                        ? 'text-slate-950'
                        : 'text-slate-400 hover:text-slate-950',
                    ].join(' ')}
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
