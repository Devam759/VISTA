#!/usr/bin/env python3
"""
VISTA Database Manager
A Python utility for managing the VISTA attendance database
"""

import mysql.connector
from mysql.connector import Error
import json
import hashlib
from datetime import datetime, date, time
import os
from typing import List, Dict, Optional, Tuple

class VistaDatabaseManager:
    def __init__(self, host='localhost', user='root', password='', database='vista_attendance'):
        """Initialize database connection"""
        self.host = host
        self.user = user
        self.password = password
        self.database = database
        self.connection = None
        
    def connect(self):
        """Establish database connection"""
        try:
            self.connection = mysql.connector.connect(
                host=self.host,
                user=self.user,
                password=self.password,
                database=self.database,
                autocommit=True
            )
            if self.connection.is_connected():
                print(f"Connected to MySQL database: {self.database}")
                return True
        except Error as e:
            print(f"Error connecting to MySQL: {e}")
            return False
    
    def disconnect(self):
        """Close database connection"""
        if self.connection and self.connection.is_connected():
            self.connection.close()
            print("MySQL connection closed")
    
    def execute_query(self, query: str, params: Tuple = None) -> List[Dict]:
        """Execute SELECT query and return results"""
        try:
            cursor = self.connection.cursor(dictionary=True)
            cursor.execute(query, params)
            results = cursor.fetchall()
            cursor.close()
            return results
        except Error as e:
            print(f"Error executing query: {e}")
            return []
    
    def execute_update(self, query: str, params: Tuple = None) -> bool:
        """Execute INSERT/UPDATE/DELETE query"""
        try:
            cursor = self.connection.cursor()
            cursor.execute(query, params)
            cursor.close()
            return True
        except Error as e:
            print(f"Error executing update: {e}")
            return False
    
    def hash_password(self, password: str) -> str:
        """Hash password using SHA-256 (replace with bcrypt in production)"""
        return hashlib.sha256(password.encode()).hexdigest()
    
    # User Management
    def create_user(self, email: str, password: str, role: str, first_name: str, last_name: str, phone: str = None) -> bool:
        """Create a new user"""
        hashed_password = self.hash_password(password)
        query = """
        INSERT INTO users (email, password_hash, role, first_name, last_name, phone)
        VALUES (%s, %s, %s, %s, %s, %s)
        """
        return self.execute_update(query, (email, hashed_password, role, first_name, last_name, phone))
    
    def authenticate_user(self, email: str, password: str) -> Optional[Dict]:
        """Authenticate user login"""
        hashed_password = self.hash_password(password)
        query = """
        SELECT user_id, email, role, first_name, last_name, phone, is_active
        FROM users WHERE email = %s AND password_hash = %s AND is_active = TRUE
        """
        results = self.execute_query(query, (email, hashed_password))
        return results[0] if results else None
    
    def get_user_by_id(self, user_id: int) -> Optional[Dict]:
        """Get user by ID"""
        query = "SELECT * FROM users WHERE user_id = %s"
        results = self.execute_query(query, (user_id,))
        return results[0] if results else None
    
    # Student Management
    def create_student(self, user_id: int, roll_number: str, hostel_id: int, room_id: int = None, 
                      admission_year: int = 2023, course: str = "B.Tech", branch: str = "Computer Science",
                      emergency_contact: str = None, parent_name: str = None, parent_phone: str = None) -> bool:
        """Create a new student"""
        query = """
        INSERT INTO students (user_id, roll_number, hostel_id, room_id, admission_year, 
                             course, branch, emergency_contact, parent_name, parent_phone)
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
        """
        return self.execute_update(query, (user_id, roll_number, hostel_id, room_id, admission_year,
                                          course, branch, emergency_contact, parent_name, parent_phone))
    
    def get_student_by_roll(self, roll_number: str) -> Optional[Dict]:
        """Get student by roll number"""
        query = """
        SELECT s.*, u.first_name, u.last_name, u.email, u.phone, h.name as hostel_name, r.room_number
        FROM students s
        JOIN users u ON s.user_id = u.user_id
        JOIN hostels h ON s.hostel_id = h.hostel_id
        LEFT JOIN rooms r ON s.room_id = r.room_id
        WHERE s.roll_number = %s
        """
        results = self.execute_query(query, (roll_number,))
        return results[0] if results else None
    
    def get_students_by_hostel(self, hostel_name: str) -> List[Dict]:
        """Get all students in a hostel"""
        query = """
        SELECT s.*, u.first_name, u.last_name, u.email, h.name as hostel_name, r.room_number
        FROM students s
        JOIN users u ON s.user_id = u.user_id
        JOIN hostels h ON s.hostel_id = h.hostel_id
        LEFT JOIN rooms r ON s.room_id = r.room_id
        WHERE h.name = %s
        ORDER BY r.room_number, s.roll_number
        """
        return self.execute_query(query, (hostel_name,))
    
    def get_all_students(self) -> List[Dict]:
        """Get all students with details"""
        query = """
        SELECT s.*, u.first_name, u.last_name, u.email, h.name as hostel_name, r.room_number
        FROM students s
        JOIN users u ON s.user_id = u.user_id
        JOIN hostels h ON s.hostel_id = h.hostel_id
        LEFT JOIN rooms r ON s.room_id = r.room_id
        ORDER BY h.name, r.room_number, s.roll_number
        """
        return self.execute_query(query)
    
    # Attendance Management
    def record_attendance(self, student_id: int, attendance_date: date, attendance_time: time,
                         status: str, verification_method: str = "Face_Recognition",
                         confidence_score: float = None, wifi_verified: bool = False,
                         gps_verified: bool = False, gps_latitude: float = None,
                         gps_longitude: float = None, notes: str = None) -> bool:
        """Record student attendance"""
        query = """
        INSERT INTO attendance_records (student_id, attendance_date, attendance_time, status,
                                      verification_method, confidence_score, wifi_verified,
                                      gps_verified, gps_latitude, gps_longitude, notes)
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
        ON DUPLICATE KEY UPDATE
        attendance_time = VALUES(attendance_time),
        status = VALUES(status),
        verification_method = VALUES(verification_method),
        confidence_score = VALUES(confidence_score),
        wifi_verified = VALUES(wifi_verified),
        gps_verified = VALUES(gps_verified),
        gps_latitude = VALUES(gps_latitude),
        gps_longitude = VALUES(gps_longitude),
        notes = VALUES(notes)
        """
        return self.execute_update(query, (student_id, attendance_date, attendance_time, status,
                                          verification_method, confidence_score, wifi_verified,
                                          gps_verified, gps_latitude, gps_longitude, notes))
    
    def get_student_attendance(self, roll_number: str, start_date: date, end_date: date) -> List[Dict]:
        """Get attendance records for a student"""
        query = """
        SELECT ar.*, s.roll_number, u.first_name, u.last_name
        FROM attendance_records ar
        JOIN students s ON ar.student_id = s.student_id
        JOIN users u ON s.user_id = u.user_id
        WHERE s.roll_number = %s AND ar.attendance_date BETWEEN %s AND %s
        ORDER BY ar.attendance_date DESC, ar.attendance_time DESC
        """
        return self.execute_query(query, (roll_number, start_date, end_date))
    
    def get_hostel_attendance(self, hostel_name: str, attendance_date: date) -> List[Dict]:
        """Get attendance for all students in a hostel on a specific date"""
        query = """
        SELECT s.roll_number, u.first_name, u.last_name, r.room_number,
               ar.status, ar.attendance_time, ar.confidence_score
        FROM students s
        JOIN users u ON s.user_id = u.user_id
        JOIN hostels h ON s.hostel_id = h.hostel_id
        LEFT JOIN rooms r ON s.room_id = r.room_id
        LEFT JOIN attendance_records ar ON s.student_id = ar.student_id AND ar.attendance_date = %s
        WHERE h.name = %s
        ORDER BY r.room_number, s.roll_number
        """
        return self.execute_query(query, (attendance_date, hostel_name))
    
    def get_attendance_summary(self) -> List[Dict]:
        """Get attendance summary for all students"""
        query = """
        SELECT s.roll_number, u.first_name, u.last_name, h.name as hostel_name,
               COUNT(ar.attendance_id) as total_records,
               SUM(CASE WHEN ar.status = 'Present' THEN 1 ELSE 0 END) as present_count,
               SUM(CASE WHEN ar.status = 'Late' THEN 1 ELSE 0 END) as late_count,
               SUM(CASE WHEN ar.status = 'Absent' THEN 1 ELSE 0 END) as absent_count,
               ROUND((SUM(CASE WHEN ar.status = 'Present' THEN 1 ELSE 0 END) / COUNT(ar.attendance_id)) * 100, 2) as attendance_percentage
        FROM students s
        JOIN users u ON s.user_id = u.user_id
        JOIN hostels h ON s.hostel_id = h.hostel_id
        LEFT JOIN attendance_records ar ON s.student_id = ar.student_id
        GROUP BY s.student_id, s.roll_number, u.first_name, u.last_name, h.name
        ORDER BY h.name, s.roll_number
        """
        return self.execute_query(query)
    
    # Face Enrollment
    def enroll_face(self, student_id: int, face_image_path: str, face_encoding_data: str,
                   confidence_score: float = None) -> bool:
        """Enroll student face for recognition"""
        query = """
        INSERT INTO face_enrollments (student_id, face_image_path, face_encoding_data, confidence_score)
        VALUES (%s, %s, %s, %s)
        ON DUPLICATE KEY UPDATE
        face_image_path = VALUES(face_image_path),
        face_encoding_data = VALUES(face_encoding_data),
        confidence_score = VALUES(confidence_score),
        enrollment_date = CURRENT_TIMESTAMP,
        is_active = TRUE
        """
        return self.execute_update(query, (student_id, face_image_path, face_encoding_data, confidence_score))
    
    def get_face_enrollment(self, student_id: int) -> Optional[Dict]:
        """Get face enrollment data for a student"""
        query = """
        SELECT fe.*, s.roll_number, u.first_name, u.last_name
        FROM face_enrollments fe
        JOIN students s ON fe.student_id = s.student_id
        JOIN users u ON s.user_id = u.user_id
        WHERE fe.student_id = %s AND fe.is_active = TRUE
        """
        results = self.execute_query(query, (student_id,))
        return results[0] if results else None
    
    # Hostel Management
    def get_hostels(self) -> List[Dict]:
        """Get all hostels"""
        query = "SELECT * FROM hostels ORDER BY name"
        return self.execute_query(query)
    
    def get_hostel_statistics(self) -> List[Dict]:
        """Get hostel statistics"""
        query = """
        SELECT h.hostel_id, h.name as hostel_name, h.type as hostel_type, h.warden_name,
               COUNT(DISTINCT s.student_id) as total_students,
               COUNT(DISTINCT r.room_id) as total_rooms,
               SUM(r.capacity) as total_capacity,
               SUM(r.current_occupancy) as current_occupancy,
               ROUND((SUM(r.current_occupancy) / SUM(r.capacity)) * 100, 2) as occupancy_percentage
        FROM hostels h
        LEFT JOIN rooms r ON h.hostel_id = r.hostel_id
        LEFT JOIN students s ON h.hostel_id = s.hostel_id
        GROUP BY h.hostel_id, h.name, h.type, h.warden_name
        ORDER BY h.name
        """
        return self.execute_query(query)
    
    def get_rooms_by_hostel(self, hostel_name: str) -> List[Dict]:
        """Get all rooms in a hostel"""
        query = """
        SELECT r.*, h.name as hostel_name
        FROM rooms r
        JOIN hostels h ON r.hostel_id = h.hostel_id
        WHERE h.name = %s
        ORDER BY r.room_number
        """
        return self.execute_query(query, (hostel_name,))
    
    # Settings Management
    def get_setting(self, setting_name: str) -> Optional[str]:
        """Get a specific setting value"""
        query = "SELECT setting_value FROM attendance_settings WHERE setting_name = %s"
        results = self.execute_query(query, (setting_name,))
        return results[0]['setting_value'] if results else None
    
    def update_setting(self, setting_name: str, setting_value: str) -> bool:
        """Update a setting value"""
        query = """
        UPDATE attendance_settings 
        SET setting_value = %s, updated_at = CURRENT_TIMESTAMP 
        WHERE setting_name = %s
        """
        return self.execute_update(query, (setting_value, setting_name))
    
    # Utility Methods
    def update_room_occupancy(self) -> bool:
        """Update room occupancy counts"""
        query = """
        UPDATE rooms r
        SET current_occupancy = (
            SELECT COUNT(*)
            FROM students s
            WHERE s.room_id = r.room_id
        )
        """
        return self.execute_update(query)
    
    def get_database_stats(self) -> Dict:
        """Get database statistics"""
        stats = {}
        tables = ['users', 'hostels', 'rooms', 'students', 'face_enrollments', 'attendance_records']
        
        for table in tables:
            query = f"SELECT COUNT(*) as count FROM {table}"
            results = self.execute_query(query)
            stats[table] = results[0]['count'] if results else 0
        
        return stats
    
    def backup_database(self, backup_file: str) -> bool:
        """Create database backup (requires mysqldump)"""
        try:
            import subprocess
            cmd = [
                'mysqldump',
                f'--host={self.host}',
                f'--user={self.user}',
                f'--password={self.password}',
                self.database
            ]
            
            with open(backup_file, 'w') as f:
                subprocess.run(cmd, stdout=f, check=True)
            
            print(f"Database backed up to: {backup_file}")
            return True
        except Exception as e:
            print(f"Backup failed: {e}")
            return False

def main():
    """Example usage of the database manager"""
    db = VistaDatabaseManager()
    
    if not db.connect():
        return
    
    try:
        # Get database statistics
        stats = db.get_database_stats()
        print("Database Statistics:")
        for table, count in stats.items():
            print(f"  {table}: {count} records")
        
        # Get all students
        students = db.get_all_students()
        print(f"\nTotal Students: {len(students)}")
        
        # Get hostel statistics
        hostels = db.get_hostel_statistics()
        print("\nHostel Statistics:")
        for hostel in hostels:
            print(f"  {hostel['hostel_name']}: {hostel['total_students']} students, {hostel['occupancy_percentage']}% occupancy")
        
        # Get attendance summary
        attendance = db.get_attendance_summary()
        print(f"\nAttendance Summary: {len(attendance)} students with attendance records")
        
    finally:
        db.disconnect()

if __name__ == "__main__":
    main()
