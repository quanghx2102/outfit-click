import { prisma } from '@/lib/db';
import { verifyPassword } from '@/lib/auth';
import { USER_STATUS } from '@/constants/status';

// ─── Types ────────────────────────────────────────────────────────────────────

export type SafeUser = {
  id: string;
  name: string;
  email: string;
  avatarUrl: string | null;
  status: string;
  lastLoginAt: Date | null;
  createdAt: Date;
};

export type LoginInput = {
  email: string;
  password: string;
};

export type LoginResult =
  | { ok: true; user: SafeUser }
  | { ok: false; reason: 'invalid_credentials' | 'account_disabled' };

// ─── Service ──────────────────────────────────────────────────────────────────

export async function loginUser(input: LoginInput): Promise<LoginResult> {
  const user = await prisma.user.findFirst({
    where: {
      email: input.email.toLowerCase().trim(),
      deletedAt: null,
    },
    select: {
      id: true,
      name: true,
      email: true,
      passwordHash: true,
      avatarUrl: true,
      status: true,
      lastLoginAt: true,
      createdAt: true,
    },
  });

  if (!user) {
    return { ok: false, reason: 'invalid_credentials' };
  }

  const valid = verifyPassword(input.password, user.passwordHash);
  if (!valid) {
    return { ok: false, reason: 'invalid_credentials' };
  }

  if (user.status !== USER_STATUS.ACTIVE) {
    return { ok: false, reason: 'account_disabled' };
  }

  await prisma.user.update({
    where: { id: user.id },
    data: { lastLoginAt: new Date() },
  });

  return { ok: true, user: toSafeUser(user) };
}

export async function getUserById(userId: string): Promise<SafeUser | null> {
  const user = await prisma.user.findFirst({
    where: { id: userId, deletedAt: null, status: USER_STATUS.ACTIVE },
    select: {
      id: true,
      name: true,
      email: true,
      avatarUrl: true,
      status: true,
      lastLoginAt: true,
      createdAt: true,
    },
  });
  return user ? toSafeUser(user) : null;
}

function toSafeUser(user: {
  id: string;
  name: string;
  email: string;
  avatarUrl: string | null;
  status: string;
  lastLoginAt: Date | null;
  createdAt: Date;
}): SafeUser {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    avatarUrl: user.avatarUrl,
    status: user.status,
    lastLoginAt: user.lastLoginAt,
    createdAt: user.createdAt,
  };
}
