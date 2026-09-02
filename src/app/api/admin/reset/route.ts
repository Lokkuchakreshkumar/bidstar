import { db } from '@/server/db';
import { apiSuccess, apiError } from '@/server/errors';

export const dynamic = 'force-dynamic';

export async function POST() {
  try {
    await db.resetToCleanState();
    return apiSuccess({
      message: 'All platform data has been cleared and reset to a clean ₹0 baseline with canonical heroes.',
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to reset database';
    return apiError('INTERNAL_ERROR', message, 500);
  }
}
