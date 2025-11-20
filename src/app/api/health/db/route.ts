/**
 * Database Health Check API Endpoint
 * 
 * GET /api/health/db
 * 
 * Returns the current database connection status, latency, and timestamp.
 * Useful for monitoring and debugging database connectivity issues.
 */

import { NextResponse } from 'next/server';
import { checkDatabaseConnection } from '@/lib/db-health';

export async function GET() {
  try {
    const healthResult = await checkDatabaseConnection();

    if (healthResult.success) {
      return NextResponse.json(
        {
          status: 'healthy',
          latency: healthResult.latency,
          timestamp: healthResult.timestamp,
        },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        {
          status: 'unhealthy',
          error: healthResult.error,
          latency: healthResult.latency,
          timestamp: healthResult.timestamp,
        },
        { status: 503 }
      );
    }
  } catch (error) {
    console.error('Health check endpoint error:', {
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString(),
    });

    return NextResponse.json(
      {
        status: 'error',
        error: 'Failed to perform health check',
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
