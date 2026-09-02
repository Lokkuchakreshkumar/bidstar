import { NextRequest } from 'next/server';
import { db } from '@/server/db';
import { apiSuccess, apiError, generateTraceId } from '@/server/errors';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const traceId = generateTraceId(request.headers.get('x-trace-id'));
  try {
    const { searchParams } = new URL(request.url);
    const heroId = searchParams.get('heroId') || undefined;
    const limit = parseInt(searchParams.get('limit') || '50', 10);

    const bids = await db.getBids(heroId, limit);
    return apiSuccess(bids, { count: bids.length, traceId });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Internal Server Error';
    return apiError('DB_CONNECTION_ERROR', message, 500, undefined, undefined, traceId);
  }
}

export async function POST(request: NextRequest) {
  const traceId = generateTraceId(request.headers.get('x-trace-id'));
  try {
    const body = await request.json();
    const { heroId, amount, userId, username, userAvatar, note } = body;

    const numAmount = Number(amount);
    if (!heroId || isNaN(numAmount) || numAmount < 50) {
      return apiError(
        'VALIDATION_ERROR',
        'Invalid bid payload: heroId and contribution of at least ₹50 are required',
        400,
        'Minimum backing amount is ₹50. Please choose an amount of ₹50 or higher.',
        { minAmount: 50, providedAmount: amount },
        traceId
      );
    }

    // Execute atomic bid inside MongoDB ACID transaction
    const result = await db.createBid({
      heroId,
      amount: numAmount,
      userId: userId || 'anon-user',
      username: username || 'fan_supporter',
      userAvatar,
      note,
    });

    return apiSuccess(
      result,
      { message: 'Bid successfully processed and applied to leaderboard with ACID guarantee', traceId },
      201
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Bid processing transaction failed';
    return apiError(
      'DB_TRANSACTION_FAILED',
      message,
      400,
      'The bid transaction failed and was rolled back safely. No balance or ranking was changed.',
      undefined,
      traceId
    );
  }
}
