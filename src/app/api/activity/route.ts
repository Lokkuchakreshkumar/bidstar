import { NextRequest } from 'next/server';
import { db } from '@/server/db';
import { apiSuccess, apiError } from '@/server/errors';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '50', 10);
    const events = await db.getActivity(limit);
    return apiSuccess(events, { count: events.length });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Internal Server Error';
    return apiError('DB_CONNECTION_ERROR', message, 500);
  }
}
