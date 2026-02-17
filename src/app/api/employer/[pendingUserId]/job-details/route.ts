import { NextRequest, NextResponse } from 'next/server';

async function handleJobDetails(
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
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/employer/pending/${pendingUserId}/job-details`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { success: false, message: data.message || 'Failed to save job details' },
        { status: response.status }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Job details saved successfully',
      data
    });

  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ pendingUserId: string }> }
) {
  return handleJobDetails(request, { params });
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ pendingUserId: string }> }
) {
  return handleJobDetails(request, { params });
}