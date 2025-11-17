import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function checkDatabase() {
  try {
    console.log('🔍 Checking database...\n');

    const studentCount = await prisma.student.count();
    const wardenCount = await prisma.warden.count();
    const hostelCount = await prisma.hostel.count();
    const roomCount = await prisma.room.count();
    const polygonCount = await prisma.campusPolygon.count();

    console.log('📊 Database Statistics:');
    console.log(`   Students: ${studentCount}`);
    console.log(`   Wardens: ${wardenCount}`);
    console.log(`   Hostels: ${hostelCount}`);
    console.log(`   Rooms: ${roomCount}`);
    console.log(`   Polygon Points: ${polygonCount}\n`);

    if (wardenCount > 0) {
      console.log('👮 Warden Accounts:');
      const wardens = await prisma.warden.findMany({
        select: { id: true, name: true, email: true }
      });
      wardens.forEach(w => {
        console.log(`   - ${w.email} (${w.name})`);
      });
      console.log();
    }

    if (studentCount > 0) {
      console.log('👥 Sample Students (first 5):');
      const students = await prisma.student.findMany({
        take: 5,
        select: { id: true, name: true, email: true, rollNo: true }
      });
      students.forEach(s => {
        console.log(`   - ${s.email} (${s.name}, ${s.rollNo})`);
      });
      console.log();
    }

    // Test password verification
    if (wardenCount > 0) {
      console.log('🔐 Testing password verification:');
      const warden = await prisma.warden.findFirst({
        where: { email: 'warden@jklu.edu.in' }
      });
      
      if (warden) {
        console.log(`   Found warden: ${warden.email}`);
        console.log(`   Password hash: ${warden.password.substring(0, 20)}...`);
        
        // Try bcrypt comparison
        const isValid = await bcrypt.compare('123', warden.password);
        console.log(`   Password "123" matches: ${isValid ? '✅ YES' : '❌ NO'}`);
      } else {
        console.log('   ❌ Warden not found!');
      }
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

checkDatabase();
