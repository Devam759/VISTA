"""
VISTA Attendance System - API v1 Package
"""

from flask import Blueprint
from .auth import auth_bp
from .students import students_bp
from .attendance import attendance_bp
from .hostels import hostels_bp
from .face import face_bp
from .geofencing import geofencing_bp

# Create API v1 blueprint
api_v1_bp = Blueprint('api_v1', __name__, url_prefix='/api/v1')

# Register all API blueprints
api_v1_bp.register_blueprint(auth_bp, url_prefix='/auth')
api_v1_bp.register_blueprint(students_bp, url_prefix='/students')
api_v1_bp.register_blueprint(attendance_bp, url_prefix='/attendance')
api_v1_bp.register_blueprint(hostels_bp, url_prefix='/hostels')
api_v1_bp.register_blueprint(face_bp, url_prefix='/face')
api_v1_bp.register_blueprint(geofencing_bp, url_prefix='/geofencing')
