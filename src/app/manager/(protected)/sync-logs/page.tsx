import { Suspense } from 'react';
import Link from 'next/link';
import { requireAuth } from '@/lib/require-auth';
import { hasPermission } from '@/lib/permissions';
import { PERMISSIONS } from '@/constants/permissions';
import { SYNC_STATUS } from '@/constants/status';
import type { SyncStatus } from '@/constants/status';
import { listSyncLogs } from '@/server/sync/sync-log.service';
import SyncLogFilters from '@/components/manager/SyncLogFilters';

// ─── Constants ────────────────────────────────────────────────────────────────

const PAGE_SIZE = 50;
const VALID_STATUSES = new Set<string>(Object.values(SYNC_STATUS));

// ─── Types ────────────────────────────────────────────────────────────────────

type PageSearchParams = {
  status?: string;
  from?: string;
  to?: string;
  page?: string;
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function toDateStr(d: Date): string {
  return d.toISOString().slice(0, 10);
}

function parseQueryDate(str: string | undefined, fallback: Date): Date {
  if (!str) return new Date(fallback);
  const d = new Date(str + 'T00:00:00.000Z');
  return isNaN(d.getTime()) ? new Date(fallback) : d;
}

function formatDatetime(d: Date | null): string {
  if (!d) return '—';
  return d.toISOString().replace('T', ' ').slice(0, 19) + ' UTC';
}

function duration(start: Date, end: Date | null): string {
  if (!end) return '…';
  const ms = end.getTime() - start.getTime();
  if (ms < 1000) return `${ms}ms`;
  return `${(ms / 1000).toFixed(1)}s`;
}

function statusBadgeClass(status: string): string {
  const map: Record<string, string> = {
    [SYNC_STATUS.SUCCESS]: 'bg-green-100 text-green-800',
    [SYNC_STATUS.PARTIAL_SUCCESS]: 'bg-yellow-100 text-yellow-800',
    [SYNC_STATUS.FAILED]: 'bg-red-100 text-red-800',
    [SYNC_STATUS.RUNNING]: 'bg-blue-100 text-blue-800',
  };
  return map[status] ?? 'bg-gray-100 text-gray-700';
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function SyncLogsPage({
  searchParams,
}: {
  searchParams: Promise<PageSearchParams>;
}) {
  const [user, params] = await Promise.all([requireAuth(), searchParams]);

  const canView = await hasPermission(user.id, PERMISSIONS.SYNC_VIEW);

  if (!canView) {
    return (
      <main className="p-6">
        <h1 className="text-lg font-semibold text-gray-900">Sync Logs</h1>
        <p className="mt-4 text-sm text-gray-500">
          You do not have permission to view sync logs.
        </p>
      </main>
    );
  }

  // Default date range: last 7 days (UTC)
  const today = new Date();
  const sevenDaysAgo = new Date(today);
  sevenDaysAgo.setUTCDate(today.getUTCDate() - 7);

  const fromStr = params.from ?? toDateStr(sevenDaysAgo);
  const toStr = params.to ?? toDateStr(today);

  const from = parseQueryDate(params.from, sevenDaysAgo);
  const to = parseQueryDate(params.to, today);
  to.setUTCHours(23, 59, 59, 999);

  const status =
    params.status && VALID_STATUSES.has(params.status)
      ? (params.status as SyncStatus)
      : undefined;

  const page = Math.max(1, parseInt(params.page ?? '1', 10) || 1);

  const result = await listSyncLogs({ status, from, to, page, limit: PAGE_SIZE });

  const totalPages = Math.ceil(result.total / PAGE_SIZE);

  function buildPageUrl(p: number): string {
    const query = new URLSearchParams();
    if (status) query.set('status', status);
    query.set('from', fromStr);
    query.set('to', toStr);
    if (p > 1) query.set('page', String(p));
    const qs = query.toString();
    return `/manager/sync-logs${qs ? `?${qs}` : ''}`;
  }

  return (
    <main className="flex flex-col gap-6 p-6">
      <div>
        <h1 className="text-lg font-semibold text-gray-900">Sync Logs</h1>
        <p className="text-sm text-gray-500">
          {result.total} log{result.total !== 1 ? 's' : ''} in selected range
        </p>
      </div>

      <Suspense>
        <SyncLogFilters fromStr={fromStr} toStr={toStr} />
      </Suspense>

      {result.items.length === 0 ? (
        <p className="text-sm text-gray-500">No sync logs found.</p>
      ) : (
        <div className="overflow-x-auto rounded-lg border bg-white">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b bg-gray-50 text-left text-xs font-medium uppercase tracking-wide text-gray-500">
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">URL Suffix</th>
                <th className="px-4 py-3">Group ID</th>
                <th className="px-4 py-3 text-right">Fetched</th>
                <th className="px-4 py-3 text-right">Created</th>
                <th className="px-4 py-3 text-right">Updated</th>
                <th className="px-4 py-3">Started At</th>
                <th className="px-4 py-3">Finished At</th>
                <th className="px-4 py-3">Duration</th>
                <th className="px-4 py-3">Error</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {result.items.map((log) => (
                <tr key={log.id} className="hover:bg-gray-50">
                  <td className="whitespace-nowrap px-4 py-3">
                    <span
                      className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${statusBadgeClass(log.status)}`}
                    >
                      {log.status}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 font-mono text-xs text-gray-700">
                    {log.urlSuffix}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 font-mono text-xs text-gray-500">
                    {log.groupId ?? '—'}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-right tabular-nums text-gray-700">
                    {log.totalFetched}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-right tabular-nums text-green-700">
                    {log.totalCreated}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-right tabular-nums text-gray-700">
                    {log.totalUpdated}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 font-mono text-xs text-gray-500">
                    {formatDatetime(log.startedAt)}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 font-mono text-xs text-gray-500">
                    {formatDatetime(log.finishedAt)}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-xs text-gray-500">
                    {duration(log.startedAt, log.finishedAt)}
                  </td>
                  <td className="max-w-xs px-4 py-3">
                    {log.errorMessage ? (
                      <span
                        className="line-clamp-2 text-xs text-red-600"
                        title={log.errorMessage}
                      >
                        {log.errorMessage}
                      </span>
                    ) : (
                      <span className="text-xs text-gray-300">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex items-center justify-between text-sm text-gray-600">
          <span>
            Page {page} of {totalPages}
          </span>
          <div className="flex gap-2">
            {page > 1 && (
              <Link
                href={buildPageUrl(page - 1)}
                className="inline-flex h-8 items-center rounded-lg border border-input bg-background px-3 text-sm hover:bg-muted"
              >
                Previous
              </Link>
            )}
            {page < totalPages && (
              <Link
                href={buildPageUrl(page + 1)}
                className="inline-flex h-8 items-center rounded-lg border border-input bg-background px-3 text-sm hover:bg-muted"
              >
                Next
              </Link>
            )}
          </div>
        </div>
      )}
    </main>
  );
}
