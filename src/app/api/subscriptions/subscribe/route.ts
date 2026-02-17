import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { plan_id, payment_id } = body;
    
    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
      return NextResponse.json(
        { success: false, message: 'Authorization required' },
        { status: 401 }
      );
    }

    if (!plan_id || !payment_id) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Use existing complete-payment endpoint for upgrades
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/job-seeker/upgrade-subscription`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authHeader,
      },
      body: JSON.stringify({
        planId: plan_id,
        paymentId: payment_id
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { success: false, message: data.message || 'Upgrade failed' },
        { status: response.status }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Plan upgraded successfully',
      data
    });

  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}