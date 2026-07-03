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

  return (
    <article className="group">
      <Link href={href} className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 rounded-2xl">
        {/* Image container */}
        <div className="relative aspect-[4/5] overflow-hidden rounded-2xl border border-slate-100 bg-slate-100 transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-lg">
          {coverImageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={coverImageUrl}
              alt={name}
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            />
          ) : (
            <div className="flex h-full items-center justify-center bg-slate-50">
              <span className="text-xs text-slate-300">No image</span>
            </div>
          )}

          {/* Gradient overlay for badges */}
          {(style || outfitType) && (
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/40 to-transparent px-3 pb-3 pt-8">
              <div className="flex flex-wrap gap-1">
                {style && (
                  <span className="rounded-full bg-white/95 px-2.5 py-0.5 text-[10px] font-medium tracking-wide text-slate-800 backdrop-blur-sm">
                    {style.name}
                  </span>
                )}
                {outfitType && (
                  <span className="rounded-full bg-white/95 px-2.5 py-0.5 text-[10px] font-medium tracking-wide text-slate-800 backdrop-blur-sm">
                    {outfitType.name}
                  </span>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Card info */}
        <div className="mt-2.5 px-0.5">
          <h2 className="line-clamp-2 text-sm font-medium leading-snug text-slate-900 transition-colors group-hover:text-slate-600">
            {name}
          </h2>
          <p className="mt-1 text-[11px] tracking-wider text-slate-400 uppercase">{outfitCode}</p>
        </div>
      </Link>
    </article>
  );
}
