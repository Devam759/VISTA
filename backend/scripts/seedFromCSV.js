import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const prisma = new PrismaClient();

async function seedFromCSV() {
  console.log('🌱 Starting comprehensive database seeding...\n');

  try {
    // Step 1: Create or get BH-2 hostel
    console.log('🏠 Creating/finding BH-2 hostel...');
    const hostel = await prisma.hostel.upsert({
      where: { id: 1 },
      update: {},
      create: {
        id: 1,
        name: 'BH-2'
      }
    });
    console.log(`✅ Hostel: ${hostel.name} (ID: ${hostel.id})\n`);

    // Step 2: Create warden account
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
    console.log(`✅ Warden created: ${warden.email}\n`);

    // Step 3: Read and parse CSV file
    console.log('📖 Reading CSV file...');
    const csvPath = path.join(__dirname, '../../publc/FINAL SHEET OF BH-2.csv');
    
    if (!fs.existsSync(csvPath)) {
      throw new Error(`CSV file not found at: ${csvPath}`);
    }

    const csvContent = fs.readFileSync(csvPath, 'utf-8');
    const lines = csvContent.split('\n');

    // Skip header rows (first 4 lines)
    const dataLines = lines.slice(4).filter(line => line.trim());

    // Track unique rooms
    const roomsSet = new Set();
    const students = [];

    console.log(`📊 Parsing ${dataLines.length} lines from CSV...\n`);

    // Parse CSV data
    for (const line of dataLines) {
      const columns = parseCSVLine(line);
      
      // Skip empty rows or rows without student name
      const studentName = columns[6]?.trim();
      if (!studentName || studentName === '' || studentName === 'Vacant' || studentName === 'DEMO ROOM') {
        continue;
      }

      const roomNo = columns[3]?.trim();
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
        else if (regNo.includes('BDes') || regNo.includes('Bdes')) program = 'B.Des';
        else if (regNo.includes('MDes') || regNo.includes('Mdes')) program = 'M.Des';
        else if (regNo.includes('BTech') || regNo.includes('B.Tech')) program = 'B.Tech Computer Science';
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
        password: hashedPassword, // Same password hash for all
        faceIdUrl: null
      });
    }

    console.log(`📊 Found ${students.length} students to import`);
    console.log(`📊 Found ${roomsSet.size} unique rooms\n`);

    // Step 4: Create rooms
    console.log('🏠 Creating rooms...');
    let roomsCreated = 0;
    let roomsSkipped = 0;

    for (const roomNo of roomsSet) {
      try {
        // Check if room already exists
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
        // Room might already exist, skip
        roomsSkipped++;
      }
    }
    console.log(`✅ Rooms: ${roomsCreated} created, ${roomsSkipped} already existed\n`);

    // Step 5: Import students
    console.log('👥 Importing students...');
    let imported = 0;
    let skipped = 0;
    let errors = [];

    for (const student of students) {
      try {
        await prisma.student.create({
          data: student
        });
        imported++;
        if (imported % 20 === 0) {
          console.log(`   Progress: ${imported}/${students.length}...`);
        }
      } catch (error) {
        // Student might already exist (duplicate email or roll number)
        skipped++;
        if (error.code === 'P2002') {
          // Unique constraint violation
          errors.push(`Duplicate: ${student.email} or ${student.rollNo}`);
        } else {
          errors.push(`Error for ${student.name}: ${error.message}`);
        }
      }
    }

    console.log(`\n✅ Import complete!`);
    console.log(`   ✓ Imported: ${imported} students`);
    console.log(`   ⊘ Skipped: ${skipped} students (duplicates or errors)`);
    if (errors.length > 0 && errors.length <= 10) {
      console.log(`   ⚠️  Errors: ${errors.slice(0, 5).join(', ')}`);
    }
    console.log(`\n📝 Default password for all users: 123`);
    console.log(`📝 Warden email: warden@jklu.edu.in`);

    return {
      success: true,
      hostel: hostel.name,
      warden: warden.email,
      studentsImported: imported,
      studentsSkipped: skipped,
      roomsCreated: roomsCreated,
      roomsSkipped: roomsSkipped
    };

  } catch (error) {
    console.error('❌ Seeding failed:', error);
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
export default seedFromCSV;

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  seedFromCSV()
    .then((result) => {
      console.log('\n🎉 Database seeding completed successfully!');
      console.log(JSON.stringify(result, null, 2));
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n💥 Database seeding failed:', error.message);
      process.exit(1);
    });
}

