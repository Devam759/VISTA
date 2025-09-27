#!/usr/bin/env python3
"""
VISTA Standalone CSV Processor
Processes CSV files and generates SQL insert statements
Works without database connection for demonstration
"""

import csv
import os
import sys
import re
from datetime import datetime

class StandaloneCSVProcessor:
    """Standalone CSV processor that generates SQL statements"""
    
    def __init__(self):
        self.processed_data = []
        self.stats = {
            'total_rows': 0,
            'valid_records': 0,
            'invalid_records': 0,
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
    
    def get_hostel_mapping(self, hostel_name):
        """Map CSV hostel names to database names"""
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
        return hostel_mapping.get(hostel_name, hostel_name)
    
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
                    print("ERROR: Could not find data start in CSV file")
                    return []
                
                # Parse the header row
                header_line = lines[data_start].strip()
                headers = [h.strip() for h in header_line.split(',')]
                
                # Create CSV reader from the data lines
                csv_data = ''.join(lines[data_start:])
                csv_reader = csv.DictReader(csv_data.splitlines())
                
                for row_num, row in enumerate(csv_reader, start=data_start + 1):
                    self.stats['total_rows'] += 1
                    
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
                            print(f"WARNING: Row {row_num}: No roll number found")
                            continue
                        
                        # Extract course and branch
                        course, branch = self.extract_course_branch(reg_no)
                        
                        # Map hostel name
                        mapped_hostel = self.get_hostel_mapping(hostel_name)
                        
                        # Generate email
                        email = self.generate_email(first_name, last_name, roll_number)
                        
                        # Determine admission year from year field
                        admission_year = 2025 if '2025' in year or '25' in year else 2024
                        
                        student_data = {
                            'first_name': first_name,
                            'last_name': last_name,
                            'email': email,
                            'roll_number': roll_number,
                            'hostel_name': mapped_hostel,
                            'room_number': room_number,
                            'mobile_number': mobile_number,
                            'address': address,
                            'course': course,
                            'branch': branch,
                            'admission_year': admission_year,
                            'semester': 1,  # Default for new students
                            'row_number': row_num
                        }
                        
                        students_data.append(student_data)
                        self.stats['valid_records'] += 1
                        
                    except Exception as e:
                        self.stats['invalid_records'] += 1
                        error_msg = f"Row {row_num}: Error processing data - {str(e)}"
                        self.stats['errors'].append(error_msg)
                        print(f"ERROR: {error_msg}")
                        continue
                
                print(f"INFO: Parsed {len(students_data)} valid student records from {self.stats['total_rows']} total rows")
                return students_data
                
        except Exception as e:
            print(f"ERROR: Error parsing CSV file: {e}")
            return []
    
    def generate_sql_statements(self, students_data):
        """Generate SQL insert statements for the student data"""
        sql_statements = []
        
        # Add header comment
        sql_statements.append("-- VISTA Student Data Import")
        sql_statements.append(f"-- Generated on: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
        sql_statements.append(f"-- Total records: {len(students_data)}")
        sql_statements.append("")
        
        # Group students by hostel for better organization
        hostel_groups = {}
        for student in students_data:
            hostel = student['hostel_name']
            if hostel not in hostel_groups:
                hostel_groups[hostel] = []
            hostel_groups[hostel].append(student)
        
        # Generate SQL for each hostel
        for hostel_name, students in hostel_groups.items():
            sql_statements.append(f"-- {hostel_name} Students ({len(students)} students)")
            sql_statements.append("")
            
            for student in students:
                # Generate user insert
                user_sql = f"""INSERT INTO users (email, password_hash, role, first_name, last_name, phone, is_active) VALUES
('{student['email']}', '$2b$10$default_hash_for_csv_import', 'Student', '{student['first_name']}', '{student['last_name']}', '{student['mobile_number']}', TRUE);"""
                
                sql_statements.append(user_sql)
                
                # Generate student insert (assuming user_id will be auto-generated)
                student_sql = f"""INSERT INTO students (user_id, roll_number, hostel_id, room_id, admission_year, course, branch, semester, emergency_contact, address, is_resident)
SELECT LAST_INSERT_ID(), '{student['roll_number']}', 
    (SELECT hostel_id FROM hostels WHERE name = '{hostel_name}'), 
    (SELECT room_id FROM rooms WHERE room_number = '{student['room_number']}' AND hostel_id = (SELECT hostel_id FROM hostels WHERE name = '{hostel_name}')),
    {student['admission_year']}, '{student['course']}', '{student['branch']}', {student['semester']}, '{student['mobile_number']}', '{student['address']}', TRUE;"""
                
                sql_statements.append(student_sql)
                sql_statements.append("")
            
            sql_statements.append("")
        
        return sql_statements
    
    def generate_json_output(self, students_data):
        """Generate JSON output for API consumption"""
        json_data = {
            'metadata': {
                'total_records': len(students_data),
                'generated_at': datetime.now().isoformat(),
                'source_file': 'FINAL SHEET OF BH-2.csv'
            },
            'students': []
        }
        
        for student in students_data:
            json_data['students'].append({
                'first_name': student['first_name'],
                'last_name': student['last_name'],
                'email': student['email'],
                'roll_number': student['roll_number'],
                'hostel_name': student['hostel_name'],
                'room_number': student['room_number'],
                'mobile_number': student['mobile_number'],
                'address': student['address'],
                'course': student['course'],
                'branch': student['branch'],
                'admission_year': student['admission_year'],
                'semester': student['semester']
            })
        
        return json_data
    
    def process_csv_file(self, file_path, output_format='sql'):
        """Main method to process CSV file and generate output"""
        print(f"Starting processing of file: {file_path}")
        
        # Parse CSV file
        students_data = self.parse_csv_file(file_path)
        if not students_data:
            print("ERROR: No valid student data found in CSV file")
            return False
        
        # Generate output based on format
        if output_format == 'sql':
            output_data = self.generate_sql_statements(students_data)
            output_file = 'student_import.sql'
            with open(output_file, 'w', encoding='utf-8') as f:
                f.write('\n'.join(output_data))
            print(f"SQL statements written to: {output_file}")
            
        elif output_format == 'json':
            output_data = self.generate_json_output(students_data)
            output_file = 'student_data.json'
            with open(output_file, 'w', encoding='utf-8') as f:
                import json
                json.dump(output_data, f, indent=2)
            print(f"JSON data written to: {output_file}")
        
        # Print summary
        self.print_processing_summary()
        return True
    
    def print_processing_summary(self):
        """Print processing summary statistics"""
        print("\n" + "="*60)
        print("PROCESSING SUMMARY")
        print("="*60)
        print(f"Total rows processed: {self.stats['total_rows']}")
        print(f"Valid records: {self.stats['valid_records']}")
        print(f"Invalid records: {self.stats['invalid_records']}")
        print(f"Success rate: {(self.stats['valid_records'] / max(self.stats['total_rows'], 1) * 100):.1f}%")
        
        if self.stats['errors']:
            print(f"\nErrors encountered ({len(self.stats['errors'])}):")
            for error in self.stats['errors'][:10]:  # Show first 10 errors
                print(f"  - {error}")
            if len(self.stats['errors']) > 10:
                print(f"  ... and {len(self.stats['errors']) - 10} more errors")
        
        print("="*60)

def main():
    """Main function for command line usage"""
    if len(sys.argv) < 2:
        print("Usage: python standalone_csv_processor.py <csv_file_path> [output_format]")
        print("Output formats: sql (default), json")
        print("Example: python standalone_csv_processor.py '../public/FINAL SHEET OF BH-2.csv' sql")
        sys.exit(1)
    
    csv_file_path = sys.argv[1]
    output_format = sys.argv[2] if len(sys.argv) > 2 else 'sql'
    
    if not os.path.exists(csv_file_path):
        print(f"Error: File '{csv_file_path}' not found")
        sys.exit(1)
    
    if output_format not in ['sql', 'json']:
        print("Error: Output format must be 'sql' or 'json'")
        sys.exit(1)
    
    # Create processor and run processing
    processor = StandaloneCSVProcessor()
    success = processor.process_csv_file(csv_file_path, output_format)
    
    if success:
        print("\nProcessing completed successfully!")
        sys.exit(0)
    else:
        print("\nProcessing completed with errors!")
        sys.exit(1)

if __name__ == "__main__":
    main()
