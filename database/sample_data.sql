-- =====================================================
-- VISTA College Night Attendance System - Sample Data
-- =====================================================
-- This file contains additional sample data for testing and development
-- Run this after vista_schema.sql

USE vista_attendance;

-- =====================================================
-- ADDITIONAL SAMPLE USERS
-- =====================================================

-- Insert more student users
INSERT INTO users (email, password_hash, role, first_name, last_name, phone, profile_image) VALUES
('rajesh.kumar@jklu.edu.in', '$2b$10$example_hash_student', 'Student', 'Rajesh', 'Kumar', '9876543223', NULL),
('priyanka.sharma@jklu.edu.in', '$2b$10$example_hash_student', 'Student', 'Priyanka', 'Sharma', '9876543224', NULL),
('amit.singh@jklu.edu.in', '$2b$10$example_hash_student', 'Student', 'Amit', 'Singh', '9876543225', NULL),
('kavya.patel@jklu.edu.in', '$2b$10$example_hash_student', 'Student', 'Kavya', 'Patel', '9876543226', NULL),
('rohit.verma@jklu.edu.in', '$2b$10$example_hash_student', 'Student', 'Rohit', 'Verma', '9876543227', NULL),
('neha.jain@jklu.edu.in', '$2b$10$example_hash_student', 'Student', 'Neha', 'Jain', '9876543228', NULL),
('suresh.yadav@jklu.edu.in', '$2b$10$example_hash_student', 'Student', 'Suresh', 'Yadav', '9876543229', NULL),
('puja.agarwal@jklu.edu.in', '$2b$10$example_hash_student', 'Student', 'Puja', 'Agarwal', '9876543230', NULL),
('manish.gupta@jklu.edu.in', '$2b$10$example_hash_student', 'Student', 'Manish', 'Gupta', '9876543231', NULL),
('sonia.malhotra@jklu.edu.in', '$2b$10$example_hash_student', 'Student', 'Sonia', 'Malhotra', '9876543232', NULL);

-- Insert more students
INSERT INTO students (user_id, roll_number, hostel_id, room_id, admission_year, course, branch, semester, emergency_contact, parent_name, parent_phone, parent_email, blood_group, date_of_birth, address) VALUES
(15, '23BCS012', 1, 9, 2023, 'B.Tech', 'Computer Science', 3, '9876543223', 'Ramesh Kumar', '9876543213', 'ramesh.kumar@email.com', 'A+', '2005-03-20', '111 Tech Park, Jaipur'),
(16, '23BCS013', 3, 22, 2023, 'B.Tech', 'Computer Science', 3, '9876543224', 'Sunita Sharma', '9876543214', 'sunita.sharma2@email.com', 'B+', '2005-04-15', '222 Innovation Hub, Jaipur'),
(17, '23BCS014', 2, 24, 2023, 'B.Tech', 'Computer Science', 3, '9876543225', 'Amit Singh', '9876543215', 'amit.singh@email.com', 'O+', '2005-05-25', '333 Digital City, Jaipur'),
(18, '23BCS015', 1, 10, 2023, 'B.Tech', 'Computer Science', 3, '9876543226', 'Kavya Patel', '9876543216', 'kavya.patel@email.com', 'AB+', '2005-06-10', '444 Smart Zone, Jaipur'),
(19, '23BCS016', 2, 25, 2023, 'B.Tech', 'Computer Science', 3, '9876543227', 'Rohit Verma', '9876543217', 'rohit.verma@email.com', 'A-', '2005-07-05', '555 Cyber Park, Jaipur'),
(20, '23BCS017', 3, 23, 2023, 'B.Tech', 'Computer Science', 3, '9876543228', 'Neha Jain', '9876543218', 'neha.jain@email.com', 'B-', '2005-08-18', '666 Data Center, Jaipur'),
(21, '23BCS018', 1, 11, 2023, 'B.Tech', 'Computer Science', 3, '9876543229', 'Suresh Yadav', '9876543219', 'suresh.yadav@email.com', 'O-', '2005-09-12', '777 AI Campus, Jaipur'),
(22, '23BCS019', 4, 29, 2023, 'B.Tech', 'Computer Science', 3, '9876543230', 'Puja Agarwal', '9876543220', 'puja.agarwal@email.com', 'AB-', '2005-10-30', '888 ML Hub, Jaipur'),
(23, '23BCS020', 2, 26, 2023, 'B.Tech', 'Computer Science', 3, '9876543231', 'Manish Gupta', '9876543221', 'manish.gupta@email.com', 'A+', '2005-11-22', '999 Cloud Center, Jaipur'),
(24, '23BCS021', 4, 30, 2023, 'B.Tech', 'Computer Science', 3, '9876543232', 'Sonia Malhotra', '9876543222', 'sonia.malhotra@email.com', 'B+', '2005-12-08', '1010 IoT Lab, Jaipur');

-- =====================================================
-- FACE ENROLLMENT DATA
-- =====================================================

-- Insert face enrollment data for students
INSERT INTO face_enrollments (student_id, face_image_path, face_encoding_data, confidence_score, face_quality_score, enrollment_method, created_by, notes) VALUES
(1, '/uploads/faces/23BCS999_face.jpg', 'encoded_face_data_1', 95.5, 92.3, 'Manual', 1, 'Initial enrollment'),
(2, '/uploads/faces/23BCS001_face.jpg', 'encoded_face_data_2', 97.2, 94.1, 'Manual', 1, 'Initial enrollment'),
(3, '/uploads/faces/23BCS002_face.jpg', 'encoded_face_data_3', 96.8, 93.7, 'Manual', 1, 'Initial enrollment'),
(4, '/uploads/faces/23BCS003_face.jpg', 'encoded_face_data_4', 94.3, 91.5, 'Manual', 1, 'Initial enrollment'),
(5, '/uploads/faces/23BCS004_face.jpg', 'encoded_face_data_5', 98.1, 95.2, 'Manual', 1, 'Initial enrollment'),
(6, '/uploads/faces/23BCS005_face.jpg', 'encoded_face_data_6', 93.7, 90.8, 'Manual', 1, 'Initial enrollment'),
(7, '/uploads/faces/23BCS006_face.jpg', 'encoded_face_data_7', 96.4, 93.9, 'Manual', 1, 'Initial enrollment'),
(8, '/uploads/faces/23BCS007_face.jpg', 'encoded_face_data_8', 95.9, 92.6, 'Manual', 1, 'Initial enrollment'),
(9, '/uploads/faces/23BCS008_face.jpg', 'encoded_face_data_9', 97.6, 94.8, 'Manual', 1, 'Initial enrollment'),
(10, '/uploads/faces/23BCS009_face.jpg', 'encoded_face_data_10', 94.8, 91.9, 'Manual', 1, 'Initial enrollment'),
(11, '/uploads/faces/23BCS010_face.jpg', 'encoded_face_data_11', 96.2, 93.4, 'Manual', 1, 'Initial enrollment'),
(12, '/uploads/faces/23BCS011_face.jpg', 'encoded_face_data_12', 95.3, 92.1, 'Manual', 1, 'Initial enrollment');

-- =====================================================
-- HISTORICAL ATTENDANCE DATA
-- =====================================================

-- Insert attendance records for the past week
INSERT INTO attendance_records (student_id, attendance_date, attendance_time, status, verification_method, confidence_score, wifi_verified, gps_verified, gps_latitude, gps_longitude, gps_accuracy, wifi_ssid, ip_address, notes) VALUES
-- January 26, 2025
(1, '2025-01-26', '22:03:00', 'Present', 'Face_Recognition', 98.4, TRUE, TRUE, 26.2389, 73.0243, 4.2, 'JKLU-Hostel', '192.168.1.100', 'Face recognition successful'),
(2, '2025-01-26', '22:11:00', 'Present', 'Face_Recognition', 96.4, TRUE, TRUE, 26.2389, 73.0243, 3.8, 'JKLU-Hostel', '192.168.1.101', 'Face recognition successful'),
(3, '2025-01-26', '22:22:00', 'Late', 'Face_Recognition', 93.1, TRUE, FALSE, 26.2389, 73.0243, 8.5, 'JKLU-Hostel', '192.168.1.102', 'Late arrival'),
(4, '2025-01-26', '22:05:00', 'Present', 'Face_Recognition', 98.4, TRUE, TRUE, 26.2389, 73.0243, 2.1, 'JKLU-Hostel', '192.168.1.103', 'Face recognition successful'),
(5, '2025-01-26', '22:00:00', 'Present', 'Face_Recognition', 99.1, TRUE, TRUE, 26.2389, 73.0243, 1.8, 'JKLU-Hostel', '192.168.1.104', 'Face recognition successful'),

-- January 25, 2025
(1, '2025-01-25', '22:08:00', 'Present', 'Face_Recognition', 97.2, TRUE, TRUE, 26.2389, 73.0243, 3.5, 'JKLU-Hostel', '192.168.1.100', 'Face recognition successful'),
(2, '2025-01-25', '22:15:00', 'Present', 'Face_Recognition', 95.8, TRUE, TRUE, 26.2389, 73.0243, 4.1, 'JKLU-Hostel', '192.168.1.101', 'Face recognition successful'),
(3, '2025-01-25', '22:25:00', 'Late', 'Face_Recognition', 91.3, TRUE, FALSE, 26.2389, 73.0243, 9.2, 'JKLU-Hostel', '192.168.1.102', 'Late arrival'),
(4, '2025-01-25', '22:12:00', 'Present', 'Face_Recognition', 96.7, TRUE, TRUE, 26.2389, 73.0243, 2.8, 'JKLU-Hostel', '192.168.1.103', 'Face recognition successful'),
(5, '2025-01-25', '22:18:00', 'Present', 'Face_Recognition', 94.5, TRUE, TRUE, 26.2389, 73.0243, 5.3, 'JKLU-Hostel', '192.168.1.104', 'Face recognition successful'),

-- January 24, 2025
(1, '2025-01-24', '22:06:00', 'Present', 'Face_Recognition', 98.9, TRUE, TRUE, 26.2389, 73.0243, 2.4, 'JKLU-Hostel', '192.168.1.100', 'Face recognition successful'),
(2, '2025-01-24', '22:13:00', 'Present', 'Face_Recognition', 97.1, TRUE, TRUE, 26.2389, 73.0243, 3.2, 'JKLU-Hostel', '192.168.1.101', 'Face recognition successful'),
(3, '2025-01-24', '22:28:00', 'Late', 'Face_Recognition', 89.7, TRUE, FALSE, 26.2389, 73.0243, 11.5, 'JKLU-Hostel', '192.168.1.102', 'Late arrival'),
(4, '2025-01-24', '22:09:00', 'Present', 'Face_Recognition', 95.4, TRUE, TRUE, 26.2389, 73.0243, 4.7, 'JKLU-Hostel', '192.168.1.103', 'Face recognition successful'),
(5, '2025-01-24', '22:16:00', 'Present', 'Face_Recognition', 96.8, TRUE, TRUE, 26.2389, 73.0243, 3.9, 'JKLU-Hostel', '192.168.1.104', 'Face recognition successful'),

-- January 23, 2025
(1, '2025-01-23', '22:04:00', 'Present', 'Face_Recognition', 99.2, TRUE, TRUE, 26.2389, 73.0243, 1.5, 'JKLU-Hostel', '192.168.1.100', 'Face recognition successful'),
(2, '2025-01-23', '22:17:00', 'Present', 'Face_Recognition', 94.6, TRUE, TRUE, 26.2389, 73.0243, 5.8, 'JKLU-Hostel', '192.168.1.101', 'Face recognition successful'),
(3, '2025-01-23', '22:31:00', 'Late', 'Face_Recognition', 87.3, TRUE, FALSE, 26.2389, 73.0243, 13.2, 'JKLU-Hostel', '192.168.1.102', 'Late arrival'),
(4, '2025-01-23', '22:14:00', 'Present', 'Face_Recognition', 97.8, TRUE, TRUE, 26.2389, 73.0243, 2.6, 'JKLU-Hostel', '192.168.1.103', 'Face recognition successful'),
(5, '2025-01-23', '22:21:00', 'Present', 'Face_Recognition', 93.4, TRUE, TRUE, 26.2389, 73.0243, 6.4, 'JKLU-Hostel', '192.168.1.104', 'Face recognition successful'),

-- January 22, 2025
(1, '2025-01-22', '22:07:00', 'Present', 'Face_Recognition', 98.1, TRUE, TRUE, 26.2389, 73.0243, 2.9, 'JKLU-Hostel', '192.168.1.100', 'Face recognition successful'),
(2, '2025-01-22', '22:19:00', 'Present', 'Face_Recognition', 95.9, TRUE, TRUE, 26.2389, 73.0243, 4.3, 'JKLU-Hostel', '192.168.1.101', 'Face recognition successful'),
(3, '2025-01-22', '22:35:00', 'Late', 'Face_Recognition', 85.2, TRUE, FALSE, 26.2389, 73.0243, 15.7, 'JKLU-Hostel', '192.168.1.102', 'Late arrival'),
(4, '2025-01-22', '22:11:00', 'Present', 'Face_Recognition', 96.3, TRUE, TRUE, 26.2389, 73.0243, 3.7, 'JKLU-Hostel', '192.168.1.103', 'Face recognition successful'),
(5, '2025-01-22', '22:24:00', 'Present', 'Face_Recognition', 92.7, TRUE, TRUE, 26.2389, 73.0243, 7.1, 'JKLU-Hostel', '192.168.1.104', 'Face recognition successful');

-- =====================================================
-- NOTIFICATIONS DATA
-- =====================================================

-- Insert sample notifications
INSERT INTO notifications (user_id, title, message, type, priority, expires_at) VALUES
(1, 'System Maintenance', 'Scheduled maintenance will occur tonight from 11 PM to 1 AM', 'Info', 'Medium', DATE_ADD(NOW(), INTERVAL 7 DAY)),
(2, 'Attendance Deadline Reminder', 'Please mark your attendance before 10:30 PM', 'Warning', 'High', DATE_ADD(NOW(), INTERVAL 1 DAY)),
(3, 'Face Enrollment Required', 'Please complete your face enrollment for attendance system', 'Info', 'Medium', DATE_ADD(NOW(), INTERVAL 30 DAY)),
(4, 'Room Assignment Update', 'Your room assignment has been updated', 'Info', 'Low', DATE_ADD(NOW(), INTERVAL 14 DAY)),
(5, 'Attendance Recorded', 'Your attendance has been successfully recorded', 'Success', 'Low', DATE_ADD(NOW(), INTERVAL 1 DAY)),
(6, 'Late Attendance Warning', 'You have been marked late for attendance', 'Warning', 'Medium', DATE_ADD(NOW(), INTERVAL 3 DAY)),
(7, 'System Update', 'New features have been added to the attendance system', 'Info', 'Low', DATE_ADD(NOW(), INTERVAL 30 DAY)),
(8, 'Emergency Contact Update', 'Please update your emergency contact information', 'Info', 'Medium', DATE_ADD(NOW(), INTERVAL 60 DAY));

-- =====================================================
-- SYSTEM LOGS DATA
-- =====================================================

-- Insert sample system logs
INSERT INTO system_logs (user_id, action, table_name, record_id, old_values, new_values, ip_address, severity, message) VALUES
(1, 'LOGIN', 'users', 1, NULL, JSON_OBJECT('login_time', NOW()), '192.168.1.100', 'INFO', 'User logged in successfully'),
(2, 'ATTENDANCE_MARKED', 'attendance_records', 1, NULL, JSON_OBJECT('status', 'Present', 'method', 'Face_Recognition'), '192.168.1.101', 'INFO', 'Attendance marked via face recognition'),
(3, 'FACE_ENROLLMENT', 'face_enrollments', 1, NULL, JSON_OBJECT('enrollment_date', NOW(), 'confidence', 95.5), '192.168.1.102', 'INFO', 'Face enrollment completed'),
(4, 'ROOM_ASSIGNMENT', 'students', 1, JSON_OBJECT('room_id', 5), JSON_OBJECT('room_id', 6), '192.168.1.103', 'INFO', 'Student room assignment updated'),
(5, 'SETTING_UPDATE', 'attendance_settings', 1, JSON_OBJECT('setting_value', '22:00:00'), JSON_OBJECT('setting_value', '22:30:00'), '192.168.1.104', 'INFO', 'Attendance deadline updated'),
(6, 'ERROR', 'attendance_records', NULL, NULL, NULL, '192.168.1.105', 'ERROR', 'Face recognition failed - low confidence score'),
(7, 'WARNING', 'students', 2, NULL, JSON_OBJECT('last_login', NOW()), '192.168.1.106', 'WARNING', 'Student has not marked attendance for 3 days'),
(8, 'CRITICAL', 'system', NULL, NULL, NULL, '192.168.1.107', 'CRITICAL', 'Database connection timeout');

-- =====================================================
-- UPDATE ROOM OCCUPANCY
-- =====================================================

-- Update room occupancy for all rooms
CALL UpdateRoomOccupancy();

-- =====================================================
-- VERIFICATION QUERIES
-- =====================================================

-- Display sample data statistics
SELECT 'Sample Data Inserted Successfully!' as Status;
SELECT COUNT(*) as Total_Users FROM users;
SELECT COUNT(*) as Total_Students FROM students;
SELECT COUNT(*) as Total_Face_Enrollments FROM face_enrollments;
SELECT COUNT(*) as Total_Attendance_Records FROM attendance_records;
SELECT COUNT(*) as Total_Notifications FROM notifications;
SELECT COUNT(*) as Total_System_Logs FROM system_logs;

-- Show attendance summary for today
SELECT 
    h.name as hostel_name,
    COUNT(s.student_id) as total_students,
    COUNT(ar.attendance_id) as attendance_marked,
    SUM(CASE WHEN ar.status = 'Present' THEN 1 ELSE 0 END) as present_count,
    SUM(CASE WHEN ar.status = 'Late' THEN 1 ELSE 0 END) as late_count,
    SUM(CASE WHEN ar.status = 'Absent' THEN 1 ELSE 0 END) as absent_count
FROM hostels h
LEFT JOIN students s ON h.hostel_id = s.hostel_id
LEFT JOIN attendance_records ar ON s.student_id = ar.student_id AND ar.attendance_date = CURDATE()
GROUP BY h.hostel_id, h.name
ORDER BY h.name;

-- Show recent attendance records
SELECT 
    s.roll_number,
    CONCAT(u.first_name, ' ', u.last_name) as student_name,
    h.name as hostel_name,
    r.room_number,
    ar.attendance_date,
    ar.attendance_time,
    ar.status,
    ar.confidence_score,
    ar.verification_method
FROM attendance_records ar
JOIN students s ON ar.student_id = s.student_id
JOIN users u ON s.user_id = u.user_id
JOIN hostels h ON s.hostel_id = h.hostel_id
LEFT JOIN rooms r ON s.room_id = r.room_id
WHERE ar.attendance_date >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)
ORDER BY ar.attendance_date DESC, ar.attendance_time DESC
LIMIT 20;
