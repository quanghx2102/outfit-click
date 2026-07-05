import Link from 'next/link';
import { MANAGER_ROUTES } from '@/constants/routes';
import ManagerNav from './ManagerNav';
import LogoutButton from './LogoutButton';

interface ManagerSidebarProps {
  user: { name: string; email: string };
}

export default function ManagerSidebar({ user }: ManagerSidebarProps) {
  const initials = user.name
    .split(' ')
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <aside
      className="flex w-[260px] shrink-0 flex-col"
      style={{ background: '#111827', minHeight: '100vh' }}
    >
      {/* Logo / brand */}
      <div className="flex h-16 items-center px-6" style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        <Link
          href={MANAGER_ROUTES.DASHBOARD}
          className="text-[11px] font-black uppercase transition-opacity hover:opacity-60"
          style={{ letterSpacing: '0.22em', color: '#FFFFFF' }}
        >
          OutfitClick
        </Link>
      </div>

      {/* Nav */}
      <div className="flex-1 overflow-y-auto py-5">
        <ManagerNav />
      </div>

      {/* User block */}
      <div className="p-4" style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
        <div className="flex items-center gap-3 rounded-xl p-3" style={{ background: 'rgba(255,255,255,0.06)' }}>
          <div
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[12px] font-bold text-white"
            style={{ background: 'rgba(255,255,255,0.15)' }}
          >
            {initials}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-[13px] font-semibold text-white">{user.name}</p>
            <p className="truncate text-[11px]" style={{ color: 'rgba(255,255,255,0.45)' }}>{user.email}</p>
          </div>
        </div>
        <div className="mt-2">
          <LogoutButton />
        </div>
      </div>
    </aside>
  );
}
