import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { ForbiddenError, requirePermission } from '@/lib/permissions';
import { PERMISSIONS } from '@/constants/permissions';
import { resetUserPassword } from '@/server/users/user.service';

type RouteContext = { params: Promise<{ id: string }> };

// POST /api/manager/users/[id]/password — reset password (users.update)
export async function POST(request: NextRequest, ctx: RouteContext) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    await requirePermission(session.userId, PERMISSIONS.USERS_UPDATE);
  } catch (error) {
    if (error instanceof ForbiddenError) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    throw error;
  }

  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const newPassword = typeof body.newPassword === 'string' ? body.newPassword : '';
  if (!newPassword || newPassword.length < 8) {
    return NextResponse.json({ error: 'newPassword must be at least 8 characters' }, { status: 400 });
  }

  const { id } = await ctx.params;
  const ok = await resetUserPassword(id, newPassword);
  if (!ok) return NextResponse.json({ error: 'User not found' }, { status: 404 });

  return NextResponse.json({ ok: true });
}
