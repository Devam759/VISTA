import * as faceapi from 'face-api.js';

// Model URL - models should be in public/models directory
const MODEL_URL = '/models';

let modelsLoaded = false;
let loadingPromise = null;

/**
 * Load face-api.js models
 * Should be called once when the app starts
 */
export const loadModels = async () => {
  if (modelsLoaded) {
    return true;
  }

  // If already loading, return the existing promise
  if (loadingPromise) {
    return loadingPromise;
  }

  loadingPromise = (async () => {
    try {
      console.log('🔄 Loading face-api.js models...');
      
      // Load all required models
      await Promise.all([
        faceapi.nets.ssdMobilenetv1.loadFromUri(MODEL_URL),
        faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
        faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL)
      ]);

      modelsLoaded = true;
      console.log('✅ Face-api.js models loaded successfully');
      return true;
    } catch (error) {
      console.warn('⚠️ Face-api.js models not found. Face detection will be disabled.');
      console.warn('💡 To enable face detection, download models by running: cd backend && npm run download:models');
      console.warn('   Error details:', error.message);
      modelsLoaded = false;
      loadingPromise = null;
      // Don't throw - allow app to continue without face detection
      return false;
    }
  })();

  return loadingPromise;
};

/**
 * Detect faces in an image/video element
 * @param {HTMLImageElement|HTMLVideoElement|HTMLCanvasElement} input - Image/Video element
 * @returns {Promise<Array>} Array of face detections with landmarks and descriptors
 */
export const detectFaces = async (input) => {
  if (!modelsLoaded) {
    const loaded = await loadModels();
    if (!loaded) {
      throw new Error('Face detection models not available. Please download models first.');
    }
  }

  try {
    const detections = await faceapi
      .detectAllFaces(input)
      .withFaceLandmarks()
      .withFaceDescriptors();

    return detections;
  } catch (error) {
    console.error('Error detecting faces:', error);
    throw error;
  }
};

/**
 * Detect a single face in an image/video element
 * @param {HTMLImageElement|HTMLVideoElement|HTMLCanvasElement} input - Image/Video element
 * @returns {Promise<Object|null>} Face detection with landmarks and descriptor, or null
 */
export const detectSingleFace = async (input) => {
  if (!modelsLoaded) {
    const loaded = await loadModels();
    if (!loaded) {
      return null; // Return null if models not available
    }
  }

  try {
    const detection = await faceapi
      .detectSingleFace(input)
      .withFaceLandmarks()
      .withFaceDescriptor();

    return detection;
  } catch (error) {
    console.error('Error detecting face:', error);
    return null; // Return null on error instead of throwing
  }
};

/**
 * Draw face detection boxes on a canvas
 * @param {HTMLCanvasElement} canvas - Canvas element to draw on
 * @param {Array} detections - Array of face detections
 * @param {Object} options - Drawing options
 */
export const drawFaceDetections = (canvas, detections, options = {}) => {
  const ctx = canvas.getContext('2d');
  const displaySize = { width: canvas.width, height: canvas.height };
  
  // Resize detections to match canvas size
  const resizedDetections = faceapi.resizeResults(detections, displaySize);
  
  // Draw face detection boxes
  faceapi.draw.drawDetections(canvas, resizedDetections, options);
  
  // Draw face landmarks
  if (options.drawLandmarks !== false) {
    faceapi.draw.drawFaceLandmarks(canvas, resizedDetections, options);
  }
};

/**
 * Compare two face descriptors
 * @param {Float32Array} descriptor1 - First face descriptor
 * @param {Float32Array} descriptor2 - Second face descriptor
 * @returns {Object} - { distance: number, similarity: number, match: boolean }
 */
export const compareFaces = (descriptor1, descriptor2, threshold = 0.6) => {
  const distance = faceapi.euclideanDistance(descriptor1, descriptor2);
  
  // Convert distance to similarity percentage
  // Lower distance = more similar
  // Typical threshold: 0.6 (60% similarity)
  const similarity = Math.max(0, 100 - (distance * 100));
  const match = distance < threshold;

  return {
    distance: parseFloat(distance.toFixed(4)),
    similarity: parseFloat(similarity.toFixed(2)),
    match
  };
};

/**
 * Check if models are loaded
 */
export const areModelsLoaded = () => modelsLoaded;

