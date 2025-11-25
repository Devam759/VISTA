import {
  markAttendance as markAttendanceService,
  getTodayAttendance as getTodayAttendanceService,
  getAttendanceHistory as getAttendanceHistoryService
} from '../services/attendanceService.js';

export const markAttendance = async (req, res) => {
  try {
    const ua = (req.headers['user-agent'] || '').toLowerCase();
    const isMobile = /(android|iphone|ipad|ipod|mobile)/i.test(ua);
    if (!isMobile) {
      return res.status(403).json({ error: 'Attendance marking is restricted to mobile devices on campus.' });
    }

    const { id: studentId } = req.user;
    const { test_image } = req.body;

    console.log(`📍 Mark attendance request from student ID: ${studentId}`);

    if (!test_image) {
      return res.status(400).json({ error: 'Face image required' });
    }

    const result = await markAttendanceService(studentId, test_image);
    console.log(`✅ Attendance marked successfully for student ${studentId}`);
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

