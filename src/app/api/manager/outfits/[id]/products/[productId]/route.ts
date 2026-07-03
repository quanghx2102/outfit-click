import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { getUserPermissions } from '@/lib/permissions';
import { PERMISSIONS } from '@/constants/permissions';
import { getOutfitById, removeProductFromOutfit } from '@/server/outfits/outfit.service';
import type { DataScope } from '@/lib/permissions';

type Params = { params: Promise<{ id: string; productId: string }> };

function deriveScope(permissions: string[]): DataScope {
  if (permissions.includes(PERMISSIONS.OUTFITS_VIEW_ALL)) return 'all';
  if (permissions.includes(PERMISSIONS.OUTFITS_VIEW_OWN)) return 'own';
  return 'none';
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const [permissions, { id, productId }] = await Promise.all([
    getUserPermissions(session.userId),
    params,
  ]);

  if (!permissions.includes(PERMISSIONS.OUTFITS_REMOVE_PRODUCT)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const scope = deriveScope(permissions);
  if (scope === 'none') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const outfit = await getOutfitById(id, scope, session.userId);
  if (!outfit) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  await removeProductFromOutfit(id, productId);
  return NextResponse.json({ ok: true });
}
