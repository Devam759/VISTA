"""
VISTA College Night Attendance System - Backend API
Main Flask application with all endpoints
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_jwt_extended import JWTManager, jwt_required, get_jwt_identity
import os
from datetime import datetime, timedelta
import bcrypt
import json
import base64
import cv2
import numpy as np
import face_recognition
from PIL import Image
import io
from database_manager import db_manager, csv_manager
from fallback_data import fallback_manager
from csv_import_script import CSVImporter

# Initialize Flask app
app = Flask(__name__)
app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY', 'vista-secret-key-change-in-production')
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(hours=24)

# Initialize extensions
CORS(app)
jwt = JWTManager(app)

# Database configuration is now handled by database_manager

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
        
        connection = get_db_connection()
        if not connection:
            return jsonify({'error': 'Database connection failed'}), 500
        
        cursor = connection.cursor(dictionary=True)
        
        # Build query based on role
        if current_user['role'] == 'Student':
            # Students can only see their own attendance
            query = """
                SELECT ar.attendance_id, ar.attendance_date, ar.attendance_time,
                       ar.status, ar.confidence_score, ar.verification_method,
                       ar.wifi_verified, ar.gps_verified, ar.notes
                FROM attendance_records ar
                JOIN students s ON ar.student_id = s.student_id
                WHERE s.user_id = %s
            """
            params = [current_user['user_id']]
            
            if date_filter:
                query += " AND ar.attendance_date = %s"
                params.append(date_filter)
            
            if status_filter != 'All':
                query += " AND ar.status = %s"
                params.append(status_filter)
            
            query += " ORDER BY ar.attendance_date DESC, ar.attendance_time DESC"
            
        else:
            # Wardens and ChiefWardens can see all attendance
            query = """
                SELECT ar.attendance_id, ar.attendance_date, ar.attendance_time,
                       ar.status, ar.confidence_score, ar.verification_method,
                       ar.wifi_verified, ar.gps_verified, ar.notes,
                       s.roll_number, CONCAT(u.first_name, ' ', u.last_name) as student_name,
                       h.name as hostel_name, r.room_number
                FROM attendance_records ar
                JOIN students s ON ar.student_id = s.student_id
                JOIN users u ON s.user_id = u.user_id
                JOIN hostels h ON s.hostel_id = h.hostel_id
                LEFT JOIN rooms r ON s.room_id = r.room_id
                WHERE 1=1
            """
            params = []
            
            if date_filter:
                query += " AND ar.attendance_date = %s"
                params.append(date_filter)
            
            if status_filter != 'All':
                query += " AND ar.status = %s"
                params.append(status_filter)
            
            query += " ORDER BY ar.attendance_date DESC, ar.attendance_time DESC"
        
        cursor.execute(query, params)
        records = cursor.fetchall()
        
        cursor.close()
        connection.close()
        
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
        connection = get_db_connection()
        if not connection:
            return jsonify({'error': 'Database connection failed'}), 500
        
        cursor = connection.cursor(dictionary=True)
        
        cursor.execute("""
            SELECT s.student_id FROM students s WHERE s.user_id = %s
        """, (current_user['user_id'],))
        
        student = cursor.fetchone()
        if not student:
            return jsonify({'error': 'Student record not found'}), 404
        
        student_id = student['student_id']
        
        # Check if attendance already marked for today
        today = datetime.now().date()
        cursor.execute("""
            SELECT attendance_id FROM attendance_records 
            WHERE student_id = %s AND attendance_date = %s
        """, (student_id, today))
        
        existing = cursor.fetchone()
        if existing:
            return jsonify({'error': 'Attendance already marked for today'}), 400
        
        # Process face recognition if image provided
        confidence_score = 0.0
        verification_method = 'Manual'
        
        if 'face_image' in data:
            # TODO: Implement face recognition logic
            # For now, simulate face recognition
            confidence_score = 95.5
            verification_method = 'Face_Recognition'
        
        # Determine status based on time
        current_time = datetime.now().time()
        deadline_time = datetime.strptime('22:30:00', '%H:%M:%S').time()
        
        if current_time <= deadline_time:
            status = 'Present'
        else:
            status = 'Late'
        
        # Insert attendance record
        cursor.execute("""
            INSERT INTO attendance_records 
            (student_id, attendance_date, attendance_time, status, verification_method,
             confidence_score, wifi_verified, gps_verified, notes, marked_by)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
        """, (
            student_id, today, current_time, status, verification_method,
            confidence_score, data.get('wifi_verified', False), 
            data.get('gps_verified', False), data.get('notes', ''),
            current_user['user_id']
        ))
        
        connection.commit()
        
        cursor.close()
        connection.close()
        
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
        
        connection = get_db_connection()
        if not connection:
            return jsonify({'error': 'Database connection failed'}), 500
        
        cursor = connection.cursor(dictionary=True)
        
        cursor.execute("""
            SELECT h.hostel_id, h.name, h.type, h.warden_name, h.warden_phone,
                   h.total_rooms, h.total_capacity, h.address
            FROM hostels h
            ORDER BY h.name
        """)
        
        hostels = cursor.fetchall()
        
        cursor.close()
        connection.close()
        
        return jsonify({'hostels': hostels})
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# =====================================================
# FACE ENROLLMENT ENDPOINTS
# =====================================================

@app.route('/face/enroll', methods=['POST'])
@jwt_required()
def enroll_face():
    """Enroll student face for recognition"""
    try:
        current_user = get_jwt_identity()
        data = request.get_json()
        
        # Only Wardens and ChiefWardens can enroll faces
        if current_user['role'] == 'Student':
            return jsonify({'error': 'Access denied'}), 403
        
        student_id = data.get('student_id')
        face_image = data.get('face_image')
        
        if not student_id or not face_image:
            return jsonify({'error': 'Student ID and face image required'}), 400
        
        # TODO: Implement face encoding and storage
        # For now, simulate face enrollment
        
        connection = get_db_connection()
        if not connection:
            return jsonify({'error': 'Database connection failed'}), 500
        
        cursor = connection.cursor()
        
        # Insert face enrollment record
        cursor.execute("""
            INSERT INTO face_enrollments 
            (student_id, face_image_path, face_encoding_data, confidence_score, 
             face_quality_score, enrollment_method, created_by, notes)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
        """, (
            student_id, '/uploads/faces/face_' + str(student_id) + '.jpg',
            'encoded_face_data', 95.5, 92.3, 'Manual', 
            current_user['user_id'], 'Face enrollment via API'
        ))
        
        connection.commit()
        
        cursor.close()
        connection.close()
        
        return jsonify({'message': 'Face enrolled successfully'})
        
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

@app.route('/upload/attendance', methods=['POST'])
@jwt_required()
def upload_attendance_csv():
    """Upload and process attendance CSV file"""
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
        csv_data = csv_manager.process_attendance_csv(filepath)
        
        # Process attendance records
        success_count = 0
        error_count = 0
        errors = []
        
        for row in csv_data:
            try:
                # Get student ID by roll number
                student = db_manager.execute_query(
                    "SELECT student_id FROM students WHERE roll_number = %s",
                    (row['roll_number'],), fetch_one=True
                )
                
                if not student:
                    raise ValueError(f"Student with roll number {row['roll_number']} not found")
                
                # Mark attendance
                db_manager.mark_attendance(
                    student['student_id'],
                    row['attendance_date'],
                    row.get('attendance_time', '22:00:00'),
                    row['status'],
                    'Manual',
                    100.0,  # Manual entry
                    False, False,  # No WiFi/GPS verification
                    f"Bulk import from CSV",
                    current_user['user_id']
                )
                
                success_count += 1
                
            except Exception as e:
                error_count += 1
                errors.append(f"Row {row.get('roll_number', 'unknown')}: {str(e)}")
        
        # Clean up uploaded file
        os.remove(filepath)
        
        return jsonify({
            'message': 'Attendance uploaded successfully',
            'success_count': success_count,
            'error_count': error_count,
            'errors': errors
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/import/students-csv', methods=['POST'])
@jwt_required()
def import_students_csv():
    """Import students from CSV file (supports hostel allocation sheets)"""
    try:
        # Check if user is authorized (Warden or Chief Warden)
        current_user = get_jwt_identity()
        if current_user['role'] == 'Student':
            return jsonify({'error': 'Unauthorized access'}), 403
        
        if 'file' not in request.files:
            return jsonify({'error': 'No file provided'}), 400
        
        file = request.files['file']
        if file.filename == '':
            return jsonify({'error': 'No file selected'}), 400
        
        # Check file extension
        if not file.filename.lower().endswith('.csv'):
            return jsonify({'error': 'Only CSV files are allowed'}), 400
        
        # Save uploaded file temporarily
        import tempfile
        with tempfile.NamedTemporaryFile(mode='w+b', suffix='.csv', delete=False) as temp_file:
            file.save(temp_file.name)
            temp_file_path = temp_file.name
        
        try:
            # Use CSV importer to process the file
            importer = CSVImporter()
            success = importer.import_csv_file(temp_file_path)
            
            if success:
                return jsonify({
                    'message': 'Students import completed successfully',
                    'success_count': importer.import_stats['successful_imports'],
                    'failed_count': importer.import_stats['failed_imports'],
                    'total_processed': importer.import_stats['total_rows'],
                    'errors': importer.import_stats['errors'][:10]  # Limit errors shown
                })
            else:
                return jsonify({
                    'message': 'Import completed with errors',
                    'success_count': importer.import_stats['successful_imports'],
                    'failed_count': importer.import_stats['failed_imports'],
                    'total_processed': importer.import_stats['total_rows'],
                    'errors': importer.import_stats['errors'][:10]
                }), 400
                
        finally:
            # Clean up temporary file
            try:
                os.unlink(temp_file_path)
            except:
                pass
        
    except Exception as e:
        return jsonify({'error': f'Import failed: {str(e)}'}), 500

# =====================================================
# HEALTH CHECK
# =====================================================

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    try:
        connection = get_db_connection()
        if connection:
            connection.close()
            return jsonify({'status': 'healthy', 'database': 'connected'})
        else:
            return jsonify({'status': 'unhealthy', 'database': 'disconnected'}), 500
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
