import { db } from '@/server/db';
import { apiSuccess, apiError } from '@/server/errors';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const stats = await db.getStats();
    return apiSuccess(stats);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Internal Server Error';
    return apiError('DB_CONNECTION_ERROR', message, 500);
  }
}
