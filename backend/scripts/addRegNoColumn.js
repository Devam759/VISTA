import mysql from 'mysql2/promise';

async function addRegNoColumn() {
  let connection;
  try {
    connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '696984',
      database: 'vista'
    });

    console.log('🔍 Checking if reg_no column exists...');
    
    // Check if column exists
    const [rows] = await connection.query(
      `SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS 
       WHERE TABLE_NAME = 'students' AND COLUMN_NAME = 'reg_no'`
    );

    if (rows.length > 0) {
      console.log('✅ reg_no column already exists');
    } else {
      console.log('❌ reg_no column does not exist, adding it...');
      
      // Add the column
      await connection.query(
        `ALTER TABLE students ADD COLUMN reg_no VARCHAR(30) UNIQUE NULL AFTER roll_no`
      );
      
      console.log('✅ reg_no column added successfully');
    }

    // Show the columns
    const [columns] = await connection.query(
      `SHOW COLUMNS FROM students`
    );
    
    console.log('\n📋 Current columns in students table:');
    columns.forEach(col => {
      console.log(`   - ${col.Field} (${col.Type})`);
    });

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

addRegNoColumn();
