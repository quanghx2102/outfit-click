import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { ForbiddenError, hasPermission, requirePermission } from '@/lib/permissions';
import { PERMISSIONS } from '@/constants/permissions';
import { getRoleById, updateRole } from '@/server/roles/role.service';

type RouteContext = { params: Promise<{ id: string }> };

// GET /api/manager/roles/[id]
export async function GET(_req: NextRequest, ctx: RouteContext) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const canView = await hasPermission(session.userId, PERMISSIONS.ROLES_VIEW);
  if (!canView) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const { id } = await ctx.params;
  const role = await getRoleById(id);
  if (!role) return NextResponse.json({ error: 'Role not found' }, { status: 404 });

  return NextResponse.json({ role });
}

// PATCH /api/manager/roles/[id] — update role name/description/status (roles.manage)
export async function PATCH(request: NextRequest, ctx: RouteContext) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    await requirePermission(session.userId, PERMISSIONS.ROLES_MANAGE);
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

  const name = typeof body.name === 'string' ? body.name.trim() : undefined;
  const description =
    body.description === null
      ? ''
      : typeof body.description === 'string'
        ? body.description.trim()
        : undefined;
  const status =
    body.status === 'active' || body.status === 'inactive' ? body.status : undefined;

  const result = await updateRole(id, { name, description, status });

  if (!result.ok) {
    if (result.reason === 'not_found') return NextResponse.json({ error: 'Role not found' }, { status: 404 });
    if (result.reason === 'system_role') return NextResponse.json({ error: 'Cannot disable system role admin' }, { status: 400 });
  }

  return NextResponse.json({ role: result.ok ? result.role : null });
}
