import pool from '../config/db.js';
import bcrypt from 'bcryptjs';

async function seedDatabase() {
  console.log('🌱 Seeding database with sample data...\n');

  try {
    const connection = await pool.getConnection();

    // Check if data already exists
    const [existingWardens] = await connection.query('SELECT COUNT(*) as count FROM wardens');
    const [existingStudents] = await connection.query('SELECT COUNT(*) as count FROM students');

    if (existingWardens[0].count > 0 || existingStudents[0].count > 0) {
      console.log('⚠️  Database already has data. Skipping seed.');
      console.log(`   Students: ${existingStudents[0].count}`);
      console.log(`   Wardens: ${existingWardens[0].count}\n`);
      connection.release();
      return;
    }

    // Hash password for all users
    const hashedPassword = await bcrypt.hash('123', 10);

    // Insert sample students
    console.log('👥 Creating sample students...');
    const studentData = [
      ['2024btech001', 'Rahul Kumar', 'B.Tech Computer Science', 2, 'BH-2', '101', '9876543210'],
      ['2024btech002', 'Priya Sharma', 'B.Tech Computer Science', 2, 'BH-2', '102', '9876543211'],
      ['2024btech003', 'Amit Patel', 'B.Tech Computer Science', 3, 'BH-2', '201', '9876543212']
    ];

    for (const student of studentData) {
      await connection.query(
        `INSERT INTO students (roll_no, name, course, year, hostel, room_no, mobile_no, password) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [...student, hashedPassword]
      );
    }
    console.log(`✅ Created ${studentData.length} sample students\n`);

    // Insert sample warden
    console.log('👮 Creating sample warden...');
    await connection.query(
      `INSERT INTO wardens (name, hostel, mobile, password) 
       VALUES (?, ?, ?, ?)`,
      ['Karan Singh', 'BH-2', '9876543200', hashedPassword]
    );
    console.log('✅ Created sample warden\n');

    // Insert campus polygon (JKLU campus boundary - actual coordinates)
    console.log('📍 Creating campus geofence...');
    const campusPoints = [
      [26.835786216245545, 75.65131165087223, 1],
      [26.837407397333223, 75.65114535391331, 2],
      [26.836622388388918, 75.64845744520426, 3],
      [26.836051578163385, 75.64818117767572, 4],
      [26.835461618240164, 75.65019752830267, 5],
      [26.834609880617364, 75.65087344497442, 6],
      [26.834014228898674, 75.651178881526, 7],
      [26.83333241176029, 75.65138272941113, 8],
      [26.832626058039946, 75.65278552472591, 9],
      [26.833887678682544, 75.65269734710455, 10],
      [26.834122828616806, 75.6522286310792, 11],
      [26.83494166115547, 75.6524958461523, 12]
    ];

    for (const point of campusPoints) {
      await connection.query(
        `INSERT INTO campus_polygon (lat, lng, point_order) VALUES (?, ?, ?)`,
        point
      );
    }
    console.log('✅ Created campus geofence\n');

    connection.release();

    console.log('🎉 Database seeded successfully!\n');
    console.log('📝 Sample Login Credentials:');
    console.log('   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('   👤 STUDENT LOGIN:');
    console.log('      Roll No: 2024btech001');
    console.log('      Password: 123');
    console.log('   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('   👮 WARDEN LOGIN:');
    console.log('      Name: Karan Singh');
    console.log('      Password: 123');
    console.log('   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  } catch (error) {
    console.error('❌ Seeding failed:', error.message);
    throw error;
  } finally {
    await pool.end();
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
