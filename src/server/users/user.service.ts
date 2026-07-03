import { prisma } from '@/lib/db';

export type UserListItem = {
  id: string;
  name: string;
  email: string;
  status: string;
  avatarUrl: string | null;
  lastLoginAt: Date | null;
  createdAt: Date;
  roles: { id: string; name: string; code: string }[];
};

export async function listUsers(): Promise<UserListItem[]> {
  const users = await prisma.user.findMany({
    where: { deletedAt: null },
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      name: true,
      email: true,
      status: true,
      avatarUrl: true,
      lastLoginAt: true,
      createdAt: true,
      userRoles: {
        select: {
          role: {
            select: { id: true, name: true, code: true },
          },
        },
      },
    },
  });

  return users.map((u) => ({
    ...u,
    roles: u.userRoles.map((ur) => ur.role),
  }));
}
