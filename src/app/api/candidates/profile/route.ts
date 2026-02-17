import { NextRequest, NextResponse } from 'next/server';
// import jwt from 'jsonwebtoken';
const jwt = { decode: (token: string) => ({ id: 'mock-user-id' }) };

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || `${API_CONFIG.BASE_URL}`;

function getUserIdFromToken(request: NextRequest) {
  const token = request.headers.get('authorization')?.replace('Bearer ', '');
  if (!token) throw new Error('No token provided');
  
  try {
    const decoded = jwt.decode(token) as any;
    return decoded?.id || decoded?.userId;
  } catch {
    throw new Error('Invalid token');
  }
}

export async function GET(request: NextRequest) {
  try {
    const userId = getUserIdFromToken(request);
    const token = request.headers.get('authorization');
    
    const response = await fetch(`${API_BASE_URL}/api/candidates/profile`, {
      headers: {
        'Authorization': token || '',
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      return NextResponse.json(
        { error: 'Failed to fetch profile' },
        { status: response.status }
      );
    }
    
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: 'Authentication failed' },
      { status: 401 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const userId = getUserIdFromToken(request);
    const token = request.headers.get('authorization');
    const body = await request.json();
    
    const response = await fetch(`${API_BASE_URL}/api/candidates/profile`, {
      method: 'PUT',
      headers: {
        'Authorization': token || '',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
    
    if (!response.ok) {
      return NextResponse.json(
        { error: 'Failed to update profile' },
        { status: response.status }
      );
    }
    
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: 'Authentication failed' },
      { status: 401 }
    );
  }
}