import { prisma } from '@/lib/db';
import type { Prisma } from '@prisma/client';
import type { ProductStatus } from '@/constants/status';
import type { DataScope } from '@/lib/permissions';

// ─── Product Detail ───────────────────────────────────────────────────────────

export type ProductDetail = {
  id: string;
  urlSuffix: string;
  externalLinkId: string;
  externalItemId: string | null;
  externalGroupId: string | null;
  externalGroupName: string | null;
  name: string;
  imageUrl: string;
  mockupImageUrl: string | null;
  productDna: string | null;
  affiliateUrl: string | null;
  h5Link: string | null;
  status: string;
  assignedTo: string | null;
  lastSyncedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
};

const PRODUCT_DETAIL_SELECT = {
  id: true,
  urlSuffix: true,
  externalLinkId: true,
  externalItemId: true,
  externalGroupId: true,
  externalGroupName: true,
  name: true,
  imageUrl: true,
  mockupImageUrl: true,
  productDna: true,
  affiliateUrl: true,
  h5Link: true,
  status: true,
  assignedTo: true,
  lastSyncedAt: true,
  createdAt: true,
  updatedAt: true,
} as const;

/**
 * Fetch a single product by ID with scope enforcement.
 * Returns null if not found, deleted, or outside the caller's scope.
 */
export async function getProductById(
  id: string,
  scope: DataScope,
  userId: string,
): Promise<ProductDetail | null> {
  if (scope === 'none') return null;

  const product = await prisma.product.findUnique({
    where: { id, deletedAt: null },
    select: PRODUCT_DETAIL_SELECT,
  });

  if (!product) return null;
  if (scope === 'assigned' && product.assignedTo !== userId) return null;

  return product;
}

export type UpdateProductInput = {
  productDna?: string | null;
  mockupImageUrl?: string | null;
  status?: 'active' | 'inactive';
};

/**
 * Update staff-managed fields on a product.
 * Caller must verify existence and permissions before calling.
 * Never touches sync-managed fields (externalLinkId, imageUrl, etc.).
 */
export async function updateProductFields(
  id: string,
  input: UpdateProductInput,
): Promise<ProductDetail> {
  const data: Prisma.ProductUpdateInput = {};
  if (Object.prototype.hasOwnProperty.call(input, 'productDna')) {
    data.productDna = input.productDna ?? null;
  }
  if (Object.prototype.hasOwnProperty.call(input, 'mockupImageUrl')) {
    data.mockupImageUrl = input.mockupImageUrl ?? null;
  }
  if (input.status !== undefined) {
    data.status = input.status;
  }

  return prisma.product.update({
    where: { id },
    data,
    select: PRODUCT_DETAIL_SELECT,
  });
}

export interface ListProductsParams {
  keyword?: string;
  urlSuffix?: string;
  externalGroupId?: string;
  status?: ProductStatus;
  hasMockup?: boolean;
  hasProductDna?: boolean;
  page: number;
  limit: number;
}

export interface ProductListItem {
  id: string;
  urlSuffix: string;
  externalGroupName: string | null;
  name: string;
  imageUrl: string;
  mockupImageUrl: string | null;
  status: string;
  hasDna: boolean;
  hasMockup: boolean;
  lastSyncedAt: Date | null;
}

export interface ListProductsResult {
  items: ProductListItem[];
  total: number;
  page: number;
  limit: number;
}

export async function listProducts(
  params: ListProductsParams,
  scope: DataScope,
  userId: string,
): Promise<ListProductsResult> {
  if (scope === 'none') {
    return { items: [], total: 0, page: params.page, limit: params.limit };
  }

  const where: Prisma.ProductWhereInput = { deletedAt: null };

  if (scope === 'assigned') where.assignedTo = userId;
  if (params.status) where.status = params.status;
  if (params.urlSuffix) where.urlSuffix = params.urlSuffix;
  if (params.externalGroupId) where.externalGroupId = params.externalGroupId;
  if (params.keyword) {
    where.name = { contains: params.keyword, mode: 'insensitive' };
  }
  if (params.hasMockup === true) where.mockupImageUrl = { not: null };
  if (params.hasMockup === false) where.mockupImageUrl = null;
  if (params.hasProductDna === true) where.productDna = { not: null };
  if (params.hasProductDna === false) where.productDna = null;

  const [rows, total] = await Promise.all([
    prisma.product.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip: (params.page - 1) * params.limit,
      take: params.limit,
      select: {
        id: true,
        urlSuffix: true,
        externalGroupName: true,
        name: true,
        imageUrl: true,
        mockupImageUrl: true,
        status: true,
        productDna: true,
        lastSyncedAt: true,
      },
    }),
    prisma.product.count({ where }),
  ]);

  return {
    items: rows.map((p) => ({
      id: p.id,
      urlSuffix: p.urlSuffix,
      externalGroupName: p.externalGroupName,
      name: p.name,
      imageUrl: p.imageUrl,
      mockupImageUrl: p.mockupImageUrl,
      status: p.status,
      hasDna: p.productDna !== null,
      hasMockup: p.mockupImageUrl !== null,
      lastSyncedAt: p.lastSyncedAt,
    })),
    total,
    page: params.page,
    limit: params.limit,
  };
}

export async function getProductRawJson(id: string): Promise<unknown | null> {
  const product = await prisma.product.findUnique({
    where: { id, deletedAt: null },
    select: { rawJson: true },
  });
  return product?.rawJson ?? null;
}

export async function getDistinctUrlSuffixes(): Promise<string[]> {
  const rows = await prisma.product.findMany({
    where: { deletedAt: null },
    select: { urlSuffix: true },
    distinct: ['urlSuffix'],
    orderBy: { urlSuffix: 'asc' },
  });
  return rows.map((r) => r.urlSuffix);
}

export async function getDistinctGroupIds(urlSuffix?: string): Promise<string[]> {
  const rows = await prisma.product.findMany({
    where: {
      deletedAt: null,
      externalGroupId: { not: null },
      ...(urlSuffix ? { urlSuffix } : {}),
    },
    select: { externalGroupId: true },
    distinct: ['externalGroupId'],
    orderBy: { externalGroupId: 'asc' },
  });
  return rows
    .map((r) => r.externalGroupId)
    .filter((id): id is string => id !== null);
}

export interface PickerProductItem {
  id: string;
  name: string;
  imageUrl: string;
  mockupImageUrl: string | null;
  urlSuffix: string;
}

export async function listProductsForPicker(params: {
  keyword?: string;
  urlSuffix?: string;
  limit?: number;
}): Promise<PickerProductItem[]> {
  const where: Prisma.ProductWhereInput = { status: 'active', deletedAt: null };
  if (params.urlSuffix) where.urlSuffix = params.urlSuffix;
  if (params.keyword) {
    where.name = { contains: params.keyword, mode: 'insensitive' };
  }
  return prisma.product.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    take: params.limit ?? 30,
    select: {
      id: true,
      name: true,
      imageUrl: true,
      mockupImageUrl: true,
      urlSuffix: true,
    },
  });
}
