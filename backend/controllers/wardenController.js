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
    
    console.log(`📊 Warden ${wardenId} requesting attendance for date: ${date || 'today'}`);
    
    const result = await getHostelAttendanceService(wardenId, date);
    
    console.log(`📊 Returning attendance data: ${result.students.length} students, ${result.metrics.present} present`);
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

/**
 * Get face enrollment data for all students in warden's hostel
 * GET /warden/face-data
 */
export const getFaceData = async (req, res) => {
  try {
    const { id: wardenId } = req.user;
    const { search } = req.query;
    
    // Get warden's hostel
    const warden = await (await import('../config/prisma.js')).default.warden.findUnique({
      where: { id: wardenId },
      select: { hostelId: true, hostel: { select: { name: true } } }
    });

    if (!warden) {
      return res.status(404).json({ error: 'Warden not found' });
    }

    // Get all students in this hostel with face data
    const prisma = (await import('../config/prisma.js')).default;
    const whereClause = { hostelId: warden.hostelId };

    if (search) {
      whereClause.OR = [
        { rollNo: { contains: search } },
        { name: { contains: search } },
        { roomNo: { contains: search } }
      ];
    }

    const students = await prisma.student.findMany({
      where: whereClause,
      select: {
        id: true,
        rollNo: true,
        name: true,
        roomNo: true,
        email: true,
        program: true,
        faceIdUrl: true,
        faceDescriptor: true,
        hostel: { select: { name: true } }
      },
      orderBy: [{ roomNo: 'asc' }, { rollNo: 'asc' }]
    });

    // Format response
    const formattedStudents = students.map(s => ({
      id: s.id,
      rollNo: s.rollNo,
      name: s.name,
      roomNo: s.roomNo,
      email: s.email,
      program: s.program,
      hostel: s.hostel.name,
      faceEnrolled: !!(s.faceDescriptor || s.faceIdUrl),
      faceImage: s.faceIdUrl || null,
      hasDescriptor: !!s.faceDescriptor
    }));

    res.json({
      hostel: warden.hostel.name,
      total: formattedStudents.length,
      enrolled: formattedStudents.filter(s => s.faceEnrolled).length,
      notEnrolled: formattedStudents.filter(s => !s.faceEnrolled).length,
      students: formattedStudents
    });
  } catch (error) {
    console.error('Get face data error:', error);
    res.status(500).json({ error: error.message || 'Failed to fetch face data' });
  }
};
