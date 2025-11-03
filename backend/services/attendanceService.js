import axios from 'axios';
import prisma from '../config/prisma.js';

// Check if current time is within attendance window
function checkTimeWindow() {
  const now = new Date();
  const hours = now.getHours();
  const minutes = now.getMinutes();
  
  const currentMinutes = hours * 60 + minutes;
  const startWindow = 22 * 60; // 10:00 PM
  const endWindow = 22 * 60 + 30; // 10:30 PM
  
  if (currentMinutes >= startWindow && currentMinutes <= endWindow) {
    return { allowed: true, status: 'Marked' };
  } else if (currentMinutes > endWindow && currentMinutes < 24 * 60) {
    return { allowed: true, status: 'Late' };
  } else {
    return { allowed: false, status: null };
  }
}

export const markAttendance = async (studentId, testImage) => {
  // Check time window
  const timeCheck = checkTimeWindow();
  if (!timeCheck.allowed) {
    throw new Error('Attendance window closed');
  }

  // Check if already marked today
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const existing = await prisma.attendance.findFirst({
    where: {
      studentId,
      date: today
    }
  });

  if (existing) {
    throw new Error('Attendance already marked for today');
  }

  // Get student's stored face image
  const student = await prisma.student.findUnique({
    where: { id: studentId },
    select: { faceIdUrl: true }
  });

  if (!student || !student.faceIdUrl) {
    throw new Error('No face image on record. Please register face first.');
  }

  // Call face verification API
  let faceVerified = false;
  try {
    const faceResponse = await axios.post(process.env.FACE_API, {
      known_image: student.faceIdUrl,
      test_image: testImage
    }, {
      timeout: 10000
    });

    faceVerified = faceResponse.data.verified === true;
    
    if (!faceVerified) {
      throw new Error('Face verification failed');
    }
  } catch (faceError) {
    if (faceError.message === 'Face verification failed') {
      throw faceError;
    }
    throw new Error('Face verification service unavailable');
  }

  // Create attendance record
  const now = new Date();
  const attendance = await prisma.attendance.create({
    data: {
      studentId,
      date: today,
      time: now,
      status: timeCheck.status,
      faceVerified
    }
  });

  return {
    success: true,
    message: `Attendance marked as ${timeCheck.status}`,
    status: timeCheck.status,
    attendance
  };
};

export const getTodayAttendance = async (studentId) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const attendance = await prisma.attendance.findFirst({
    where: {
      studentId,
      date: today
    }
  });

  if (!attendance) {
    return { status: 'NOT_MARKED' };
  }

  return attendance;
};

export const getAttendanceHistory = async (studentId, limit = 30) => {
  const attendance = await prisma.attendance.findMany({
    where: { studentId },
    orderBy: { date: 'desc' },
    take: parseInt(limit)
  });

  return attendance;
};
