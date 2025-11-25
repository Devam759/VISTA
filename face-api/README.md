# Face Recognition API

Node.js-based Face Recognition API for VISTA attendance system.

## Quick Start

### Installation
```bash
cd face-api
npm install
```

### Run Development
```bash
npm run dev
```

### Run Production
```bash
npm start
```

Server runs on `http://localhost:8000`

## API Endpoints

### Health Check
```
GET /health
```

Response:
```json
{
  "status": "ok",
  "service": "Face Recognition API",
  "version": "1.0.0"
}
```

### Face Verification
```
POST /verify-face
Content-Type: application/json

{
  "stored_image": "base64_encoded_image",
  "test_image": "base64_encoded_image"
}
```

Response:
```json
{
  "verified": true,
  "similarity": 85,
  "distance": 0.15,
  "model": "FaceNet-Simulated",
  "elapsed_time": 0.5,
  "message": "✅ Face matched with 85% accuracy"
}
```

## How It Works

### Development Mode
- Uses hash-based similarity comparison
- Simulates face matching for testing
- Returns realistic similarity scores (70-95% for same person, 10-40% for different)

### Production Mode
For production, replace the `simulateFaceComparison()` function with actual face recognition:

```javascript
// Use face-api.js or similar library
import * as faceapi from 'face-api.js';

// Load models
await faceapi.nets.tinyFaceDetector.loadFromUri('/models');
await faceapi.nets.faceLandmark68Net.loadFromUri('/models');
await faceapi.nets.faceRecognitionNet.loadFromUri('/models');

// Get face descriptors and compare
const descriptor1 = await faceapi.computeSingleFaceDescriptor(img1);
const descriptor2 = await faceapi.computeSingleFaceDescriptor(img2);
const distance = faceapi.euclideanDistance(descriptor1, descriptor2);
```

## Configuration

### Environment Variables
```env
PORT=8000
NODE_ENV=development
```

## Testing

### Test with cURL
```bash
# Health check
curl http://localhost:8000/health

# Face verification (replace with actual base64 images)
curl -X POST http://localhost:8000/verify-face \
  -H "Content-Type: application/json" \
  -d '{
    "stored_image": "base64_image_1",
    "test_image": "base64_image_2"
  }'
```

## Deployment

### Deploy to Render
1. Push to GitHub
2. Create new Web Service on Render
3. Connect repository
4. Set build command: `npm install`
5. Set start command: `npm start`
6. Add environment variable: `PORT=8000`

### Deploy to Vercel
Not recommended for long-running processes. Use Render or Railway instead.

## Notes

- Current implementation uses simulated face matching for development
- For production, integrate with real face recognition library (face-api.js, deepface, etc.)
- Similarity threshold: 60% (configurable)
- Supports base64 encoded images with or without data URI prefix
- CORS enabled for cross-origin requests

## License

MIT
