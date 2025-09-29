"""
Student Model - Student Information
"""
from . import db
from datetime import datetime

class Student(db.Model):
    """Student model for student information"""
    
    __tablename__ = 'students'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False, unique=True)
    roll_number = db.Column(db.String(20), unique=True, nullable=False, index=True)
    hostel_id = db.Column(db.Integer, db.ForeignKey('hostels.id'), nullable=False)
    room_id = db.Column(db.Integer, db.ForeignKey('rooms.id'), nullable=True)
    course = db.Column(db.String(50), nullable=False, default='B.Tech')
    branch = db.Column(db.String(100), nullable=False)
    semester = db.Column(db.Integer, nullable=False, default=1)
    admission_year = db.Column(db.Integer, nullable=False)
    is_active = db.Column(db.Boolean, default=True, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relationships
    hostel = db.relationship('Hostel', backref='students')
    room = db.relationship('Room', backref='students')
    attendance_records = db.relationship('Attendance', backref='student', cascade='all, delete-orphan')
    face_enrollments = db.relationship('FaceEnrollment', backref='student', cascade='all, delete-orphan')
    
    def __init__(self, user_id, roll_number, hostel_id, course='B.Tech', branch='Computer Science', 
                 semester=1, admission_year=2023, room_id=None):
        self.user_id = user_id
        self.roll_number = roll_number.upper().strip()
        self.hostel_id = hostel_id
        self.room_id = room_id
        self.course = course
        self.branch = branch
        self.semester = semester
        self.admission_year = admission_year
    
    def to_dict(self):
        """Convert to dictionary for JSON serialization"""
        return {
            'id': self.id,
            'user_id': self.user_id,
            'roll_number': self.roll_number,
            'hostel_id': self.hostel_id,
            'room_id': self.room_id,
            'course': self.course,
            'branch': self.branch,
            'semester': self.semester,
            'admission_year': self.admission_year,
            'is_active': self.is_active,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'hostel_name': self.hostel.name if self.hostel else None,
            'room_number': self.room.room_number if self.room else None,
            'user': self.user.to_dict() if self.user else None
        }
    
    def __repr__(self):
        return f'<Student {self.roll_number}>'
