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
      className="mt-2 w-full rounded-md px-3 py-1.5 text-left text-xs text-gray-500 hover:bg-gray-100 hover:text-gray-700"
    >
      Đăng xuất
    </button>
  );
}
