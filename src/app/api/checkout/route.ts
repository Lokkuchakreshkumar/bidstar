import { NextRequest } from 'next/server';
import { db } from '@/server/db';
import { dodoClient, DODO_PRODUCT_ID } from '@/lib/dodo';
import { apiSuccess, apiError, generateTraceId } from '@/server/errors';
import { rateLimiter, getClientIp } from '@/lib/rate-limiter';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  const traceId = generateTraceId(request.headers.get('x-trace-id'));
  const clientIp = getClientIp(request);

  // 1. Inbound Rate Limiting (5 requests per minute per IP for payments)
  const rl = rateLimiter.check(`checkout:${clientIp}`, 5, 60000);
  if (!rl.allowed) {
    return apiError(
      'RATE_LIMITED',
      'Too many checkout attempts initiated from this device. Please wait a moment.',
      429,
      `Please wait ${rl.resetSeconds} seconds before initiating another payment.`,
      { retryAfterSeconds: rl.resetSeconds },
      traceId,
      { 'Retry-After': String(rl.resetSeconds) }
    );
  }

  try {
    const body = await request.json();
    const { heroId, amount, customerEmail, username, userAvatar, note, userId, idempotencyKey } = body;

    const numAmount = Number(amount);
    if (!heroId || isNaN(numAmount) || numAmount < 50) {
      return apiError(
        'VALIDATION_ERROR',
        'Valid heroId and minimum contribution of ₹50 are required',
        400,
        'Minimum backing amount is ₹50. Please choose an amount of ₹50 or higher.',
        { minAmount: 50, providedAmount: amount },
        traceId
      );
    }

    const hero = await db.getHeroById(heroId);
    if (!hero) {
      return apiError('NOT_FOUND', `Hero with id '${heroId}' not found`, 404, undefined, undefined, traceId);
    }

    // 2. Idempotency Check: prevent double-charge if client retried with same idempotencyKey
    const cleanIdempotencyKey = idempotencyKey && String(idempotencyKey).trim() ? String(idempotencyKey).trim() : null;
    if (cleanIdempotencyKey) {
      const existingPayment = await db.getPaymentByIdempotencyKey(cleanIdempotencyKey);
      if (existingPayment && existingPayment.checkoutUrl) {
        // Return existing session if within 15 minutes
        const createdAtMs = new Date(existingPayment.createdAt).getTime();
        if (Date.now() - createdAtMs < 15 * 60 * 1000) {
          return apiSuccess(
            {
              sessionId: existingPayment.sessionId,
              checkoutUrl: existingPayment.checkoutUrl,
              amount: existingPayment.amount,
              heroId: existingPayment.heroId,
              heroName: existingPayment.heroName,
              idempotentReplay: true,
            },
            { traceId },
            200
          );
        }
      }
    }

    // Determine the base origin for the return URL
    const host = request.headers.get('host') || 'localhost:3000';
    const proto = request.headers.get('x-forwarded-proto') || (host.startsWith('localhost') ? 'http' : 'https');
    const origin = process.env.NEXT_PUBLIC_APP_URL || `${proto}://${host}`;

    const returnUrl = `${origin}/checkout/success?hero_id=${encodeURIComponent(hero.id)}`;
    const bidderUsername = (username && username.trim()) || 'fan';
    const email = (customerEmail && customerEmail.trim()) || `${bidderUsername.toLowerCase().replace(/[^a-z0-9]/g, '') || 'fan'}@bidstar.in`;

    // Create Dodo Checkout Session with Pay-What-You-Want amount in paise (₹1 = 100 paise)
    const amountInPaise = Math.round(numAmount * 100);

    // 3. Outbound Retry with Exponential Backoff + Full Jitter & 8s Bound
    let session: { session_id: string; checkout_url?: string | null } | null = null;
    let lastError: unknown = null;
    const maxRetries = 2;

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        session = await dodoClient.checkoutSessions.create({
          product_cart: [
            {
              product_id: DODO_PRODUCT_ID,
              quantity: 1,
              amount: amountInPaise,
            },
          ],
          customer: {
            email,
            name: bidderUsername,
          },
          billing_address: {
            country: 'IN',
            state: 'Telangana',
            city: 'Hyderabad',
            street: 'Film Nagar',
            zipcode: '500096',
          },
          minimal_address: true,
          feature_flags: {
            allow_phone_number_collection: false,
            require_phone_number: false,
            allow_tax_id: false,
            allow_currency_selection: false,
          },
          metadata: {
            hero_id: hero.id,
            hero_name: hero.name,
            user_id: userId || 'anon-user',
            username: bidderUsername,
            amount_inr: String(numAmount),
            note: note || '',
            idempotency_key: cleanIdempotencyKey || traceId,
          },
          return_url: returnUrl,
        });
        break; // Succeeded
      } catch (err: unknown) {
        lastError = err;
        const errObj = err as { status?: number; name?: string; code?: string };
        const isTransient = (errObj.status && errObj.status >= 500) || errObj.name === 'TimeoutError' || errObj.code === 'ECONNRESET';

        if (attempt < maxRetries && isTransient) {
          // Exponential backoff + full jitter: random(0, 250 * 2^attempt)
          const delayMs = Math.floor(Math.random() * (250 * Math.pow(2, attempt + 1)));
          await new Promise((resolve) => setTimeout(resolve, delayMs));
          continue;
        }
        break;
      }
    }

    if (!session || !session.checkout_url) {
      const errorMsg = lastError instanceof Error ? lastError.message : 'Unknown gateway error';
      return apiError(
        'PAYMENT_GATEWAY_ERROR',
        `Dodo Payments Gateway could not generate a checkout link: ${errorMsg}`,
        502,
        'The payment gateway is temporarily unreachable or busy. Please retry in a few seconds.',
        undefined,
        traceId
      );
    }

    // 4. Record pending checkout session in MongoDB database with idempotencyKey
    await db.recordCheckoutSession({
      sessionId: session.session_id,
      heroId: hero.id,
      heroName: hero.name,
      userId: userId || 'anon-user',
      username: bidderUsername,
      userAvatar: userAvatar || undefined,
      amount: numAmount,
      note: note || undefined,
      customerEmail: email,
      idempotencyKey: cleanIdempotencyKey || undefined,
      checkoutUrl: session.checkout_url,
    });

    return apiSuccess(
      {
        sessionId: session.session_id,
        checkoutUrl: session.checkout_url,
        amount: numAmount,
        heroId: hero.id,
        heroName: hero.name,
      },
      { traceId },
      200
    );
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown server error during checkout initiation';
    return apiError(
      'INTERNAL_ERROR',
      message,
      500,
      'An unexpected error occurred while setting up your checkout session. Your account has not been charged.',
      undefined,
      traceId
    );
  }
}
