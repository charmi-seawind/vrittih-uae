import { NextRequest, NextResponse } from 'next/server';
import Razorpay from 'razorpay';

const razorpay = new Razorpay({
  key_id:"rzp_live_RrtsJrVleUY6RP",
  key_secret: "OjuR07BMvtt0IzPbnjQH9peY",
});

// Map database plan IDs to Razorpay plan IDs
const getPlanMapping = (planId: string, amount: number) => {
  // Basic Plan - ₹99 monthly
  if (amount === 99) {
    return 'plan_Rru8GDqdLLX3U5';
  }
  // Enterprise Plan - ₹999 quarterly  
  if (amount === 999) {
    return 'plan_Rru8VYUZERtbYG';
  }
  // Fallback - create order instead of subscription
  return null;
};

export async function POST(request: NextRequest) {
  try {
    const { amount, planId, pendingUserId } = await request.json();
    
    // Create order for immediate payment (simplified without subscriptions)
    const order = await razorpay.orders.create({
      amount: amount * 100,
      currency: 'INR',
      receipt: `ord_${Date.now().toString().slice(-8)}`,
      notes: {
        planId,
        pendingUserId
      },
    });

    return NextResponse.json({ 
      orderId: order.id,
      amount: order.amount
    });
  } catch (error) {
    console.error('Razorpay order creation failed:', error);
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
  }
}