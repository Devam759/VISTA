"""
VISTA College Night Attendance System - Railway Backend API
Simplified version without face recognition for Railway deployment
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
from geofencing import geofencing_manager

# Initialize Flask app
app = Flask(__name__)
app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY', 'vista-secret-key-change-in-production')
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(hours=24)

# Initialize JWT
jwt = JWTManager(app)

# Enable CORS
CORS(app)

# Health check endpoint
@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint for Railway"""
    return jsonify({
        'status': 'healthy',
        'service': 'VISTA Backend API',
        'timestamp': datetime.now().isoformat(),
        'version': '1.0.0'
    })

# Authentication endpoints
@app.route('/auth/mock-login', methods=['POST'])
def mock_login():
    """Mock login for development"""
    try:
        data = request.get_json()
        email = data.get('email')
        password = data.get('password')
        
        # Mock authentication
        if email == "bhuwanesh@jklu.edu.in" and password == "123":
            return jsonify({
                'token': 'mock-token',
                'user': {
                    'id': 1,
                    'email': 'bhuwanesh@jklu.edu.in',
                    'role': 'Warden'
                }
            })
        elif email == "devamgupta@jklu.edu.in" and password == "abc":
            return jsonify({
                'token': 'mock-token',
                'user': {
                    'id': 2,
                    'email': 'devamgupta@jklu.edu.in',
                    'role': 'Student'
                }
            })
        else:
            return jsonify({'error': 'Invalid credentials'}), 401
            
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/auth/me', methods=['GET'])
@jwt_required()
def get_me():
    """Get current user info"""
    try:
        current_user_id = get_jwt_identity()
        # Mock user data
        return jsonify({
            'user': {
                'id': current_user_id,
                'email': 'bhuwanesh@jklu.edu.in',
                'role': 'Warden'
            }
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Geofencing endpoints
@app.route('/geofencing/boundaries', methods=['GET'])
@jwt_required()
def get_geofencing_boundaries():
    """Get campus boundary information"""
    try:
        boundaries = geofencing_manager.get_campus_boundary()
        return jsonify(boundaries)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/geofencing/verify', methods=['POST'])
@jwt_required()
def verify_location():
    """Verify if location is within campus boundary"""
    try:
        data = request.get_json()
        latitude = data.get('latitude')
        longitude = data.get('longitude')
        accuracy = data.get('accuracy', 10)
        
        if not latitude or not longitude:
            return jsonify({'error': 'Latitude and longitude are required'}), 400
        
        # Verify location using geofencing manager
        result = geofencing_manager.validate_attendance_location(
            latitude, longitude, accuracy
        )
        
        return jsonify(result)
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Students endpoints
@app.route('/students', methods=['GET'])
@jwt_required()
def get_students():
    """Get all students"""
    try:
        hostel = request.args.get('hostel', 'All Hostels')
        
        if hostel == 'All Hostels':
            students = fallback_manager.get_all_students()
        else:
            students = fallback_manager.get_students_by_hostel(hostel)
        
        return jsonify({'students': students})
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Attendance endpoints
@app.route('/attendance', methods=['GET'])
@jwt_required()
def get_attendance():
    """Get attendance records"""
    try:
        date_filter = request.args.get('date', '')
        status_filter = request.args.get('status', 'All')
        
        # Get attendance from fallback data
        attendance = fallback_manager.get_attendance_records(date_filter, status_filter)
        
        return jsonify({'attendance': attendance})
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/attendance/mark', methods=['POST'])
@jwt_required()
def mark_attendance():
    """Mark attendance for a student"""
    try:
        data = request.get_json()
        
        # Validate required fields
        required_fields = ['student_id', 'latitude', 'longitude', 'accuracy']
        for field in required_fields:
            if field not in data:
                return jsonify({'error': f'{field} is required'}), 400
        
        # Verify location
        location_result = geofencing_manager.validate_attendance_location(
            data['latitude'], data['longitude'], data['accuracy']
        )
        
        if not location_result['gps_verified']:
            return jsonify({
                'success': False,
                'error': location_result['reason']
            }), 400
        
        # Mark attendance (mock implementation)
        attendance_record = {
            'id': len(fallback_manager.attendance_records) + 1,
            'student_id': data['student_id'],
            'timestamp': datetime.now().isoformat(),
            'latitude': data['latitude'],
            'longitude': data['longitude'],
            'accuracy': data['accuracy'],
            'status': 'Present',
            'verified': True
        }
        
        fallback_manager.attendance_records.append(attendance_record)
        
        return jsonify({
            'success': True,
            'message': 'Attendance marked successfully',
            'record': attendance_record
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Error handlers
@app.errorhandler(404)
def not_found(error):
    return jsonify({'error': 'Endpoint not found'}), 404

@app.errorhandler(500)
def internal_error(error):
    return jsonify({'error': 'Internal server error'}), 500

if __name__ == '__main__':
    port = int(os.getenv('PORT', 8000))
    app.run(host='0.0.0.0', port=port, debug=False)
