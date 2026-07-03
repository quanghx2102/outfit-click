import { prisma } from '@/lib/db';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface DateRangeParams {
  from: Date;
  to: Date;
}

export interface OutfitStatusCounts {
  active: number;
  draft: number;
  hidden: number;
}

export interface ProductStatusCounts {
  active: number;
  inactive: number;
}

export interface AnalyticsOverview {
  outfitCounts: OutfitStatusCounts;
  productCounts: ProductStatusCounts;
  totalViews: number;
  validClicks: number;
  ctr: number;
}

export interface TopOutfitItem {
  outfitId: string;
  outfitCode: string;
  name: string;
  coverImageUrl: string;
  clickCount: number;
}

export interface TopProductItem {
  productId: string;
  name: string;
  imageUrl: string;
  mockupImageUrl: string | null;
  urlSuffix: string;
  clickCount: number;
}

// ─── Service functions ────────────────────────────────────────────────────────

/**
 * Aggregate system-wide counts and date-range metrics.
 * Outfit/product counts are snapshots of current DB state (no date filter).
 * Views and valid clicks are filtered by date range.
 * CTR = validClicks / totalViews; 0 if no views.
 */
export async function getAnalyticsOverview(range: DateRangeParams): Promise<AnalyticsOverview> {
  const [outfitGroups, productGroups, totalViews, validClicks] = await Promise.all([
    prisma.outfit.groupBy({
      by: ['status'],
      where: { deletedAt: null, status: { in: ['active', 'draft', 'hidden'] } },
      _count: { _all: true },
    }),
    prisma.product.groupBy({
      by: ['status'],
      where: { deletedAt: null, status: { in: ['active', 'inactive'] } },
      _count: { _all: true },
    }),
    prisma.outfitViewLog.count({
      where: { viewedAt: { gte: range.from, lte: range.to } },
    }),
    prisma.clickLog.count({
      where: { isValid: true, clickedAt: { gte: range.from, lte: range.to } },
    }),
  ]);

  const outfitCounts: OutfitStatusCounts = { active: 0, draft: 0, hidden: 0 };
  for (const g of outfitGroups) {
    if (g.status === 'active') outfitCounts.active = g._count._all;
    else if (g.status === 'draft') outfitCounts.draft = g._count._all;
    else if (g.status === 'hidden') outfitCounts.hidden = g._count._all;
  }

  const productCounts: ProductStatusCounts = { active: 0, inactive: 0 };
  for (const g of productGroups) {
    if (g.status === 'active') productCounts.active = g._count._all;
    else if (g.status === 'inactive') productCounts.inactive = g._count._all;
  }

  const ctr = totalViews > 0 ? validClicks / totalViews : 0;

  return { outfitCounts, productCounts, totalViews, validClicks, ctr };
}

/**
 * Top outfits ranked by valid click count in the date range.
 * Two-query approach: groupBy click_logs → fetch outfit details.
 */
export async function getTopOutfits(range: DateRangeParams, limit = 10): Promise<TopOutfitItem[]> {
  const groups = await prisma.clickLog.groupBy({
    by: ['outfitId'],
    where: { isValid: true, clickedAt: { gte: range.from, lte: range.to } },
    _count: { outfitId: true },
    orderBy: { _count: { outfitId: 'desc' } },
    take: limit,
  });

  if (groups.length === 0) return [];

  const outfitIds = groups.map((g) => g.outfitId);
  const outfits = await prisma.outfit.findMany({
    where: { id: { in: outfitIds }, deletedAt: null },
    select: { id: true, outfitCode: true, name: true, coverImageUrl: true },
  });

  const outfitMap = new Map(outfits.map((o) => [o.id, o]));

  return groups
    .map((g) => {
      const outfit = outfitMap.get(g.outfitId);
      if (!outfit) return null;
      return {
        outfitId: outfit.id,
        outfitCode: outfit.outfitCode,
        name: outfit.name,
        coverImageUrl: outfit.coverImageUrl,
        clickCount: g._count.outfitId,
      };
    })
    .filter((item): item is TopOutfitItem => item !== null);
}

/**
 * Top products ranked by valid click count in the date range.
 * Two-query approach: groupBy click_logs → fetch product details.
 */
export async function getTopProducts(range: DateRangeParams, limit = 10): Promise<TopProductItem[]> {
  const groups = await prisma.clickLog.groupBy({
    by: ['productId'],
    where: { isValid: true, clickedAt: { gte: range.from, lte: range.to } },
    _count: { productId: true },
    orderBy: { _count: { productId: 'desc' } },
    take: limit,
  });

  if (groups.length === 0) return [];

  const productIds = groups.map((g) => g.productId);
  const products = await prisma.product.findMany({
    where: { id: { in: productIds }, deletedAt: null },
    select: { id: true, name: true, imageUrl: true, mockupImageUrl: true, urlSuffix: true },
  });

  const productMap = new Map(products.map((p) => [p.id, p]));

  return groups
    .map((g) => {
      const product = productMap.get(g.productId);
      if (!product) return null;
      return {
        productId: product.id,
        name: product.name,
        imageUrl: product.imageUrl,
        mockupImageUrl: product.mockupImageUrl,
        urlSuffix: product.urlSuffix,
        clickCount: g._count.productId,
      };
    })
    .filter((item): item is TopProductItem => item !== null);
}

// ─── Scoped service functions (analytics.view_own) ────────────────────────────
// Staff sees only outfits they created (createdBy) and products assigned to them.
// Prisma groupBy does not support relation filters, so scoped top-list functions
// use a two-step approach: fetch eligible IDs first, then groupBy against those IDs.

/**
 * Overview metrics scoped to the user's own outfits and assigned products.
 * - outfitCounts: outfits created by user
 * - productCounts: products assigned to user
 * - totalViews: views for outfits created by user
 * - validClicks: clicks where outfit was created by user OR product was assigned to user
 */
export async function getAnalyticsOverviewOwn(
  range: DateRangeParams,
  userId: string,
): Promise<AnalyticsOverview> {
  const [outfitGroups, productGroups, totalViews, validClicks] = await Promise.all([
    prisma.outfit.groupBy({
      by: ['status'],
      where: { deletedAt: null, status: { in: ['active', 'draft', 'hidden'] }, createdBy: userId },
      _count: { _all: true },
    }),
    prisma.product.groupBy({
      by: ['status'],
      where: { deletedAt: null, status: { in: ['active', 'inactive'] }, assignedTo: userId },
      _count: { _all: true },
    }),
    prisma.outfitViewLog.count({
      where: { viewedAt: { gte: range.from, lte: range.to }, outfit: { createdBy: userId } },
    }),
    prisma.clickLog.count({
      where: {
        isValid: true,
        clickedAt: { gte: range.from, lte: range.to },
        OR: [{ outfit: { createdBy: userId } }, { product: { assignedTo: userId } }],
      },
    }),
  ]);

  const outfitCounts: OutfitStatusCounts = { active: 0, draft: 0, hidden: 0 };
  for (const g of outfitGroups) {
    if (g.status === 'active') outfitCounts.active = g._count._all;
    else if (g.status === 'draft') outfitCounts.draft = g._count._all;
    else if (g.status === 'hidden') outfitCounts.hidden = g._count._all;
  }

  const productCounts: ProductStatusCounts = { active: 0, inactive: 0 };
  for (const g of productGroups) {
    if (g.status === 'active') productCounts.active = g._count._all;
    else if (g.status === 'inactive') productCounts.inactive = g._count._all;
  }

  const ctr = totalViews > 0 ? validClicks / totalViews : 0;
  return { outfitCounts, productCounts, totalViews, validClicks, ctr };
}

/**
 * Top outfits by valid clicks, scoped to outfits created by the user.
 * Step 1: fetch outfit IDs created by user. Step 2: groupBy click_logs on those IDs.
 */
export async function getTopOutfitsOwn(
  range: DateRangeParams,
  userId: string,
  limit = 10,
): Promise<TopOutfitItem[]> {
  const userOutfits = await prisma.outfit.findMany({
    where: { createdBy: userId, deletedAt: null },
    select: { id: true },
  });
  if (userOutfits.length === 0) return [];

  const userOutfitIds = userOutfits.map((o) => o.id);

  const groups = await prisma.clickLog.groupBy({
    by: ['outfitId'],
    where: {
      isValid: true,
      clickedAt: { gte: range.from, lte: range.to },
      outfitId: { in: userOutfitIds },
    },
    _count: { outfitId: true },
    orderBy: { _count: { outfitId: 'desc' } },
    take: limit,
  });

  if (groups.length === 0) return [];

  const outfitIds = groups.map((g) => g.outfitId);
  const outfits = await prisma.outfit.findMany({
    where: { id: { in: outfitIds }, deletedAt: null },
    select: { id: true, outfitCode: true, name: true, coverImageUrl: true },
  });

  const outfitMap = new Map(outfits.map((o) => [o.id, o]));
  return groups
    .map((g) => {
      const outfit = outfitMap.get(g.outfitId);
      if (!outfit) return null;
      return {
        outfitId: outfit.id,
        outfitCode: outfit.outfitCode,
        name: outfit.name,
        coverImageUrl: outfit.coverImageUrl,
        clickCount: g._count.outfitId,
      };
    })
    .filter((item): item is TopOutfitItem => item !== null);
}

/**
 * Top products by valid clicks, scoped to products assigned to the user.
 * Step 1: fetch product IDs assigned to user. Step 2: groupBy click_logs on those IDs.
 */
export async function getTopProductsOwn(
  range: DateRangeParams,
  userId: string,
  limit = 10,
): Promise<TopProductItem[]> {
  const userProducts = await prisma.product.findMany({
    where: { assignedTo: userId, deletedAt: null },
    select: { id: true },
  });
  if (userProducts.length === 0) return [];

  const userProductIds = userProducts.map((p) => p.id);

  const groups = await prisma.clickLog.groupBy({
    by: ['productId'],
    where: {
      isValid: true,
      clickedAt: { gte: range.from, lte: range.to },
      productId: { in: userProductIds },
    },
    _count: { productId: true },
    orderBy: { _count: { productId: 'desc' } },
    take: limit,
  });

  if (groups.length === 0) return [];

  const productIds = groups.map((g) => g.productId);
  const products = await prisma.product.findMany({
    where: { id: { in: productIds }, deletedAt: null },
    select: { id: true, name: true, imageUrl: true, mockupImageUrl: true, urlSuffix: true },
  });

  const productMap = new Map(products.map((p) => [p.id, p]));
  return groups
    .map((g) => {
      const product = productMap.get(g.productId);
      if (!product) return null;
      return {
        productId: product.id,
        name: product.name,
        imageUrl: product.imageUrl,
        mockupImageUrl: product.mockupImageUrl,
        urlSuffix: product.urlSuffix,
        clickCount: g._count.productId,
      };
    })
    .filter((item): item is TopProductItem => item !== null);
}
