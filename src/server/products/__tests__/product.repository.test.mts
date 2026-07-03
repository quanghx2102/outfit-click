/**
 * TASK 12.1 — Unit tests for upsertProductFromSource
 *
 * Tests that the upsert logic:
 * - Creates a new product when none exists
 * - Updates (not re-creates) when the product already exists
 * - Never writes mockupImageUrl or productDna (Staff-managed fields)
 *
 * .mts extension → tsx treats as ESM → mock.module() and top-level await work.
 */

import { describe, test, mock, beforeEach } from 'node:test';
import assert from 'node:assert/strict';

// ─── Mock: prisma ─────────────────────────────────────────────────────────────
// Register synchronously before importing the module under test.
// File URL matches the key tsx registers in the module cache for @/lib/db.

// Typed with a parameter to avoid TypeScript treating Arguments as empty tuple.
// The actual argument shape is validated via type assertion inside each test.
const mockFindUnique = mock.fn(async (_args: unknown) => null as { id: string } | null);
const mockCreate = mock.fn(async (_args: unknown) => ({} as Record<string, unknown>));
const mockUpdate = mock.fn(async (_args: unknown) => ({} as Record<string, unknown>));

mock.module(new URL('../../../lib/db.ts', import.meta.url).href, {
  namedExports: {
    prisma: {
      product: {
        findUnique: mockFindUnique,
        create: mockCreate,
        update: mockUpdate,
      },
    },
  },
});

// ─── Module under test ────────────────────────────────────────────────────────
// Dynamic import AFTER mock registration — finds the mock in the module cache.

const { upsertProductFromSource } = await import('../product.repository.js');

// ─── Test data ────────────────────────────────────────────────────────────────

const baseData = {
  urlSuffix: 'test-source',
  externalLinkId: 'link-001',
  externalItemId: 'item-001',
  externalGroupId: 'group-001',
  externalGroupName: 'Group One',
  name: 'Test Product',
  imageUrl: 'https://example.com/image.jpg',
  affiliateUrl: 'https://example.com/affiliate',
  h5Link: 'https://h5.example.com',
  rawJson: { linkId: 'link-001' },
  status: 'active',
  lastSyncedAt: new Date('2026-07-02T00:00:00Z'),
};

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('upsertProductFromSource', () => {
  beforeEach(() => {
    mockFindUnique.mock.resetCalls();
    mockCreate.mock.resetCalls();
    mockUpdate.mock.resetCalls();
  });

  test('creates product when none exists → wasCreated=true', async () => {
    mockFindUnique.mock.mockImplementationOnce(async () => null);
    mockCreate.mock.mockImplementationOnce(async () => ({}));

    const result = await upsertProductFromSource({ ...baseData });

    assert.strictEqual(result.wasCreated, true);
    assert.strictEqual(mockCreate.mock.calls.length, 1, 'prisma.product.create called once');
    assert.strictEqual(mockUpdate.mock.calls.length, 0, 'prisma.product.update NOT called');
  });

  test('updates existing product → wasCreated=false, no new record', async () => {
    mockFindUnique.mock.mockImplementationOnce(async () => ({ id: 'existing-uuid' }));
    mockUpdate.mock.mockImplementationOnce(async () => ({}));

    const result = await upsertProductFromSource({ ...baseData });

    assert.strictEqual(result.wasCreated, false);
    assert.strictEqual(mockUpdate.mock.calls.length, 1, 'prisma.product.update called once');
    assert.strictEqual(mockCreate.mock.calls.length, 0, 'prisma.product.create NOT called');
  });

  test('calling twice with same key → second call updates, does not create duplicate', async () => {
    // First call: product does not exist → create
    mockFindUnique.mock.mockImplementationOnce(async () => null);
    mockCreate.mock.mockImplementationOnce(async () => ({}));
    await upsertProductFromSource({ ...baseData });

    mockFindUnique.mock.resetCalls();
    mockCreate.mock.resetCalls();
    mockUpdate.mock.resetCalls();

    // Second call with same (urlSuffix, externalLinkId) → update only
    mockFindUnique.mock.mockImplementationOnce(async () => ({ id: 'existing-uuid' }));
    mockUpdate.mock.mockImplementationOnce(async () => ({}));
    const result = await upsertProductFromSource({ ...baseData });

    assert.strictEqual(result.wasCreated, false);
    assert.strictEqual(mockCreate.mock.calls.length, 0, 'no duplicate row created');
    assert.strictEqual(mockUpdate.mock.calls.length, 1, 'existing row updated instead');
  });

  test('update payload does NOT include mockupImageUrl', async () => {
    mockFindUnique.mock.mockImplementationOnce(async () => ({ id: 'existing-uuid' }));
    mockUpdate.mock.mockImplementationOnce(async () => ({}));

    await upsertProductFromSource({ ...baseData });

    const args = mockUpdate.mock.calls[0]!.arguments[0] as {
      data: Record<string, unknown>;
    };
    assert.ok(
      !('mockupImageUrl' in args.data),
      'mockupImageUrl must NOT appear in update payload — Staff field must be preserved',
    );
  });

  test('update payload does NOT include productDna', async () => {
    mockFindUnique.mock.mockImplementationOnce(async () => ({ id: 'existing-uuid' }));
    mockUpdate.mock.mockImplementationOnce(async () => ({}));

    await upsertProductFromSource({ ...baseData });

    const args = mockUpdate.mock.calls[0]!.arguments[0] as {
      data: Record<string, unknown>;
    };
    assert.ok(
      !('productDna' in args.data),
      'productDna must NOT appear in update payload — Staff field must be preserved',
    );
  });

  test('create payload does NOT include mockupImageUrl', async () => {
    mockFindUnique.mock.mockImplementationOnce(async () => null);
    mockCreate.mock.mockImplementationOnce(async () => ({}));

    await upsertProductFromSource({ ...baseData });

    const args = mockCreate.mock.calls[0]!.arguments[0] as {
      data: Record<string, unknown>;
    };
    assert.ok(
      !('mockupImageUrl' in args.data),
      'mockupImageUrl must NOT appear in create payload',
    );
  });

  test('create payload does NOT include productDna', async () => {
    mockFindUnique.mock.mockImplementationOnce(async () => null);
    mockCreate.mock.mockImplementationOnce(async () => ({}));

    await upsertProductFromSource({ ...baseData });

    const args = mockCreate.mock.calls[0]!.arguments[0] as {
      data: Record<string, unknown>;
    };
    assert.ok(
      !('productDna' in args.data),
      'productDna must NOT appear in create payload',
    );
  });
});
