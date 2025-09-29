"""
Attendance Model - Attendance Records
"""
from . import db
from datetime import datetime, date, time

class Attendance(db.Model):
    """Attendance model for attendance records"""
    
    __tablename__ = 'attendance_records'
    
    id = db.Column(db.Integer, primary_key=True)
    student_id = db.Column(db.Integer, db.ForeignKey('students.id'), nullable=False)
    attendance_date = db.Column(db.Date, nullable=False)
    attendance_time = db.Column(db.Time, nullable=False)
    status = db.Column(db.String(20), nullable=False)  # Present, Late, Absent
    verification_method = db.Column(db.String(50), nullable=False, default='Manual')  # Manual, Face_Recognition
    confidence_score = db.Column(db.Float, nullable=False, default=0.0)
    wifi_verified = db.Column(db.Boolean, default=False, nullable=False)
    gps_verified = db.Column(db.Boolean, default=False, nullable=False)
    latitude = db.Column(db.Float, nullable=True)
    longitude = db.Column(db.Float, nullable=True)
    accuracy = db.Column(db.Float, nullable=True)
    notes = db.Column(db.Text, nullable=True)
    marked_by = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relationships
    marker = db.relationship('User', backref='marked_attendances', foreign_keys=[marked_by])
    
    # Unique constraint on student_id and attendance_date
    __table_args__ = (db.UniqueConstraint('student_id', 'attendance_date', name='_student_date_uc'),)
    
    def __init__(self, student_id, attendance_date, attendance_time, status, 
                 verification_method='Manual', confidence_score=0.0, 
                 wifi_verified=False, gps_verified=False, latitude=None, 
                 longitude=None, accuracy=None, notes=None, marked_by=None):
        self.student_id = student_id
        self.attendance_date = attendance_date
        self.attendance_time = attendance_time
        self.status = status
        self.verification_method = verification_method
        self.confidence_score = confidence_score
        self.wifi_verified = wifi_verified
        self.gps_verified = gps_verified
        self.latitude = latitude
        self.longitude = longitude
        self.accuracy = accuracy
        self.notes = notes
        self.marked_by = marked_by
    
    def to_dict(self):
        """Convert to dictionary for JSON serialization"""
        return {
            'id': self.id,
            'student_id': self.student_id,
            'attendance_date': self.attendance_date.isoformat() if self.attendance_date else None,
            'attendance_time': self.attendance_time.isoformat() if self.attendance_time else None,
            'status': self.status,
            'verification_method': self.verification_method,
            'confidence_score': self.confidence_score,
            'wifi_verified': self.wifi_verified,
            'gps_verified': self.gps_verified,
            'latitude': self.latitude,
            'longitude': self.longitude,
            'accuracy': self.accuracy,
            'notes': self.notes,
            'marked_by': self.marked_by,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'student': self.student.to_dict() if self.student else None,
            'marker': self.marker.to_dict() if self.marker else None
        }
    
    def __repr__(self):
        return f'<Attendance {self.student.roll_number if self.student else self.student_id} - {self.attendance_date}>'
