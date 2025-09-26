"""
VISTA Enhanced Database Manager
Supports both MySQL and PostgreSQL with CSV upload functionality
"""

import mysql.connector
from mysql.connector import Error as MySQLError
import psycopg2
from psycopg2 import Error as PostgreSQLError
from contextlib import contextmanager
from config import Config
import logging
import pandas as pd
import os
from werkzeug.utils import secure_filename
import csv
import io

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class DatabaseManager:
    """Enhanced database connection and query manager supporting MySQL and PostgreSQL"""
    
    def __init__(self):
        self.config = Config.get_database_config()
        self.db_type = Config.DB_TYPE
    
    @contextmanager
    def get_connection(self):
        """Get database connection with context manager"""
        connection = None
        try:
            if self.db_type == 'postgresql':
                connection = psycopg2.connect(**self.config)
            else:  # MySQL
                connection = mysql.connector.connect(**self.config)
            yield connection
        except (MySQLError, PostgreSQLError) as e:
            logger.error(f"Database connection error: {e}")
            raise
        finally:
            if connection and not connection.closed if hasattr(connection, 'closed') else connection.is_connected():
                connection.close()
    
    def execute_query(self, query, params=None, fetch_one=False, fetch_all=False):
        """Execute database query with MySQL/PostgreSQL compatibility"""
        with self.get_connection() as connection:
            cursor = connection.cursor()
            try:
                # Handle parameter placeholders for different databases
                if self.db_type == 'postgresql':
                    # PostgreSQL uses %s for parameters
                    cursor.execute(query, params)
                else:
                    # MySQL uses %s for parameters
                    cursor.execute(query, params)
                
                if fetch_one:
                    result = cursor.fetchone()
                    if result and self.db_type == 'postgresql':
                        # Convert to dictionary for PostgreSQL
                        columns = [desc[0] for desc in cursor.description]
                        return dict(zip(columns, result))
                    return result
                elif fetch_all:
                    results = cursor.fetchall()
                    if results and self.db_type == 'postgresql':
                        # Convert to list of dictionaries for PostgreSQL
                        columns = [desc[0] for desc in cursor.description]
                        return [dict(zip(columns, row)) for row in results]
                    return results
                else:
                    connection.commit()
                    return cursor.rowcount
            except (MySQLError, PostgreSQLError) as e:
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
        if self.db_type == 'postgresql':
            query = """
                INSERT INTO attendance_records 
                (student_id, attendance_date, attendance_time, status, verification_method,
                 confidence_score, wifi_verified, gps_verified, notes, marked_by)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                ON CONFLICT (student_id, attendance_date) DO UPDATE SET
                    attendance_time = EXCLUDED.attendance_time,
                    status = EXCLUDED.status,
                    verification_method = EXCLUDED.verification_method,
                    confidence_score = EXCLUDED.confidence_score,
                    wifi_verified = EXCLUDED.wifi_verified,
                    gps_verified = EXCLUDED.gps_verified,
                    notes = EXCLUDED.notes,
                    marked_by = EXCLUDED.marked_by,
                    updated_at = CURRENT_TIMESTAMP
            """
        else:  # MySQL
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

class CSVUploadManager:
    """CSV upload and processing manager"""
    
    def __init__(self):
        self.upload_folder = Config.CSV_UPLOAD_FOLDER
        self.allowed_extensions = Config.ALLOWED_CSV_EXTENSIONS
        self.max_size = Config.MAX_CSV_SIZE
        
        # Create upload directory if it doesn't exist
        os.makedirs(self.upload_folder, exist_ok=True)
    
    def allowed_file(self, filename):
        """Check if file extension is allowed"""
        return '.' in filename and \
               filename.rsplit('.', 1)[1].lower() in self.allowed_extensions
    
    def upload_csv(self, file):
        """Upload and validate CSV file"""
        if not file or not self.allowed_file(file.filename):
            raise ValueError("Invalid file type. Only CSV files are allowed.")
        
        if file.content_length > self.max_size:
            raise ValueError(f"File too large. Maximum size is {self.max_size} bytes.")
        
        filename = secure_filename(file.filename)
        filepath = os.path.join(self.upload_folder, filename)
        file.save(filepath)
        
        return filepath
    
    def process_students_csv(self, filepath):
        """Process students CSV file and return data"""
        try:
            df = pd.read_csv(filepath)
            
            # Validate required columns
            required_columns = ['roll_number', 'first_name', 'last_name', 'email', 'hostel_name', 'room_number']
            missing_columns = [col for col in required_columns if col not in df.columns]
            
            if missing_columns:
                raise ValueError(f"Missing required columns: {missing_columns}")
            
            # Clean and validate data
            df = df.dropna(subset=required_columns)
            df['email'] = df['email'].str.lower().str.strip()
            df['roll_number'] = df['roll_number'].str.upper().str.strip()
            
            return df.to_dict('records')
            
        except Exception as e:
            raise ValueError(f"Error processing CSV file: {str(e)}")
    
    def process_attendance_csv(self, filepath):
        """Process attendance CSV file and return data"""
        try:
            df = pd.read_csv(filepath)
            
            # Validate required columns
            required_columns = ['roll_number', 'attendance_date', 'status']
            missing_columns = [col for col in required_columns if col not in df.columns]
            
            if missing_columns:
                raise ValueError(f"Missing required columns: {missing_columns}")
            
            # Clean and validate data
            df = df.dropna(subset=required_columns)
            df['roll_number'] = df['roll_number'].str.upper().str.strip()
            df['status'] = df['status'].str.title().str.strip()
            
            # Validate status values
            valid_statuses = ['Present', 'Late', 'Absent']
            invalid_statuses = df[~df['status'].isin(valid_statuses)]['status'].unique()
            if len(invalid_statuses) > 0:
                raise ValueError(f"Invalid status values: {invalid_statuses}")
            
            return df.to_dict('records')
            
        except Exception as e:
            raise ValueError(f"Error processing CSV file: {str(e)}")
    
    def bulk_import_students(self, db_manager, csv_data):
        """Bulk import students from CSV data"""
        try:
            with db_manager.get_connection() as connection:
                cursor = connection.cursor()
                
                success_count = 0
                error_count = 0
                errors = []
                
                for row in csv_data:
                    try:
                        # Insert user
                        user_query = """
                            INSERT INTO users (email, password_hash, role, first_name, last_name, is_active)
                            VALUES (%s, %s, %s, %s, %s, %s)
                        """
                        password_hash = "$2b$10$default_hash_for_csv_import"
                        cursor.execute(user_query, (
                            row['email'], password_hash, 'Student', 
                            row['first_name'], row['last_name'], True
                        ))
                        
                        user_id = cursor.lastrowid if db_manager.db_type == 'mysql' else cursor.fetchone()[0]
                        
                        # Get hostel and room IDs
                        hostel_query = "SELECT hostel_id FROM hostels WHERE name = %s"
                        cursor.execute(hostel_query, (row['hostel_name'],))
                        hostel_result = cursor.fetchone()
                        
                        if not hostel_result:
                            raise ValueError(f"Hostel {row['hostel_name']} not found")
                        
                        hostel_id = hostel_result[0]
                        
                        room_query = "SELECT room_id FROM rooms WHERE room_number = %s AND hostel_id = %s"
                        cursor.execute(room_query, (row['room_number'], hostel_id))
                        room_result = cursor.fetchone()
                        
                        if not room_result:
                            raise ValueError(f"Room {row['room_number']} not found in {row['hostel_name']}")
                        
                        room_id = room_result[0]
                        
                        # Insert student
                        student_query = """
                            INSERT INTO students (user_id, roll_number, hostel_id, room_id, 
                                                admission_year, course, branch, semester)
                            VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
                        """
                        cursor.execute(student_query, (
                            user_id, row['roll_number'], hostel_id, room_id,
                            row.get('admission_year', 2023), row.get('course', 'B.Tech'),
                            row.get('branch', 'Computer Science'), row.get('semester', 3)
                        ))
                        
                        success_count += 1
                        
                    except Exception as e:
                        error_count += 1
                        errors.append(f"Row {row.get('roll_number', 'unknown')}: {str(e)}")
                
                connection.commit()
                cursor.close()
                
                return {
                    'success_count': success_count,
                    'error_count': error_count,
                    'errors': errors
                }
                
        except Exception as e:
            raise ValueError(f"Bulk import failed: {str(e)}")

# Global instances
db_manager = DatabaseManager()
csv_manager = CSVUploadManager()
