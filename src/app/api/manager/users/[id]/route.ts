import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { ForbiddenError, hasPermission, requirePermission } from '@/lib/permissions';
import { PERMISSIONS } from '@/constants/permissions';
import { getUserDetail, updateUser, setUserStatus } from '@/server/users/user.service';

type RouteContext = { params: Promise<{ id: string }> };

// GET /api/manager/users/[id]
export async function GET(_req: NextRequest, ctx: RouteContext) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const canView = await hasPermission(session.userId, PERMISSIONS.USERS_VIEW);
  if (!canView) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const { id } = await ctx.params;
  const user = await getUserDetail(id);
  if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

  return NextResponse.json({ user });
}

// PATCH /api/manager/users/[id] — update name/email or status (users.update)
export async function PATCH(request: NextRequest, ctx: RouteContext) {
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

  const { id } = await ctx.params;

  // Handle status change
  if (typeof body.status === 'string') {
    if (body.status !== 'active' && body.status !== 'disabled') {
      return NextResponse.json({ error: 'status must be active or disabled' }, { status: 400 });
    }
    // Prevent self-disable
    if (id === session.userId && body.status === 'disabled') {
      return NextResponse.json({ error: 'Cannot disable your own account' }, { status: 400 });
    }
    const ok = await setUserStatus(id, body.status);
    if (!ok) return NextResponse.json({ error: 'User not found' }, { status: 404 });
    return NextResponse.json({ ok: true });
  }

  // Handle profile update
  const name = typeof body.name === 'string' ? body.name.trim() : undefined;
  const email = typeof body.email === 'string' ? body.email.trim() : undefined;

  const result = await updateUser(id, { name, email });
  if (!result.ok) {
    if (result.reason === 'not_found') return NextResponse.json({ error: 'User not found' }, { status: 404 });
    if (result.reason === 'email_taken') return NextResponse.json({ error: 'Email already in use' }, { status: 409 });
  }

  return NextResponse.json({ user: result.ok ? result.user : null });
}
