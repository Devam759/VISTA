"""
Attendance API Endpoints
"""
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import db, User, Student, Attendance, FaceEnrollment
from utils import GeofencingManager, Validators
from utils.face_attendance import FaceAttendanceValidator
from utils.face_recognition import FaceRecognitionManager
from datetime import datetime, date, time
import json

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
face_manager = FaceRecognitionManager()

@attendance_bp.route('/recent', methods=['GET'], strict_slashes=False)
@jwt_required()
def get_recent_attendance():
    """Get recent attendance activity"""
    try:
        current_user_id = int(get_jwt_identity())
        current_user = User.query.get(current_user_id)
        
        if not current_user:
            return jsonify({'error': 'User not found'}), 404
        
        # Get recent attendance records (last 10)
        recent_records = Attendance.query.order_by(
            Attendance.created_at.desc()
        ).limit(10).all()
        
        return jsonify({
            'activities': [record.to_dict() for record in recent_records]
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@attendance_bp.route('', methods=['GET'], strict_slashes=False)
@jwt_required()
def get_attendance():
    """Get attendance records"""
    try:
        current_user_id = int(get_jwt_identity())
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
        current_user_id = int(get_jwt_identity())
        current_user = User.query.get(current_user_id)
        
        if not current_user:
            return jsonify({'error': 'User not found'}), 404
        
        # Only students can mark attendance
        if current_user.role != 'Student':
            return jsonify({'error': 'Only students can mark attendance'}), 403
        
        data = request.get_json()
        
        if not data:
            return jsonify({'error': 'No data provided'}), 400

        face_image = data.get('face_image')
        if not face_image:
            return jsonify({'error': 'Face image required for attendance marking'}), 400
        
        # Validate face attendance payload
        validation = FaceAttendanceValidator.validate_submission(data)
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
        
        # Parse location data
        try:
            latitude = float(data['latitude'])
            longitude = float(data['longitude'])
            accuracy = float(data['accuracy']) if data.get('accuracy') is not None else None
        except (TypeError, ValueError):
            return jsonify({'error': 'Invalid location data provided'}), 400

        if not Validators.validate_gps_coordinates(latitude, longitude):
            return jsonify({'error': 'Invalid GPS coordinates'}), 400

        geofence_manager = GeofencingManager()
        location_verification = geofence_manager.verify_location(latitude, longitude, accuracy)

        if not location_verification.get('gps_verified'):
            return jsonify({
                'error': 'Location verification failed',
                'reason': location_verification.get('reason'),
                'distance': location_verification.get('distance')
            }), 403

        # Verify face image against enrolled encodings
        face_enrollments = FaceEnrollment.query.filter_by(
            student_id=student.id,
            is_active=True
        ).all()

        if not face_enrollments:
            return jsonify({'error': 'No active face enrollment found for student'}), 400

        known_encodings = []
        for enrollment in face_enrollments:
            try:
                encoding = json.loads(enrollment.face_encoding_data)
                if encoding:
                    known_encodings.append(encoding)
            except (json.JSONDecodeError, TypeError):
                continue

        if not known_encodings:
            return jsonify({'error': 'Face enrollment data is invalid'}), 400

        verification_result = face_manager.process_attendance_image(face_image, known_encodings)

        if not verification_result.get('success'):
            return jsonify({
                'error': 'Face verification failed',
                'reason': verification_result.get('reason'),
                'confidence': verification_result.get('confidence', 0.0)
            }), 400

        if not verification_result.get('match'):
            return jsonify({
                'error': 'Face does not match enrolled profile',
                'reason': verification_result.get('reason'),
                'confidence': verification_result.get('confidence', 0.0)
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
            verification_method='Face',
            confidence_score=verification_result.get('confidence', 0.0),
            wifi_verified=data.get('wifi_verified', False),
            gps_verified=True,
            latitude=latitude,
            longitude=longitude,
            accuracy=accuracy,
            notes=data.get('notes', 'Face verified attendance'),
            marked_by=current_user_id
        )
        
        db.session.add(attendance)
        db.session.commit()
        
        return jsonify({
            'message': 'Attendance marked successfully',
            'attendance': attendance.to_dict(),
            'verification': verification_result,
            'location_verification': location_verification
        })
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@attendance_bp.route('/stats', methods=['GET'])
@jwt_required()
def get_attendance_stats():
    """Get attendance statistics"""
    try:
        current_user_id = int(get_jwt_identity())
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

