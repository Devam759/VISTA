import prisma from '../config/prisma.js';
import axios from 'axios';

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
  return {
    date: targetDate.toISOString().split('T')[0],
    hostel: warden.hostel.name,
    metrics,
    students: formattedStudents
  };
};

// Helper CSV parsing (supports quoted fields)
function parseCsv(content) {
  const rows = []
  let i = 0, field = '', row = [], inQuotes = false
  while (i < content.length) {
    const ch = content[i]
    if (inQuotes) {
      if (ch === '"') {
        if (content[i + 1] === '"') { field += '"'; i += 2; continue } else { inQuotes = false; i++; continue }
      } else { field += ch; i++; continue }
    } else {
      if (ch === '"') { inQuotes = true; i++; continue }
      if (ch === ',') { row.push(field); field = ''; i++; continue }
      if (ch === '\n') { row.push(field); rows.push(row); row = []; field = ''; i++; continue }
      if (ch === '\r') { i++; continue }
      field += ch; i++
    }
  }
  if (field.length > 0 || row.length > 0) { row.push(field); rows.push(row) }
  return rows
}

function normalizeHostelName(s) { return String(s || '').trim().toUpperCase() }
function normalizeRoomNo(s) { return String(s || '').trim().toUpperCase() }
function truthyAc(value) {
  const v = String(value || '').trim().toUpperCase()
  return v === 'AC' || v === 'A/C' || v === 'YES'
}

export const importStudentsMetaFromCsv = async (wardenId, csvUrl) => {
  // Scope: only import for the warden's hostel
  const warden = await prisma.warden.findUnique({ where: { id: wardenId }, select: { hostelId: true } })
  if (!warden) throw new Error('Warden not found')

  const { data: content } = await axios.get(csvUrl, { responseType: 'text', timeout: 15000 })
  const rows = parseCsv(content || '')
  if (!rows.length) throw new Error('CSV is empty')

  // Find header row
  const headerIdx = rows.findIndex(r => r.some(c => /Room\s*NO\.?/i.test(c)))
  if (headerIdx < 0) throw new Error('CSV header not found (need Room NO.)')
  const header = rows[headerIdx]
  const dataRows = rows.slice(headerIdx + 1)

  const col = (re) => header.findIndex(h => new RegExp(re, 'i').test(h || ''))
  const idxHostel = col('^Hostel$')
  const idxRoom = col('Room\s*NO\.?')
  const idxAc = col('^AC\/?NAC$|AC\s*\/\s*NAC|AC\\/NAC')
  const idxName = col("Student's\s*Name|Student Name")
  const idxReg = col('Student\s*Reg\.\s*no|Student\s*Reg')
  const idxRoll = col('Student\s*Roll\s*No\.|Roll\s*No')

  let updatedRooms = 0
  let updatedStudents = 0

  for (const r of dataRows) {
    const hostelRaw = idxHostel >= 0 ? r[idxHostel] : ''
    const roomRaw = r[idxRoom]
    if (!roomRaw) continue

    const roomNo = normalizeRoomNo(roomRaw)

    // Ensure room exists for the warden's hostel
    if (idxAc >= 0) {
      const isAC = truthyAc(r[idxAc])
      await prisma.room.upsert({
        where: { hostelId_roomNo: { hostelId: warden.hostelId, roomNo } },
        update: { isAC },
        create: { hostelId: warden.hostelId, roomNo, isAC }
      })
      updatedRooms++
    }

    const studentName = idxName >= 0 ? String(r[idxName] || '').trim() : ''
    const regNo = idxReg >= 0 ? String(r[idxReg] || '').trim() : ''
    const rollNo = idxRoll >= 0 ? String(r[idxRoll] || '').trim() : ''

    if (regNo || studentName || rollNo) {
      let studentsToUpdate = []
      if (rollNo) {
        const s = await prisma.student.findFirst({ where: { rollNo, hostelId: warden.hostelId } })
        if (s) studentsToUpdate = [s]
      } else if (studentName) {
        studentsToUpdate = await prisma.student.findMany({ where: { hostelId: warden.hostelId, roomNo, name: { equals: studentName } }, select: { id: true } })
      }
      for (const s of studentsToUpdate) {
        await prisma.student.update({ where: { id: s.id }, data: { regNo } })
        updatedStudents++
      }
    }
  }

  return { success: true, updatedRooms, updatedStudents }
}

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
      regNo: true,
      name: true,
      roomNo: true,
      mobile: true,
      email: true,
      program: true,
      hostel: { select: { name: true } },
      room: { select: { roomNo: true, isAC: true } }
    },
    orderBy: [{ roomNo: 'asc' }, { rollNo: 'asc' }]
  });

  return students;
};
