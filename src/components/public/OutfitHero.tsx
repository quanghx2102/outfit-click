import Image from 'next/image';
import Link from 'next/link';
import { PUBLIC_ROUTES } from '@/constants/routes';

export interface OutfitHeroProps {
  name: string;
  outfitCode: string;
  coverImageUrl: string;
  description: string | null;
  style?: { name: string } | null;
  outfitType?: { name: string } | null;
}

export default function OutfitHero({
  name,
  outfitCode,
  coverImageUrl,
  description,
  style,
  outfitType,
}: OutfitHeroProps) {
  const coverAlt = `${name} — ${style?.name ?? outfitType?.name ?? outfitCode} outfit`;
  const tags = [style?.name, outfitType?.name].filter(Boolean) as string[];

  return (
    <>
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="mb-10 flex items-center gap-2 text-xs" style={{ color: '#9A9289' }}>
        <Link
          href={PUBLIC_ROUTES.OUTFITS}
          className="font-semibold uppercase transition-opacity hover:opacity-60"
          style={{ letterSpacing: '0.14em', color: '#6B645D' }}
        >
          Outfit
        </Link>
        <span aria-hidden="true" style={{ color: '#E8DED2' }}>›</span>
        <span className="max-w-[180px] truncate font-medium sm:max-w-sm" style={{ color: '#111111' }}>
          {name}
        </span>
      </nav>

      {/* Cover + Info — 2-column on md+ */}
      <div className="grid gap-10 md:grid-cols-[5fr_7fr] md:gap-14 lg:gap-16">
        {/* Cover image */}
        <div
          className="relative aspect-[9/16] overflow-hidden rounded-[1.75rem] shadow-xl"
          style={{ background: '#F3EEE7' }}
        >
          {coverImageUrl ? (
            <Image
              src={coverImageUrl}
              alt={coverAlt}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 40vw"
              className="object-contain"
            />
          ) : (
            <div
              className="flex h-full items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #F3EEE7 0%, #E8DED2 100%)' }}
            >
              <span className="text-sm" style={{ color: '#9A9289' }}>Chưa có ảnh</span>
            </div>
          )}
        </div>

        {/* Info panel */}
        <div className="flex flex-col justify-center gap-0 py-2">
          {/* Eyebrow */}
          <p
            className="mb-3 text-[10px] font-bold uppercase"
            style={{ letterSpacing: '0.26em', color: '#9A7654' }}
          >
            Mã Outfit
          </p>

          {/* Code badge */}
          <div className="mb-6 inline-flex items-center gap-2">
            <span
              className="rounded-lg px-3 py-1 font-mono text-sm font-bold"
              style={{ background: '#F3EEE7', color: '#5C4432' }}
            >
              {outfitCode}
            </span>
          </div>

          {/* H1 */}
          <h1
            className="font-serif text-3xl font-bold leading-[1.1] tracking-tight sm:text-4xl lg:text-5xl"
            style={{ color: '#111111' }}
          >
            {name}
          </h1>

          {/* Tag badges */}
          {tags.length > 0 && (
            <div className="mt-5 flex flex-wrap gap-2">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border px-3 py-1 text-[11px] font-semibold uppercase"
                  style={{ borderColor: '#E8DED2', color: '#6B645D', letterSpacing: '0.14em' }}
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Description */}
          {description && (
            <p className="mt-6 text-[15px] leading-relaxed" style={{ color: '#6B645D' }}>
              {description}
            </p>
          )}

          {/* Shopee note */}
          <div className="mt-8 flex items-center gap-2">
            <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="#9A7654" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
            </svg>
            <p className="text-[13px]" style={{ color: '#9A9289' }}>
              Chạm vào sản phẩm để xem trên Shopee
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
