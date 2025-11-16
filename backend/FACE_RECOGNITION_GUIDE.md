# Face Recognition Attendance System - Implementation Guide

## Overview

The VISTA backend now includes a complete face recognition-based attendance system with:
- Multi-sample face enrollment (minimum 3 samples per student)
- Real-time face verification with accuracy threshold
- Automatic attendance marking based on face match
- Detailed enrollment status tracking
- Face sample management (capture, verify, delete)

## Database Schema

### New Model: FaceData
```prisma
model FaceData {
  id        Int       @id @default(autoincrement())
  studentId Int       @map("student_id")
  encoding  String    @db.LongText        // Base64 encoded face image
  imageUrl  String?   @map("image_url")   // Reference URL
  student   Student   @relation(...)
  createdAt DateTime  @default(now())
  
  @@map("face_data")
  @@index([studentId])
}
```

### Updated Student Model
- Added `faceEnrolled: Boolean` - Tracks enrollment status
- Added `faceData: FaceData[]` - Relationship to multiple face samples

## Configuration

Add these environment variables to `.env`:

```env
# Face Recognition Settings
FACE_API=http://localhost:8000/verify-face          # DeepFace API endpoint
FACE_MATCH_THRESHOLD=0.6                             # Similarity threshold (0-1)
NODE_ENV=development                                 # development or production
```

## API Endpoints

### 1. Capture Face Image
**Endpoint:** `POST /face/capture`
**Authentication:** Required (Student)
**Description:** Capture and store a face image for enrollment

**Request:**
```json
{
  "image": "data:image/jpeg;base64,/9j/4AAQSkZJRg..."
}
```

**Response (Success):**
```json
{
  "success": true,
  "message": "Face image captured successfully",
  "faceDataId": 1,
  "timestamp": "2025-11-16T18:30:00.000Z"
}
```

**Response (Error):**
```json
{
  "error": "No image provided"
}
```

---

### 2. Get Enrollment Status
**Endpoint:** `GET /face/enrollment-status`
**Authentication:** Required (Student)
**Description:** Get current face enrollment status and sample count

**Response (Success):**
```json
{
  "studentId": 1,
  "name": "John Doe",
  "rollNo": "2024btech001",
  "faceEnrolled": true,
  "samplesCount": 3,
  "samples": [
    {
      "id": 1,
      "createdAt": "2025-11-16T18:00:00.000Z"
    },
    {
      "id": 2,
      "createdAt": "2025-11-16T18:05:00.000Z"
    },
    {
      "id": 3,
      "createdAt": "2025-11-16T18:10:00.000Z"
    }
  ],
  "readyForAttendance": true
}
```

---

### 3. Verify Face
**Endpoint:** `POST /face/verify`
**Authentication:** Required (Student)
**Description:** Verify a captured face against stored encodings

**Request:**
```json
{
  "image": "data:image/jpeg;base64,/9j/4AAQSkZJRg..."
}
```

**Response (Success - Match):**
```json
{
  "verified": true,
  "similarity": 85,
  "matchedSampleId": 2,
  "threshold": 60,
  "allMatches": [
    {
      "sampleId": 1,
      "similarity": 82,
      "verified": true
    },
    {
      "sampleId": 2,
      "similarity": 85,
      "verified": true
    },
    {
      "sampleId": 3,
      "similarity": 80,
      "verified": true
    }
  ],
  "student": {
    "id": 1,
    "name": "John Doe",
    "rollNo": "2024btech001"
  }
}
```

**Response (Failure - No Match):**
```json
{
  "error": "Face verification failed"
}
```

---

### 4. Get Face Samples
**Endpoint:** `GET /face/samples`
**Authentication:** Required (Student)
**Description:** Get all face samples for current student

**Response:**
```json
{
  "count": 3,
  "samples": [
    {
      "id": 1,
      "createdAt": "2025-11-16T18:00:00.000Z",
      "imageUrl": "data:image/jpeg;base64,..."
    },
    {
      "id": 2,
      "createdAt": "2025-11-16T18:05:00.000Z",
      "imageUrl": "data:image/jpeg;base64,..."
    },
    {
      "id": 3,
      "createdAt": "2025-11-16T18:10:00.000Z",
      "imageUrl": "data:image/jpeg;base64,..."
    }
  ]
}
```

---

### 5. Delete Face Sample
**Endpoint:** `DELETE /face/samples/:faceDataId`
**Authentication:** Required (Student)
**Description:** Delete a specific face sample

**Parameters:**
- `faceDataId` (number) - ID of the face sample to delete

**Response (Success):**
```json
{
  "success": true,
  "message": "Face sample deleted successfully",
  "remainingSamples": 2
}
```

**Response (Error):**
```json
{
  "error": "Face sample not found or unauthorized"
}
```

---

### 6. Mark Attendance (Updated)
**Endpoint:** `POST /attendance/mark`
**Authentication:** Required (Student)
**Description:** Mark attendance with face verification

**Request:**
```json
{
  "latitude": 26.9124,
  "longitude": 75.7873,
  "test_image": "data:image/jpeg;base64,/9j/4AAQSkZJRg..."
}
```

**Response (Success):**
```json
{
  "message": "✅ Attendance marked successfully as Marked!",
  "status": "Marked",
  "faceVerified": true,
  "similarity": 85,
  "student": {
    "name": "John Doe",
    "rollNo": "2024btech001"
  }
}
```

**Response (Failure - Face Mismatch):**
```json
{
  "error": "❌ Face verification failed (45% match). Your face does not match the enrolled image. Please try again."
}
```

---

## Face Enrollment Workflow

### Step 1: Capture Multiple Samples
```bash
# Capture 3+ face images
POST /face/capture
{
  "image": "base64_image_1"
}

POST /face/capture
{
  "image": "base64_image_2"
}

POST /face/capture
{
  "image": "base64_image_3"
}
```

### Step 2: Verify Enrollment Status
```bash
GET /face/enrollment-status
```

Response should show `faceEnrolled: true` and `readyForAttendance: true`

### Step 3: Mark Attendance
```bash
POST /attendance/mark
{
  "latitude": 26.9124,
  "longitude": 75.7873,
  "test_image": "base64_current_face"
}
```

---

## Face Verification Algorithm

1. **Capture Test Image:** Get the current face image from camera
2. **Retrieve Stored Samples:** Fetch all stored face encodings for the student
3. **Compare Each Sample:** 
   - Call Face API for each stored sample
   - Get similarity percentage
   - Track best match
4. **Apply Threshold:** 
   - If best match >= `FACE_MATCH_THRESHOLD` (60%), mark as verified
   - Otherwise, reject
5. **Return Result:** 
   - Include similarity score
   - Include matched sample ID
   - Include all comparison results

---

## Accuracy & Threshold

### Similarity Score
- **0-30%:** Very different faces (likely different person)
- **30-60%:** Similar but not confident match
- **60-80%:** Good match (default threshold)
- **80-95%:** Excellent match
- **95-100%:** Nearly identical

### Adjusting Threshold
Edit `.env`:
```env
FACE_MATCH_THRESHOLD=0.7    # 70% threshold (stricter)
FACE_MATCH_THRESHOLD=0.5    # 50% threshold (more lenient)
```

---

## Error Handling

### Common Errors

| Error | Cause | Solution |
|-------|-------|----------|
| "Face not enrolled" | No face samples stored | Capture at least 3 face images |
| "Face verification failed" | Similarity below threshold | Retake photo in better lighting |
| "No face data found" | Database issue | Contact administrator |
| "Face API unavailable" | DeepFace service down | Check if Face API is running |

### Development Mode
In development (`NODE_ENV=development`), if Face API is unavailable:
- Attendance marking still succeeds
- `faceVerified` is set to `true`
- Logs warning message

In production, Face API errors are returned to client.

---

## Database Migrations

### Create FaceData Table
```bash
npm run prisma:migrate
```

This will:
1. Create `face_data` table
2. Add `face_enrolled` column to `students` table
3. Create indexes for performance

### Rollback (if needed)
```bash
npm run prisma:migrate:resolve
```

---

## Testing with Postman

### 1. Login
```http
POST http://localhost:5000/auth/student-login
Content-Type: application/json

{
  "email": "student1@jklu.edu.in",
  "password": "123"
}
```

Save the `token` from response.

### 2. Capture Face
```http
POST http://localhost:5000/face/capture
Authorization: Bearer YOUR_TOKEN_HERE
Content-Type: application/json

{
  "image": "data:image/jpeg;base64,..."
}
```

Repeat 3 times with different images.

### 3. Check Enrollment
```http
GET http://localhost:5000/face/enrollment-status
Authorization: Bearer YOUR_TOKEN_HERE
```

### 4. Verify Face
```http
POST http://localhost:5000/face/verify
Authorization: Bearer YOUR_TOKEN_HERE
Content-Type: application/json

{
  "image": "data:image/jpeg;base64,..."
}
```

### 5. Mark Attendance
```http
POST http://localhost:5000/attendance/mark
Authorization: Bearer YOUR_TOKEN_HERE
Content-Type: application/json

{
  "latitude": 26.9124,
  "longitude": 75.7873,
  "test_image": "data:image/jpeg;base64,..."
}
```

---

## Performance Optimization

### Caching
- Face samples are fetched from DB for each verification
- Consider caching frequently accessed encodings

### Batch Processing
- Multiple verifications can be done in parallel
- Current implementation does sequential comparison

### Database Indexes
- `face_data.student_id` is indexed for fast lookups
- `students.email` is indexed for authentication

---

## Security Considerations

1. **Face Data Storage**
   - Currently stored as base64 in database
   - For production: Use cloud storage (S3, Cloudinary)
   - Implement encryption at rest

2. **API Authentication**
   - All face endpoints require JWT token
   - Token expires in 24 hours

3. **Rate Limiting**
   - Implement rate limiting on face verification
   - Prevent brute force attacks

4. **Audit Logging**
   - Log all face verification attempts
   - Track successful and failed matches

---

## Troubleshooting

### Face API Connection Error
```
Error: connect ECONNREFUSED 127.0.0.1:8000
```
**Solution:** Ensure DeepFace API is running on port 8000

### Database Connection Error
```
Error: connect ECONNREFUSED 127.0.0.1:3306
```
**Solution:** Ensure MySQL is running and DATABASE_URL is correct

### Migration Failed
```
Error: Table 'face_data' already exists
```
**Solution:** Run `npm run prisma:migrate:resolve` first

---

## Next Steps

1. **Frontend Integration**
   - Create face capture UI with camera access
   - Implement real-time face detection
   - Add enrollment wizard

2. **Advanced Features**
   - Liveness detection (prevent spoofing)
   - Multiple face angles support
   - Attendance history with face match scores

3. **Deployment**
   - Set up DeepFace API on production server
   - Configure HTTPS for face data transmission
   - Implement database backups

---

## Support

For issues or questions:
1. Check logs: `npm run dev`
2. Test endpoints with Postman
3. Verify database schema: `npm run prisma:studio`
4. Check Face API status: `curl http://localhost:8000/health`
