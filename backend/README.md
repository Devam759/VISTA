# VISTA Backend API

Node.js + Express backend for VISTA - Verified Intelligent Student Tracking & Attendance system.

## Features
- ✅ JWT Authentication (Student/Warden)
- ✅ Prisma ORM with MySQL
- ✅ MVC + Services architecture
- ✅ Geo-fencing with polygon verification
- ✅ Campus Wi-Fi verification
- ✅ Face recognition integration (DeepFace API)
- ✅ Time-based attendance rules (10:00 PM - 10:30 PM)
- ✅ Role-based access control
- ✅ Hostels & Rooms management
- ✅ Warden dashboard & override

## Tech Stack
- Node.js + Express
- Prisma ORM + MySQL
- JWT (jsonwebtoken)
- bcryptjs
- axios (for face API)

## Setup

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Configure Environment
```bash
cp .env.example .env
```

Edit `.env`:
```
PORT=5000
DATABASE_URL="mysql://root:yourpassword@localhost:3306/vista"
JWT_SECRET=your_secret_key_here
FACE_API=http://localhost:8000/verify-face
```

### 3. Setup Database with Prisma
```bash
# Create database
mysql -u root -p -e "CREATE DATABASE IF NOT EXISTS vista;"

# Generate Prisma Client
npm run prisma:generate

# Run migrations
npm run prisma:migrate

# Seed sample data
npm run prisma:seed
```

### 4. Start Server
```bash
npm start
# or for development with auto-reload
npm run dev
```

Server runs on `http://localhost:5000`

### 5. (Optional) Prisma Studio
View and edit database in browser:
```bash
npm run prisma:studio
```
Opens at `http://localhost:5555`

## API Routes

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/student-login` | Student login |
| POST | `/auth/warden-login` | Warden login |

### Student Routes (Protected)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/attendance/mark` | Mark attendance (geo + wifi + face) |
| GET | `/attendance/today` | Get today's status |
| GET | `/attendance/history` | Get attendance history |

### Warden Routes (Protected)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/warden/attendance/hostel` | View hostel attendance |
| GET | `/warden/attendance/all` | View all hostels attendance |
| PUT | `/warden/attendance/override` | Manual attendance override |
| GET | `/warden/students` | List students in hostel |

## Postman Testing

### 1. Login (Student)
```http
POST http://localhost:5000/auth/student-login
Content-Type: application/json

{
  "email": "student1@jklu.edu.in",
  "password": "123"
}
```

Response:
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

### 2. Mark Attendance
```http
POST http://localhost:5000/attendance/mark
Authorization: Bearer YOUR_TOKEN_HERE
Content-Type: application/json

{
  "latitude": 26.9124,
  "longitude": 75.7873,
  "test_image": "base64_encoded_image_here"
}
```

### 3. Get Today's Attendance
```http
GET http://localhost:5000/attendance/today
Authorization: Bearer YOUR_TOKEN_HERE
```

### 4. Warden Login
```http
POST http://localhost:5000/auth/warden-login
Content-Type: application/json

{
  "email": "karan@jklu.edu.in",
  "password": "123"
}
```

### 5. View Hostel Attendance (Warden)
```http
GET http://localhost:5000/warden/attendance/hostel?date=2025-11-02
Authorization: Bearer WARDEN_TOKEN_HERE
```

## Middleware

### Authentication
- `authenticateToken`: Verifies JWT token
- `requireRole('student'|'warden')`: Role-based access

### Verification
- `verifyGeoFence`: Checks if user is inside campus polygon
- `verifyCampusWiFi`: Validates campus Wi-Fi connection

## Attendance Rules
- **Window**: 10:00 PM - 10:30 PM
- **Status**:
  - `PRESENT`: Marked within window
  - `LATE`: Marked after 10:30 PM
  - `ABSENT`: Not marked
- **Restrictions**:
  - One entry per student per day
  - Requires geo + wifi + face verification

## Face Recognition Integration
Backend calls your DeepFace FastAPI service:
```
POST http://localhost:8000/verify-face
{
  "known_image": "base64_student_face",
  "test_image": "base64_captured_face"
}
```

Expected response:
```json
{
  "verified": true,
  "distance": 0.23,
  "model": "Facenet",
  "elapsed_time": 1.2
}
```

## Database Schema (Prisma)
- `students`: Student records + face images + hostel assignment
- `wardens`: Warden accounts + hostel assignment
- `hostels`: Hostel master data
- `rooms`: Room numbers per hostel
- `attendance`: Daily attendance records with unique constraint
- `campus_polygon`: Geo-fence boundary points

## Security Notes
- Passwords hashed with bcrypt
- JWT tokens expire in 24h
- Face images stored as base64 or cloud URLs
- Geo/WiFi verification on every attendance mark
- Role-based route protection

## Folder Structure
```
backend/
├── server.js                    # Express app entry
├── config/
│   └── prisma.js               # Prisma client instance
├── prisma/
│   ├── schema.prisma           # Database schema
│   └── seed.js                 # Seed data script
├── services/                   # Business logic layer
│   ├── authService.js
│   ├── attendanceService.js
│   └── wardenService.js
├── controllers/                # Request handlers
│   ├── authController.js
│   ├── attendanceController.js
│   └── wardenController.js
├── middleware/
│   ├── auth.js                 # JWT + role verification
│   ├── verifyGeo.js           # Geo-fence check
│   └── verifyWiFi.js          # Wi-Fi check
├── routes/
│   ├── auth.js
│   ├── student.js
│   └── warden.js
├── utils/
│   └── pointInPolygon.js      # Ray-casting algorithm
├── API_DOCS.md                 # Complete API documentation
└── package.json
```

## Notes
- Update `campus_polygon` table with actual campus coordinates
- Configure Wi-Fi SSID/IP ranges in `verifyWiFi.js`
- Ensure DeepFace API is running on port 8000
- Use HTTPS in production
- Store face images in cloud storage (S3/Cloudinary) for production
