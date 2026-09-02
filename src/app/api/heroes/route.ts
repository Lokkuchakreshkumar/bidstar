import { NextRequest } from 'next/server';
import { db } from '@/server/db';
import { Region, Industry, TimeWindow } from '@/types';
import { apiSuccess, apiError } from '@/server/errors';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const region = (searchParams.get('region') as Region) || 'All';
    const industry = (searchParams.get('industry') as Industry) || 'All';
    const timeWindow = (searchParams.get('timeWindow') as TimeWindow) || 'all-time';
    const search = searchParams.get('search') || undefined;
    const sortBy = searchParams.get('sortBy') || undefined;

    const heroes = await db.getHeroes({ region, industry, timeWindow, search, sortBy });
    return apiSuccess(heroes, { count: heroes.length });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to retrieve heroes';
    return apiError(
      'DB_CONNECTION_ERROR',
      message,
      500,
      'Could not connect to MongoDB cluster to retrieve heroes.'
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    if (!body.name || !body.name.trim()) {
      return apiError('VALIDATION_ERROR', 'Hero name is required', 400);
    }
    const newHero = await db.createHero(body);
    return apiSuccess(newHero, { message: `Hero ${newHero.name} created successfully` }, 201);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to create hero';
    return apiError('INTERNAL_ERROR', message, 400, 'Unable to create hero record in database.');
  }
}
