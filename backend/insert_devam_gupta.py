#!/usr/bin/env python3
"""
Insert Devam Gupta into Railway PostgreSQL database
"""

import os
import psycopg2
from psycopg2.extras import RealDictCursor
import sys

def insert_devam_gupta():
    """Insert Devam Gupta into the students table"""
    try:
        # Get database connection string from Railway
        connection_string = os.getenv('DATABASE_URL')
        if not connection_string:
            print("❌ DATABASE_URL not found. Make sure you're connected to Railway.")
            print("Run: railway link")
            return False
        
        print("🔗 Connecting to Railway PostgreSQL database...")
        
        # Connect to database
        conn = psycopg2.connect(connection_string, cursor_factory=RealDictCursor)
        cursor = conn.cursor()
        
        print("✅ Connected to database successfully!")
        
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
            email VARCHAR(100),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
        """
        
        cursor.execute(create_table_sql)
        conn.commit()
        print("✅ Students table created/verified")
        
        # Check if Devam Gupta already exists
        cursor.execute("SELECT * FROM students WHERE roll_no = %s", ('2024BTech014',))
        existing = cursor.fetchone()
        
        if existing:
            print("⚠️  Devam Gupta already exists in database:")
            print(f"   ID: {existing['id']}")
            print(f"   Name: {existing['name']}")
            print(f"   Roll No: {existing['roll_no']}")
            print(f"   Room: {existing['room_no']}")
            print(f"   Hostel: {existing['hostel']}")
            
            # Update existing record
            update_sql = """
            UPDATE students SET 
                name = %s,
                room_no = %s,
                hostel = %s,
                year = %s,
                course = %s,
                branch = %s,
                room_type = %s,
                mobile = %s,
                email = %s
            WHERE roll_no = %s
            """
            
            cursor.execute(update_sql, (
                'Devam Gupta',
                '604',
                'BH2',
                '2nd year',
                'AC',
                '3 Seater',
                'AC',
                '7340015201',
                'devamgupta@jklu.edu.in',
                '2024BTech014'
            ))
            conn.commit()
            print("✅ Devam Gupta's record updated successfully!")
            
        else:
            # Insert new record
            insert_sql = """
            INSERT INTO students (roll_no, name, room_no, hostel, year, course, branch, room_type, mobile, email)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
            """
            
            student_data = (
                '2024BTech014',
                'Devam Gupta',
                '604',
                'BH2',
                '2nd year',
                'AC',
                '3 Seater',
                'AC',
                '7340015201',
                'devamgupta@jklu.edu.in'
            )
            
            cursor.execute(insert_sql, student_data)
            conn.commit()
            print("✅ Devam Gupta added to database successfully!")
        
        # Verify the insertion/update
        cursor.execute("SELECT * FROM students WHERE roll_no = %s", ('2024BTech014',))
        result = cursor.fetchone()
        
        if result:
            print("\n📋 Student Details in Database:")
            print(f"   ID: {result['id']}")
            print(f"   Roll No: {result['roll_no']}")
            print(f"   Name: {result['name']}")
            print(f"   Room: {result['room_no']}")
            print(f"   Hostel: {result['hostel']}")
            print(f"   Year: {result['year']}")
            print(f"   Course: {result['course']}")
            print(f"   Branch: {result['branch']}")
            print(f"   Room Type: {result['room_type']}")
            print(f"   Mobile: {result['mobile']}")
            print(f"   Email: {result['email']}")
            print(f"   Created: {result['created_at']}")
        
        cursor.close()
        conn.close()
        return True
        
    except Exception as e:
        print(f"❌ Error: {e}")
        return False

if __name__ == "__main__":
    print("🎯 Adding Devam Gupta to Railway PostgreSQL database...")
    print("📊 Data from CSV: BH-2, Room 604, AC, 3 Seater, 2nd year")
    print("📱 Mobile: 7340015201, Roll: 2024BTech014")
    print()
    
    success = insert_devam_gupta()
    if success:
        print("\n🎉 Devam Gupta successfully added/updated in database!")
        print("🔄 The students list should now show Devam Gupta's details.")
    else:
        print("\n💥 Failed to add Devam Gupta to database.")
        sys.exit(1)
