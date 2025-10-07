"""
Face Recognition API Endpoints
"""
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import db, User, Student, FaceEnrollment
from utils.face_recognition import FaceRecognitionManager
import json

face_bp = Blueprint('face', __name__)
face_manager = FaceRecognitionManager()

@face_bp.route('/enroll', methods=['POST'])
@jwt_required()
def enroll_face():
    """Enroll student face for recognition"""
    try:
        current_user_id = get_jwt_identity()
        current_user = User.query.get(current_user_id)
        
        data = request.get_json() or {}
        face_image = data.get('face_image')

        if not face_image:
            return jsonify({'error': 'Face image required'}), 400

        if current_user.role == 'Student':
            student = Student.query.filter_by(user_id=current_user_id).first()
            if not student:
                return jsonify({'error': 'Student record not found'}), 404
        else:
            student_id = data.get('student_id')
            if not student_id:
                return jsonify({'error': 'Student ID required'}), 400

            student = Student.query.get(student_id)
            if not student:
                return jsonify({'error': 'Student not found'}), 404
        
        # Process face enrollment
        enrollment_result = face_manager.enroll_face(face_image)
        
        if not enrollment_result['success']:
            return jsonify({'error': enrollment_result['reason']}), 400
        
        # Create face enrollment record
        face_enrollment = FaceEnrollment(
            student_id=student.id,
            face_encoding_data=json.dumps(enrollment_result['encoding']),
            confidence_score=enrollment_result['quality_score'],
            face_quality_score=enrollment_result['quality_score'],
            enrollment_method='Manual',
            created_by=current_user_id,
            notes=data.get('notes') or (
                'Face enrollment (self-service)' if current_user.role == 'Student'
                else 'Face enrollment via API'
            )
        )
        
        db.session.add(face_enrollment)
        db.session.commit()
        
        return jsonify({
            'message': 'Face enrolled successfully',
            'enrollment': face_enrollment.to_dict()
        })
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@face_bp.route('/verify', methods=['POST'])
@jwt_required()
def verify_face():
    """Verify face for attendance"""
    try:
        current_user_id = get_jwt_identity()
        current_user = User.query.get(current_user_id)
        
        # Only students can verify their face
        if current_user.role != 'Student':
            return jsonify({'error': 'Only students can verify face'}), 403
        
        data = request.get_json()
        
        if not data:
            return jsonify({'error': 'No data provided'}), 400
        
        face_image = data.get('face_image')
        
        if not face_image:
            return jsonify({'error': 'Face image required'}), 400
        
        # Get student record
        student = Student.query.filter_by(user_id=current_user_id).first()
        if not student:
            return jsonify({'error': 'Student record not found'}), 404
        
        # Get student's face encodings
        face_enrollments = FaceEnrollment.query.filter_by(
            student_id=student.id,
            is_active=True
        ).all()
        
        if not face_enrollments:
            return jsonify({'error': 'No face enrollment found for student'}), 404
        
        # Extract encodings
        known_encodings = []
        for enrollment in face_enrollments:
            try:
                encoding = json.loads(enrollment.face_encoding_data)
                known_encodings.append(encoding)
            except (json.JSONDecodeError, TypeError):
                continue
        
        if not known_encodings:
            return jsonify({'error': 'No valid face encodings found'}), 404
        
        # Process face verification
        verification_result = face_manager.process_attendance_image(face_image, known_encodings)
        
        return jsonify({
            'verification': verification_result
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@face_bp.route('/enrollments/<int:student_id>', methods=['GET'])
@jwt_required()
def get_face_enrollments(student_id):
    """Get face enrollments for a student"""
    try:
        current_user_id = get_jwt_identity()
        current_user = User.query.get(current_user_id)
        
        # Only Wardens can view enrollments
        if current_user.role == 'Student':
            return jsonify({'error': 'Access denied'}), 403
        
        # Check if student exists
        student = Student.query.get(student_id)
        if not student:
            return jsonify({'error': 'Student not found'}), 404
        
        enrollments = FaceEnrollment.query.filter_by(
            student_id=student_id,
            is_active=True
        ).order_by(FaceEnrollment.created_at.desc()).all()
        
        return jsonify({'enrollments': [enrollment.to_dict() for enrollment in enrollments]})
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@face_bp.route('/enrollments/<int:enrollment_id>', methods=['DELETE'])
@jwt_required()
def delete_face_enrollment(enrollment_id):
    """Delete face enrollment"""
    try:
        current_user_id = get_jwt_identity()
        current_user = User.query.get(current_user_id)
        
        # Only Wardens can delete enrollments
        if current_user.role == 'Student':
            return jsonify({'error': 'Access denied'}), 403
        
        enrollment = FaceEnrollment.query.get(enrollment_id)
        
        if not enrollment:
            return jsonify({'error': 'Face enrollment not found'}), 404
        
        # Soft delete (deactivate)
        enrollment.is_active = False
        db.session.commit()
        
        return jsonify({'message': 'Face enrollment deleted successfully'})
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500
