import { NextRequest } from 'next/server';
import { db } from '@/server/db';
import { apiSuccess, apiError } from '@/server/errors';

export const dynamic = 'force-dynamic';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await db.rejectRequest(id);
    return apiSuccess({ id, status: 'REJECTED' }, { message: 'Request rejected' });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Internal Server Error';
    return apiError('NOT_FOUND', message, 400);
  }
}
