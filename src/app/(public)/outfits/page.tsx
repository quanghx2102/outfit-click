import type { Metadata } from 'next';
import Link from 'next/link';
import { listPublicOutfits } from '@/server/outfits/outfit.service';
import OutfitCard from '@/components/public/OutfitCard';
import OutfitGrid from '@/components/public/OutfitGrid';
import SeoContentBlock from '@/components/public/SeoContentBlock';
import { SEO_CONFIG, PUBLIC_ROUTES } from '@/constants/routes';

const PAGE_LIMIT = 20;

export const metadata: Metadata = {
  title: `Danh sách Outfit | ${SEO_CONFIG.SITE_NAME}`,
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
      {/* Hero */}
      <section className="border-b border-slate-100 bg-white px-4 py-14 text-center sm:px-6 sm:py-20">
        <div className="mx-auto max-w-xl">
          <p className="mb-3 text-xs font-medium uppercase tracking-[0.2em] text-slate-400">
            Lookbook
          </p>
          <h1 className="text-3xl font-semibold leading-tight tracking-tight text-slate-950 sm:text-4xl">
            Find outfit ideas that fit your style
          </h1>
          <p className="mt-4 text-base leading-relaxed text-slate-500">
            Discover curated outfit ideas and tap into items you like.
          </p>
        </div>
      </section>

      {/* Outfit grid */}
      <section className="mx-auto w-full max-w-7xl flex-1 px-4 py-12 sm:px-6">
        {items.length === 0 ? (
          <p className="py-24 text-center text-sm text-slate-400">No outfits yet.</p>
        ) : (
          <OutfitGrid>
            {items.map((outfit) => (
              <OutfitCard key={outfit.id} {...outfit} />
            ))}
          </OutfitGrid>
        )}

        {totalPages > 1 && (
          <nav aria-label="Pagination" className="mt-14 flex items-center justify-center gap-2">
            {page > 1 && (
              <Link
                href={`${PUBLIC_ROUTES.OUTFITS}?page=${page - 1}`}
                className="rounded-xl border border-slate-200 px-4 py-2 text-sm text-slate-600 transition-colors hover:bg-slate-50 hover:text-slate-950"
              >
                ← Previous
              </Link>
            )}
            <span className="rounded-xl bg-slate-950 px-4 py-2 text-sm font-medium text-white">
              {page} / {totalPages}
            </span>
            {page < totalPages && (
              <Link
                href={`${PUBLIC_ROUTES.OUTFITS}?page=${page + 1}`}
                className="rounded-xl border border-slate-200 px-4 py-2 text-sm text-slate-600 transition-colors hover:bg-slate-50 hover:text-slate-950"
              >
                Next →
              </Link>
            )}
          </nav>
        )}
      </section>

      <SeoContentBlock />
    </main>
  );
}
