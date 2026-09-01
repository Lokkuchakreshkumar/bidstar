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
    const search = searchParams.get('search') || undefined;
    const sortBy = searchParams.get('sortBy') || undefined;

    const heroes = db.getHeroes({ region, industry, timeWindow, search, sortBy });
    return NextResponse.json({ success: true, count: heroes.length, data: heroes });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Internal Server Error';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const newHero = db.createHero(body);
    return NextResponse.json({ success: true, data: newHero }, { status: 201 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Internal Server Error';
    return NextResponse.json({ success: false, error: message }, { status: 400 });
  }
}
