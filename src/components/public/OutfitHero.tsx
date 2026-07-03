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
  const coverAlt = `Outfit ${name} phong cách ${style?.name ?? outfitType?.name ?? outfitCode}`;

  return (
    <>
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="mb-10 flex items-center gap-2 text-xs text-slate-400">
        <Link
          href={PUBLIC_ROUTES.OUTFITS}
          className="font-semibold uppercase tracking-widest transition-colors hover:text-slate-950"
        >
          Outfits
        </Link>
        <span aria-hidden="true" className="text-slate-200">/</span>
        <span className="max-w-[180px] truncate font-medium text-slate-600 sm:max-w-sm">
          {name}
        </span>
      </nav>

      {/* Cover + Info — 2-column on md+ */}
      <div className="grid gap-10 md:grid-cols-[5fr_7fr] md:gap-14 lg:gap-16">
        {/* ── Cover image ── */}
        <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-slate-100 shadow-sm">
          {coverImageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={coverImageUrl}
              alt={coverAlt}
              className="absolute inset-0 h-full w-full object-cover"
              priority-fetch="high"
            />
          ) : (
            <div className="flex h-full items-center justify-center">
              <span className="text-sm text-slate-300">No image</span>
            </div>
          )}
        </div>

        {/* ── Info panel ── */}
        <div className="flex flex-col justify-center gap-0 py-2">
          {/* Style / type tag pills */}
          {(style ?? outfitType) && (
            <div className="mb-6 flex flex-wrap gap-2">
              {style && (
                <span className="rounded-full border border-slate-200 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
                  {style.name}
                </span>
              )}
              {outfitType && (
                <span className="rounded-full border border-slate-200 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
                  {outfitType.name}
                </span>
              )}
            </div>
          )}

          {/* Headline */}
          <h1 className="text-3xl font-semibold leading-[1.15] tracking-tight text-slate-950 sm:text-4xl lg:text-5xl">
            {name}
          </h1>

          {/* Description */}
          {description && (
            <p className="mt-6 text-base leading-relaxed text-slate-500">{description}</p>
          )}

          {/* Outfit code */}
          <div className="mt-10 flex items-center gap-3">
            <div className="h-px flex-1 bg-slate-100 sm:flex-none sm:w-8" />
            <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-slate-300">
              Outfit{' '}
              <span className="font-mono font-bold tracking-normal text-slate-400">{outfitCode}</span>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
