// Server-only: Node.js runtime with Prisma. Do not import in middleware or client components.
import { prisma } from './db';
import type { Permission } from '@/constants/permissions';

// ─── Types ────────────────────────────────────────────────────────────────────

export type DataScope = 'all' | 'own' | 'assigned' | 'none';

// ─── Error ────────────────────────────────────────────────────────────────────

export class ForbiddenError extends Error {
  readonly status = 403;
  constructor(message = 'Forbidden') {
    super(message);
    this.name = 'ForbiddenError';
  }
}

// ─── Core helpers ─────────────────────────────────────────────────────────────

/**
 * Fetch all permission codes granted to a user via their roles.
 * Single DB query: Permission ← RolePermission ← Role ← UserRole.
 */
export async function getUserPermissions(userId: string): Promise<Permission[]> {
  const rows = await prisma.permission.findMany({
    where: {
      rolePermissions: {
        some: {
          role: {
            userRoles: {
              some: { userId },
            },
          },
        },
      },
    },
    select: { code: true },
  });
  return rows.map((r) => r.code as Permission);
}

/**
 * Returns true if the user has the given permission code.
 */
export async function hasPermission(
  userId: string,
  permissionCode: Permission,
): Promise<boolean> {
  const permissions = await getUserPermissions(userId);
  return permissions.includes(permissionCode);
}

/**
 * Throws ForbiddenError if the user does not have the given permission.
 * Use in API route handlers and server actions.
 */
export async function requirePermission(
  userId: string,
  permissionCode: Permission,
): Promise<void> {
  const allowed = await hasPermission(userId, permissionCode);
  if (!allowed) throw new ForbiddenError();
}

// ─── Data scope helpers ───────────────────────────────────────────────────────
// See 04-permission-matrix.md section 4 for scope definitions.

/**
 * Returns the data scope for product queries:
 * - 'all'      → user has products.view_all
 * - 'assigned' → user has products.view_assigned (assignedTo = userId filter applies)
 * - 'none'     → user has neither; deny access
 */
export async function getProductScope(userId: string): Promise<DataScope> {
  const permissions = await getUserPermissions(userId);
  if (permissions.includes('products.view_all')) return 'all';
  if (permissions.includes('products.view_assigned')) return 'assigned';
  return 'none';
}

/**
 * Returns the data scope for outfit queries:
 * - 'all'  → user has outfits.view_all
 * - 'own'  → user has outfits.view_own (createdBy = userId filter applies)
 * - 'none' → user has neither; deny access
 */
export async function getOutfitScope(userId: string): Promise<DataScope> {
  const permissions = await getUserPermissions(userId);
  if (permissions.includes('outfits.view_all')) return 'all';
  if (permissions.includes('outfits.view_own')) return 'own';
  return 'none';
}

/**
 * Returns the data scope for analytics queries:
 * - 'all'  → user has analytics.view_all (Admin / Manager)
 * - 'own'  → user has analytics.view_own (Staff — sees own outfits + assigned products only)
 * - 'none' → user has neither; deny access
 */
export async function getAnalyticsScope(userId: string): Promise<DataScope> {
  const permissions = await getUserPermissions(userId);
  if (permissions.includes('analytics.view_all')) return 'all';
  if (permissions.includes('analytics.view_own')) return 'own';
  return 'none';
}
