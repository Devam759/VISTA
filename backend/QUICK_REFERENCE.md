# Face Recognition System - Quick Reference

## Installation (5 minutes)

```bash
# 1. Update environment
cp .env.example .env
# Edit .env with your settings

# 2. Install & setup
npm install
npm run prisma:generate
npm run prisma:migrate

# 3. Verify setup
npm run setup:face

# 4. Start server
npm run dev
```

## API Endpoints

### Face Management
| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/face/capture` | Capture face image |
| GET | `/face/enrollment-status` | Check enrollment |
| POST | `/face/verify` | Verify face match |
| GET | `/face/samples` | List all samples |
| DELETE | `/face/samples/:id` | Delete sample |

### Attendance
| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/attendance/mark` | Mark attendance with face |
| GET | `/attendance/today` | Get today's status |
| GET | `/attendance/history` | Get history |

## Quick Test (Postman)

```bash
# 1. Login
POST http://localhost:5000/auth/student-login
{
  "email": "student1@jklu.edu.in",
  "password": "123"
}
# Save token

# 2. Capture 3 faces
POST http://localhost:5000/face/capture
Authorization: Bearer TOKEN
{
  "image": "data:image/jpeg;base64,..."
}

# 3. Check enrollment
GET http://localhost:5000/face/enrollment-status
Authorization: Bearer TOKEN

# 4. Mark attendance
POST http://localhost:5000/attendance/mark
Authorization: Bearer TOKEN
{
  "latitude": 26.9124,
  "longitude": 75.7873,
  "test_image": "data:image/jpeg;base64,..."
}
```

## Configuration

```env
# Face Recognition
FACE_API=http://localhost:8000/verify-face
FACE_MATCH_THRESHOLD=0.6                    # 0.5-0.7 recommended
NODE_ENV=development                        # or production
```

## Database

### FaceData Table
```sql
SELECT * FROM face_data;
SELECT COUNT(*) FROM face_data WHERE student_id = 1;
```

### Student Enrollment
```sql
SELECT id, name, roll_no, face_enrolled FROM students;
```

## Common Commands

```bash
# Development
npm run dev                          # Start with auto-reload

# Database
npm run prisma:migrate              # Run migrations
npm run prisma:studio               # View database GUI
npm run setup:face                  # Verify face system

# Production
npm start                           # Start server
npm run prisma:migrate:deploy       # Deploy migrations
```

## Troubleshooting

| Problem | Solution |
|---------|----------|
| "FaceData table not found" | `npm run prisma:migrate` |
| "Face API unavailable" | Check port 8000 is running |
| "Face verification failed" | Better lighting, retake photo |
| "Enrollment flag mismatch" | `npm run setup:face` |

## Key Files

```
backend/
├── services/
│   ├── attendanceService.js         # Face verification logic
│   └── faceRecognitionService.js    # Face operations
├── controllers/
│   └── faceRecognitionController.js # API handlers
├── routes/
│   └── face.js                      # Face endpoints
├── prisma/
│   └── schema.prisma                # Database schema
└── scripts/
    └── setupFaceRecognition.js      # Setup script
```

## Face Verification Flow

```
1. Student provides test image
   ↓
2. Get all stored face encodings
   ↓
3. Compare with each stored sample
   ↓
4. Calculate best match similarity
   ↓
5. Apply threshold (default 60%)
   ↓
6. If match ≥ threshold → Verified ✅
   If match < threshold → Rejected ❌
```

## Response Examples

### Success
```json
{
  "verified": true,
  "similarity": 85,
  "matchedSampleId": 2,
  "threshold": 60
}
```

### Failure
```json
{
  "error": "Face verification failed (45% match)"
}
```

## Environment Setup

```env
# Required
DATABASE_URL=mysql://root:pass@localhost:3306/vista
JWT_SECRET=your_secret_key

# Face Recognition
FACE_API=http://localhost:8000/verify-face
FACE_MATCH_THRESHOLD=0.6
NODE_ENV=development

# Frontend
FRONTEND_URL=http://localhost:5173
```

## Performance Tips

- Face API calls take 1-3 seconds
- Attendance marking takes 2-5 seconds total
- Database queries are indexed for speed
- Consider caching for production

## Security Notes

✅ All endpoints require JWT token
✅ Role-based access (student only)
✅ Face data stored in database
✅ Input validation on all endpoints

⚠️ Use HTTPS in production
⚠️ Implement rate limiting
⚠️ Regular database backups
⚠️ Monitor Face API access

## Useful Links

- API Docs: `FACE_RECOGNITION_GUIDE.md`
- Setup Guide: `FACE_SETUP_INSTRUCTIONS.md`
- Implementation: `IMPLEMENTATION_SUMMARY.md`

## Support

1. Check logs: `npm run dev`
2. View database: `npm run prisma:studio`
3. Test Face API: `curl http://localhost:8000/health`
4. Read documentation in backend folder

---

**Last Updated:** Nov 16, 2025
**Version:** 1.0.0
