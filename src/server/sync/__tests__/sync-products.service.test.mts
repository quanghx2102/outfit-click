/**
 * TASK 12.1 — Test: API error → sync_logs status=failed
 *
 * Verifies that when the MyCollection API fails on all 4 attempts (1 + 3 retries),
 * the sync_logs record is updated with status='failed'.
 *
 * .mts extension → tsx treats as ESM → mock.module() and top-level await work.
 * t.mock.timers virtualises retry delays (1s + 3s + 5s) for fast test execution.
 */

import { describe, test, mock } from 'node:test';
import assert from 'node:assert/strict';

// ─── Mock: @/lib/env ──────────────────────────────────────────────────────────
// env.ts throws at module evaluation time if required env vars are absent.
// Provide a stub covering only what sync-products.service.ts accesses.

mock.module(new URL('../../../lib/env.ts', import.meta.url).href, {
  namedExports: {
    env: {
      sync: {
        urlSuffixes: ['test-suffix'],
        groupIds: ['group-001'],
        affiliateId: 'aff-001',
        affiliateUserId: 'user-001',
        cid: 'vn',
        language: 'vi',
      },
    },
  },
});

// ─── Mock: @/lib/db (prisma) ──────────────────────────────────────────────────

// Typed with a parameter so arguments[0] resolves to unknown, not empty tuple.
const mockSyncLogFindFirst = mock.fn(async (_args: unknown) => null as { id: string } | null);
const mockSyncLogCreate = mock.fn(async (_args: unknown) => ({ id: 'test-log-id' }));
const mockSyncLogUpdate = mock.fn(async (_args: unknown) => ({} as Record<string, unknown>));

mock.module(new URL('../../../lib/db.ts', import.meta.url).href, {
  namedExports: {
    prisma: {
      syncLog: {
        findFirst: mockSyncLogFindFirst,
        create: mockSyncLogCreate,
        update: mockSyncLogUpdate,
      },
    },
  },
});

// ─── Mock: mycollection client ────────────────────────────────────────────────
// Always throw to simulate persistent API failure across all retry attempts.

const mockFetchClient = mock.fn(async () => {
  throw new Error('HTTP 500 Internal Server Error');
});

mock.module(new URL('../mycollection.client.ts', import.meta.url).href, {
  namedExports: { fetchStorefrontGroupProductList: mockFetchClient },
});

// ─── Module under test ────────────────────────────────────────────────────────

const { syncProducts } = await import('../sync-products.service.js');

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('syncProducts — error path', () => {
  test('API fails on all retries → sync_logs.status = failed', async (t) => {
    // Replace real setTimeout with a virtual clock — no real 9-second wait.
    t.mock.timers.enable({ apis: ['setTimeout'] });

    mockSyncLogFindFirst.mock.resetCalls();
    mockSyncLogCreate.mock.resetCalls();
    mockSyncLogUpdate.mock.resetCalls();
    mockFetchClient.mock.resetCalls();

    // Start sync — pauses at each `await sleep(n)` inside fetchPageWithRetry.
    const syncPromise = syncProducts();

    // drain() flushes pending Promise microtasks. setImmediate fires after all
    // microtasks, so awaiting it ensures the event loop fully processes each
    // async step before the next timer tick.
    const drain = async () => {
      for (let i = 0; i < 10; i++) {
        await new Promise<void>((resolve) => setImmediate(resolve));
      }
    };

    // Retry schedule (RETRY_DELAYS_MS = [1000, 3000, 5000]):
    //   attempt 0 → throw → sleep(1000)
    //   attempt 1 → throw → sleep(3000)
    //   attempt 2 → throw → sleep(5000)
    //   attempt 3 → throw → no sleep (last attempt) → throw lastError
    await drain();              // lock check + syncLog.create + attempt 0 → sleep(1000) pending
    t.mock.timers.tick(1000);  // fire sleep(1000)
    await drain();              // attempt 1 executes → sleep(3000) pending
    t.mock.timers.tick(3000);  // fire sleep(3000)
    await drain();              // attempt 2 executes → sleep(5000) pending
    t.mock.timers.tick(5000);  // fire sleep(5000)
    await drain();              // attempt 3 (final) → throw → catch → syncLog.update

    await syncPromise;

    // ── Assertions ────────────────────────────────────────────────────────────

    assert.strictEqual(
      mockSyncLogUpdate.mock.calls.length,
      1,
      'syncLog.update must be called exactly once after failure',
    );

    const updateArgs = mockSyncLogUpdate.mock.calls[0]!.arguments[0] as {
      where: { id: string };
      data: { status: string; errorMessage: string | null; finishedAt: Date };
    };

    assert.strictEqual(
      updateArgs.data.status,
      'failed',
      'sync_logs.status must be "failed" when all retries are exhausted',
    );

    assert.ok(
      typeof updateArgs.data.errorMessage === 'string' &&
        updateArgs.data.errorMessage.length > 0,
      'sync_logs.error_message must be a non-empty string describing the API error',
    );

    assert.ok(
      updateArgs.data.finishedAt instanceof Date,
      'sync_logs.finished_at must be a Date',
    );

    // 4 total attempts: 1 initial + 3 retries.
    assert.strictEqual(
      mockFetchClient.mock.calls.length,
      4,
      'fetchStorefrontGroupProductList must be attempted 4 times (1 initial + 3 retries)',
    );
  });
});
