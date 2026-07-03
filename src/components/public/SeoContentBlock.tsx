interface SeoContentBlockProps {
  heading?: string;
  body?: string;
}

export default function SeoContentBlock({
  heading = 'Curated outfits for every style',
  body = 'Browse carefully curated outfit collections across casual, streetwear, formal, and more. Click any item in an outfit to explore it further.',
}: SeoContentBlockProps) {
  return (
    <section aria-label="About" className="border-t border-slate-100 bg-slate-50/60 py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-md text-center">
          <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.25em] text-slate-300">
            About
          </p>
          <h2 className="text-lg font-semibold tracking-tight text-slate-800">{heading}</h2>
          <p className="mt-3 text-sm leading-relaxed text-slate-400">{body}</p>
        </div>
      </div>
    </section>
  );
}
