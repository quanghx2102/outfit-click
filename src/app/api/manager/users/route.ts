import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { ForbiddenError, hasPermission, requirePermission } from '@/lib/permissions';
import { PERMISSIONS } from '@/constants/permissions';
import { listUsers, createUser } from '@/server/users/user.service';

// GET /api/manager/users — list all users (users.view)
export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const canView = await hasPermission(session.userId, PERMISSIONS.USERS_VIEW);
  if (!canView) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const users = await listUsers();
  return NextResponse.json({ users });
}

// POST /api/manager/users — create user (users.create)
export async function POST(request: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    await requirePermission(session.userId, PERMISSIONS.USERS_CREATE);
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
  const email = typeof body.email === 'string' ? body.email.trim() : '';
  const password = typeof body.password === 'string' ? body.password : '';
  const roleIds = Array.isArray(body.roleIds)
    ? (body.roleIds as unknown[]).filter((v): v is string => typeof v === 'string')
    : [];

  if (!name) return NextResponse.json({ error: 'name is required' }, { status: 400 });
  if (!email) return NextResponse.json({ error: 'email is required' }, { status: 400 });
  if (!password || password.length < 8) {
    return NextResponse.json({ error: 'password must be at least 8 characters' }, { status: 400 });
  }

  const result = await createUser({ name, email, password, roleIds });

  if (!result.ok) {
    if (result.reason === 'email_taken') {
      return NextResponse.json({ error: 'Email is already in use' }, { status: 409 });
    }
  }

  return NextResponse.json({ user: result.ok ? result.user : null }, { status: 201 });
}
