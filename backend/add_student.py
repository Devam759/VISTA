#!/usr/bin/env python3
"""
Add Devam Gupta to the Railway PostgreSQL database
"""

import os
import psycopg2
from psycopg2.extras import RealDictCursor

def add_student():
    """Add Devam Gupta to the students table"""
    try:
        # Get database connection string from Railway
        connection_string = os.getenv('DATABASE_URL')
        if not connection_string:
            print("DATABASE_URL not found. Make sure you're connected to Railway.")
            return False
        
        # Connect to database
        conn = psycopg2.connect(connection_string, cursor_factory=RealDictCursor)
        cursor = conn.cursor()
        
        # Create students table if it doesn't exist
        create_table_sql = """
        CREATE TABLE IF NOT EXISTS students (
            id SERIAL PRIMARY KEY,
            roll_no VARCHAR(20) UNIQUE NOT NULL,
            name VARCHAR(100) NOT NULL,
            room_no VARCHAR(10),
            hostel VARCHAR(10),
            year VARCHAR(10),
            course VARCHAR(50),
            branch VARCHAR(50),
            room_type VARCHAR(20),
            mobile VARCHAR(15),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
        """
        
        cursor.execute(create_table_sql)
        conn.commit()
        print("✅ Students table created/verified")
        
        # Insert Devam Gupta
        insert_sql = """
        INSERT INTO students (roll_no, name, room_no, hostel, year, course, branch, room_type, mobile)
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
        ON CONFLICT (roll_no) DO UPDATE SET
            name = EXCLUDED.name,
            room_no = EXCLUDED.room_no,
            hostel = EXCLUDED.hostel,
            year = EXCLUDED.year,
            course = EXCLUDED.course,
            branch = EXCLUDED.branch,
            room_type = EXCLUDED.room_type,
            mobile = EXCLUDED.mobile;
        """
        
        student_data = (
            '2024btech014',
            'Devam Gupta',
            '604',
            'BH2',
            '2nd year',
            'AC',
            '3 seater',
            'AC',
            '7340015201'
        )
        
        cursor.execute(insert_sql, student_data)
        conn.commit()
        
        print("✅ Devam Gupta added to database successfully!")
        print(f"   Roll No: {student_data[0]}")
        print(f"   Name: {student_data[1]}")
        print(f"   Room: {student_data[2]}")
        print(f"   Hostel: {student_data[3]}")
        print(f"   Year: {student_data[4]}")
        print(f"   Course: {student_data[5]}")
        print(f"   Branch: {student_data[6]}")
        print(f"   Room Type: {student_data[7]}")
        print(f"   Mobile: {student_data[8]}")
        
        # Verify the insertion
        cursor.execute("SELECT * FROM students WHERE roll_no = %s", (student_data[0],))
        result = cursor.fetchone()
        
        if result:
            print("\n✅ Student verified in database:")
            print(f"   ID: {result['id']}")
            print(f"   Roll No: {result['roll_no']}")
            print(f"   Name: {result['name']}")
            print(f"   Room: {result['room_no']}")
            print(f"   Hostel: {result['hostel']}")
        
        cursor.close()
        conn.close()
        return True
        
    except Exception as e:
        print(f"❌ Error adding student: {e}")
        return False

if __name__ == "__main__":
    print("Adding Devam Gupta to Railway PostgreSQL database...")
    success = add_student()
    if success:
        print("\n🎉 Student added successfully!")
    else:
        print("\n💥 Failed to add student.")
