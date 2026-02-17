import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const pendingUserId = searchParams.get('pendingUserId');

    if (!pendingUserId) {
      return NextResponse.json({ 
        success: false, 
        message: 'Pending user ID is required' 
      }, { status: 400 });
    }

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/job-seeker/pending-user/${pendingUserId}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });

    const data = await response.json();
    if (!response.ok) {
      return NextResponse.json(data, { status: response.status });
    }

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ 
      success: false, 
      message: 'Internal server error' 
    }, { status: 500 });
  }
}