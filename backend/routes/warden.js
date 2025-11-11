import express from 'express';
import { authenticateToken, requireRole } from '../middleware/auth.js';
import {
  getHostelAttendance,
  getAllAttendance,
  overrideAttendance,
  getStudentsList,
  importStudentsMetaFromCsv
} from '../controllers/wardenController.js';

const router = express.Router();

// All routes require authentication as warden
router.use(authenticateToken);
router.use(requireRole('warden'));

// Get attendance for warden's hostel
router.get('/attendance/hostel', getHostelAttendance);

// Get all attendance (all hostels)
router.get('/attendance/all', getAllAttendance);

// Override/manually mark attendance
router.put('/attendance/override', overrideAttendance);

// Get students list in warden's hostel
router.get('/students', getStudentsList);

// Import students meta (AC/NAC, Reg No.) from a CSV URL for this warden's hostel
router.post('/import-students-meta', importStudentsMetaFromCsv);

export default router;
