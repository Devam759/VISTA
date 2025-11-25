import prisma from '../config/prisma.js';

/**
 * Setup script for face recognition database
 * Run: node scripts/setupFaceRecognition.js
 */

async function setupFaceRecognition() {
  try {
    console.log('🚀 Setting up Face Recognition System...\n');

    // 1. Check if FaceData table exists
    console.log('📋 Checking database schema...');
    try {
      const count = await prisma.faceData.count();
      console.log(`✅ FaceData table exists (${count} records)\n`);
    } catch (error) {
      console.log('⚠️ FaceData table not found. Running migrations...');
      console.log('   Run: npm run prisma:migrate\n');
      return;
    }

    // 2. Check for students without face enrollment
    console.log('👥 Analyzing student enrollment status...');
    const totalStudents = await prisma.student.count();
    const enrolledStudents = await prisma.student.count({
      where: { faceEnrolled: true }
    });
    const notEnrolled = totalStudents - enrolledStudents;

    console.log(`   Total Students: ${totalStudents}`);
    console.log(`   Enrolled: ${enrolledStudents}`);
    console.log(`   Not Enrolled: ${notEnrolled}\n`);

    // 3. Check face data distribution
    console.log('📊 Face data distribution...');
    const studentsWithFaceData = await prisma.student.findMany({
      where: {
        faceData: {
          some: {}
        }
      },
      select: {
        id: true,
        name: true,
        rollNo: true,
        faceData: {
          select: { id: true }
        }
      }
    });

    console.log(`   Students with face data: ${studentsWithFaceData.length}`);
    
    if (studentsWithFaceData.length > 0) {
      console.log('   Sample distribution:');
      const sampleCounts = {};
      studentsWithFaceData.forEach(student => {
        const count = student.faceData.length;
        sampleCounts[count] = (sampleCounts[count] || 0) + 1;
      });
      
      Object.entries(sampleCounts).forEach(([count, students]) => {
        console.log(`     ${count} samples: ${students} student(s)`);
      });
    }
    console.log();

    // 4. Verify face enrollment flags
    console.log('🔍 Verifying face enrollment flags...');
    const mismatchedRecords = await prisma.student.findMany({
      where: {
        OR: [
          {
            faceEnrolled: true,
            faceData: { none: {} }
          },
          {
            faceEnrolled: false,
            faceData: { some: {} }
          }
        ]
      },
      select: {
        id: true,
        name: true,
        rollNo: true,
        faceEnrolled: true,
        faceData: { select: { id: true } }
      }
    });

    if (mismatchedRecords.length > 0) {
      console.log(`⚠️ Found ${mismatchedRecords.length} mismatched records:`);
      mismatchedRecords.forEach(record => {
        console.log(`   ${record.rollNo}: faceEnrolled=${record.faceEnrolled}, samples=${record.faceData.length}`);
      });
      console.log();

      // Fix mismatched records
      console.log('🔧 Fixing mismatched records...');
      for (const record of mismatchedRecords) {
        const shouldBeEnrolled = record.faceData.length >= 3;
        await prisma.student.update({
          where: { id: record.id },
          data: { faceEnrolled: shouldBeEnrolled }
        });
        console.log(`   ✅ ${record.rollNo}: faceEnrolled=${shouldBeEnrolled}`);
      }
      console.log();
    } else {
      console.log('✅ All enrollment flags are correct\n');
    }

    // 5. Configuration summary
    console.log('⚙️ Configuration Summary:');
    console.log(`   FACE_API: ${process.env.FACE_API || 'http://localhost:8000/verify-face'}`);
    console.log(`   FACE_MATCH_THRESHOLD: ${process.env.FACE_MATCH_THRESHOLD || '0.6'}`);
    console.log(`   NODE_ENV: ${process.env.NODE_ENV || 'development'}\n`);

    // 6. Next steps
    console.log('📝 Next Steps:');
    console.log('   1. Ensure DeepFace API is running on port 8000');
    console.log('   2. Students can now enroll their faces via /face/capture');
    console.log('   3. Attendance can be marked via /attendance/mark with face verification');
    console.log('   4. Monitor logs for face verification results\n');

    console.log('✨ Face Recognition System is ready!\n');

  } catch (error) {
    console.error('❌ Setup failed:', error.message);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

setupFaceRecognition();
