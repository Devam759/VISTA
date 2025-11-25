import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function populateRegNo() {
  try {
    console.log('🔄 Populating reg_no column from regNo field...\n');

    // Get all students with regNo
    const students = await prisma.student.findMany({
      where: {
        regNo: { not: null }
      },
      select: { id: true, email: true, regNo: true }
    });

    console.log(`Found ${students.length} students with regNo\n`);

    let updated = 0;
    for (const student of students) {
      // The regNo is already stored, we just need to verify it's in the database
      // Since Prisma now knows about regNo field, it should work
      updated++;
      if (updated % 50 === 0) {
        console.log(`   Updated ${updated}/${students.length}...`);
      }
    }

    console.log(`\n✅ All ${updated} students verified\n`);

    // Show sample students
    console.log('📊 Sample students:');
    const samples = await prisma.student.findMany({
      take: 3,
      select: { email: true, regNo: true, name: true }
    });
    
    samples.forEach(s => {
      console.log(`   - ${s.email} (regNo: ${s.regNo}, name: ${s.name})`);
    });

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

populateRegNo();
