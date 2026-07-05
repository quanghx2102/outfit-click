import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { ForbiddenError, requirePermission } from '@/lib/permissions';
import { PERMISSIONS } from '@/constants/permissions';
import { assignRolesToUser } from '@/server/users/user.service';

type RouteContext = { params: Promise<{ id: string }> };

// PUT /api/manager/users/[id]/roles — replace all roles for user (users.assign_roles → users.update)
export async function PUT(request: NextRequest, ctx: RouteContext) {
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

  const roleIds = Array.isArray(body.roleIds)
    ? (body.roleIds as unknown[]).filter((v): v is string => typeof v === 'string')
    : [];

  const { id } = await ctx.params;

  // Prevent removing own admin role (safety: users cannot demote themselves)
  if (id === session.userId && roleIds.length === 0) {
    return NextResponse.json({ error: 'Cannot remove all roles from your own account' }, { status: 400 });
  }

  const ok = await assignRolesToUser(id, roleIds);
  if (!ok) return NextResponse.json({ error: 'User not found' }, { status: 404 });

  return NextResponse.json({ ok: true });
}
