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
        className="group block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-4 rounded-2xl"
      >
        {/* Image */}
        <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-slate-100 transition-all duration-500 group-hover:-translate-y-1 group-hover:shadow-lg">
          {displayImageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={displayImageUrl}
              alt={`${name} trong outfit ${outfitCode}`}
              loading="lazy"
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.05]"
            />
          ) : (
            <div className="flex h-full items-center justify-center">
              <span className="text-xs text-slate-300">No image</span>
            </div>
          )}

          {/* Hover cue — appears on hover */}
          <div className="absolute inset-0 flex items-end justify-end p-2.5 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
            <span className="rounded-full bg-white/92 px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.2em] text-slate-700 shadow-sm backdrop-blur-sm">
              View
            </span>
          </div>
        </div>

        {/* Name */}
        <div className="mt-3 px-0.5">
          <p className="line-clamp-2 text-[13px] font-medium leading-snug text-slate-900 transition-colors group-hover:text-slate-500">
            {name}
          </p>
        </div>
      </Link>
    </article>
  );
}
