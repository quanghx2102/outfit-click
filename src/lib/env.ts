// Server-only: do not import in client components.

function requireEnv(key: string): string {
  const value = process.env[key];
  if (!value || value.trim() === '') {
    throw new Error(`[env] Missing required environment variable: ${key}`);
  }
  return value.trim();
}

function optionalEnv(key: string, fallback = ''): string {
  const value = process.env[key];
  return value?.trim() || fallback;
}

export const env = {
  // App
  appUrl: requireEnv('NEXT_PUBLIC_APP_URL'),
  nodeEnv: (process.env.NODE_ENV ?? 'development') as 'development' | 'production' | 'test',

  // Database
  databaseUrl: requireEnv('DATABASE_URL'),

  // Auth
  authSecret: requireEnv('AUTH_SECRET'),

  // Cron
  cronSecret: requireEnv('CRON_SECRET'),

  // Product sync (MyCollection API)
  sync: {
    urlSuffixes: requireEnv('PRODUCT_SYNC_URL_SUFFIXES')
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean),
    groupIds: optionalEnv('PRODUCT_SYNC_GROUP_IDS')
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean),
    affiliateId: optionalEnv('MYCOLLECTION_AFFILIATE_ID'),
    affiliateUserId: optionalEnv('MYCOLLECTION_AFFILIATE_USER_ID'),
    uuId: optionalEnv('MYCOLLECTION_UUID'),
    deviceId: optionalEnv('MYCOLLECTION_DEVICE_ID'),
    cid: optionalEnv('MYCOLLECTION_CID', 'vn'),
    language: optionalEnv('MYCOLLECTION_LANGUAGE', 'vi'),
  },

  // Cloudflare R2
  r2: {
    accountId: requireEnv('R2_ACCOUNT_ID'),
    accessKeyId: requireEnv('R2_ACCESS_KEY_ID'),
    secretAccessKey: requireEnv('R2_SECRET_ACCESS_KEY'),
    bucketName: requireEnv('R2_BUCKET_NAME'),
    publicBaseUrl: requireEnv('R2_PUBLIC_BASE_URL'),
    endpoint: requireEnv('R2_ENDPOINT'),
  },

  // Tracking
  tracking: {
    cookieDomain: optionalEnv('TRACKING_COOKIE_DOMAIN'),
    ipHashSecret: optionalEnv('TRACKING_IP_HASH_SECRET'),
  },
} as const;

export type Env = typeof env;
