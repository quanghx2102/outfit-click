import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { ForbiddenError, hasPermission, requirePermission } from '@/lib/permissions';
import { PERMISSIONS } from '@/constants/permissions';
import {
  listTaxonomy,
  createTaxonomy,
  type TaxonomyKind,
} from '@/server/taxonomy/taxonomy.service';

type RouteContext = { params: Promise<{ kind: string }> };

function parseKind(raw: string): TaxonomyKind | null {
  if (raw === 'styles') return 'style';
  if (raw === 'outfit-types') return 'outfitType';
  return null;
}

// GET /api/manager/taxonomy/[kind] — list styles or outfit types
export async function GET(_req: NextRequest, ctx: RouteContext) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const canView = await hasPermission(session.userId, PERMISSIONS.TAXONOMY_VIEW);
  if (!canView) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const { kind: rawKind } = await ctx.params;
  const kind = parseKind(rawKind);
  if (!kind) return NextResponse.json({ error: 'Invalid taxonomy kind' }, { status: 400 });

  const items = await listTaxonomy(kind);
  return NextResponse.json({ items });
}

// POST /api/manager/taxonomy/[kind] — create style or outfit type (taxonomy.manage)
export async function POST(request: NextRequest, ctx: RouteContext) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    await requirePermission(session.userId, PERMISSIONS.TAXONOMY_MANAGE);
  } catch (error) {
    if (error instanceof ForbiddenError) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    throw error;
  }

  const { kind: rawKind } = await ctx.params;
  const kind = parseKind(rawKind);
  if (!kind) return NextResponse.json({ error: 'Invalid taxonomy kind' }, { status: 400 });

  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const name = typeof body.name === 'string' ? body.name.trim() : '';
  const slug = typeof body.slug === 'string' ? body.slug.trim() : undefined;

  if (!name) return NextResponse.json({ error: 'name is required' }, { status: 400 });

  const result = await createTaxonomy(kind, { name, slug });

  if (!result.ok) {
    if (result.reason === 'slug_taken') {
      return NextResponse.json({ error: 'Slug is already in use' }, { status: 409 });
    }
  }

  return NextResponse.json({ item: result.ok ? result.item : null }, { status: 201 });
}
