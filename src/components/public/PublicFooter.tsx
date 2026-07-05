import Link from 'next/link';
import { PUBLIC_ROUTES, SEO_CONFIG } from '@/constants/routes';

export default function PublicFooter() {
  return (
    <footer
      className="mt-auto border-t"
      style={{ borderColor: '#E8DED2', background: '#FAF7F2' }}
    >
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
          {/* Brand column */}
          <div className="flex flex-col gap-3">
            <Link
              href={PUBLIC_ROUTES.HOME}
              className="text-[11px] font-black uppercase transition-opacity hover:opacity-60"
              style={{ letterSpacing: '0.22em', color: '#111111' }}
            >
              {SEO_CONFIG.SITE_NAME}
            </Link>
            <p className="max-w-[220px] text-[13px] leading-relaxed" style={{ color: '#9A9289' }}>
              Outfit được tuyển chọn kỹ lưỡng, cập nhật hằng ngày.
            </p>
          </div>

          {/* Nav */}
          <nav aria-label="Footer navigation" className="flex flex-col gap-3">
            <p
              className="text-[10px] font-bold uppercase"
              style={{ letterSpacing: '0.2em', color: '#9A9289' }}
            >
              Khám phá
            </p>
            <ul className="flex flex-col gap-2">
              <li>
                <Link
                  href={PUBLIC_ROUTES.OUTFITS}
                  className="text-[13px] transition-colors hover:opacity-70"
                  style={{ color: '#6B645D' }}
                >
                  Outfit
                </Link>
              </li>
              <li>
                <Link
                  href={`${PUBLIC_ROUTES.OUTFITS}?style=casual`}
                  className="text-[13px] transition-colors hover:opacity-70"
                  style={{ color: '#6B645D' }}
                >
                  Phong cách
                </Link>
              </li>
              <li>
                <Link
                  href={`${PUBLIC_ROUTES.OUTFITS}?sort=newest`}
                  className="text-[13px] transition-colors hover:opacity-70"
                  style={{ color: '#6B645D' }}
                >
                  Mới nhất
                </Link>
              </li>
            </ul>
          </nav>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 border-t pt-6" style={{ borderColor: '#E8DED2' }}>
          <p className="text-center text-[11px]" style={{ color: '#9A9289' }}>
            &copy; {new Date().getFullYear()} {SEO_CONFIG.SITE_NAME}. Được tuyển chọn tỉ mỉ.
          </p>
        </div>
      </div>
    </footer>
  );
}
