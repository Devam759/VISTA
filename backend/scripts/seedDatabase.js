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

    // Insert campus polygon (JKLU campus boundary)
    console.log('📍 Creating campus geofence...');
    const campusPoints = [
      [26.9124, 75.7873, 1],
      [26.9134, 75.7883, 2],
      [26.9144, 75.7873, 3],
      [26.9134, 75.7863, 4]
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
