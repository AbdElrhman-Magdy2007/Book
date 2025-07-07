// import { PrismaClient } from "@prisma/client";

// const globalForPrisma = global as unknown as { prisma?: PrismaClient };

// export const db = globalForPrisma.prisma || new PrismaClient();

// if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = db;

// export const prisma = new PrismaClient();

// src/lib/prisma.ts
import { PrismaClient } from '@prisma/client';

// Declare a global variable to prevent multiple PrismaClient instances
declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

// Use existing PrismaClient instance or create a new one
export const db: PrismaClient =
  globalThis.prisma ||
  new PrismaClient({
    log: ['query', 'info', 'warn', 'error'], // Enable logging for debugging
  });

if (process.env.NODE_ENV !== 'production') globalThis.prisma = db;

// Test the connection and handle errors
db.$connect()
  .then(() => console.log('✅ Prisma connected successfully'))
  .catch((error) => {
    console.error('❌ Prisma connection failed:', {
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString(),
    });
    // Throw the error to prevent silent failures
    throw error;
  });

export default db;


// // src/lib/prisma.ts
// import { PrismaClient } from "@prisma/client";

// const globalForPrisma = global as unknown as { prisma?: PrismaClient };

// export const db = globalForPrisma.prisma || new PrismaClient();

// if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = db;