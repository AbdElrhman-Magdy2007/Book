import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function GET(request: Request) {
  try {
    // Check if NEXTAUTH_SECRET is set
    if (!process.env.NEXTAUTH_SECRET) {
      return NextResponse.json({
        status: "error",
        message: "NEXTAUTH_SECRET is not configured",
        timestamp: new Date().toISOString()
      }, { status: 500 });
    }

    // Check if NEXTAUTH_URL is set
    if (!process.env.NEXTAUTH_URL) {
      return NextResponse.json({
        status: "error",
        message: "NEXTAUTH_URL is not configured",
        timestamp: new Date().toISOString()
      }, { status: 500 });
    }

    // Try to get the token to verify JWT functionality
    const token = await getToken({ req: request as any });
    
    return NextResponse.json({
      status: "success",
      message: "Auth configuration is valid",
      hasSecret: !!process.env.NEXTAUTH_SECRET,
      secretLength: process.env.NEXTAUTH_SECRET?.length,
      nextAuthUrl: process.env.NEXTAUTH_URL,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error("Auth verification error:", error);
    return NextResponse.json({
      status: "error",
      message: error instanceof Error ? error.message : "Unknown error",
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
} 