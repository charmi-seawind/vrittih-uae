import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { pendingUserId, paymentId, planId } = body;

    if (!pendingUserId || !paymentId || !planId) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Forward to backend API
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/job-seeker/complete-payment`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { success: false, message: data.message || 'Payment completion failed' },
        { status: response.status }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Payment completed successfully',
      data
    });

  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}