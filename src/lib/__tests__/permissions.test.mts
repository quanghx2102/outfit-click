/**
 * TASK 12.2 — Unit tests for permission core (src/lib/permissions.ts)
 *
 * Verifies that:
 * - hasPermission / requirePermission enforce the permission matrix correctly
 * - getProductScope / getOutfitScope / getAnalyticsScope return correct data scopes
 * - Role-specific restrictions hold per 04-permission-matrix.md:
 *     admin         → full access
 *     product_staff → upload_mockup + update_dna; cannot publish outfits
 *     outfit_staff  → create/update outfits; cannot publish (not seeded); cannot touch DNA
 *     viewer        → read-only; cannot edit products or create outfits
 *
 * .mts extension → tsx treats as ESM → mock.module() and top-level await work.
 */

import { describe, test, mock, beforeEach } from 'node:test';
import assert from 'node:assert/strict';

// ─── Mock: prisma ─────────────────────────────────────────────────────────────
// permissions.ts calls prisma.permission.findMany() inside getUserPermissions().
// We mock it to return a controlled permission list per test scenario.

const mockFindMany = mock.fn(async (_args: unknown) => [] as { code: string }[]);

mock.module(new URL('../db.ts', import.meta.url).href, {
  namedExports: {
    prisma: {
      permission: { findMany: mockFindMany },
    },
  },
});

// ─── Module under test ────────────────────────────────────────────────────────
// Dynamic import AFTER mock registration so the mock is in the module cache.

const {
  hasPermission,
  requirePermission,
  getProductScope,
  getOutfitScope,
  getAnalyticsScope,
  ForbiddenError,
} = await import('../permissions.js');

// ─── Helpers ─────────────────────────────────────────────────────────────────

/** Set prisma.permission.findMany to always return the given permission codes. */
function withPermissions(codes: string[]): void {
  mockFindMany.mock.mockImplementation(async () => codes.map((code) => ({ code })));
}

// ─── Permission sets per 04-permission-matrix.md ─────────────────────────────

const ADMIN = [
  'dashboard.view_all', 'dashboard.view_own',
  'users.view', 'users.create', 'users.update', 'users.delete',
  'roles.view', 'roles.manage',
  'products.view_all', 'products.view_assigned', 'products.update',
  'products.update_dna', 'products.upload_mockup', 'products.assign', 'products.delete',
  'outfits.view_all', 'outfits.view_own', 'outfits.create', 'outfits.update',
  'outfits.delete', 'outfits.publish', 'outfits.hide',
  'outfits.add_product', 'outfits.remove_product',
  'analytics.view_all', 'analytics.view_own',
  'media.upload', 'media.delete',
  'sync.view', 'sync.run',
  'settings.manage',
];

// product_staff: DNA + mockup; no publish; no outfit create/publish
const PRODUCT_STAFF = [
  'dashboard.view_own',
  'products.view_assigned',
  'products.update_dna',
  'products.upload_mockup',
  'outfits.view_own',
  'analytics.view_own',
  'media.upload',
];

// outfit_staff: create/edit outfits; no publish (outfits.publish NOT seeded per matrix "❌")
const OUTFIT_STAFF = [
  'dashboard.view_own',
  'outfits.view_all',
  'outfits.view_own',
  'outfits.create',
  'outfits.update',
  'outfits.add_product',
  'outfits.remove_product',
  'products.view_assigned',
  'analytics.view_own',
  'media.upload',
];

// viewer: read-only across board
const VIEWER = [
  'dashboard.view_own',
  'products.view_assigned',
  'outfits.view_own',
  'analytics.view_own',
];

// ─── hasPermission ────────────────────────────────────────────────────────────

describe('hasPermission', () => {
  beforeEach(() => mockFindMany.mock.resetCalls());

  test('returns true when user has the permission', async () => {
    withPermissions(ADMIN);
    const result = await hasPermission('admin-id', 'outfits.publish');
    assert.strictEqual(result, true);
  });

  test('returns false when user lacks the permission', async () => {
    withPermissions(OUTFIT_STAFF); // outfit_staff has no outfits.publish
    const result = await hasPermission('os-id', 'outfits.publish');
    assert.strictEqual(result, false);
  });
});

// ─── requirePermission ────────────────────────────────────────────────────────

describe('requirePermission', () => {
  beforeEach(() => mockFindMany.mock.resetCalls());

  test('resolves silently when user has the permission', async () => {
    withPermissions(ADMIN);
    await assert.doesNotReject(() => requirePermission('admin-id', 'outfits.publish'));
  });

  test('throws ForbiddenError with status 403 when denied', async () => {
    withPermissions(OUTFIT_STAFF);
    await assert.rejects(
      () => requirePermission('os-id', 'outfits.publish'),
      (err: unknown) => {
        assert.ok(err instanceof ForbiddenError, 'must throw ForbiddenError');
        assert.strictEqual((err as typeof ForbiddenError.prototype).status, 403);
        return true;
      },
    );
  });
});

// ─── getProductScope ─────────────────────────────────────────────────────────

describe('getProductScope', () => {
  beforeEach(() => mockFindMany.mock.resetCalls());

  test('returns "all" for admin/manager (has products.view_all)', async () => {
    withPermissions(ADMIN);
    assert.strictEqual(await getProductScope('admin-id'), 'all');
  });

  test('returns "assigned" for product_staff (view_assigned only, not view_all)', async () => {
    withPermissions(PRODUCT_STAFF);
    assert.strictEqual(await getProductScope('ps-id'), 'assigned');
  });

  test('returns "none" for user with no products.view_* permission', async () => {
    withPermissions(['dashboard.view_own']);
    assert.strictEqual(await getProductScope('restricted-id'), 'none');
  });
});

// ─── getOutfitScope ──────────────────────────────────────────────────────────

describe('getOutfitScope', () => {
  beforeEach(() => mockFindMany.mock.resetCalls());

  test('returns "all" for admin (has outfits.view_all)', async () => {
    withPermissions(ADMIN);
    assert.strictEqual(await getOutfitScope('admin-id'), 'all');
  });

  test('returns "own" for outfit_staff (view_own takes effect when view_all absent)', async () => {
    withPermissions(['outfits.view_own']);
    assert.strictEqual(await getOutfitScope('os-id'), 'own');
  });

  test('returns "none" for user with no outfits.view_* permission', async () => {
    withPermissions(['dashboard.view_own']);
    assert.strictEqual(await getOutfitScope('restricted-id'), 'none');
  });
});

// ─── getAnalyticsScope ───────────────────────────────────────────────────────

describe('getAnalyticsScope', () => {
  beforeEach(() => mockFindMany.mock.resetCalls());

  test('returns "all" for admin/manager (has analytics.view_all)', async () => {
    withPermissions(ADMIN);
    assert.strictEqual(await getAnalyticsScope('admin-id'), 'all');
  });

  test('returns "own" for staff (has analytics.view_own only)', async () => {
    withPermissions(['analytics.view_own']);
    assert.strictEqual(await getAnalyticsScope('staff-id'), 'own');
  });

  test('returns "none" for user with no analytics permission', async () => {
    withPermissions(['dashboard.view_own']);
    assert.strictEqual(await getAnalyticsScope('restricted-id'), 'none');
  });
});

// ─── Permission matrix — role scenarios ──────────────────────────────────────

describe('permission matrix — role scenarios', () => {
  beforeEach(() => mockFindMany.mock.resetCalls());

  test('admin: has full access including publish, user mgmt, sync, settings', async () => {
    withPermissions(ADMIN);
    // Admin-exclusive permissions
    assert.strictEqual(await hasPermission('admin-id', 'outfits.publish'), true, 'can publish');
    assert.strictEqual(await hasPermission('admin-id', 'users.view'), true, 'can manage users');
    assert.strictEqual(await hasPermission('admin-id', 'settings.manage'), true, 'can manage settings');
    assert.strictEqual(await hasPermission('admin-id', 'sync.view'), true, 'can view sync logs');
    assert.strictEqual(await hasPermission('admin-id', 'roles.manage'), true, 'can manage roles');
  });

  test('product_staff: has upload_mockup and update_dna; cannot publish outfits', async () => {
    withPermissions(PRODUCT_STAFF);
    assert.strictEqual(
      await hasPermission('ps-id', 'products.upload_mockup'),
      true,
      'can upload mockup',
    );
    assert.strictEqual(
      await hasPermission('ps-id', 'products.update_dna'),
      true,
      'can update DNA',
    );
    assert.strictEqual(
      await hasPermission('ps-id', 'outfits.publish'),
      false,
      'cannot publish outfits',
    );
    assert.strictEqual(
      await hasPermission('ps-id', 'outfits.create'),
      false,
      'cannot create outfits',
    );
  });

  test('outfit_staff: can manage outfits; cannot publish or touch product DNA', async () => {
    withPermissions(OUTFIT_STAFF);
    assert.strictEqual(await hasPermission('os-id', 'outfits.create'), true, 'can create outfits');
    assert.strictEqual(
      await hasPermission('os-id', 'outfits.add_product'),
      true,
      'can add products to outfit',
    );
    assert.strictEqual(
      await hasPermission('os-id', 'outfits.publish'),
      false,
      'cannot publish outfits',
    );
    assert.strictEqual(
      await hasPermission('os-id', 'products.update_dna'),
      false,
      'cannot update product DNA',
    );
    // requirePermission must throw ForbiddenError when outfit_staff tries to publish
    await assert.rejects(
      () => requirePermission('os-id', 'outfits.publish'),
      (err: unknown) => {
        assert.ok(err instanceof ForbiddenError, 'must throw ForbiddenError for publish attempt');
        return true;
      },
    );
  });

  test('viewer: cannot edit products or create outfits; can only read', async () => {
    withPermissions(VIEWER);
    assert.strictEqual(
      await hasPermission('viewer-id', 'products.update'),
      false,
      'cannot update products',
    );
    assert.strictEqual(
      await hasPermission('viewer-id', 'outfits.create'),
      false,
      'cannot create outfits',
    );
    assert.strictEqual(
      await hasPermission('viewer-id', 'products.upload_mockup'),
      false,
      'cannot upload mockup',
    );
    // Viewer retains read access to assigned products
    assert.strictEqual(
      await hasPermission('viewer-id', 'products.view_assigned'),
      true,
      'can view assigned products',
    );
  });
});
