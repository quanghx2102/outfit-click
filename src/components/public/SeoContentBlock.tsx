interface SeoContentBlockProps {
  heading?: string;
  body?: string;
}

export default function SeoContentBlock({
  heading = 'Outfit tuyển chọn cho mọi phong cách',
  body = 'Khám phá các bộ sưu tập outfit được tuyển chọn kỹ lưỡng theo phong cách casual, streetwear, công sở và nhiều hơn nữa. Chạm vào bất kỳ sản phẩm nào trong outfit để xem chi tiết.',
}: SeoContentBlockProps) {
  return (
    <section aria-label="Giới thiệu" className="border-t border-slate-100 bg-slate-50/60 py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-md text-center">
          <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.25em] text-slate-300">
            Giới thiệu
          </p>
          <h2 className="text-lg font-semibold tracking-tight text-slate-800">{heading}</h2>
          <p className="mt-3 text-sm leading-relaxed text-slate-400">{body}</p>
        </div>
      </div>
    </section>
  );
}
