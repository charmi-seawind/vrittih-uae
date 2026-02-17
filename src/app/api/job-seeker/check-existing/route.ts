import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Forward to backend API
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/job-seeker/check-existing`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { success: false, message: data.message || 'Failed to check existing user' },
        { status: response.status }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'User validation successful',
      data
    });

  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}