import { env } from '@/lib/env';
import { prisma } from '@/lib/db';
import { SYNC_STATUS, PRODUCT_STATUS } from '@/constants/status';
import type { SyncStatus } from '@/constants/status';
import { fetchStorefrontGroupProductList } from './mycollection.client';
import type { StorefrontGroupProductListResult } from './mycollection.client';
import { mapApiItemToProductUpsertData } from '@/server/products/product.mapper';
import { upsertProductFromSource } from '@/server/products/product.repository';

// ─── Config ──────────────────────────────────────────────────────────────────

interface SyncSource {
  urlSuffix: string;
  groupIds: string[];
}

// MVP: each urlSuffix shares the same groupId list from env.
// If sources diverge in future, move to a config file per 13-env-config.md.
function buildSyncSources(): SyncSource[] {
  return env.sync.urlSuffixes.map((urlSuffix) => ({
    urlSuffix,
    groupIds: env.sync.groupIds,
  }));
}

// ─── Constants ────────────────────────────────────────────────────────────────

const PAGE_LIMIT = 20;
const LOCK_WINDOW_MS = 10 * 60 * 1000;
const RETRY_DELAYS_MS = [1000, 3000, 5000] as const;

// ─── Public API ───────────────────────────────────────────────────────────────

export interface SyncProductsResult {
  sourcesAttempted: number;
  groupsSucceeded: number;
  groupsFailed: number;
  groupsSkipped: number;
}

export async function syncProducts(): Promise<SyncProductsResult> {
  const sources = buildSyncSources();
  let groupsSucceeded = 0;
  let groupsFailed = 0;
  let groupsSkipped = 0;

  for (const source of sources) {
    for (const groupId of source.groupIds) {
      const outcome = await syncGroup(source.urlSuffix, groupId);
      if (outcome === 'skipped') groupsSkipped++;
      else if (outcome === 'success') groupsSucceeded++;
      else groupsFailed++;
    }
  }

  return {
    sourcesAttempted: sources.length,
    groupsSucceeded,
    groupsFailed,
    groupsSkipped,
  };
}

// ─── Group sync ───────────────────────────────────────────────────────────────

type GroupSyncOutcome = 'success' | 'failed' | 'skipped';

async function syncGroup(urlSuffix: string, groupId: string): Promise<GroupSyncOutcome> {
  if (await isGroupLocked(urlSuffix, groupId)) {
    return 'skipped';
  }

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
  let errorMessage: string | null = null;
  const fetchedLinkIds = new Set<string>();
  let groupName = groupId;

  try {
    let offset = 0;
    let hasMore = true;

    while (hasMore) {
      const page = await fetchPageWithRetry({ urlSuffix, groupId, offset });

      // Capture groupName from first page response
      if (offset === 0) {
        const matchedGroup = page.groupList.find((g) => g.groupId === groupId);
        if (matchedGroup) groupName = matchedGroup.groupName;
      }

      for (const item of page.itemList) {
        fetchedLinkIds.add(item.linkId);
        const data = mapApiItemToProductUpsertData(item, { urlSuffix, groupId, groupName });
        const { wasCreated } = await upsertProductFromSource(data);
        totalFetched++;
        if (wasCreated) totalCreated++;
        else totalUpdated++;
      }

      hasMore = page.pagination.hasMore;
      offset += PAGE_LIMIT;
    }

    totalDeactivated = await markProductsMissingFromSource(urlSuffix, groupId, fetchedLinkIds);
  } catch (error) {
    // partial_success if we managed to upsert at least one product before failing
    finalStatus = totalFetched > 0 ? SYNC_STATUS.PARTIAL_SUCCESS : SYNC_STATUS.FAILED;
    errorMessage = error instanceof Error ? error.message : String(error);
    console.error(`[sync] Error for urlSuffix=${urlSuffix}, groupId=${groupId}:`, errorMessage);
  }

  await prisma.syncLog.update({
    where: { id: syncLog.id },
    data: {
      status: finalStatus,
      totalFetched,
      totalCreated,
      totalUpdated,
      totalDeactivated,
      errorMessage,
      finishedAt: new Date(),
    },
  });

  return finalStatus === SYNC_STATUS.FAILED ? 'failed' : 'success';
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
  offset: number;
}): Promise<StorefrontGroupProductListResult> {
  const { urlSuffix, groupId, offset } = params;
  let lastError: Error = new Error('[sync] Unknown fetch error');

  for (let attempt = 0; attempt <= RETRY_DELAYS_MS.length; attempt++) {
    try {
      return await fetchStorefrontGroupProductList({
        urlSuffix,
        groupId,
        affiliateId: env.sync.affiliateId,
        affiliateUserId: env.sync.affiliateUserId,
        uuId: env.sync.uuId,
        deviceId: env.sync.deviceId,
        cid: env.sync.cid,
        language: env.sync.language,
        offset,
        limit: PAGE_LIMIT,
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

// ─── Lock check ───────────────────────────────────────────────────────────────

async function isGroupLocked(urlSuffix: string, groupId: string): Promise<boolean> {
  const lockWindowStart = new Date(Date.now() - LOCK_WINDOW_MS);
  const running = await prisma.syncLog.findFirst({
    where: {
      urlSuffix,
      groupId,
      status: SYNC_STATUS.RUNNING,
      startedAt: { gte: lockWindowStart },
    },
    select: { id: true },
  });
  return running !== null;
}

// ─── Util ─────────────────────────────────────────────────────────────────────

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
