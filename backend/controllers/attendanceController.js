import {
  markAttendance as markAttendanceService,
  getTodayAttendance as getTodayAttendanceService,
  getAttendanceHistory as getAttendanceHistoryService,
  enrollFace as enrollFaceService
} from '../services/attendanceService.js';

export const markAttendance = async (req, res) => {
  try {
    const { id: studentId } = req.user;
    const { test_image } = req.body;

    if (!test_image) {
      return res.status(400).json({ error: 'Face image required' });
    }

    const result = await markAttendanceService(studentId, test_image);
    res.json(result);
  } catch (error) {
    console.error('Mark attendance error:', error);
    res.status(error.message.includes('window') ? 403 : 400).json({ error: error.message });
  }
};

export const getTodayAttendance = async (req, res) => {
  try {
    const { id: studentId } = req.user;
    const result = await getTodayAttendanceService(studentId);
    res.json(result);
  } catch (error) {
    console.error('Get today attendance error:', error);
    res.status(500).json({ error: 'Failed to fetch attendance' });
  }
};

export const getAttendanceHistory = async (req, res) => {
  try {
    const { id: studentId } = req.user;
    const { limit = 30 } = req.query;
    const result = await getAttendanceHistoryService(studentId, limit);
    res.json(result);
  } catch (error) {
    console.error('Get attendance history error:', error);
    res.status(500).json({ error: 'Failed to fetch history' });
  }
};

export const enrollFace = async (req, res) => {
  try {
    const { id: studentId } = req.user;
    const { images } = req.body;

    if (!images || !Array.isArray(images) || images.length < 3) {
      return res.status(400).json({ error: 'At least 3 face images required' });
    }

    const result = await enrollFaceService(studentId, images);
    res.json(result);
  } catch (error) {
    console.error('Enroll face error:', error);
    res.status(500).json({ error: error.message || 'Failed to enroll face' });
  }
};
