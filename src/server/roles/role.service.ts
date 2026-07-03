import { prisma } from '@/lib/db';

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
