import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/server/db';
import { dodoClient } from '@/lib/dodo';
import { generateTraceId } from '@/server/errors';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  const traceId = generateTraceId(request.headers.get('x-trace-id'));

  try {
    const rawBody = await request.text();
    const webhookId = request.headers.get('webhook-id') || '';
    const webhookSignature = request.headers.get('webhook-signature') || '';
    const webhookTimestamp = request.headers.get('webhook-timestamp') || '';

    // 1. Replay Attack Prevention (Check timestamp freshness: max 5 minutes)
    if (webhookTimestamp) {
      const eventTimeSec = Number(webhookTimestamp);
      const currentTimeSec = Math.floor(Date.now() / 1000);
      if (!isNaN(eventTimeSec) && Math.abs(currentTimeSec - eventTimeSec) > 300) {
        console.warn(`[${traceId}] Webhook rejected due to stale timestamp:`, webhookTimestamp);
        return NextResponse.json(
          { error: 'Stale webhook timestamp', trace_id: traceId },
          { status: 400, headers: { 'X-Trace-Id': traceId } }
        );
      }
    }

    const webhookSecret = process.env.DODO_PAYMENTS_WEBHOOK_KEY;
    const isWebhookConfigured = webhookSecret && !webhookSecret.startsWith('whsec_replace');

    interface WebhookPayload {
      type?: string;
      data?: {
        payment_id?: string;
        total_amount?: number;
        status?: string;
        currency?: string;
        customer?: {
          name?: string;
          email?: string;
        };
        metadata?: {
          hero_id?: string;
          username?: string;
          user_id?: string;
          amount_inr?: string;
          note?: string;
          session_id?: string;
        };
      };
    }

    let event: WebhookPayload | null = null;

    // 2. Cryptographic Signature Verification
    if (isWebhookConfigured && webhookSignature) {
      try {
        event = dodoClient.webhooks.unwrap(rawBody, {
          headers: {
            'webhook-id': webhookId,
            'webhook-signature': webhookSignature,
            'webhook-timestamp': webhookTimestamp,
          },
        }) as WebhookPayload;
      } catch (err) {
        console.error(`[${traceId}] Webhook signature verification failed:`, err);
        return NextResponse.json(
          { error: 'Invalid webhook signature', trace_id: traceId },
          { status: 401, headers: { 'X-Trace-Id': traceId } }
        );
      }
    } else {
      try {
        event = JSON.parse(rawBody) as WebhookPayload;
      } catch {
        return NextResponse.json(
          { error: 'Invalid JSON payload', trace_id: traceId },
          { status: 400, headers: { 'X-Trace-Id': traceId } }
        );
      }
    }

    if (!event || !event.type) {
      return NextResponse.json(
        { error: 'Malformed webhook event', trace_id: traceId },
        { status: 400, headers: { 'X-Trace-Id': traceId } }
      );
    }

    // 3. Deduplication via MongoDB Webhook Events Collection
    const eventIdentifier = webhookId || event.data?.payment_id || `evt-${Date.now()}`;
    const isNew = await db.recordWebhookEvent(eventIdentifier, event.type, rawBody);
    if (!isNew) {
      return NextResponse.json(
        { received: true, duplicate: true, trace_id: traceId },
        { status: 200, headers: { 'X-Trace-Id': traceId } }
      );
    }

    // 4. State Machine & ACID Fulfillment
    if (event.type === 'payment.succeeded') {
      const paymentData = event.data as Record<string, unknown> | undefined;
      const paymentId = paymentData?.payment_id as string | undefined;
      const metadata = (paymentData?.metadata || {}) as Record<string, unknown>;
      const heroId = metadata.hero_id as string | undefined;
      const username = (metadata.username || (paymentData?.customer as Record<string, unknown>)?.name || 'fan') as string;
      const userId = (metadata.user_id || 'anon-user') as string;
      const note = (metadata.note || '') as string;
      const customerEmail = ((paymentData?.customer as Record<string, unknown>)?.email) as string | undefined;

      // Amount in paise -> INR
      const amount = metadata.amount_inr
        ? Number(metadata.amount_inr)
        : Math.round(Number(paymentData?.total_amount || 0) / 100);

      const checkoutSessionId = (paymentData?.checkout_session_id || metadata.session_id) as string | undefined;

      if (paymentId && heroId && amount > 0) {
        await db.fulfillByPaymentId(paymentId, {
          heroId,
          amount,
          sessionId: checkoutSessionId,
          userId,
          username,
          note,
          customerEmail,
        });
      }
    }

    return NextResponse.json(
      { received: true, trace_id: traceId },
      { status: 200, headers: { 'X-Trace-Id': traceId } }
    );
  } catch (error: unknown) {
    console.error(`[${traceId}] Webhook processing error:`, error);
    const message = error instanceof Error ? error.message : 'Internal Server Error';
    return NextResponse.json(
      { error: message, trace_id: traceId },
      { status: 500, headers: { 'X-Trace-Id': traceId } }
    );
  }
}
