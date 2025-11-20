/**
 * Database Connection Test Script
 * 
 * Run this script to verify the database connection is working:
 * node test-db-connection.js
 */

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient({
  log: ['query', 'error', 'warn'],
});

async function testConnection() {
  console.log('🔍 Testing database connection...\n');
  
  try {
    // Test 1: Simple query
    console.log('Test 1: Running SELECT 1...');
    await prisma.$queryRaw`SELECT 1`;
    console.log('✅ Basic query successful\n');

    // Test 2: Count products
    console.log('Test 2: Counting products...');
    const productCount = await prisma.product.count();
    console.log(`✅ Found ${productCount} products\n`);

    // Test 3: Count users
    console.log('Test 3: Counting users...');
    const userCount = await prisma.user.count();
    console.log(`✅ Found ${userCount} users\n`);

    console.log('🎉 All database tests passed!');
    console.log('✅ Database connection is working correctly');
    
  } catch (error) {
    console.error('❌ Database connection failed:', {
      error: error.message,
      code: error.code,
      meta: error.meta,
    });
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

testConnection();
