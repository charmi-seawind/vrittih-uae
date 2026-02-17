import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      razorpay_order_id, 
      razorpay_payment_id, 
      razorpay_signature, 
      pendingUserId, 
      planId,
      industry,
      company_size,
      location,
      website,
      description
    } = body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !pendingUserId || !planId) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Forward to backend API
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/employer/verify-razorpay-payment`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
        pendingUserId,
        planId,
        industry,
        company_size,
        location,
        website,
        description
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { success: false, message: data.message || 'Payment verification failed' },
        { status: response.status }
      );
    }

    return NextResponse.json({
      success: true,
      data: data,
      message: 'Payment verified successfully'
    });

  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}