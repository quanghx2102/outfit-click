import type { Metadata } from 'next';
import { SEO_CONFIG } from '@/constants/routes';

/**
 * Safely serialize JSON-LD for inline <script> tags.
 * JSON.stringify alone doesn't escape </script>, which can break HTML parsing.
 */
export function safeJsonLd(data: unknown): string {
  return JSON.stringify(data)
    .replace(/</g, '\\u003c')
    .replace(/>/g, '\\u003e')
    .replace(/&/g, '\\u0026');
}

// Minimal shape required to build outfit SEO metadata.
// Structurally compatible with PublicOutfitDetail from outfit.service.ts.
interface OutfitSeoData {
  name: string;
  outfitCode: string;
  slug: string;
  description: string | null;
  coverImageUrl: string;
  style: { name: string } | null;
  outfitType: { name: string } | null;
}

/** Build the canonical URL for a public outfit page. */
export function buildOutfitCanonicalUrl(
  outfit: Pick<OutfitSeoData, 'slug' | 'outfitCode'>,
): string {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? '';
  return `${baseUrl}/outfit/${outfit.slug}-${outfit.outfitCode.toLowerCase()}`;
}

/**
 * Generate Next.js Metadata for a public outfit detail page.
 * Pass null when the outfit is not found (hidden/deleted/draft) — returns noindex metadata.
 */
export function generateOutfitMetadata(outfit: OutfitSeoData | null): Metadata {
  if (!outfit) {
    return {
      title: `Không tìm thấy | ${SEO_CONFIG.SITE_NAME}`,
      robots: SEO_CONFIG.ROBOTS_NOINDEX_NOFOLLOW,
    };
  }

  const canonicalUrl = buildOutfitCanonicalUrl(outfit);
  const title = `${outfit.name} | Outfit ${outfit.outfitCode}`;
  const description =
    outfit.description ??
    `Gợi ý outfit${outfit.style ? ` phong cách ${outfit.style.name}` : ''} độc đáo và dễ phối. Xem chi tiết set đồ và các item gợi ý trong outfit.`;

  return {
    title,
    description,
    alternates: { canonical: canonicalUrl },
    openGraph: {
      title,
      description,
      images: [{ url: outfit.coverImageUrl }],
    },
    robots: SEO_CONFIG.ROBOTS_INDEX_FOLLOW,
  };
}
