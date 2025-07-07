import { db } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Test database connection
    await db.$connect();
    
    // Try a simple query
    const userCount = await db.user.count();
    
    return NextResponse.json({
      status: "success",
      message: "Database connection successful",
      userCount,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error("Database connection error:", error);
    return NextResponse.json({
      status: "error",
      message: error instanceof Error ? error.message : "Unknown error",
      timestamp: new Date().toISOString()
    }, { status: 500 });
  } finally {
    await db.$disconnect();
  }
} 