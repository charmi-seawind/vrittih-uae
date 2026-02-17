import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const jobId = params.id;
    
    // Make request to your backend API
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "https://api.vrrittih.com";
    const response = await fetch(`${backendUrl}/api/jobs/${jobId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: "Job not found" },
        { status: 404 }
      );
    }

    const jobData = await response.json();
    return NextResponse.json(jobData);
    
  } catch (error) {
    console.error("Error fetching job:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}