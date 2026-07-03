// Server-only: Node.js runtime. Do not import in middleware or client components.
import { createHash, createHmac } from 'crypto';
import { env } from './env';

/**
 * Hash an IP address for privacy-preserving storage.
 * Uses HMAC-SHA256 with TRACKING_IP_HASH_SECRET when configured;
 * falls back to plain SHA256 if the secret is absent.
 * Never stores the raw IP.
 */
export function hashIp(ip: string): string {
  const secret = env.tracking.ipHashSecret;
  if (secret) {
    return createHmac('sha256', secret).update(ip).digest('hex');
  }
  return createHash('sha256').update(ip).digest('hex');
}
