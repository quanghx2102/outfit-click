import { prisma } from '@/lib/db';
import { TRACKING_CONFIG, CLICK_INVALID_REASON } from '@/constants/tracking';
import type { ClickInvalidReason } from '@/constants/tracking';

export interface AntiSpamInput {
  sessionId: string | null;
  outfitId: string;
  productId: string;
  userAgent: string | null;
  isManagerPreview: boolean;
}

export interface AntiSpamResult {
  isValid: boolean;
  isSuspicious: boolean;
  invalidReason: ClickInvalidReason | null;
}

const BOT_UA_PATTERNS: RegExp[] = [
  /bot/i,
  /crawl/i,
  /spider/i,
  /slurp/i,
  /facebookexternalhit/i,
  /mediapartners-google/i,
  /adsbot/i,
  /applebot/i,
  /bingbot/i,
  /googlebot/i,
  /duckduckbot/i,
  /baiduspider/i,
  /yandexbot/i,
  /sogou/i,
  /exabot/i,
  /facebot/i,
  /ia_archiver/i,
  /semrushbot/i,
  /ahrefsbot/i,
  /mj12bot/i,
  /dotbot/i,
  /rogerbot/i,
  /screaming frog/i,
];

function isBotUserAgent(userAgent: string | null): boolean {
  if (!userAgent) return false;
  return BOT_UA_PATTERNS.some((pattern) => pattern.test(userAgent));
}

/**
 * Evaluate anti-spam rules for a click event.
 * All rules still allow the redirect — they only influence isValid/isSuspicious/invalidReason.
 * Cheap synchronous checks run first; DB queries only run when necessary.
 */
export async function checkAntiSpam(input: AntiSpamInput): Promise<AntiSpamResult> {
  const { sessionId, outfitId, productId, userAgent, isManagerPreview } = input;

  if (isManagerPreview) {
    return { isValid: false, isSuspicious: false, invalidReason: CLICK_INVALID_REASON.MANAGER_PREVIEW };
  }

  if (isBotUserAgent(userAgent)) {
    return { isValid: false, isSuspicious: true, invalidReason: CLICK_INVALID_REASON.BOT_USER_AGENT };
  }

  if (sessionId !== null) {
    const duplicateWindowStart = new Date(
      Date.now() - TRACKING_CONFIG.DUPLICATE_CLICK_WINDOW_SECONDS * 1000,
    );
    const duplicate = await prisma.clickLog.findFirst({
      where: { sessionId, outfitId, productId, clickedAt: { gte: duplicateWindowStart } },
      select: { id: true },
    });
    if (duplicate) {
      return { isValid: false, isSuspicious: false, invalidReason: CLICK_INVALID_REASON.DUPLICATE_CLICK_30S };
    }

    const oneMinuteAgo = new Date(Date.now() - 60_000);
    const recentCount = await prisma.clickLog.count({
      where: { sessionId, clickedAt: { gte: oneMinuteAgo } },
    });
    if (recentCount >= TRACKING_CONFIG.MAX_CLICKS_PER_SESSION_PER_MINUTE) {
      return { isValid: false, isSuspicious: true, invalidReason: CLICK_INVALID_REASON.TOO_MANY_CLICKS_PER_SESSION };
    }
  }

  return { isValid: true, isSuspicious: false, invalidReason: null };
}
