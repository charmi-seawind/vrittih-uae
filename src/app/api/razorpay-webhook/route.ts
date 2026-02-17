import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = request.headers.get('x-razorpay-signature');

    // Verify webhook signature
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_WEBHOOK_SECRET!)
      .update(body)
      .digest('hex');

    if (signature !== expectedSignature) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }

    const event = JSON.parse(body);
    
    // Handle subscription charged event (auto-renewal)
    if (event.event === 'subscription.charged') {
      const subscription = event.payload.subscription.entity;
      const payment = event.payload.payment.entity;
      
      // Extend user subscription
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/subscription/renew`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subscriptionId: subscription.id,
          paymentId: payment.id,
          amount: payment.amount / 100,
          renewalDate: new Date()
        })
      });
    }

    // Handle subscription cancelled/failed events
    if (event.event === 'subscription.cancelled' || event.event === 'subscription.halted') {
      const subscription = event.payload.subscription.entity;
      
      // Deactivate user subscription
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/subscription/deactivate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subscriptionId: subscription.id
        })
      });
    }

    return NextResponse.json({ status: 'ok' });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json({ error: 'Webhook failed' }, { status: 500 });
  }
}