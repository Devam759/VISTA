import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create Hostels
  const hostelA = await prisma.hostel.upsert({
    where: { id: 1 },
    update: {},
    create: {
      name: 'Hostel A'
    }
  });

  const hostelB = await prisma.hostel.upsert({
    where: { id: 2 },
    update: {},
    create: {
      name: 'Hostel B'
    }
  });

  console.log('✅ Hostels created');

  // Create Rooms
  const rooms = [];
  for (let i = 101; i <= 110; i++) {
    rooms.push({
      roomNo: `A-${i}`,
      hostelId: hostelA.id
    });
  }
  for (let i = 201; i <= 210; i++) {
    rooms.push({
      roomNo: `B-${i}`,
      hostelId: hostelB.id
    });
  }

  await prisma.room.createMany({
    data: rooms,
    skipDuplicates: true
  });

  console.log('✅ Rooms created');

  // Hash password
  const hashedPassword = await bcrypt.hash('123', 10);

  // Create Students
  const student1 = await prisma.student.upsert({
    where: { email: 'student1@jklu.edu.in' },
    update: {},
    create: {
      name: 'Sample Student',
      rollNo: '2024btech014',
      roomNo: 'A-101',
      hostelId: hostelA.id,
      program: 'B.Tech Computer Science',
      mobile: '9876543210',
      address: 'Jaipur, Rajasthan',
      email: 'student1@jklu.edu.in',
      password: hashedPassword,
      faceIdUrl: null // Add face image URL later
    }
  });

  const student2 = await prisma.student.upsert({
    where: { email: 'student2@jklu.edu.in' },
    update: {},
    create: {
      name: 'Test Student',
      rollNo: '2024btech015',
      roomNo: 'A-102',
      hostelId: hostelA.id,
      program: 'B.Tech Computer Science',
      mobile: '9876543211',
      address: 'Jaipur, Rajasthan',
      email: 'student2@jklu.edu.in',
      password: hashedPassword
    }
  });

  const student3 = await prisma.student.upsert({
    where: { email: 'student3@jklu.edu.in' },
    update: {},
    create: {
      name: 'Demo Student',
      rollNo: '2024btech016',
      roomNo: 'B-201',
      hostelId: hostelB.id,
      program: 'B.Tech Electronics',
      mobile: '9876543212',
      address: 'Jaipur, Rajasthan',
      email: 'student3@jklu.edu.in',
      password: hashedPassword
    }
  });

  console.log('✅ Students created');

  // Create Wardens
  const warden1 = await prisma.warden.upsert({
    where: { email: 'karan@jklu.edu.in' },
    update: {},
    create: {
      name: 'Karan',
      email: 'karan@jklu.edu.in',
      password: hashedPassword,
      mobile: '9876543200',
      hostelId: hostelA.id
    }
  });

  const warden2 = await prisma.warden.upsert({
    where: { email: 'warden2@jklu.edu.in' },
    update: {},
    create: {
      name: 'Warden B',
      email: 'warden2@jklu.edu.in',
      password: hashedPassword,
      mobile: '9876543201',
      hostelId: hostelB.id
    }
  });

  console.log('✅ Wardens created');

  // Create Campus Polygon (example coordinates for JKLU)
  const polygonPoints = [
    { lat: 26.9124, lng: 75.7873, pointOrder: 1 },
    { lat: 26.9134, lng: 75.7883, pointOrder: 2 },
    { lat: 26.9144, lng: 75.7873, pointOrder: 3 },
    { lat: 26.9134, lng: 75.7863, pointOrder: 4 }
  ];

  await prisma.campusPolygon.createMany({
    data: polygonPoints,
    skipDuplicates: true
  });

  console.log('✅ Campus polygon created');

  console.log('🎉 Seeding completed!');
  console.log('\n📝 Sample Credentials:');
  console.log('Student: student1@jklu.edu.in / 123');
  console.log('Warden: karan@jklu.edu.in / 123');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
