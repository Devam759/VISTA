#!/usr/bin/env python3
"""
Mock Database Import for BH-2 Data
Demonstrates the import functionality without requiring MySQL setup
"""

import json
import os
from datetime import datetime

class MockDatabase:
    """Mock database for demonstration purposes"""
    
    def __init__(self):
        self.data_file = 'imported_students.json'
        self.students = []
        self.load_data()
    
    def load_data(self):
        """Load existing data"""
        if os.path.exists(self.data_file):
            with open(self.data_file, 'r') as f:
                data = json.load(f)
                self.students = data.get('students', [])
    
    def save_data(self):
        """Save data to file"""
        data = {
            'metadata': {
                'total_students': len(self.students),
                'last_updated': datetime.now().isoformat(),
                'database_type': 'mock'
            },
            'students': self.students
        }
        with open(self.data_file, 'w') as f:
            json.dump(data, f, indent=2)
    
    def import_student(self, student_data):
        """Import a student"""
        # Check if student already exists
        existing = any(s['roll_number'] == student_data['roll_number'] for s in self.students)
        if existing:
            return False, "Student already exists"
        
        # Add student ID
        student_data['student_id'] = len(self.students) + 1
        student_data['imported_at'] = datetime.now().isoformat()
        
        self.students.append(student_data)
        return True, "Student imported successfully"
    
    def get_students_by_hostel(self, hostel=None):
        """Get students by hostel"""
        if hostel and hostel != 'All Hostels':
            return [s for s in self.students if s.get('hostel_name') == hostel]
        return self.students
    
    def get_statistics(self):
        """Get import statistics"""
        hostels = {}
        for student in self.students:
            hostel = student.get('hostel_name', 'Unknown')
            hostels[hostel] = hostels.get(hostel, 0) + 1
        
        return {
            'total_students': len(self.students),
            'hostels': hostels,
            'last_import': self.students[0]['imported_at'] if self.students else None
        }

def import_bh2_data():
    """Import BH-2 data from JSON file"""
    print("VISTA BH-2 Data Import")
    print("=" * 50)
    
    # Check if JSON file exists
    json_file = 'student_data.json'
    if not os.path.exists(json_file):
        print(f"JSON file {json_file} not found. Generating it first...")
        os.system('python standalone_csv_processor.py "../public/FINAL SHEET OF BH-2.csv" json')
        print()
    
    # Load JSON data
    try:
        with open(json_file, 'r') as f:
            data = json.load(f)
            students_data = data.get('students', [])
    except Exception as e:
        print(f"Error loading JSON file: {e}")
        return False
    
    print(f"Found {len(students_data)} students in JSON file")
    
    # Initialize mock database
    db = MockDatabase()
    print(f"Current students in database: {len(db.students)}")
    
    # Import students
    success_count = 0
    error_count = 0
    errors = []
    
    print("\nImporting students...")
    for student in students_data:
        success, message = db.import_student(student)
        if success:
            success_count += 1
            print(f"✅ {student['first_name']} {student['last_name']} ({student['roll_number']})")
        else:
            error_count += 1
            errors.append(f"{student['roll_number']}: {message}")
            print(f"❌ {student['first_name']} {student['last_name']} ({student['roll_number']}) - {message}")
    
    # Save data
    db.save_data()
    
    # Print summary
    print("\n" + "=" * 50)
    print("IMPORT SUMMARY")
    print("=" * 50)
    print(f"Total students processed: {len(students_data)}")
    print(f"Successfully imported: {success_count}")
    print(f"Failed imports: {error_count}")
    print(f"Success rate: {(success_count / len(students_data) * 100):.1f}%")
    
    if errors:
        print(f"\nErrors ({len(errors)}):")
        for error in errors[:10]:
            print(f"  - {error}")
        if len(errors) > 10:
            print(f"  ... and {len(errors) - 10} more errors")
    
    # Show statistics
    stats = db.get_statistics()
    print(f"\nDATABASE STATISTICS")
    print(f"Total students: {stats['total_students']}")
    print(f"By hostel:")
    for hostel, count in stats['hostels'].items():
        print(f"  {hostel}: {count} students")
    
    print(f"\n✅ Import completed successfully!")
    print(f"Data saved to: {db.data_file}")
    print(f"\nThis mock database demonstrates the import functionality.")
    print(f"For production use, set up MySQL and run the full import script.")
    
    return True

def show_imported_data():
    """Show the imported data in a readable format"""
    db = MockDatabase()
    students = db.get_students_by_hostel('BH2')
    
    print(f"\nBH-2 STUDENTS ({len(students)} students)")
    print("=" * 80)
    print(f"{'ID':<4} {'Roll No':<15} {'Name':<30} {'Room':<8} {'Course':<10}")
    print("-" * 80)
    
    for student in students[:20]:  # Show first 20 students
        print(f"{student['student_id']:<4} {student['roll_number']:<15} {student['first_name']} {student['last_name']:<25} {student['room_number']:<8} {student['course']:<10}")
    
    if len(students) > 20:
        print(f"... and {len(students) - 20} more students")

def main():
    """Main function"""
    import_bh2_data()
    show_imported_data()
    
    print(f"\n🎯 Next Steps:")
    print(f"1. Set up MySQL database")
    print(f"2. Create .env file with database credentials")
    print(f"3. Run: python csv_import_script.py '../public/FINAL SHEET OF BH-2.csv'")
    print(f"4. Start backend: python app.py")
    print(f"5. View students in web interface")

if __name__ == "__main__":
    main()
