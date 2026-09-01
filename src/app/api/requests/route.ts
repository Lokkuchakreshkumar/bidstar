import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/server/db';
import { Region, Industry } from '@/types';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const requests = db.getRequests();
    return NextResponse.json({ success: true, count: requests.length, data: requests });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Internal Server Error';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, region, industry, reason, requestedBy } = body;

    if (!name) {
      return NextResponse.json({ success: false, error: 'Hero name is required' }, { status: 400 });
    }

    const newReq = db.createRequest({
      name,
      region: (region as 'South' | 'North') || 'South',
      industry: (industry as Industry) || 'Telugu',
      reason,
      requestedBy: requestedBy || 'fandom_fan',
    });

    return NextResponse.json({ success: true, data: newReq }, { status: 201 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Internal Server Error';
    return NextResponse.json({ success: false, error: message }, { status: 400 });
  }
}
