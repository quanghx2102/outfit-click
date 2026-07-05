'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  ShoppingBag,
  Shirt,
  BarChart2,
  RefreshCw,
  Users,
  Shield,
  Tags,
  ImageIcon,
  type LucideIcon,
} from 'lucide-react';
import { MANAGER_ROUTES } from '@/constants/routes';

interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

const navItems: NavItem[] = [
  { label: 'Tổng quan', href: MANAGER_ROUTES.DASHBOARD, icon: LayoutDashboard },
  { label: 'Sản phẩm', href: MANAGER_ROUTES.PRODUCTS, icon: ShoppingBag },
  { label: 'Outfit', href: MANAGER_ROUTES.OUTFITS, icon: Shirt },
  { label: 'Phong cách & Loại', href: MANAGER_ROUTES.TAXONOMY, icon: Tags },
  { label: 'Media', href: MANAGER_ROUTES.MEDIA, icon: ImageIcon },
  { label: 'Phân tích', href: MANAGER_ROUTES.ANALYTICS, icon: BarChart2 },
  { label: 'Lịch sử đồng bộ', href: MANAGER_ROUTES.SYNC_LOGS, icon: RefreshCw },
  { label: 'Nhân sự', href: MANAGER_ROUTES.USERS, icon: Users },
  { label: 'Vai trò', href: MANAGER_ROUTES.ROLES, icon: Shield },
];

function isActive(pathname: string, href: string): boolean {
  if (href === MANAGER_ROUTES.DASHBOARD) return pathname === href;
  return pathname.startsWith(href);
}

export default function ManagerNav() {
  const pathname = usePathname();

  return (
    <nav className="space-y-0.5 px-3">
      {navItems.map((item) => {
        const Icon = item.icon;
        const active = isActive(pathname, item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] transition-colors"
            style={
              active
                ? { background: 'rgba(255,255,255,0.12)', color: '#FFFFFF', fontWeight: 600 }
                : { color: 'rgba(255,255,255,0.55)', fontWeight: 500 }
            }
          >
            <Icon
              size={15}
              style={{ color: active ? '#FFFFFF' : 'rgba(255,255,255,0.4)' }}
              strokeWidth={active ? 2.5 : 2}
            />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
