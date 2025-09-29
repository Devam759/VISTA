"""
Hostel Model - Hostel Information
"""
from . import db
from datetime import datetime

class Hostel(db.Model):
    """Hostel model for hostel information"""
    
    __tablename__ = 'hostels'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), unique=True, nullable=False, index=True)
    type = db.Column(db.String(20), nullable=False, default='Boys')  # Boys, Girls
    warden_name = db.Column(db.String(100), nullable=True)
    warden_phone = db.Column(db.String(15), nullable=True)
    total_rooms = db.Column(db.Integer, nullable=False, default=0)
    total_capacity = db.Column(db.Integer, nullable=False, default=0)
    address = db.Column(db.Text, nullable=True)
    is_active = db.Column(db.Boolean, default=True, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relationships
    rooms = db.relationship('Room', backref='hostel', cascade='all, delete-orphan')
    
    def __init__(self, name, type='Boys', warden_name=None, warden_phone=None, 
                 total_rooms=0, total_capacity=0, address=None):
        self.name = name.strip()
        self.type = type
        self.warden_name = warden_name
        self.warden_phone = warden_phone
        self.total_rooms = total_rooms
        self.total_capacity = total_capacity
        self.address = address
    
    def to_dict(self):
        """Convert to dictionary for JSON serialization"""
        return {
            'id': self.id,
            'name': self.name,
            'type': self.type,
            'warden_name': self.warden_name,
            'warden_phone': self.warden_phone,
            'total_rooms': self.total_rooms,
            'total_capacity': self.total_capacity,
            'address': self.address,
            'is_active': self.is_active,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }
    
    def __repr__(self):
        return f'<Hostel {self.name}>'
