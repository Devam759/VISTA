import pkg from '@prisma/client';
const { PrismaClient } = pkg;

const prisma = new PrismaClient({
  log: ['error', 'warn'],
});

// Test connection
prisma.$connect()
  .then(() => console.log('✅ Prisma connected to MySQL'))
  .catch((err) => console.error('❌ Prisma connection failed:', err.message));

export default prisma;
