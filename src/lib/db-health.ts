/**
 * Database Health Check Utility
 * 
 * Provides functions to test database connectivity and measure latency.
 * Useful for health check endpoints and debugging connection issues.
 */

import { db } from './prisma';

export interface DatabaseHealthResult {
  success: boolean;
  message: string;
  timestamp: string;
  latency?: number;
  error?: string;
}

/**
 * Check database connection by performing a simple query
 * 
 * @returns Promise with health check result including success status, message, and latency
 */
export async function checkDatabaseConnection(): Promise<DatabaseHealthResult> {
  const startTime = Date.now();
  const timestamp = new Date().toISOString();

  try {
    // Perform a simple query to test connection
    await db.$queryRaw`SELECT 1`;
    
    const latency = Date.now() - startTime;

    return {
      success: true,
      message: 'Database connection successful',
      timestamp,
      latency,
    };
  } catch (error) {
    const latency = Date.now() - startTime;
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';

    // Log detailed error for debugging
    console.error('Database health check failed:', {
      error: errorMessage,
      timestamp,
      latency,
      stack: error instanceof Error ? error.stack : undefined,
    });

    return {
      success: false,
      message: 'Database connection failed',
      timestamp,
      latency,
      error: errorMessage,
    };
  }
}
