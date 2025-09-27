"""
VISTA College Night Attendance System - Standalone Railway Backend
Completely self-contained version for Railway deployment
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_jwt_extended import JWTManager, jwt_required, get_jwt_identity
import os
from datetime import datetime, timedelta
import bcrypt
import json
import math
from typing import Tuple, List, Dict

# Initialize Flask app
app = Flask(__name__)
app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY', 'vista-secret-key-change-in-production')
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(hours=24)

# Initialize JWT
jwt = JWTManager(app)

# Enable CORS
CORS(app)

# Standalone Geofencing Manager
class StandaloneGeofencingManager:
    """Standalone geofencing manager without external dependencies"""
    
    def __init__(self):
        self.hostel_center_lat = float(os.getenv('HOSTEL_LATITUDE', 26.2389))
        self.hostel_center_lon = float(os.getenv('HOSTEL_LONGITUDE', 73.0243))
        self.accuracy_radius = int(os.getenv('GPS_ACCURACY_RADIUS', 100))
        
        # Define campus boundary (15-point polygon)
        self.campus_boundary = {
            'center': (26.2389, 73.0243),
            'radius': 1000,
            'polygon': [
                (26.836760, 75.651187), (26.837109, 75.649523), (26.896678, 75.649331),
                (26.836655, 75.648472), (26.836079, 75.648307), (26.835495, 75.650194),
                (26.834788, 75.650150), (26.834635, 75.650973), (26.833430, 75.651435),
                (26.832659, 75.652500), (26.833776, 75.653021), (26.834072, 75.652374),
                (26.834935, 75.652472), (26.835321, 75.651554), (26.835838, 75.651320)
            ]
        }
    
    def calculate_distance(self, lat1: float, lon1: float, lat2: float, lon2: float) -> float:
        """Calculate distance between two GPS coordinates using Haversine formula"""
        lat1, lon1, lat2, lon2 = map(math.radians, [lat1, lon1, lat2, lon2])
        dlat = lat2 - lat1
        dlon = lon2 - lon1
        a = math.sin(dlat/2)**2 + math.cos(lat1) * math.cos(lat2) * math.sin(dlon/2)**2
        c = 2 * math.asin(math.sqrt(a))
        r = 6371000  # Radius of earth in meters
        return c * r
    
    def is_point_in_polygon(self, point: Tuple[float, float], polygon: List[Tuple[float, float]]) -> bool:
        """Check if a point is inside a polygon using ray casting algorithm"""
        x, y = point
        n = len(polygon)
        inside = False
        
        p1x, p1y = polygon[0]
        for i in range(1, n + 1):
            p2x, p2y = polygon[i % n]
            if y > min(p1y, p2y):
                if y <= max(p1y, p2y):
                    if x <= max(p1x, p2x):
                        if p1y != p2y:
                            xinters = (y - p1y) * (p2x - p1x) / (p2y - p1y) + p1x
                        if p1x == p2x or x <= xinters:
                            inside = not inside
            p1x, p1y = p2x, p2y
        
        return inside
    
    def verify_location(self, latitude: float, longitude: float, accuracy: float = None) -> Dict:
        """Verify if the given coordinates are within campus boundary"""
        try:
            if not (-90 <= latitude <= 90) or not (-180 <= longitude <= 180):
                return {
                    'valid': False,
                    'reason': 'Invalid GPS coordinates',
                    'distance': None,
                    'campus': None
                }
            
            if accuracy and accuracy > 200:
                return {
                    'valid': False,
                    'reason': f'GPS accuracy too low: {accuracy}m (required: <200m)',
                    'distance': None,
                    'campus': None
                }
            
            distance_from_center = self.calculate_distance(
                latitude, longitude, 
                self.campus_boundary['center'][0], self.campus_boundary['center'][1]
            )
            
            if distance_from_center > self.campus_boundary['radius']:
                return {
                    'valid': False,
                    'reason': f'Too far from campus: {distance_from_center:.1f}m (max: {self.campus_boundary["radius"]}m)',
                    'distance': distance_from_center,
                    'campus': None
                }
            
            if self.is_point_in_polygon((latitude, longitude), self.campus_boundary['polygon']):
                return {
                    'valid': True,
                    'reason': 'Location verified within campus boundary',
                    'distance': distance_from_center,
                    'campus': 'Campus',
                    'accuracy': accuracy
                }
            
            return {
                'valid': False,
                'reason': f'Location outside campus boundary: {distance_from_center:.1f}m from center',
                'distance': distance_from_center,
                'campus': None
            }
            
        except Exception as e:
            return {
                'valid': False,
                'reason': f'Location verification error: {str(e)}',
                'distance': None,
                'campus': None
            }
    
    def get_campus_boundary(self) -> Dict:
        """Get campus boundary information for frontend"""
        return {
            'center': {
                'latitude': self.campus_boundary['center'][0],
                'longitude': self.campus_boundary['center'][1]
            },
            'radius': self.campus_boundary['radius'],
            'polygon': self.campus_boundary['polygon']
        }
    
    def validate_attendance_location(self, latitude: float, longitude: float, 
                                   accuracy: float = None, student_hostel: str = None) -> Dict:
        """Validate location for attendance marking within campus boundary"""
        verification = self.verify_location(latitude, longitude, accuracy)
        
        if not verification['valid']:
            return {
                'gps_verified': False,
                'reason': verification['reason'],
                'distance': verification['distance'],
                'campus': verification['campus']
            }
        
        return {
            'gps_verified': True,
            'reason': verification['reason'],
            'distance': verification['distance'],
            'campus': verification['campus'],
            'accuracy': verification.get('accuracy')
        }

# Standalone Fallback Data Manager
class StandaloneFallbackManager:
    """Standalone fallback data manager"""
    
    def __init__(self):
        self.students = [
            {
                'id': 1,
                'name': 'John Doe',
                'email': 'john@jklu.edu.in',
                'hostel': 'BH-1',
                'room': '101',
                'phone': '9876543210'
            },
            {
                'id': 2,
                'name': 'Jane Smith',
                'email': 'jane@jklu.edu.in',
                'hostel': 'BH-2',
                'room': '205',
                'phone': '9876543211'
            },
            {
                'id': 3,
                'name': 'Bob Johnson',
                'email': 'bob@jklu.edu.in',
                'hostel': 'BH-1',
                'room': '102',
                'phone': '9876543212'
            }
        ]
        self.attendance_records = []
    
    def get_all_students(self):
        return self.students
    
    def get_students_by_hostel(self, hostel):
        return [s for s in self.students if s['hostel'] == hostel]
    
    def get_attendance_records(self, date_filter='', status_filter='All'):
        return self.attendance_records

# Initialize managers
geofencing_manager = StandaloneGeofencingManager()
fallback_manager = StandaloneFallbackManager()

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
        
        required_fields = ['student_id', 'latitude', 'longitude', 'accuracy']
        for field in required_fields:
            if field not in data:
                return jsonify({'error': f'{field} is required'}), 400
        
        location_result = geofencing_manager.validate_attendance_location(
            data['latitude'], data['longitude'], data['accuracy']
        )
        
        if not location_result['gps_verified']:
            return jsonify({
                'success': False,
                'error': location_result['reason']
            }), 400
        
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
