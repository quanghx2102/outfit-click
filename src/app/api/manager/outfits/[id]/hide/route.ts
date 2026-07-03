import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { ForbiddenError, getUserPermissions } from '@/lib/permissions';
import { getOutfitById, updateOutfitFields } from '@/server/outfits/outfit.service';
import { PERMISSIONS } from '@/constants/permissions';
import type { DataScope } from '@/lib/permissions';

type Params = { params: Promise<{ id: string }> };

function deriveScope(permissions: string[]): DataScope {
  if (permissions.includes(PERMISSIONS.OUTFITS_VIEW_ALL)) return 'all';
  if (permissions.includes(PERMISSIONS.OUTFITS_VIEW_OWN)) return 'own';
  return 'none';
}

// POST /api/manager/outfits/[id]/hide
// Sets outfit status to 'hidden'.
export async function POST(_req: NextRequest, { params }: Params) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const [permissions, { id }] = await Promise.all([getUserPermissions(session.userId), params]);

  const scope = deriveScope(permissions);
  if (scope === 'none') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  if (!permissions.includes(PERMISSIONS.OUTFITS_HIDE)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const outfit = await getOutfitById(id, scope, session.userId);
  if (!outfit) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  try {
    const updated = await updateOutfitFields(id, { status: 'hidden' }, session.userId);
    return NextResponse.json(updated);
  } catch (error) {
    if (error instanceof ForbiddenError) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    console.error(
      '[POST /api/manager/outfits/:id/hide]',
      error instanceof Error ? error.message : error,
    );
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
