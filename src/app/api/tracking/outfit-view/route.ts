import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { getOrCreateTrackingIds } from '@/lib/tracking';
import { hashIp } from '@/lib/ip-hash';
import { recordOutfitView } from '@/server/tracking/view-tracking.service';

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const OUTFIT_CODE_RE = /^[A-Z0-9]{6}$/;

function truncate(value: unknown, max: number): string | null {
  if (typeof value !== 'string') return null;
  const s = value.trim();
  return s.length > 0 ? s.slice(0, max) : null;
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  // Skip view log for authenticated manager sessions (manager preview rule).
  const session = await getSession();
  if (session) {
    return new NextResponse(null, { status: 204 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  if (typeof body !== 'object' || body === null) {
    return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
  }

  const raw = body as Record<string, unknown>;
  const outfitId = typeof raw.outfitId === 'string' ? raw.outfitId : '';
  const outfitCode = typeof raw.outfitCode === 'string' ? raw.outfitCode.toUpperCase() : '';

  if (!UUID_RE.test(outfitId) || !OUTFIT_CODE_RE.test(outfitCode)) {
    return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
  }

  const referrer = truncate(raw.referrer, 2048);
  const utmSource = truncate(raw.utmSource, 120);
  const utmMedium = truncate(raw.utmMedium, 120);
  const utmCampaign = truncate(raw.utmCampaign, 120);

  const { cookieId, sessionId } = await getOrCreateTrackingIds();

  const userAgent = request.headers.get('user-agent');
  const rawIp =
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    request.headers.get('x-real-ip') ??
    '';
  const ipHash = rawIp ? hashIp(rawIp) : null;

  try {
    await recordOutfitView({
      outfitId,
      outfitCode,
      sessionId,
      cookieId,
      referrer,
      utmSource,
      utmMedium,
      utmCampaign,
      userAgent,
      ipHash,
    });
  } catch (err) {
    console.error('[tracking/outfit-view] Failed to record view log:', err);
    return new NextResponse(null, { status: 500 });
  }

  return new NextResponse(null, { status: 204 });
}
