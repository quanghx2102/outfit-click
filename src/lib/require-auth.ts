// Server-only: Node.js runtime. Do not import in middleware or client components.
import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth';
import { getUserById } from '@/server/auth/auth.service';
import { MANAGER_ROUTES } from '@/constants/routes';
import type { SafeUser } from '@/server/auth/auth.service';

/**
 * Verify session and return the current user.
 * Redirects to login if session is missing or expired.
 * Use in Server Components and Server Actions that require authentication.
 */
export async function requireAuth(): Promise<SafeUser> {
  const session = await getSession();
  if (!session) redirect(MANAGER_ROUTES.LOGIN);

  const user = await getUserById(session.userId);
  if (!user) redirect(MANAGER_ROUTES.LOGIN);

  return user;
}
