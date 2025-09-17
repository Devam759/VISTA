-- VISTA College Night Attendance System Database
-- Created for hostel management and attendance tracking

-- Create database
CREATE DATABASE IF NOT EXISTS vista_attendance;
USE vista_attendance;

-- Users table (for authentication and role management)
CREATE TABLE users (
    user_id INT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('Student', 'Warden') NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phone VARCHAR(15),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE
);

-- Hostels table
CREATE TABLE hostels (
    hostel_id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50) UNIQUE NOT NULL,
    type ENUM('Boys', 'Girls') NOT NULL,
    warden_name VARCHAR(100) NOT NULL,
    total_rooms INT DEFAULT 0,
    total_capacity INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Rooms table
CREATE TABLE rooms (
    room_id INT PRIMARY KEY AUTO_INCREMENT,
    hostel_id INT NOT NULL,
    room_number VARCHAR(20) NOT NULL,
    capacity INT DEFAULT 1,
    current_occupancy INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (hostel_id) REFERENCES hostels(hostel_id) ON DELETE CASCADE,
    UNIQUE KEY unique_hostel_room (hostel_id, room_number)
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
    emergency_contact VARCHAR(15),
    parent_name VARCHAR(200),
    parent_phone VARCHAR(15),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (hostel_id) REFERENCES hostels(hostel_id) ON DELETE RESTRICT,
    FOREIGN KEY (room_id) REFERENCES rooms(room_id) ON DELETE SET NULL
);

-- Face enrollment table (for student face data)
CREATE TABLE face_enrollments (
    enrollment_id INT PRIMARY KEY AUTO_INCREMENT,
    student_id INT NOT NULL,
    face_image_path VARCHAR(500),
    face_encoding_data LONGTEXT,
    enrollment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE,
    confidence_score DECIMAL(5,2),
    FOREIGN KEY (student_id) REFERENCES students(student_id) ON DELETE CASCADE
);

-- Attendance records table
CREATE TABLE attendance_records (
    attendance_id INT PRIMARY KEY AUTO_INCREMENT,
    student_id INT NOT NULL,
    attendance_date DATE NOT NULL,
    attendance_time TIME NOT NULL,
    status ENUM('Present', 'Late', 'Absent') NOT NULL,
    verification_method ENUM('Face_Recognition', 'Manual', 'Wifi', 'GPS') DEFAULT 'Face_Recognition',
    confidence_score DECIMAL(5,2),
    wifi_verified BOOLEAN DEFAULT FALSE,
    gps_verified BOOLEAN DEFAULT FALSE,
    gps_latitude DECIMAL(10, 8),
    gps_longitude DECIMAL(11, 8),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES students(student_id) ON DELETE CASCADE,
    UNIQUE KEY unique_daily_attendance (student_id, attendance_date)
);

-- Attendance settings table (for configuration)
CREATE TABLE attendance_settings (
    setting_id INT PRIMARY KEY AUTO_INCREMENT,
    setting_name VARCHAR(100) UNIQUE NOT NULL,
    setting_value VARCHAR(500) NOT NULL,
    description TEXT,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Audit log table (for tracking changes)
CREATE TABLE audit_logs (
    log_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    action VARCHAR(100) NOT NULL,
    table_name VARCHAR(100) NOT NULL,
    record_id INT,
    old_values JSON,
    new_values JSON,
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE SET NULL
);

-- Insert default hostels
INSERT INTO hostels (name, type, warden_name, total_rooms, total_capacity) VALUES
('BH1', 'Boys', 'Mr. Verma', 50, 200),
('BH2', 'Boys', 'Mr. Rao', 50, 200),
('GH1', 'Girls', 'Ms. Kapoor', 40, 160),
('GH2', 'Girls', 'Ms. Sharma', 40, 160);

-- Insert sample rooms for each hostel
INSERT INTO rooms (hostel_id, room_number, capacity) VALUES
-- BH1 rooms
(1, 'B-101', 4), (1, 'B-102', 4), (1, 'B-103', 4), (1, 'B-104', 4), (1, 'B-105', 4),
(1, 'B-201', 4), (1, 'B-202', 4), (1, 'B-203', 4), (1, 'B-204', 4), (1, 'B-205', 4),
(1, 'B-206', 4), (1, 'B-207', 4), (1, 'B-208', 4), (1, 'B-209', 4), (1, 'B-210', 4),

-- BH2 rooms
(2, 'B-101', 4), (2, 'B-102', 4), (2, 'B-103', 4), (2, 'B-104', 4), (2, 'B-105', 4),
(2, 'B-110', 4), (2, 'B-111', 4), (2, 'B-112', 4), (2, 'B-113', 4), (2, 'B-114', 4),
(2, 'B-115', 4), (2, 'B-116', 4), (2, 'B-117', 4), (2, 'B-118', 4), (2, 'B-119', 4),

-- GH1 rooms
(3, 'G-301', 4), (3, 'G-302', 4), (3, 'G-303', 4), (3, 'G-304', 4), (3, 'G-305', 4),
(3, 'G-310', 4), (3, 'G-311', 4), (3, 'G-312', 4), (3, 'G-313', 4), (3, 'G-314', 4),
(3, 'G-315', 4), (3, 'G-316', 4), (3, 'G-317', 4), (3, 'G-318', 4), (3, 'G-319', 4),

-- GH2 rooms
(4, 'G-401', 4), (4, 'G-402', 4), (4, 'G-403', 4), (4, 'G-404', 4), (4, 'G-405', 4),
(4, 'G-410', 4), (4, 'G-411', 4), (4, 'G-412', 4), (4, 'G-413', 4), (4, 'G-414', 4),
(4, 'G-415', 4), (4, 'G-416', 4), (4, 'G-417', 4), (4, 'G-418', 4), (4, 'G-419', 4);

-- Insert default attendance settings
INSERT INTO attendance_settings (setting_name, setting_value, description) VALUES
('attendance_deadline', '22:30:00', 'Time after which attendance is marked as late'),
('face_recognition_threshold', '0.85', 'Minimum confidence score for face recognition'),
('gps_accuracy_radius', '100', 'GPS accuracy radius in meters'),
('max_late_minutes', '30', 'Maximum minutes after deadline to mark as late'),
('auto_absent_hours', '24', 'Hours after which absent students are automatically marked absent');

-- Insert sample users (warden and students)
INSERT INTO users (email, password_hash, role, first_name, last_name, phone) VALUES
-- Warden user
('bhuwanesh@jklu.edu.in', '$2b$10$example_hash_for_warden', 'Warden', 'Bhuwanesh', 'Sharma', '9876543210'),

-- Student users
('aarav.patel@jklu.edu.in', '$2b$10$example_hash_for_student', 'Student', 'Aarav', 'Patel', '9876543211'),
('isha.sharma@jklu.edu.in', '$2b$10$example_hash_for_student', 'Student', 'Isha', 'Sharma', '9876543212'),
('rohan.mehta@jklu.edu.in', '$2b$10$example_hash_for_student', 'Student', 'Rohan', 'Mehta', '9876543213'),
('priya.singh@jklu.edu.in', '$2b$10$example_hash_for_student', 'Student', 'Priya', 'Singh', '9876543214'),
('arjun.kumar@jklu.edu.in', '$2b$10$example_hash_for_student', 'Student', 'Arjun', 'Kumar', '9876543215'),
('sneha.reddy@jklu.edu.in', '$2b$10$example_hash_for_student', 'Student', 'Sneha', 'Reddy', '9876543216'),
('vikram.joshi@jklu.edu.in', '$2b$10$example_hash_for_student', 'Student', 'Vikram', 'Joshi', '9876543217'),
('ananya.gupta@jklu.edu.in', '$2b$10$example_hash_for_student', 'Student', 'Ananya', 'Gupta', '9876543218'),
('kavya.nair@jklu.edu.in', '$2b$10$example_hash_for_student', 'Student', 'Kavya', 'Nair', '9876543219'),
('meera.joshi@jklu.edu.in', '$2b$10$example_hash_for_student', 'Student', 'Meera', 'Joshi', '9876543220'),
('riya.agarwal@jklu.edu.in', '$2b$10$example_hash_for_student', 'Student', 'Riya', 'Agarwal', '9876543221');

-- Insert students data
INSERT INTO students (user_id, roll_number, hostel_id, room_id, admission_year, course, branch, emergency_contact, parent_name, parent_phone) VALUES
(2, '23BCS001', 1, 6, 2023, 'B.Tech', 'Computer Science', '9876543211', 'Raj Patel', '9876543201'),
(3, '23BCS002', 3, 20, 2023, 'B.Tech', 'Computer Science', '9876543212', 'Sunita Sharma', '9876543202'),
(4, '23BCS003', 2, 21, 2023, 'B.Tech', 'Computer Science', '9876543213', 'Ravi Mehta', '9876543203'),
(5, '23BCS004', 1, 7, 2023, 'B.Tech', 'Computer Science', '9876543214', 'Priyanka Singh', '9876543204'),
(6, '23BCS005', 2, 22, 2023, 'B.Tech', 'Computer Science', '9876543215', 'Amit Kumar', '9876543205'),
(7, '23BCS006', 1, 8, 2023, 'B.Tech', 'Computer Science', '9876543216', 'Lakshmi Reddy', '9876543206'),
(8, '23BCS007', 2, 23, 2023, 'B.Tech', 'Computer Science', '9876543217', 'Suresh Joshi', '9876543207'),
(9, '23BCS008', 3, 21, 2023, 'B.Tech', 'Computer Science', '9876543218', 'Neha Gupta', '9876543208'),
(10, '23BCS009', 4, 26, 2023, 'B.Tech', 'Computer Science', '9876543219', 'Rajesh Nair', '9876543209'),
(11, '23BCS010', 4, 27, 2023, 'B.Tech', 'Computer Science', '9876543220', 'Sunita Joshi', '9876543210'),
(12, '23BCS011', 4, 28, 2023, 'B.Tech', 'Computer Science', '9876543221', 'Vikram Agarwal', '9876543211');

-- Insert sample attendance records
INSERT INTO attendance_records (student_id, attendance_date, attendance_time, status, verification_method, confidence_score, wifi_verified, gps_verified) VALUES
-- Recent attendance records
(1, '2025-01-15', '22:05:00', 'Present', 'Face_Recognition', 98.4, TRUE, TRUE),
(2, '2025-01-15', '22:17:00', 'Late', 'Face_Recognition', 92.1, TRUE, FALSE),
(3, '2025-01-15', '22:45:00', 'Absent', 'Manual', 0.0, FALSE, FALSE),
(4, '2025-01-15', '22:08:00', 'Present', 'Face_Recognition', 97.8, TRUE, TRUE),
(5, '2025-01-15', '22:12:00', 'Present', 'Face_Recognition', 96.5, TRUE, TRUE),
(6, '2025-01-15', '22:15:00', 'Present', 'Face_Recognition', 99.1, TRUE, TRUE),
(7, '2025-01-15', '22:20:00', 'Late', 'Face_Recognition', 89.3, TRUE, FALSE),
(8, '2025-01-15', '22:25:00', 'Present', 'Face_Recognition', 95.7, TRUE, TRUE),
(9, '2025-01-15', '22:15:00', 'Present', 'Face_Recognition', 97.2, TRUE, TRUE),
(10, '2025-01-15', '22:20:00', 'Late', 'Face_Recognition', 91.8, TRUE, FALSE),
(11, '2025-01-15', '22:25:00', 'Present', 'Face_Recognition', 98.9, TRUE, TRUE);

-- Create indexes for better performance
CREATE INDEX idx_students_roll_number ON students(roll_number);
CREATE INDEX idx_students_hostel ON students(hostel_id);
CREATE INDEX idx_attendance_date ON attendance_records(attendance_date);
CREATE INDEX idx_attendance_student_date ON attendance_records(student_id, attendance_date);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_face_enrollments_student ON face_enrollments(student_id);

-- Create views for common queries
CREATE VIEW student_details AS
SELECT 
    s.student_id,
    s.roll_number,
    u.first_name,
    u.last_name,
    u.email,
    u.phone,
    h.name as hostel_name,
    h.type as hostel_type,
    r.room_number,
    s.course,
    s.branch,
    s.admission_year,
    s.parent_name,
    s.parent_phone,
    s.emergency_contact
FROM students s
JOIN users u ON s.user_id = u.user_id
JOIN hostels h ON s.hostel_id = h.hostel_id
LEFT JOIN rooms r ON s.room_id = r.room_id;

CREATE VIEW attendance_summary AS
SELECT 
    s.student_id,
    s.roll_number,
    u.first_name,
    u.last_name,
    h.name as hostel_name,
    COUNT(ar.attendance_id) as total_records,
    SUM(CASE WHEN ar.status = 'Present' THEN 1 ELSE 0 END) as present_count,
    SUM(CASE WHEN ar.status = 'Late' THEN 1 ELSE 0 END) as late_count,
    SUM(CASE WHEN ar.status = 'Absent' THEN 1 ELSE 0 END) as absent_count,
    ROUND((SUM(CASE WHEN ar.status = 'Present' THEN 1 ELSE 0 END) / COUNT(ar.attendance_id)) * 100, 2) as attendance_percentage
FROM students s
JOIN users u ON s.user_id = u.user_id
JOIN hostels h ON s.hostel_id = h.hostel_id
LEFT JOIN attendance_records ar ON s.student_id = ar.student_id
GROUP BY s.student_id, s.roll_number, u.first_name, u.last_name, h.name;

CREATE VIEW hostel_statistics AS
SELECT 
    h.hostel_id,
    h.name as hostel_name,
    h.type as hostel_type,
    h.warden_name,
    COUNT(DISTINCT s.student_id) as total_students,
    COUNT(DISTINCT r.room_id) as total_rooms,
    SUM(r.capacity) as total_capacity,
    SUM(r.current_occupancy) as current_occupancy,
    ROUND((SUM(r.current_occupancy) / SUM(r.capacity)) * 100, 2) as occupancy_percentage
FROM hostels h
LEFT JOIN rooms r ON h.hostel_id = r.hostel_id
LEFT JOIN students s ON h.hostel_id = s.hostel_id
GROUP BY h.hostel_id, h.name, h.type, h.warden_name;

-- Create stored procedures for common operations
DELIMITER //

CREATE PROCEDURE GetStudentAttendance(IN student_roll VARCHAR(20), IN start_date DATE, IN end_date DATE)
BEGIN
    SELECT 
        ar.attendance_date,
        ar.attendance_time,
        ar.status,
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

CREATE PROCEDURE GetHostelAttendance(IN hostel_name VARCHAR(50), IN attendance_date DATE)
BEGIN
    SELECT 
        s.roll_number,
        u.first_name,
        u.last_name,
        r.room_number,
        ar.status,
        ar.attendance_time,
        ar.confidence_score
    FROM students s
    JOIN users u ON s.user_id = u.user_id
    JOIN hostels h ON s.hostel_id = h.hostel_id
    LEFT JOIN rooms r ON s.room_id = r.room_id
    LEFT JOIN attendance_records ar ON s.student_id = ar.student_id AND ar.attendance_date = attendance_date
    WHERE h.name = hostel_name
    ORDER BY r.room_number, s.roll_number;
END //

CREATE PROCEDURE UpdateRoomOccupancy()
BEGIN
    UPDATE rooms r
    SET current_occupancy = (
        SELECT COUNT(*)
        FROM students s
        WHERE s.room_id = r.room_id
    );
END //

DELIMITER ;

-- Create triggers for automatic updates
DELIMITER //

CREATE TRIGGER update_room_occupancy_after_insert
AFTER INSERT ON students
FOR EACH ROW
BEGIN
    UPDATE rooms 
    SET current_occupancy = current_occupancy + 1 
    WHERE room_id = NEW.room_id;
END //

CREATE TRIGGER update_room_occupancy_after_delete
AFTER DELETE ON students
FOR EACH ROW
BEGIN
    UPDATE rooms 
    SET current_occupancy = current_occupancy - 1 
    WHERE room_id = OLD.room_id;
END //

CREATE TRIGGER audit_user_changes
AFTER UPDATE ON users
FOR EACH ROW
BEGIN
    INSERT INTO audit_logs (user_id, action, table_name, record_id, old_values, new_values)
    VALUES (
        NEW.user_id,
        'UPDATE',
        'users',
        NEW.user_id,
        JSON_OBJECT('email', OLD.email, 'role', OLD.role, 'first_name', OLD.first_name, 'last_name', OLD.last_name),
        JSON_OBJECT('email', NEW.email, 'role', NEW.role, 'first_name', NEW.first_name, 'last_name', NEW.last_name)
    );
END //

DELIMITER ;

-- Grant permissions (adjust as needed for your environment)
-- CREATE USER 'vista_app'@'localhost' IDENTIFIED BY 'secure_password_here';
-- GRANT SELECT, INSERT, UPDATE, DELETE ON vista_attendance.* TO 'vista_app'@'localhost';
-- FLUSH PRIVILEGES;

-- Display database information
SELECT 'VISTA Database Created Successfully!' as Status;
SELECT COUNT(*) as Total_Hostels FROM hostels;
SELECT COUNT(*) as Total_Rooms FROM rooms;
SELECT COUNT(*) as Total_Users FROM users;
SELECT COUNT(*) as Total_Students FROM students;
SELECT COUNT(*) as Total_Attendance_Records FROM attendance_records;
