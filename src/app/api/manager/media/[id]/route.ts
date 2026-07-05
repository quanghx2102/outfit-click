import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { ForbiddenError, requirePermission } from '@/lib/permissions';
import { PERMISSIONS } from '@/constants/permissions';
import { deleteMediaAsset, MediaAssetNotFoundError } from '@/server/media/media.service';

// DELETE /api/manager/media/:id
export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await requirePermission(session.userId, PERMISSIONS.MEDIA_DELETE);
  } catch (error) {
    if (error instanceof ForbiddenError) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    throw error;
  }

  const { id } = await params;

  try {
    await deleteMediaAsset(id);
    return NextResponse.json({ ok: true });
  } catch (error) {
    if (error instanceof MediaAssetNotFoundError) {
      return NextResponse.json({ error: error.message }, { status: 404 });
    }
    console.error(
      '[api/manager/media/:id] Delete error:',
      error instanceof Error ? error.message : String(error),
    );
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
