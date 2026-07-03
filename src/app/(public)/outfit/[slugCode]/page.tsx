import { cache } from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getPublicOutfitDetail, getRelatedOutfits } from '@/server/outfits/outfit.service';
import OutfitHero from '@/components/public/OutfitHero';
import ProductClickCard from '@/components/public/ProductClickCard';
import RelatedOutfits from '@/components/public/RelatedOutfits';
import SeoContentBlock from '@/components/public/SeoContentBlock';
import TrackOutfitView from '@/components/public/TrackOutfitView';
import { buildOutfitCanonicalUrl, generateOutfitMetadata, safeJsonLd } from '@/lib/seo';

type Props = {
  params: Promise<{ slugCode: string }>;
};

// Memoize per-request so generateMetadata and the page component share one DB call.
const getOutfitDetailCached = cache(getPublicOutfitDetail);

/** Extract 6-char outfit code from URL segment `{slug}-{code}`. */
function extractOutfitCode(slugCode: string): string {
  const lastHyphenIdx = slugCode.lastIndexOf('-');
  if (lastHyphenIdx === -1) return slugCode.toUpperCase();
  return slugCode.slice(lastHyphenIdx + 1).toUpperCase();
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slugCode } = await params;
  const outfitCode = extractOutfitCode(slugCode);
  const outfit = await getOutfitDetailCached(outfitCode);
  return generateOutfitMetadata(outfit);
}

export default async function OutfitDetailPage({ params }: Props) {
  const { slugCode } = await params;
  const outfitCode = extractOutfitCode(slugCode);
  const outfit = await getOutfitDetailCached(outfitCode);

  if (!outfit) notFound();

  const relatedOutfits = await getRelatedOutfits(
    outfit.id,
    outfit.style?.slug ?? null,
    outfit.outfitType?.slug ?? null,
  );

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? '';
  const canonicalUrl = buildOutfitCanonicalUrl(outfit);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: outfit.name,
    ...(outfit.description ? { description: outfit.description } : {}),
    url: canonicalUrl,
    image: outfit.coverImageUrl,
    mainEntity: {
      '@type': 'ItemList',
      name: `Danh sách sản phẩm trong outfit ${outfit.outfitCode}`,
      itemListElement: outfit.products.map((p, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        name: p.name,
        url: `${baseUrl}${p.redirectPath}`,
      })),
    },
  };

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Outfit',
        item: `${baseUrl}/outfits`,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: outfit.name,
        item: canonicalUrl,
      },
    ],
  };

  return (
    <>
      <TrackOutfitView outfitId={outfit.id} outfitCode={outfit.outfitCode} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(breadcrumbJsonLd) }}
      />

      <main className="mx-auto w-full max-w-5xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        {/* Hero — cover + info */}
        <OutfitHero
          name={outfit.name}
          outfitCode={outfit.outfitCode}
          coverImageUrl={outfit.coverImageUrl}
          description={outfit.description}
          style={outfit.style}
          outfitType={outfit.outfitType}
        />

        {/* ── Products section ── */}
        {outfit.products.length > 0 ? (
          <section aria-labelledby="products-heading" className="mt-20">
            {/* Section header */}
            <div className="mb-8 flex items-center gap-4">
              <div className="h-px flex-1 bg-slate-100" />
              <div className="flex items-center gap-3">
                <h2
                  id="products-heading"
                  className="text-xs font-bold uppercase tracking-[0.22em] text-slate-400"
                >
                  Items in this outfit
                </h2>
                <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-500">
                  {outfit.products.length}
                </span>
              </div>
              <div className="h-px flex-1 bg-slate-100" />
            </div>

            <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 sm:gap-x-5 md:grid-cols-4 lg:gap-x-6">
              {outfit.products.map((product) => (
                <ProductClickCard
                  key={product.id}
                  name={product.name}
                  displayImageUrl={product.displayImageUrl}
                  redirectPath={product.redirectPath}
                  outfitCode={outfit.outfitCode}
                />
              ))}
            </div>
          </section>
        ) : (
          <div className="mt-16 flex flex-col items-center py-12 text-center">
            <p className="text-sm text-slate-400">No items in this outfit yet.</p>
          </div>
        )}

        {/* ── How to style block (uses description if present) ── */}
        {outfit.description && outfit.products.length > 0 && (
          <section className="mt-16 rounded-2xl border border-slate-100 bg-slate-50/70 px-8 py-10 text-center">
            <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.25em] text-slate-300">
              How to style
            </p>
            <p className="text-sm leading-relaxed text-slate-500">{outfit.description}</p>
          </section>
        )}

        {/* ── Related outfits ── */}
        <RelatedOutfits outfits={relatedOutfits} />

        <SeoContentBlock
          heading={`${outfit.style?.name ?? outfit.outfitType?.name ?? 'Curated'} outfit inspiration`}
          body={
            outfit.description ??
            'Explore carefully curated outfits across styles. Click any item to discover it further.'
          }
        />
      </main>
    </>
  );
}
