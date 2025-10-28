"""
Authentication API Endpoints
"""
from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from models import db, User, Student
from utils import GeofencingManager, Validators
from datetime import datetime

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/login', methods=['POST'])
def login():
    """User login endpoint"""
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({'error': 'No data provided'}), 400
        
        email = data.get('email', '').strip().lower()
        password = data.get('password', '')
        latitude_raw = data.get('latitude')
        longitude_raw = data.get('longitude')
        accuracy_raw = data.get('accuracy')
        
        if not email or not password:
            return jsonify({'error': 'Email and password required'}), 400
        
        if not Validators.validate_email(email):
            return jsonify({'error': 'Invalid email format'}), 400
        
        # Find user by email
        user = User.query.filter_by(email=email).first()

        if not user:
            return jsonify({'error': 'Invalid credentials'}), 401
        
        if not user.is_active:
            return jsonify({'error': 'Account is deactivated'}), 401
        
        # Verify password
        if not user.verify_password(password):
            return jsonify({'error': 'Invalid credentials'}), 401

        # Location verification (optional for desktop)
        location_verification = None
        if latitude_raw is not None and longitude_raw is not None:
            try:
                latitude = float(latitude_raw)
                longitude = float(longitude_raw)
                accuracy = float(accuracy_raw) if accuracy_raw is not None else None
            except (TypeError, ValueError):
                return jsonify({'error': 'Invalid location data provided'}), 400
            
            if not Validators.validate_gps_coordinates(latitude, longitude):
                return jsonify({'error': 'Invalid GPS coordinates'}), 400

            # Verify location within campus boundary for mobile devices
            geofence_manager = GeofencingManager()
            location_verification = geofence_manager.verify_location(latitude, longitude, accuracy)

            if not location_verification.get('gps_verified'):
                return jsonify({
                    'error': 'Location verification failed',
                    'reason': location_verification.get('reason'),
                    'distance': location_verification.get('distance')
                }), 403

        # Update last login metadata
        user.last_login = datetime.utcnow()
        db.session.commit()

        # Create JWT token
        token = create_access_token(identity=str(user.id))

        response_data = {
            'token': token,
            'user': user.to_dict(),
        }
        
        if location_verification:
            response_data['location_verification'] = location_verification
        else:
            response_data['location_verification'] = {
                'gps_verified': False,
                'reason': 'Location not provided (desktop device)'
            }
        
        return jsonify(response_data)
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@auth_bp.route('/signup', methods=['POST'])
def signup():
    """Simple user signup endpoint"""
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({'error': 'No data provided'}), 400
        
        email = data.get('email', '').strip().lower()
        password = data.get('password', '')
        first_name = data.get('first_name', '').strip()
        last_name = data.get('last_name', '').strip()
        
        # Basic validation
        if not email or not password:
            return jsonify({'error': 'Email and password are required'}), 400
        
        if not Validators.validate_email(email):
            return jsonify({'error': 'Invalid email format'}), 400
        
        if len(password) < 6:
            return jsonify({'error': 'Password must be at least 6 characters'}), 400
        
        # Check if user already exists
        existing_user = User.query.filter_by(email=email).first()
        if existing_user:
            return jsonify({'error': 'User with this email already exists'}), 409
        
        # Create new user
        user = User(
            email=email,
            password=password,
            first_name=first_name or 'User',
            last_name=last_name or 'Name',
            role='Student'
        )
        
        db.session.add(user)
        db.session.commit()
        
        # Create JWT token
        token = create_access_token(identity=str(user.id))
        
        return jsonify({
            'success': True,
            'token': token,
            'user': {
                'id': user.id,
                'email': user.email,
                'first_name': user.first_name,
                'last_name': user.last_name,
                'role': user.role
            },
            'message': 'User registered successfully'
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@auth_bp.route('/me', methods=['GET'])
@jwt_required()
def get_current_user():
    """Get current user information"""
    try:
        current_user_id = get_jwt_identity()
        user = User.query.get(current_user_id)
        
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        return jsonify({'user': user.to_dict()})
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@auth_bp.route('/refresh', methods=['POST'])
@jwt_required()
def refresh_token():
    """Refresh JWT token"""
    try:
        current_user_id = get_jwt_identity()
        user = User.query.get(current_user_id)
        
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        if not user.is_active:
            return jsonify({'error': 'Account is deactivated'}), 401
        
        # Create new token
        token = create_access_token(identity=user.id)
        
        return jsonify({'token': token})
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500
