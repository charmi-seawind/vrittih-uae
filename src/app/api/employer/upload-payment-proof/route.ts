import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/local-payment/upload-proof`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const text = await response.text();
      let errorMessage = 'Failed to upload payment proof';
      try {
        const data = JSON.parse(text);
        errorMessage = data.message || errorMessage;
      } catch (e) {}
      return NextResponse.json(
        { message: errorMessage },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
