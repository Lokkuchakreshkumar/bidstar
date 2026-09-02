import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/server/db';
import { apiSuccess, apiError, generateTraceId } from '@/server/errors';
import { rateLimiter, getClientIp } from '@/lib/rate-limiter';
import crypto from 'crypto';

export const dynamic = 'force-dynamic';

// In-memory token store for active admin sessions (backed by secret hash)
const ADMIN_SESSION_SECRET = process.env.ADMIN_SESSION_SECRET || 'bidstar_admin_sec_2026_super_key';

function createSessionToken(): string {
  const ts = Date.now();
  const rand = crypto.randomBytes(16).toString('hex');
  const signature = crypto
    .createHmac('sha256', ADMIN_SESSION_SECRET)
    .update(`${ts}:${rand}`)
    .digest('hex');
  return `bida_${ts}_${rand}_${signature}`;
}

function verifySessionToken(token?: string | null): boolean {
  if (!token || !token.startsWith('bida_')) return false;
  const parts = token.split('_');
  if (parts.length !== 4) return false;
  const [, tsStr, rand, signature] = parts;
  const ts = Number(tsStr);
  if (isNaN(ts) || Date.now() - ts > 24 * 60 * 60 * 1000) {
    // Expired after 24 hours
    return false;
  }
  const expectedSig = crypto
    .createHmac('sha256', ADMIN_SESSION_SECRET)
    .update(`${ts}:${rand}`)
    .digest('hex');
  return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSig));
}

export async function POST(request: NextRequest) {
  const traceId = generateTraceId(request.headers.get('x-trace-id'));
  const clientIp = getClientIp(request);

  // Rate limit password attempts: max 10 tries per 5 minutes to prevent brute force
  const rl = rateLimiter.check(`admin_auth:${clientIp}`, 10, 300000);
  if (!rl.allowed) {
    return apiError(
      'RATE_LIMITED',
      'Too many failed admin login attempts. Please wait 5 minutes.',
      429,
      undefined,
      { retryAfter: rl.resetSeconds },
      traceId
    );
  }

  try {
    const body = await request.json();
    const { password, action } = body;

    if (!password || typeof password !== 'string') {
      return apiError('VALIDATION_ERROR', 'Password is required', 400, undefined, undefined, traceId);
    }

    const isValid = await db.verifyAdminPassword(password.trim());
    if (!isValid) {
      return apiError(
        'UNAUTHORIZED',
        'Incorrect administrator password',
        401,
        'Please verify the password and try again.',
        undefined,
        traceId
      );
    }

    const token = createSessionToken();
    const response = NextResponse.json(
      {
        success: true,
        data: {
          authenticated: true,
          token,
          action: action || 'login',
        },
        message: 'Administrator authentication verified',
        trace_id: traceId,
        timestamp: new Date().toISOString(),
      },
      { status: 200 }
    );

    // Set HTTP-only session cookie
    response.cookies.set('bidstar_admin_session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 24 * 60 * 60, // 24 hours
    });

    return response;
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Internal Server Error';
    return apiError('INTERNAL_ERROR', message, 500, undefined, undefined, traceId);
  }
}

export async function GET(request: NextRequest) {
  const traceId = generateTraceId(request.headers.get('x-trace-id'));
  const cookieToken = request.cookies.get('bidstar_admin_session')?.value;
  const authHeader = request.headers.get('authorization')?.replace('Bearer ', '');
  const token = cookieToken || authHeader;

  const isAuthenticated = verifySessionToken(token);
  return apiSuccess(
    { authenticated: isAuthenticated },
    { traceId },
    200
  );
}

export async function DELETE() {
  const response = NextResponse.json(
    { success: true, message: 'Logged out of admin console' },
    { status: 200 }
  );
  response.cookies.delete('bidstar_admin_session');
  return response;
}
