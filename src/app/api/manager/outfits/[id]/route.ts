import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { ForbiddenError, getUserPermissions } from '@/lib/permissions';
import { getOutfitById, updateOutfitFields, countOutfitProducts } from '@/server/outfits/outfit.service';
import { isValidSlug } from '@/lib/slug';
import { PERMISSIONS } from '@/constants/permissions';
import type { DataScope } from '@/lib/permissions';
import type { UpdateOutfitInput } from '@/server/outfits/outfit.service';

type Params = { params: Promise<{ id: string }> };

const UPDATABLE_STATUSES = new Set(['draft', 'active', 'hidden']);

function deriveScope(permissions: string[]): DataScope {
  if (permissions.includes(PERMISSIONS.OUTFITS_VIEW_ALL)) return 'all';
  if (permissions.includes(PERMISSIONS.OUTFITS_VIEW_OWN)) return 'own';
  return 'none';
}

export async function GET(_req: NextRequest, { params }: Params) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const [permissions, { id }] = await Promise.all([getUserPermissions(session.userId), params]);
  const scope = deriveScope(permissions);

  if (scope === 'none') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const outfit = await getOutfitById(id, scope, session.userId);
  if (!outfit) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  return NextResponse.json(outfit);
}

export async function PATCH(req: NextRequest, { params }: Params) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let body: Record<string, unknown>;
  try {
    body = (await req.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  // ── Field validation ─────────────────────────────────────────────────────────
  if ('name' in body) {
    const n = body.name;
    if (typeof n !== 'string' || !n.trim() || n.trim().length > 255) {
      return NextResponse.json({ error: 'Invalid name.' }, { status: 400 });
    }
  }

  if ('slug' in body) {
    const s = body.slug;
    if (typeof s !== 'string' || !isValidSlug(s.trim())) {
      return NextResponse.json(
        { error: 'Invalid slug. Use lowercase letters, digits, and hyphens only.' },
        { status: 400 },
      );
    }
  }

  if ('status' in body) {
    const s = body.status;
    if (typeof s !== 'string' || !UPDATABLE_STATUSES.has(s)) {
      return NextResponse.json(
        { error: 'Invalid status. Must be draft, active, or hidden.' },
        { status: 400 },
      );
    }
  }

  try {
    const [permissions, { id }] = await Promise.all([getUserPermissions(session.userId), params]);

    const scope = deriveScope(permissions);
    if (scope === 'none') throw new ForbiddenError();

    // Verify outfit exists and user has access
    const outfit = await getOutfitById(id, scope, session.userId);
    if (!outfit) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    // Permission check: general update required
    if (!permissions.includes(PERMISSIONS.OUTFITS_UPDATE)) {
      throw new ForbiddenError();
    }

    // Publishing requires outfits.publish
    if ('status' in body && body.status === 'active') {
      if (!permissions.includes(PERMISSIONS.OUTFITS_PUBLISH)) {
        throw new ForbiddenError();
      }
      const productCount = await countOutfitProducts(id);
      if (productCount === 0) {
        return NextResponse.json(
          { error: 'Cannot publish outfit with no products.' },
          { status: 422 },
        );
      }
    }

    // Hiding requires outfits.hide
    if ('status' in body && body.status === 'hidden') {
      if (!permissions.includes(PERMISSIONS.OUTFITS_HIDE)) {
        throw new ForbiddenError();
      }
    }

    const input: UpdateOutfitInput = {};
    if ('name' in body) input.name = (body.name as string).trim();
    if ('slug' in body) input.slug = (body.slug as string).trim();
    if ('description' in body) {
      const d = body.description;
      input.description = typeof d === 'string' && d.trim() ? d.trim() : null;
    }
    if ('styleId' in body) {
      const s = body.styleId;
      input.styleId = typeof s === 'string' && s ? s : null;
    }
    if ('outfitTypeId' in body) {
      const t = body.outfitTypeId;
      input.outfitTypeId = typeof t === 'string' && t ? t : null;
    }
    if ('status' in body) input.status = body.status as string;

    const updated = await updateOutfitFields(id, input, session.userId);
    return NextResponse.json(updated);
  } catch (error) {
    if (error instanceof ForbiddenError) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Slug unique constraint
    const isUniqueViolation =
      typeof error === 'object' &&
      error !== null &&
      'code' in error &&
      (error as { code: string }).code === 'P2002';
    if (isUniqueViolation) {
      return NextResponse.json({ error: 'Slug is already taken.' }, { status: 409 });
    }

    console.error(
      '[PATCH /api/manager/outfits/:id]',
      error instanceof Error ? error.message : error,
    );
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
