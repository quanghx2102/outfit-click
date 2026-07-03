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
  type LucideIcon,
} from 'lucide-react';
import { MANAGER_ROUTES } from '@/constants/routes';

interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

const navItems: NavItem[] = [
  { label: 'Dashboard', href: MANAGER_ROUTES.DASHBOARD, icon: LayoutDashboard },
  { label: 'Products', href: MANAGER_ROUTES.PRODUCTS, icon: ShoppingBag },
  { label: 'Outfits', href: MANAGER_ROUTES.OUTFITS, icon: Shirt },
  { label: 'Analytics', href: MANAGER_ROUTES.ANALYTICS, icon: BarChart2 },
  { label: 'Sync Logs', href: MANAGER_ROUTES.SYNC_LOGS, icon: RefreshCw },
  { label: 'Users', href: MANAGER_ROUTES.USERS, icon: Users },
  { label: 'Roles', href: MANAGER_ROUTES.ROLES, icon: Shield },
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
            className={[
              'flex items-center gap-3 rounded-lg px-3 py-2 text-[13px] transition-colors',
              active
                ? 'bg-slate-950 font-semibold text-white'
                : 'font-medium text-slate-500 hover:bg-slate-50 hover:text-slate-900',
            ].join(' ')}
          >
            <Icon
              size={15}
              className={active ? 'text-white' : 'text-slate-400'}
              strokeWidth={active ? 2.5 : 2}
            />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
