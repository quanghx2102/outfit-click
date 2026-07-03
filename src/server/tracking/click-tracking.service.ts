import { prisma } from '@/lib/db';

// ─── Resolve redirect ─────────────────────────────────────────────────────────

type ClickRedirectInvalid = { valid: false; fallbackUrl: string };
type ClickRedirectValid = {
  valid: true;
  outfitId: string;
  productId: string;
  outfitCode: string;
  urlSuffix: string;
  redirectUrl: string;
};
export type ClickRedirectResult = ClickRedirectInvalid | ClickRedirectValid;

/**
 * Validate outfit + product for the /go redirect route and return the affiliate URL.
 * Single DB query to keep redirect latency low.
 */
export async function resolveClickRedirect(
  outfitCode: string,
  productId: string,
): Promise<ClickRedirectResult> {
  const outfit = await prisma.outfit.findFirst({
    where: {
      outfitCode: outfitCode.toUpperCase(),
      status: 'active',
      deletedAt: null,
    },
    select: {
      id: true,
      outfitCode: true,
      slug: true,
      outfitProducts: {
        where: { productId },
        select: {
          product: {
            select: {
              id: true,
              urlSuffix: true,
              h5Link: true,
              affiliateUrl: true,
              status: true,
              deletedAt: true,
            },
          },
        },
      },
    },
  });

  if (!outfit) {
    return { valid: false, fallbackUrl: '/outfits' };
  }

  const outfitDetailUrl = `/outfit/${outfit.slug}-${outfit.outfitCode.toLowerCase()}`;

  const membership = outfit.outfitProducts[0];
  if (!membership) {
    return { valid: false, fallbackUrl: outfitDetailUrl };
  }

  const product = membership.product;
  if (product.status !== 'active' || product.deletedAt !== null) {
    return { valid: false, fallbackUrl: outfitDetailUrl };
  }

  const redirectUrl = product.h5Link ?? product.affiliateUrl;
  if (!redirectUrl) {
    return { valid: false, fallbackUrl: outfitDetailUrl };
  }

  return {
    valid: true,
    outfitId: outfit.id,
    productId: product.id,
    outfitCode: outfit.outfitCode,
    urlSuffix: product.urlSuffix,
    redirectUrl,
  };
}

// ─── Record click log ─────────────────────────────────────────────────────────

export interface ClickLogInput {
  outfitId: string;
  productId: string;
  outfitCode: string;
  urlSuffix: string;
  sessionId: string | null;
  cookieId: string | null;
  redirectUrl: string;
  referrer: string | null;
  utmSource: string | null;
  utmMedium: string | null;
  utmCampaign: string | null;
  userAgent: string | null;
  ipHash: string | null;
  isValid: boolean;
  isSuspicious: boolean;
  invalidReason: string | null;
}

export async function recordClick(input: ClickLogInput): Promise<void> {
  await prisma.clickLog.create({ data: input });
}
