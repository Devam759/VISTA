#!/usr/bin/env python3
"""
VISTA CSV Import Script
Imports student data from CSV files into the database
Supports multiple hostel formats and handles data validation
"""

import csv
import os
import sys
import re
from datetime import datetime
from database_manager import DatabaseManager
import logging

# Setup logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

class CSVImporter:
    """CSV Import utility for VISTA student data"""
    
    def __init__(self):
        self.db_manager = DatabaseManager()
        self.import_stats = {
            'total_rows': 0,
            'successful_imports': 0,
            'failed_imports': 0,
            'errors': []
        }
    
    def clean_student_name(self, name):
        """Clean and format student name"""
        if not name or name.strip() == '':
            return None
        # Remove extra spaces and special characters
        name = re.sub(r'\s+', ' ', name.strip())
        # Split into first and last name
        name_parts = name.split(' ')
        if len(name_parts) >= 2:
            first_name = name_parts[0]
            last_name = ' '.join(name_parts[1:])
        else:
            first_name = name_parts[0]
            last_name = ''
        return first_name, last_name
    
    def extract_roll_number(self, reg_no, student_roll_no):
        """Extract roll number from registration number or student roll number"""
        # Priority: Student Roll No > Student Reg. no
        roll_number = student_roll_no or reg_no
        if not roll_number or roll_number.strip() == '':
            return None
        
        # Clean and format roll number
        roll_number = roll_number.strip().upper()
        # Remove any extra spaces or special characters
        roll_number = re.sub(r'[^\w/]', '', roll_number)
        return roll_number
    
    def extract_course_branch(self, reg_no):
        """Extract course and branch from registration number"""
        if not reg_no:
            return 'B.Tech', 'Computer Science'
        
        reg_no = reg_no.strip().upper()
        
        # Extract course
        if 'BTECH' in reg_no or 'B.TECH' in reg_no:
            course = 'B.Tech'
        elif 'BDES' in reg_no or 'B.DES' in reg_no:
            course = 'B.Des'
        elif 'BBA' in reg_no:
            course = 'BBA'
        else:
            course = 'B.Tech'  # Default
        
        # Extract branch (simplified logic)
        if 'CS' in reg_no or 'CSE' in reg_no:
            branch = 'Computer Science'
        elif 'IT' in reg_no:
            branch = 'Information Technology'
        elif 'EC' in reg_no or 'ECE' in reg_no:
            branch = 'Electronics and Communication'
        elif 'ME' in reg_no or 'MECH' in reg_no:
            branch = 'Mechanical Engineering'
        elif 'CE' in reg_no or 'CIVIL' in reg_no:
            branch = 'Civil Engineering'
        else:
            branch = 'Computer Science'  # Default
        
        return course, branch
    
    def get_hostel_id(self, hostel_name):
        """Get hostel ID from hostel name"""
        # Map CSV hostel names to database names
        hostel_mapping = {
            'BH-2': 'BH2',
            'BH-1': 'BH1',
            'GH-1': 'GH1',
            'GH-2': 'GH2',
            'BH2': 'BH2',
            'BH1': 'BH1',
            'GH1': 'GH1',
            'GH2': 'GH2'
        }
        
        mapped_name = hostel_mapping.get(hostel_name, hostel_name)
        
        try:
            with self.db_manager.get_connection() as connection:
                cursor = connection.cursor()
                query = "SELECT hostel_id FROM hostels WHERE name = %s"
                cursor.execute(query, (mapped_name,))
                result = cursor.fetchone()
                cursor.close()
                return result[0] if result else None
        except Exception as e:
            logger.error(f"Error getting hostel ID for {hostel_name}: {e}")
            return None
    
    def get_room_id(self, hostel_id, room_number, floor=None):
        """Get room ID from room number and hostel"""
        if not room_number or not hostel_id:
            return None
        
        try:
            with self.db_manager.get_connection() as connection:
                cursor = connection.cursor()
                
                # Try exact match first
                query = "SELECT room_id FROM rooms WHERE hostel_id = %s AND room_number = %s"
                cursor.execute(query, (hostel_id, room_number))
                result = cursor.fetchone()
                
                if result:
                    cursor.close()
                    return result[0]
                
                # Try to find room by creating it if it doesn't exist
                # Extract floor number from room number if not provided
                if not floor:
                    floor_match = re.search(r'^(\d+)', room_number)
                    floor = int(floor_match.group(1)) // 100 if floor_match else 1
                
                # Create room if it doesn't exist
                insert_query = """
                    INSERT INTO rooms (hostel_id, room_number, floor_number, capacity, room_type, is_available)
                    VALUES (%s, %s, %s, %s, %s, %s)
                """
                cursor.execute(insert_query, (hostel_id, room_number, floor, 3, 'Triple', True))
                room_id = cursor.lastrowid
                connection.commit()
                cursor.close()
                
                logger.info(f"Created new room: {room_number} in hostel {hostel_id}")
                return room_id
                
        except Exception as e:
            logger.error(f"Error getting/creating room {room_number} in hostel {hostel_id}: {e}")
            return None
    
    def generate_email(self, first_name, last_name, roll_number):
        """Generate email from name and roll number"""
        if not roll_number:
            return None
        
        # Clean names for email
        first_clean = re.sub(r'[^a-zA-Z]', '', first_name.lower())
        last_clean = re.sub(r'[^a-zA-Z]', '', last_name.lower())
        
        if last_clean:
            email = f"{first_clean}.{last_clean}@jklu.edu.in"
        else:
            email = f"{first_clean}@jklu.edu.in"
        
        return email
    
    def parse_csv_file(self, file_path):
        """Parse CSV file and extract student data"""
        students_data = []
        
        try:
            with open(file_path, 'r', encoding='utf-8') as file:
                # Read all lines to handle multi-line headers
                lines = file.readlines()
                
                # Find the actual data start (skip header rows)
                data_start = 0
                for i, line in enumerate(lines):
                    if 'S.No.' in line and 'Hostel' in line:
                        data_start = i
                        break
                
                if data_start == 0:
                    logger.error("Could not find data start in CSV file")
                    return []
                
                # Parse the header row
                header_line = lines[data_start].strip()
                headers = [h.strip() for h in header_line.split(',')]
                
                # Create CSV reader from the data lines
                csv_data = ''.join(lines[data_start:])
                csv_reader = csv.DictReader(csv_data.splitlines())
                
                for row_num, row in enumerate(csv_reader, start=data_start + 1):
                    self.import_stats['total_rows'] += 1
                    
                    try:
                        # Skip empty rows
                        if not row.get('Student\'s Name', '').strip():
                            continue
                        
                        # Extract and clean data
                        student_name = row.get('Student\'s Name', '').strip()
                        reg_no = row.get('Student Reg. no', '').strip()
                        student_roll_no = row.get('Student Roll No.', '').strip()
                        hostel_name = row.get('Hostel', '').strip()
                        room_number = row.get('Room NO.', '').strip()
                        mobile_number = row.get('Mobile Number', '').strip()
                        address = row.get('Address', '').strip()
                        year = row.get('Year', '').strip()
                        
                        # Clean student name
                        name_parts = self.clean_student_name(student_name)
                        if not name_parts:
                            continue
                        
                        first_name, last_name = name_parts
                        
                        # Extract roll number
                        roll_number = self.extract_roll_number(reg_no, student_roll_no)
                        if not roll_number:
                            logger.warning(f"Row {row_num}: No roll number found")
                            continue
                        
                        # Extract course and branch
                        course, branch = self.extract_course_branch(reg_no)
                        
                        # Get hostel ID
                        hostel_id = self.get_hostel_id(hostel_name)
                        if not hostel_id:
                            logger.warning(f"Row {row_num}: Hostel {hostel_name} not found")
                            continue
                        
                        # Get room ID
                        room_id = self.get_room_id(hostel_id, room_number)
                        if not room_id:
                            logger.warning(f"Row {row_num}: Could not find/create room {room_number}")
                            continue
                        
                        # Generate email
                        email = self.generate_email(first_name, last_name, roll_number)
                        
                        # Determine admission year from year field
                        admission_year = 2025 if '2025' in year or '25' in year else 2024
                        
                        student_data = {
                            'first_name': first_name,
                            'last_name': last_name,
                            'email': email,
                            'roll_number': roll_number,
                            'hostel_id': hostel_id,
                            'room_id': room_id,
                            'mobile_number': mobile_number,
                            'address': address,
                            'course': course,
                            'branch': branch,
                            'admission_year': admission_year,
                            'semester': 1,  # Default for new students
                            'row_number': row_num
                        }
                        
                        students_data.append(student_data)
                        
                    except Exception as e:
                        self.import_stats['failed_imports'] += 1
                        error_msg = f"Row {row_num}: Error processing data - {str(e)}"
                        self.import_stats['errors'].append(error_msg)
                        logger.error(error_msg)
                        continue
                
                logger.info(f"Parsed {len(students_data)} valid student records from {self.import_stats['total_rows']} total rows")
                return students_data
                
        except Exception as e:
            logger.error(f"Error parsing CSV file: {e}")
            return []
    
    def import_students_to_database(self, students_data):
        """Import students data to database"""
        if not students_data:
            logger.error("No student data to import")
            return False
        
        try:
            with self.db_manager.get_connection() as connection:
                cursor = connection.cursor()
                
                for student in students_data:
                    try:
                        # Check if user already exists
                        check_user_query = "SELECT user_id FROM users WHERE email = %s"
                        cursor.execute(check_user_query, (student['email'],))
                        existing_user = cursor.fetchone()
                        
                        if existing_user:
                            logger.info(f"User {student['email']} already exists, skipping")
                            continue
                        
                        # Check if student already exists
                        check_student_query = "SELECT student_id FROM students WHERE roll_number = %s"
                        cursor.execute(check_student_query, (student['roll_number'],))
                        existing_student = cursor.fetchone()
                        
                        if existing_student:
                            logger.info(f"Student {student['roll_number']} already exists, skipping")
                            continue
                        
                        # Insert user
                        user_query = """
                            INSERT INTO users (email, password_hash, role, first_name, last_name, phone, is_active)
                            VALUES (%s, %s, %s, %s, %s, %s, %s)
                        """
                        password_hash = "$2b$10$default_hash_for_csv_import"  # Default password
                        cursor.execute(user_query, (
                            student['email'],
                            password_hash,
                            'Student',
                            student['first_name'],
                            student['last_name'],
                            student['mobile_number'],
                            True
                        ))
                        
                        user_id = cursor.lastrowid
                        
                        # Insert student
                        student_query = """
                            INSERT INTO students (user_id, roll_number, hostel_id, room_id, 
                                                admission_year, course, branch, semester, 
                                                emergency_contact, address, is_resident)
                            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                        """
                        cursor.execute(student_query, (
                            user_id,
                            student['roll_number'],
                            student['hostel_id'],
                            student['room_id'],
                            student['admission_year'],
                            student['course'],
                            student['branch'],
                            student['semester'],
                            student['mobile_number'],
                            student['address'],
                            True
                        ))
                        
                        self.import_stats['successful_imports'] += 1
                        logger.info(f"Successfully imported student: {student['first_name']} {student['last_name']} ({student['roll_number']})")
                        
                    except Exception as e:
                        self.import_stats['failed_imports'] += 1
                        error_msg = f"Error importing student {student.get('roll_number', 'unknown')}: {str(e)}"
                        self.import_stats['errors'].append(error_msg)
                        logger.error(error_msg)
                        continue
                
                connection.commit()
                cursor.close()
                
                return True
                
        except Exception as e:
            logger.error(f"Database import error: {e}")
            return False
    
    def import_csv_file(self, file_path):
        """Main method to import CSV file"""
        logger.info(f"Starting import of file: {file_path}")
        
        # Parse CSV file
        students_data = self.parse_csv_file(file_path)
        if not students_data:
            logger.error("No valid student data found in CSV file")
            return False
        
        # Import to database
        success = self.import_students_to_database(students_data)
        
        # Print summary
        self.print_import_summary()
        
        return success
    
    def print_import_summary(self):
        """Print import summary statistics"""
        print("\n" + "="*60)
        print("IMPORT SUMMARY")
        print("="*60)
        print(f"Total rows processed: {self.import_stats['total_rows']}")
        print(f"Successful imports: {self.import_stats['successful_imports']}")
        print(f"Failed imports: {self.import_stats['failed_imports']}")
        print(f"Success rate: {(self.import_stats['successful_imports'] / max(self.import_stats['total_rows'], 1) * 100):.1f}%")
        
        if self.import_stats['errors']:
            print(f"\nErrors encountered ({len(self.import_stats['errors'])}):")
            for error in self.import_stats['errors'][:10]:  # Show first 10 errors
                print(f"  - {error}")
            if len(self.import_stats['errors']) > 10:
                print(f"  ... and {len(self.import_stats['errors']) - 10} more errors")
        
        print("="*60)

def main():
    """Main function for command line usage"""
    if len(sys.argv) != 2:
        print("Usage: python csv_import_script.py <csv_file_path>")
        print("Example: python csv_import_script.py '../public/FINAL SHEET OF BH-2.csv'")
        sys.exit(1)
    
    csv_file_path = sys.argv[1]
    
    if not os.path.exists(csv_file_path):
        print(f"Error: File '{csv_file_path}' not found")
        sys.exit(1)
    
    # Create importer and run import
    importer = CSVImporter()
    success = importer.import_csv_file(csv_file_path)
    
    if success:
        print("\nImport completed successfully!")
        sys.exit(0)
    else:
        print("\nImport completed with errors!")
        sys.exit(1)

if __name__ == "__main__":
    main()
