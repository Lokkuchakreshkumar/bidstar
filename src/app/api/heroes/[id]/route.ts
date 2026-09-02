import { NextRequest } from 'next/server';
import { db } from '@/server/db';
import { apiSuccess, apiError } from '@/server/errors';

export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const hero = await db.getHeroById(id);
    if (!hero) {
      return apiError('NOT_FOUND', `Hero with id '${id}' not found`, 404);
    }

    const recentBids = await db.getBids(id, 20);
    return apiSuccess({ hero, recentBids });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Internal Server Error';
    return apiError('INTERNAL_ERROR', message, 500);
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const updated = await db.updateHero(id, body);
    return apiSuccess(updated, { message: `Hero ${updated.name} updated successfully` });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Internal Server Error';
    return apiError('INTERNAL_ERROR', message, 400);
  }
}
