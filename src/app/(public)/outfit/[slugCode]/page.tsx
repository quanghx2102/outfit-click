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
      name: `Items in outfit ${outfit.outfitCode}`,
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
        name: 'Outfits',
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

      <main
        className="w-full"
        style={{ background: '#FAF7F2' }}
      >
        {/* Hero section */}
        <div className="mx-auto w-full max-w-5xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
          <OutfitHero
            name={outfit.name}
            outfitCode={outfit.outfitCode}
            coverImageUrl={outfit.coverImageUrl}
            description={outfit.description}
            style={outfit.style}
            outfitType={outfit.outfitType}
          />
        </div>

        {/* Items in this outfit */}
        {outfit.products.length > 0 ? (
          <section
            aria-labelledby="products-heading"
            className="border-t py-14"
            style={{ borderColor: '#E8DED2' }}
          >
            <div className="mx-auto w-full max-w-5xl px-4 sm:px-6 lg:px-8">
              {/* Section title */}
              <div className="mb-10 flex items-center gap-4">
                <h2
                  id="products-heading"
                  className="text-xl font-bold"
                  style={{ color: '#111111' }}
                >
                  Sản phẩm trong outfit này
                </h2>
                <span
                  className="rounded-full px-2.5 py-0.5 text-xs font-semibold"
                  style={{ background: '#F3EEE7', color: '#9A7654' }}
                >
                  {outfit.products.length}
                </span>
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
            </div>
          </section>
        ) : (
          <div className="mx-auto max-w-5xl px-4 py-16 text-center sm:px-6 lg:px-8">
            <p className="text-sm" style={{ color: '#9A9289' }}>Outfit này chưa có sản phẩm nào.</p>
          </div>
        )}

        {/* Related outfits */}
        <div
          className="border-t"
          style={{ borderColor: '#E8DED2' }}
        >
          <div className="mx-auto w-full max-w-5xl px-4 sm:px-6 lg:px-8">
            <RelatedOutfits outfits={relatedOutfits} />
          </div>
        </div>

        <SeoContentBlock
          heading={`Ý tưởng phối đồ ${outfit.style?.name ?? outfit.outfitType?.name ?? 'tuyển chọn'}`}
          body={
            outfit.description ??
            'Khám phá các outfit được tuyển chọn theo nhiều phong cách. Chạm vào sản phẩm để xem thêm.'
          }
        />
      </main>
    </>
  );
}
