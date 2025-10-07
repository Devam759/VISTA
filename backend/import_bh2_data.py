"""
Import BH-2 Student Data from CSV
This script imports student data from the FINAL SHEET OF BH-2.csv file
"""
import csv
import os
import sys
from app import create_app
from models import db, User, Student, Hostel, Room

def clean_string(value):
    """Clean and strip string values"""
    if value is None:
        return None
    return str(value).strip() if value else None

def parse_room_number(room_str):
    """Extract room number from string"""
    if not room_str:
        return None
    # Remove any non-numeric characters except leading zeros
    room_str = str(room_str).strip()
    # Extract just the number
    import re
    match = re.search(r'\d+', room_str)
    return match.group(0) if match else None

def import_bh2_data(csv_file_path):
    """Import BH-2 student data from CSV"""
    app = create_app()
    
    with app.app_context():
        print("=" * 70)
        print("BH-2 Student Data Import")
        print("=" * 70)
        
        # Check if BH-2 hostel exists, create if not
        hostel = Hostel.query.filter_by(name='BH-2').first()
        if not hostel:
            print("\n📦 Creating BH-2 hostel...")
            hostel = Hostel(
                name='BH-2',
                type='Boys',
                warden_name='To Be Assigned',
                warden_phone='',
                total_rooms=0,  # Will be calculated
                total_capacity=0,  # Will be calculated
                address='Boys Hostel-2, JKLU Campus'
            )
            db.session.add(hostel)
            db.session.commit()
            print(f"✅ Created hostel: {hostel.name} (ID: {hostel.id})")
        else:
            print(f"\n✅ Found existing hostel: {hostel.name} (ID: {hostel.id})")
        
        # Read CSV file
        print(f"\n📂 Reading CSV file: {csv_file_path}")
        
        if not os.path.exists(csv_file_path):
            print(f"❌ Error: File not found: {csv_file_path}")
            return
        
        students_data = []
        rooms_data = {}
        
        with open(csv_file_path, 'r', encoding='utf-8') as file:
            # Skip first 2 header rows
            next(file)
            next(file)
            
            csv_reader = csv.DictReader(file)
            
            for row in csv_reader:
                # Skip empty rows
                if not row.get('Student\'s Name') or not row.get('Student\'s Name').strip():
                    continue
                
                room_no = parse_room_number(row.get('Room NO.'))
                if not room_no:
                    continue
                
                student_name = clean_string(row.get('Student\'s Name'))
                reg_no = clean_string(row.get('Student Reg. no'))
                mobile = clean_string(row.get('Mobile Number'))
                address = clean_string(row.get('Address'))
                roll_no = clean_string(row.get('Student Roll No.'))
                year = clean_string(row.get('Year'))
                room_type = clean_string(row.get('AC/NAC'))
                seater = clean_string(row.get('Seater'))
                
                # Parse name into first and last
                name_parts = student_name.split() if student_name else ['Unknown', 'Student']
                first_name = name_parts[0] if len(name_parts) > 0 else 'Unknown'
                last_name = ' '.join(name_parts[1:]) if len(name_parts) > 1 else 'Student'
                
                # Determine capacity from seater
                capacity = 3 if '3' in str(seater) else 2
                
                # Store room data
                if room_no not in rooms_data:
                    rooms_data[room_no] = {
                        'room_number': room_no,
                        'room_type': 'AC' if room_type == 'AC' else 'Standard',
                        'capacity': capacity
                    }
                
                # Parse year to semester
                semester = 1
                admission_year = 2025
                if year and 'Year' in year:
                    year_num = year.split()[0]
                    if year_num == '1st':
                        semester = 1
                        admission_year = 2025
                    elif year_num == '2nd':
                        semester = 3
                        admission_year = 2024
                    elif year_num == '3rd':
                        semester = 5
                        admission_year = 2023
                    elif year_num == '4th':
                        semester = 7
                        admission_year = 2022
                
                # Determine course from registration number
                course = 'B.Tech'
                if reg_no:
                    if 'BBA' in reg_no.upper():
                        course = 'BBA'
                    elif 'BDES' in reg_no.upper():
                        course = 'B.Des'
                    elif 'BTECH' in reg_no.upper() or 'B.TECH' in reg_no.upper():
                        course = 'B.Tech'
                
                students_data.append({
                    'first_name': first_name,
                    'last_name': last_name,
                    'email': f"{reg_no.lower().replace(' ', '').replace('/', '')}@jklu.edu.in" if reg_no else f"{first_name.lower()}.{last_name.lower()}@jklu.edu.in",
                    'phone': mobile,
                    'roll_number': reg_no if reg_no else f"TEMP{len(students_data)+1}",
                    'room_number': room_no,
                    'address': address,
                    'course': course,
                    'semester': semester,
                    'admission_year': admission_year
                })
        
        print(f"\n✅ Parsed {len(students_data)} students from CSV")
        print(f"✅ Found {len(rooms_data)} unique rooms")
        
        # Create rooms
        print("\n🚪 Creating rooms...")
        room_objects = {}
        for room_no, room_info in rooms_data.items():
            # Check if room already exists
            existing_room = Room.query.filter_by(
                hostel_id=hostel.id,
                room_number=room_no
            ).first()
            
            if existing_room:
                room_objects[room_no] = existing_room
                print(f"  ℹ️  Room {room_no} already exists")
            else:
                room = Room(
                    hostel_id=hostel.id,
                    room_number=room_no,
                    room_type=room_info['room_type'],
                    capacity=room_info['capacity']
                )
                db.session.add(room)
                db.session.flush()  # Get the ID
                room_objects[room_no] = room
                print(f"  ✓ Created room {room_no} ({room_info['room_type']}, {room_info['capacity']}-seater)")
        
        db.session.commit()
        print(f"✅ Created/verified {len(room_objects)} rooms")
        
        # Create users and students
        print("\n👥 Creating users and students...")
        created_count = 0
        skipped_count = 0
        
        for student_data in students_data:
            # Check if user already exists
            existing_user = User.query.filter_by(email=student_data['email']).first()
            
            if existing_user:
                print(f"  ⚠️  Skipping {student_data['first_name']} {student_data['last_name']} - email already exists")
                skipped_count += 1
                continue
            
            # Create user
            user = User(
                email=student_data['email'],
                password='student123',  # Default password - should be changed
                first_name=student_data['first_name'],
                last_name=student_data['last_name'],
                role='Student',
                phone=student_data['phone']
            )
            db.session.add(user)
            db.session.flush()  # Get the user ID
            
            # Create student
            room = room_objects.get(student_data['room_number'])
            student = Student(
                user_id=user.id,
                roll_number=student_data['roll_number'],
                hostel_id=hostel.id,
                room_id=room.id if room else None,
                course=student_data['course'],
                branch='General',  # Default branch
                semester=student_data['semester'],
                admission_year=student_data['admission_year']
            )
            db.session.add(student)
            created_count += 1
            
            if created_count % 10 == 0:
                print(f"  ✓ Processed {created_count} students...")
        
        db.session.commit()
        
        # Update hostel statistics
        total_rooms = len(room_objects)
        total_capacity = sum(room.capacity for room in room_objects.values())
        hostel.total_rooms = total_rooms
        hostel.total_capacity = total_capacity
        db.session.commit()
        
        # Print summary
        print("\n" + "=" * 70)
        print("Import Summary")
        print("=" * 70)
        print(f"✅ Hostel: {hostel.name}")
        print(f"✅ Rooms Created: {total_rooms}")
        print(f"✅ Total Capacity: {total_capacity}")
        print(f"✅ Students Created: {created_count}")
        print(f"⚠️  Students Skipped: {skipped_count}")
        
        print("\n" + "=" * 70)
        print("Default Login Credentials for Students")
        print("=" * 70)
        print("📧 Email: <registration_number>@jklu.edu.in")
        print("🔒 Password: student123")
        print("\n⚠️  Students should change their password after first login!")
        
        print("\n" + "=" * 70)
        print("Import completed successfully! 🎉")
        print("=" * 70)

if __name__ == '__main__':
    csv_path = '../public/FINAL SHEET OF BH-2.csv'
    
    if len(sys.argv) > 1:
        csv_path = sys.argv[1]
    
    if not os.path.exists(csv_path):
        print(f"❌ Error: CSV file not found at: {csv_path}")
        print(f"Usage: python import_bh2_data.py [path_to_csv]")
        sys.exit(1)
    
    import_bh2_data(csv_path)
