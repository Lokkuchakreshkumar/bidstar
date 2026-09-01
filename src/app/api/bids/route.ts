import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/server/db';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const heroId = searchParams.get('heroId') || undefined;
    const limit = parseInt(searchParams.get('limit') || '50', 10);

    const bids = db.getBids(heroId, limit);
    return NextResponse.json({ success: true, count: bids.length, data: bids });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Internal Server Error';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { heroId, amount, userId, username, userAvatar, note } = body;

    if (!heroId || !amount || amount <= 0) {
      return NextResponse.json(
        { success: false, error: 'Invalid bid payload: heroId and positive amount are required' },
        { status: 400 }
      );
    }

    const result = db.createBid({
      heroId,
      amount: Number(amount),
      userId: userId || 'anon-user',
      username: username || 'fan_supporter',
      userAvatar,
      note,
    });

    return NextResponse.json({
      success: true,
      message: 'Bid successfully processed and applied to leaderboard',
      data: result,
    }, { status: 201 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Internal Server Error';
    return NextResponse.json({ success: false, error: message }, { status: 400 });
  }
}
