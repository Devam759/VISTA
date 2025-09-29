"""
Room Model - Room Information
"""
from . import db
from datetime import datetime

class Room(db.Model):
    """Room model for room information"""
    
    __tablename__ = 'rooms'
    
    id = db.Column(db.Integer, primary_key=True)
    hostel_id = db.Column(db.Integer, db.ForeignKey('hostels.id'), nullable=False)
    room_number = db.Column(db.String(10), nullable=False)
    room_type = db.Column(db.String(20), nullable=False, default='Standard')  # Standard, AC, Deluxe
    capacity = db.Column(db.Integer, nullable=False, default=2)
    current_occupancy = db.Column(db.Integer, nullable=False, default=0)
    is_active = db.Column(db.Boolean, default=True, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relationships
    students = db.relationship('Student', backref='room')
    
    # Unique constraint on hostel_id and room_number
    __table_args__ = (db.UniqueConstraint('hostel_id', 'room_number', name='_hostel_room_uc'),)
    
    def __init__(self, hostel_id, room_number, room_type='Standard', capacity=2):
        self.hostel_id = hostel_id
        self.room_number = room_number.strip()
        self.room_type = room_type
        self.capacity = capacity
    
    def to_dict(self):
        """Convert to dictionary for JSON serialization"""
        return {
            'id': self.id,
            'hostel_id': self.hostel_id,
            'room_number': self.room_number,
            'room_type': self.room_type,
            'capacity': self.capacity,
            'current_occupancy': self.current_occupancy,
            'is_active': self.is_active,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'hostel_name': self.hostel.name if self.hostel else None
        }
    
    def __repr__(self):
        return f'<Room {self.room_number} in {self.hostel.name if self.hostel else "Unknown Hostel"}>'
