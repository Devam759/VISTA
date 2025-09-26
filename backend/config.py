"""
VISTA Backend Configuration
Environment variables and application settings
"""

import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

class Config:
    """Base configuration class"""
    
    # Database Configuration
    DB_TYPE = os.getenv('DB_TYPE', 'mysql')  # mysql or postgresql
    DB_HOST = os.getenv('DB_HOST', 'localhost')
    DB_USER = os.getenv('DB_USER', 'root')
    DB_PASSWORD = os.getenv('DB_PASSWORD', '')
    DB_NAME = os.getenv('DB_NAME', 'vista_attendance')
    DB_PORT = int(os.getenv('DB_PORT', 3306))
    
    # PostgreSQL specific
    DB_SSLMODE = os.getenv('DB_SSLMODE', 'prefer')
    
    # JWT Configuration
    JWT_SECRET_KEY = os.getenv('JWT_SECRET_KEY', 'vista-secret-key-change-in-production')
    JWT_ACCESS_TOKEN_EXPIRES = int(os.getenv('JWT_ACCESS_TOKEN_EXPIRES', 86400))  # 24 hours
    
    # Flask Configuration
    FLASK_DEBUG = os.getenv('FLASK_DEBUG', 'False').lower() == 'true'
    PORT = int(os.getenv('PORT', 8000))
    
    # Face Recognition Configuration
    FACE_RECOGNITION_TOLERANCE = float(os.getenv('FACE_RECOGNITION_TOLERANCE', 0.6))
    FACE_RECOGNITION_MODEL = os.getenv('FACE_RECOGNITION_MODEL', 'hog')
    
    # GPS Configuration
    HOSTEL_LATITUDE = float(os.getenv('HOSTEL_LATITUDE', 26.2389))
    HOSTEL_LONGITUDE = float(os.getenv('HOSTEL_LONGITUDE', 73.0243))
    GPS_ACCURACY_RADIUS = int(os.getenv('GPS_ACCURACY_RADIUS', 100))
    
    # WiFi Configuration
    REQUIRED_WIFI_SSID = os.getenv('REQUIRED_WIFI_SSID', 'JKLU-Hostel')
    
    # File Upload Configuration
    UPLOAD_FOLDER = os.getenv('UPLOAD_FOLDER', 'uploads')
    MAX_CONTENT_LENGTH = int(os.getenv('MAX_CONTENT_LENGTH', 16777216))  # 16MB
    
    # CSV Upload Configuration
    CSV_UPLOAD_FOLDER = os.getenv('CSV_UPLOAD_FOLDER', 'uploads/csv')
    ALLOWED_CSV_EXTENSIONS = {'csv'}
    MAX_CSV_SIZE = int(os.getenv('MAX_CSV_SIZE', 10485760))  # 10MB
    
    # Email Configuration
    SMTP_SERVER = os.getenv('SMTP_SERVER', 'smtp.gmail.com')
    SMTP_PORT = int(os.getenv('SMTP_PORT', 587))
    SMTP_USERNAME = os.getenv('SMTP_USERNAME', '')
    SMTP_PASSWORD = os.getenv('SMTP_PASSWORD', '')
    
    # Logging Configuration
    LOG_LEVEL = os.getenv('LOG_LEVEL', 'INFO')
    LOG_FILE = os.getenv('LOG_FILE', 'logs/vista.log')
    
    # Attendance Configuration
    ATTENDANCE_DEADLINE = os.getenv('ATTENDANCE_DEADLINE', '22:30:00')
    MAX_LATE_MINUTES = int(os.getenv('MAX_LATE_MINUTES', 30))
    
    @staticmethod
    def get_database_config():
        """Get database configuration dictionary"""
        if Config.DB_TYPE == 'postgresql':
            return {
                'host': Config.DB_HOST,
                'user': Config.DB_USER,
                'password': Config.DB_PASSWORD,
                'database': Config.DB_NAME,
                'port': Config.DB_PORT,
                'sslmode': Config.DB_SSLMODE
            }
        else:  # MySQL
            return {
                'host': Config.DB_HOST,
                'user': Config.DB_USER,
                'password': Config.DB_PASSWORD,
                'database': Config.DB_NAME,
                'port': Config.DB_PORT
            }

class DevelopmentConfig(Config):
    """Development configuration"""
    FLASK_DEBUG = True
    LOG_LEVEL = 'DEBUG'

class ProductionConfig(Config):
    """Production configuration"""
    FLASK_DEBUG = False
    LOG_LEVEL = 'WARNING'

class TestingConfig(Config):
    """Testing configuration"""
    FLASK_DEBUG = True
    DB_NAME = 'vista_attendance_test'
    LOG_LEVEL = 'DEBUG'

# Configuration mapping
config = {
    'development': DevelopmentConfig,
    'production': ProductionConfig,
    'testing': TestingConfig,
    'default': DevelopmentConfig
}
