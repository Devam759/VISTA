# VISTA Database Schema

This directory contains the complete SQL database schema for the VISTA College Night Attendance System.

## Database Overview

The VISTA database is designed to manage:

- **User Authentication**: Students and Wardens
- **Hostel Management**: 4 hostels (BH1, BH2, GH1, GH2)
- **Room Allocation**: Individual room assignments
- **Face Enrollment**: Student face recognition data
- **Attendance Tracking**: Daily attendance records with multiple verification methods
- **Audit Logging**: Complete change tracking

## Database Structure

### Core Tables

1. **users** - User authentication and basic information
2. **hostels** - Hostel information (BH1, BH2, GH1, GH2)
3. **rooms** - Individual rooms within hostels
4. **students** - Student-specific data linked to users
5. **face_enrollments** - Face recognition data for students
6. **attendance_records** - Daily attendance tracking
7. **attendance_settings** - System configuration
8. **audit_logs** - Change tracking and security

### Key Features

- **Multi-verification Attendance**: Face recognition, WiFi, GPS
- **Real-time Room Occupancy**: Automatic tracking
- **Comprehensive Audit Trail**: All changes logged
- **Performance Optimized**: Indexes on frequently queried columns
- **Data Views**: Pre-built queries for common operations
- **Stored Procedures**: Reusable database operations

## Installation

### Prerequisites

- MySQL 8.0+ or MariaDB 10.3+
- Database user with CREATE privileges

### Setup Steps

1. **Create Database**:

   ```bash
   mysql -u root -p < vista_database.sql
   ```

2. **Verify Installation**:
   ```sql
   USE vista_attendance;
   SHOW TABLES;
   SELECT COUNT(*) FROM students;
   ```

3. **Update Configuration** (Optional):
   ```sql
   -- Update attendance settings
   UPDATE attendance_settings 
   SET setting_value = '22:30:00' 
   WHERE setting_name = 'attendance_deadline';
   ```

## Sample Data

The database includes:

- **4 Hostels**: BH1, BH2, GH1, GH2
- **60 Rooms**: 15 rooms per hostel
- **11 Students**: Sample student records
- **11 Users**: 1 Warden + 10 Students
- **11 Attendance Records**: Recent attendance data
- **Default Settings**: System configuration

## Database Views

### student_details
Complete student information including hostel and room details.

### attendance_summary
Student attendance statistics with percentages.

### hostel_statistics
Hostel occupancy and capacity information.

## Stored Procedures

### GetStudentAttendance(student_roll, start_date, end_date)
Retrieves attendance records for a specific student within a date range.

### GetHostelAttendance(hostel_name, attendance_date)
Gets attendance status for all students in a hostel on a specific date.

### UpdateRoomOccupancy()
Recalculates room occupancy based on current student assignments.

## Security Features

- **Password Hashing**: Secure password storage
- **Role-based Access**: Student and Warden roles
- **Audit Logging**: Complete change tracking
- **Data Validation**: Foreign key constraints
- **Index Optimization**: Performance tuning

## API Integration

The database is designed to work with the VISTA frontend application:

- **Authentication**: User login and role verification
- **Student Management**: CRUD operations for student data
- **Attendance Tracking**: Real-time attendance recording
- **Face Recognition**: Face enrollment and verification
- **Reporting**: Attendance statistics and hostel management

## Maintenance

### Regular Tasks

1. **Update Room Occupancy**:
   ```sql
   CALL UpdateRoomOccupancy();
   ```

2. **Clean Old Audit Logs** (Optional):
   ```sql
   DELETE FROM audit_logs 
   WHERE created_at < DATE_SUB(NOW(), INTERVAL 1 YEAR);
   ```

3. **Backup Database**:
   ```bash
   mysqldump -u root -p vista_attendance > vista_backup.sql
   ```

### Performance Monitoring

Monitor these key metrics:
- Attendance record count
- Face enrollment completion rate
- Room occupancy percentages
- Database query performance

## Troubleshooting

### Common Issues

1. **Foreign Key Constraints**: Ensure parent records exist before inserting child records
2. **Unique Constraints**: Check for duplicate roll numbers or emails
3. **Date Formats**: Use proper DATE and TIME formats
4. **Character Encoding**: Ensure UTF-8 support for international names

### Reset Database

To completely reset the database:
```sql
DROP DATABASE vista_attendance;
CREATE DATABASE vista_attendance;
USE vista_attendance;
SOURCE vista_database.sql;
```

## Support

For database-related issues:
1. Check the audit_logs table for recent changes
2. Verify foreign key relationships
3. Review stored procedure parameters
4. Check MySQL error logs

---

**Note**: This database schema is designed for the VISTA College Night Attendance System and includes all necessary tables, relationships, and sample data for immediate use.
