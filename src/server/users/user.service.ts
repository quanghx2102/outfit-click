import { prisma } from '@/lib/db';
import { hashPassword } from '@/lib/auth';
import { USER_STATUS } from '@/constants/status';

// ─── Types ────────────────────────────────────────────────────────────────────

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

export type UserDetail = {
  id: string;
  name: string;
  email: string;
  status: string;
  avatarUrl: string | null;
  lastLoginAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
  roles: { id: string; name: string; code: string }[];
};

export type CreateUserInput = {
  name: string;
  email: string;
  password: string;
  roleIds?: string[];
};

export type UpdateUserInput = {
  name?: string;
  email?: string;
};

export type CreateUserResult =
  | { ok: true; user: UserDetail }
  | { ok: false; reason: 'email_taken' };

export type UpdateUserResult =
  | { ok: true; user: UserDetail }
  | { ok: false; reason: 'email_taken' | 'not_found' };

// ─── Queries ──────────────────────────────────────────────────────────────────

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

export async function getUserDetail(id: string): Promise<UserDetail | null> {
  const user = await prisma.user.findFirst({
    where: { id, deletedAt: null },
    select: {
      id: true,
      name: true,
      email: true,
      status: true,
      avatarUrl: true,
      lastLoginAt: true,
      createdAt: true,
      updatedAt: true,
      userRoles: {
        select: {
          role: { select: { id: true, name: true, code: true } },
        },
      },
    },
  });
  if (!user) return null;
  return { ...user, roles: user.userRoles.map((ur) => ur.role) };
}

// ─── Create ───────────────────────────────────────────────────────────────────

export async function createUser(input: CreateUserInput): Promise<CreateUserResult> {
  const existing = await prisma.user.findFirst({
    where: { email: input.email.toLowerCase().trim(), deletedAt: null },
    select: { id: true },
  });
  if (existing) return { ok: false, reason: 'email_taken' };

  const passwordHash = hashPassword(input.password);

  const user = await prisma.user.create({
    data: {
      name: input.name.trim(),
      email: input.email.toLowerCase().trim(),
      passwordHash,
      status: USER_STATUS.ACTIVE,
    },
    select: {
      id: true,
      name: true,
      email: true,
      status: true,
      avatarUrl: true,
      lastLoginAt: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  if (input.roleIds && input.roleIds.length > 0) {
    await prisma.userRole.createMany({
      data: input.roleIds.map((roleId) => ({ userId: user.id, roleId })),
      skipDuplicates: true,
    });
  }

  const detail = await getUserDetail(user.id);
  return { ok: true, user: detail! };
}

// ─── Update ───────────────────────────────────────────────────────────────────

export async function updateUser(id: string, input: UpdateUserInput): Promise<UpdateUserResult> {
  const existing = await prisma.user.findFirst({
    where: { id, deletedAt: null },
    select: { id: true },
  });
  if (!existing) return { ok: false, reason: 'not_found' };

  if (input.email) {
    const emailTaken = await prisma.user.findFirst({
      where: {
        email: input.email.toLowerCase().trim(),
        deletedAt: null,
        id: { not: id },
      },
      select: { id: true },
    });
    if (emailTaken) return { ok: false, reason: 'email_taken' };
  }

  await prisma.user.update({
    where: { id },
    data: {
      ...(input.name ? { name: input.name.trim() } : {}),
      ...(input.email ? { email: input.email.toLowerCase().trim() } : {}),
    },
  });

  const detail = await getUserDetail(id);
  return { ok: true, user: detail! };
}

// ─── Status ───────────────────────────────────────────────────────────────────

export async function setUserStatus(id: string, status: 'active' | 'disabled'): Promise<boolean> {
  const user = await prisma.user.findFirst({
    where: { id, deletedAt: null },
    select: { id: true },
  });
  if (!user) return false;

  await prisma.user.update({ where: { id }, data: { status } });
  return true;
}

// ─── Password ─────────────────────────────────────────────────────────────────

export async function resetUserPassword(id: string, newPassword: string): Promise<boolean> {
  const user = await prisma.user.findFirst({
    where: { id, deletedAt: null },
    select: { id: true },
  });
  if (!user) return false;

  const passwordHash = hashPassword(newPassword);
  await prisma.user.update({ where: { id }, data: { passwordHash } });
  return true;
}

// ─── Roles ────────────────────────────────────────────────────────────────────

export async function assignRolesToUser(
  userId: string,
  roleIds: string[],
): Promise<boolean> {
  const user = await prisma.user.findFirst({
    where: { id: userId, deletedAt: null },
    select: { id: true },
  });
  if (!user) return false;

  await prisma.userRole.deleteMany({ where: { userId } });

  if (roleIds.length > 0) {
    await prisma.userRole.createMany({
      data: roleIds.map((roleId) => ({ userId, roleId })),
      skipDuplicates: true,
    });
  }

  return true;
}
