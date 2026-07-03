// Server-only: do not import in client components or Edge runtime.

import { createHash, createHmac } from 'node:crypto';
import { env } from '@/lib/env';

export type R2UploadParams = {
  fileKey: string;
  body: Buffer;
  contentType: string;
};

export type R2UploadResult = {
  fileKey: string;
  fileUrl: string;
};

// Build the public CDN URL for a stored file.
export function getPublicUrl(fileKey: string): string {
  return `${env.r2.publicBaseUrl}/${fileKey}`;
}

// ─── AWS SigV4 internals ────────────────────────────────────────────────────

function sha256Hex(data: string | Buffer): string {
  return createHash('sha256').update(data).digest('hex');
}

function hmacSha256(key: Buffer | string, data: string): Buffer {
  return createHmac('sha256', key).update(data, 'utf8').digest();
}

// Derives the hierarchical signing key: secret → date → region → service → request.
// R2 uses region "auto" and service "s3" (S3-compatible API).
function deriveSigningKey(secretKey: string, dateStamp: string): Buffer {
  const kDate = hmacSha256(`AWS4${secretKey}`, dateStamp);
  const kRegion = hmacSha256(kDate, 'auto');
  const kService = hmacSha256(kRegion, 's3');
  return hmacSha256(kService, 'aws4_request');
}

// Returns dateTime ("20240101T120000Z") and dateStamp ("20240101") from a Date.
function toAmzDateTime(date: Date): { dateTime: string; dateStamp: string } {
  const iso = date.toISOString().replace(/[:-]/g, '').split('.')[0] + 'Z';
  return { dateTime: iso, dateStamp: iso.substring(0, 8) };
}

type SignParams = {
  method: string;
  path: string;
  host: string;
  headers: Record<string, string>; // lowercase keys, already including x-amz-*
  payloadHash: string;
  dateTime: string;
  dateStamp: string;
};

// Builds the AWS4-HMAC-SHA256 Authorization header value.
function buildAuthorization(p: SignParams): string {
  // host is always included in the signature; merged here for canonical headers
  const allHeaders: Record<string, string> = { host: p.host, ...p.headers };
  const sortedKeys = Object.keys(allHeaders).sort();
  const canonicalHeaders = sortedKeys.map((k) => `${k}:${allHeaders[k]}\n`).join('');
  const signedHeaders = sortedKeys.join(';');

  // Canonical request per AWS SigV4 spec
  const canonicalRequest = [
    p.method,
    p.path,
    '', // empty query string
    canonicalHeaders, // already ends with \n; join adds one more → blank separator line
    signedHeaders,
    p.payloadHash,
  ].join('\n');

  const credentialScope = `${p.dateStamp}/auto/s3/aws4_request`;
  const stringToSign = [
    'AWS4-HMAC-SHA256',
    p.dateTime,
    credentialScope,
    sha256Hex(canonicalRequest),
  ].join('\n');

  const signingKey = deriveSigningKey(env.r2.secretAccessKey, p.dateStamp);
  const signature = hmacSha256(signingKey, stringToSign).toString('hex');

  return (
    `AWS4-HMAC-SHA256 Credential=${env.r2.accessKeyId}/${credentialScope},` +
    ` SignedHeaders=${signedHeaders},` +
    ` Signature=${signature}`
  );
}

// ─── Public helpers ─────────────────────────────────────────────────────────

// Upload a file to R2. Throws on non-2xx response.
export async function uploadToR2({
  fileKey,
  body,
  contentType,
}: R2UploadParams): Promise<R2UploadResult> {
  const endpoint = env.r2.endpoint.replace(/\/$/, '');
  const url = `${endpoint}/${env.r2.bucketName}/${fileKey}`;
  const path = `/${env.r2.bucketName}/${fileKey}`;
  const host = new URL(endpoint).host;

  const { dateTime, dateStamp } = toAmzDateTime(new Date());
  const payloadHash = sha256Hex(body);

  // Headers signed in the request (lowercase keys)
  const headers: Record<string, string> = {
    'content-type': contentType,
    'x-amz-content-sha256': payloadHash,
    'x-amz-date': dateTime,
  };

  const authorization = buildAuthorization({
    method: 'PUT',
    path,
    host,
    headers,
    payloadHash,
    dateTime,
    dateStamp,
  });

  // Do NOT set 'host' explicitly — fetch derives it from the URL automatically.
  // Double assertion needed: @types/node v20 types Buffer as Buffer<ArrayBufferLike>
  // which is not directly assignable to BodyInit's ArrayBufferView. Works at runtime.
  const res = await fetch(url, {
    method: 'PUT',
    headers: { ...headers, authorization },
    body: body as unknown as BodyInit,
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`R2 upload failed [${res.status}]: ${text}`);
  }

  return { fileKey, fileUrl: getPublicUrl(fileKey) };
}

// Delete a file from R2.
// 404 is treated as success (file already gone — idempotent).
export async function deleteFromR2(fileKey: string): Promise<void> {
  const endpoint = env.r2.endpoint.replace(/\/$/, '');
  const url = `${endpoint}/${env.r2.bucketName}/${fileKey}`;
  const path = `/${env.r2.bucketName}/${fileKey}`;
  const host = new URL(endpoint).host;

  const { dateTime, dateStamp } = toAmzDateTime(new Date());
  const payloadHash = sha256Hex(''); // empty body for DELETE

  const headers: Record<string, string> = {
    'x-amz-content-sha256': payloadHash,
    'x-amz-date': dateTime,
  };

  const authorization = buildAuthorization({
    method: 'DELETE',
    path,
    host,
    headers,
    payloadHash,
    dateTime,
    dateStamp,
  });

  const res = await fetch(url, {
    method: 'DELETE',
    headers: { ...headers, authorization },
  });

  if (!res.ok && res.status !== 404) {
    const text = await res.text().catch(() => '');
    throw new Error(`R2 delete failed [${res.status}]: ${text}`);
  }
}
