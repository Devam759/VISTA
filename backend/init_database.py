"""
VISTA Attendance System - Database Initialization Script
This script creates all database tables for production use
"""
import os
import sys
from app import create_app
from models import db, User, Student, Hostel, Room, Attendance, FaceEnrollment

def init_database():
    """Initialize database with all tables"""
    app = create_app()
    
    with app.app_context():
        print("=" * 60)
        print("VISTA Attendance System - Database Initialization")
        print("=" * 60)
        
        # Drop all tables (use with caution!)
        drop_choice = input("\n⚠️  Drop existing tables? (yes/no): ").lower()
        if drop_choice == 'yes':
            print("\n🗑️  Dropping all existing tables...")
            db.drop_all()
            print("✅ Tables dropped successfully")
        
        # Create all tables
        print("\n📦 Creating database tables...")
        db.create_all()
        print("✅ All tables created successfully!")
        
        # List all created tables
        print("\n📋 Created Tables:")
        print("-" * 60)
        inspector = db.inspect(db.engine)
        for table_name in inspector.get_table_names():
            # Get row count for each table
            result = db.session.execute(db.text(f"SELECT COUNT(*) FROM {table_name}"))
            count = result.scalar()
            print(f"  ✓ {table_name} ({count} records)")
        
        print("\n" + "=" * 60)
        print("Database Schema Ready!")
        print("=" * 60)
        print("\n💡 Next Steps:")
        print("  1. Use the admin panel or API to add hostels")
        print("  2. Add rooms to hostels")
        print("  3. Register users (students, wardens, admins)")
        print("  5. Start marking attendance!")
        
        print("\n" + "=" * 60)
        print("Database initialization completed successfully! 🎉")
        print("=" * 60)

if __name__ == '__main__':
    init_database()
