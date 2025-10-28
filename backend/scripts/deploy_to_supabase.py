#!/usr/bin/env python3
"""
Script to deploy VISTA database to Supabase PostgreSQL.
"""
import os
import sys
import sqlite3
import psycopg2
from pathlib import Path
import json

# Add the backend directory to the Python path
backend_dir = Path(__file__).parent.parent
sys.path.insert(0, str(backend_dir))

def get_supabase_connection():
    """Get Supabase PostgreSQL connection."""
    # You'll need to replace these with your actual Supabase credentials
    SUPABASE_URL = os.getenv('SUPABASE_URL', 'your-project-url.supabase.co')
    SUPABASE_DB = os.getenv('SUPABASE_DB', 'postgres')
    SUPABASE_USER = os.getenv('SUPABASE_USER', 'postgres')
    SUPABASE_PASSWORD = os.getenv('SUPABASE_PASSWORD', 'your-password')
    SUPABASE_PORT = os.getenv('SUPABASE_PORT', '5432')
    
    connection_string = f"postgresql://{SUPABASE_USER}:{SUPABASE_PASSWORD}@{SUPABASE_URL}:{SUPABASE_PORT}/{SUPABASE_DB}"
    
    try:
        conn = psycopg2.connect(connection_string)
        return conn
    except Exception as e:
        print(f"❌ Failed to connect to Supabase: {e}")
        print("\n📋 Setup Instructions:")
        print("1. Go to https://supabase.com")
        print("2. Create a new project")
        print("3. Go to Settings > Database")
        print("4. Copy the connection details")
        print("5. Set environment variables:")
        print("   export SUPABASE_URL=your-project-url.supabase.co")
        print("   export SUPABASE_PASSWORD=your-password")
        return None

def create_postgresql_schema(conn):
    """Create PostgreSQL schema from SQLite schema."""
    cursor = conn.cursor()
    
    # Create tables with PostgreSQL syntax
    tables = {
        'users': '''
            CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                email VARCHAR(120) UNIQUE NOT NULL,
                password_hash VARCHAR(255) NOT NULL,
                role VARCHAR(50) NOT NULL,
                first_name VARCHAR(50) NOT NULL,
                last_name VARCHAR(50) NOT NULL,
                phone VARCHAR(15),
                is_active BOOLEAN NOT NULL DEFAULT TRUE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                last_login TIMESTAMP
            )
        ''',
        'hostels': '''
            CREATE TABLE IF NOT EXISTS hostels (
                id SERIAL PRIMARY KEY,
                name VARCHAR(50) NOT NULL,
                type VARCHAR(20) NOT NULL,
                warden_name VARCHAR(100),
                warden_phone VARCHAR(15),
                total_rooms INTEGER NOT NULL,
                total_capacity INTEGER NOT NULL,
                address TEXT,
                is_active BOOLEAN NOT NULL DEFAULT TRUE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        ''',
        'rooms': '''
            CREATE TABLE IF NOT EXISTS rooms (
                id SERIAL PRIMARY KEY,
                hostel_id INTEGER NOT NULL REFERENCES hostels(id),
                room_number VARCHAR(10) NOT NULL,
                room_type VARCHAR(20) NOT NULL,
                capacity INTEGER NOT NULL,
                current_occupancy INTEGER NOT NULL DEFAULT 0,
                is_active BOOLEAN NOT NULL DEFAULT TRUE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        ''',
        'students': '''
            CREATE TABLE IF NOT EXISTS students (
                id SERIAL PRIMARY KEY,
                user_id INTEGER NOT NULL REFERENCES users(id),
                roll_number VARCHAR(20) UNIQUE NOT NULL,
                hostel_id INTEGER NOT NULL REFERENCES hostels(id),
                room_id INTEGER REFERENCES rooms(id),
                course VARCHAR(50) NOT NULL,
                branch VARCHAR(100) NOT NULL,
                semester INTEGER NOT NULL,
                admission_year INTEGER NOT NULL,
                is_active BOOLEAN NOT NULL DEFAULT TRUE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        ''',
        'attendance_records': '''
            CREATE TABLE IF NOT EXISTS attendance_records (
                id SERIAL PRIMARY KEY,
                student_id INTEGER NOT NULL REFERENCES students(id),
                attendance_date DATE NOT NULL,
                attendance_time TIME NOT NULL,
                status VARCHAR(20) NOT NULL,
                verification_method VARCHAR(50) NOT NULL,
                confidence_score FLOAT NOT NULL DEFAULT 0.0,
                wifi_verified BOOLEAN NOT NULL DEFAULT FALSE,
                gps_verified BOOLEAN NOT NULL DEFAULT FALSE,
                latitude FLOAT,
                longitude FLOAT,
                accuracy FLOAT,
                notes TEXT,
                marked_by INTEGER REFERENCES users(id),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                CONSTRAINT _student_date_uc UNIQUE (student_id, attendance_date)
            )
        ''',
        'face_enrollments': '''
            CREATE TABLE IF NOT EXISTS face_enrollments (
                id SERIAL PRIMARY KEY,
                student_id INTEGER NOT NULL REFERENCES students(id),
                face_image_path VARCHAR(255),
                face_encoding_data TEXT,
                confidence_score FLOAT NOT NULL DEFAULT 0.0,
                face_quality_score FLOAT NOT NULL DEFAULT 0.0,
                enrollment_method VARCHAR(50) NOT NULL,
                is_active BOOLEAN NOT NULL DEFAULT TRUE,
                created_by INTEGER REFERENCES users(id),
                notes TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        '''
    }
    
    print("🏗️ Creating PostgreSQL schema...")
    for table_name, sql in tables.items():
        try:
            cursor.execute(sql)
            print(f"  ✅ Created table: {table_name}")
        except Exception as e:
            print(f"  ❌ Error creating {table_name}: {e}")
    
    conn.commit()
    print("✅ Schema creation complete!")

def migrate_data_from_sqlite(conn):
    """Migrate data from SQLite to PostgreSQL."""
    sqlite_path = backend_dir / "instance" / "vista_attendance.db"
    
    if not sqlite_path.exists():
        print("❌ SQLite database not found!")
        return
    
    print("📦 Migrating data from SQLite to PostgreSQL...")
    
    # Connect to SQLite
    sqlite_conn = sqlite3.connect(str(sqlite_path))
    sqlite_cursor = sqlite_conn.cursor()
    
    # Connect to PostgreSQL
    pg_cursor = conn.cursor()
    
    # Tables to migrate
    tables = ['users', 'hostels', 'rooms', 'students', 'attendance_records', 'face_enrollments']
    
    for table in tables:
        try:
            # Get data from SQLite
            sqlite_cursor.execute(f"SELECT * FROM {table}")
            rows = sqlite_cursor.fetchall()
            
            if not rows:
                print(f"  ⚠️ No data in {table}")
                continue
            
            # Get column names
            sqlite_cursor.execute(f"PRAGMA table_info({table})")
            columns = [col[1] for col in sqlite_cursor.fetchall()]
            
            # Insert into PostgreSQL
            placeholders = ', '.join(['%s'] * len(columns))
            columns_str = ', '.join(columns)
            
            for row in rows:
                try:
                    pg_cursor.execute(f"INSERT INTO {table} ({columns_str}) VALUES ({placeholders})", row)
                except Exception as e:
                    print(f"    ⚠️ Skipping row in {table}: {e}")
                    continue
            
            print(f"  ✅ Migrated {len(rows)} records to {table}")
            
        except Exception as e:
            print(f"  ❌ Error migrating {table}: {e}")
    
    conn.commit()
    sqlite_conn.close()
    print("✅ Data migration complete!")

def generate_env_config(conn):
    """Generate environment configuration for the deployed database."""
    cursor = conn.cursor()
    cursor.execute("SELECT current_database(), current_user, inet_server_addr(), inet_server_port()")
    db_info = cursor.fetchone()
    
    print("\n🔧 Environment Configuration:")
    print("=" * 50)
    print("Add these to your .env file or environment variables:")
    print()
    print("DB_TYPE=postgresql")
    print(f"DB_HOST={os.getenv('SUPABASE_URL', 'your-project-url.supabase.co')}")
    print(f"DB_USER={os.getenv('SUPABASE_USER', 'postgres')}")
    print(f"DB_PASSWORD={os.getenv('SUPABASE_PASSWORD', 'your-password')}")
    print(f"DB_NAME={os.getenv('SUPABASE_DB', 'postgres')}")
    print(f"DB_PORT={os.getenv('SUPABASE_PORT', '5432')}")
    print()
    print("Or use the DATABASE_URL format:")
    print(f"DATABASE_URL=postgresql://{os.getenv('SUPABASE_USER', 'postgres')}:{os.getenv('SUPABASE_PASSWORD', 'your-password')}@{os.getenv('SUPABASE_URL', 'your-project-url.supabase.co')}:{os.getenv('SUPABASE_PORT', '5432')}/{os.getenv('SUPABASE_DB', 'postgres')}")

def main():
    print("🚀 VISTA Database Deployment to Supabase")
    print("=" * 50)
    
    # Check if psycopg2 is installed
    try:
        import psycopg2
    except ImportError:
        print("❌ psycopg2 not installed. Installing...")
        os.system("pip install psycopg2-binary")
        import psycopg2
    
    # Connect to Supabase
    conn = get_supabase_connection()
    if not conn:
        return
    
    try:
        # Create schema
        create_postgresql_schema(conn)
        
        # Migrate data
        migrate_data_from_sqlite(conn)
        
        # Generate config
        generate_env_config(conn)
        
        print("\n🎉 Deployment complete!")
        print("Your VISTA database is now hosted on Supabase!")
        
    except Exception as e:
        print(f"❌ Deployment failed: {e}")
    finally:
        conn.close()

if __name__ == "__main__":
    main()
