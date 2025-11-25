import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const prisma = new PrismaClient();

// Parse CSV line handling quoted values
function parseCSVLine(line) {
  const result = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current.trim());
  
  return result;
}

// Generate email from student data
function generateEmail(name, regNo, rollNo) {
  if (!name) return `student${Date.now()}@jklu.edu.in`;
  
  // Use reg number if available
  if (regNo && regNo.trim()) {
    const cleanReg = regNo.toLowerCase().replace(/[^a-z0-9]/g, '');
    if (cleanReg) return `${cleanReg}@jklu.edu.in`;
  }
  
  // Use roll number if available
  if (rollNo && rollNo.trim()) {
    const cleanRoll = rollNo.toLowerCase().replace(/[^a-z0-9]/g, '');
    if (cleanRoll) return `${cleanRoll}@jklu.edu.in`;
  }
  
  // Generate from name
  const cleanName = name.toLowerCase()
    .replace(/[^a-z\s]/g, '')
    .split(' ')
    .filter(word => word.length > 0)
    .join('.');
  
  return `${cleanName}@jklu.edu.in`;
}

// Determine program from registration number
function determineProgram(regNo) {
  if (!regNo) return 'B.Tech Computer Science';
  
  const reg = regNo.toUpperCase();
  if (reg.includes('BBA')) return 'BBA';
  if (reg.includes('BDES') || reg.includes('B.DES')) return 'B.Des';
  if (reg.includes('MDES') || reg.includes('M.DES')) return 'M.Des';
  if (reg.includes('BTECH') || reg.includes('B.TECH')) return 'B.Tech Computer Science';
  
  return 'B.Tech Computer Science';
}

async function importAllFromCSV() {
  console.log('🚀 Starting comprehensive CSV import...\n');

  try {
    // Read CSV file
    const csvPath = path.join(__dirname, '../../publc/FINAL SHEET OF BH-2.csv');
    const csvContent = fs.readFileSync(csvPath, 'utf-8');
    const lines = csvContent.split('\n');

    // Skip header rows (first 4 lines)
    const dataLines = lines.slice(4).filter(line => line.trim());

    console.log(`📊 Found ${dataLines.length} data rows\n`);

    // Create or get BH-2 hostel
    const hostel = await prisma.hostel.upsert({
      where: { id: 3 },
      update: {},
      create: {
        id: 3,
        name: 'BH-2'
      }
    });

    console.log(`✅ Hostel: ${hostel.name}\n`);

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
      const program = determineProgram(regNo);

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
        regNo: regNo || null,
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
        await prisma.student.create({
          data: student
        });
        imported++;
        if (imported % 10 === 0) {
          console.log(`   Imported ${imported}/${students.length}...`);
        }
      } catch (error) {
        // Student might already exist (duplicate email or roll number)
        skipped++;
      }
    }

    console.log(`\n✅ Import complete!`);
    console.log(`   ✓ Imported: ${imported} students`);
    console.log(`   ⊘ Skipped: ${skipped} students (duplicates)\n`);

    // Create warden account
    console.log('👮 Creating warden account...');
    const hashedPassword = await bcrypt.hash('123', 10);
    
    try {
      const warden = await prisma.warden.upsert({
        where: { email: 'warden@jklu.edu.in' },
        update: {
          name: 'Warden BH-2',
          password: hashedPassword,
          mobile: '0000000000',
          hostelId: hostel.id
        },
        create: {
          name: 'Warden BH-2',
          email: 'warden@jklu.edu.in',
          password: hashedPassword,
          mobile: '0000000000',
          hostelId: hostel.id
        }
      });
      console.log(`✅ Warden created: ${warden.email}\n`);
    } catch (error) {
      console.log(`⚠️  Warden creation skipped (may already exist)\n`);
    }

    // Seed campus polygon
    console.log('📍 Seeding campus polygon...');
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
    console.log(`✅ Campus polygon seeded (${campusPoints.length} points)\n`);

    console.log('🎉 All imports completed successfully!\n');
    console.log('📝 Login Credentials:');
    console.log('   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('   👤 STUDENT LOGIN:');
    console.log('      Use any student email from CSV');
    console.log('      Password: 123');
    console.log('   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('   👮 WARDEN LOGIN:');
    console.log('      Email: warden@jklu.edu.in');
    console.log('      Password: 123');
    console.log('   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  } catch (error) {
    console.error('❌ Import failed:', error.message);
    console.error(error);
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
  importAllFromCSV()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}

export default importAllFromCSV;
