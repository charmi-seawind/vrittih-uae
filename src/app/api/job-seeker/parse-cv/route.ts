import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/job-seeker/parse-cv`, {
      method: 'POST',
      body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { success: false, message: data.message || 'Failed to parse CV' },
        { status: response.status }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'CV parsed successfully',
      data
    });

  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
