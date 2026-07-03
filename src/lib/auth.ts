// Server-only: Node.js runtime. Do not import in middleware or client components.
import { createHmac, randomBytes, scryptSync, timingSafeEqual } from 'crypto';
import { cookies } from 'next/headers';
import { env } from './env';

// ─── Constants ────────────────────────────────────────────────────────────────

export const SESSION_COOKIE_NAME = 'aos_session';
const SESSION_TTL_SECONDS = 60 * 60 * 24 * 7; // 7 days

// ─── Password ─────────────────────────────────────────────────────────────────
// Format: `${saltHex}:${derivedKeyHex}` — must stay in sync with prisma/seed.ts

export function hashPassword(password: string): string {
  const salt = randomBytes(16).toString('hex');
  const derived = scryptSync(password, salt, 64).toString('hex');
  return `${salt}:${derived}`;
}

export function verifyPassword(password: string, hash: string): boolean {
  const colonIndex = hash.indexOf(':');
  if (colonIndex === -1) return false;
  const salt = hash.slice(0, colonIndex);
  const derivedHex = hash.slice(colonIndex + 1);
  if (!salt || !derivedHex) return false;
  try {
    const derived = scryptSync(password, salt, 64);
    const expected = Buffer.from(derivedHex, 'hex');
    if (derived.length !== expected.length) return false;
    return timingSafeEqual(derived, expected);
  } catch {
    return false;
  }
}

// ─── Session token ─────────────────────────────────────────────────────────────
// Format: `${base64url(payload)}.${hmacSha256Signature}`
// Payload: JSON({ userId, exp }) where exp is Unix seconds

interface SessionPayload {
  userId: string;
  exp: number;
}

function signPayload(encodedPayload: string): string {
  return createHmac('sha256', env.authSecret).update(encodedPayload).digest('base64url');
}

export function createSessionToken(userId: string): string {
  const payload: SessionPayload = {
    userId,
    exp: Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS,
  };
  const encodedPayload = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const signature = signPayload(encodedPayload);
  return `${encodedPayload}.${signature}`;
}

export function verifySessionToken(token: string): SessionPayload | null {
  const dotIndex = token.lastIndexOf('.');
  if (dotIndex === -1) return null;
  const encodedPayload = token.slice(0, dotIndex);
  const signature = token.slice(dotIndex + 1);

  const expectedSignature = signPayload(encodedPayload);
  if (signature !== expectedSignature) return null;

  try {
    const raw = Buffer.from(encodedPayload, 'base64url').toString('utf-8');
    const payload = JSON.parse(raw) as SessionPayload;
    if (Math.floor(Date.now() / 1000) > payload.exp) return null;
    if (!payload.userId || typeof payload.userId !== 'string') return null;
    return payload;
  } catch {
    return null;
  }
}

export async function getSession(): Promise<SessionPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  if (!token) return null;
  return verifySessionToken(token);
}
