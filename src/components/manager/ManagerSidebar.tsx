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
    <aside className="flex w-[240px] shrink-0 flex-col border-r border-slate-200 bg-white">
      {/* Logo */}
      <div className="flex h-14 items-center border-b border-slate-200 px-5">
        <Link
          href={MANAGER_ROUTES.DASHBOARD}
          className="text-[15px] font-bold tracking-tight text-slate-950 hover:text-slate-700"
        >
          OutfitClick
        </Link>
      </div>

      {/* Nav */}
      <div className="flex-1 overflow-y-auto py-4">
        <ManagerNav />
      </div>

      {/* User block */}
      <div className="border-t border-slate-200 p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-900 text-xs font-semibold text-white">
            {initial}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-slate-900">{user.name}</p>
            <p className="truncate text-xs text-slate-500">{user.email}</p>
          </div>
        </div>
        <LogoutButton />
      </div>
    </aside>
  );
}
