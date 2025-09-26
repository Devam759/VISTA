"""
VISTA Database Utilities
Database connection and query helpers
"""

import mysql.connector
from mysql.connector import Error
from contextlib import contextmanager
from config import Config
import logging

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class DatabaseManager:
    """Database connection and query manager"""
    
    def __init__(self):
        self.config = Config.get_database_config()
    
    @contextmanager
    def get_connection(self):
        """Get database connection with context manager"""
        connection = None
        try:
            connection = mysql.connector.connect(**self.config)
            yield connection
        except Error as e:
            logger.error(f"Database connection error: {e}")
            raise
        finally:
            if connection and connection.is_connected():
                connection.close()
    
    def execute_query(self, query, params=None, fetch_one=False, fetch_all=False):
        """Execute database query"""
        with self.get_connection() as connection:
            cursor = connection.cursor(dictionary=True)
            try:
                cursor.execute(query, params)
                
                if fetch_one:
                    return cursor.fetchone()
                elif fetch_all:
                    return cursor.fetchall()
                else:
                    connection.commit()
                    return cursor.rowcount
            except Error as e:
                logger.error(f"Query execution error: {e}")
                raise
            finally:
                cursor.close()
    
    def get_user_by_email(self, email):
        """Get user by email"""
        query = """
            SELECT u.user_id, u.email, u.password_hash, u.role, u.first_name, 
                   u.last_name, u.is_active, u.last_login
            FROM users u 
            WHERE u.email = %s
        """
        return self.execute_query(query, (email,), fetch_one=True)
    
    def get_user_by_id(self, user_id):
        """Get user by ID"""
        query = """
            SELECT u.user_id, u.email, u.role, u.first_name, u.last_name, 
                   u.phone, u.is_active, u.last_login
            FROM users u 
            WHERE u.user_id = %s
        """
        return self.execute_query(query, (user_id,), fetch_one=True)
    
    def get_student_by_user_id(self, user_id):
        """Get student by user ID"""
        query = """
            SELECT s.student_id, s.roll_number, s.hostel_id, s.room_id,
                   s.course, s.branch, s.semester, s.admission_year
            FROM students s 
            WHERE s.user_id = %s
        """
        return self.execute_query(query, (user_id,), fetch_one=True)
    
    def get_students_by_hostel(self, hostel_name=None):
        """Get students by hostel"""
        if hostel_name and hostel_name != 'All Hostels':
            query = """
                SELECT s.student_id, s.roll_number, 
                       CONCAT(u.first_name, ' ', u.last_name) as name,
                       r.room_number, h.name as hostel
                FROM students s
                JOIN users u ON s.user_id = u.user_id
                JOIN hostels h ON s.hostel_id = h.hostel_id
                LEFT JOIN rooms r ON s.room_id = r.room_id
                WHERE h.name = %s
                ORDER BY r.room_number, s.roll_number
            """
            return self.execute_query(query, (hostel_name,), fetch_all=True)
        else:
            query = """
                SELECT s.student_id, s.roll_number, 
                       CONCAT(u.first_name, ' ', u.last_name) as name,
                       r.room_number, h.name as hostel
                FROM students s
                JOIN users u ON s.user_id = u.user_id
                JOIN hostels h ON s.hostel_id = h.hostel_id
                LEFT JOIN rooms r ON s.room_id = r.room_id
                ORDER BY h.name, r.room_number, s.roll_number
            """
            return self.execute_query(query, fetch_all=True)
    
    def get_attendance_records(self, user_id=None, date_filter=None, status_filter=None):
        """Get attendance records"""
        if user_id:
            # Student view - only their own records
            query = """
                SELECT ar.attendance_id, ar.attendance_date, ar.attendance_time,
                       ar.status, ar.confidence_score, ar.verification_method,
                       ar.wifi_verified, ar.gps_verified, ar.notes
                FROM attendance_records ar
                JOIN students s ON ar.student_id = s.student_id
                WHERE s.user_id = %s
            """
            params = [user_id]
            
            if date_filter:
                query += " AND ar.attendance_date = %s"
                params.append(date_filter)
            
            if status_filter and status_filter != 'All':
                query += " AND ar.status = %s"
                params.append(status_filter)
            
            query += " ORDER BY ar.attendance_date DESC, ar.attendance_time DESC"
            
        else:
            # Staff view - all records
            query = """
                SELECT ar.attendance_id, ar.attendance_date, ar.attendance_time,
                       ar.status, ar.confidence_score, ar.verification_method,
                       ar.wifi_verified, ar.gps_verified, ar.notes,
                       s.roll_number, CONCAT(u.first_name, ' ', u.last_name) as student_name,
                       h.name as hostel_name, r.room_number
                FROM attendance_records ar
                JOIN students s ON ar.student_id = s.student_id
                JOIN users u ON s.user_id = u.user_id
                JOIN hostels h ON s.hostel_id = h.hostel_id
                LEFT JOIN rooms r ON s.room_id = r.room_id
                WHERE 1=1
            """
            params = []
            
            if date_filter:
                query += " AND ar.attendance_date = %s"
                params.append(date_filter)
            
            if status_filter and status_filter != 'All':
                query += " AND ar.status = %s"
                params.append(status_filter)
            
            query += " ORDER BY ar.attendance_date DESC, ar.attendance_time DESC"
        
        return self.execute_query(query, params, fetch_all=True)
    
    def mark_attendance(self, student_id, attendance_date, attendance_time, 
                       status, verification_method, confidence_score, 
                       wifi_verified, gps_verified, notes, marked_by):
        """Mark attendance for a student"""
        query = """
            INSERT INTO attendance_records 
            (student_id, attendance_date, attendance_time, status, verification_method,
             confidence_score, wifi_verified, gps_verified, notes, marked_by)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
            ON DUPLICATE KEY UPDATE
                attendance_time = VALUES(attendance_time),
                status = VALUES(status),
                verification_method = VALUES(verification_method),
                confidence_score = VALUES(confidence_score),
                wifi_verified = VALUES(wifi_verified),
                gps_verified = VALUES(gps_verified),
                notes = VALUES(notes),
                marked_by = VALUES(marked_by),
                updated_at = CURRENT_TIMESTAMP
        """
        return self.execute_query(query, (
            student_id, attendance_date, attendance_time, status, verification_method,
            confidence_score, wifi_verified, gps_verified, notes, marked_by
        ))
    
    def get_hostels(self):
        """Get all hostels"""
        query = """
            SELECT h.hostel_id, h.name, h.type, h.warden_name, h.warden_phone,
                   h.total_rooms, h.total_capacity, h.address
            FROM hostels h
            ORDER BY h.name
        """
        return self.execute_query(query, fetch_all=True)
    
    def enroll_face(self, student_id, face_image_path, face_encoding_data, 
                   confidence_score, face_quality_score, enrollment_method, 
                   created_by, notes):
        """Enroll student face"""
        query = """
            INSERT INTO face_enrollments 
            (student_id, face_image_path, face_encoding_data, confidence_score, 
             face_quality_score, enrollment_method, created_by, notes)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
        """
        return self.execute_query(query, (
            student_id, face_image_path, face_encoding_data, confidence_score,
            face_quality_score, enrollment_method, created_by, notes
        ))
    
    def update_last_login(self, user_id):
        """Update user last login time"""
        query = "UPDATE users SET last_login = NOW() WHERE user_id = %s"
        return self.execute_query(query, (user_id,))
    
    def check_attendance_exists(self, student_id, attendance_date):
        """Check if attendance already exists for a student on a date"""
        query = """
            SELECT attendance_id FROM attendance_records 
            WHERE student_id = %s AND attendance_date = %s
        """
        result = self.execute_query(query, (student_id, attendance_date), fetch_one=True)
        return result is not None
    
    def get_attendance_statistics(self, hostel_id=None, date_filter=None):
        """Get attendance statistics"""
        if hostel_id:
            query = """
                SELECT 
                    COUNT(DISTINCT s.student_id) as total_students,
                    COUNT(ar.attendance_id) as attendance_marked,
                    SUM(CASE WHEN ar.status = 'Present' THEN 1 ELSE 0 END) as present_count,
                    SUM(CASE WHEN ar.status = 'Late' THEN 1 ELSE 0 END) as late_count,
                    SUM(CASE WHEN ar.status = 'Absent' THEN 1 ELSE 0 END) as absent_count
                FROM students s
                LEFT JOIN attendance_records ar ON s.student_id = ar.student_id 
                    AND ar.attendance_date = %s
                WHERE s.hostel_id = %s
            """
            return self.execute_query(query, (date_filter, hostel_id), fetch_one=True)
        else:
            query = """
                SELECT 
                    COUNT(DISTINCT s.student_id) as total_students,
                    COUNT(ar.attendance_id) as attendance_marked,
                    SUM(CASE WHEN ar.status = 'Present' THEN 1 ELSE 0 END) as present_count,
                    SUM(CASE WHEN ar.status = 'Late' THEN 1 ELSE 0 END) as late_count,
                    SUM(CASE WHEN ar.status = 'Absent' THEN 1 ELSE 0 END) as absent_count
                FROM students s
                LEFT JOIN attendance_records ar ON s.student_id = ar.student_id 
                    AND ar.attendance_date = %s
            """
            return self.execute_query(query, (date_filter,), fetch_one=True)

# Global database manager instance
db_manager = DatabaseManager()
