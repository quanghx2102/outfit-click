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
        className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-4 rounded-2xl"
      >
        {/* ── Image container ── */}
        <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-slate-100 transition-all duration-500 group-hover:-translate-y-1.5 group-hover:shadow-xl">
          {coverImageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={coverImageUrl}
              alt={name}
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.05]"
            />
          ) : (
            <div className="flex h-full items-center justify-center bg-slate-50">
              <span className="text-xs text-slate-300">No image</span>
            </div>
          )}

          {/* Gradient overlay — always present for scrim, tag badge on hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

          {/* Tag badge — bottom-left, appears on hover */}
          {tag && (
            <div className="absolute bottom-0 inset-x-0 px-3 pb-3 translate-y-2 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
              <span className="inline-flex items-center rounded-full bg-white/95 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-widest text-slate-700 shadow-sm backdrop-blur-sm">
                {tag}
              </span>
            </div>
          )}
        </div>

        {/* ── Card info ── */}
        <div className="mt-3 px-0.5">
          <h2 className="line-clamp-2 text-[13px] font-medium leading-snug text-slate-900 transition-colors group-hover:text-slate-500">
            {name}
          </h2>
          <p className="mt-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-300">
            {outfitCode}
          </p>
        </div>
      </Link>
    </article>
  );
}
