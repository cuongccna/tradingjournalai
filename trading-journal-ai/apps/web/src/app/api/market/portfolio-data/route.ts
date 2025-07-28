import { NextRequest, NextResponse } from 'next/server';

// Force dynamic rendering for this API route
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const userId = searchParams.get('userId') || 'demo-user';
    const symbols = searchParams.get('symbols') || 'GOOGL,BTC,FPT';

    console.log('Frontend API Route: Proxying to backend:', { userId, symbols });

    // Forward request to backend server
    const backendUrl = `http://localhost:3002/api/market/portfolio-data?userId=${encodeURIComponent(userId)}&symbols=${symbols}`;
    
    const response = await fetch(backendUrl);
    const data = await response.json();

    console.log('Frontend API Route: Backend response received');

    return NextResponse.json(data);
  } catch (error) {
    console.error('Frontend API Route Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch market data' },
      { status: 500 }
    );
  }
}
