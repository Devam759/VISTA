"""
VISTA Attendance System - Configuration Settings
"""
import os
from datetime import timedelta
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

class Config:
    """Base configuration class"""
    
    # Flask Configuration
    SECRET_KEY = os.getenv('SECRET_KEY', 'vista-secret-key-change-in-production')
    
    # JWT Configuration
    JWT_SECRET_KEY = os.getenv('JWT_SECRET_KEY', SECRET_KEY)
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(hours=24)
    JWT_REFRESH_TOKEN_EXPIRES = timedelta(days=30)
    
    # Database Configuration
    DB_TYPE = os.getenv('DB_TYPE', 'sqlite')  # sqlite, mysql, postgresql
    DB_HOST = os.getenv('DB_HOST', 'localhost')
    DB_USER = os.getenv('DB_USER', '')
    DB_PASSWORD = os.getenv('DB_PASSWORD', '')
    DB_NAME = os.getenv('DB_NAME', 'vista_attendance')
    DB_PORT = int(os.getenv('DB_PORT', 3306))
    
    # SQLite Configuration (default)
    SQLALCHEMY_DATABASE_URI = os.getenv('DATABASE_URL', 'sqlite:///vista_attendance.db')
    
    # MySQL Configuration
    if DB_TYPE == 'mysql':
        SQLALCHEMY_DATABASE_URI = f'mysql+pymysql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}'
    
    # PostgreSQL Configuration
    if DB_TYPE == 'postgresql':
        SQLALCHEMY_DATABASE_URI = f'postgresql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}'
    
    # SQLAlchemy Configuration
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SQLALCHEMY_ENGINE_OPTIONS = {
        'pool_pre_ping': True,
        'pool_recycle': 300,
    }
    
    # Face Recognition Configuration
    FACE_RECOGNITION_TOLERANCE = float(os.getenv('FACE_RECOGNITION_TOLERANCE', 0.6))
    FACE_RECOGNITION_MODEL = os.getenv('FACE_RECOGNITION_MODEL', 'hog')
    
    # GPS / Geofencing Configuration
    CAMPUS_LATITUDE = float(os.getenv('CAMPUS_LATITUDE', 26.8351))
    CAMPUS_LONGITUDE = float(os.getenv('CAMPUS_LONGITUDE', 75.6508))
    GPS_ACCURACY_RADIUS = int(os.getenv('GPS_ACCURACY_RADIUS', 100))
    CAMPUS_POLYGON = os.getenv('CAMPUS_POLYGON', '')  # JSON array of [lat, lon]
    
    # WiFi Configuration
    REQUIRED_WIFI_SSID = os.getenv('REQUIRED_WIFI_SSID', 'JKLU-Hostel')
    
    # File Upload Configuration
    UPLOAD_FOLDER = os.getenv('UPLOAD_FOLDER', 'uploads')
    MAX_CONTENT_LENGTH = int(os.getenv('MAX_CONTENT_LENGTH', 16777216))  # 16MB
    ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif', 'csv'}
    
    # Attendance Configuration
    ATTENDANCE_DEADLINE = os.getenv('ATTENDANCE_DEADLINE', '22:30:00')
    MAX_LATE_MINUTES = int(os.getenv('MAX_LATE_MINUTES', 30))
    
    # Logging Configuration
    LOG_LEVEL = os.getenv('LOG_LEVEL', 'INFO')
    LOG_FILE = os.getenv('LOG_FILE', 'logs/vista.log')

class DevelopmentConfig(Config):
    """Development configuration"""
    DEBUG = True
    FLASK_ENV = 'development'
    LOG_LEVEL = 'DEBUG'

class ProductionConfig(Config):
    """Production configuration"""
    DEBUG = False
    FLASK_ENV = 'production'
    LOG_LEVEL = 'WARNING'

class TestingConfig(Config):
    """Testing configuration"""
    TESTING = True
    SQLALCHEMY_DATABASE_URI = 'sqlite:///:memory:'
    WTF_CSRF_ENABLED = False

# Configuration mapping
config = {
    'development': DevelopmentConfig,
    'production': ProductionConfig,
    'testing': TestingConfig,
    'default': DevelopmentConfig
}

def get_config():
    """Get configuration based on environment"""
    return config.get(os.getenv('FLASK_ENV', 'default'), DevelopmentConfig)
