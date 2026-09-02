import { NextRequest } from 'next/server';
import { db } from '@/server/db';
import { apiSuccess, apiError, generateTraceId } from '@/server/errors';
import { rateLimiter, getClientIp } from '@/lib/rate-limiter';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  const traceId = generateTraceId(request.headers.get('x-trace-id'));
  const clientIp = getClientIp(request);

  // Rate limit admin actions: max 30 adjustments per minute
  const rl = rateLimiter.check(`admin_push:${clientIp}`, 30, 60000);
  if (!rl.allowed) {
    return apiError(
      'RATE_LIMITED',
      'Too many administrative adjustments attempted. Please slow down.',
      429,
      undefined,
      { retryAfter: rl.resetSeconds },
      traceId
    );
  }

  try {
    const body = await request.json();
    const { heroId, initialPushAmount, reason, updatedBy, adminKey } = body;

    if (!heroId || typeof heroId !== 'string') {
      return apiError('VALIDATION_ERROR', 'Valid heroId is required', 400, undefined, undefined, traceId);
    }

    const numPush = Number(initialPushAmount);
    if (isNaN(numPush) || numPush < 0) {
      return apiError(
        'VALIDATION_ERROR',
        'Initial push amount must be a non-negative number (0 or higher)',
        400,
        undefined,
        undefined,
        traceId
      );
    }

    // Password / Admin authorization check against database
    const sessionCookie = request.cookies.get('bidstar_admin_session')?.value;
    if (adminKey) {
      const isValid = await db.verifyAdminPassword(adminKey.trim());
      if (!isValid) {
        return apiError(
          'UNAUTHORIZED',
          'Invalid administrator password',
          401,
          'Please enter the correct admin password to apply adjustments.',
          undefined,
          traceId
        );
      }
    } else if (!sessionCookie) {
      // If neither key nor session cookie is present
      return apiError(
        'UNAUTHORIZED',
        'Administrator authorization required',
        401,
        'Please enter your admin password or log in to apply adjustments.',
        undefined,
        traceId
      );
    }

    const result = await db.updateHeroInitialPush({
      heroId,
      initialPushAmount: Math.round(numPush),
      reason: reason ? String(reason).trim() : 'Admin promotional adjustment',
      updatedBy: updatedBy ? String(updatedBy).trim() : 'Admin Console',
    });

    return apiSuccess(
      result,
      {
        message: `Successfully updated promotional initial push for ${result.hero.name} to ₹${result.hero.initialPushAmount}`,
        traceId,
      },
      200
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Internal Server Error';
    return apiError('INTERNAL_ERROR', message, 400, undefined, undefined, traceId);
  }
}
