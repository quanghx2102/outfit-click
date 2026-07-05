import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { ForbiddenError, requirePermission } from '@/lib/permissions';
import { PERMISSIONS } from '@/constants/permissions';
import {
  updateTaxonomy,
  softDeleteTaxonomy,
  type TaxonomyKind,
} from '@/server/taxonomy/taxonomy.service';

type RouteContext = { params: Promise<{ kind: string; id: string }> };

function parseKind(raw: string): TaxonomyKind | null {
  if (raw === 'styles') return 'style';
  if (raw === 'outfit-types') return 'outfitType';
  return null;
}

// PATCH /api/manager/taxonomy/[kind]/[id] — update name/slug/status (taxonomy.manage)
export async function PATCH(request: NextRequest, ctx: RouteContext) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    await requirePermission(session.userId, PERMISSIONS.TAXONOMY_MANAGE);
  } catch (error) {
    if (error instanceof ForbiddenError) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    throw error;
  }

  const { kind: rawKind, id } = await ctx.params;
  const kind = parseKind(rawKind);
  if (!kind) return NextResponse.json({ error: 'Invalid taxonomy kind' }, { status: 400 });

  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const name = typeof body.name === 'string' ? body.name.trim() : undefined;
  const slug = typeof body.slug === 'string' ? body.slug.trim() : undefined;
  const status = body.status === 'active' || body.status === 'inactive' ? body.status : undefined;

  const result = await updateTaxonomy(kind, id, { name, slug, status });

  if (!result.ok) {
    if (result.reason === 'not_found') return NextResponse.json({ error: 'Not found' }, { status: 404 });
    if (result.reason === 'slug_taken') return NextResponse.json({ error: 'Slug is already in use' }, { status: 409 });
  }

  return NextResponse.json({ item: result.ok ? result.item : null });
}

// DELETE /api/manager/taxonomy/[kind]/[id] — soft delete (taxonomy.manage)
export async function DELETE(_req: NextRequest, ctx: RouteContext) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    await requirePermission(session.userId, PERMISSIONS.TAXONOMY_MANAGE);
  } catch (error) {
    if (error instanceof ForbiddenError) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    throw error;
  }

  const { kind: rawKind, id } = await ctx.params;
  const kind = parseKind(rawKind);
  if (!kind) return NextResponse.json({ error: 'Invalid taxonomy kind' }, { status: 400 });

  const result = await softDeleteTaxonomy(kind, id);

  if (!result.ok) {
    if (result.reason === 'not_found') return NextResponse.json({ error: 'Not found' }, { status: 404 });
    if (result.reason === 'in_use') {
      return NextResponse.json(
        { error: 'Cannot delete: still used by one or more outfits' },
        { status: 409 },
      );
    }
  }

  return NextResponse.json({ ok: true });
}
