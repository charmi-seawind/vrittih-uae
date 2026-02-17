import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ pendingUserId: string }> }
) {
  try {
    const { pendingUserId } = await params;

    if (!pendingUserId) {
      return NextResponse.json(
        { success: false, message: 'Pending user ID is required' },
        { status: 400 }
      );
    }

    // Forward to backend API
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/employer/${pendingUserId}/profile`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { success: false, message: data.message || 'Failed to fetch profile' },
        { status: response.status }
      );
    }

    return NextResponse.json(data);

  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ pendingUserId: string }> }
) {
  try {
    const { pendingUserId } = await params;
    const body = await request.json();

    if (!pendingUserId) {
      return NextResponse.json(
        { success: false, message: 'Pending user ID is required' },
        { status: 400 }
      );
    }

    // Forward to backend API
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/employer/${pendingUserId}/profile`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { success: false, message: data.message || 'Failed to update profile' },
        { status: response.status }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Profile updated successfully',
      data
    });

  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}