import type { Metadata } from 'next';
import Link from 'next/link';
import { unstable_cache } from 'next/cache';
import { listPublicOutfits, getDistinctStyles } from '@/server/outfits/outfit.service';
import OutfitCard from '@/components/public/OutfitCard';
import OutfitGrid from '@/components/public/OutfitGrid';
import SeoContentBlock from '@/components/public/SeoContentBlock';
import { SEO_CONFIG, PUBLIC_ROUTES } from '@/constants/routes';

const PAGE_LIMIT = 20;

// Cache for 1 hour (3600s). Public outfit listings change infrequently.
export const revalidate = 3600;

// Cached version of getDistinctStyles with 60-minute TTL
const getCachedDistinctStyles = unstable_cache(
  () => getDistinctStyles(),
  ['distinct-styles'],
  { revalidate: 3600, tags: ['styles'] }
);

// Cached version of listPublicOutfits with 60-minute TTL
const getCachedPublicOutfits = unstable_cache(
  (page: number, limit: number, keyword?: string, styleSlug?: string) =>
    listPublicOutfits({ page, limit, keyword, styleSlug }),
  ['public-outfits'],
  { revalidate: 3600, tags: ['outfits'] }
);

export const metadata: Metadata = {
  title: `Outfit Lookbook | ${SEO_CONFIG.SITE_NAME}`,
  description: SEO_CONFIG.DEFAULT_DESCRIPTION,
};

interface PageProps {
  searchParams: Promise<{ page?: string; q?: string; style?: string }>;
}

export default async function OutfitsPage({ searchParams }: PageProps) {
  const { page: pageParam, q, style } = await searchParams;
  const page = Math.max(1, parseInt(pageParam ?? '1', 10) || 1);
  const keyword = q?.trim() || undefined;
  const styleSlug = style?.trim() || undefined;

  const [{ items, total }, styleOptions] = await Promise.all([
    getCachedPublicOutfits(page, PAGE_LIMIT, keyword, styleSlug),
    getCachedDistinctStyles(),
  ]);
  const totalPages = Math.ceil(total / PAGE_LIMIT);
  const activeStyle = styleOptions.find((s) => s.slug === styleSlug);

  // Preserve current filters when building pagination/style links
  const buildQuery = (overrides: Record<string, string | undefined>) => {
    const params = new URLSearchParams();
    const merged = { q: keyword, style: styleSlug, page: undefined as string | undefined, ...overrides };
    if (merged.q) params.set('q', merged.q);
    if (merged.style) params.set('style', merged.style);
    if (merged.page) params.set('page', merged.page);
    const qs = params.toString();
    return qs ? `${PUBLIC_ROUTES.OUTFITS}?${qs}` : PUBLIC_ROUTES.OUTFITS;
  };

  return (
    <main className="flex flex-1 flex-col" style={{ background: '#FAF7F2' }}>
      {/* ── Search + Style filter ── */}
      <section
        className="border-y py-5"
        style={{ borderColor: '#E8DED2', background: '#FAF7F2' }}
        aria-label="Search and style filters"
      >
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 sm:px-6 lg:px-8">
          {/* Search form */}
          <form action={PUBLIC_ROUTES.OUTFITS} method="get" className="flex w-full items-center gap-2">
            {styleSlug && <input type="hidden" name="style" value={styleSlug} />}
            <input
              type="text"
              name="q"
              defaultValue={keyword ?? ''}
              placeholder="Tìm outfit theo tên hoặc mã code..."
              className="h-10 flex-1 rounded-lg border px-3 text-sm outline-none transition-colors focus:border-[#9A7654]"
              style={{ borderColor: '#E8DED2', color: '#111111', background: '#FFFFFF' }}
            />
            <button
              type="submit"
              className="inline-flex h-10 items-center rounded-lg px-4 text-sm font-semibold text-white transition-opacity hover:opacity-85"
              style={{ background: '#9A7654' }}
            >
              Tìm kiếm
            </button>
          </form>

          {/* Style chips */}
          {styleOptions.length > 0 && (
            <div className="flex flex-wrap gap-2">
              <Link
                href={buildQuery({ style: undefined })}
                className="rounded-full border px-4 py-1.5 text-[13px] font-medium transition-all hover:bg-[#9A7654] hover:text-white"
                style={{
                  borderColor: '#9A7654',
                  color: !styleSlug ? '#FFFFFF' : '#5C4432',
                  background: !styleSlug ? '#9A7654' : 'transparent',
                }}
              >
                Tất cả
              </Link>
              {styleOptions.map((option) => {
                const isActive = option.slug === styleSlug;
                return (
                  <Link
                    key={option.id}
                    href={buildQuery({ style: option.slug })}
                    className="rounded-full border px-4 py-1.5 text-[13px] font-medium transition-all hover:bg-[#9A7654] hover:text-white"
                    style={{
                      borderColor: '#9A7654',
                      color: isActive ? '#FFFFFF' : '#5C4432',
                      background: isActive ? '#9A7654' : 'transparent',
                    }}
                  >
                    {option.name}
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* ── Outfit grid ── */}
      <section
        id="outfits"
        aria-label="Outfit collection"
        className="mx-auto w-full max-w-7xl flex-1 px-4 py-14 sm:px-6 sm:py-16 lg:px-8"
      >
        {/* Section header */}
        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-2xl font-bold" style={{ color: '#111111' }}>
            {keyword || activeStyle
              ? `Kết quả ${activeStyle ? `cho "${activeStyle.name}"` : ''}${keyword ? ` "${keyword}"` : ''}`
              : 'Outfit mới nhất'}
          </h2>
          {(keyword || styleSlug) && (
            <Link
              href={PUBLIC_ROUTES.OUTFITS}
              className="text-[13px] font-medium transition-opacity hover:opacity-60"
              style={{ color: '#9A7654' }}
            >
              Xem tất cả outfit →
            </Link>
          )}
        </div>

        {items.length === 0 ? (
          /* Beautiful empty state — no tiny dot */
          <div className="flex flex-col items-center py-24 text-center">
            {/* Placeholder fashion card stack */}
            <div className="relative mb-8 h-36 w-48">
              <div
                className="absolute inset-0 rotate-[-6deg] rounded-[1.5rem]"
                style={{ background: '#E8DED2' }}
              />
              <div
                className="absolute inset-0 rotate-[-2deg] rounded-[1.5rem]"
                style={{ background: '#D4C4B0' }}
              />
              <div
                className="absolute inset-0 rounded-[1.5rem] shadow-xl"
                style={{ background: 'linear-gradient(135deg, #C9B8A1 0%, #9A7654 100%)' }}
              >
                <div className="flex h-full items-center justify-center">
                  <svg width="32" height="32" fill="none" viewBox="0 0 24 24" stroke="rgba(255,255,255,0.7)" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                  </svg>
                </div>
              </div>
            </div>
            <h3 className="text-xl font-semibold" style={{ color: '#111111' }}>
              {keyword || styleSlug
                ? 'Không tìm thấy outfit phù hợp'
                : 'Chưa có outfit nào được xuất bản'}
            </h3>
            <p className="mt-2 max-w-xs text-[13px] leading-relaxed" style={{ color: '#9A9289' }}>
              {keyword || styleSlug
                ? 'Thử từ khóa khác hoặc bỏ bớt bộ lọc để xem thêm outfit.'
                : 'Các outfit mới sẽ xuất hiện tại đây. Vui lòng quay lại sau.'}
            </p>
            <Link
              href={keyword || styleSlug ? PUBLIC_ROUTES.OUTFITS : '/manager'}
              className="mt-6 inline-flex items-center rounded-lg px-5 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-85"
              style={{ background: '#9A7654' }}
            >
              {keyword || styleSlug ? 'Xem tất cả outfit' : 'Vào trang quản lý'}
            </Link>
          </div>
        ) : (
          <OutfitGrid>
            {items.map((outfit) => (
              <OutfitCard key={outfit.id} {...outfit} />
            ))}
          </OutfitGrid>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <nav aria-label="Pagination" className="mt-16 flex items-center justify-center gap-3">
            {page > 1 && (
              <Link
                href={buildQuery({ page: String(page - 1) })}
                className="inline-flex h-10 items-center gap-1.5 rounded-full border px-5 text-xs font-semibold uppercase transition-colors hover:opacity-70"
                style={{ borderColor: '#E8DED2', color: '#6B645D', letterSpacing: '0.1em' }}
              >
                ← Trước
              </Link>
            )}
            <span className="px-2 text-xs font-medium" style={{ color: '#9A9289' }}>
              {page} / {totalPages}
            </span>
            {page < totalPages && (
              <Link
                href={buildQuery({ page: String(page + 1) })}
                className="inline-flex h-10 items-center gap-1.5 rounded-full border px-5 text-xs font-semibold uppercase transition-colors hover:opacity-70"
                style={{ borderColor: '#E8DED2', color: '#6B645D', letterSpacing: '0.1em' }}
              >
                Tiếp →
              </Link>
            )}
          </nav>
        )}
      </section>

      <SeoContentBlock />
    </main>
  );
}
