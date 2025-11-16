import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import axios from 'axios';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'Face Recognition API',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

/**
 * Face Verification Endpoint
 * POST /verify-face
 * 
 * Body:
 * {
 *   "stored_image": "base64_string",
 *   "test_image": "base64_string"
 * }
 */
app.post('/verify-face', async (req, res) => {
  try {
    const { stored_image, test_image } = req.body;

    if (!stored_image || !test_image) {
      return res.status(400).json({
        error: 'Missing stored_image or test_image'
      });
    }

    console.log('🔍 Face verification request received');
    console.log(`📸 Stored image size: ${stored_image.length} bytes`);
    console.log(`📸 Test image size: ${test_image.length} bytes`);

    // For development: simulate face matching
    // In production, you would use a real face recognition library
    const similarity = simulateFaceComparison(stored_image, test_image);

    console.log(`📊 Similarity: ${similarity}%`);

    const verified = similarity >= 60; // 60% threshold

    return res.json({
      verified: verified,
      similarity: similarity,
      distance: (100 - similarity) / 100,
      model: 'FaceNet-Simulated',
      elapsed_time: 0.5,
      message: verified 
        ? `✅ Face matched with ${similarity}% accuracy`
        : `❌ Face mismatch (${similarity}% similarity)`
    });

  } catch (error) {
    console.error('❌ Face verification error:', error);
    res.status(500).json({
      error: 'Face verification failed',
      message: error.message
    });
  }
});

/**
 * Simulate face comparison
 * In production, replace this with actual face recognition library
 */
function simulateFaceComparison(image1, image2) {
  try {
    // Extract base64 content (remove data URI prefix if present)
    const img1 = image1.includes(',') ? image1.split(',')[1] : image1;
    const img2 = image2.includes(',') ? image2.split(',')[1] : image2;

    // Simple hash-based similarity for development
    // In production, use actual face encoding comparison
    const hash1 = hashString(img1.substring(0, 1000));
    const hash2 = hashString(img2.substring(0, 1000));

    // Calculate similarity based on hash similarity
    let similarity = 0;
    for (let i = 0; i < Math.min(hash1.length, hash2.length); i++) {
      if (hash1[i] === hash2[i]) {
        similarity++;
      }
    }

    // Convert to percentage (70-95% for same person, 10-40% for different)
    const baseScore = (similarity / Math.min(hash1.length, hash2.length)) * 100;
    
    // Add some randomness for realistic testing
    const randomFactor = (Math.random() - 0.5) * 10;
    let finalScore = baseScore + randomFactor;

    // Clamp between 0-100
    finalScore = Math.max(0, Math.min(100, finalScore));

    // For testing: if images are similar size, assume same person (75-95%)
    const sizeDiff = Math.abs(img1.length - img2.length) / Math.max(img1.length, img2.length);
    if (sizeDiff < 0.1) {
      // Similar sizes - likely same person
      finalScore = 75 + Math.random() * 20;
    } else if (sizeDiff > 0.5) {
      // Very different sizes - likely different person
      finalScore = 10 + Math.random() * 30;
    }

    return Math.round(finalScore);
  } catch (error) {
    console.error('Error in face comparison:', error);
    return 50; // Default to 50% if error
  }
}

/**
 * Simple hash function for string comparison
 */
function hashString(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash).toString(16);
}

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Endpoint not found',
    path: req.path,
    method: req.method
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({
    error: 'Internal server error',
    message: err.message
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Face Recognition API running on port ${PORT}`);
  console.log(`📍 Health check: http://localhost:${PORT}/health`);
  console.log(`🔍 Face verification: POST http://localhost:${PORT}/verify-face`);
});
