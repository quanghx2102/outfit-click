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
    <section aria-labelledby="related-heading" className="mt-16 border-t border-slate-100 pt-12">
      <h2 id="related-heading" className="mb-8 text-xl font-semibold tracking-tight text-slate-950">
        You might also like
      </h2>
      <OutfitGrid>
        {outfits.map((o) => (
          <OutfitCard key={o.id} {...o} />
        ))}
      </OutfitGrid>
    </section>
  );
}
