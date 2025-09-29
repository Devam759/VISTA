# VISTA Attendance System - Backend API

A modern Flask-based REST API for the VISTA College Night Attendance System.

## Features

- **Authentication & Authorization**: JWT-based authentication with role-based access control
- **Student Management**: Complete student lifecycle management
- **Attendance Tracking**: GPS-verified attendance marking with face recognition
- **Hostel Management**: Hostel and room management system
- **Face Recognition**: Face enrollment and verification for attendance
- **Geofencing**: Campus boundary verification for attendance
- **Database Support**: SQLite (default), MySQL, and PostgreSQL support

## Quick Start

### 1. Install Dependencies

```bash
pip install -r requirements.txt
```

### 2. Set Environment Variables

Create a `.env` file in the backend directory:

```bash
# Flask Configuration
FLASK_ENV=development
FLASK_DEBUG=True
SECRET_KEY=your-super-secret-key
PORT=8000

# Database (SQLite by default)
DB_TYPE=sqlite

# GPS Configuration
CAMPUS_LATITUDE=26.8351
CAMPUS_LONGITUDE=75.6508
```

### 3. Initialize Database

```bash
python app.py init-db
```

### 4. Run the Server

```bash
python app.py
```

The API will be available at `http://localhost:8000`

## API Endpoints

### Authentication
- `POST /api/v1/auth/login` - User login
- `POST /api/v1/auth/register` - User registration
- `GET /api/v1/auth/me` - Get current user
- `POST /api/v1/auth/refresh` - Refresh token

### Students
- `GET /api/v1/students` - Get students list
- `POST /api/v1/students` - Create student
- `GET /api/v1/students/{id}` - Get specific student
- `PUT /api/v1/students/{id}` - Update student
- `DELETE /api/v1/students/{id}` - Delete student

### Attendance
- `GET /api/v1/attendance` - Get attendance records
- `POST /api/v1/attendance/mark` - Mark attendance
- `GET /api/v1/attendance/stats` - Get attendance statistics
- `POST /api/v1/attendance/verify-location` - Verify GPS location

### Hostels
- `GET /api/v1/hostels` - Get hostels list
- `POST /api/v1/hostels` - Create hostel
- `GET /api/v1/hostels/{id}` - Get specific hostel
- `GET /api/v1/hostels/{id}/rooms` - Get hostel rooms
- `GET /api/v1/hostels/{id}/students` - Get hostel students

### Face Recognition
- `POST /api/v1/face/enroll` - Enroll student face
- `POST /api/v1/face/verify` - Verify face for attendance
- `GET /api/v1/face/enrollments/{student_id}` - Get face enrollments
- `DELETE /api/v1/face/enrollments/{enrollment_id}` - Delete face enrollment

### Health Check
- `GET /health` - API health status

## Sample Data

The system comes with sample data including:

**Sample Users:**
- Warden: `warden@jklu.edu.in` / `warden123`
- Chief Warden: `chiefwarden@jklu.edu.in` / `chiefwarden123`
- Student: `student@jklu.edu.in` / `student123`

**Sample Hostels:**
- BH-1 (Boys Hostel 1)
- BH-2 (Boys Hostel 2)
- GH-1 (Girls Hostel 1)

## Database Configuration

### SQLite (Default)
```bash
DB_TYPE=sqlite
```

### MySQL
```bash
DB_TYPE=mysql
DB_HOST=localhost
DB_USER=your_username
DB_PASSWORD=your_password
DB_NAME=vista_attendance
DB_PORT=3306
```

### PostgreSQL
```bash
DB_TYPE=postgresql
DB_HOST=localhost
DB_USER=your_username
DB_PASSWORD=your_password
DB_NAME=vista_attendance
DB_PORT=5432
```

## Development

### Project Structure
```
backend/
├── app/
│   ├── api/
│   │   └── v1/
│   │       ├── auth.py
│   │       ├── students.py
│   │       ├── attendance.py
│   │       ├── hostels.py
│   │       └── face.py
│   └── __init__.py
├── models/
│   ├── __init__.py
│   ├── user.py
│   ├── student.py
│   ├── hostel.py
│   ├── room.py
│   ├── attendance.py
│   └── face_enrollment.py
├── utils/
│   ├── __init__.py
│   ├── geofencing.py
│   ├── face_recognition.py
│   └── validators.py
├── config/
│   └── settings.py
├── app.py
├── requirements.txt
└── README.md
```

### Running Tests
```bash
pytest
```

### Code Formatting
```bash
black .
flake8 .
```

## Deployment

### Railway
1. Connect your GitHub repository to Railway
2. Set environment variables in Railway dashboard
3. Deploy automatically

### Docker
```bash
docker build -t vista-backend .
docker run -p 8000:8000 vista-backend
```

## Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Input validation and sanitization
- GPS location verification
- Face recognition for attendance
- Role-based access control

## License

This project is licensed under the MIT License.
