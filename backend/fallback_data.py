"""
VISTA Fallback Data Manager
Provides sample data when database is unavailable
"""

import json
from datetime import datetime, timedelta
import random

class FallbackDataManager:
    """Fallback data manager for when database is unavailable"""
    
    def __init__(self):
        self.sample_users = [
            {
                'user_id': 1,
                'email': 'devamgupta@jklu.edu.in',
                'password_hash': '$2b$10$example_hash_for_student',
                'role': 'Student',
                'first_name': 'Devam',
                'last_name': 'Gupta',
                'phone': '9876543211',
                'is_active': True,
                'last_login': datetime.now().isoformat()
            },
            {
                'user_id': 2,
                'email': 'bhuwanesh@jklu.edu.in',
                'password_hash': '$2b$10$example_hash_for_warden',
                'role': 'Warden',
                'first_name': 'Bhuwanesh',
                'last_name': 'Sharma',
                'phone': '9876543210',
                'is_active': True,
                'last_login': datetime.now().isoformat()
            },
            {
                'user_id': 3,
                'email': 'chief.warden@jklu.edu.in',
                'password_hash': '$2b$10$example_hash_for_chief',
                'role': 'ChiefWarden',
                'first_name': 'Chief',
                'last_name': 'Warden',
                'phone': '9876543200',
                'is_active': True,
                'last_login': datetime.now().isoformat()
            }
        ]
        
        self.sample_students = [
            {
                'student_id': 1,
                'roll_number': '23BCS999',
                'name': 'Devam Gupta',
                'room_number': 'B-205',
                'hostel': 'BH1'
            },
            {
                'student_id': 2,
                'roll_number': '23BCS001',
                'name': 'Aarav Patel',
                'room_number': 'B-205',
                'hostel': 'BH1'
            },
            {
                'student_id': 3,
                'roll_number': '23BCS002',
                'name': 'Isha Sharma',
                'room_number': 'G-310',
                'hostel': 'GH1'
            },
            {
                'student_id': 4,
                'roll_number': '23BCS003',
                'name': 'Rohan Mehta',
                'room_number': 'B-110',
                'hostel': 'BH2'
            },
            {
                'student_id': 5,
                'roll_number': '23BCS004',
                'name': 'Priya Singh',
                'room_number': 'B-206',
                'hostel': 'BH1'
            },
            {
                'student_id': 6,
                'roll_number': '23BCS005',
                'name': 'Arjun Kumar',
                'room_number': 'B-111',
                'hostel': 'BH2'
            },
            {
                'student_id': 7,
                'roll_number': '23BCS006',
                'name': 'Sneha Reddy',
                'room_number': 'B-207',
                'hostel': 'BH1'
            },
            {
                'student_id': 8,
                'roll_number': '23BCS007',
                'name': 'Vikram Joshi',
                'room_number': 'B-112',
                'hostel': 'BH2'
            },
            {
                'student_id': 9,
                'roll_number': '23BCS008',
                'name': 'Ananya Gupta',
                'room_number': 'G-311',
                'hostel': 'GH1'
            },
            {
                'student_id': 10,
                'roll_number': '23BCS009',
                'name': 'Kavya Nair',
                'room_number': 'G-401',
                'hostel': 'GH2'
            },
            {
                'student_id': 11,
                'roll_number': '23BCS010',
                'name': 'Meera Joshi',
                'room_number': 'G-402',
                'hostel': 'GH2'
            },
            {
                'student_id': 12,
                'roll_number': '23BCS011',
                'name': 'Riya Agarwal',
                'room_number': 'G-403',
                'hostel': 'GH2'
            }
        ]
        
        self.sample_hostels = [
            {
                'hostel_id': 1,
                'name': 'BH1',
                'type': 'Boys',
                'warden_name': 'Mr. Verma',
                'warden_phone': '9876543210',
                'total_rooms': 50,
                'total_capacity': 200,
                'address': 'Boys Hostel Block 1, JK Lakshmipat University'
            },
            {
                'hostel_id': 2,
                'name': 'BH2',
                'type': 'Boys',
                'warden_name': 'Mr. Rao',
                'warden_phone': '9876543211',
                'total_rooms': 50,
                'total_capacity': 200,
                'address': 'Boys Hostel Block 2, JK Lakshmipat University'
            },
            {
                'hostel_id': 3,
                'name': 'GH1',
                'type': 'Girls',
                'warden_name': 'Ms. Kapoor',
                'warden_phone': '9876543212',
                'total_rooms': 40,
                'total_capacity': 160,
                'address': 'Girls Hostel Block 1, JK Lakshmipat University'
            },
            {
                'hostel_id': 4,
                'name': 'GH2',
                'type': 'Girls',
                'warden_name': 'Ms. Sharma',
                'warden_phone': '9876543213',
                'total_rooms': 40,
                'total_capacity': 160,
                'address': 'Girls Hostel Block 2, JK Lakshmipat University'
            }
        ]
        
        self.sample_attendance = self._generate_attendance_data()
    
    def _generate_attendance_data(self):
        """Generate sample attendance data"""
        attendance_data = []
        base_date = datetime.now().date()
        
        for i in range(7):  # Last 7 days
            date = base_date - timedelta(days=i)
            for student in self.sample_students[:8]:  # First 8 students
                # Random attendance status
                status_options = ['Present', 'Late', 'Absent']
                weights = [0.7, 0.2, 0.1]  # 70% present, 20% late, 10% absent
                status = random.choices(status_options, weights=weights)[0]
                
                if status == 'Absent':
                    attendance_data.append({
                        'attendance_id': len(attendance_data) + 1,
                        'attendance_date': date.isoformat(),
                        'attendance_time': None,
                        'status': status,
                        'confidence_score': 0.0,
                        'verification_method': 'Manual',
                        'wifi_verified': False,
                        'gps_verified': False,
                        'notes': 'Absent',
                        'roll_number': student['roll_number'],
                        'student_name': student['name'],
                        'hostel_name': student['hostel'],
                        'room_number': student['room_number']
                    })
                else:
                    # Generate random time
                    hour = random.randint(21, 23)
                    minute = random.randint(0, 59)
                    time_str = f"{hour:02d}:{minute:02d}:00"
                    
                    attendance_data.append({
                        'attendance_id': len(attendance_data) + 1,
                        'attendance_date': date.isoformat(),
                        'attendance_time': time_str,
                        'status': status,
                        'confidence_score': round(random.uniform(85.0, 99.0), 1),
                        'verification_method': 'Face_Recognition',
                        'wifi_verified': True,
                        'gps_verified': random.choice([True, False]),
                        'notes': 'Face recognition successful' if status == 'Present' else 'Late arrival',
                        'roll_number': student['roll_number'],
                        'student_name': student['name'],
                        'hostel_name': student['hostel'],
                        'room_number': student['room_number']
                    })
        
        return attendance_data
    
    def get_user_by_email(self, email):
        """Get user by email from fallback data"""
        for user in self.sample_users:
            if user['email'] == email:
                return user
        return None
    
    def get_user_by_id(self, user_id):
        """Get user by ID from fallback data"""
        for user in self.sample_users:
            if user['user_id'] == user_id:
                return user
        return None
    
    def get_student_by_user_id(self, user_id):
        """Get student by user ID from fallback data"""
        if user_id == 1:  # Devam Gupta
            return {
                'student_id': 1,
                'roll_number': '23BCS999',
                'hostel_id': 1,
                'room_id': 6,
                'course': 'B.Tech',
                'branch': 'Computer Science',
                'semester': 3,
                'admission_year': 2023
            }
        return None
    
    def get_students_by_hostel(self, hostel_name=None):
        """Get students by hostel from fallback data"""
        if hostel_name and hostel_name != 'All Hostels':
            return [student for student in self.sample_students if student['hostel'] == hostel_name]
        return self.sample_students
    
    def get_attendance_records(self, user_id=None, date_filter=None, status_filter=None):
        """Get attendance records from fallback data"""
        if user_id == 1:  # Student view - only their own records
            student_attendance = []
            for record in self.sample_attendance:
                if record['roll_number'] == '23BCS999':  # Devam Gupta
                    # Remove staff-specific fields for student view
                    student_record = {
                        'attendance_id': record['attendance_id'],
                        'attendance_date': record['attendance_date'],
                        'attendance_time': record['attendance_time'],
                        'status': record['status'],
                        'confidence_score': record['confidence_score'],
                        'verification_method': record['verification_method'],
                        'wifi_verified': record['wifi_verified'],
                        'gps_verified': record['gps_verified'],
                        'notes': record['notes']
                    }
                    student_attendance.append(student_record)
            return student_attendance
        else:
            # Staff view - all records
            filtered_records = self.sample_attendance.copy()
            
            if date_filter:
                filtered_records = [r for r in filtered_records if r['attendance_date'] == date_filter]
            
            if status_filter and status_filter != 'All':
                filtered_records = [r for r in filtered_records if r['status'] == status_filter]
            
            return filtered_records
    
    def get_hostels(self):
        """Get hostels from fallback data"""
        return self.sample_hostels
    
    def mark_attendance(self, student_id, attendance_date, attendance_time, 
                       status, verification_method, confidence_score, 
                       wifi_verified, gps_verified, notes, marked_by):
        """Simulate marking attendance"""
        return True  # Simulate success
    
    def update_last_login(self, user_id):
        """Simulate updating last login"""
        return True  # Simulate success
    
    def check_attendance_exists(self, student_id, attendance_date):
        """Check if attendance exists"""
        # For fallback, always return False to allow new attendance
        return False
    
    def get_attendance_statistics(self, hostel_id=None, date_filter=None):
        """Get attendance statistics"""
        today = datetime.now().date().isoformat()
        today_records = [r for r in self.sample_attendance if r['attendance_date'] == today]
        
        return {
            'total_students': len(self.sample_students),
            'attendance_marked': len(today_records),
            'present_count': len([r for r in today_records if r['status'] == 'Present']),
            'late_count': len([r for r in today_records if r['status'] == 'Late']),
            'absent_count': len([r for r in today_records if r['status'] == 'Absent'])
        }

# Global fallback data manager
fallback_manager = FallbackDataManager()
