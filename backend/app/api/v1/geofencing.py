"""
Geofencing API endpoints
"""
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from utils.geofencing import GeofencingManager

geofencing_bp = Blueprint('geofencing', __name__)

# Initialize geofencing manager
geofencing_manager = GeofencingManager()

@geofencing_bp.route('/boundaries', methods=['GET'])
@jwt_required()
def get_boundaries():
    """Get campus boundary information"""
    try:
        boundaries = geofencing_manager.get_campus_boundary()
        return jsonify({
            'success': True,
            'boundaries': boundaries
        }), 200
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@geofencing_bp.route('/verify', methods=['POST'])
def verify_location():
    """Verify if user location is within campus boundary"""
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({
                'success': False,
                'error': 'No data provided'
            }), 400
        
        latitude = data.get('latitude')
        longitude = data.get('longitude')
        accuracy = data.get('accuracy')
        
        # Validate required fields
        if latitude is None or longitude is None:
            return jsonify({
                'success': False,
                'error': 'Latitude and longitude are required'
            }), 400
        
        # Convert to float if they're strings
        try:
            latitude = float(latitude)
            longitude = float(longitude)
            if accuracy is not None:
                accuracy = float(accuracy)
        except (ValueError, TypeError):
            return jsonify({
                'success': False,
                'error': 'Invalid coordinate format'
            }), 400
        
        # Verify location
        result = geofencing_manager.verify_location(latitude, longitude, accuracy)
        
        return jsonify({
            'success': True,
            'gps_verified': result['valid'],
            'reason': result['reason'],
            'distance': result.get('distance'),
            'campus': result.get('campus'),
            'accuracy': result.get('accuracy')
        }), 200
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@geofencing_bp.route('/test', methods=['POST'])
@jwt_required()
def test_location():
    """Test endpoint to verify geofencing is working"""
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({
                'success': False,
                'error': 'No data provided'
            }), 400
        
        latitude = data.get('latitude')
        longitude = data.get('longitude')
        accuracy = data.get('accuracy', 10)
        
        # Always verify location for testing
        result = geofencing_manager.verify_location(latitude, longitude, accuracy)
        
        return jsonify({
            'success': True,
            'test_result': result,
            'message': 'Geofencing test completed'
        }), 200
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500
