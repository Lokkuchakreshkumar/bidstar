import { NextResponse } from 'next/server';
import crypto from 'crypto';

export type ErrorCode =
  | 'DB_CONNECTION_ERROR'
  | 'DB_TRANSACTION_FAILED'
  | 'NOT_FOUND'
  | 'VALIDATION_ERROR'
  | 'PAYMENT_ERROR'
  | 'PAYMENT_GATEWAY_ERROR'
  | 'RATE_LIMITED'
  | 'CIRCUIT_BREAKER_OPEN'
  | 'IDEMPOTENCY_CONFLICT'
  | 'DUPLICATE_WEBHOOK'
  | 'UNAUTHORIZED'
  | 'BAD_REQUEST'
  | 'INTERNAL_ERROR';

export interface ApiErrorResponse {
  success: false;
  error: {
    code: ErrorCode;
    message: string;
    trace_id: string;
    details?: unknown;
  };
  fallback: string;
  timestamp: string;
}

export interface ApiSuccessResponse<T> {
  success: true;
  data: T;
  trace_id: string;
  count?: number;
  message?: string;
  timestamp: string;
}

const FALLBACK_MESSAGES: Record<ErrorCode, string> = {
  DB_CONNECTION_ERROR: 'Unable to connect to the database. Leaderboard data may be temporarily cached.',
  DB_TRANSACTION_FAILED: 'ACID transaction failed. Your funds and rank have been preserved without changes.',
  NOT_FOUND: 'The requested hero, bid, or record was not found.',
  VALIDATION_ERROR: 'Invalid parameters provided. Please check the inputs.',
  PAYMENT_ERROR: 'Payment verification failed. No changes were applied.',
  PAYMENT_GATEWAY_ERROR: 'Payment provider is experiencing temporary latency. Please retry shortly.',
  RATE_LIMITED: 'Too many requests submitted. Please pause briefly before retrying.',
  CIRCUIT_BREAKER_OPEN: 'Service dependency temporarily protected. Please try again in 30 seconds.',
  IDEMPOTENCY_CONFLICT: 'A concurrent or prior request with this key is already being processed.',
  DUPLICATE_WEBHOOK: 'Event has already been processed idempotently.',
  UNAUTHORIZED: 'You do not have permission to execute this operation.',
  BAD_REQUEST: 'The request could not be processed as formed.',
  INTERNAL_ERROR: 'An unexpected server condition occurred. Please try again in a few moments.',
};

export function generateTraceId(existingTraceId?: string | null): string {
  if (existingTraceId && existingTraceId.trim()) {
    return existingTraceId.trim();
  }
  return `trace_${crypto.randomBytes(8).toString('hex')}`;
}

export function apiSuccess<T>(
  data: T, 
  extra?: { count?: number; message?: string; traceId?: string }, 
  status = 200,
  customHeaders?: Record<string, string>
) {
  const traceId = generateTraceId(extra?.traceId);
  const responsePayload: ApiSuccessResponse<T> = {
    success: true,
    data,
    trace_id: traceId,
    ...(extra?.count !== undefined && { count: extra.count }),
    ...(extra?.message && { message: extra.message }),
    timestamp: new Date().toISOString(),
  };

  const headers = new Headers(customHeaders);
  headers.set('X-Trace-Id', traceId);

  return NextResponse.json(responsePayload, { 
    status,
    headers,
  });
}

export function apiError(
  code: ErrorCode,
  message: string,
  status = 400,
  fallbackMessage?: string,
  details?: unknown,
  traceIdInput?: string | null,
  customHeaders?: Record<string, string>
) {
  const traceId = generateTraceId(traceIdInput);
  const responsePayload: ApiErrorResponse = {
    success: false,
    error: {
      code,
      message,
      trace_id: traceId,
      ...(details !== undefined && { details }),
    },
    fallback: fallbackMessage || FALLBACK_MESSAGES[code] || 'Action could not be completed safely.',
    timestamp: new Date().toISOString(),
  };

  const headers = new Headers(customHeaders);
  headers.set('X-Trace-Id', traceId);

  return NextResponse.json(responsePayload, { 
    status,
    headers,
  });
}
