import Link from 'next/link';

export interface OutfitCardProps {
  id: string;
  outfitCode: string;
  name: string;
  slug: string;
  coverImageUrl: string;
  description: string | null;
  style?: { name: string } | null;
  outfitType?: { name: string } | null;
}

export default function OutfitCard({
  outfitCode,
  name,
  slug,
  coverImageUrl,
  style,
  outfitType,
}: OutfitCardProps) {
  const href = `/outfit/${slug}-${outfitCode.toLowerCase()}`;
  const tag = style?.name ?? outfitType?.name ?? null;

  return (
    <article className="group">
      <Link
        href={href}
        className="block rounded-[1.5rem] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-4"
        style={{ '--tw-ring-color': '#9A7654' } as React.CSSProperties}
      >
        {/* Image container */}
        <div
          className="relative aspect-[9/16] overflow-hidden transition-all duration-500 group-hover:-translate-y-1 group-hover:shadow-2xl"
          style={{ borderRadius: '1.5rem', background: '#F3EEE7' }}
        >
          {coverImageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={coverImageUrl}
              alt={name}
              className="absolute inset-0 h-full w-full object-contain transition-transform duration-700 ease-out group-hover:scale-[1.03]"
            />
          ) : (
            <div
              className="flex h-full items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #F3EEE7 0%, #E8DED2 100%)' }}
            >
              <span className="text-xs" style={{ color: '#9A9289' }}>Chưa có ảnh</span>
            </div>
          )}

          {/* Gradient scrim */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />

          {/* Tag badge — always visible at bottom */}
          {tag && (
            <div className="absolute bottom-0 inset-x-0 px-3 pb-3">
              <span
                className="inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase"
                style={{
                  letterSpacing: '0.14em',
                  background: 'rgba(255,255,255,0.92)',
                  color: '#5C4432',
                  backdropFilter: 'blur(8px)',
                }}
              >
                {tag}
              </span>
            </div>
          )}
        </div>

        {/* Card info */}
        <div className="mt-3 px-0.5">
          <h2
            className="line-clamp-2 text-[13px] font-medium leading-snug transition-opacity group-hover:opacity-60"
            style={{ color: '#111111' }}
          >
            {name}
          </h2>
          <p
            className="mt-1 text-[10px] font-semibold uppercase"
            style={{ letterSpacing: '0.18em', color: '#9A9289' }}
          >
            {outfitCode}
          </p>
        </div>
      </Link>
    </article>
  );
}
