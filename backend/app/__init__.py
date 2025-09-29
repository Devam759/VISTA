"""
VISTA Attendance System - Flask Application Factory
"""
from flask import Flask
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from flask_migrate import Migrate
from config.settings import get_config
from models import db

def create_app(config_name=None):
    """Create Flask application instance"""
    app = Flask(__name__)
    
    # Load configuration
    config = get_config()
    app.config.from_object(config)
    
    # Initialize extensions
    db.init_app(app)
    CORS(app, origins=['http://localhost:3000'], supports_credentials=True)
    JWTManager(app)
    Migrate(app, db)
    
    # Register blueprints
    from app.api.v1.auth import auth_bp
    from app.api.v1.students import students_bp
    from app.api.v1.attendance import attendance_bp
    from app.api.v1.hostels import hostels_bp
    from app.api.v1.face import face_bp
    from app.api.v1.geofencing import geofencing_bp
    
    app.register_blueprint(auth_bp, url_prefix='/api/v1/auth')
    app.register_blueprint(students_bp, url_prefix='/api/v1/students')
    app.register_blueprint(attendance_bp, url_prefix='/api/v1/attendance')
    app.register_blueprint(hostels_bp, url_prefix='/api/v1/hostels')
    app.register_blueprint(face_bp, url_prefix='/api/v1/face')
    app.register_blueprint(geofencing_bp, url_prefix='/api/v1/geofencing')
    
    # Health check endpoint
    @app.route('/health')
    def health_check():
        return {
            'status': 'healthy',
            'service': 'VISTA Attendance System API',
            'version': '2.0.0'
        }
    
    # Error handlers
    @app.errorhandler(404)
    def not_found(error):
        return {'error': 'Endpoint not found'}, 404
    
    @app.errorhandler(500)
    def internal_error(error):
        return {'error': 'Internal server error'}, 500
    
    return app
