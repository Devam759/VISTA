import express from 'express';
import { authenticateToken, requireRole } from '../middleware/auth.js';
import { verifyGeoFence } from '../middleware/verifyGeo.js';
import {
  markAttendance,
  getTodayAttendance,
  getAttendanceHistory,
  enrollFace
} from '../controllers/attendanceController.js';

const router = express.Router();

// All routes require authentication as student
router.use(authenticateToken);
router.use(requireRole('student'));

// Enroll face - no geo/wifi required for enrollment
router.post('/enroll-face', enrollFace);

// Mark attendance - requires geo + face verification
router.post('/mark', verifyGeoFence, markAttendance);

// Get today's attendance status
router.get('/today', getTodayAttendance);

// Get attendance history
router.get('/history', getAttendanceHistory);

export default router;
