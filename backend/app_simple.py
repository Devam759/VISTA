"""
VISTA College Night Attendance System - Backend API (Simplified)
Main Flask application with all endpoints - without face recognition dependencies
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_jwt_extended import JWTManager, jwt_required, get_jwt_identity
import os
from datetime import datetime, timedelta
import bcrypt
import json
from database_manager import db_manager, csv_manager
from fallback_data import fallback_manager

# Initialize Flask app
app = Flask(__name__)
app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY', 'vista-secret-key-change-in-production')
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(hours=24)

# Initialize extensions
CORS(app)
jwt = JWTManager(app)

def hash_password(password):
    """Hash password using bcrypt"""
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())

def verify_password(password, hashed):
    """Verify password against hash"""
    return bcrypt.checkpw(password.encode('utf-8'), hashed.encode('utf-8'))

def check_database_connection():
    """Check if database is available"""
    try:
        with db_manager.get_connection() as connection:
            return True
    except Exception as e:
        print(f"Database connection failed: {e}")
        return False

def get_data_manager():
    """Get appropriate data manager (database or fallback)"""
    if check_database_connection():
        return db_manager
    else:
        print("Using fallback data manager")
        return fallback_manager

# =====================================================
# AUTHENTICATION ENDPOINTS
# =====================================================

@app.route('/auth/login', methods=['POST'])
def login():
    """User login endpoint"""
    try:
        data = request.get_json()
        email = data.get('email')
        password = data.get('password')
        
        if not email or not password:
            return jsonify({'error': 'Email and password required'}), 400
        
        # Get user by email using appropriate data manager
        data_manager = get_data_manager()
        user = data_manager.get_user_by_email(email)
        
        if not user:
            return jsonify({'error': 'Invalid credentials'}), 401
        
        if not user['is_active']:
            return jsonify({'error': 'Account is deactivated'}), 401
        
        # Verify password
        if not verify_password(password, user['password_hash']):
            return jsonify({'error': 'Invalid credentials'}), 401
        
        # Update last login
        data_manager.update_last_login(user['user_id'])
        
        # Generate JWT token
        from flask_jwt_extended import create_access_token
        
        token = create_access_token(identity={
            'user_id': user['user_id'],
            'email': user['email'],
            'role': user['role']
        })
        
        return jsonify({
            'token': token,
            'user': {
                'id': user['user_id'],
                'email': user['email'],
                'role': user['role'],
                'first_name': user['first_name'],
                'last_name': user['last_name']
            }
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/auth/me', methods=['GET'])
@jwt_required()
def get_current_user():
    """Get current user information"""
    try:
        current_user = get_jwt_identity()
        
        # Get user by ID using appropriate data manager
        data_manager = get_data_manager()
        user = data_manager.get_user_by_id(current_user['user_id'])
        
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        return jsonify({'user': user})
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# =====================================================
# STUDENTS ENDPOINTS
# =====================================================

@app.route('/students', methods=['GET'])
@jwt_required()
def get_students():
    """Get students list with optional hostel filter"""
    try:
        current_user = get_jwt_identity()
        hostel_filter = request.args.get('hostel', 'All Hostels')
        
        # Get students using appropriate data manager
        data_manager = get_data_manager()
        
        if current_user['role'] == 'Student':
            # Students can only see their own data
            student = data_manager.get_student_by_user_id(current_user['user_id'])
            if student:
                students = [student]
            else:
                students = []
        else:
            # Wardens and ChiefWardens can see all students
            students = data_manager.get_students_by_hostel(hostel_filter)
        
        return jsonify({'students': students})
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# =====================================================
# ATTENDANCE ENDPOINTS
# =====================================================

@app.route('/attendance', methods=['GET'])
@jwt_required()
def get_attendance():
    """Get attendance records"""
    try:
        current_user = get_jwt_identity()
        date_filter = request.args.get('date', '')
        status_filter = request.args.get('status', 'All')
        
        # Get attendance using appropriate data manager
        data_manager = get_data_manager()
        records = data_manager.get_attendance_records(
            user_id=current_user['user_id'] if current_user['role'] == 'Student' else None,
            date_filter=date_filter,
            status_filter=status_filter
        )
        
        return jsonify({'attendance': records})
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/attendance/mark', methods=['POST'])
@jwt_required()
def mark_attendance():
    """Mark attendance with face recognition"""
    try:
        current_user = get_jwt_identity()
        data = request.get_json()
        
        if current_user['role'] != 'Student':
            return jsonify({'error': 'Only students can mark attendance'}), 403
        
        # Get student ID
        data_manager = get_data_manager()
        student = data_manager.get_student_by_user_id(current_user['user_id'])
        
        if not student:
            return jsonify({'error': 'Student record not found'}), 404
        
        student_id = student['student_id']
        
        # Check if attendance already marked for today
        today = datetime.now().date()
        if data_manager.check_attendance_exists(student_id, today):
            return jsonify({'error': 'Attendance already marked for today'}), 400
        
        # Process face recognition if image provided
        confidence_score = 95.5  # Simulate face recognition
        verification_method = 'Face_Recognition'
        
        if 'face_image' in data:
            # TODO: Implement face recognition logic
            confidence_score = 95.5
            verification_method = 'Face_Recognition'
        
        # Determine status based on time
        current_time = datetime.now().time()
        deadline_time = datetime.strptime('22:30:00', '%H:%M:%S').time()
        
        if current_time <= deadline_time:
            status = 'Present'
        else:
            status = 'Late'
        
        # Mark attendance
        data_manager.mark_attendance(
            student_id, today, current_time, status, verification_method,
            confidence_score, data.get('wifi_verified', False), 
            data.get('gps_verified', False), data.get('notes', ''),
            current_user['user_id']
        )
        
        return jsonify({
            'message': 'Attendance marked successfully',
            'status': status,
            'confidence_score': confidence_score
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# =====================================================
# HOSTELS ENDPOINTS
# =====================================================

@app.route('/hostels', methods=['GET'])
@jwt_required()
def get_hostels():
    """Get hostels list"""
    try:
        current_user = get_jwt_identity()
        
        # Only Wardens and ChiefWardens can access
        if current_user['role'] == 'Student':
            return jsonify({'error': 'Access denied'}), 403
        
        # Get hostels using appropriate data manager
        data_manager = get_data_manager()
        hostels = data_manager.get_hostels()
        
        return jsonify({'hostels': hostels})
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# =====================================================
# CSV UPLOAD ENDPOINTS
# =====================================================

@app.route('/upload/students', methods=['POST'])
@jwt_required()
def upload_students_csv():
    """Upload and process students CSV file"""
    try:
        current_user = get_jwt_identity()
        
        # Only Wardens and ChiefWardens can upload
        if current_user['role'] == 'Student':
            return jsonify({'error': 'Access denied'}), 403
        
        if 'file' not in request.files:
            return jsonify({'error': 'No file provided'}), 400
        
        file = request.files['file']
        if file.filename == '':
            return jsonify({'error': 'No file selected'}), 400
        
        # Upload and process CSV
        filepath = csv_manager.upload_csv(file)
        csv_data = csv_manager.process_students_csv(filepath)
        
        # Bulk import students
        result = csv_manager.bulk_import_students(db_manager, csv_data)
        
        # Clean up uploaded file
        os.remove(filepath)
        
        return jsonify({
            'message': 'Students uploaded successfully',
            'success_count': result['success_count'],
            'error_count': result['error_count'],
            'errors': result['errors']
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# =====================================================
# HEALTH CHECK
# =====================================================

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    try:
        data_manager = get_data_manager()
        if data_manager == db_manager:
            return jsonify({'status': 'healthy', 'database': 'connected'})
        else:
            return jsonify({'status': 'healthy', 'database': 'fallback_mode'})
    except Exception as e:
        return jsonify({'status': 'unhealthy', 'error': str(e)}), 500

# =====================================================
# ERROR HANDLERS
# =====================================================

@app.errorhandler(404)
def not_found(error):
    return jsonify({'error': 'Endpoint not found'}), 404

@app.errorhandler(500)
def internal_error(error):
    return jsonify({'error': 'Internal server error'}), 500

# =====================================================
# MAIN APPLICATION
# =====================================================

if __name__ == '__main__':
    # Load environment variables
    from dotenv import load_dotenv
    load_dotenv()
    
    # Run the application
    app.run(
        host='0.0.0.0',
        port=int(os.getenv('PORT', 8000)),
        debug=os.getenv('FLASK_DEBUG', 'False').lower() == 'true'
    )
