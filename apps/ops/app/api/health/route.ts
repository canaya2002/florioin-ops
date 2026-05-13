import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export function GET() {
  return NextResponse.json({
    status: 'ok',
    service: 'florioin-ops',
    phase: 1,
    mock: process.env.USE_MOCK_DATA === 'true',
    timestamp: new Date().toISOString(),
  });
}
