#!/usr/bin/env python3
"""
Create .env file for database configuration
"""

def create_env_file():
    """Create a .env file with database configuration"""
    
    print("Creating .env file for database configuration...")
    
    # Get database credentials from user
    print("\nPlease enter your MySQL database credentials:")
    print("(Press Enter for default values)")
    
    db_host = input("Database Host [localhost]: ").strip() or "localhost"
    db_user = input("Database User [root]: ").strip() or "root"
    db_password = input("Database Password (press Enter if no password): ").strip()
    db_name = input("Database Name [vista_attendance]: ").strip() or "vista_attendance"
    db_port = input("Database Port [3306]: ").strip() or "3306"
    
    # Create .env content
    env_content = f"""# VISTA Backend Environment Configuration
# Generated on {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}

# Database Configuration
DB_TYPE=mysql
DB_HOST={db_host}
DB_USER={db_user}
DB_PASSWORD={db_password}
DB_NAME={db_name}
DB_PORT={db_port}

# JWT Configuration
JWT_SECRET_KEY=vista-secret-key-change-in-production
JWT_ACCESS_TOKEN_EXPIRES=86400

# Flask Configuration
FLASK_DEBUG=True
PORT=8000

# Face Recognition Configuration
FACE_RECOGNITION_TOLERANCE=0.6
FACE_RECOGNITION_MODEL=hog

# GPS Configuration
HOSTEL_LATITUDE=26.2389
HOSTEL_LONGITUDE=73.0243
GPS_ACCURACY_RADIUS=100

# WiFi Configuration
REQUIRED_WIFI_SSID=JKLU-Hostel

# File Upload Configuration
UPLOAD_FOLDER=uploads
MAX_CONTENT_LENGTH=16777216
CSV_UPLOAD_FOLDER=uploads/csv
ALLOWED_CSV_EXTENSIONS=csv
MAX_CSV_SIZE=10485760

# Email Configuration
SMTP_SERVER=smtp.gmail.com
SMTP_PORT=587
SMTP_USERNAME=your-email@gmail.com
SMTP_PASSWORD=your-app-password

# Logging Configuration
LOG_LEVEL=INFO
LOG_FILE=logs/vista.log

# Attendance Configuration
ATTENDANCE_DEADLINE=22:30:00
MAX_LATE_MINUTES=30
"""
    
    # Write .env file
    with open('.env', 'w') as f:
        f.write(env_content)
    
    print(f"\n✅ .env file created successfully!")
    print(f"Database configuration saved.")
    print(f"\nNext steps:")
    print(f"1. Make sure MySQL is running")
    print(f"2. Run: python simple_db_setup.py")
    print(f"3. Or run: python csv_import_script.py '../public/FINAL SHEET OF BH-2.csv'")

if __name__ == "__main__":
    from datetime import datetime
    create_env_file()
