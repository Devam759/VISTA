import {
  getHostelAttendance as getHostelAttendanceService,
  getAllAttendance as getAllAttendanceService,
  overrideAttendance as overrideAttendanceService,
  getStudentsList as getStudentsListService
} from '../services/wardenService.js';

export const getHostelAttendance = async (req, res) => {
  try {
    const { id: wardenId } = req.user;
    const { date } = req.query;
    const result = await getHostelAttendanceService(wardenId, date);
    res.json(result);
  } catch (error) {
    console.error('Get hostel attendance error:', error);
    res.status(500).json({ error: error.message || 'Failed to fetch attendance' });
  }
};

export const getAllAttendance = async (req, res) => {
  try {
    const { date } = req.query;
    const result = await getAllAttendanceService(date);
    res.json(result);
  } catch (error) {
    console.error('Get all attendance error:', error);
    res.status(500).json({ error: 'Failed to fetch attendance' });
  }
};

export const overrideAttendance = async (req, res) => {
  try {
    const { id: wardenId } = req.user;
    const { roll_no, date, status } = req.body;

    if (!roll_no || !date || !status) {
      return res.status(400).json({ error: 'roll_no, date, and status required' });
    }

    if (!['Marked', 'Late', 'Missed'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status. Use: Marked, Late, or Missed' });
    }

    const result = await overrideAttendanceService(wardenId, roll_no, date, status);
    res.json(result);
  } catch (error) {
    console.error('Override attendance error:', error);
    res.status(error.message.includes('not found') ? 404 : 403).json({ error: error.message });
  }
};

export const getStudentsList = async (req, res) => {
  try {
    const { id: wardenId } = req.user;
    const { search } = req.query;
    const result = await getStudentsListService(wardenId, search);
    res.json(result);
  } catch (error) {
    console.error('Get students list error:', error);
    res.status(500).json({ error: error.message || 'Failed to fetch students' });
  }
};
