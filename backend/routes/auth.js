import express from 'express';
import { studentLogin, wardenLogin } from '../controllers/authController.js';

const router = express.Router();

router.post('/student-login', studentLogin);
router.post('/warden-login', wardenLogin);

export default router;
