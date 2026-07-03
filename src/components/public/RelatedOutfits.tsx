import OutfitCard from './OutfitCard';
import OutfitGrid from './OutfitGrid';

export interface RelatedOutfitItem {
  id: string;
  outfitCode: string;
  name: string;
  slug: string;
  coverImageUrl: string;
  description: string | null;
}

interface RelatedOutfitsProps {
  outfits: RelatedOutfitItem[];
}

export default function RelatedOutfits({ outfits }: RelatedOutfitsProps) {
  if (outfits.length === 0) return null;

  return (
    <section aria-labelledby="related-heading" className="mt-20">
      {/* Section header */}
      <div className="mb-10 flex items-center gap-4">
        <div className="h-px flex-1 bg-slate-100" />
        <h2
          id="related-heading"
          className="text-[10px] font-bold uppercase tracking-[0.28em] text-slate-300"
        >
          You might also like
        </h2>
        <div className="h-px flex-1 bg-slate-100" />
      </div>

      <OutfitGrid>
        {outfits.map((o) => (
          <OutfitCard key={o.id} {...o} />
        ))}
      </OutfitGrid>
    </section>
  );
}
