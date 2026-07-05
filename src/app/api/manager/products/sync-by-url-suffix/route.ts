import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { ForbiddenError, requirePermission } from '@/lib/permissions';
import { PERMISSIONS } from '@/constants/permissions';
import { syncProductsByUrlSuffix } from '@/server/sync/sync-by-url-suffix.service';

// POST /api/manager/products/sync-by-url-suffix
// Body: { urlSuffix, affiliateId?, affiliateUserId?, cid?, language?, limit? }

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
  if (!urlSuffix) {
    return NextResponse.json({ error: 'urlSuffix is required' }, { status: 400 });
  }

  const affiliateId =
    typeof body.affiliateId === 'string' && body.affiliateId.trim()
      ? body.affiliateId.trim()
      : undefined;

  const affiliateUserId =
    typeof body.affiliateUserId === 'string' && body.affiliateUserId.trim()
      ? body.affiliateUserId.trim()
      : undefined;

  const uuId =
    typeof body.uuId === 'string' && body.uuId.trim() ? body.uuId.trim() : undefined;

  const deviceId =
    typeof body.deviceId === 'string' && body.deviceId.trim() ? body.deviceId.trim() : undefined;

  const cid =
    typeof body.cid === 'string' && body.cid.trim() ? body.cid.trim() : undefined;

  const language =
    typeof body.language === 'string' && body.language.trim()
      ? body.language.trim()
      : undefined;

  const limit =
    typeof body.limit === 'number' && body.limit > 0 ? body.limit : undefined;

  try {
    const result = await syncProductsByUrlSuffix({
      urlSuffix,
      affiliateId,
      affiliateUserId,
      uuId,
      deviceId,
      cid,
      language,
      limit,
    });

    return NextResponse.json({
      ok: result.errors.length === 0 || result.totalFetched > 0,
      urlSuffix: result.urlSuffix,
      totalGroups: result.totalGroups,
      totalFetched: result.totalFetched,
      totalCreated: result.totalCreated,
      totalUpdated: result.totalUpdated,
      totalDeactivated: result.totalDeactivated,
      groups: result.groups.map((g) => ({
        groupId: g.groupId,
        groupName: g.groupName,
        status: g.status,
        totalFetched: g.totalFetched,
        totalCreated: g.totalCreated,
        totalUpdated: g.totalUpdated,
        totalDeactivated: g.totalDeactivated,
        ...(g.error ? { error: g.error } : {}),
      })),
      errors: result.errors.length > 0 ? result.errors : undefined,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error('[sync-by-url-suffix] Unexpected error:', message);
    return NextResponse.json({ error: 'Internal server error', detail: message }, { status: 500 });
  }
}
