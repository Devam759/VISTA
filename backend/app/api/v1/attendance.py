"""
Attendance API Endpoints
"""
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import db, User, Student, Attendance
from utils.validators import Validators
from utils.geofencing import GeofencingManager
from datetime import datetime, date, time

def parse_date_string(date_string):
    """Parse date string in DD/MM/YYYY format to date object"""
    try:
        # Try DD/MM/YYYY format first
        return datetime.strptime(date_string, '%d/%m/%Y').date()
    except ValueError:
        try:
            # Fallback to YYYY-MM-DD format for backward compatibility
            return datetime.strptime(date_string, '%Y-%m-%d').date()
        except ValueError:
            raise ValueError('Invalid date format. Use DD/MM/YYYY or YYYY-MM-DD')

def format_date_for_response(date_obj):
    """Format date object to DD/MM/YYYY string"""
    return date_obj.strftime('%d/%m/%Y')

attendance_bp = Blueprint('attendance', __name__)
geofencing_manager = GeofencingManager()

@attendance_bp.route('/', methods=['GET'])
@jwt_required()
def get_attendance():
    """Get attendance records"""
    try:
        current_user_id = get_jwt_identity()
        current_user = User.query.get(current_user_id)
        
        if not current_user:
            return jsonify({'error': 'User not found'}), 404
        
        date_filter = request.args.get('date', '')
        status_filter = request.args.get('status', 'All')
        
        if current_user.role == 'Student':
            # Students can only see their own attendance
            student = Student.query.filter_by(user_id=current_user_id).first()
            if not student:
                return jsonify({'error': 'Student record not found'}), 404
            
            query = Attendance.query.filter_by(student_id=student.id)
            
            if date_filter:
                try:
                    filter_date = parse_date_string(date_filter)
                    query = query.filter_by(attendance_date=filter_date)
                except ValueError as e:
                    return jsonify({'error': str(e)}), 400
            
            if status_filter != 'All':
                query = query.filter_by(status=status_filter)
            
            records = query.order_by(Attendance.attendance_date.desc(), Attendance.attendance_time.desc()).all()
            
        else:
            # Wardens can see all attendance
            query = Attendance.query
            
            if date_filter:
                try:
                    filter_date = parse_date_string(date_filter)
                    query = query.filter_by(attendance_date=filter_date)
                except ValueError as e:
                    return jsonify({'error': str(e)}), 400
            
            if status_filter != 'All':
                query = query.filter_by(status=status_filter)
            
            records = query.order_by(Attendance.attendance_date.desc(), Attendance.attendance_time.desc()).all()
        
        return jsonify({'attendance': [record.to_dict() for record in records]})
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@attendance_bp.route('/mark', methods=['POST'])
@jwt_required()
def mark_attendance():
    """Mark attendance for a student"""
    try:
        current_user_id = get_jwt_identity()
        current_user = User.query.get(current_user_id)
        
        if not current_user:
            return jsonify({'error': 'User not found'}), 404
        
        # Only students can mark attendance
        if current_user.role != 'Student':
            return jsonify({'error': 'Only students can mark attendance'}), 403
        
        data = request.get_json()
        
        if not data:
            return jsonify({'error': 'No data provided'}), 400
        
        # Validate attendance data
        validation = Validators.validate_attendance_data(data)
        if not validation['valid']:
            return jsonify({'error': 'Validation failed', 'details': validation['errors']}), 400
        
        # Get student record
        student = Student.query.filter_by(user_id=current_user_id).first()
        if not student:
            return jsonify({'error': 'Student record not found'}), 404
        
        # Check if attendance already marked for today
        today = date.today()
        existing_attendance = Attendance.query.filter_by(
            student_id=student.id,
            attendance_date=today
        ).first()
        
        if existing_attendance:
            return jsonify({'error': 'Attendance already marked for today'}), 400
        
        # Verify GPS location
        location_validation = geofencing_manager.validate_attendance_location(
            data['latitude'],
            data['longitude'],
            data.get('accuracy')
        )
        
        if not location_validation['gps_verified']:
            return jsonify({
                'error': 'Location verification failed',
                'reason': location_validation['reason'],
                'distance': location_validation.get('distance')
            }), 400
        
        # Determine status based on time
        current_time = datetime.now().time()
        deadline_time = time(22, 30, 0)  # 22:30:00
        
        if current_time <= deadline_time:
            status = 'Present'
        else:
            status = 'Late'
        
        # Create attendance record
        attendance = Attendance(
            student_id=student.id,
            attendance_date=today,
            attendance_time=current_time,
            status=status,
            verification_method=data.get('verification_method', 'Manual'),
            confidence_score=data.get('confidence_score', 0.0),
            wifi_verified=data.get('wifi_verified', False),
            gps_verified=location_validation['gps_verified'],
            latitude=data['latitude'],
            longitude=data['longitude'],
            accuracy=data.get('accuracy'),
            notes=data.get('notes', ''),
            marked_by=current_user_id
        )
        
        db.session.add(attendance)
        db.session.commit()
        
        return jsonify({
            'message': 'Attendance marked successfully',
            'attendance': attendance.to_dict()
        })
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@attendance_bp.route('/stats', methods=['GET'])
@jwt_required()
def get_attendance_stats():
    """Get attendance statistics"""
    try:
        current_user_id = get_jwt_identity()
        current_user = User.query.get(current_user_id)
        
        # Only Wardens can view stats
        if current_user.role == 'Student':
            return jsonify({'error': 'Access denied'}), 403
        
        date_filter = request.args.get('date', '')
        
        if not date_filter:
            return jsonify({'error': 'Date parameter is required'}), 400
        
        try:
            filter_date = parse_date_string(date_filter)
        except ValueError as e:
            return jsonify({'error': str(e)}), 400
        
        # Get total students
        total_students = Student.query.filter_by(is_active=True).count()
        
        # Get attendance records for the date
        attendance_records = Attendance.query.filter_by(attendance_date=filter_date).all()
        
        # Calculate statistics
        present_count = sum(1 for record in attendance_records if record.status == 'Present')
        late_count = sum(1 for record in attendance_records if record.status == 'Late')
        absent_count = total_students - len(attendance_records)
        
        return jsonify({
            'date': format_date_for_response(filter_date),
            'total_students': total_students,
            'present': present_count,
            'late': late_count,
            'absent': absent_count,
            'attendance_percentage': round((len(attendance_records) / total_students * 100), 2) if total_students > 0 else 0
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@attendance_bp.route('/verify-location', methods=['POST'])
@jwt_required()
def verify_location():
    """Verify if location is within campus boundary"""
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({'error': 'No data provided'}), 400
        
        latitude = data.get('latitude')
        longitude = data.get('longitude')
        accuracy = data.get('accuracy')
        
        if latitude is None or longitude is None:
            return jsonify({'error': 'Latitude and longitude are required'}), 400
        
        # Validate GPS coordinates
        if not Validators.validate_gps_coordinates(latitude, longitude):
            return jsonify({'error': 'Invalid GPS coordinates'}), 400
        
        # Verify location
        result = geofencing_manager.validate_attendance_location(latitude, longitude, accuracy)
        
        return jsonify(result)
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500
