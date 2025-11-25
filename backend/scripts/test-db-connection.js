import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    try {
        console.log('🔄 Testing database connection...');
        await prisma.$connect();
        console.log('✅ Successfully connected to the database!');

        const studentCount = await prisma.student.count();
        console.log(`📊 Found ${studentCount} students in the database.`);

        await prisma.$disconnect();
        process.exit(0);
    } catch (error) {
        console.error('❌ Database connection failed:', error);
        process.exit(1);
    }
}

main();
