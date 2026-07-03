import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { ForbiddenError, requirePermission } from '@/lib/permissions';
import { env } from '@/lib/env';
import { prisma } from '@/lib/db';
import { PERMISSIONS } from '@/constants/permissions';
import { SYNC_STATUS, PRODUCT_STATUS } from '@/constants/status';
import type { SyncStatus } from '@/constants/status';
import { fetchStorefrontGroupProductList } from '@/server/sync/mycollection.client';
import { mapApiItemToProductUpsertData } from '@/server/products/product.mapper';
import { upsertProductFromSource } from '@/server/products/product.repository';

// POST /api/manager/products/sync
// Body: JSON
//   urlSuffix       — required
//   groupId         — required
//   affiliateId     — optional, fallback env
//   affiliateUserId — optional, fallback env
//   cid             — optional, default 'vn'
//   language        — optional, default 'vi'
//   limit           — optional, default 20

const PAGE_LIMIT_DEFAULT = 20;
const PAGE_LIMIT_MAX = 100;

export async function POST(request: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await requirePermission(session.userId, PERMISSIONS.SYNC_RUN);
  } catch (error) {
    if (error instanceof ForbiddenError) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    throw error;
  }

  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const urlSuffix = typeof body.urlSuffix === 'string' ? body.urlSuffix.trim() : '';
  const groupId = typeof body.groupId === 'string' ? body.groupId.trim() : '';

  if (!urlSuffix) {
    return NextResponse.json({ error: 'urlSuffix is required' }, { status: 400 });
  }
  if (!groupId) {
    return NextResponse.json({ error: 'groupId is required' }, { status: 400 });
  }

  const affiliateId =
    typeof body.affiliateId === 'string' && body.affiliateId.trim()
      ? body.affiliateId.trim()
      : env.sync.affiliateId;

  const affiliateUserId =
    typeof body.affiliateUserId === 'string' && body.affiliateUserId.trim()
      ? body.affiliateUserId.trim()
      : env.sync.affiliateUserId;

  const cid =
    typeof body.cid === 'string' && body.cid.trim() ? body.cid.trim() : env.sync.cid;

  const language =
    typeof body.language === 'string' && body.language.trim()
      ? body.language.trim()
      : env.sync.language;

  const rawLimit = typeof body.limit === 'number' ? body.limit : PAGE_LIMIT_DEFAULT;
  const pageLimit = Math.min(PAGE_LIMIT_MAX, Math.max(1, rawLimit));

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
  const errors: string[] = [];

  try {
    let offset = 0;
    let hasMore = true;

    while (hasMore) {
      const page = await fetchStorefrontGroupProductList({
        urlSuffix,
        groupId,
        affiliateId,
        affiliateUserId,
        cid,
        language,
        offset,
        limit: pageLimit,
      });

      if (offset === 0) {
        const matchedGroup = page.groupList.find((g) => g.groupId === groupId);
        if (matchedGroup) groupName = matchedGroup.groupName;
      }

      for (const item of page.itemList) {
        try {
          fetchedLinkIds.add(item.linkId);
          const data = mapApiItemToProductUpsertData(item, { urlSuffix, groupId, groupName });
          const { wasCreated } = await upsertProductFromSource(data);
          totalFetched++;
          if (wasCreated) totalCreated++;
          else totalUpdated++;
        } catch (itemError) {
          const msg = itemError instanceof Error ? itemError.message : String(itemError);
          errors.push(`linkId=${item.linkId}: ${msg}`);
        }
      }

      hasMore = page.pagination.hasMore;
      offset += pageLimit;
    }

    totalDeactivated = await markMissingFromSource(urlSuffix, groupId, fetchedLinkIds);
    if (errors.length > 0) finalStatus = SYNC_STATUS.PARTIAL_SUCCESS;
  } catch (error) {
    finalStatus = totalFetched > 0 ? SYNC_STATUS.PARTIAL_SUCCESS : SYNC_STATUS.FAILED;
    errorMessage = error instanceof Error ? error.message : String(error);
    errors.push(errorMessage);
  }

  await prisma.syncLog.update({
    where: { id: syncLog.id },
    data: {
      status: finalStatus,
      totalFetched,
      totalCreated,
      totalUpdated,
      totalDeactivated,
      errorMessage: errorMessage ?? (errors.length > 0 ? errors[0] : null),
      finishedAt: new Date(),
    },
  });

  return NextResponse.json({
    ok: finalStatus !== SYNC_STATUS.FAILED,
    status: finalStatus,
    totalFetched,
    totalCreated,
    totalUpdated,
    totalDeactivated,
    errors: errors.length > 0 ? errors : undefined,
  });
}

async function markMissingFromSource(
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
