interface SeoContentBlockProps {
  heading?: string;
  body?: string;
}

export default function SeoContentBlock({
  heading = 'Curated outfits for every style',
  body = 'Browse carefully curated outfit collections across casual, streetwear, formal, and more. Click any item in an outfit to explore it further.',
}: SeoContentBlockProps) {
  return (
    <section aria-label="About" className="mt-16 border-t border-slate-100 py-14">
      <div className="mx-auto max-w-lg text-center">
        <h2 className="text-base font-semibold tracking-tight text-slate-950">{heading}</h2>
        <p className="mt-3 text-sm leading-relaxed text-slate-500">{body}</p>
      </div>
    </section>
  );
}
