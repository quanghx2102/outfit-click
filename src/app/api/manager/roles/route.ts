import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { ForbiddenError, hasPermission, requirePermission } from '@/lib/permissions';
import { PERMISSIONS } from '@/constants/permissions';
import { listRolesWithPermissions, listAllPermissions, createRole } from '@/server/roles/role.service';

// GET /api/manager/roles — list all roles with permissions
export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const canView = await hasPermission(session.userId, PERMISSIONS.ROLES_VIEW);
  if (!canView) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const [roles, permissions] = await Promise.all([
    listRolesWithPermissions(),
    listAllPermissions(),
  ]);

  return NextResponse.json({ roles, permissions });
}

// POST /api/manager/roles — create role (roles.manage)
export async function POST(request: NextRequest) {
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

  const name = typeof body.name === 'string' ? body.name.trim() : '';
  const code = typeof body.code === 'string' ? body.code.trim() : '';
  const description = typeof body.description === 'string' ? body.description.trim() : undefined;
  const permissionIds = Array.isArray(body.permissionIds)
    ? (body.permissionIds as unknown[]).filter((v): v is string => typeof v === 'string')
    : [];

  if (!name) return NextResponse.json({ error: 'name is required' }, { status: 400 });
  if (!code) return NextResponse.json({ error: 'code is required' }, { status: 400 });
  if (!/^[a-z0-9_]+$/.test(code)) {
    return NextResponse.json({ error: 'code must be lowercase letters, numbers, and underscores only' }, { status: 400 });
  }

  const result = await createRole({ name, code, description, permissionIds });

  if (!result.ok) {
    if (result.reason === 'code_taken') {
      return NextResponse.json({ error: 'Role code is already in use' }, { status: 409 });
    }
  }

  return NextResponse.json({ role: result.ok ? result.role : null }, { status: 201 });
}
