#!/usr/bin/env python3
"""
Generate complete sample data for VISTA database
Extracts BH2 data from CSV and generates data for all hostels
"""

import csv
import random
from datetime import datetime, date, time

def read_bh2_csv():
    """Read BH2 data from CSV file"""
    bh2_students = []
    
    try:
        with open('../public/FINAL SHEET OF BH-2.csv', 'r', encoding='utf-8') as file:
            reader = csv.reader(file)
            rows = list(reader)
            
            # Skip header rows (first 4 rows)
            for row in rows[4:]:
                if len(row) >= 11 and row[6].strip() and row[7].strip():  # Has name and reg number
                    student = {
                        'name': row[6].strip(),
                        'reg_number': row[7].strip(),
                        'mobile': row[8].strip() if len(row) > 8 and row[8].strip() else '',
                        'room_no': row[3].strip() if len(row) > 3 and row[3].strip() else '',
                        'floor': row[2].strip() if len(row) > 2 and row[2].strip() else ''
                    }
                    bh2_students.append(student)
                    
    except FileNotFoundError:
        print("CSV file not found. Using generated data only.")
    
    return bh2_students

def generate_names(count, gender='mixed'):
    """Generate random Indian names"""
    first_names_male = [
        'Aarav', 'Arjun', 'Rohan', 'Vikram', 'Raj', 'Suresh', 'Amit', 'Ravi', 'Sunil', 'Pradeep',
        'Kumar', 'Anil', 'Manoj', 'Deepak', 'Rajesh', 'Vishal', 'Nikhil', 'Rahul', 'Sandeep', 'Ajay',
        'Pankaj', 'Vinod', 'Sanjay', 'Ramesh', 'Dinesh', 'Mukesh', 'Suresh', 'Ashok', 'Vijay', 'Gopal'
    ]
    
    first_names_female = [
        'Priya', 'Sneha', 'Ananya', 'Kavya', 'Meera', 'Riya', 'Isha', 'Pooja', 'Neha', 'Shreya',
        'Anjali', 'Divya', 'Kriti', 'Sakshi', 'Ritika', 'Nisha', 'Deepika', 'Sunita', 'Lakshmi', 'Radha',
        'Gayatri', 'Sushma', 'Manju', 'Sarita', 'Kamala', 'Indira', 'Usha', 'Rekha', 'Suman', 'Geeta'
    ]
    
    last_names = [
        'Sharma', 'Verma', 'Kumar', 'Singh', 'Patel', 'Reddy', 'Gupta', 'Joshi', 'Nair', 'Agarwal',
        'Jain', 'Malhotra', 'Chopra', 'Mehta', 'Bansal', 'Goyal', 'Saxena', 'Tiwari', 'Mishra', 'Yadav',
        'Pandey', 'Dubey', 'Srivastava', 'Bhardwaj', 'Chaudhary', 'Rawat', 'Shekhawat', 'Kumawat', 'Bishnoi', 'Rajput'
    ]
    
    names = []
    for i in range(count):
        if gender == 'male':
            first = random.choice(first_names_male)
        elif gender == 'female':
            first = random.choice(first_names_female)
        else:
            first = random.choice(first_names_male + first_names_female)
        
        last = random.choice(last_names)
        names.append(f"{first} {last}")
    
    return names

def generate_phone_numbers(count):
    """Generate random Indian phone numbers"""
    phones = []
    for i in range(count):
        # Generate 10-digit number starting with 6,7,8,9
        first_digit = random.choice(['6', '7', '8', '9'])
        remaining = ''.join([str(random.randint(0, 9)) for _ in range(9)])
        phones.append(first_digit + remaining)
    return phones

def generate_roll_numbers(count, hostel_prefix):
    """Generate roll numbers"""
    roll_numbers = []
    for i in range(1, count + 1):
        roll_numbers.append(f"25BCS{hostel_prefix}{i:03d}")
    return roll_numbers

def generate_room_numbers(count, hostel_prefix):
    """Generate room numbers"""
    rooms = []
    floor = 1
    room_num = 1
    
    for i in range(count):
        if room_num > 20:  # 20 rooms per floor
            floor += 1
            room_num = 1
        
        room_number = f"{hostel_prefix}-{floor:02d}{room_num:02d}"
        rooms.append(room_number)
        room_num += 1
    
    return rooms

def generate_sql_inserts():
    """Generate complete SQL insert statements"""
    
    # Read BH2 data from CSV
    bh2_students = read_bh2_csv()
    
    # Hostel configurations
    hostels = {
        'BH1': {'count': 192, 'prefix': '1', 'gender': 'male'},
        'BH2': {'count': 192, 'prefix': '2', 'gender': 'male', 'csv_data': bh2_students},
        'GH1': {'count': 192, 'prefix': '3', 'gender': 'female'},
        'GH2': {'count': 112, 'prefix': '4', 'gender': 'female'}
    }
    
    sql_statements = []
    sql_statements.append("-- VISTA Complete Sample Data")
    sql_statements.append("USE vista_attendance;")
    sql_statements.append("")
    sql_statements.append("-- Clear existing sample data")
    sql_statements.append("DELETE FROM attendance_records WHERE student_id > 0;")
    sql_statements.append("DELETE FROM face_enrollments WHERE student_id > 0;")
    sql_statements.append("DELETE FROM students WHERE student_id > 0;")
    sql_statements.append("DELETE FROM users WHERE user_id > 1; -- Keep the warden user")
    sql_statements.append("")
    sql_statements.append("-- Reset auto increment")
    sql_statements.append("ALTER TABLE users AUTO_INCREMENT = 2;")
    sql_statements.append("ALTER TABLE students AUTO_INCREMENT = 1;")
    sql_statements.append("ALTER TABLE attendance_records AUTO_INCREMENT = 1;")
    sql_statements.append("ALTER TABLE face_enrollments AUTO_INCREMENT = 1;")
    sql_statements.append("")
    
    user_id = 2
    student_id = 1
    
    for hostel_name, config in hostels.items():
        count = config['count']
        prefix = config['prefix']
        gender = config['gender']
        
        sql_statements.append(f"-- {hostel_name} Students ({count} students)")
        
        # Generate names
        if hostel_name == 'BH2' and config.get('csv_data'):
            # Use CSV data for BH2
            names = [student['name'] for student in config['csv_data'][:count]]
            phones = [student['mobile'] if student['mobile'] else generate_phone_numbers(1)[0] 
                     for student in config['csv_data'][:count]]
        else:
            names = generate_names(count, gender)
            phones = generate_phone_numbers(count)
        
        roll_numbers = generate_roll_numbers(count, prefix)
        room_numbers = generate_room_numbers(count, hostel_name[:2])
        
        # Insert users
        sql_statements.append("INSERT INTO users (email, password_hash, role, first_name, last_name, phone) VALUES")
        user_values = []
        
        for i in range(count):
            name_parts = names[i].split(' ', 1)
            first_name = name_parts[0]
            last_name = name_parts[1] if len(name_parts) > 1 else ''
            email = f"student.{hostel_name.lower()}.{i+1:03d}@jklu.edu.in"
            
            user_values.append(f"('{email}', '$2b$10$example_hash', 'Student', '{first_name}', '{last_name}', '{phones[i]}')")
        
        sql_statements.append(',\n'.join(user_values) + ';')
        sql_statements.append("")
        
        # Insert students
        sql_statements.append("INSERT INTO students (user_id, roll_number, hostel_id, room_id, admission_year, course, branch, emergency_contact, parent_name, parent_phone) VALUES")
        student_values = []
        
        hostel_id_map = {'BH1': 1, 'BH2': 2, 'GH1': 3, 'GH2': 4}
        hostel_id = hostel_id_map[hostel_name]
        
        for i in range(count):
            name_parts = names[i].split(' ', 1)
            first_name = name_parts[0]
            parent_name = f"Raj {first_name}"
            parent_phone = phones[i][:-1] + str((int(phones[i][-1]) + 1) % 10)
            
            # Find room_id (simplified - using sequential room assignment)
            room_id = 1 + (i // 3)  # 3 students per room
            
            student_values.append(f"({user_id + i}, '{roll_numbers[i]}', {hostel_id}, {room_id}, 2025, 'B.Tech', 'Computer Science', '{phones[i]}', '{parent_name}', '{parent_phone}')")
        
        sql_statements.append(',\n'.join(student_values) + ';')
        sql_statements.append("")
        
        user_id += count
        student_id += count
    
    # Add attendance records
    sql_statements.append("-- Sample attendance records")
    sql_statements.append("INSERT INTO attendance_records (student_id, attendance_date, attendance_time, status, verification_method, confidence_score, wifi_verified, gps_verified) VALUES")
    
    attendance_values = []
    for student_id in range(1, 50):  # Sample for first 50 students
        attendance_date = '2025-01-15'
        attendance_time = f"{random.randint(21, 23):02d}:{random.randint(0, 59):02d}:00"
        status = random.choices(['Present', 'Late', 'Absent'], weights=[70, 20, 10])[0]
        confidence = random.uniform(85, 99) if status != 'Absent' else 0
        
        attendance_values.append(f"({student_id}, '{attendance_date}', '{attendance_time}', '{status}', 'Face_Recognition', {confidence:.1f}, TRUE, TRUE)")
    
    sql_statements.append(',\n'.join(attendance_values) + ';')
    sql_statements.append("")
    
    # Update room occupancy
    sql_statements.append("-- Update room occupancy")
    sql_statements.append("CALL UpdateRoomOccupancy();")
    sql_statements.append("")
    
    # Summary
    sql_statements.append("-- Display summary")
    sql_statements.append("SELECT 'Sample data inserted successfully!' as Status;")
    sql_statements.append("SELECT h.name as Hostel, COUNT(s.student_id) as Student_Count")
    sql_statements.append("FROM hostels h")
    sql_statements.append("LEFT JOIN students s ON h.hostel_id = s.hostel_id")
    sql_statements.append("GROUP BY h.hostel_id, h.name")
    sql_statements.append("ORDER BY h.name;")
    
    return '\n'.join(sql_statements)

def main():
    """Generate and save the complete sample data SQL"""
    sql_content = generate_sql_inserts()
    
    with open('complete_sample_data.sql', 'w', encoding='utf-8') as file:
        file.write(sql_content)
    
    print("Complete sample data SQL generated successfully!")
    print("File saved as: complete_sample_data.sql")
    print("\nSummary:")
    print("- BH1: 192 students")
    print("- BH2: 192 students (extracted from CSV)")
    print("- GH1: 192 students")
    print("- GH2: 112 students")
    print("- Total: 688 students")

if __name__ == "__main__":
    main()
