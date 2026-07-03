import { prisma } from '@/lib/db';
import type { Prisma } from '@prisma/client';
import type { OutfitStatus } from '@/constants/status';
import type { DataScope } from '@/lib/permissions';
import { getProductDisplayImage } from '@/lib/utils';

// ─── Types ───────────────────────────────────────────────────────────────────

export interface OutfitDetail {
  id: string;
  outfitCode: string;
  name: string;
  slug: string;
  description: string | null;
  coverImageUrl: string;
  styleId: string | null;
  outfitTypeId: string | null;
  status: string;
  createdBy: string;
  publishedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
  style: { id: string; name: string } | null;
  outfitType: { id: string; name: string } | null;
}

export interface CreateOutfitInput {
  id: string;
  outfitCode: string;
  name: string;
  slug: string;
  description?: string;
  coverImageUrl: string;
  styleId?: string;
  outfitTypeId?: string;
}

export interface UpdateOutfitInput {
  name?: string;
  slug?: string;
  description?: string | null;
  styleId?: string | null;
  outfitTypeId?: string | null;
  status?: string;
}

export interface ListOutfitsParams {
  keyword?: string;
  status?: OutfitStatus;
  styleId?: string;
  outfitTypeId?: string;
  page: number;
  limit: number;
}

export interface OutfitListItem {
  id: string;
  outfitCode: string;
  name: string;
  slug: string;
  coverImageUrl: string;
  status: string;
  productCount: number;
  publishedAt: Date | null;
  style: { id: string; name: string } | null;
  outfitType: { id: string; name: string } | null;
}

export interface ListOutfitsResult {
  items: OutfitListItem[];
  total: number;
  page: number;
  limit: number;
}

export interface StyleOption {
  id: string;
  name: string;
}

export interface OutfitTypeOption {
  id: string;
  name: string;
}

// ─── Service functions ────────────────────────────────────────────────────────

export async function listOutfits(
  params: ListOutfitsParams,
  scope: DataScope,
  userId: string,
): Promise<ListOutfitsResult> {
  if (scope === 'none') {
    return { items: [], total: 0, page: params.page, limit: params.limit };
  }

  const where: Prisma.OutfitWhereInput = { deletedAt: null };

  if (scope === 'own') where.createdBy = userId;

  // Default: exclude deleted status. Explicit status filter overrides this.
  if (params.status) {
    where.status = params.status;
  } else {
    where.status = { not: 'deleted' };
  }

  if (params.styleId) where.styleId = params.styleId;
  if (params.outfitTypeId) where.outfitTypeId = params.outfitTypeId;

  if (params.keyword) {
    where.OR = [
      { name: { contains: params.keyword, mode: 'insensitive' } },
      { outfitCode: { contains: params.keyword, mode: 'insensitive' } },
    ];
  }

  const [rows, total] = await Promise.all([
    prisma.outfit.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip: (params.page - 1) * params.limit,
      take: params.limit,
      select: {
        id: true,
        outfitCode: true,
        name: true,
        slug: true,
        coverImageUrl: true,
        status: true,
        publishedAt: true,
        style: { select: { id: true, name: true } },
        outfitType: { select: { id: true, name: true } },
        _count: { select: { outfitProducts: true } },
      },
    }),
    prisma.outfit.count({ where }),
  ]);

  return {
    items: rows.map((o) => ({
      id: o.id,
      outfitCode: o.outfitCode,
      name: o.name,
      slug: o.slug,
      coverImageUrl: o.coverImageUrl,
      status: o.status,
      productCount: o._count.outfitProducts,
      publishedAt: o.publishedAt,
      style: o.style,
      outfitType: o.outfitType,
    })),
    total,
    page: params.page,
    limit: params.limit,
  };
}

export async function getDistinctStyles(): Promise<StyleOption[]> {
  const rows = await prisma.style.findMany({
    where: { status: 'active', deletedAt: null },
    select: { id: true, name: true },
    orderBy: { name: 'asc' },
  });
  return rows;
}

export async function getDistinctOutfitTypes(): Promise<OutfitTypeOption[]> {
  const rows = await prisma.outfitType.findMany({
    where: { status: 'active', deletedAt: null },
    select: { id: true, name: true },
    orderBy: { name: 'asc' },
  });
  return rows;
}

// ─── Detail select & mapper ───────────────────────────────────────────────────

const outfitDetailSelect = {
  id: true,
  outfitCode: true,
  name: true,
  slug: true,
  description: true,
  coverImageUrl: true,
  styleId: true,
  outfitTypeId: true,
  status: true,
  createdBy: true,
  publishedAt: true,
  createdAt: true,
  updatedAt: true,
  style: { select: { id: true, name: true } },
  outfitType: { select: { id: true, name: true } },
} as const;

type OutfitDetailRow = Prisma.OutfitGetPayload<{ select: typeof outfitDetailSelect }>;

function mapOutfitDetail(row: OutfitDetailRow): OutfitDetail {
  return {
    id: row.id,
    outfitCode: row.outfitCode,
    name: row.name,
    slug: row.slug,
    description: row.description,
    coverImageUrl: row.coverImageUrl,
    styleId: row.styleId,
    outfitTypeId: row.outfitTypeId,
    status: row.status,
    createdBy: row.createdBy,
    publishedAt: row.publishedAt,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
    style: row.style,
    outfitType: row.outfitType,
  };
}

// ─── CRUD functions ───────────────────────────────────────────────────────────

export async function createOutfit(input: CreateOutfitInput, userId: string): Promise<OutfitDetail> {
  const row = await prisma.outfit.create({
    data: {
      id: input.id,
      outfitCode: input.outfitCode,
      name: input.name,
      slug: input.slug,
      description: input.description || null,
      coverImageUrl: input.coverImageUrl,
      styleId: input.styleId || null,
      outfitTypeId: input.outfitTypeId || null,
      status: 'draft',
      createdBy: userId,
    },
    select: outfitDetailSelect,
  });
  return mapOutfitDetail(row);
}

export async function getOutfitById(
  id: string,
  scope: DataScope,
  userId: string,
): Promise<OutfitDetail | null> {
  if (scope === 'none') return null;

  const row = await prisma.outfit.findFirst({
    where: {
      id,
      deletedAt: null,
      ...(scope === 'own' ? { createdBy: userId } : {}),
    },
    select: outfitDetailSelect,
  });

  if (!row) return null;
  return mapOutfitDetail(row);
}

export async function updateOutfitFields(
  id: string,
  input: UpdateOutfitInput,
  userId: string,
): Promise<OutfitDetail> {
  // UncheckedUpdateInput allows setting FK scalar fields directly (styleId, outfitTypeId, updatedBy)
  const data: Prisma.OutfitUncheckedUpdateInput = { updatedBy: userId };

  if (input.name !== undefined) data.name = input.name;
  if (input.slug !== undefined) data.slug = input.slug;
  if ('description' in input) data.description = input.description ?? null;
  if ('styleId' in input) data.styleId = input.styleId ?? null;
  if ('outfitTypeId' in input) data.outfitTypeId = input.outfitTypeId ?? null;
  if (input.status !== undefined) {
    data.status = input.status;
    if (input.status === 'active') {
      // Per spec: set publishedAt when publishing
      data.publishedAt = new Date();
    }
  }

  const row = await prisma.outfit.update({
    where: { id },
    data,
    select: outfitDetailSelect,
  });
  return mapOutfitDetail(row);
}

// ─── Outfit Products ──────────────────────────────────────────────────────────

export interface OutfitProductItem {
  outfitProductId: string;
  productId: string;
  name: string;
  imageUrl: string;
  mockupImageUrl: string | null;
  urlSuffix: string;
  status: string;
  addedAt: Date;
}

export class DuplicateProductError extends Error {
  constructor() {
    super('Product is already in this outfit.');
  }
}

export class ProductNotActiveError extends Error {
  constructor() {
    super('Only active products can be added to an outfit.');
  }
}

export async function getOutfitProducts(outfitId: string): Promise<OutfitProductItem[]> {
  const rows = await prisma.outfitProduct.findMany({
    where: { outfitId },
    orderBy: { createdAt: 'asc' },
    select: {
      id: true,
      productId: true,
      createdAt: true,
      product: {
        select: {
          name: true,
          imageUrl: true,
          mockupImageUrl: true,
          urlSuffix: true,
          status: true,
        },
      },
    },
  });
  return rows.map((r) => ({
    outfitProductId: r.id,
    productId: r.productId,
    name: r.product.name,
    imageUrl: r.product.imageUrl,
    mockupImageUrl: r.product.mockupImageUrl,
    urlSuffix: r.product.urlSuffix,
    status: r.product.status,
    addedAt: r.createdAt,
  }));
}

export async function addProductToOutfit(
  outfitId: string,
  productId: string,
  userId: string,
): Promise<void> {
  const product = await prisma.product.findFirst({
    where: { id: productId, status: 'active', deletedAt: null },
    select: { id: true },
  });
  if (!product) throw new ProductNotActiveError();

  try {
    await prisma.outfitProduct.create({
      data: { outfitId, productId, addedBy: userId },
    });
  } catch (err) {
    if (
      typeof err === 'object' &&
      err !== null &&
      'code' in err &&
      (err as { code: string }).code === 'P2002'
    ) {
      throw new DuplicateProductError();
    }
    throw err;
  }
}

export async function removeProductFromOutfit(outfitId: string, productId: string): Promise<void> {
  await prisma.outfitProduct.deleteMany({ where: { outfitId, productId } });
}

export async function countOutfitProducts(outfitId: string): Promise<number> {
  return prisma.outfitProduct.count({ where: { outfitId } });
}

export interface PublishValidationError {
  field: string;
  message: string;
}

export async function validateOutfitForPublish(
  outfitId: string,
): Promise<PublishValidationError[]> {
  const outfit = await prisma.outfit.findUnique({
    where: { id: outfitId },
    select: {
      name: true,
      coverImageUrl: true,
      _count: { select: { outfitProducts: true } },
      outfitProducts: {
        take: 1,
        select: {
          product: { select: { affiliateUrl: true, h5Link: true } },
        },
      },
    },
  });

  if (!outfit) return [{ field: 'outfit', message: 'Outfit not found.' }];

  const errs: PublishValidationError[] = [];

  if (!outfit.name || !outfit.name.trim()) {
    errs.push({ field: 'name', message: 'Outfit must have a name.' });
  }
  if (!outfit.coverImageUrl || !outfit.coverImageUrl.trim()) {
    errs.push({ field: 'coverImageUrl', message: 'Outfit must have a cover image.' });
  }
  if (outfit._count.outfitProducts === 0) {
    errs.push({ field: 'products', message: 'Outfit must have at least 1 product.' });
  } else {
    // Check that at least one product in the outfit has a redirect URL
    const allProducts = await prisma.outfitProduct.findMany({
      where: { outfitId },
      select: { product: { select: { affiliateUrl: true, h5Link: true } } },
    });
    const hasLink = allProducts.some(
      (op) => op.product.affiliateUrl || op.product.h5Link,
    );
    if (!hasLink) {
      errs.push({
        field: 'products',
        message: 'At least one product must have an affiliate URL or h5Link.',
      });
    }
  }

  return errs;
}

// ─── Public detail ────────────────────────────────────────────────────────────

export interface PublicOutfitProduct {
  id: string;
  name: string;
  displayImageUrl: string;
  redirectPath: string;
}

export interface PublicOutfitDetail {
  id: string;
  outfitCode: string;
  name: string;
  slug: string;
  description: string | null;
  coverImageUrl: string;
  style: { name: string; slug: string } | null;
  outfitType: { name: string; slug: string } | null;
  products: PublicOutfitProduct[];
}

export async function getPublicOutfitDetail(
  outfitCode: string,
): Promise<PublicOutfitDetail | null> {
  const row = await prisma.outfit.findFirst({
    where: {
      outfitCode: outfitCode.toUpperCase(),
      status: 'active',
      publishedAt: { not: null },
      deletedAt: null,
    },
    select: {
      id: true,
      outfitCode: true,
      name: true,
      slug: true,
      description: true,
      coverImageUrl: true,
      style: { select: { name: true, slug: true } },
      outfitType: { select: { name: true, slug: true } },
      outfitProducts: {
        where: { product: { deletedAt: null } },
        orderBy: { createdAt: 'asc' },
        select: {
          product: {
            select: {
              id: true,
              name: true,
              imageUrl: true,
              mockupImageUrl: true,
            },
          },
        },
      },
    },
  });

  if (!row) return null;

  return {
    id: row.id,
    outfitCode: row.outfitCode,
    name: row.name,
    slug: row.slug,
    description: row.description,
    coverImageUrl: row.coverImageUrl,
    style: row.style,
    outfitType: row.outfitType,
    products: row.outfitProducts.map((op) => ({
      id: op.product.id,
      name: op.product.name,
      displayImageUrl: getProductDisplayImage(op.product),
      redirectPath: `/go/${row.outfitCode}/${op.product.id}`,
    })),
  };
}

// ─── Related outfits ─────────────────────────────────────────────────────────

export interface RelatedOutfitItem {
  id: string;
  outfitCode: string;
  name: string;
  slug: string;
  coverImageUrl: string;
  description: string | null;
}

/**
 * Fetch related outfits for the detail page internal links section.
 * Priority: same style → same outfitType → most recent active outfits.
 * Excludes the current outfit. Returns at most `limit` items.
 */
export async function getRelatedOutfits(
  currentId: string,
  styleSlug: string | null,
  outfitTypeSlug: string | null,
  limit = 4,
): Promise<RelatedOutfitItem[]> {
  const base: Prisma.OutfitWhereInput = {
    id: { not: currentId },
    status: 'active',
    publishedAt: { not: null },
    deletedAt: null,
  };

  const where: Prisma.OutfitWhereInput = styleSlug
    ? { ...base, style: { slug: styleSlug } }
    : outfitTypeSlug
      ? { ...base, outfitType: { slug: outfitTypeSlug } }
      : base;

  return prisma.outfit.findMany({
    where,
    orderBy: { publishedAt: 'desc' },
    take: limit,
    select: {
      id: true,
      outfitCode: true,
      name: true,
      slug: true,
      coverImageUrl: true,
      description: true,
    },
  });
}

// ─── Sitemap ─────────────────────────────────────────────────────────────────

export interface SitemapOutfitItem {
  slug: string;
  outfitCode: string;
  updatedAt: Date;
}

export async function getActiveOutfitsForSitemap(): Promise<SitemapOutfitItem[]> {
  return prisma.outfit.findMany({
    where: {
      status: 'active',
      publishedAt: { not: null },
      deletedAt: null,
    },
    orderBy: { publishedAt: 'desc' },
    select: {
      slug: true,
      outfitCode: true,
      updatedAt: true,
    },
  });
}

// ─── Public listing ───────────────────────────────────────────────────────────

export interface PublicOutfitListItem {
  id: string;
  outfitCode: string;
  name: string;
  slug: string;
  coverImageUrl: string;
  description: string | null;
}

export interface ListPublicOutfitsParams {
  page: number;
  limit: number;
}

export interface ListPublicOutfitsResult {
  items: PublicOutfitListItem[];
  total: number;
  page: number;
  limit: number;
}

export async function listPublicOutfits(
  params: ListPublicOutfitsParams,
): Promise<ListPublicOutfitsResult> {
  const where: Prisma.OutfitWhereInput = {
    status: 'active',
    publishedAt: { not: null },
    deletedAt: null,
  };

  const [rows, total] = await Promise.all([
    prisma.outfit.findMany({
      where,
      orderBy: { publishedAt: 'desc' },
      skip: (params.page - 1) * params.limit,
      take: params.limit,
      select: {
        id: true,
        outfitCode: true,
        name: true,
        slug: true,
        coverImageUrl: true,
        description: true,
      },
    }),
    prisma.outfit.count({ where }),
  ]);

  return {
    items: rows.map((o) => ({
      id: o.id,
      outfitCode: o.outfitCode,
      name: o.name,
      slug: o.slug,
      coverImageUrl: o.coverImageUrl,
      description: o.description,
    })),
    total,
    page: params.page,
    limit: params.limit,
  };
}
