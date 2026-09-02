import { NextRequest } from 'next/server';
import { db } from '@/server/db';
import { Industry } from '@/types';
import { apiSuccess, apiError, generateTraceId } from '@/server/errors';
import { rateLimiter, getClientIp } from '@/lib/rate-limiter';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const traceId = generateTraceId(request.headers.get('x-trace-id'));
  try {
    const requests = await db.getRequests();
    return apiSuccess(requests, { count: requests.length, traceId });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Internal Server Error';
    return apiError('DB_CONNECTION_ERROR', message, 500, undefined, undefined, traceId);
  }
}

export async function POST(request: NextRequest) {
  const traceId = generateTraceId(request.headers.get('x-trace-id'));
  const clientIp = getClientIp(request);

  // Rate limit: max 3 suggestions per minute per IP
  const rl = rateLimiter.check(`requests:${clientIp}`, 3, 60000);
  if (!rl.allowed) {
    return apiError(
      'RATE_LIMITED',
      'You are submitting hero suggestions too quickly. Please pause for a moment.',
      429,
      `Please wait ${rl.resetSeconds} seconds before submitting another suggestion.`,
      { retryAfterSeconds: rl.resetSeconds },
      traceId,
      { 'Retry-After': String(rl.resetSeconds) }
    );
  }

  try {
    const body = await request.json();
    const { name, region, industry, reason, requestedBy } = body;

    if (!name || !name.trim()) {
      return apiError('VALIDATION_ERROR', 'Hero name is required', 400, undefined, undefined, traceId);
    }

    const newReq = await db.createRequest({
      name: name.trim(),
      region: (region as 'South' | 'North') || 'South',
      industry: (industry as Industry) || 'Telugu',
      reason: reason ? reason.trim() : undefined,
      requestedBy: requestedBy ? requestedBy.trim() : 'fandom_fan',
    });

    return apiSuccess(newReq, { message: 'Hero suggestion submitted successfully', traceId }, 201);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Internal Server Error';
    return apiError('INTERNAL_ERROR', message, 400, undefined, undefined, traceId);
  }
}
