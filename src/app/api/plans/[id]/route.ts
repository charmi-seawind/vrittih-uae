import { NextRequest, NextResponse } from 'next/server';

type Params = {
  params: Promise<{ id: string }>;
};

export async function GET(request: NextRequest, context: Params) {
  try {
    const { id } = await context.params;
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/plans/id/${id}`);
    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { message: data.message || 'Failed to fetch plan' },
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch (error: any) {
    console.error('Plan fetch error:', error);
    return NextResponse.json(
      { message: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
