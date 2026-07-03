import Link from 'next/link';
import { MANAGER_ROUTES } from '@/constants/routes';
import ManagerNav from './ManagerNav';
import LogoutButton from './LogoutButton';

interface ManagerSidebarProps {
  user: { name: string; email: string };
}

export default function ManagerSidebar({ user }: ManagerSidebarProps) {
  const initial = user.name.trim().charAt(0).toUpperCase();

  return (
    <aside className="flex w-[240px] shrink-0 flex-col border-r border-slate-100 bg-white">
      {/* Logo / brand */}
      <div className="flex h-14 items-center border-b border-slate-100 px-5">
        <Link
          href={MANAGER_ROUTES.DASHBOARD}
          className="text-[11px] font-black uppercase tracking-[0.22em] text-slate-950 transition-opacity hover:opacity-60"
        >
          OutfitClick
        </Link>
      </div>

      {/* Nav */}
      <div className="flex-1 overflow-y-auto py-5">
        <ManagerNav />
      </div>

      {/* User block */}
      <div className="border-t border-slate-100 p-4">
        <div className="mb-3 flex items-center gap-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-950 text-[11px] font-bold text-white">
            {initial}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-[13px] font-semibold text-slate-900">{user.name}</p>
            <p className="truncate text-[11px] text-slate-400">{user.email}</p>
          </div>
        </div>
        <LogoutButton />
      </div>
    </aside>
  );
}
