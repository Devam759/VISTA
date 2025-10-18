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
    
    # GPS / Geofencing Configuration - Updated with campus polygon
    CAMPUS_LATITUDE = float(os.getenv('CAMPUS_LATITUDE', 26.834905))
    CAMPUS_LONGITUDE = float(os.getenv('CAMPUS_LONGITUDE', 75.651078))
    GPS_ACCURACY_RADIUS = int(os.getenv('GPS_ACCURACY_RADIUS', 150))
    CAMPUS_POLYGON = os.getenv('CAMPUS_POLYGON', '[[26.835786216245545, 75.65131165087223], [26.837407397333223, 75.65114535391331], [26.836622388388918, 75.64845744520426], [26.836051578163385, 75.64818117767572], [26.835461618240164, 75.65019752830267], [26.834609880617364, 75.65087344497442], [26.834014228898674, 75.651178881526], [26.83333241176029, 75.65138272941113], [26.832626058039946, 75.65278552472591], [26.833887678682544, 75.65269734710455], [26.834122828616806, 75.6522286310792], [26.83494166115547, 75.6524958461523]]')  # JSON array of [lat, lon]
    
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
