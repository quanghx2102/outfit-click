// Edge runtime — do not import Node.js-only modules here.
// Full cryptographic session verification happens in API routes and server components.
// This middleware provides UX-level redirect only.
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Duplicated from src/lib/auth.ts to avoid importing Node.js crypto in Edge runtime.
const SESSION_COOKIE_NAME = 'aos_session';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith('/manager') && !pathname.startsWith('/manager/login')) {
    const hasSession = !!request.cookies.get(SESSION_COOKIE_NAME)?.value;
    if (!hasSession) {
      const loginUrl = new URL('/manager/login', request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/manager/:path*'],
};
