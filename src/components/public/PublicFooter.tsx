import Link from 'next/link';
import { PUBLIC_ROUTES, SEO_CONFIG } from '@/constants/routes';

export default function PublicFooter() {
  return (
    <footer className="mt-auto border-t border-slate-200 bg-white py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
          <p className="text-xs font-bold uppercase tracking-[0.15em] text-slate-950">{SEO_CONFIG.SITE_NAME}</p>

          <nav aria-label="Footer navigation">
            <ul className="flex flex-wrap justify-center gap-4">
              <li>
                <Link
                  href={PUBLIC_ROUTES.OUTFITS}
                  className="text-sm text-slate-500 hover:text-slate-950"
                >
                  Outfit
                </Link>
              </li>
            </ul>
          </nav>

          <p className="text-xs text-slate-400">
            &copy; {new Date().getFullYear()} {SEO_CONFIG.SITE_NAME}
          </p>
        </div>
      </div>
    </footer>
  );
}
