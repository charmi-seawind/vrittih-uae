import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(request: NextRequest) {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, pendingUserId, planId, razorpay_subscription_id } = await request.json();

    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac("sha256","OjuR07BMvtt0IzPbnjQH9peY")
      .update(sign.toString())
      .digest("hex");

    if (razorpay_signature === expectedSign) {

      
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/job-seeker/complete-payment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pendingUserId,
          paymentId: razorpay_payment_id,
          planId,
          paymentMethod: 'razorpay',
          paymentVerified: true,
          subscriptionStatus: 'active',
          paymentStatus: 'completed',
          isRazorpayPayment: true,
          autoActivate: true,
          razorpaySubscriptionId: razorpay_subscription_id || null
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('Backend registration failed:', errorData);
        
        if (errorData.message?.includes('Pending user not found')) {
          return NextResponse.json({ 
            error: 'Session expired. Please start registration again.',
            code: 'SESSION_EXPIRED'
          }, { status: 400 });
        }
        
        return NextResponse.json({ 
          error: errorData.message || 'Registration failed'
        }, { status: response.status });
      }

      const result = await response.json();
      return NextResponse.json({ success: true, data: result.data });
    } else {
      return NextResponse.json({ error: 'Payment verification failed' }, { status: 400 });
    }
  } catch (error) {
    console.error('Payment verification failed:', error);
    return NextResponse.json({ error: 'Payment verification failed' }, { status: 500 });
  }
}