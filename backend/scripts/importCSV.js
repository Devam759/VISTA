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
    const csvPath = path.join(__dirname, '../../publc/FINAL SHEET OF BH-2.csv');
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
    for (const roomNo of roomsSet) {
      await prisma.room.upsert({
        where: {
          id: 0 // Dummy, will use create
        },
        update: {},
        create: {
          roomNo: roomNo,
          hostelId: hostel.id
        }
      }).catch(() => {
        // Room might already exist, skip
      });
    }
    console.log(`✅ Rooms created\n`);

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
    console.log(`   ⊘ Skipped: ${skipped} students (duplicates)`);
    console.log(`\n📝 Default password for all students: 123`);

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

// Run import
importCSV()
  .then(() => {
    console.log('\n🎉 CSV import completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n💥 CSV import failed:', error.message);
    process.exit(1);
  });
