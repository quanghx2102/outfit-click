import Link from 'next/link';
import { PUBLIC_ROUTES, SEO_CONFIG } from '@/constants/routes';

export default function PublicFooter() {
  return (
    <footer className="mt-auto border-t border-slate-100 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center gap-6 sm:flex-row sm:justify-between">
          {/* Brand */}
          <Link
            href={PUBLIC_ROUTES.HOME}
            className="text-[10px] font-black uppercase tracking-[0.28em] text-slate-950 transition-opacity hover:opacity-60"
          >
            {SEO_CONFIG.SITE_NAME}
          </Link>

          {/* Nav */}
          <nav aria-label="Footer navigation">
            <ul className="flex flex-wrap justify-center gap-6">
              <li>
                <Link
                  href={PUBLIC_ROUTES.OUTFITS}
                  className="text-xs font-medium uppercase tracking-widest text-slate-400 transition-colors hover:text-slate-950"
                >
                  Outfits
                </Link>
              </li>
            </ul>
          </nav>

          {/* Copyright */}
          <p className="text-[10px] tracking-wide text-slate-300">
            &copy; {new Date().getFullYear()} {SEO_CONFIG.SITE_NAME}
          </p>
        </div>
      </div>
    </footer>
  );
}
