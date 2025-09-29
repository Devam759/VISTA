-- =====================================================
-- VISTA College Night Attendance System Database Schema
-- =====================================================
-- Created: 2025-01-27
-- Description: Complete database schema for hostel management and attendance tracking
-- Features: Face recognition, GPS tracking, WiFi verification, role-based access

-- Create database
CREATE DATABASE IF NOT EXISTS vista_attendance;
USE vista_attendance;

-- =====================================================
-- CORE TABLES
-- =====================================================

-- Users table (Authentication and role management)
CREATE TABLE users (
    user_id INT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('Student', 'Warden') NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phone VARCHAR(15),
    profile_image VARCHAR(500),
    is_active BOOLEAN DEFAULT TRUE,
    last_login TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_email (email),
    INDEX idx_role (role),
    INDEX idx_active (is_active)
);

-- Hostels table
CREATE TABLE hostels (
    hostel_id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50) UNIQUE NOT NULL,
    type ENUM('Boys', 'Girls') NOT NULL,
    warden_name VARCHAR(100) NOT NULL,
    warden_phone VARCHAR(15),
    warden_email VARCHAR(255),
    total_rooms INT DEFAULT 0,
    total_capacity INT DEFAULT 0,
    address TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_type (type),
    INDEX idx_name (name)
);

-- Rooms table
CREATE TABLE rooms (
    room_id INT PRIMARY KEY AUTO_INCREMENT,
    hostel_id INT NOT NULL,
    room_number VARCHAR(20) NOT NULL,
    floor_number INT,
    capacity INT DEFAULT 1,
    current_occupancy INT DEFAULT 0,
    room_type ENUM('Single', 'Double', 'Triple', 'Quad') DEFAULT 'Quad',
    is_available BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (hostel_id) REFERENCES hostels(hostel_id) ON DELETE CASCADE,
    UNIQUE KEY unique_hostel_room (hostel_id, room_number),
    INDEX idx_hostel (hostel_id),
    INDEX idx_availability (is_available)
);

-- Students table (extends users for student-specific data)
CREATE TABLE students (
    student_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    roll_number VARCHAR(20) UNIQUE NOT NULL,
    hostel_id INT NOT NULL,
    room_id INT,
    admission_year YEAR NOT NULL,
    course VARCHAR(100),
    branch VARCHAR(100),
    semester INT,
    emergency_contact VARCHAR(15),
    parent_name VARCHAR(200),
    parent_phone VARCHAR(15),
    parent_email VARCHAR(255),
    blood_group VARCHAR(5),
    date_of_birth DATE,
    address TEXT,
    is_resident BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (hostel_id) REFERENCES hostels(hostel_id) ON DELETE RESTRICT,
    FOREIGN KEY (room_id) REFERENCES rooms(room_id) ON DELETE SET NULL,
    INDEX idx_roll_number (roll_number),
    INDEX idx_hostel (hostel_id),
    INDEX idx_course (course),
    INDEX idx_branch (branch)
);

-- Face enrollment table (for student biometric data)
CREATE TABLE face_enrollments (
    enrollment_id INT PRIMARY KEY AUTO_INCREMENT,
    student_id INT NOT NULL,
    face_image_path VARCHAR(500),
    face_encoding_data LONGTEXT,
    enrollment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE,
    confidence_score DECIMAL(5,2),
    face_quality_score DECIMAL(5,2),
    enrollment_method ENUM('Manual', 'Auto', 'Bulk') DEFAULT 'Manual',
    created_by INT,
    notes TEXT,
    
    FOREIGN KEY (student_id) REFERENCES students(student_id) ON DELETE CASCADE,
    FOREIGN KEY (created_by) REFERENCES users(user_id) ON DELETE SET NULL,
    INDEX idx_student (student_id),
    INDEX idx_active (is_active),
    INDEX idx_enrollment_date (enrollment_date)
);

-- Attendance records table
CREATE TABLE attendance_records (
    attendance_id INT PRIMARY KEY AUTO_INCREMENT,
    student_id INT NOT NULL,
    attendance_date DATE NOT NULL,
    attendance_time TIME NOT NULL,
    status ENUM('Present', 'Late', 'Absent') NOT NULL,
    verification_method ENUM('Face_Recognition', 'Manual', 'Wifi', 'GPS', 'QR_Code') DEFAULT 'Face_Recognition',
    confidence_score DECIMAL(5,2),
    wifi_verified BOOLEAN DEFAULT FALSE,
    gps_verified BOOLEAN DEFAULT FALSE,
    gps_latitude DECIMAL(10, 8),
    gps_longitude DECIMAL(11, 8),
    gps_accuracy DECIMAL(8, 2),
    wifi_ssid VARCHAR(100),
    wifi_mac_address VARCHAR(17),
    device_info TEXT,
    ip_address VARCHAR(45),
    user_agent TEXT,
    notes TEXT,
    marked_by INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (student_id) REFERENCES students(student_id) ON DELETE CASCADE,
    FOREIGN KEY (marked_by) REFERENCES users(user_id) ON DELETE SET NULL,
    UNIQUE KEY unique_daily_attendance (student_id, attendance_date),
    INDEX idx_date (attendance_date),
    INDEX idx_student_date (student_id, attendance_date),
    INDEX idx_status (status),
    INDEX idx_verification (verification_method)
);

-- =====================================================
-- CONFIGURATION TABLES
-- =====================================================

-- Attendance settings table (for system configuration)
CREATE TABLE attendance_settings (
    setting_id INT PRIMARY KEY AUTO_INCREMENT,
    setting_name VARCHAR(100) UNIQUE NOT NULL,
    setting_value VARCHAR(500) NOT NULL,
    setting_type ENUM('String', 'Number', 'Boolean', 'Time', 'JSON') DEFAULT 'String',
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    updated_by INT,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (updated_by) REFERENCES users(user_id) ON DELETE SET NULL,
    INDEX idx_name (setting_name),
    INDEX idx_active (is_active)
);

-- System logs table (for audit and debugging)
CREATE TABLE system_logs (
    log_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    action VARCHAR(100) NOT NULL,
    table_name VARCHAR(100),
    record_id INT,
    old_values JSON,
    new_values JSON,
    ip_address VARCHAR(45),
    user_agent TEXT,
    severity ENUM('INFO', 'WARNING', 'ERROR', 'CRITICAL') DEFAULT 'INFO',
    message TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE SET NULL,
    INDEX idx_user (user_id),
    INDEX idx_action (action),
    INDEX idx_created (created_at),
    INDEX idx_severity (severity)
);

-- Notifications table (for system notifications)
CREATE TABLE notifications (
    notification_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    title VARCHAR(200) NOT NULL,
    message TEXT,
    type ENUM('Info', 'Warning', 'Error', 'Success') DEFAULT 'Info',
    is_read BOOLEAN DEFAULT FALSE,
    priority ENUM('Low', 'Medium', 'High', 'Critical') DEFAULT 'Medium',
    expires_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    INDEX idx_user (user_id),
    INDEX idx_read (is_read),
    INDEX idx_priority (priority),
    INDEX idx_created (created_at)
);

-- =====================================================
-- SAMPLE DATA INSERTION
-- =====================================================

-- Insert default hostels
INSERT INTO hostels (name, type, warden_name, warden_phone, warden_email, total_rooms, total_capacity, address) VALUES
('BH1', 'Boys', 'Mr. Verma', '9876543210', 'verma@jklu.edu.in', 50, 200, 'Boys Hostel Block 1, JK Lakshmipat University'),
('BH2', 'Boys', 'Mr. Rao', '9876543211', 'rao@jklu.edu.in', 50, 200, 'Boys Hostel Block 2, JK Lakshmipat University'),
('GH1', 'Girls', 'Ms. Kapoor', '9876543212', 'kapoor@jklu.edu.in', 40, 160, 'Girls Hostel Block 1, JK Lakshmipat University'),
('GH2', 'Girls', 'Ms. Sharma', '9876543213', 'sharma@jklu.edu.in', 40, 160, 'Girls Hostel Block 2, JK Lakshmipat University');

-- Insert sample rooms for each hostel
INSERT INTO rooms (hostel_id, room_number, floor_number, capacity, room_type) VALUES
-- BH1 rooms (Floors 1-3)
(1, 'B-101', 1, 4, 'Quad'), (1, 'B-102', 1, 4, 'Quad'), (1, 'B-103', 1, 4, 'Quad'), (1, 'B-104', 1, 4, 'Quad'), (1, 'B-105', 1, 4, 'Quad'),
(1, 'B-201', 2, 4, 'Quad'), (1, 'B-202', 2, 4, 'Quad'), (1, 'B-203', 2, 4, 'Quad'), (1, 'B-204', 2, 4, 'Quad'), (1, 'B-205', 2, 4, 'Quad'),
(1, 'B-206', 2, 4, 'Quad'), (1, 'B-207', 2, 4, 'Quad'), (1, 'B-208', 2, 4, 'Quad'), (1, 'B-209', 2, 4, 'Quad'), (1, 'B-210', 2, 4, 'Quad'),

-- BH2 rooms (Floors 1-3)
(2, 'B-101', 1, 4, 'Quad'), (2, 'B-102', 1, 4, 'Quad'), (2, 'B-103', 1, 4, 'Quad'), (2, 'B-104', 1, 4, 'Quad'), (2, 'B-105', 1, 4, 'Quad'),
(2, 'B-110', 1, 4, 'Quad'), (2, 'B-111', 1, 4, 'Quad'), (2, 'B-112', 1, 4, 'Quad'), (2, 'B-113', 1, 4, 'Quad'), (2, 'B-114', 1, 4, 'Quad'),
(2, 'B-115', 1, 4, 'Quad'), (2, 'B-116', 1, 4, 'Quad'), (2, 'B-117', 1, 4, 'Quad'), (2, 'B-118', 1, 4, 'Quad'), (2, 'B-119', 1, 4, 'Quad'),

-- GH1 rooms (Floors 3-4)
(3, 'G-301', 3, 4, 'Quad'), (3, 'G-302', 3, 4, 'Quad'), (3, 'G-303', 3, 4, 'Quad'), (3, 'G-304', 3, 4, 'Quad'), (3, 'G-305', 3, 4, 'Quad'),
(3, 'G-310', 3, 4, 'Quad'), (3, 'G-311', 3, 4, 'Quad'), (3, 'G-312', 3, 4, 'Quad'), (3, 'G-313', 3, 4, 'Quad'), (3, 'G-314', 3, 4, 'Quad'),
(3, 'G-315', 3, 4, 'Quad'), (3, 'G-316', 3, 4, 'Quad'), (3, 'G-317', 3, 4, 'Quad'), (3, 'G-318', 3, 4, 'Quad'), (3, 'G-319', 3, 4, 'Quad'),

-- GH2 rooms (Floors 4-5)
(4, 'G-401', 4, 4, 'Quad'), (4, 'G-402', 4, 4, 'Quad'), (4, 'G-403', 4, 4, 'Quad'), (4, 'G-404', 4, 4, 'Quad'), (4, 'G-405', 4, 4, 'Quad'),
(4, 'G-410', 4, 4, 'Quad'), (4, 'G-411', 4, 4, 'Quad'), (4, 'G-412', 4, 4, 'Quad'), (4, 'G-413', 4, 4, 'Quad'), (4, 'G-414', 4, 4, 'Quad'),
(4, 'G-415', 4, 4, 'Quad'), (4, 'G-416', 4, 4, 'Quad'), (4, 'G-417', 4, 4, 'Quad'), (4, 'G-418', 4, 4, 'Quad'), (4, 'G-419', 4, 4, 'Quad');

-- Insert default attendance settings
INSERT INTO attendance_settings (setting_name, setting_value, setting_type, description) VALUES
('attendance_deadline', '22:30:00', 'Time', 'Time after which attendance is marked as late'),
('face_recognition_threshold', '0.85', 'Number', 'Minimum confidence score for face recognition'),
('gps_accuracy_radius', '100', 'Number', 'GPS accuracy radius in meters'),
('max_late_minutes', '30', 'Number', 'Maximum minutes after deadline to mark as late'),
('auto_absent_hours', '24', 'Number', 'Hours after which absent students are automatically marked absent'),
('wifi_ssid_required', 'JKLU-Hostel', 'String', 'Required WiFi SSID for attendance verification'),
('gps_latitude_center', '26.2389', 'Number', 'Center latitude for hostel GPS verification'),
('gps_longitude_center', '73.0243', 'Number', 'Center longitude for hostel GPS verification'),
('enable_face_recognition', 'true', 'Boolean', 'Enable face recognition for attendance'),
('enable_gps_verification', 'true', 'Boolean', 'Enable GPS verification for attendance'),
('enable_wifi_verification', 'true', 'Boolean', 'Enable WiFi verification for attendance');

-- Insert sample users (warden and students)
INSERT INTO users (email, password_hash, role, first_name, last_name, phone) VALUES
-- Warden users
('bhuwanesh@jklu.edu.in', '$2b$10$example_hash_for_warden', 'Warden', 'Bhuwanesh', 'Sharma', '9876543210'),

-- Student users
('devamgupta@jklu.edu.in', '$2b$10$example_hash_for_student', 'Student', 'Devam', 'Gupta', '9876543211'),
('aarav.patel@jklu.edu.in', '$2b$10$example_hash_for_student', 'Student', 'Aarav', 'Patel', '9876543212'),
('isha.sharma@jklu.edu.in', '$2b$10$example_hash_for_student', 'Student', 'Isha', 'Sharma', '9876543213'),
('rohan.mehta@jklu.edu.in', '$2b$10$example_hash_for_student', 'Student', 'Rohan', 'Mehta', '9876543214'),
('priya.singh@jklu.edu.in', '$2b$10$example_hash_for_student', 'Student', 'Priya', 'Singh', '9876543215'),
('arjun.kumar@jklu.edu.in', '$2b$10$example_hash_for_student', 'Student', 'Arjun', 'Kumar', '9876543216'),
('sneha.reddy@jklu.edu.in', '$2b$10$example_hash_for_student', 'Student', 'Sneha', 'Reddy', '9876543217'),
('vikram.joshi@jklu.edu.in', '$2b$10$example_hash_for_student', 'Student', 'Vikram', 'Joshi', '9876543218'),
('ananya.gupta@jklu.edu.in', '$2b$10$example_hash_for_student', 'Student', 'Ananya', 'Gupta', '9876543219'),
('kavya.nair@jklu.edu.in', '$2b$10$example_hash_for_student', 'Student', 'Kavya', 'Nair', '9876543220'),
('meera.joshi@jklu.edu.in', '$2b$10$example_hash_for_student', 'Student', 'Meera', 'Joshi', '9876543221'),
('riya.agarwal@jklu.edu.in', '$2b$10$example_hash_for_student', 'Student', 'Riya', 'Agarwal', '9876543222');

-- Insert students data
INSERT INTO students (user_id, roll_number, hostel_id, room_id, admission_year, course, branch, semester, emergency_contact, parent_name, parent_phone, parent_email, blood_group, date_of_birth, address) VALUES
(3, '23BCS999', 1, 6, 2023, 'B.Tech', 'Computer Science', 3, '9876543211', 'Raj Gupta', '9876543201', 'raj.gupta@email.com', 'O+', '2005-03-15', '123 Main St, Jaipur'),
(4, '23BCS001', 1, 6, 2023, 'B.Tech', 'Computer Science', 3, '9876543212', 'Raj Patel', '9876543202', 'raj.patel@email.com', 'A+', '2005-04-20', '456 Park Ave, Jaipur'),
(5, '23BCS002', 3, 20, 2023, 'B.Tech', 'Computer Science', 3, '9876543213', 'Sunita Sharma', '9876543203', 'sunita.sharma@email.com', 'B+', '2005-05-10', '789 Garden St, Jaipur'),
(6, '23BCS003', 2, 21, 2023, 'B.Tech', 'Computer Science', 3, '9876543214', 'Ravi Mehta', '9876543204', 'ravi.mehta@email.com', 'AB+', '2005-06-25', '321 Lake View, Jaipur'),
(7, '23BCS004', 1, 7, 2023, 'B.Tech', 'Computer Science', 3, '9876543215', 'Priyanka Singh', '9876543205', 'priyanka.singh@email.com', 'O-', '2005-07-12', '654 Hill St, Jaipur'),
(8, '23BCS005', 2, 22, 2023, 'B.Tech', 'Computer Science', 3, '9876543216', 'Amit Kumar', '9876543206', 'amit.kumar@email.com', 'A-', '2005-08-08', '987 Valley Rd, Jaipur'),
(9, '23BCS006', 1, 8, 2023, 'B.Tech', 'Computer Science', 3, '9876543217', 'Lakshmi Reddy', '9876543207', 'lakshmi.reddy@email.com', 'B-', '2005-09-30', '147 Forest Ave, Jaipur'),
(10, '23BCS007', 2, 23, 2023, 'B.Tech', 'Computer Science', 3, '9876543218', 'Suresh Joshi', '9876543208', 'suresh.joshi@email.com', 'AB-', '2005-10-15', '258 River St, Jaipur'),
(11, '23BCS008', 3, 21, 2023, 'B.Tech', 'Computer Science', 3, '9876543219', 'Neha Gupta', '9876543209', 'neha.gupta@email.com', 'O+', '2005-11-22', '369 Mountain Rd, Jaipur'),
(12, '23BCS009', 4, 26, 2023, 'B.Tech', 'Computer Science', 3, '9876543220', 'Rajesh Nair', '9876543210', 'rajesh.nair@email.com', 'A+', '2005-12-05', '741 Ocean Blvd, Jaipur'),
(13, '23BCS010', 4, 27, 2023, 'B.Tech', 'Computer Science', 3, '9876543221', 'Sunita Joshi', '9876543211', 'sunita.joshi@email.com', 'B+', '2006-01-18', '852 Desert St, Jaipur'),
(14, '23BCS011', 4, 28, 2023, 'B.Tech', 'Computer Science', 3, '9876543222', 'Vikram Agarwal', '9876543212', 'vikram.agarwal@email.com', 'AB+', '2006-02-28', '963 Sky Lane, Jaipur');

-- Insert sample attendance records
INSERT INTO attendance_records (student_id, attendance_date, attendance_time, status, verification_method, confidence_score, wifi_verified, gps_verified, gps_latitude, gps_longitude, gps_accuracy, wifi_ssid, ip_address, notes) VALUES
-- Recent attendance records for today
(1, '2025-01-27', '22:05:00', 'Present', 'Face_Recognition', 98.4, TRUE, TRUE, 26.2389, 73.0243, 5.2, 'JKLU-Hostel', '192.168.1.100', 'Face recognition successful'),
(2, '2025-01-27', '22:17:00', 'Late', 'Face_Recognition', 92.1, TRUE, FALSE, 26.2389, 73.0243, 8.5, 'JKLU-Hostel', '192.168.1.101', 'Late arrival'),
(3, '2025-01-27', '22:45:00', 'Absent', 'Manual', 0.0, FALSE, FALSE, NULL, NULL, NULL, NULL, '192.168.1.102', 'No attendance marked'),
(4, '2025-01-27', '22:08:00', 'Present', 'Face_Recognition', 97.8, TRUE, TRUE, 26.2389, 73.0243, 3.1, 'JKLU-Hostel', '192.168.1.103', 'Face recognition successful'),
(5, '2025-01-27', '22:12:00', 'Present', 'Face_Recognition', 96.5, TRUE, TRUE, 26.2389, 73.0243, 4.8, 'JKLU-Hostel', '192.168.1.104', 'Face recognition successful'),
(6, '2025-01-27', '22:15:00', 'Present', 'Face_Recognition', 99.1, TRUE, TRUE, 26.2389, 73.0243, 2.3, 'JKLU-Hostel', '192.168.1.105', 'Face recognition successful'),
(7, '2025-01-27', '22:20:00', 'Late', 'Face_Recognition', 89.3, TRUE, FALSE, 26.2389, 73.0243, 12.1, 'JKLU-Hostel', '192.168.1.106', 'Late arrival with low confidence'),
(8, '2025-01-27', '22:25:00', 'Present', 'Face_Recognition', 95.7, TRUE, TRUE, 26.2389, 73.0243, 6.7, 'JKLU-Hostel', '192.168.1.107', 'Face recognition successful'),
(9, '2025-01-27', '22:15:00', 'Present', 'Face_Recognition', 97.2, TRUE, TRUE, 26.2389, 73.0243, 4.2, 'JKLU-Hostel', '192.168.1.108', 'Face recognition successful'),
(10, '2025-01-27', '22:20:00', 'Late', 'Face_Recognition', 91.8, TRUE, FALSE, 26.2389, 73.0243, 9.8, 'JKLU-Hostel', '192.168.1.109', 'Late arrival'),
(11, '2025-01-27', '22:25:00', 'Present', 'Face_Recognition', 98.9, TRUE, TRUE, 26.2389, 73.0243, 3.5, 'JKLU-Hostel', '192.168.1.110', 'Face recognition successful'),
(12, '2025-01-27', '22:30:00', 'Present', 'Face_Recognition', 94.2, TRUE, TRUE, 26.2389, 73.0243, 7.1, 'JKLU-Hostel', '192.168.1.111', 'Face recognition successful');

-- =====================================================
-- VIEWS FOR COMMON QUERIES
-- =====================================================

-- Student details view
CREATE VIEW student_details AS
SELECT 
    s.student_id,
    s.roll_number,
    u.first_name,
    u.last_name,
    CONCAT(u.first_name, ' ', u.last_name) as full_name,
    u.email,
    u.phone,
    h.name as hostel_name,
    h.type as hostel_type,
    r.room_number,
    s.course,
    s.branch,
    s.semester,
    s.admission_year,
    s.parent_name,
    s.parent_phone,
    s.parent_email,
    s.emergency_contact,
    s.blood_group,
    s.date_of_birth,
    s.is_resident,
    s.created_at
FROM students s
JOIN users u ON s.user_id = u.user_id
JOIN hostels h ON s.hostel_id = h.hostel_id
LEFT JOIN rooms r ON s.room_id = r.room_id;

-- Attendance summary view
CREATE VIEW attendance_summary AS
SELECT 
    s.student_id,
    s.roll_number,
    u.first_name,
    u.last_name,
    CONCAT(u.first_name, ' ', u.last_name) as full_name,
    h.name as hostel_name,
    COUNT(ar.attendance_id) as total_records,
    SUM(CASE WHEN ar.status = 'Present' THEN 1 ELSE 0 END) as present_count,
    SUM(CASE WHEN ar.status = 'Late' THEN 1 ELSE 0 END) as late_count,
    SUM(CASE WHEN ar.status = 'Absent' THEN 1 ELSE 0 END) as absent_count,
    ROUND((SUM(CASE WHEN ar.status = 'Present' THEN 1 ELSE 0 END) / COUNT(ar.attendance_id)) * 100, 2) as attendance_percentage,
    MAX(ar.attendance_date) as last_attendance_date
FROM students s
JOIN users u ON s.user_id = u.user_id
JOIN hostels h ON s.hostel_id = h.hostel_id
LEFT JOIN attendance_records ar ON s.student_id = ar.student_id
GROUP BY s.student_id, s.roll_number, u.first_name, u.last_name, h.name;

-- Hostel statistics view
CREATE VIEW hostel_statistics AS
SELECT 
    h.hostel_id,
    h.name as hostel_name,
    h.type as hostel_type,
    h.warden_name,
    h.warden_phone,
    h.warden_email,
    COUNT(DISTINCT s.student_id) as total_students,
    COUNT(DISTINCT r.room_id) as total_rooms,
    SUM(r.capacity) as total_capacity,
    SUM(r.current_occupancy) as current_occupancy,
    ROUND((SUM(r.current_occupancy) / SUM(r.capacity)) * 100, 2) as occupancy_percentage,
    COUNT(DISTINCT CASE WHEN ar.status = 'Present' AND ar.attendance_date = CURDATE() THEN s.student_id END) as present_today,
    COUNT(DISTINCT CASE WHEN ar.status = 'Late' AND ar.attendance_date = CURDATE() THEN s.student_id END) as late_today,
    COUNT(DISTINCT CASE WHEN ar.status = 'Absent' AND ar.attendance_date = CURDATE() THEN s.student_id END) as absent_today
FROM hostels h
LEFT JOIN rooms r ON h.hostel_id = r.hostel_id
LEFT JOIN students s ON h.hostel_id = s.hostel_id
LEFT JOIN attendance_records ar ON s.student_id = ar.student_id AND ar.attendance_date = CURDATE()
GROUP BY h.hostel_id, h.name, h.type, h.warden_name, h.warden_phone, h.warden_email;

-- =====================================================
-- STORED PROCEDURES
-- =====================================================

DELIMITER //

-- Get student attendance for date range
CREATE PROCEDURE GetStudentAttendance(IN student_roll VARCHAR(20), IN start_date DATE, IN end_date DATE)
BEGIN
    SELECT 
        ar.attendance_date,
        ar.attendance_time,
        ar.status,
        ar.verification_method,
        ar.confidence_score,
        ar.wifi_verified,
        ar.gps_verified,
        ar.notes
    FROM attendance_records ar
    JOIN students s ON ar.student_id = s.student_id
    WHERE s.roll_number = student_roll
    AND ar.attendance_date BETWEEN start_date AND end_date
    ORDER BY ar.attendance_date DESC, ar.attendance_time DESC;
END //

-- Get hostel attendance for specific date
CREATE PROCEDURE GetHostelAttendance(IN hostel_name VARCHAR(50), IN attendance_date DATE)
BEGIN
    SELECT 
        s.roll_number,
        u.first_name,
        u.last_name,
        r.room_number,
        ar.status,
        ar.attendance_time,
        ar.confidence_score,
        ar.verification_method
    FROM students s
    JOIN users u ON s.user_id = u.user_id
    JOIN hostels h ON s.hostel_id = h.hostel_id
    LEFT JOIN rooms r ON s.room_id = r.room_id
    LEFT JOIN attendance_records ar ON s.student_id = ar.student_id AND ar.attendance_date = attendance_date
    WHERE h.name = hostel_name
    ORDER BY r.room_number, s.roll_number;
END //

-- Update room occupancy
CREATE PROCEDURE UpdateRoomOccupancy()
BEGIN
    UPDATE rooms r
    SET current_occupancy = (
        SELECT COUNT(*)
        FROM students s
        WHERE s.room_id = r.room_id
    );
END //

-- Mark attendance with verification
CREATE PROCEDURE MarkAttendance(
    IN p_student_id INT,
    IN p_attendance_date DATE,
    IN p_attendance_time TIME,
    IN p_status ENUM('Present', 'Late', 'Absent'),
    IN p_verification_method ENUM('Face_Recognition', 'Manual', 'Wifi', 'GPS', 'QR_Code'),
    IN p_confidence_score DECIMAL(5,2),
    IN p_wifi_verified BOOLEAN,
    IN p_gps_verified BOOLEAN,
    IN p_gps_latitude DECIMAL(10, 8),
    IN p_gps_longitude DECIMAL(11, 8),
    IN p_wifi_ssid VARCHAR(100),
    IN p_notes TEXT,
    IN p_marked_by INT
)
BEGIN
    INSERT INTO attendance_records (
        student_id, attendance_date, attendance_time, status, verification_method,
        confidence_score, wifi_verified, gps_verified, gps_latitude, gps_longitude,
        wifi_ssid, notes, marked_by
    ) VALUES (
        p_student_id, p_attendance_date, p_attendance_time, p_status, p_verification_method,
        p_confidence_score, p_wifi_verified, p_gps_verified, p_gps_latitude, p_gps_longitude,
        p_wifi_ssid, p_notes, p_marked_by
    ) ON DUPLICATE KEY UPDATE
        attendance_time = p_attendance_time,
        status = p_status,
        verification_method = p_verification_method,
        confidence_score = p_confidence_score,
        wifi_verified = p_wifi_verified,
        gps_verified = p_gps_verified,
        gps_latitude = p_gps_latitude,
        gps_longitude = p_gps_longitude,
        wifi_ssid = p_wifi_ssid,
        notes = p_notes,
        marked_by = p_marked_by,
        updated_at = CURRENT_TIMESTAMP;
END //

DELIMITER ;

-- =====================================================
-- TRIGGERS FOR AUTOMATIC UPDATES
-- =====================================================

DELIMITER //

-- Update room occupancy after student insert
CREATE TRIGGER update_room_occupancy_after_insert
AFTER INSERT ON students
FOR EACH ROW
BEGIN
    UPDATE rooms 
    SET current_occupancy = current_occupancy + 1 
    WHERE room_id = NEW.room_id;
END //

-- Update room occupancy after student delete
CREATE TRIGGER update_room_occupancy_after_delete
AFTER DELETE ON students
FOR EACH ROW
BEGIN
    UPDATE rooms 
    SET current_occupancy = current_occupancy - 1 
    WHERE room_id = OLD.room_id;
END //

-- Update room occupancy after student room change
CREATE TRIGGER update_room_occupancy_after_update
AFTER UPDATE ON students
FOR EACH ROW
BEGIN
    IF OLD.room_id != NEW.room_id THEN
        -- Decrease old room occupancy
        UPDATE rooms 
        SET current_occupancy = current_occupancy - 1 
        WHERE room_id = OLD.room_id;
        
        -- Increase new room occupancy
        UPDATE rooms 
        SET current_occupancy = current_occupancy + 1 
        WHERE room_id = NEW.room_id;
    END IF;
END //

-- Audit user changes
CREATE TRIGGER audit_user_changes
AFTER UPDATE ON users
FOR EACH ROW
BEGIN
    INSERT INTO system_logs (user_id, action, table_name, record_id, old_values, new_values)
    VALUES (
        NEW.user_id,
        'UPDATE',
        'users',
        NEW.user_id,
        JSON_OBJECT('email', OLD.email, 'role', OLD.role, 'first_name', OLD.first_name, 'last_name', OLD.last_name, 'is_active', OLD.is_active),
        JSON_OBJECT('email', NEW.email, 'role', NEW.role, 'first_name', NEW.first_name, 'last_name', NEW.last_name, 'is_active', NEW.is_active)
    );
END //

-- Log attendance changes
CREATE TRIGGER log_attendance_changes
AFTER INSERT ON attendance_records
FOR EACH ROW
BEGIN
    INSERT INTO system_logs (user_id, action, table_name, record_id, new_values)
    VALUES (
        NEW.marked_by,
        'INSERT',
        'attendance_records',
        NEW.attendance_id,
        JSON_OBJECT('student_id', NEW.student_id, 'status', NEW.status, 'verification_method', NEW.verification_method, 'confidence_score', NEW.confidence_score)
    );
END //

DELIMITER ;

-- =====================================================
-- INDEXES FOR PERFORMANCE
-- =====================================================

-- Additional indexes for better performance
CREATE INDEX idx_attendance_student_status ON attendance_records(student_id, status);
CREATE INDEX idx_attendance_verification ON attendance_records(verification_method);
CREATE INDEX idx_attendance_confidence ON attendance_records(confidence_score);
CREATE INDEX idx_face_enrollments_active ON face_enrollments(is_active);
CREATE INDEX idx_notifications_user_read ON notifications(user_id, is_read);
CREATE INDEX idx_system_logs_created ON system_logs(created_at);
CREATE INDEX idx_students_course_branch ON students(course, branch);
CREATE INDEX idx_rooms_hostel_available ON rooms(hostel_id, is_available);

-- =====================================================
-- FINAL SETUP
-- =====================================================

-- Update room occupancy for existing data
CALL UpdateRoomOccupancy();

-- Display database information
SELECT 'VISTA Database Schema Created Successfully!' as Status;
SELECT COUNT(*) as Total_Hostels FROM hostels;
SELECT COUNT(*) as Total_Rooms FROM rooms;
SELECT COUNT(*) as Total_Users FROM users;
SELECT COUNT(*) as Total_Students FROM students;
SELECT COUNT(*) as Total_Attendance_Records FROM attendance_records;
SELECT COUNT(*) as Total_Notifications FROM notifications;

-- Show database structure
SHOW TABLES;
