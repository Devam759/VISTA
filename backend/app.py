"""
VISTA Attendance System - Main Application Entry Point
"""
import os
from app import create_app
from models import db, User, Student, Hostel, Room, Attendance, FaceEnrollment

# Create Flask application
app = create_app()

@app.shell_context_processor
def make_shell_context():
    """Make database models available in shell context"""
    return {
        'db': db,
        'User': User,
        'Student': Student,
        'Hostel': Hostel,
        'Room': Room,
        'Attendance': Attendance,
        'FaceEnrollment': FaceEnrollment
    }

@app.cli.command()
def init_db():
    """Initialize database schema"""
    print("Creating database tables...")
    db.create_all()
    print("Database schema ready. Populate data using CSV/ETL scripts or admin tooling.")


@app.cli.command()
def clear_attendance_data():
    """Remove all attendance records and related face enrollments."""
    from models import Attendance, FaceEnrollment

    deleted_attendance = Attendance.query.delete()
    deleted_enrollments = FaceEnrollment.query.delete()
    db.session.commit()

    print(f"Deleted {deleted_attendance} attendance records and {deleted_enrollments} face enrollments.")

if __name__ == '__main__':
    # Create database tables if they don't exist
    with app.app_context():
        db.create_all()
    
    # Run the application
    port = int(os.getenv('PORT', 8000))
    debug = os.getenv('FLASK_DEBUG', 'False').lower() == 'true'
    
    print(f"Starting VISTA Attendance System API on port {port}")
    print("Available endpoints:")
    print("- POST /api/v1/auth/login - User login")
    print("- POST /api/v1/auth/register - User registration")
    print("- GET /api/v1/auth/me - Get current user")
    print("- GET /api/v1/students - Get students list")
    print("- POST /api/v1/students - Create student")
    print("- GET /api/v1/attendance - Get attendance records")
    print("- POST /api/v1/attendance/mark - Mark attendance")
    print("- GET /api/v1/hostels - Get hostels list")
    print("- POST /api/v1/face/enroll - Enroll face")
    print("- POST /api/v1/face/verify - Verify face")
    print("- GET /health - Health check")
    
    app.run(host='0.0.0.0', port=port, debug=debug)
