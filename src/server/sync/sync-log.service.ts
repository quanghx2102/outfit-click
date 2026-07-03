import { prisma } from '@/lib/db';
import type { SyncStatus } from '@/constants/status';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface SyncLogItem {
  id: string;
  urlSuffix: string;
  groupId: string | null;
  status: string;
  totalFetched: number;
  totalCreated: number;
  totalUpdated: number;
  totalDeactivated: number;
  errorMessage: string | null;
  startedAt: Date;
  finishedAt: Date | null;
  createdAt: Date;
}

export interface ListSyncLogsParams {
  status?: SyncStatus;
  from?: Date;
  to?: Date;
  page: number;
  limit: number;
}

export interface ListSyncLogsResult {
  items: SyncLogItem[];
  total: number;
}

// ─── Service ──────────────────────────────────────────────────────────────────

export async function listSyncLogs(params: ListSyncLogsParams): Promise<ListSyncLogsResult> {
  const { status, from, to, page, limit } = params;

  const where: {
    status?: string;
    startedAt?: { gte?: Date; lte?: Date };
  } = {};

  if (status) where.status = status;
  if (from || to) {
    where.startedAt = {};
    if (from) where.startedAt.gte = from;
    if (to) where.startedAt.lte = to;
  }

  const [items, total] = await Promise.all([
    prisma.syncLog.findMany({
      where,
      orderBy: { startedAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.syncLog.count({ where }),
  ]);

  return { items, total };
}
