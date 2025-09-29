"""
Hostels API Endpoints
"""
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import db, User, Hostel, Room, Student

hostels_bp = Blueprint('hostels', __name__)

@hostels_bp.route('/', methods=['GET'])
@jwt_required()
def get_hostels():
    """Get hostels list"""
    try:
        current_user_id = get_jwt_identity()
        current_user = User.query.get(current_user_id)
        
        # Only Wardens can access
        if current_user.role == 'Student':
            return jsonify({'error': 'Access denied'}), 403
        
        hostels = Hostel.query.filter_by(is_active=True).order_by(Hostel.name).all()
        
        return jsonify({'hostels': [hostel.to_dict() for hostel in hostels]})
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@hostels_bp.route('/', methods=['POST'])
@jwt_required()
def create_hostel():
    """Create new hostel"""
    try:
        current_user_id = get_jwt_identity()
        current_user = User.query.get(current_user_id)
        
        # Only Wardens can create hostels
        if current_user.role != 'Warden':
            return jsonify({'error': 'Access denied'}), 403
        
        data = request.get_json()
        
        if not data:
            return jsonify({'error': 'No data provided'}), 400
        
        # Required fields
        required_fields = ['name', 'type']
        for field in required_fields:
            if field not in data or not data[field]:
                return jsonify({'error': f'{field} is required'}), 400
        
        # Check if hostel already exists
        existing_hostel = Hostel.query.filter_by(name=data['name']).first()
        if existing_hostel:
            return jsonify({'error': 'Hostel with this name already exists'}), 409
        
        # Create new hostel
        hostel = Hostel(
            name=data['name'].strip(),
            type=data['type'],
            warden_name=data.get('warden_name'),
            warden_phone=data.get('warden_phone'),
            total_rooms=data.get('total_rooms', 0),
            total_capacity=data.get('total_capacity', 0),
            address=data.get('address')
        )
        
        db.session.add(hostel)
        db.session.commit()
        
        return jsonify({
            'hostel': hostel.to_dict(),
            'message': 'Hostel created successfully'
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@hostels_bp.route('/<int:hostel_id>', methods=['GET'])
@jwt_required()
def get_hostel(hostel_id):
    """Get specific hostel by ID"""
    try:
        current_user_id = get_jwt_identity()
        current_user = User.query.get(current_user_id)
        
        # Only Wardens can access
        if current_user.role == 'Student':
            return jsonify({'error': 'Access denied'}), 403
        
        hostel = Hostel.query.get(hostel_id)
        
        if not hostel:
            return jsonify({'error': 'Hostel not found'}), 404
        
        return jsonify({'hostel': hostel.to_dict()})
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@hostels_bp.route('/<int:hostel_id>/rooms', methods=['GET'])
@jwt_required()
def get_hostel_rooms(hostel_id):
    """Get rooms for a specific hostel"""
    try:
        current_user_id = get_jwt_identity()
        current_user = User.query.get(current_user_id)
        
        # Only Wardens can access
        if current_user.role == 'Student':
            return jsonify({'error': 'Access denied'}), 403
        
        hostel = Hostel.query.get(hostel_id)
        
        if not hostel:
            return jsonify({'error': 'Hostel not found'}), 404
        
        rooms = Room.query.filter_by(hostel_id=hostel_id, is_active=True).order_by(Room.room_number).all()
        
        return jsonify({'rooms': [room.to_dict() for room in rooms]})
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@hostels_bp.route('/<int:hostel_id>/students', methods=['GET'])
@jwt_required()
def get_hostel_students(hostel_id):
    """Get students for a specific hostel"""
    try:
        current_user_id = get_jwt_identity()
        current_user = User.query.get(current_user_id)
        
        # Only Wardens can access
        if current_user.role == 'Student':
            return jsonify({'error': 'Access denied'}), 403
        
        hostel = Hostel.query.get(hostel_id)
        
        if not hostel:
            return jsonify({'error': 'Hostel not found'}), 404
        
        students = Student.query.filter_by(hostel_id=hostel_id, is_active=True).all()
        
        return jsonify({'students': [student.to_dict() for student in students]})
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@hostels_bp.route('/<int:hostel_id>/rooms', methods=['POST'])
@jwt_required()
def create_room():
    """Create new room in hostel"""
    try:
        current_user_id = get_jwt_identity()
        current_user = User.query.get(current_user_id)
        
        # Only Wardens can create rooms
        if current_user.role == 'Student':
            return jsonify({'error': 'Access denied'}), 403
        
        hostel_id = request.view_args['hostel_id']
        
        data = request.get_json()
        
        if not data:
            return jsonify({'error': 'No data provided'}), 400
        
        # Required fields
        if 'room_number' not in data or not data['room_number']:
            return jsonify({'error': 'room_number is required'}), 400
        
        # Check if hostel exists
        hostel = Hostel.query.get(hostel_id)
        if not hostel:
            return jsonify({'error': 'Hostel not found'}), 404
        
        # Check if room already exists in this hostel
        existing_room = Room.query.filter_by(
            hostel_id=hostel_id,
            room_number=data['room_number']
        ).first()
        
        if existing_room:
            return jsonify({'error': 'Room with this number already exists in this hostel'}), 409
        
        # Create new room
        room = Room(
            hostel_id=hostel_id,
            room_number=data['room_number'].strip(),
            room_type=data.get('room_type', 'Standard'),
            capacity=data.get('capacity', 2)
        )
        
        db.session.add(room)
        db.session.commit()
        
        return jsonify({
            'room': room.to_dict(),
            'message': 'Room created successfully'
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500
