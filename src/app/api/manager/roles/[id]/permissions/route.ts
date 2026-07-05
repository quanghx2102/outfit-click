import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { ForbiddenError, requirePermission } from '@/lib/permissions';
import { PERMISSIONS } from '@/constants/permissions';
import { setRolePermissions } from '@/server/roles/role.service';

type RouteContext = { params: Promise<{ id: string }> };

// PUT /api/manager/roles/[id]/permissions — replace all permissions for role (roles.manage)
export async function PUT(request: NextRequest, ctx: RouteContext) {
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

  const permissionIds = Array.isArray(body.permissionIds)
    ? (body.permissionIds as unknown[]).filter((v): v is string => typeof v === 'string')
    : [];

  const { id } = await ctx.params;
  const ok = await setRolePermissions(id, permissionIds);
  if (!ok) return NextResponse.json({ error: 'Role not found' }, { status: 404 });

  return NextResponse.json({ ok: true });
}
