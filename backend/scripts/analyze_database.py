#!/usr/bin/env python3
"""
Script to analyze the current SQLite database structure and data.
"""
import os
import sys
import sqlite3
from pathlib import Path

# Add the backend directory to the Python path
backend_dir = Path(__file__).parent.parent
sys.path.insert(0, str(backend_dir))

def analyze_sqlite_db():
    """Analyze the current SQLite database."""
    db_path = backend_dir / "instance" / "vista_attendance.db"
    
    if not db_path.exists():
        print("❌ Database file not found!")
        return
    
    print("🔍 Analyzing VISTA Database...")
    print("=" * 50)
    print(f"Database Path: {db_path}")
    print(f"File Size: {db_path.stat().st_size / 1024:.2f} KB")
    print()
    
    try:
        conn = sqlite3.connect(str(db_path))
        cursor = conn.cursor()
        
        # Get all tables
        cursor.execute("SELECT name FROM sqlite_master WHERE type='table';")
        tables = cursor.fetchall()
        
        print("📊 Database Tables:")
        print("-" * 30)
        for table in tables:
            table_name = table[0]
            cursor.execute(f"SELECT COUNT(*) FROM {table_name}")
            count = cursor.fetchone()[0]
            print(f"  {table_name}: {count} records")
        
        print()
        
        # Get table schemas
        print("🏗️ Table Schemas:")
        print("-" * 30)
        for table in tables:
            table_name = table[0]
            cursor.execute(f"PRAGMA table_info({table_name})")
            columns = cursor.fetchall()
            print(f"\n{table_name}:")
            for col in columns:
                print(f"  - {col[1]} ({col[2]}) {'NOT NULL' if col[3] else 'NULL'}")
        
        # Sample data from key tables
        print("\n📋 Sample Data:")
        print("-" * 30)
        
        key_tables = ['users', 'students', 'hostels', 'rooms', 'attendance_records', 'face_enrollments']
        for table_name in key_tables:
            try:
                cursor.execute(f"SELECT COUNT(*) FROM {table_name}")
                count = cursor.fetchone()[0]
                if count > 0:
                    cursor.execute(f"SELECT * FROM {table_name} LIMIT 2")
                    sample = cursor.fetchall()
                    print(f"\n{table_name} (showing first 2 records):")
                    for row in sample:
                        print(f"  {row}")
            except sqlite3.OperationalError:
                print(f"  {table_name}: Table not found")
        
        conn.close()
        print("\n✅ Database analysis complete!")
        
    except Exception as e:
        print(f"❌ Error analyzing database: {e}")

if __name__ == "__main__":
    analyze_sqlite_db()
