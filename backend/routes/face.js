import express from 'express';
import { authenticateToken, requireRole } from '../middleware/auth.js';
import { enrollFace, verifyFace } from '../controllers/faceController.js';

const router = express.Router();

// All routes require authentication as student
router.use(authenticateToken);
router.use(requireRole('student'));

// Enroll face - student uploads their face photo
router.post('/enroll', enrollFace);

// Verify face - student's current photo is compared with enrolled face
router.post('/verify', verifyFace);

export default router;
