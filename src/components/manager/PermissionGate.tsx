// Server Component — async, requires Node.js runtime. Do not use inside Client Components.
import type { Permission } from '@/constants/permissions';
import { hasPermission } from '@/lib/permissions';

interface PermissionGateProps {
  userId: string;
  permission: Permission;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

/**
 * Renders children if userId has the given permission, fallback (default null) otherwise.
 * Used to hide manager UI elements the current user is not allowed to see.
 * Per 04-permission-matrix.md section 9 — backend must always re-check; this is UI-only guard.
 */
export default async function PermissionGate({
  userId,
  permission,
  children,
  fallback = null,
}: PermissionGateProps) {
  const allowed = await hasPermission(userId, permission);
  return allowed ? <>{children}</> : <>{fallback}</>;
}
