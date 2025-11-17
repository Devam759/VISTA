import prisma from '../config/prisma.js';

export const getHostelAttendance = async (wardenId, date) => {
  // Get warden's hostel
  const warden = await prisma.warden.findUnique({
    where: { id: wardenId },
    select: { hostelId: true, hostel: { select: { name: true } } }
  });

  if (!warden) {
    throw new Error('Warden not found');
  }

  const targetDate = date ? new Date(date) : new Date();
  targetDate.setHours(0, 0, 0, 0);

  console.log(`📊 Fetching attendance for warden hostel ${warden.hostel.name} (ID: ${warden.hostelId}) on ${targetDate.toISOString().split('T')[0]}`);

  // Get all students in this hostel with their attendance status
  const students = await prisma.student.findMany({
    where: { hostelId: warden.hostelId },
    include: {
      attendance: {
        where: { date: targetDate },
        take: 1
      },
      hostel: { select: { name: true } }
    },
    orderBy: [{ roomNo: 'asc' }, { rollNo: 'asc' }]
  });

  console.log(`📊 Found ${students.length} students in hostel`);
  
  // Log students with attendance
  const attendedStudents = students.filter(s => s.attendance.length > 0);
  console.log(`📊 Students with attendance records: ${attendedStudents.length}`);
  attendedStudents.forEach(s => {
    console.log(`   - ${s.rollNo} ${s.name}: ${s.attendance[0].status}`);
  });

  // Format response
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

  // Calculate metrics
  const metrics = {
    present: formattedStudents.filter(s => s.status === 'Marked').length,
    late: formattedStudents.filter(s => s.status === 'Late').length,
    absent: formattedStudents.filter(s => !s.status).length,
    total: formattedStudents.length
  };

  console.log(`📊 Attendance metrics: Present=${metrics.present}, Late=${metrics.late}, Absent=${metrics.absent}`);

  return {
    date: targetDate.toISOString().split('T')[0],
    hostel: warden.hostel.name,
    metrics,
    students: formattedStudents
  };
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
