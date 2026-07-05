'use client';

import Link from 'next/link';
import { PUBLIC_ROUTES, SEO_CONFIG } from '@/constants/routes';

export default function PublicHeader() {
  return (
    <header
      className="sticky top-0 z-40 w-full border-b"
      style={{
        background: 'rgba(250,247,242,0.92)',
        borderColor: '#E8DED2',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
      }}
    >
      <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link
          href={PUBLIC_ROUTES.HOME}
          className="shrink-0 transition-opacity hover:opacity-70"
          aria-label={SEO_CONFIG.SITE_NAME}
        >
          <span
            className="text-[11px] font-black uppercase"
            style={{ letterSpacing: '0.22em', color: '#111111' }}
          >
            {SEO_CONFIG.SITE_NAME}
          </span>
        </Link>

        {/* Right actions */}
        <div className="flex items-center gap-3">
          {/* Mobile nav toggle placeholder — links to outfits */}
          <Link
            href={PUBLIC_ROUTES.OUTFITS}
            className="flex h-8 w-8 items-center justify-center rounded-full transition-colors hover:bg-black/5 md:hidden"
            style={{ color: '#6B645D' }}
            aria-label="Xem outfit"
          >
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </Link>
        </div>
      </div>
    </header>
  );
}
