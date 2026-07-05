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
      className="w-full rounded-lg px-3 py-1.5 text-left text-[12px] font-medium transition-colors"
      style={{ color: 'rgba(255,255,255,0.4)' }}
      onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.color = 'rgba(255,255,255,0.7)'; }}
      onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.color = 'rgba(255,255,255,0.4)'; }}
    >
      Đăng xuất
    </button>
  );
}
