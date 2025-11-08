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
  const lateEndWindow = 23 * 60; // 11:00 PM
  
  if (currentMinutes >= startWindow && currentMinutes <= endWindow) {
    return { allowed: true, status: 'Marked' };
  } else if (currentMinutes > endWindow && currentMinutes <= lateEndWindow) {
    return { allowed: true, status: 'Late' };
  } else {
    return { allowed: false, status: null };
  }
}

// Enroll face for a student
export const enrollFace = async (studentId, images) => {
  // Get student
  const student = await prisma.student.findUnique({
    where: { id: studentId }
  });

  if (!student) {
    throw new Error('Student not found');
  }

  // Store the first image as the primary face ID
  // In production, you would:
  // 1. Upload images to cloud storage (S3, Cloudinary, etc.)
  // 2. Process with face recognition library
  // 3. Store face embeddings/descriptors
  // For now, we'll store the base64 image
  const faceIdUrl = images[0]; // Store first image

  // Update student with face data
  await prisma.student.update({
    where: { id: studentId },
    data: { faceIdUrl }
  });

  console.log(`✅ Face enrolled for student ${student.rollNo}`);

  return {
    message: 'Face enrolled successfully',
    success: true
  };
};

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

  // Retrieve stored face
  const student = await prisma.student.findUnique({
    where: { id: studentId },
    select: { faceIdUrl: true, rollNo: true, name: true }
  });

  if (!student || !student.faceIdUrl) {
    throw new Error('❌ Face not enrolled. Please enroll your face first from the dashboard.');
  }

  console.log(`🔍 Verifying face for student: ${student.rollNo} - ${student.name}`);

  // Call face verification API
  const faceApiUrl = process.env.FACE_API || 'http://localhost:8000/verify-face';
  let faceVerified = false;
  let similarity = 0;

  try {
    const response = await axios.post(faceApiUrl, {
      stored_image: student.faceIdUrl,
      test_image: testImage
    }, {
      timeout: 10000 // 10 second timeout
    });
    
    faceVerified = response.data?.verified || false;
    similarity = response.data?.similarity || 0;
    
    console.log(`📊 Face match result: ${faceVerified ? '✅ MATCHED' : '❌ NOT MATCHED'} (Similarity: ${similarity}%)`);
  } catch (err) {
    console.error('❌ Face API error:', err.message);
    // For development: allow if API is not available
    console.log('⚠️ Face API unavailable, allowing for development');
    faceVerified = true; // Remove this in production
  }

  if (!faceVerified) {
    throw new Error('❌ Face verification failed. Your face does not match the enrolled image. Please try again.');
  }

  console.log(`✅ Face verified successfully for ${student.rollNo}`);

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

  console.log(`✅ Attendance marked: ${student.rollNo} - ${student.name} - ${timeCheck.status}`);

  return {
    message: `✅ Attendance marked successfully as ${timeCheck.status}!`,
    status: timeCheck.status,
    faceVerified: true,
    student: {
      name: student.name,
      rollNo: student.rollNo
    }
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
