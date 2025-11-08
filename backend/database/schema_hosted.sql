-- VISTA Database Schema for Hosted MySQL
-- Run this on your sql12806790 database

-- Students table
CREATE TABLE IF NOT EXISTS students (
  roll_no VARCHAR(50) PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  course VARCHAR(50),
  year INT,
  hostel VARCHAR(50) NOT NULL,
  room_no VARCHAR(20) NOT NULL,
  mobile_no VARCHAR(15),
  address TEXT,
  face_image LONGTEXT,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Wardens table
CREATE TABLE IF NOT EXISTS wardens (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  hostel VARCHAR(50) NOT NULL,
  mobile VARCHAR(15),
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Attendance table
CREATE TABLE IF NOT EXISTS attendance (
  id INT AUTO_INCREMENT PRIMARY KEY,
  roll_no VARCHAR(50) NOT NULL,
  date DATE NOT NULL,
  time TIME NOT NULL,
  status ENUM('PRESENT', 'LATE', 'ABSENT') NOT NULL,
  face_verified BOOLEAN DEFAULT FALSE,
  geo_verified BOOLEAN DEFAULT FALSE,
  wifi_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (roll_no) REFERENCES students(roll_no) ON DELETE CASCADE,
  UNIQUE KEY unique_attendance (roll_no, date)
);

-- Campus polygon for geofencing
CREATE TABLE IF NOT EXISTS campus_polygon (
  id INT AUTO_INCREMENT PRIMARY KEY,
  lat DECIMAL(10, 8) NOT NULL,
  lng DECIMAL(11, 8) NOT NULL,
  point_order INT NOT NULL
);

-- WiFi rules (optional)
CREATE TABLE IF NOT EXISTS wifi_rules (
  id INT AUTO_INCREMENT PRIMARY KEY,
  ssid VARCHAR(100) NOT NULL,
  ip_range VARCHAR(50),
  active BOOLEAN DEFAULT TRUE
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_attendance_date ON attendance(date);
CREATE INDEX IF NOT EXISTS idx_attendance_roll ON attendance(roll_no);
CREATE INDEX IF NOT EXISTS idx_students_hostel ON students(hostel);
