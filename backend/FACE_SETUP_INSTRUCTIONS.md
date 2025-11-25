# Face Recognition Attendance System - Setup Instructions

## Quick Start

### Prerequisites
- Node.js 16+ installed
- MySQL database running
- DeepFace API running on port 8000 (or accessible URL)
- Git installed

### Installation Steps

#### 1. Update Environment Variables
```bash
cd backend
cp .env.example .env
```

Edit `.env` and update:
```env
# Database
DATABASE_URL="mysql://root:password@localhost:3306/vista"

# Face Recognition
FACE_API=http://localhost:8000/verify-face
FACE_MATCH_THRESHOLD=0.6
NODE_ENV=development

# JWT
JWT_SECRET=your_secret_key_here

# Frontend
FRONTEND_URL=http://localhost:5173
```

#### 2. Install Dependencies
```bash
npm install
```

#### 3. Setup Database Schema
```bash
# Generate Prisma client
npm run prisma:generate

# Run migrations (creates FaceData table and updates Student table)
npm run prisma:migrate
```

When prompted, enter a name for the migration (e.g., `add_face_recognition`).

#### 4. Seed Database (Optional)
```bash
npm run prisma:seed
```

#### 5. Setup Face Recognition System
```bash
npm run setup:face
```

This script will:
- Verify FaceData table exists
- Check student enrollment status
- Fix any mismatched records
- Display configuration summary

#### 6. Start the Backend
```bash
# Development mode with auto-reload
npm run dev

# Or production mode
npm start
```

Server will run on `http://localhost:5000`

---

## Verify Installation

### 1. Check Backend Health
```bash
curl http://localhost:5000/health
```

Expected response:
```json
{
  "status": "healthy",
  "database": "connected",
  "polygonConfigured": true,
  "polygonPoints": 4
}
```

### 2. Check Face API Connection
```bash
curl http://localhost:8000/health
```

Expected response (varies by implementation):
```json
{
  "status": "ok"
}
```

### 3. Test Student Login
```bash
curl -X POST http://localhost:5000/auth/student-login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "student1@jklu.edu.in",
    "password": "123"
  }'
```

Expected response:
```json
{
  "token": "eyJhbGc...",
  "role": "student",
  "user": { ... }
}
```

---

## Face Enrollment Workflow

### Step 1: Get Enrollment Status
```bash
curl -X GET http://localhost:5000/face/enrollment-status \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

Response:
```json
{
  "studentId": 1,
  "name": "John Doe",
  "rollNo": "2024btech001",
  "faceEnrolled": false,
  "samplesCount": 0,
  "readyForAttendance": false
}
```

### Step 2: Capture Face Images (3+ required)
```bash
# Capture first image
curl -X POST http://localhost:5000/face/capture \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "image": "data:image/jpeg;base64,/9j/4AAQSkZJRg..."
  }'

# Repeat for 2nd and 3rd images
```

### Step 3: Verify Enrollment Complete
```bash
curl -X GET http://localhost:5000/face/enrollment-status \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

Should show:
```json
{
  "faceEnrolled": true,
  "samplesCount": 3,
  "readyForAttendance": true
}
```

### Step 4: Test Face Verification
```bash
curl -X POST http://localhost:5000/face/verify \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "image": "data:image/jpeg;base64,/9j/4AAQSkZJRg..."
  }'
```

Response:
```json
{
  "verified": true,
  "similarity": 85,
  "matchedSampleId": 2,
  "threshold": 60
}
```

### Step 5: Mark Attendance
```bash
curl -X POST http://localhost:5000/attendance/mark \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "latitude": 26.9124,
    "longitude": 75.7873,
    "test_image": "data:image/jpeg;base64,/9j/4AAQSkZJRg..."
  }'
```

---

## Database Schema

### FaceData Table
```sql
CREATE TABLE face_data (
  id INT PRIMARY KEY AUTO_INCREMENT,
  student_id INT NOT NULL,
  encoding LONGTEXT NOT NULL,
  image_url TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
  INDEX idx_student_id (student_id)
);
```

### Updated Students Table
```sql
ALTER TABLE students ADD COLUMN face_enrolled BOOLEAN DEFAULT FALSE;
```

---

## Troubleshooting

### Issue: "FaceData table not found"
**Solution:**
```bash
npm run prisma:migrate
npm run setup:face
```

### Issue: "Face API unavailable"
**Solution:**
1. Check if DeepFace API is running:
   ```bash
   curl http://localhost:8000/health
   ```
2. Update FACE_API in .env if running on different port
3. Restart backend: `npm run dev`

### Issue: "Face verification failed"
**Possible causes:**
- Poor lighting conditions
- Face not clearly visible
- Different angle than enrollment
- Threshold too strict

**Solution:**
- Retake photo in better lighting
- Lower FACE_MATCH_THRESHOLD in .env (e.g., 0.5)
- Recapture enrollment samples

### Issue: "Attendance already marked for today"
**Solution:**
- This is expected behavior (one entry per student per day)
- Check attendance history: `GET /attendance/history`

### Issue: Database connection error
**Solution:**
1. Verify MySQL is running
2. Check DATABASE_URL in .env
3. Test connection:
   ```bash
   mysql -u root -p -h localhost -e "SELECT 1"
   ```

---

## Performance Optimization

### Database Indexes
Already created:
- `face_data.student_id` - Fast student lookup
- `students.email` - Fast authentication
- `students.hostel_id` - Fast hostel queries

### Caching Strategies
Consider implementing:
- Cache frequently accessed face encodings in memory
- Implement Redis for session caching
- Cache campus polygon data

### Batch Operations
- Process multiple face verifications in parallel
- Use Promise.all() for concurrent API calls

---

## Security Checklist

- [ ] Change JWT_SECRET in .env
- [ ] Use HTTPS in production
- [ ] Implement rate limiting on face endpoints
- [ ] Store face images in encrypted cloud storage
- [ ] Audit log all face verification attempts
- [ ] Implement CORS properly for production domain
- [ ] Use environment-specific configurations
- [ ] Regularly backup database
- [ ] Monitor Face API for unauthorized access

---

## Deployment to Production

### 1. Environment Setup
```bash
# Update .env for production
NODE_ENV=production
FACE_API=https://your-face-api.com/verify-face
DATABASE_URL=mysql://user:pass@prod-db.com:3306/vista
JWT_SECRET=generate_strong_random_secret
FRONTEND_URL=https://your-app.vercel.app
```

### 2. Database Migration
```bash
npm run prisma:migrate:deploy
```

### 3. Start Server
```bash
npm start
```

### 4. Verify Health
```bash
curl https://your-api.com/health
```

---

## Monitoring & Logging

### View Logs
```bash
# Development
npm run dev

# Production (with PM2)
pm2 logs vista-backend
```

### Key Log Messages
- `✅ Face enrolled` - Successful enrollment
- `🔍 Verifying face` - Face verification started
- `📊 Face match result` - Match result with similarity
- `✅ Attendance marked` - Attendance successfully recorded
- `❌ Face verification failed` - Verification failed

### Database Monitoring
```bash
# View database in browser
npm run prisma:studio
```

Opens at `http://localhost:5555`

---

## API Documentation

See `FACE_RECOGNITION_GUIDE.md` for complete API documentation.

### Quick Reference
| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/face/capture` | Capture face image |
| GET | `/face/enrollment-status` | Check enrollment status |
| POST | `/face/verify` | Verify face match |
| GET | `/face/samples` | Get all samples |
| DELETE | `/face/samples/:id` | Delete sample |
| POST | `/attendance/mark` | Mark attendance |

---

## Support & Debugging

### Enable Debug Logging
```bash
# Add to .env
DEBUG=vista:*
```

### Test Face API Directly
```bash
curl -X POST http://localhost:8000/verify-face \
  -H "Content-Type: application/json" \
  -d '{
    "stored_image": "base64_image_1",
    "test_image": "base64_image_2"
  }'
```

### Check Database State
```bash
# Connect to MySQL
mysql -u root -p vista

# View face data
SELECT * FROM face_data;

# View student enrollment
SELECT id, name, roll_no, face_enrolled FROM students;
```

---

## Next Steps

1. **Frontend Integration**
   - Implement face capture UI
   - Add camera access
   - Create enrollment wizard

2. **Advanced Features**
   - Liveness detection
   - Multiple angle support
   - Attendance analytics

3. **Scaling**
   - Implement caching
   - Add load balancing
   - Use CDN for images

---

## Version History

- **v1.0.0** (Current)
  - Multi-sample face enrollment
  - Real-time face verification
  - Automatic attendance marking
  - Face sample management

---

## License

MIT License - See LICENSE file for details
