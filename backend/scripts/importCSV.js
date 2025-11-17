import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const prisma = new PrismaClient();

async function importCSV() {
  console.log('🚀 Starting CSV import...\n');

  try {
    // Read CSV file
    const csvPath = path.join(__dirname, '../../public/FINAL SHEET OF BH-2.csv');
    const csvContent = fs.readFileSync(csvPath, 'utf-8');
    const lines = csvContent.split('\n');

    // Skip header rows (first 4 lines)
    const dataLines = lines.slice(4).filter(line => line.trim());

    // Create or get BH-2 hostel
    const hostel = await prisma.hostel.upsert({
      where: { id: 3 },
      update: {},
      create: {
        id: 3,
        name: 'BH-2'
      }
    });

    console.log(`✅ Hostel created/found: ${hostel.name}\n`);

    // Create warden account
    console.log('👮 Creating warden account...');
    const hashedPassword = await bcrypt.hash('123', 10);
    const warden = await prisma.warden.upsert({
      where: { email: 'warden@jklu.edu.in' },
      update: {
        name: 'Warden',
        password: hashedPassword,
        mobile: '0000000000',
        hostelId: hostel.id
      },
      create: {
        name: 'Warden',
        email: 'warden@jklu.edu.in',
        password: hashedPassword,
        mobile: '0000000000',
        hostelId: hostel.id
      }
    });
    console.log(`✅ Warden created: ${warden.email} (password: 123)\n`);

    // Track unique rooms
    const roomsSet = new Set();
    const students = [];

    // Parse CSV data
    for (const line of dataLines) {
      const columns = parseCSVLine(line);
      
      // Skip empty rows or rows without student name
      if (!columns[6] || columns[6].trim() === '' || columns[6] === 'Vacant' || columns[6] === 'DEMO ROOM') {
        continue;
      }

      const roomNo = columns[3]?.trim();
      const studentName = columns[6]?.trim();
      const regNo = columns[7]?.trim();
      const mobile = columns[8]?.trim();
      const address = columns[9]?.trim();
      const rollNo = columns[10]?.trim();
      const year = columns[11]?.trim();

      // Skip if no room number
      if (!roomNo) continue;

      // Add room to set
      roomsSet.add(roomNo);

      // Determine program from registration number
      let program = 'B.Tech Computer Science';
      if (regNo) {
        if (regNo.includes('BBA')) program = 'BBA';
        else if (regNo.includes('BDes')) program = 'B.Des';
        else if (regNo.includes('MDes')) program = 'M.Des';
      }

      // Generate email from name or reg number
      const email = generateEmail(studentName, regNo, rollNo);
      
      students.push({
        name: studentName,
        rollNo: rollNo || regNo || `TEMP-${Date.now()}-${Math.random()}`,
        roomNo: roomNo,
        hostelId: hostel.id,
        program: program,
        mobile: mobile || '0000000000',
        address: address || 'Not provided',
        email: email,
        password: await bcrypt.hash('123', 10), // Default password
        faceIdUrl: null
      });
    }

    console.log(`📊 Found ${students.length} students to import`);
    console.log(`📊 Found ${roomsSet.size} unique rooms\n`);

    // Create rooms
    console.log('🏠 Creating rooms...');
    let roomsCreated = 0;
    let roomsSkipped = 0;
    for (const roomNo of roomsSet) {
      try {
        const existingRoom = await prisma.room.findFirst({
          where: {
            roomNo: roomNo,
            hostelId: hostel.id
          }
        });
        if (!existingRoom) {
          await prisma.room.create({
            data: {
              roomNo: roomNo,
              hostelId: hostel.id
            }
          });
          roomsCreated++;
        } else {
          roomsSkipped++;
        }
      } catch (error) {
        roomsSkipped++;
      }
    }
    console.log(`✅ Rooms: ${roomsCreated} created, ${roomsSkipped} already existed\n`);

    // Import students
    console.log('👥 Importing students...');
    let imported = 0;
    let skipped = 0;

    for (const student of students) {
      try {
        // Use upsert to handle duplicates - update if exists, create if not
        await prisma.student.upsert({
          where: { email: student.email },
          update: {
            name: student.name,
            rollNo: student.rollNo,
            roomNo: student.roomNo,
            program: student.program,
            mobile: student.mobile,
            address: student.address
          },
          create: student
        });
        imported++;
        if (imported % 10 === 0) {
          console.log(`   Imported ${imported}/${students.length}...`);
        }
      } catch (error) {
        // Log error for debugging
        console.error(`   ⚠️ Error importing ${student.email}:`, error.message);
        skipped++;
      }
    }

    console.log(`\n✅ Import complete!`);
    console.log(`   ✓ Imported: ${imported} students`);
    console.log(`   ⊘ Skipped: ${skipped} students (duplicates)`);
    console.log(`\n📝 Default password for all users: 123`);
    console.log(`📝 Warden login: warden@jklu.edu.in / 123`);

    // Import campus polygon
    console.log('\n📍 Importing campus polygon...');
    const campusCoordinates = [
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

    // Delete existing polygon
    await prisma.campusPolygon.deleteMany({});
    
    // Insert new coordinates
    for (const coord of campusCoordinates) {
      await prisma.campusPolygon.create({
        data: {
          lat: coord.lat,
          lng: coord.lng,
          pointOrder: coord.pointOrder
        }
      });
    }
    console.log(`✅ Campus polygon imported: ${campusCoordinates.length} boundary points`);

  } catch (error) {
    console.error('❌ Import failed:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Helper function to parse CSV line (handles commas in quotes)
function parseCSVLine(line) {
  const result = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(current);
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current);
  
  return result;
}

// Generate email from student name
function generateEmail(name, regNo, rollNo) {
  if (!name) return `student${Date.now()}@jklu.edu.in`;
  
  // Use roll number if available
  if (rollNo && rollNo.trim()) {
    return `${rollNo.toLowerCase().replace(/[^a-z0-9]/g, '')}@jklu.edu.in`;
  }
  
  // Use reg number if available
  if (regNo && regNo.trim()) {
    return `${regNo.toLowerCase().replace(/[^a-z0-9]/g, '')}@jklu.edu.in`;
  }
  
  // Generate from name
  const cleanName = name.toLowerCase()
    .replace(/[^a-z\s]/g, '')
    .split(' ')
    .filter(word => word.length > 0)
    .join('.');
  
  return `${cleanName}@jklu.edu.in`;
}

// Export for use in API endpoint
export default importCSV;

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  importCSV()
    .then(() => {
      console.log('\n🎉 CSV import completed successfully!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n💥 CSV import failed:', error.message);
      process.exit(1);
    });
}
