import { prisma } from '@/lib/db';

// ─── Types ────────────────────────────────────────────────────────────────────

export type RoleWithPermissions = {
  id: string;
  name: string;
  code: string;
  description: string | null;
  status: string;
  userCount: number;
  permissions: {
    id: string;
    name: string;
    code: string;
    module: string;
    description: string | null;
  }[];
};

export type PermissionItem = {
  id: string;
  name: string;
  code: string;
  module: string;
  description: string | null;
};

export type CreateRoleInput = {
  name: string;
  code: string;
  description?: string;
  permissionIds?: string[];
};

export type UpdateRoleInput = {
  name?: string;
  description?: string;
  status?: 'active' | 'inactive';
};

export type CreateRoleResult =
  | { ok: true; role: RoleWithPermissions }
  | { ok: false; reason: 'code_taken' };

export type UpdateRoleResult =
  | { ok: true; role: RoleWithPermissions }
  | { ok: false; reason: 'not_found' | 'system_role' };

// ─── Queries ──────────────────────────────────────────────────────────────────

export async function listRolesWithPermissions(): Promise<RoleWithPermissions[]> {
  const roles = await prisma.role.findMany({
    orderBy: { name: 'asc' },
    select: {
      id: true,
      name: true,
      code: true,
      description: true,
      status: true,
      _count: { select: { userRoles: true } },
      rolePermissions: {
        select: {
          permission: {
            select: { id: true, name: true, code: true, module: true, description: true },
          },
        },
        orderBy: { permission: { module: 'asc' } },
      },
    },
  });

  return roles.map((r) => ({
    id: r.id,
    name: r.name,
    code: r.code,
    description: r.description,
    status: r.status,
    userCount: r._count.userRoles,
    permissions: r.rolePermissions.map((rp) => rp.permission),
  }));
}

export async function getRoleById(id: string): Promise<RoleWithPermissions | null> {
  const role = await prisma.role.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      code: true,
      description: true,
      status: true,
      _count: { select: { userRoles: true } },
      rolePermissions: {
        select: {
          permission: {
            select: { id: true, name: true, code: true, module: true, description: true },
          },
        },
        orderBy: { permission: { module: 'asc' } },
      },
    },
  });
  if (!role) return null;
  return {
    id: role.id,
    name: role.name,
    code: role.code,
    description: role.description,
    status: role.status,
    userCount: role._count.userRoles,
    permissions: role.rolePermissions.map((rp) => rp.permission),
  };
}

export async function listAllPermissions(): Promise<PermissionItem[]> {
  return prisma.permission.findMany({
    orderBy: [{ module: 'asc' }, { name: 'asc' }],
    select: { id: true, name: true, code: true, module: true, description: true },
  });
}

// ─── Create ───────────────────────────────────────────────────────────────────

export async function createRole(input: CreateRoleInput): Promise<CreateRoleResult> {
  const existing = await prisma.role.findUnique({
    where: { code: input.code },
    select: { id: true },
  });
  if (existing) return { ok: false, reason: 'code_taken' };

  const role = await prisma.role.create({
    data: {
      name: input.name.trim(),
      code: input.code.trim().toLowerCase(),
      description: input.description?.trim() ?? null,
      status: 'active',
    },
    select: { id: true },
  });

  if (input.permissionIds && input.permissionIds.length > 0) {
    await prisma.rolePermission.createMany({
      data: input.permissionIds.map((permissionId) => ({ roleId: role.id, permissionId })),
      skipDuplicates: true,
    });
  }

  const detail = await getRoleById(role.id);
  return { ok: true, role: detail! };
}

// ─── Update ───────────────────────────────────────────────────────────────────

const SYSTEM_ROLE_CODES = new Set(['admin']);

export async function updateRole(id: string, input: UpdateRoleInput): Promise<UpdateRoleResult> {
  const role = await prisma.role.findUnique({
    where: { id },
    select: { id: true, code: true },
  });
  if (!role) return { ok: false, reason: 'not_found' };

  // Protect admin system role from status change
  if (SYSTEM_ROLE_CODES.has(role.code) && input.status === 'inactive') {
    return { ok: false, reason: 'system_role' };
  }

  await prisma.role.update({
    where: { id },
    data: {
      ...(input.name ? { name: input.name.trim() } : {}),
      ...(Object.prototype.hasOwnProperty.call(input, 'description')
        ? { description: input.description?.trim() ?? null }
        : {}),
      ...(input.status ? { status: input.status } : {}),
    },
  });

  const detail = await getRoleById(id);
  return { ok: true, role: detail! };
}

// ─── Permissions assignment ───────────────────────────────────────────────────

export async function setRolePermissions(
  roleId: string,
  permissionIds: string[],
): Promise<boolean> {
  const role = await prisma.role.findUnique({ where: { id: roleId }, select: { id: true, code: true } });
  if (!role) return false;

  await prisma.rolePermission.deleteMany({ where: { roleId } });

  if (permissionIds.length > 0) {
    await prisma.rolePermission.createMany({
      data: permissionIds.map((permissionId) => ({ roleId, permissionId })),
      skipDuplicates: true,
    });
  }

  return true;
}
