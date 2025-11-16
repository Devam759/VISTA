import prisma from '../config/prisma.js';

async function clearAttendance() {
  try {
    console.log('🗑️ Clearing all attendance records...');
    
    const result = await prisma.attendance.deleteMany({});
    
    console.log(`✅ Deleted ${result.count} attendance records`);
    
    console.log('📊 Attendance records remaining:');
    const count = await prisma.attendance.count();
    console.log(`   Total: ${count}`);
    
  } catch (error) {
    console.error('❌ Error clearing attendance:', error);
  } finally {
    await prisma.$disconnect();
  }
}

clearAttendance();
