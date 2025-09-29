"""
Face Enrollment Model - Face Recognition Data
"""
from . import db
from datetime import datetime

class FaceEnrollment(db.Model):
    """Face enrollment model for face recognition data"""
    
    __tablename__ = 'face_enrollments'
    
    id = db.Column(db.Integer, primary_key=True)
    student_id = db.Column(db.Integer, db.ForeignKey('students.id'), nullable=False)
    face_image_path = db.Column(db.String(255), nullable=True)
    face_encoding_data = db.Column(db.Text, nullable=True)  # JSON string of face encoding
    confidence_score = db.Column(db.Float, nullable=False, default=0.0)
    face_quality_score = db.Column(db.Float, nullable=False, default=0.0)
    enrollment_method = db.Column(db.String(50), nullable=False, default='Manual')  # Manual, Automatic
    is_active = db.Column(db.Boolean, default=True, nullable=False)
    created_by = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=True)
    notes = db.Column(db.Text, nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    creator = db.relationship('User', backref='created_face_enrollments')
    
    def __init__(self, student_id, face_image_path=None, face_encoding_data=None, 
                 confidence_score=0.0, face_quality_score=0.0, enrollment_method='Manual',
                 created_by=None, notes=None):
        self.student_id = student_id
        self.face_image_path = face_image_path
        self.face_encoding_data = face_encoding_data
        self.confidence_score = confidence_score
        self.face_quality_score = face_quality_score
        self.enrollment_method = enrollment_method
        self.created_by = created_by
        self.notes = notes
    
    def to_dict(self):
        """Convert to dictionary for JSON serialization"""
        return {
            'id': self.id,
            'student_id': self.student_id,
            'face_image_path': self.face_image_path,
            'face_encoding_data': self.face_encoding_data,
            'confidence_score': self.confidence_score,
            'face_quality_score': self.face_quality_score,
            'enrollment_method': self.enrollment_method,
            'is_active': self.is_active,
            'created_by': self.created_by,
            'notes': self.notes,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None,
            'student': self.student.to_dict() if self.student else None,
            'creator': self.creator.to_dict() if self.creator else None
        }
    
    def __repr__(self):
        return f'<FaceEnrollment {self.student.roll_number if self.student else self.student_id}>'
