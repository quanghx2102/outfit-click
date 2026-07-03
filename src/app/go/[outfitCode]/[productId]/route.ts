import { NextRequest, NextResponse, after } from 'next/server';
import { getOrCreateTrackingIds } from '@/lib/tracking';
import { hashIp } from '@/lib/ip-hash';
import { getSession } from '@/lib/auth';
import {
  resolveClickRedirect,
  recordClick,
} from '@/server/tracking/click-tracking.service';
import { checkAntiSpam } from '@/server/tracking/anti-spam.service';

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

type Params = { outfitCode: string; productId: string };

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<Params> },
): Promise<NextResponse> {
  const { outfitCode, productId } = await params;

  // Reject clearly malformed productId before hitting the DB.
  if (!UUID_RE.test(productId)) {
    return NextResponse.redirect(new URL('/outfits', request.url), 302);
  }

  const result = await resolveClickRedirect(outfitCode, productId);

  if (!result.valid) {
    return NextResponse.redirect(new URL(result.fallbackUrl, request.url), 302);
  }

  // Read or create tracking cookies. Must happen before returning the redirect
  // so the Set-Cookie headers are merged into the response by Next.js.
  const { cookieId, sessionId } = await getOrCreateTrackingIds();

  // Check manager session for preview detection (cheap: cookie read + HMAC verify, no DB).
  const session = await getSession();

  const userAgent = request.headers.get('user-agent');
  const rawIp =
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    request.headers.get('x-real-ip') ??
    '';
  const ipHash = rawIp ? hashIp(rawIp) : null;

  const { searchParams } = new URL(request.url);
  const referrer = request.headers.get('referer');
  const utmSource = searchParams.get('utm_source');
  const utmMedium = searchParams.get('utm_medium');
  const utmCampaign = searchParams.get('utm_campaign');

  // Write click log after the redirect response is sent — non-blocking.
  // Anti-spam checks (including DB queries) run inside after() to keep redirect fast.
  after(async () => {
    try {
      const spamResult = await checkAntiSpam({
        sessionId,
        outfitId: result.outfitId,
        productId: result.productId,
        userAgent,
        isManagerPreview: session !== null,
      });

      await recordClick({
        outfitId: result.outfitId,
        productId: result.productId,
        outfitCode: result.outfitCode,
        urlSuffix: result.urlSuffix,
        sessionId,
        cookieId,
        redirectUrl: result.redirectUrl,
        referrer,
        utmSource,
        utmMedium,
        utmCampaign,
        userAgent,
        ipHash,
        ...spamResult,
      });
    } catch (err) {
      console.error('[go] Failed to record click log:', err);
    }
  });

  return NextResponse.redirect(result.redirectUrl, 302);
}
