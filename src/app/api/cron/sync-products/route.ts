import { type NextRequest, NextResponse } from 'next/server';
import { env } from '@/lib/env';
import { syncProducts } from '@/server/sync/sync-products.service';

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${env.cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const result = await syncProducts();
    return NextResponse.json({ ok: true, ...result });
  } catch (error) {
    console.error('[cron/sync-products] Unhandled error:', error instanceof Error ? error.message : String(error));
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
