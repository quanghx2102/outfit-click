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
        className="group block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 rounded-2xl"
      >
        <div className="relative aspect-[4/5] overflow-hidden rounded-2xl border border-slate-100 bg-slate-50 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:border-slate-200 group-hover:shadow-lg">
          {displayImageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={displayImageUrl}
              alt={`${name} trong outfit ${outfitCode}`}
              loading="lazy"
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
            />
          ) : (
            <div className="flex h-full items-center justify-center">
              <span className="text-xs text-slate-300">No image</span>
            </div>
          )}

          {/* Hover cue — subtle tap/shop indicator */}
          <div className="absolute inset-0 flex items-end justify-end p-2.5 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
            <span className="rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-widest text-slate-700 shadow-sm backdrop-blur-sm">
              Shop
            </span>
          </div>
        </div>

        <div className="mt-2.5 px-0.5">
          <p className="line-clamp-2 text-sm font-medium leading-snug text-slate-900 transition-colors group-hover:text-slate-600">
            {name}
          </p>
        </div>
      </Link>
    </article>
  );
}
