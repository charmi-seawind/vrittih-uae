import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { pendingUserId, paymentId, planId, ...otherFields } = body;

    if (!pendingUserId || !paymentId || !planId) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Ensure required fields have default values
    const requestData = {
      pendingUserId,
      paymentId,
      planId,
      industry: body.industry && body.industry.trim() !== '' ? body.industry : 'Technology',
      company_size: (body.company_size || '1-10').replace(' employees', ''),
      location: body.location || 'India',
      website: body.website || '',
      description: body.description || '',
      founded_year: body.founded_year || new Date().getFullYear(),
      phone: body.phone || '',
      address: body.address || ''
    };


    // Forward to backend API
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/employer/complete-payment`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestData),
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