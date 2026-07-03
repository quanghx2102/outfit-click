import type { Metadata } from 'next';
import Link from 'next/link';
import { listPublicOutfits } from '@/server/outfits/outfit.service';
import OutfitCard from '@/components/public/OutfitCard';
import OutfitGrid from '@/components/public/OutfitGrid';
import SeoContentBlock from '@/components/public/SeoContentBlock';
import { SEO_CONFIG, PUBLIC_ROUTES } from '@/constants/routes';

const PAGE_LIMIT = 20;

export const metadata: Metadata = {
  title: `Outfit Lookbook | ${SEO_CONFIG.SITE_NAME}`,
  description: SEO_CONFIG.DEFAULT_DESCRIPTION,
};

interface PageProps {
  searchParams: Promise<{ page?: string }>;
}

export default async function OutfitsPage({ searchParams }: PageProps) {
  const { page: pageParam } = await searchParams;
  const page = Math.max(1, parseInt(pageParam ?? '1', 10) || 1);

  const { items, total } = await listPublicOutfits({ page, limit: PAGE_LIMIT });
  const totalPages = Math.ceil(total / PAGE_LIMIT);

  return (
    <main className="flex flex-1 flex-col">
      {/* ── Hero ── */}
      <section className="relative overflow-hidden bg-white px-4 pb-16 pt-20 text-center sm:px-6 sm:pb-24 sm:pt-28 lg:px-8">
        {/* Subtle background accent */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent"
        />
        <div className="mx-auto max-w-2xl">
          <p className="mb-4 text-[10px] font-bold uppercase tracking-[0.3em] text-slate-300">
            Lookbook
          </p>
          <h1 className="text-4xl font-semibold leading-[1.15] tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
            Find outfit ideas<br className="hidden sm:block" /> that fit your style
          </h1>
          <p className="mt-6 text-base leading-relaxed text-slate-400 sm:text-lg">
            Discover curated outfit ideas and tap into items you like.
          </p>
          <div className="mt-10">
            <a
              href="#outfits"
              className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-6 py-2.5 text-xs font-semibold uppercase tracking-widest text-slate-600 transition-all hover:border-slate-950 hover:text-slate-950"
            >
              Explore outfits
              <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </a>
          </div>
        </div>
      </section>

      {/* ── Divider ── */}
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="h-px bg-slate-100" />
      </div>

      {/* ── Outfit grid ── */}
      <section
        id="outfits"
        aria-label="Outfit collection"
        className="mx-auto w-full max-w-7xl flex-1 px-4 py-14 sm:px-6 sm:py-16 lg:px-8"
      >
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 text-center">
            <div className="mb-4 h-16 w-16 rounded-full bg-slate-100" />
            <p className="text-sm font-medium text-slate-400">No outfits published yet.</p>
            <p className="mt-1 text-xs text-slate-300">Check back soon.</p>
          </div>
        ) : (
          <OutfitGrid>
            {items.map((outfit) => (
              <OutfitCard key={outfit.id} {...outfit} />
            ))}
          </OutfitGrid>
        )}

        {/* ── Pagination ── */}
        {totalPages > 1 && (
          <nav aria-label="Pagination" className="mt-16 flex items-center justify-center gap-3">
            {page > 1 && (
              <Link
                href={`${PUBLIC_ROUTES.OUTFITS}?page=${page - 1}`}
                className="inline-flex h-10 items-center gap-1.5 rounded-full border border-slate-200 px-5 text-xs font-semibold uppercase tracking-widest text-slate-500 transition-colors hover:border-slate-950 hover:text-slate-950"
              >
                <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
                Prev
              </Link>
            )}
            <span className="px-2 text-xs font-medium text-slate-400">
              {page} / {totalPages}
            </span>
            {page < totalPages && (
              <Link
                href={`${PUBLIC_ROUTES.OUTFITS}?page=${page + 1}`}
                className="inline-flex h-10 items-center gap-1.5 rounded-full border border-slate-200 px-5 text-xs font-semibold uppercase tracking-widest text-slate-500 transition-colors hover:border-slate-950 hover:text-slate-950"
              >
                Next
                <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            )}
          </nav>
        )}
      </section>

      <SeoContentBlock />
    </main>
  );
}
