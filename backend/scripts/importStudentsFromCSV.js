import fs from 'fs';
import csv from 'csv-parser';
import { PrismaClient } from '@prisma/client';
import path from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcryptjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const prisma = new PrismaClient();

async function importStudents() {
  const results = [];
  const csvFilePath = path.join(__dirname, '../../publc/FINAL SHEET OF BH-2.csv');
  
  console.log('📄 Reading CSV file...');
  
  // Read and parse CSV file
  const stream = fs.createReadStream(csvFilePath)
    .pipe(csv({
      skipLines: 2, // Skip header rows
      headers: [
        'sNo', 'hostel', 'floor', 'roomNo', 'acNac', 'seater',
        'name', 'regNo', 'mobile', 'address', 'rollNo', 'year', 'studentType', 'reportingDate'
      ],
      mapValues: ({ header, value }) => value ? value.trim() : null
    }));

  for await (const row of stream) {
    // Skip empty rows or rows without essential data
    if (!row.name || !row.regNo) continue;
    
    // Clean up the data
    const cleanRow = {
      ...row,
      roomNo: row.roomNo.replace(/[^0-9]/g, ''), // Extract only numbers from room number
      year: row.year.replace(' Year', '').trim(), // Clean year format
      isNewStudent: row.studentType?.toLowerCase().includes('new') ?? true
    };
    
    results.push(cleanRow);
  }

  console.log(`📊 Found ${results.length} student records to import`);
  
  // Start transaction
  console.log('🚀 Starting database transaction...');
  
  try {
    // Delete existing data
    await prisma.$transaction([
      prisma.attendance.deleteMany({}),
      prisma.student.deleteMany({}),
      prisma.warden.deleteMany({}),
      prisma.room.deleteMany({}),
      prisma.hostel.deleteMany({})
    ]);
    
    console.log('🧹 Cleared existing data');
    
    // Create hostel
    const hostel = await prisma.hostel.create({
      data: {
        name: 'BH-2',
        address: 'Boys Hostel 2, IIIT Kota'
      }
    });
    
    console.log(`🏠 Created hostel: ${hostel.name}`);
    
    // Process students
    const hashedPassword = await bcrypt.hash('password@123', 10);
    let studentCount = 0;
    
    // Group students by room
    const rooms = {};
    results.forEach(student => {
      if (!student.roomNo) return;
      if (!rooms[student.roomNo]) rooms[student.roomNo] = [];
      rooms[student.roomNo].push(student);
    });
    
    // Create rooms and students
    for (const [roomNumber, students] of Object.entries(rooms)) {
      const room = await prisma.room.create({
        data: {
          roomNo: roomNumber,
          hostelId: hostel.id,
          capacity: 3, // Default capacity, adjust as needed
          isAc: students[0]?.acNac?.toUpperCase() === 'AC'
        }
      });
      
      console.log(`🚪 Created room: ${room.roomNo} (${room.isAc ? 'AC' : 'Non-AC'})`);
      
      // Create students in this room
      for (const student of students) {
        try {
          await prisma.student.create({
            data: {
              name: student.name,
              rollNo: student.rollNo || student.regNo,
              roomNo: student.roomNo,
              program: student.regNo.includes('BTech') ? 'B.Tech' : 
                      student.regNo.includes('BBA') ? 'BBA' :
                      student.regNo.includes('BDes') ? 'B.Des' : 'Other',
              mobile: student.mobile || '0000000000',
              address: student.address || 'Not provided',
              email: `${student.regNo.toLowerCase().replace(/[^a-z0-9]/g, '')}@iiitkota.ac.in`,
              password: hashedPassword,
              hostelId: hostel.id,
              year: student.year || '1st Year',
              isNewStudent: student.isNewStudent
            }
          });
          studentCount++;
        } catch (error) {
          console.error(`❌ Error creating student ${student.name}:`, error.message);
        }
      }
    }
    
    // Create a default warden
    await prisma.warden.create({
      data: {
        name: 'Hostel Warden',
        email: 'warden@iiitkota.ac.in',
        password: await bcrypt.hash('warden@123', 10),
        mobile: '9876543210',
        hostelId: hostel.id
      }
    });
    
    console.log(`✅ Successfully imported ${studentCount} students`);
    console.log('👮 Created default warden (email: warden@iiitkota.ac.in, password: warden@123)');
    
  } catch (error) {
    console.error('❌ Error during import:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the import
importStudents()
  .then(() => {
    console.log('✨ Import completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Import failed:', error);
    process.exit(1);
  });
