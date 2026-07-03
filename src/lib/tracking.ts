// Server-only: Next.js Route Handlers and Server Actions only.
// cookies().set() is NOT available in Server Components — call this only from route handlers or actions.
import { randomUUID } from 'crypto';
import { cookies } from 'next/headers';
import { TRACKING_COOKIE, TRACKING_CONFIG } from '@/constants/tracking';
import { env } from './env';

export interface TrackingIds {
  cookieId: string;
  sessionId: string;
}

/**
 * Read or create the two anonymous tracking cookies:
 *   aos_uid — long-lived user identifier (365 days)
 *   aos_sid — session identifier (30 minutes; new session when absent/expired)
 *
 * No PII is stored. UUIDs are random and carry no identity.
 */
export async function getOrCreateTrackingIds(): Promise<TrackingIds> {
  const cookieStore = await cookies();
  const isProduction = env.nodeEnv === 'production';
  const domainOption = env.tracking.cookieDomain
    ? { domain: env.tracking.cookieDomain }
    : {};

  // ── User ID cookie — long-lived, 365 days ──────────────────────────────────
  let cookieId = cookieStore.get(TRACKING_COOKIE.USER_ID)?.value ?? '';
  if (!cookieId) {
    cookieId = randomUUID();
    cookieStore.set(TRACKING_COOKIE.USER_ID, cookieId, {
      httpOnly: true,
      sameSite: 'lax',
      path: '/',
      maxAge: TRACKING_CONFIG.USER_COOKIE_TTL_DAYS * 24 * 60 * 60,
      secure: isProduction,
      ...domainOption,
    });
  }

  // ── Session ID cookie — 30 minutes; absent = expired = new session ─────────
  let sessionId = cookieStore.get(TRACKING_COOKIE.SESSION_ID)?.value ?? '';
  if (!sessionId) {
    sessionId = randomUUID();
    cookieStore.set(TRACKING_COOKIE.SESSION_ID, sessionId, {
      httpOnly: true,
      sameSite: 'lax',
      path: '/',
      maxAge: TRACKING_CONFIG.SESSION_TTL_MINUTES * 60,
      secure: isProduction,
      ...domainOption,
    });
  }

  return { cookieId, sessionId };
}
