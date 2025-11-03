import express from 'express';
import { authenticateToken, requireRole } from '../middleware/auth.js';
import { verifyGeoFence } from '../middleware/verifyGeo.js';
import { verifyCampusWiFi } from '../middleware/verifyWiFi.js';
import {
  markAttendance,
  getTodayAttendance,
  getAttendanceHistory
} from '../controllers/attendanceController.js';

const router = express.Router();

// All routes require authentication as student
router.use(authenticateToken);
router.use(requireRole('student'));

// Mark attendance - requires geo + wifi + face verification
router.post('/mark', verifyGeoFence, verifyCampusWiFi, markAttendance);

// Get today's attendance status
router.get('/today', getTodayAttendance);

// Get attendance history
router.get('/history', getAttendanceHistory);

export default router;
