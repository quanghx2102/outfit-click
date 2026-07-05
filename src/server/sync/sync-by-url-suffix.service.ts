import { env } from '@/lib/env';
import { prisma } from '@/lib/db';
import { SYNC_STATUS, PRODUCT_STATUS } from '@/constants/status';
import type { SyncStatus } from '@/constants/status';
import {
  fetchStorefrontGroupList,
} from './mycollection-group-list.client';
import type { StorefrontGroupItem } from './mycollection-group-list.client';
import { fetchStorefrontGroupProductList } from './mycollection.client';
import { mapApiItemToProductUpsertData } from '@/server/products/product.mapper';
import { upsertProductFromSource } from '@/server/products/product.repository';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface SyncByUrlSuffixInput {
  urlSuffix: string;
  affiliateId?: string;
  affiliateUserId?: string;
  uuId?: string;
  deviceId?: string;
  cid?: string;
  language?: string;
  limit?: number;
}

export interface GroupSyncResult {
  groupId: string;
  groupName: string;
  status: SyncStatus;
  totalFetched: number;
  totalCreated: number;
  totalUpdated: number;
  totalDeactivated: number;
  error?: string;
}

export interface SyncByUrlSuffixResult {
  urlSuffix: string;
  totalGroups: number;
  totalFetched: number;
  totalCreated: number;
  totalUpdated: number;
  totalDeactivated: number;
  groups: GroupSyncResult[];
  errors: string[];
}

const PAGE_LIMIT_DEFAULT = 20;
const PAGE_LIMIT_MAX = 100;
const GROUP_PAGE_LIMIT = 50;
const RETRY_DELAYS_MS = [1000, 3000, 5000] as const;

// ─── Public API ───────────────────────────────────────────────────────────────

export async function syncProductsByUrlSuffix(
  input: SyncByUrlSuffixInput,
): Promise<SyncByUrlSuffixResult> {
  const {
    urlSuffix,
    affiliateId = env.sync.affiliateId,
    affiliateUserId = env.sync.affiliateUserId,
    uuId = env.sync.uuId,
    deviceId = env.sync.deviceId,
    cid = env.sync.cid,
    language = env.sync.language,
    limit = PAGE_LIMIT_DEFAULT,
  } = input;

  const pageLimit = Math.min(PAGE_LIMIT_MAX, Math.max(1, limit));

  // Step 1 — fetch all groups for this urlSuffix
  const groups = await fetchAllGroups({ urlSuffix, affiliateId, affiliateUserId, uuId, deviceId, cid, language });

  if (groups.length === 0) {
    return {
      urlSuffix,
      totalGroups: 0,
      totalFetched: 0,
      totalCreated: 0,
      totalUpdated: 0,
      totalDeactivated: 0,
      groups: [],
      errors: ['No groups found for urlSuffix: ' + urlSuffix],
    };
  }

  // Step 2 — sync each group sequentially
  const groupResults: GroupSyncResult[] = [];
  let totalFetched = 0;
  let totalCreated = 0;
  let totalUpdated = 0;
  let totalDeactivated = 0;
  const errors: string[] = [];

  for (const group of groups) {
    const result = await syncOneGroup({
      urlSuffix,
      group,
      affiliateId,
      affiliateUserId,
      uuId,
      deviceId,
      cid,
      language,
      pageLimit,
    });

    groupResults.push(result);
    totalFetched += result.totalFetched;
    totalCreated += result.totalCreated;
    totalUpdated += result.totalUpdated;
    totalDeactivated += result.totalDeactivated;
    if (result.error) errors.push(`[${group.groupId}] ${result.error}`);
  }

  return {
    urlSuffix,
    totalGroups: groups.length,
    totalFetched,
    totalCreated,
    totalUpdated,
    totalDeactivated,
    groups: groupResults,
    errors,
  };
}

// ─── Fetch all groups ─────────────────────────────────────────────────────────

async function fetchAllGroups(params: {
  urlSuffix: string;
  affiliateId: string;
  affiliateUserId: string;
  uuId?: string;
  deviceId?: string;
  cid: string;
  language: string;
}): Promise<StorefrontGroupItem[]> {
  const allGroups: StorefrontGroupItem[] = [];
  let offset = 0;
  let hasMore = true;

  while (hasMore) {
    const page = await fetchStorefrontGroupList({
      urlSuffix: params.urlSuffix,
      affiliateId: params.affiliateId,
      affiliateUserId: params.affiliateUserId,
      uuId: params.uuId,
      deviceId: params.deviceId,
      cid: params.cid,
      language: params.language,
      offset,
      limit: GROUP_PAGE_LIMIT,
    });

    allGroups.push(...page.groupList);
    hasMore = page.pagination.hasMore;
    offset += GROUP_PAGE_LIMIT;

    if (!hasMore) break;
  }

  return allGroups;
}

// ─── Sync one group ───────────────────────────────────────────────────────────

async function syncOneGroup(params: {
  urlSuffix: string;
  group: StorefrontGroupItem;
  affiliateId: string;
  affiliateUserId: string;
  uuId?: string;
  deviceId?: string;
  cid: string;
  language: string;
  pageLimit: number;
}): Promise<GroupSyncResult> {
  const { urlSuffix, group, affiliateId, affiliateUserId, uuId, deviceId, cid, language, pageLimit } = params;
  const { groupId, groupName } = group;

  const syncLog = await prisma.syncLog.create({
    data: {
      urlSuffix,
      groupId,
      status: SYNC_STATUS.RUNNING,
      startedAt: new Date(),
    },
  });

  let totalFetched = 0;
  let totalCreated = 0;
  let totalUpdated = 0;
  let totalDeactivated = 0;
  let finalStatus: SyncStatus = SYNC_STATUS.SUCCESS;
  let errorMsg: string | null = null;
  const fetchedLinkIds = new Set<string>();

  try {
    let offset = 0;
    let hasMore = true;

    while (hasMore) {
      const page = await fetchPageWithRetry({
        urlSuffix,
        groupId,
        affiliateId,
        affiliateUserId,
        uuId,
        deviceId,
        cid,
        language,
        offset,
        pageLimit,
      });

      for (const item of page.itemList) {
        fetchedLinkIds.add(item.linkId);
        const data = mapApiItemToProductUpsertData(item, { urlSuffix, groupId, groupName });
        const { wasCreated } = await upsertProductFromSource(data);
        totalFetched++;
        if (wasCreated) totalCreated++;
        else totalUpdated++;
      }

      hasMore = page.pagination.hasMore;
      offset += pageLimit;
    }

    totalDeactivated = await markProductsMissingFromSource(urlSuffix, groupId, fetchedLinkIds);
  } catch (error) {
    finalStatus = totalFetched > 0 ? SYNC_STATUS.PARTIAL_SUCCESS : SYNC_STATUS.FAILED;
    errorMsg = error instanceof Error ? error.message : String(error);
    console.error(`[sync-by-suffix] Error groupId=${groupId}:`, errorMsg);
  }

  await prisma.syncLog.update({
    where: { id: syncLog.id },
    data: {
      status: finalStatus,
      totalFetched,
      totalCreated,
      totalUpdated,
      totalDeactivated,
      errorMessage: errorMsg,
      finishedAt: new Date(),
    },
  });

  return {
    groupId,
    groupName,
    status: finalStatus,
    totalFetched,
    totalCreated,
    totalUpdated,
    totalDeactivated,
    ...(errorMsg ? { error: errorMsg } : {}),
  };
}

// ─── Missing product marking ──────────────────────────────────────────────────

async function markProductsMissingFromSource(
  urlSuffix: string,
  groupId: string,
  fetchedLinkIds: Set<string>,
): Promise<number> {
  const dbProducts = await prisma.product.findMany({
    where: {
      urlSuffix,
      externalGroupId: groupId,
      status: { notIn: [PRODUCT_STATUS.DELETED, PRODUCT_STATUS.MISSING_FROM_SOURCE] },
      deletedAt: null,
    },
    select: { id: true, externalLinkId: true },
  });

  const missingIds = dbProducts
    .filter((p) => !fetchedLinkIds.has(p.externalLinkId))
    .map((p) => p.id);

  if (missingIds.length === 0) return 0;

  await prisma.product.updateMany({
    where: { id: { in: missingIds } },
    data: { status: PRODUCT_STATUS.MISSING_FROM_SOURCE },
  });

  return missingIds.length;
}

// ─── Fetch with retry ─────────────────────────────────────────────────────────

async function fetchPageWithRetry(params: {
  urlSuffix: string;
  groupId: string;
  affiliateId: string;
  affiliateUserId: string;
  uuId?: string;
  deviceId?: string;
  cid: string;
  language: string;
  offset: number;
  pageLimit: number;
}) {
  const { urlSuffix, groupId, affiliateId, affiliateUserId, uuId, deviceId, cid, language, offset, pageLimit } =
    params;
  let lastError: Error = new Error('[sync-by-suffix] Unknown fetch error');

  for (let attempt = 0; attempt <= RETRY_DELAYS_MS.length; attempt++) {
    try {
      return await fetchStorefrontGroupProductList({
        urlSuffix,
        groupId,
        affiliateId,
        affiliateUserId,
        uuId,
        deviceId,
        cid,
        language,
        offset,
        limit: pageLimit,
      });
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      if (attempt < RETRY_DELAYS_MS.length) {
        await sleep(RETRY_DELAYS_MS[attempt]);
      }
    }
  }

  throw lastError;
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
