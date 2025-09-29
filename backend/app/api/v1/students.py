"""
Students API Endpoints
"""
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import db, User, Student, Hostel, Room
from utils.validators import Validators

students_bp = Blueprint('students', __name__)

@students_bp.route('/', methods=['GET'])
@jwt_required()
def get_students():
    """Get students list with optional hostel filter"""
    try:
        current_user_id = get_jwt_identity()
        current_user = User.query.get(current_user_id)
        
        if not current_user:
            return jsonify({'error': 'User not found'}), 404
        
        hostel_filter = request.args.get('hostel', 'All Hostels')
        
        if current_user.role == 'Student':
            # Students can only see their own data
            student = Student.query.filter_by(user_id=current_user_id).first()
            if student:
                students = [student]
            else:
                students = []
        else:
            # Wardens can see all students
            if hostel_filter != 'All Hostels':
                hostel = Hostel.query.filter_by(name=hostel_filter).first()
                if hostel:
                    students = Student.query.filter_by(hostel_id=hostel.id).all()
                else:
                    students = []
            else:
                students = Student.query.all()
        
        return jsonify({'students': [student.to_dict() for student in students]})
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@students_bp.route('/', methods=['POST'])
@jwt_required()
def create_student():
    """Create new student"""
    try:
        current_user_id = get_jwt_identity()
        current_user = User.query.get(current_user_id)
        
        # Only Wardens can create students
        if current_user.role == 'Student':
            return jsonify({'error': 'Access denied'}), 403
        
        data = request.get_json()
        
        if not data:
            return jsonify({'error': 'No data provided'}), 400
        
        # Validate input data
        validation = Validators.validate_student_data(data)
        if not validation['valid']:
            return jsonify({'error': 'Validation failed', 'details': validation['errors']}), 400
        
        # Sanitize input
        data = Validators.sanitize_input(data)
        
        # Check if student already exists
        existing_student = Student.query.filter_by(roll_number=data['roll_number']).first()
        if existing_student:
            return jsonify({'error': 'Student with this roll number already exists'}), 409
        
        # Create user first
        user = User(
            email=data['email'],
            password=data.get('password', 'defaultpassword123'),  # Default password
            first_name=data['first_name'],
            last_name=data['last_name'],
            role='Student',
            phone=data.get('phone')
        )
        
        db.session.add(user)
        db.session.flush()  # Get user ID
        
        # Create student
        student = Student(
            user_id=user.id,
            roll_number=data['roll_number'],
            hostel_id=data['hostel_id'],
            course=data.get('course', 'B.Tech'),
            branch=data.get('branch', 'Computer Science'),
            semester=data.get('semester', 1),
            admission_year=data.get('admission_year', 2023),
            room_id=data.get('room_id')
        )
        
        db.session.add(student)
        db.session.commit()
        
        return jsonify({
            'student': student.to_dict(),
            'message': 'Student created successfully'
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@students_bp.route('/<int:student_id>', methods=['GET'])
@jwt_required()
def get_student(student_id):
    """Get specific student by ID"""
    try:
        current_user_id = get_jwt_identity()
        current_user = User.query.get(current_user_id)
        
        if not current_user:
            return jsonify({'error': 'User not found'}), 404
        
        student = Student.query.get(student_id)
        
        if not student:
            return jsonify({'error': 'Student not found'}), 404
        
        # Students can only see their own data
        if current_user.role == 'Student' and student.user_id != current_user_id:
            return jsonify({'error': 'Access denied'}), 403
        
        return jsonify({'student': student.to_dict()})
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@students_bp.route('/<int:student_id>', methods=['PUT'])
@jwt_required()
def update_student(student_id):
    """Update student information"""
    try:
        current_user_id = get_jwt_identity()
        current_user = User.query.get(current_user_id)
        
        # Only Wardens can update students
        if current_user.role == 'Student':
            return jsonify({'error': 'Access denied'}), 403
        
        student = Student.query.get(student_id)
        
        if not student:
            return jsonify({'error': 'Student not found'}), 404
        
        data = request.get_json()
        
        if not data:
            return jsonify({'error': 'No data provided'}), 400
        
        # Update student fields
        if 'course' in data:
            student.course = data['course']
        if 'branch' in data:
            student.branch = data['branch']
        if 'semester' in data:
            student.semester = data['semester']
        if 'hostel_id' in data:
            student.hostel_id = data['hostel_id']
        if 'room_id' in data:
            student.room_id = data['room_id']
        if 'is_active' in data:
            student.is_active = data['is_active']
        
        # Update user fields
        if student.user:
            if 'first_name' in data:
                student.user.first_name = data['first_name']
            if 'last_name' in data:
                student.user.last_name = data['last_name']
            if 'phone' in data:
                student.user.phone = data['phone']
        
        db.session.commit()
        
        return jsonify({
            'student': student.to_dict(),
            'message': 'Student updated successfully'
        })
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@students_bp.route('/<int:student_id>', methods=['DELETE'])
@jwt_required()
def delete_student(student_id):
    """Delete student"""
    try:
        current_user_id = get_jwt_identity()
        current_user = User.query.get(current_user_id)
        
        # Only Wardens can delete students
        if current_user.role != 'Warden':
            return jsonify({'error': 'Access denied'}), 403
        
        student = Student.query.get(student_id)
        
        if not student:
            return jsonify({'error': 'Student not found'}), 404
        
        # Delete student (user will be deleted due to cascade)
        db.session.delete(student)
        db.session.commit()
        
        return jsonify({'message': 'Student deleted successfully'})
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500
