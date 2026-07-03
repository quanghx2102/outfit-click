'use client';

import { useRouter } from 'next/navigation';
import { MANAGER_ROUTES } from '@/constants/routes';

export default function LogoutButton() {
  const router = useRouter();

  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push(MANAGER_ROUTES.LOGIN);
    router.refresh();
  }

  return (
    <button
      onClick={handleLogout}
      className="w-full rounded-lg px-3 py-1.5 text-left text-[12px] font-medium text-slate-400 transition-colors hover:bg-slate-50 hover:text-slate-700"
    >
      Sign out
    </button>
  );
}
