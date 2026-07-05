import Link from 'next/link';

export interface ProductClickCardProps {
  name: string;
  displayImageUrl: string;
  /** Pre-built redirect path: /go/{outfitCode}/{productId} */
  redirectPath: string;
  outfitCode: string;
}

export default function ProductClickCard({
  name,
  displayImageUrl,
  redirectPath,
  outfitCode,
}: ProductClickCardProps) {
  return (
    <article>
      <Link
        href={redirectPath}
        className="group block rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-4"
        style={{ '--tw-ring-color': '#9A7654' } as React.CSSProperties}
      >
        {/* Image */}
        <div
          className="relative aspect-[9/16] overflow-hidden rounded-2xl transition-all duration-500 group-hover:-translate-y-1 group-hover:shadow-xl"
          style={{ background: '#F3EEE7' }}
        >
          {displayImageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={displayImageUrl}
              alt={`${name} — outfit ${outfitCode}`}
              loading="lazy"
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

          {/* "Tap to view" overlay on hover */}
          <div
            className="absolute inset-0 flex items-end justify-center pb-3 opacity-0 transition-opacity duration-200 group-hover:opacity-100"
            style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.28) 0%, transparent 50%)' }}
          >
            <span
              className="rounded-full px-3 py-1 text-[10px] font-bold uppercase"
              style={{
                background: 'rgba(255,255,255,0.92)',
                color: '#5C4432',
                letterSpacing: '0.16em',
                backdropFilter: 'blur(6px)',
              }}
            >
              Xem trên Shopee
            </span>
          </div>
        </div>

        {/* Name */}
        <div className="mt-3 px-0.5">
          <p
            className="line-clamp-2 text-[13px] font-medium leading-snug transition-opacity group-hover:opacity-60"
            style={{ color: '#111111' }}
          >
            {name}
          </p>
        </div>
      </Link>
    </article>
  );
}
