import { NextResponse } from 'next/server';
import { getMongoClient } from '@/server/mongodb';
import { generateTraceId } from '@/server/errors';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const traceId = generateTraceId(request.headers.get('x-trace-id'));
  const startTime = Date.now();

  try {
    const client = await getMongoClient();
    const pingStart = Date.now();
    await client.db('admin').command({ ping: 1 });
    const latencyMs = Date.now() - pingStart;
    const durationMs = Date.now() - startTime;

    const response = {
      status: 'healthy',
      uptime: process.uptime(),
      durationMs,
      timestamp: new Date().toISOString(),
      trace_id: traceId,
      dependencies: {
        mongodb: {
          status: 'connected',
          latencyMs,
        },
      },
    };

    return NextResponse.json(response, {
      status: 200,
      headers: {
        'X-Trace-Id': traceId,
        'Cache-Control': 'no-store, no-cache, must-revalidate',
      },
    });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Unknown database error';
    const response = {
      status: 'degraded',
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
      trace_id: traceId,
      dependencies: {
        mongodb: {
          status: 'disconnected',
          error: errorMsg,
        },
      },
    };

    return NextResponse.json(response, {
      status: 503,
      headers: {
        'X-Trace-Id': traceId,
        'Cache-Control': 'no-store, no-cache, must-revalidate',
      },
    });
  }
}
