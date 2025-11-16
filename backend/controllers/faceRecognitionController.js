import {
  captureFaceImage,
  getEnrollmentStatus,
  verifyFace,
  deleteFaceSample,
  getFaceSamples
} from '../services/faceRecognitionService.js';

/**
 * Capture a face image for enrollment
 * POST /face/capture
 */
export const captureFace = async (req, res) => {
  try {
    const { id: studentId } = req.user;
    const { image } = req.body;

    if (!image) {
      return res.status(400).json({ error: 'Face image required' });
    }

    const result = await captureFaceImage(studentId, image);
    res.json(result);
  } catch (error) {
    console.error('Capture face error:', error);
    res.status(500).json({ error: error.message || 'Failed to capture face' });
  }
};

/**
 * Get enrollment status for current student
 * GET /face/enrollment-status
 */
export const getEnrollment = async (req, res) => {
  try {
    const { id: studentId } = req.user;
    const result = await getEnrollmentStatus(studentId);
    res.json(result);
  } catch (error) {
    console.error('Get enrollment status error:', error);
    res.status(500).json({ error: error.message || 'Failed to fetch enrollment status' });
  }
};

/**
 * Verify a face against stored encodings
 * POST /face/verify
 */
export const verify = async (req, res) => {
  try {
    const { id: studentId } = req.user;
    const { image } = req.body;

    if (!image) {
      return res.status(400).json({ error: 'Test image required' });
    }

    const result = await verifyFace(studentId, image);
    res.json(result);
  } catch (error) {
    console.error('Verify face error:', error);
    res.status(400).json({ error: error.message || 'Face verification failed' });
  }
};

/**
 * Get all face samples for current student
 * GET /face/samples
 */
export const getSamples = async (req, res) => {
  try {
    const { id: studentId } = req.user;
    const samples = await getFaceSamples(studentId);
    res.json({
      count: samples.length,
      samples
    });
  } catch (error) {
    console.error('Get face samples error:', error);
    res.status(500).json({ error: error.message || 'Failed to fetch face samples' });
  }
};

/**
 * Delete a specific face sample
 * DELETE /face/samples/:faceDataId
 */
export const deleteSample = async (req, res) => {
  try {
    const { id: studentId } = req.user;
    const { faceDataId } = req.params;

    if (!faceDataId) {
      return res.status(400).json({ error: 'Face sample ID required' });
    }

    const result = await deleteFaceSample(parseInt(faceDataId), studentId);
    res.json(result);
  } catch (error) {
    console.error('Delete face sample error:', error);
    res.status(400).json({ error: error.message || 'Failed to delete face sample' });
  }
};
