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
      <nav aria-label="Breadcrumb" className="mb-8 text-sm text-slate-400">
        <ol className="flex items-center gap-2">
          <li>
            <Link
              href={PUBLIC_ROUTES.OUTFITS}
              className="transition-colors hover:text-slate-950"
            >
              Outfits
            </Link>
          </li>
          <li aria-hidden="true" className="text-slate-300">
            /
          </li>
          <li className="max-w-[200px] truncate font-medium text-slate-950 sm:max-w-xs">
            {name}
          </li>
        </ol>
      </nav>

      {/* Cover + Info */}
      <div className="grid gap-8 md:grid-cols-[5fr_7fr] md:gap-12">
        {/* Cover image */}
        <div className="relative aspect-[4/5] overflow-hidden rounded-2xl border border-slate-100 bg-slate-50">
          {coverImageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={coverImageUrl}
              alt={coverAlt}
              className="absolute inset-0 h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full items-center justify-center">
              <span className="text-sm text-slate-300">No image</span>
            </div>
          )}
        </div>

        {/* Info panel */}
        <div className="flex flex-col justify-center py-2">
          {/* Style / type badges */}
          {(style || outfitType) && (
            <div className="mb-4 flex flex-wrap gap-2">
              {style && (
                <span className="rounded-full border border-slate-200 px-3 py-1 text-[11px] font-medium uppercase tracking-wider text-slate-500">
                  {style.name}
                </span>
              )}
              {outfitType && (
                <span className="rounded-full border border-slate-200 px-3 py-1 text-[11px] font-medium uppercase tracking-wider text-slate-500">
                  {outfitType.name}
                </span>
              )}
            </div>
          )}

          <h1 className="text-3xl font-semibold leading-tight tracking-tight text-slate-950 sm:text-4xl lg:text-5xl">
            {name}
          </h1>

          {description && (
            <p className="mt-5 text-base leading-relaxed text-slate-500">{description}</p>
          )}

          <p className="mt-8 text-[11px] uppercase tracking-widest text-slate-400">
            Outfit{' '}
            <span className="font-mono font-semibold tracking-normal text-slate-600">
              {outfitCode}
            </span>
          </p>
        </div>
      </div>
    </>
  );
}
