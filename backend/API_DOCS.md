# VISTA API Documentation

Base URL: `http://localhost:5000`

## Authentication

All protected routes require a JWT token in the Authorization header:
```
Authorization: Bearer YOUR_JWT_TOKEN
```

---

## Auth Routes

### Student Login
```http
POST /auth/student-login
Content-Type: application/json

{
  "email": "student1@jklu.edu.in",
  "password": "123"
}
```

**Response:**
```json
{
  "token": "eyJhbGc...",
  "role": "student",
  "user": {
    "id": 1,
    "name": "Sample Student",
    "roll": "2024btech014",
    "email": "student1@jklu.edu.in",
    "hostel": "Hostel A",
    "room": "A-101",
    "program": "B.Tech Computer Science"
  }
}
```

### Warden Login
```http
POST /auth/warden-login
Content-Type: application/json

{
  "email": "karan@jklu.edu.in",
  "password": "123"
}
```

**Response:**
```json
{
  "token": "eyJhbGc...",
  "role": "warden",
  "user": {
    "id": 1,
    "name": "Karan",
    "email": "karan@jklu.edu.in",
    "hostel": "Hostel A",
    "hostelId": 1
  }
}
```

---

## Student Routes (Protected)

### Mark Attendance
```http
POST /attendance/mark
Authorization: Bearer STUDENT_TOKEN
Content-Type: application/json

{
  "test_image": "data:image/jpeg;base64,/9j/4AAQ...",
  "latitude": 26.9124,
  "longitude": 75.7873
}
```

**Response:**
```json
{
  "success": true,
  "message": "Attendance marked as Marked",
  "status": "Marked",
  "attendance": {
    "id": 1,
    "studentId": 1,
    "date": "2025-11-02T00:00:00.000Z",
    "time": "2025-11-02T16:15:00.000Z",
    "status": "Marked",
    "faceVerified": true
  }
}
```

**Errors:**
- `403`: Attendance window closed
- `400`: Attendance already marked for today
- `403`: Face verification failed
- `500`: Face verification service unavailable

### Get Today's Attendance
```http
GET /attendance/today
Authorization: Bearer STUDENT_TOKEN
```

**Response:**
```json
{
  "id": 1,
  "studentId": 1,
  "date": "2025-11-02T00:00:00.000Z",
  "time": "2025-11-02T16:15:00.000Z",
  "status": "Marked",
  "faceVerified": true,
  "createdAt": "2025-11-02T16:15:00.000Z"
}
```

Or if not marked:
```json
{
  "status": "NOT_MARKED"
}
```

### Get Attendance History
```http
GET /attendance/history?limit=30
Authorization: Bearer STUDENT_TOKEN
```

**Response:**
```json
[
  {
    "id": 1,
    "studentId": 1,
    "date": "2025-11-02T00:00:00.000Z",
    "time": "2025-11-02T16:15:00.000Z",
    "status": "Marked",
    "faceVerified": true,
    "createdAt": "2025-11-02T16:15:00.000Z"
  },
  {
    "id": 2,
    "studentId": 1,
    "date": "2025-11-01T00:00:00.000Z",
    "time": "2025-11-01T16:20:00.000Z",
    "status": "Late",
    "faceVerified": true,
    "createdAt": "2025-11-01T16:20:00.000Z"
  }
]
```

---

## Warden Routes (Protected)

### Get Hostel Attendance
View attendance for warden's assigned hostel.

```http
GET /warden/attendance/hostel?date=2025-11-02
Authorization: Bearer WARDEN_TOKEN
```

**Response:**
```json
{
  "date": "2025-11-02",
  "hostel": "Hostel A",
  "metrics": {
    "present": 15,
    "late": 3,
    "absent": 2,
    "total": 20
  },
  "students": [
    {
      "id": 1,
      "rollNo": "2024btech014",
      "name": "Sample Student",
      "roomNo": "A-101",
      "hostel": "Hostel A",
      "status": "Marked",
      "time": "2025-11-02T16:15:00.000Z",
      "faceVerified": true
    }
  ]
}
```

### Get All Attendance
View attendance across all hostels (admin view).

```http
GET /warden/attendance/all?date=2025-11-02
Authorization: Bearer WARDEN_TOKEN
```

**Response:**
```json
{
  "date": "2025-11-02",
  "metrics": {
    "present": 142,
    "late": 12,
    "absent": 18,
    "total": 172
  },
  "students": [...]
}
```

### Override Attendance
Manually mark or update attendance for a student.

```http
PUT /warden/attendance/override
Authorization: Bearer WARDEN_TOKEN
Content-Type: application/json

{
  "roll_no": "2024btech014",
  "date": "2025-11-02",
  "status": "Marked"
}
```

**Valid statuses:** `Marked`, `Late`, `Missed`

**Response:**
```json
{
  "success": true,
  "message": "Attendance updated",
  "attendance": {...}
}
```

**Errors:**
- `404`: Student not found
- `403`: Student not in your hostel
- `400`: Invalid status

### Get Students List
List all students in warden's hostel with optional search.

```http
GET /warden/students?search=A-101
Authorization: Bearer WARDEN_TOKEN
```

**Response:**
```json
[
  {
    "id": 1,
    "rollNo": "2024btech014",
    "name": "Sample Student",
    "roomNo": "A-101",
    "mobile": "9876543210",
    "email": "student1@jklu.edu.in",
    "program": "B.Tech Computer Science",
    "hostel": {
      "name": "Hostel A"
    }
  }
]
```

---

## Attendance Rules

### Time Window
- **10:00 PM - 10:30 PM**: Status = `Marked`
- **After 10:30 PM**: Status = `Late`
- **Outside window**: Attendance marking disabled

### Verification Requirements
1. **Geo-fence**: Must be inside campus polygon
2. **Wi-Fi**: Must be on campus network (or localhost for dev)
3. **Face**: Must match stored face image (via DeepFace API)

### Constraints
- One attendance record per student per day
- Cannot mark attendance twice on same day
- Face image must be registered before marking attendance

---

## Error Responses

### 400 Bad Request
```json
{
  "error": "Email and password required"
}
```

### 401 Unauthorized
```json
{
  "error": "Access token required"
}
```

### 403 Forbidden
```json
{
  "error": "Access denied"
}
```

### 404 Not Found
```json
{
  "error": "Student not found"
}
```

### 500 Internal Server Error
```json
{
  "error": "Internal server error"
}
```

---

## Face Recognition API Integration

Backend calls DeepFace API for face verification:

```http
POST http://localhost:8000/verify-face
Content-Type: application/json

{
  "known_image": "base64_encoded_stored_face",
  "test_image": "base64_encoded_captured_face"
}
```

**Expected Response:**
```json
{
  "verified": true,
  "distance": 0.23,
  "model": "Facenet",
  "elapsed_time": 1.2
}
```

---

## Database Schema

### Students
- `id`, `name`, `rollNo`, `roomNo`, `hostelId`
- `program`, `mobile`, `address`, `email`, `password`
- `faceIdUrl` (base64 or cloud URL)

### Wardens
- `id`, `name`, `email`, `password`, `mobile`, `hostelId`

### Hostels
- `id`, `name`

### Rooms
- `id`, `roomNo`, `hostelId`

### Attendance
- `id`, `studentId`, `date`, `time`, `status`, `faceVerified`
- Unique constraint: `(studentId, date)`

### CampusPolygon
- `id`, `lat`, `lng`, `pointOrder`

---

## Sample Credentials

**Student:**
- Email: `student1@jklu.edu.in`
- Password: `123`

**Warden:**
- Email: `karan@jklu.edu.in`
- Password: `123`
