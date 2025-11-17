import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

async function seedDatabase() {
  console.log('🌱 Seeding database with sample data...\n');

  const prisma = new PrismaClient();

  try {
    // Check if data already exists
    const existingWardens = await prisma.warden.count();
    const existingStudents = await prisma.student.count();

    if (existingWardens > 0 || existingStudents > 0) {
      console.log('⚠️  Database already has data. Skipping seed.');
      console.log(`   Students: ${existingStudents}`);
      console.log(`   Wardens: ${existingWardens}\n`);
      return;
    }

    // Hash password for all users
    const hashedPassword = await bcrypt.hash('123', 10);

    // Create hostel
    const hostel = await prisma.hostel.create({
      data: { name: 'BH-2' }
    });
    console.log(`✅ Hostel created: ${hostel.name}\n`);

    // Create rooms
    console.log('🏠 Creating rooms...');
    const roomNumbers = ['101', '102', '201'];
    for (const roomNo of roomNumbers) {
      await prisma.room.create({
        data: {
          roomNo: roomNo,
          hostelId: hostel.id
        }
      });
    }
    console.log('✅ Created rooms\n');

    // Insert sample students
    console.log('👥 Creating sample students...');
    const studentData = [
      { rollNo: '2024btech001', name: 'Rahul Kumar', email: 'student1@jklu.edu.in', roomNo: '101', program: 'B.Tech Computer Science', mobile: '9876543210', address: 'Jaipur' },
      { rollNo: '2024btech002', name: 'Priya Sharma', email: 'student2@jklu.edu.in', roomNo: '102', program: 'B.Tech Computer Science', mobile: '9876543211', address: 'Jaipur' },
      { rollNo: '2024btech003', name: 'Amit Patel', email: 'student3@jklu.edu.in', roomNo: '201', program: 'B.Tech Computer Science', mobile: '9876543212', address: 'Jaipur' }
    ];

    for (const student of studentData) {
      await prisma.student.create({
        data: {
          ...student,
          hostelId: hostel.id,
          password: hashedPassword
        }
      });
    }
    console.log(`✅ Created ${studentData.length} sample students\n`);

    // Insert sample warden
    console.log('👮 Creating sample warden...');
    await prisma.warden.create({
      data: {
        name: 'Karan Singh',
        email: 'karan@jklu.edu.in',
        password: hashedPassword,
        mobile: '9876543200',
        hostelId: hostel.id
      }
    });
    console.log('✅ Created sample warden\n');

    // Insert campus polygon (JKLU campus boundary - actual coordinates)
    console.log('📍 Creating campus geofence...');
    const campusPoints = [
      { lat: 26.835786216245545, lng: 75.65131165087223, pointOrder: 1 },
      { lat: 26.837407397333223, lng: 75.65114535391331, pointOrder: 2 },
      { lat: 26.836622388388918, lng: 75.64845744520426, pointOrder: 3 },
      { lat: 26.836051578163385, lng: 75.64818117767572, pointOrder: 4 },
      { lat: 26.835461618240164, lng: 75.65019752830267, pointOrder: 5 },
      { lat: 26.834609880617364, lng: 75.65087344497442, pointOrder: 6 },
      { lat: 26.834014228898674, lng: 75.651178881526, pointOrder: 7 },
      { lat: 26.83333241176029, lng: 75.65138272941113, pointOrder: 8 },
      { lat: 26.832626058039946, lng: 75.65278552472591, pointOrder: 9 },
      { lat: 26.833887678682544, lng: 75.65269734710455, pointOrder: 10 },
      { lat: 26.834122828616806, lng: 75.6522286310792, pointOrder: 11 },
      { lat: 26.83494166115547, lng: 75.6524958461523, pointOrder: 12 }
    ];

    // Clear existing polygon
    await prisma.campusPolygon.deleteMany({});

    for (const point of campusPoints) {
      await prisma.campusPolygon.create({
        data: point
      });
    }
    console.log('✅ Created campus geofence\n');

    console.log('🎉 Database seeded successfully!\n');
    console.log('📝 Sample Login Credentials:');
    console.log('   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('   👤 STUDENT LOGIN:');
    console.log('      Email: student1@jklu.edu.in');
    console.log('      Password: 123');
    console.log('   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('   👮 WARDEN LOGIN:');
    console.log('      Email: karan@jklu.edu.in');
    console.log('      Password: 123');
    console.log('   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  } catch (error) {
    console.error('❌ Seeding failed:', error.message);
    throw error;
  } finally {
    // Only disconnect if this script is run directly
    if (import.meta.url === `file://${process.argv[1]}`) {
      await prisma.$disconnect();
    }
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  seedDatabase()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}

export default seedDatabase;
