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
            print(f"✅ Warden already exists: {existing.email}")
            print(f"   Role: {existing.role}")
            return
        
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
        
        print("✅ Warden user created successfully!")
        print(f"   Email: {warden.email}")
        print(f"   Password: 123")
        print(f"   Role: {warden.role}")

if __name__ == '__main__':
    create_warden()
