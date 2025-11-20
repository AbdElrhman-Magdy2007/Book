/**
 * Prisma Client Configuration
 * 
 * Optimized for Next.js serverless functions with the following features:
 * - Singleton pattern to prevent multiple instances in development
 * - Lazy connection (connects on first query, not on import)
 * - Environment-based logging (verbose in dev, errors only in production)
 * - Proper connection pooling for serverless environments
 */

import { PrismaClient } from '@prisma/client';

// Declare global variable to store Prisma instance across hot reloads in development
declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

/**
 * Creates a new PrismaClient instance with optimized configuration
 * 
 * Why lazy connection?
 * - Serverless functions should connect on-demand, not eagerly
 * - Reduces cold start time
 * - Prisma automatically manages connection lifecycle
 */
const prismaClientSingleton = () => {
  return new PrismaClient({
    // Environment-based logging: detailed in dev, minimal in production
    log: process.env.NODE_ENV === 'development' 
      ? ['query', 'error', 'warn'] 
      : ['error'],
  });
};

/**
 * Global Prisma instance
 * 
 * In development: reuse the same instance across hot reloads
 * In production: create a new instance for each serverless function invocation
 */
export const db: PrismaClient = globalThis.prisma ?? prismaClientSingleton();

// Store instance globally in development to prevent multiple instances
if (process.env.NODE_ENV !== 'production') {
  globalThis.prisma = db;
}

export default db;