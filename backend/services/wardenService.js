import prisma from '../config/prisma.js';
import { getDateRange, formatDate } from '../utils/dateUtils.js';

export const getHostelAttendance = async (wardenId, date) => {
  // Get warden's hostel
  const warden = await prisma.warden.findUnique({
    where: { id: wardenId },
    select: { hostelId: true, hostel: { select: { name: true } } }
  });

  if (!warden) {
    throw new Error('Warden not found');
  }

  // Get date range using utility function
  const { start: targetDate, end: nextDay } = getDateRange(date);
  
  // Format dates for database query (YYYY-MM-DD)
  const formattedDate = targetDate.toISOString().split('T')[0];
  
  // Log the date range in a user-friendly format
  console.log(`📊 Fetching attendance for hostel ${warden.hostel.name} on ${formatDate(targetDate)}`);
  console.log(`📅 Date range: ${formatDate(targetDate)} to ${formatDate(nextDay)}`);
  console.log(`📅 Database query date: ${formattedDate}`);

  // Get all students in this hostel with their attendance status
  const query = `
    SELECT 
      s.*, 
      h.name as hostelName,
      (
        SELECT 
          COALESCE(
            (
              SELECT 
                CONCAT(
                  '[',
                  GROUP_CONCAT(
                    JSON_OBJECT(
                      'id', a.id,
                      'date', a.date,
                      'time', a.time,
                      'status', a.status,
                      'faceVerified', a.face_verified
                    )
                  ),
                  ']'
                )
              FROM 
                attendance a 
              WHERE 
                a.student_id = s.id 
                AND DATE(a.date) = ?
              ORDER BY 
                a.time DESC
              LIMIT 1
            ),
            '[]'
          )
      ) as attendance
    FROM 
      students s
      JOIN hostels h ON s.hostel_id = h.id
    WHERE 
      s.hostel_id = ?
    ORDER BY 
      s.room_no ASC, 
      s.roll_no ASC
  `;
  
  let students;
  try {
    students = await prisma.$queryRawUnsafe(query, formattedDate, warden.hostelId);
    console.log(`✅ Successfully fetched ${students.length} students`);
  } catch (error) {
    console.error('❌ Error executing query:', error);
    throw error;
  }
  
  // Parse the attendance data from JSON string
  const parsedStudents = students.map(s => {
    let attendance = [];
    try {
      attendance = s.attendance ? JSON.parse(s.attendance) : [];
    } catch (e) {
      console.warn('❌ Failed to parse attendance for student', s.id, ':', e.message);
    }
    
    return {
      ...s,
      attendance,
      hostel: { name: s.hostelName }
    };
  });
  
  try {
    // Log the raw attendance data for debugging
    const debugData = parsedStudents.map(s => ({
      id: s.id,
      rollNo: s.rollNo,
      attendance: Array.isArray(s.attendance) ? s.attendance.map(a => ({
        date: a.date,
        status: a.status,
        time: a.time
      })) : []
    }));
    
    console.log('📝 Raw attendance data:', JSON.stringify(debugData, null, 2));
    
    console.log(`👥 Found ${parsedStudents.length} students in hostel`);
    
    // Log attendance found
    const attendanceCount = parsedStudents.filter(s => 
      Array.isArray(s.attendance) && s.attendance.length > 0
    ).length;
    
    console.log(`✅ Attendance records found: ${attendanceCount}`);

    // Format response
    const formattedStudents = parsedStudents.map(s => {
      const attendance = Array.isArray(s.attendance) && s.attendance[0] ? s.attendance[0] : null;
      let timeValue = null;
      
      if (attendance && attendance.time) {
        // If time is already a string, parse it
        if (typeof attendance.time === 'string') {
          // Handle different time string formats
          if (attendance.time.includes('T')) {
            timeValue = new Date(attendance.time);
          } else {
            // If it's just a time string, combine with the date
            const [hours, minutes, seconds] = attendance.time.split(':');
            const date = new Date(attendance.date || targetDate);
            date.setHours(hours, minutes, seconds || 0);
            timeValue = date;
          }
        } else {
          // If it's a Date object or timestamp
          timeValue = new Date(attendance.time);
        }
      }
      
      return {
        id: s.id,
        rollNo: s.rollNo,
        name: s.name,
        roomNo: s.roomNo,
        hostel: s.hostel?.name || 'Unknown Hostel',
        status: attendance?.status || null,
        time: timeValue,
        faceVerified: attendance?.faceVerified || false,
        // Pass raw date and time for debugging
        _rawAttendance: attendance
      };
    });

    // Calculate metrics
    const presentCount = formattedStudents.filter(s => s.status === 'Marked').length;
    const lateCount = formattedStudents.filter(s => s.status === 'Late').length;
    const absentCount = formattedStudents.length - presentCount - lateCount;

    const metrics = {
      present: presentCount,
      late: lateCount,
      absent: absentCount > 0 ? absentCount : 0,
      total: formattedStudents.length
    };

    return {
      date: targetDate.toISOString().split('T')[0],
      hostel: warden.hostel?.name || 'Unknown Hostel',
      metrics,
      students: formattedStudents
    };
  } catch (error) {
    console.error('❌ Error formatting response:', error);
    throw new Error('Failed to format attendance data');
  }
};

export const getAllAttendance = async (date) => {
  const targetDate = date ? new Date(date) : new Date();
  targetDate.setHours(0, 0, 0, 0);

  const students = await prisma.student.findMany({
    include: {
      attendance: {
        where: { date: targetDate },
        take: 1
      },
      hostel: { select: { name: true } }
    },
    orderBy: [{ hostelId: 'asc' }, { roomNo: 'asc' }]
  });

  const formattedStudents = students.map(s => ({
    id: s.id,
    rollNo: s.rollNo,
    name: s.name,
    roomNo: s.roomNo,
    hostel: s.hostel.name,
    status: s.attendance[0]?.status || null,
    time: s.attendance[0]?.time || null,
    faceVerified: s.attendance[0]?.faceVerified || false
  }));

  const metrics = {
    present: formattedStudents.filter(s => s.status === 'Marked').length,
    late: formattedStudents.filter(s => s.status === 'Late').length,
    absent: formattedStudents.filter(s => !s.status).length,
    total: formattedStudents.length
  };

  return {
    date: targetDate.toISOString().split('T')[0],
    metrics,
    students: formattedStudents
  };
};

export const overrideAttendance = async (wardenId, rollNo, date, status) => {
  // Verify warden and get hostel
  const warden = await prisma.warden.findUnique({
    where: { id: wardenId },
    select: { hostelId: true }
  });

  if (!warden) {
    throw new Error('Warden not found');
  }

  // Find student and verify they're in warden's hostel
  const student = await prisma.student.findUnique({
    where: { rollNo },
    select: { id: true, hostelId: true }
  });

  if (!student) {
    throw new Error('Student not found');
  }

  if (student.hostelId !== warden.hostelId) {
    throw new Error('Student not in your hostel');
  }

  const targetDate = new Date(date);
  targetDate.setHours(0, 0, 0, 0);

  // Upsert attendance
  const attendance = await prisma.attendance.upsert({
    where: {
      studentId_date: {
        studentId: student.id,
        date: targetDate
      }
    },
    update: {
      status,
      time: new Date()
    },
    create: {
      studentId: student.id,
      date: targetDate,
      time: new Date(),
      status,
      faceVerified: false
    }
  });

  return { success: true, message: 'Attendance updated', attendance };
};

export const getStudentsList = async (wardenId, search) => {
  const warden = await prisma.warden.findUnique({
    where: { id: wardenId },
    select: { hostelId: true }
  });

  if (!warden) {
    throw new Error('Warden not found');
  }

  const whereClause = {
    hostelId: warden.hostelId
  };

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
      mobile: true,
      email: true,
      program: true,
      hostel: { select: { name: true } }
    },
    orderBy: [{ roomNo: 'asc' }, { rollNo: 'asc' }]
  });

  return students;
};
