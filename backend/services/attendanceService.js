import prisma from '../config/prisma.js';
import faceService from './faceService.js';

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

/**
 * Mark attendance for a student
 * @param {number} studentId - Student ID
 * @param {string} testImage - Base64 encoded face image
 * @returns {Object} - Attendance result
 */
export const markAttendance = async (studentId, testImage) => {
  // Time window check is disabled - students can mark anytime
  // const timeCheck = checkTimeWindow();
  // if (!timeCheck.allowed) {
  //   throw new Error('Attendance window closed. Available 10:00 PM - 11:00 PM');
  // }

  // Get today's date
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  // Determine status based on current time (for record keeping)
  const timeCheck = checkTimeWindow();
  const status = timeCheck.status || 'Marked'; // Default to 'Marked' if outside window

  // Get student info
  const student = await prisma.student.findUnique({
    where: { id: studentId },
    select: { 
      faceDescriptor: true, 
      rollNo: true, 
      name: true,
      hostelId: true
    }
  });

  if (!student) {
    throw new Error('Student not found');
  }

  if (!student.faceDescriptor) {
    throw new Error('❌ Face not enrolled. Please enroll your face first from the dashboard.');
  }

  console.log(`🔍 Verifying face for student: ${student.rollNo} - ${student.name}`);

  // Verify face using face-api.js (70% threshold)
  let faceVerified = false;
  let confidence = 0;

  try {
    const verificationResult = await faceService.verifyFace(studentId, testImage);
    faceVerified = verificationResult.isMatch && verificationResult.confidence >= 70;
    confidence = verificationResult.confidence;
    
    console.log(`📊 Face match result: ${faceVerified ? '✅ MATCHED' : '❌ NOT MATCHED'} (Confidence: ${confidence}%)`);
  } catch (error) {
    console.error('❌ Face verification error:', error.message);
    throw new Error(`Face verification failed: ${error.message}`);
  }

  if (!faceVerified) {
    throw new Error(`❌ Face verification failed. Confidence: ${confidence.toFixed(2)}% (minimum 70% required). Please try again.`);
  }

  console.log(`✅ Face verified successfully for ${student.rollNo} with ${confidence}% confidence`);

  // Create or update attendance record (handle duplicates with upsert)
  const now = new Date();
  const attendance = await prisma.attendance.upsert({
    where: {
      studentId_date: {
        studentId,
        date: today
      }
    },
    update: {
      time: now,
      status: timeCheck.status,
      faceVerified: true
    },
    create: {
      studentId,
      date: today,
      time: now,
      status: timeCheck.status,
      faceVerified: true
    },
    include: {
      student: {
        select: {
          name: true,
          rollNo: true
        }
      }
    }
  });

  const isUpdate = attendance.createdAt && (now.getTime() - new Date(attendance.createdAt).getTime()) < 1000;
  const action = isUpdate ? 'updated' : 'marked';

  console.log(`✅ Attendance ${action}: ${student.rollNo} - ${student.name} - ${timeCheck.status}`);
  console.log(`   Attendance Record: ID=${attendance.id}, Date=${attendance.date}, Status=${attendance.status}, FaceVerified=${attendance.faceVerified}`);

  return {
    message: `✅ Attendance ${action} successfully as ${timeCheck.status}!`,
    status: timeCheck.status,
    faceVerified: true,
    confidence: parseFloat(confidence.toFixed(2)),
    student: {
      name: student.name,
      rollNo: student.rollNo
    },
    attendance
  };
};

/**
 * Get today's attendance for a student
 * @param {number} studentId - Student ID
 * @returns {Object} - Today's attendance or NOT_MARKED
 */
export const getTodayAttendance = async (studentId) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  console.log(`🔍 Checking attendance for student ${studentId} on ${today.toISOString().split('T')[0]}`);

  const attendance = await prisma.attendance.findFirst({
    where: {
      studentId,
      date: today
    }
  });

  if (!attendance) {
    console.log(`   No attendance found - returning NOT_MARKED`);
    return { status: 'NOT_MARKED' };
  }

  console.log(`   Attendance found: ${attendance.status}`);
  return attendance;
};

/**
 * Get attendance history for a student
 * @param {number} studentId - Student ID
 * @param {number} limit - Number of records to return
 * @returns {Array} - Attendance records
 */
export const getAttendanceHistory = async (studentId, limit = 30) => {
  const attendance = await prisma.attendance.findMany({
    where: { studentId },
    orderBy: { date: 'desc' },
    take: parseInt(limit)
  });

  return attendance;
};
