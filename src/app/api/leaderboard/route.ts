import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/server/db';
import { Region, Industry, TimeWindow } from '@/types';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const region = (searchParams.get('region') as Region) || 'All';
    const industry = (searchParams.get('industry') as Industry) || 'All';
    const timeWindow = (searchParams.get('timeWindow') as TimeWindow) || 'all-time';

    const heroes = db.getHeroes({ region, industry, timeWindow });
    const supporters = db.getGlobalTopSupporters();

    return NextResponse.json({
      success: true,
      data: {
        heroes,
        supporters,
        timeWindow,
        region,
        industry,
      },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Internal Server Error';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
