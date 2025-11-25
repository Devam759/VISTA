import pkg from '@prisma/client';
const { PrismaClient } = pkg;

const prisma = new PrismaClient({
  log: ['error', 'warn'],
});

// Test connection with proper error handling
(async () => {
  try {
    await prisma.$connect();
    console.log('✅ Prisma connected to MySQL');
  } catch (err) {
    console.error('❌ Prisma connection failed:', err.message);
    console.error('⚠️  Server will continue running, but database operations will fail');
    // Don't exit - let the server handle DB errors gracefully
  }
})();

export default prisma;
