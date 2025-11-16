import express from 'express';
import {
  captureFace,
  getEnrollment,
  verify,
  getSamples,
  deleteSample
} from '../controllers/faceRecognitionController.js';
import { authenticateToken, requireRole } from '../middleware/auth.js';

const router = express.Router();

// All face routes require authentication and student role
router.use(authenticateToken);
router.use(requireRole('student'));

/**
 * @route   POST /face/capture
 * @desc    Capture a face image for enrollment
 * @access  Private (Student)
 * @body    { image: "base64_encoded_image" }
 * @returns { success: true, message: "...", faceDataId: number, timestamp: string }
 */
router.post('/capture', captureFace);

/**
 * @route   GET /face/enrollment-status
 * @desc    Get current enrollment status
 * @access  Private (Student)
 * @returns { studentId, name, rollNo, faceEnrolled, samplesCount, readyForAttendance }
 */
router.get('/enrollment-status', getEnrollment);

/**
 * @route   POST /face/verify
 * @desc    Verify a face against stored encodings
 * @access  Private (Student)
 * @body    { image: "base64_encoded_image" }
 * @returns { verified, similarity, matchedSampleId, threshold, allMatches, student }
 */
router.post('/verify', verify);

/**
 * @route   GET /face/samples
 * @desc    Get all face samples for current student
 * @access  Private (Student)
 * @returns { count: number, samples: Array }
 */
router.get('/samples', getSamples);

/**
 * @route   DELETE /face/samples/:faceDataId
 * @desc    Delete a specific face sample
 * @access  Private (Student)
 * @params  { faceDataId: number }
 * @returns { success: true, message: "...", remainingSamples: number }
 */
router.delete('/samples/:faceDataId', deleteSample);

export default router;
