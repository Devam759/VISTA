#!/usr/bin/env python3
"""
Simple Database Setup for VISTA
Creates database and imports BH-2 data with flexible connection options
"""

import os
import sys
from datetime import datetime

def check_mysql_connection():
    """Check if MySQL is available and get connection details"""
    import mysql.connector
    from mysql.connector import Error
    
    # Try different connection configurations
    configs = [
        {'host': 'localhost', 'user': 'root', 'password': ''},
        {'host': 'localhost', 'user': 'root', 'password': 'root'},
        {'host': 'localhost', 'user': 'root', 'password': 'password'},
        {'host': 'localhost', 'user': 'root', 'password': '123456'},
        {'host': 'localhost', 'user': 'admin', 'password': ''},
        {'host': 'localhost', 'user': 'admin', 'password': 'admin'},
    ]
    
    for i, config in enumerate(configs):
        try:
            print(f"Trying connection {i+1}: {config['user']}@{config['host']} (password: {'*' * len(config['password']) if config['password'] else 'none'})")
            connection = mysql.connector.connect(**config)
            print(f"✅ Successfully connected!")
            connection.close()
            return config
        except Error as e:
            print(f"❌ Failed: {e}")
            continue
    
    return None

def create_database_with_config(config):
    """Create database and tables using the working config"""
    import mysql.connector
    from mysql.connector import Error
    
    database_name = 'vista_attendance'
    
    try:
        # Create database
        connection = mysql.connector.connect(**config)
        cursor = connection.cursor()
        
        cursor.execute(f"CREATE DATABASE IF NOT EXISTS {database_name}")
        print(f"Database '{database_name}' created successfully")
        
        cursor.execute(f"USE {database_name}")
        connection.commit()
        cursor.close()
        connection.close()
        
        # Create tables
        connection = mysql.connector.connect(**{**config, 'database': database_name})
        cursor = connection.cursor()
        
        # Create basic tables
        tables_sql = [
            """
            CREATE TABLE IF NOT EXISTS hostels (
                hostel_id INT PRIMARY KEY AUTO_INCREMENT,
                name VARCHAR(50) UNIQUE NOT NULL,
                type ENUM('Boys', 'Girls') NOT NULL,
                warden_name VARCHAR(100) NOT NULL,
                warden_phone VARCHAR(15),
                warden_email VARCHAR(255),
                total_rooms INT DEFAULT 0,
                total_capacity INT DEFAULT 0,
                address TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            )
            """,
            """
            CREATE TABLE IF NOT EXISTS rooms (
                room_id INT PRIMARY KEY AUTO_INCREMENT,
                hostel_id INT NOT NULL,
                room_number VARCHAR(20) NOT NULL,
                floor_number INT,
                capacity INT DEFAULT 1,
                current_occupancy INT DEFAULT 0,
                room_type ENUM('Single', 'Double', 'Triple', 'Quad') DEFAULT 'Quad',
                is_available BOOLEAN DEFAULT TRUE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                FOREIGN KEY (hostel_id) REFERENCES hostels(hostel_id) ON DELETE CASCADE,
                UNIQUE KEY unique_hostel_room (hostel_id, room_number)
            )
            """,
            """
            CREATE TABLE IF NOT EXISTS users (
                user_id INT PRIMARY KEY AUTO_INCREMENT,
                email VARCHAR(255) UNIQUE NOT NULL,
                password_hash VARCHAR(255) NOT NULL,
                role ENUM('Student', 'Warden', 'ChiefWarden') NOT NULL,
                first_name VARCHAR(100) NOT NULL,
                last_name VARCHAR(100) NOT NULL,
                phone VARCHAR(15),
                profile_image VARCHAR(500),
                is_active BOOLEAN DEFAULT TRUE,
                last_login TIMESTAMP NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            )
            """,
            """
            CREATE TABLE IF NOT EXISTS students (
                student_id INT PRIMARY KEY AUTO_INCREMENT,
                user_id INT NOT NULL,
                roll_number VARCHAR(20) UNIQUE NOT NULL,
                hostel_id INT NOT NULL,
                room_id INT,
                admission_year YEAR NOT NULL,
                course VARCHAR(100),
                branch VARCHAR(100),
                semester INT,
                emergency_contact VARCHAR(15),
                parent_name VARCHAR(200),
                parent_phone VARCHAR(15),
                parent_email VARCHAR(255),
                blood_group VARCHAR(5),
                date_of_birth DATE,
                address TEXT,
                is_resident BOOLEAN DEFAULT TRUE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
                FOREIGN KEY (hostel_id) REFERENCES hostels(hostel_id) ON DELETE RESTRICT,
                FOREIGN KEY (room_id) REFERENCES rooms(room_id) ON DELETE SET NULL
            )
            """
        ]
        
        for sql in tables_sql:
            cursor.execute(sql)
        
        # Insert default hostels
        hostels_data = [
            ('BH1', 'Boys', 'Mr. Verma', '9876543210', 'verma@jklu.edu.in', 50, 200, 'Boys Hostel Block 1'),
            ('BH2', 'Boys', 'Mr. Rao', '9876543211', 'rao@jklu.edu.in', 50, 200, 'Boys Hostel Block 2'),
            ('GH1', 'Girls', 'Ms. Kapoor', '9876543212', 'kapoor@jklu.edu.in', 40, 160, 'Girls Hostel Block 1'),
            ('GH2', 'Girls', 'Ms. Sharma', '9876543213', 'sharma@jklu.edu.in', 40, 160, 'Girls Hostel Block 2')
        ]
        
        for hostel in hostels_data:
            cursor.execute("""
                INSERT IGNORE INTO hostels (name, type, warden_name, warden_phone, warden_email, total_rooms, total_capacity, address)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
            """, hostel)
        
        connection.commit()
        cursor.close()
        connection.close()
        
        print("✅ Database tables created successfully")
        return True
        
    except Error as e:
        print(f"❌ Error creating database: {e}")
        return False

def import_bh2_data(config):
    """Import BH-2 student data"""
    import mysql.connector
    from mysql.connector import Error
    
    database_name = 'vista_attendance'
    
    try:
        connection = mysql.connector.connect(**{**config, 'database': database_name})
        cursor = connection.cursor()
        
        # Check if we have the SQL file
        if not os.path.exists('student_import.sql'):
            print("Generating SQL file first...")
            os.system('python standalone_csv_processor.py "../public/FINAL SHEET OF BH-2.csv" sql')
        
        # Read and execute SQL
        with open('student_import.sql', 'r', encoding='utf-8') as file:
            sql_content = file.read()
        
        statements = [stmt.strip() for stmt in sql_content.split(';') if stmt.strip() and not stmt.strip().startswith('--')]
        
        success_count = 0
        for statement in statements:
            try:
                cursor.execute(statement)
                success_count += 1
            except Error as e:
                if 'duplicate entry' not in str(e).lower():
                    print(f"Warning: {e}")
        
        connection.commit()
        cursor.close()
        connection.close()
        
        print(f"✅ Imported {success_count} SQL statements successfully")
        return True
        
    except Error as e:
        print(f"❌ Error importing data: {e}")
        return False

def main():
    """Main setup function"""
    print("VISTA Database Setup")
    print("=" * 50)
    
    # Check MySQL connection
    print("Checking MySQL connection...")
    config = check_mysql_connection()
    
    if config is None:
        print("\n❌ Could not connect to MySQL!")
        print("\nPlease ensure MySQL is installed and running.")
        print("Common solutions:")
        print("1. Install MySQL: https://dev.mysql.com/downloads/mysql/")
        print("2. Start MySQL service")
        print("3. Set root password: mysqladmin -u root password 'yourpassword'")
        print("4. Or create a .env file with your database credentials")
        print("\nAlternatively, you can use the standalone CSV processor to generate SQL files.")
        return False
    
    print(f"\n✅ Using connection: {config['user']}@{config['host']}")
    
    # Create database and tables
    print("\nCreating database and tables...")
    if not create_database_with_config(config):
        return False
    
    # Import BH-2 data
    print("\nImporting BH-2 student data...")
    if not import_bh2_data(config):
        return False
    
    print("\n" + "=" * 50)
    print("✅ Database setup completed successfully!")
    print(f"Database: vista_attendance")
    print("BH-2 student data imported successfully")
    print("\nNext steps:")
    print("1. Create a .env file with your database credentials")
    print("2. Start the backend: python app.py")
    print("3. View students in the web interface")
    
    return True

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)
