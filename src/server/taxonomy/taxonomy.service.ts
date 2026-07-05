import { prisma } from '@/lib/db';
import { generateSlug } from '@/lib/slug';

// ─── Types ────────────────────────────────────────────────────────────────────

export type TaxonomyKind = 'style' | 'outfitType';

export type TaxonomyItem = {
  id: string;
  name: string;
  slug: string;
  status: string;
  outfitCount: number;
  createdAt: Date;
  updatedAt: Date;
};

export type CreateTaxonomyInput = {
  name: string;
  slug?: string;
};

export type UpdateTaxonomyInput = {
  name?: string;
  slug?: string;
  status?: 'active' | 'inactive';
};

export type CreateTaxonomyResult =
  | { ok: true; item: TaxonomyItem }
  | { ok: false; reason: 'slug_taken' };

export type UpdateTaxonomyResult =
  | { ok: true; item: TaxonomyItem }
  | { ok: false; reason: 'not_found' | 'slug_taken' };

export type DeleteTaxonomyResult =
  | { ok: true }
  | { ok: false; reason: 'not_found' | 'in_use' };

function delegateFor(kind: TaxonomyKind) {
  return kind === 'style' ? prisma.style : prisma.outfitType;
}

// ─── Queries ──────────────────────────────────────────────────────────────────

export async function listTaxonomy(kind: TaxonomyKind): Promise<TaxonomyItem[]> {
  const delegate = delegateFor(kind);
  const rows = await (delegate as typeof prisma.style).findMany({
    where: { deletedAt: null },
    orderBy: { name: 'asc' },
    select: {
      id: true,
      name: true,
      slug: true,
      status: true,
      createdAt: true,
      updatedAt: true,
      _count: { select: { outfits: true } },
    },
  });

  return rows.map((r) => ({
    id: r.id,
    name: r.name,
    slug: r.slug,
    status: r.status,
    outfitCount: r._count.outfits,
    createdAt: r.createdAt,
    updatedAt: r.updatedAt,
  }));
}

// ─── Create ───────────────────────────────────────────────────────────────────

export async function createTaxonomy(
  kind: TaxonomyKind,
  input: CreateTaxonomyInput,
): Promise<CreateTaxonomyResult> {
  const delegate = delegateFor(kind);
  const slug = (input.slug?.trim() || generateSlug(input.name)).toLowerCase();

  const existing = await (delegate as typeof prisma.style).findUnique({
    where: { slug },
    select: { id: true },
  });
  if (existing) return { ok: false, reason: 'slug_taken' };

  const created = await (delegate as typeof prisma.style).create({
    data: { name: input.name.trim(), slug, status: 'active' },
    select: {
      id: true,
      name: true,
      slug: true,
      status: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return { ok: true, item: { ...created, outfitCount: 0 } };
}

// ─── Update ───────────────────────────────────────────────────────────────────

export async function updateTaxonomy(
  kind: TaxonomyKind,
  id: string,
  input: UpdateTaxonomyInput,
): Promise<UpdateTaxonomyResult> {
  const delegate = delegateFor(kind);

  const existing = await (delegate as typeof prisma.style).findUnique({
    where: { id },
    select: { id: true },
  });
  if (!existing) return { ok: false, reason: 'not_found' };

  if (input.slug) {
    const slugOwner = await (delegate as typeof prisma.style).findUnique({
      where: { slug: input.slug.toLowerCase() },
      select: { id: true },
    });
    if (slugOwner && slugOwner.id !== id) return { ok: false, reason: 'slug_taken' };
  }

  const updated = await (delegate as typeof prisma.style).update({
    where: { id },
    data: {
      ...(input.name ? { name: input.name.trim() } : {}),
      ...(input.slug ? { slug: input.slug.trim().toLowerCase() } : {}),
      ...(input.status ? { status: input.status } : {}),
    },
    select: {
      id: true,
      name: true,
      slug: true,
      status: true,
      createdAt: true,
      updatedAt: true,
      _count: { select: { outfits: true } },
    },
  });

  return {
    ok: true,
    item: {
      id: updated.id,
      name: updated.name,
      slug: updated.slug,
      status: updated.status,
      outfitCount: updated._count.outfits,
      createdAt: updated.createdAt,
      updatedAt: updated.updatedAt,
    },
  };
}

// ─── Delete (soft) ─────────────────────────────────────────────────────────────

export async function softDeleteTaxonomy(
  kind: TaxonomyKind,
  id: string,
): Promise<DeleteTaxonomyResult> {
  const delegate = delegateFor(kind);

  const existing = await (delegate as typeof prisma.style).findUnique({
    where: { id },
    select: { id: true, _count: { select: { outfits: true } } },
  });
  if (!existing) return { ok: false, reason: 'not_found' };
  if (existing._count.outfits > 0) return { ok: false, reason: 'in_use' };

  await (delegate as typeof prisma.style).update({
    where: { id },
    data: { status: 'inactive', deletedAt: new Date() },
  });

  return { ok: true };
}
