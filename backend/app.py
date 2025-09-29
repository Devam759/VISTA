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
    """Initialize database with sample data"""
    print("Creating database tables...")
    db.create_all()
    
    print("Creating sample hostels...")
    # Create sample hostels
    bh1 = Hostel(
        name='BH-1',
        type='Boys',
        warden_name='Dr. Rajesh Kumar',
        warden_phone='9876543210',
        total_rooms=100,
        total_capacity=200,
        address='Block A, JKLU Campus'
    )
    
    bh2 = Hostel(
        name='BH-2',
        type='Boys',
        warden_name='Dr. Amit Sharma',
        warden_phone='9876543211',
        total_rooms=120,
        total_capacity=240,
        address='Block B, JKLU Campus'
    )
    
    gh1 = Hostel(
        name='GH-1',
        type='Girls',
        warden_name='Dr. Priya Singh',
        warden_phone='9876543212',
        total_rooms=80,
        total_capacity=160,
        address='Block C, JKLU Campus'
    )
    
    db.session.add_all([bh1, bh2, gh1])
    db.session.commit()
    
    print("Creating sample rooms...")
    # Create sample rooms for BH-2
    rooms_bh2 = []
    for floor in range(1, 7):  # 6 floors
        for room_num in range(1, 21):  # 20 rooms per floor
            room_number = f"{floor}{room_num:02d}"
            room = Room(
                hostel_id=bh2.id,
                room_number=room_number,
                room_type='AC' if floor >= 4 else 'Standard',
                capacity=3 if floor >= 4 else 2
            )
            rooms_bh2.append(room)
    
    db.session.add_all(rooms_bh2)
    db.session.commit()
    
    print("Creating sample users...")
    # Create sample users
    warden_user = User(
        email='warden@jklu.edu.in',
        password='warden123',
        first_name='Dr. Amit',
        last_name='Sharma',
        role='Warden',
        phone='9876543211'
    )
    
    chief_warden_user = User(
        email='chiefwarden@jklu.edu.in',
        password='chiefwarden123',
        first_name='Dr. Rajesh',
        last_name='Kumar',
        role='ChiefWarden',
        phone='9876543210'
    )
    
    student_user = User(
        email='student@jklu.edu.in',
        password='student123',
        first_name='John',
        last_name='Doe',
        role='Student',
        phone='9876543213'
    )
    
    db.session.add_all([warden_user, chief_warden_user, student_user])
    db.session.commit()
    
    print("Creating sample student...")
    # Create sample student
    student = Student(
        user_id=student_user.id,
        roll_number='2024BTECH001',
        hostel_id=bh2.id,
        room_id=rooms_bh2[0].id,  # First room
        course='B.Tech',
        branch='Computer Science',
        semester=1,
        admission_year=2024
    )
    
    db.session.add(student)
    db.session.commit()
    
    print("Database initialized successfully!")
    print("Sample credentials:")
    print("Warden: warden@jklu.edu.in / warden123")
    print("Chief Warden: chiefwarden@jklu.edu.in / chiefwarden123")
    print("Student: student@jklu.edu.in / student123")

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
