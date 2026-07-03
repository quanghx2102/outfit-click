import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { loginUser } from '@/server/auth/auth.service';
import { createSessionToken, SESSION_COOKIE_NAME } from '@/lib/auth';

const SESSION_MAX_AGE = 60 * 60 * 24 * 7; // 7 days in seconds

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const { email, password } = (body ?? {}) as Record<string, unknown>;

  if (typeof email !== 'string' || !email.trim()) {
    return NextResponse.json({ error: 'email is required' }, { status: 400 });
  }
  if (typeof password !== 'string' || !password) {
    return NextResponse.json({ error: 'password is required' }, { status: 400 });
  }

  const result = await loginUser({ email, password });

  if (!result.ok) {
    return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
  }

  const token = createSessionToken(result.user.id);
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: SESSION_MAX_AGE,
  });

  return NextResponse.json({ user: result.user });
}
