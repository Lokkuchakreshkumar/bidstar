import { NextRequest } from 'next/server';
import { db } from '@/server/db';
import { apiSuccess, apiError, generateTraceId } from '@/server/errors';
import { getPaymentsCollection } from '@/server/mongodb';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const traceId = generateTraceId(request.headers.get('x-trace-id'));

  try {
    const financials = await db.getAdminFinancials();
    const adjustments = await db.getPromoAdjustments(50);

    // Also fetch recent payments for transaction visibility
    const paymentsCol = await getPaymentsCollection();
    const recentPayments = await paymentsCol
      .find({})
      .sort({ createdAt: -1 })
      .limit(50)
      .toArray();

    const formattedPayments = recentPayments.map((p) => ({
      sessionId: p.sessionId,
      paymentId: p.paymentId,
      heroId: p.heroId,
      heroName: p.heroName,
      userId: p.userId,
      username: p.username,
      amount: p.amount,
      status: p.status,
      customerEmail: p.customerEmail,
      createdAt: p.createdAt,
      fulfilledAt: p.fulfilledAt,
    }));

    return apiSuccess(
      {
        financials,
        adjustments,
        payments: formattedPayments,
      },
      { traceId },
      200
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Internal Server Error';
    return apiError('DB_CONNECTION_ERROR', message, 500, undefined, undefined, traceId);
  }
}
