"""
VISTA Attendance System - Database Models
"""
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

db = SQLAlchemy()

# Import all models here
from .user import User
from .student import Student
from .hostel import Hostel
from .room import Room
from .attendance import Attendance
from .face_enrollment import FaceEnrollment

__all__ = [
    'db',
    'User',
    'Student', 
    'Hostel',
    'Room',
    'Attendance',
    'FaceEnrollment'
]
