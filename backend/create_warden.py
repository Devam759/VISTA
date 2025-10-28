"""
Create Warden User for Testing
"""
from app import create_app
from models import db, User

def create_warden():
    """Create warden user"""
    app = create_app()
    
    with app.app_context():
        # Check if warden already exists
        existing = User.query.filter_by(email='bhuwanesh@jklu.edu.in').first()
        
        if existing:
            print(f"[OK] Warden already exists: {existing.email}")
            print(f"     Role: {existing.role}")
        else:
            # Create warden user
            warden = User(
                email='bhuwanesh@jklu.edu.in',
                password='123',
                first_name='Bhuwanesh',
                last_name='Pratap Singh',
                role='Warden',
                phone='9876543210'
            )
            
            db.session.add(warden)
            db.session.commit()
            
            print("[OK] Warden user created successfully!")
            print(f"     Email: {warden.email}")
            print(f"     Password: 123")
            print(f"     Role: {warden.role}")
        
        # Also create test student user
        student_email = 'devamgupta@jklu.edu.in'
        existing_student = User.query.filter_by(email=student_email).first()
        
        if existing_student:
            print(f"[OK] Student already exists: {existing_student.email}")
            print(f"     Role: {existing_student.role}")
        else:
            student = User(
                email=student_email,
                password='abc',
                first_name='Devam',
                last_name='Gupta',
                role='Student',
                phone='9876543211'
            )
            
            db.session.add(student)
            db.session.commit()
            
            print("[OK] Student user created successfully!")
            print(f"     Email: {student.email}")
            print(f"     Password: abc")
            print(f"     Role: {student.role}")

if __name__ == '__main__':
    create_warden()
