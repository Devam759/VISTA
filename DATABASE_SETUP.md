# VISTA Attendance System - Database Setup Guide

## Prerequisites

1. **MySQL Server** installed and running
2. **Python 3.8+** installed
3. **Node.js 18+** installed

## Database Configuration

### Step 1: Create MySQL Database

```bash
# Login to MySQL
mysql -u root -p

# Create database
CREATE DATABASE vista_attendance;

# Exit MySQL
exit;
```

### Step 2: Configure Environment Variables

Update `backend/.env` file with your database credentials:

```env
DB_TYPE=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=root
DB_PASSWORD=696984
DB_NAME=vista_attendance
```

### Step 3: Install Python Dependencies

```bash
cd backend
pip install -r requirements.txt
```

### Step 4: Initialize Database

Run the database initialization script:

```bash
# Initialize with sample data
python init_database.py

# Initialize without sample data
python init_database.py --no-sample
```

This will create all the following tables:

## Database Schema

### 1. **users** - User Authentication
- `id` (Primary Key)
- `email` (Unique)
- `password_hash`
- `role` (Student, Warden, Admin)
- `first_name`
- `last_name`
- `phone`
- `is_active`
- `created_at`
- `last_login`

### 2. **hostels** - Hostel Information
- `id` (Primary Key)
- `name` (Unique)
- `type` (Boys, Girls)
- `warden_name`
- `warden_phone`
- `total_rooms`
- `total_capacity`
- `address`
- `is_active`
- `created_at`

### 3. **rooms** - Room Information
- `id` (Primary Key)
- `hostel_id` (Foreign Key → hostels)
- `room_number`
- `room_type` (Standard, AC, Deluxe)
- `capacity`
- `current_occupancy`
- `is_active`
- `created_at`

### 4. **students** - Student Information
- `id` (Primary Key)
- `user_id` (Foreign Key → users)
- `roll_number` (Unique)
- `hostel_id` (Foreign Key → hostels)
- `room_id` (Foreign Key → rooms)
- `course`
- `branch`
- `semester`
- `admission_year`
- `is_active`
- `created_at`

### 5. **attendance_records** - Attendance Tracking
- `id` (Primary Key)
- `student_id` (Foreign Key → students)
- `attendance_date`
- `attendance_time`
- `status` (Present, Late, Absent)
- `verification_method` (Manual, Face_Recognition)
- `confidence_score`
- `wifi_verified`
- `gps_verified`
- `latitude`
- `longitude`
- `accuracy`
- `notes`
- `marked_by` (Foreign Key → users)
- `created_at`

### 6. **face_enrollments** - Face Recognition Data
- `id` (Primary Key)
- `student_id` (Foreign Key → students)
- `face_image_path`
- `face_encoding_data`
- `confidence_score`
- `face_quality_score`
- `enrollment_method`
- `is_active`
- `created_by` (Foreign Key → users)
- `notes`
- `created_at`
- `updated_at`

### 7. **test_names** - Database Test Table
- `id` (Primary Key)
- `name`
- `created_at`

## Testing Database Connection

### Method 1: Using the Test Page

1. Start the Flask backend:
```bash
cd backend
python app.py
```

2. Start the Next.js frontend:
```bash
npm run dev
```

3. Visit: http://localhost:3000/db-test

4. Try adding a name to verify database connectivity

### Method 2: Using API Endpoints

```bash
# Check database status
curl http://localhost:8000/api/v1/test/db-status

# Add a test name
curl -X POST http://localhost:8000/api/v1/test/names \
  -H "Content-Type: application/json" \
  -d '{"name": "Test User"}'

# Get all test names
curl http://localhost:8000/api/v1/test/names
```

### Method 3: Using MySQL CLI

```bash
# Login to MySQL
mysql -u root -p vista_attendance

# Show all tables
SHOW TABLES;

# Check test_names table
SELECT * FROM test_names;

# Check users table
SELECT * FROM users;

# Check students table
SELECT * FROM students;
```

## Sample Data

After running `init_database.py`, you'll have:

- **4 Hostels**: BH-1, BH-2, GH-1, GH-2
- **200+ Rooms**: Distributed across hostels
- **6 Users**: 1 Admin, 2 Wardens, 3 Students
- **3 Students**: With assigned hostels and rooms

### Sample Login Credentials

**Admin:**
- Email: admin@jklu.edu.in
- Password: admin123

**Warden (BH-2):**
- Email: warden.bh2@jklu.edu.in
- Password: warden123

**Student:**
- Email: student1@jklu.edu.in
- Password: student123

## Troubleshooting

### Connection Refused Error
- Ensure MySQL server is running: `sudo systemctl status mysql`
- Check if MySQL is listening on port 3306: `netstat -an | grep 3306`

### Authentication Error
- Verify credentials in `.env` file
- Test MySQL login: `mysql -u root -p`

### Table Creation Errors
- Drop and recreate database:
  ```sql
  DROP DATABASE vista_attendance;
  CREATE DATABASE vista_attendance;
  ```
- Run init script again

### Import Error
- Ensure you're in the backend directory
- Activate virtual environment if using one
- Install all dependencies: `pip install -r requirements.txt`

## Database Migrations

For future schema changes, use Flask-Migrate:

```bash
# Initialize migrations (first time only)
flask db init

# Create a migration
flask db migrate -m "Description of changes"

# Apply migration
flask db upgrade

# Rollback migration
flask db downgrade
```

## Production Considerations

1. **Change default passwords** in production
2. **Use environment-specific .env files**
3. **Enable SSL for MySQL connections**
4. **Set up regular database backups**
5. **Use connection pooling** for better performance
6. **Monitor database performance** and optimize queries

## API Endpoints

### Test Endpoints
- `GET /api/v1/test/db-status` - Check database connection
- `GET /api/v1/test/names` - Get all test names
- `POST /api/v1/test/names` - Add a test name
- `DELETE /api/v1/test/names/:id` - Delete a test name

### Main Endpoints
- `POST /api/v1/auth/login` - User login
- `POST /api/v1/auth/register` - User registration
- `GET /api/v1/students` - Get students list
- `POST /api/v1/attendance/mark` - Mark attendance
- `GET /api/v1/hostels` - Get hostels list
- And more...

## Next Steps

1. ✅ Database is set up and connected
2. Test the connection using the test page
3. Start building your attendance features
4. Add face recognition functionality
5. Implement geofencing and WiFi verification
6. Deploy to production

---

**Need Help?** Check the main README.md or contact the development team.
