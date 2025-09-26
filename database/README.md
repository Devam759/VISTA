# VISTA College Night Attendance System - Database

This directory contains the complete database schema and sample data for the VISTA College Night Attendance System.

## Files Overview

### 1. `vista_schema.sql`
- **Main database schema file**
- Contains all table definitions, relationships, indexes, views, stored procedures, and triggers
- Includes initial sample data for hostels, rooms, users, and students
- Sets up the complete database structure

### 2. `sample_data.sql`
- **Additional sample data file**
- Contains extended sample data for testing and development
- Includes historical attendance records, notifications, system logs
- Provides comprehensive test data for all features

## Database Features

### Core Tables
- **users** - Authentication and role management
- **students** - Student-specific information
- **hostels** - Hostel information (BH1, BH2, GH1, GH2)
- **rooms** - Room assignments and occupancy
- **attendance_records** - Daily attendance tracking
- **face_enrollments** - Biometric face data

### Advanced Features
- **Face Recognition** - Biometric attendance verification
- **GPS Verification** - Location-based attendance validation
- **WiFi Verification** - Network-based attendance confirmation
- **Role-based Access** - Student, Warden, ChiefWarden roles
- **Audit Logging** - Complete system activity tracking
- **Notifications** - System notification management

### Key Features
- ✅ Face recognition with confidence scoring
- ✅ GPS location verification
- ✅ WiFi network verification
- ✅ Multi-role authentication system
- ✅ Real-time attendance tracking
- ✅ Comprehensive audit logging
- ✅ Automated room occupancy tracking
- ✅ Advanced reporting views
- ✅ Stored procedures for common operations
- ✅ Triggers for data consistency

## Installation Instructions

### 1. Create Database
```sql
-- Run the main schema file
mysql -u root -p < vista_schema.sql
```

### 2. Add Sample Data (Optional)
```sql
-- Run additional sample data
mysql -u root -p vista_attendance < sample_data.sql
```

### 3. Verify Installation
```sql
-- Check database structure
USE vista_attendance;
SHOW TABLES;

-- Check sample data
SELECT COUNT(*) as Total_Users FROM users;
SELECT COUNT(*) as Total_Students FROM students;
SELECT COUNT(*) as Total_Attendance_Records FROM attendance_records;
```

## Database Structure

### Hostels
- **BH1** - Boys Hostel 1 (200 capacity)
- **BH2** - Boys Hostel 2 (200 capacity)  
- **GH1** - Girls Hostel 1 (160 capacity)
- **GH2** - Girls Hostel 2 (160 capacity)

### User Roles
- **Student** - Can mark attendance, view own records
- **Warden** - Can view hostel attendance, manage students
- **ChiefWarden** - Full system access, all hostels

### Attendance Verification Methods
- **Face_Recognition** - Biometric verification
- **Manual** - Staff-marked attendance
- **Wifi** - Network-based verification
- **GPS** - Location-based verification
- **QR_Code** - QR code scanning

## Key Views

### 1. `student_details`
Complete student information with hostel and room details

### 2. `attendance_summary`
Student attendance statistics and percentages

### 3. `hostel_statistics`
Hostel occupancy and attendance statistics

## Stored Procedures

### 1. `GetStudentAttendance(roll_number, start_date, end_date)`
Get attendance records for a specific student

### 2. `GetHostelAttendance(hostel_name, date)`
Get attendance records for a specific hostel on a date

### 3. `UpdateRoomOccupancy()`
Update room occupancy counts

### 4. `MarkAttendance(...)`
Mark attendance with full verification data

## Sample Data

The database includes comprehensive sample data:
- 4 hostels with 60+ rooms
- 24+ student users
- 50+ attendance records
- Face enrollment data
- System notifications
- Audit logs

## Security Features

- Password hashing for user authentication
- Role-based access control
- IP address logging
- User agent tracking
- Complete audit trail
- Data integrity constraints

## Performance Optimizations

- Comprehensive indexing strategy
- Optimized queries with views
- Efficient stored procedures
- Automatic room occupancy updates
- Cached attendance summaries

## Maintenance

### Regular Tasks
1. Update room occupancy: `CALL UpdateRoomOccupancy();`
2. Clean old logs: `DELETE FROM system_logs WHERE created_at < DATE_SUB(NOW(), INTERVAL 1 YEAR);`
3. Archive old attendance: Move records older than 2 years to archive tables

### Monitoring
- Check attendance completion rates
- Monitor face recognition accuracy
- Review system logs for errors
- Update student information regularly

## API Integration

The database is designed to work with REST APIs:
- User authentication endpoints
- Attendance marking endpoints
- Student management endpoints
- Reporting endpoints
- Face enrollment endpoints

## Troubleshooting

### Common Issues
1. **Face recognition failures** - Check confidence thresholds in settings
2. **GPS verification issues** - Verify location coordinates in settings
3. **WiFi verification problems** - Check SSID configuration
4. **Room occupancy errors** - Run `UpdateRoomOccupancy()` procedure

### Support Queries
```sql
-- Check system health
SELECT 
    COUNT(*) as total_users,
    COUNT(CASE WHEN is_active = 1 THEN 1 END) as active_users,
    COUNT(CASE WHEN role = 'Student' THEN 1 END) as students
FROM users;

-- Check attendance completion
SELECT 
    DATE(attendance_date) as date,
    COUNT(*) as total_records,
    SUM(CASE WHEN status = 'Present' THEN 1 ELSE 0 END) as present,
    SUM(CASE WHEN status = 'Late' THEN 1 ELSE 0 END) as late,
    SUM(CASE WHEN status = 'Absent' THEN 1 ELSE 0 END) as absent
FROM attendance_records 
WHERE attendance_date >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)
GROUP BY DATE(attendance_date)
ORDER BY date DESC;
```

## Contact

For database-related issues or questions, please refer to the system documentation or contact the development team.
