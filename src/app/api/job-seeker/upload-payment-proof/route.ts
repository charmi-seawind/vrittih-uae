import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();

    
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/local-payment/upload-proof`, {
      method: 'POST',
      body: formData,
    });

    const text = await response.text();

    const data = JSON.parse(text);

    if (!response.ok) {
      return NextResponse.json(
        { message: data.message || 'Failed to upload payment proof' },
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
