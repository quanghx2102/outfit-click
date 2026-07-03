import { requireAuth } from '@/lib/require-auth';
import ManagerShell from '@/components/manager/ManagerShell';

export default async function ManagerProtectedLayout({ children }: { children: React.ReactNode }) {
  const user = await requireAuth();

  return (
    <ManagerShell user={user}>
      {children}
    </ManagerShell>
  );
}
