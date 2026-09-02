import { NextRequest } from 'next/server';
import { db } from '@/server/db';
import { dodoClient } from '@/lib/dodo';
import { apiSuccess, apiError, generateTraceId } from '@/server/errors';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const traceId = generateTraceId(request.headers.get('x-trace-id'));
  try {
    const { searchParams } = new URL(request.url);
    const paymentId = searchParams.get('payment_id') || searchParams.get('paymentId');
    const sessionId = searchParams.get('session_id') || searchParams.get('sessionId');
    const statusParam = searchParams.get('status');
    const heroIdParam = searchParams.get('hero_id') || searchParams.get('heroId');

    if (!paymentId && !sessionId && statusParam !== 'succeeded') {
      return apiError(
        'VALIDATION_ERROR',
        'Either payment_id or session_id is required',
        400,
        'Missing payment verification parameters.',
        undefined,
        traceId
      );
    }

    // 1. Verify via payment_id (primary when Dodo redirects with ?payment_id=pay_...&status=succeeded)
    if (paymentId) {
      try {
        const dodoPayment = await dodoClient.payments.retrieve(paymentId);

        if (dodoPayment && dodoPayment.status === 'succeeded') {
          const metadata = dodoPayment.metadata || {};
          const heroId = metadata.hero_id ? String(metadata.hero_id) : heroIdParam;
          const amount = metadata.amount_inr
            ? Number(metadata.amount_inr)
            : Math.round(Number(dodoPayment.total_amount || 0) / 100);
          const username = metadata.username ? String(metadata.username) : dodoPayment.customer?.name || 'fan';
          const userId = metadata.user_id ? String(metadata.user_id) : 'anon-user';
          const note = metadata.note ? String(metadata.note) : undefined;

          const checkoutSessionId = dodoPayment.checkout_session_id || (metadata as Record<string, unknown>).session_id as string || sessionId || undefined;

          if (heroId) {
            const fulfillResult = await db.fulfillByPaymentId(paymentId, {
              heroId,
              amount: amount > 0 ? amount : 50,
              sessionId: checkoutSessionId,
              userId,
              username,
              note,
              customerEmail: dodoPayment.customer?.email || undefined,
            });

            return apiSuccess({
              paymentStatus: 'succeeded',
              alreadyFulfilled: fulfillResult.alreadyFulfilled,
              hero: fulfillResult.hero,
              amount: fulfillResult.bid.amount,
              username: fulfillResult.bid.username,
              previousRank: fulfillResult.previousRank,
              newRank: fulfillResult.newRank,
              becameRankOne: fulfillResult.becameRankOne,
            });
          }
        }
      } catch (err) {
        console.warn('Payment retrieval warning:', err);
      }
    }

    // 2. Verify via session_id
    if (sessionId) {
      const localPayment = await db.getPayment(sessionId);

      // If local record already marked as PAID, return hero rank status immediately
      if (localPayment && localPayment.status === 'PAID') {
        const hero = await db.getHeroById(localPayment.heroId);
        return apiSuccess({
          paymentStatus: 'succeeded',
          alreadyFulfilled: true,
          hero,
          amount: localPayment.amount,
          username: localPayment.username,
          previousRank: hero?.previousRank || hero?.currentRank || 1,
          newRank: hero?.currentRank || 1,
          becameRankOne: hero?.currentRank === 1,
        });
      }

      // Verify session status with Dodo Payments API
      try {
        const dodoSession = await dodoClient.checkoutSessions.retrieve(sessionId);

        if (dodoSession && dodoSession.payment_status === 'succeeded') {
          if (localPayment) {
            const fulfillResult = await db.fulfillPayment(sessionId, dodoSession.payment_id || undefined);
            return apiSuccess({
              paymentStatus: 'succeeded',
              alreadyFulfilled: fulfillResult.alreadyFulfilled,
              hero: fulfillResult.hero,
              amount: fulfillResult.bid.amount,
              username: fulfillResult.bid.username,
              previousRank: fulfillResult.previousRank,
              newRank: fulfillResult.newRank,
              becameRankOne: fulfillResult.becameRankOne,
            });
          }
        }
      } catch (err) {
        console.warn('Checkout session retrieve warning:', err);
      }
    }

    // 3. Fallback when redirect has status=succeeded & hero_id
    if (statusParam === 'succeeded' && heroIdParam) {
      const hero = await db.getHeroById(heroIdParam);
      if (hero) {
        return apiSuccess({
          paymentStatus: 'succeeded',
          hero,
          amount: 60,
          username: 'fan',
          previousRank: hero.previousRank || hero.currentRank,
          newRank: hero.currentRank,
          becameRankOne: hero.currentRank === 1,
        });
      }
    }

    // Payment not confirmed yet
    return apiSuccess(
      {
        paymentStatus: 'pending',
        message: 'Payment has not been completed or is still processing',
      },
      { traceId }
    );
  } catch (error: unknown) {
    console.error('Session verification error:', error);
    const message = error instanceof Error ? error.message : 'Internal Server Error';
    return apiError('PAYMENT_ERROR', message, 500, undefined, undefined, traceId);
  }
}
