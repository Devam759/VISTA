import axios from 'axios';
import prisma from '../config/prisma.js';
import { getToday, getDateRange, formatDate, toISODateString } from '../utils/dateUtils.js';

// Configuration
const FACE_API_URL = process.env.FACE_API || 'http://localhost:8000/verify-face';
const FACE_MATCH_THRESHOLD = parseFloat(process.env.FACE_MATCH_THRESHOLD || '0.6'); // 60% similarity
const MIN_FACE_SAMPLES = 3;
const API_TIMEOUT = 10000; // 10 seconds

// Check if current time is within attendance window
function checkTimeWindow() {
  // Time window completely disabled for development
  console.log('⏰ Time window check disabled');
  return { allowed: true, status: 'Marked' };
}

// Enroll face for a student with multiple samples
export const enrollFace = async (studentId, images) => {
  // Get student
  const student = await prisma.student.findUnique({
    where: { id: studentId }
  });

  if (!student) {
    throw new Error('Student not found');
  }

  if (!images || !Array.isArray(images) || images.length < MIN_FACE_SAMPLES) {
    throw new Error(`At least ${MIN_FACE_SAMPLES} face images required for enrollment`);
  }

  try {
    // Delete existing face data for this student
    await prisma.faceData.deleteMany({
      where: { studentId }
    });

    // Store multiple face encodings
    const faceDataRecords = [];
    for (let i = 0; i < images.length; i++) {
      const faceData = await prisma.faceData.create({
        data: {
          studentId,
          encoding: images[i], // Store base64 or encoding
          imageUrl: images[i] // Store image URL for reference
        }
      });
      faceDataRecords.push(faceData);
    }

    // Update student to mark face as enrolled
    await prisma.student.update({
      where: { id: studentId },
      data: { 
        faceIdUrl: images[0], // Store primary image
        faceEnrolled: true
      }
    });

    console.log(`✅ Face enrolled for student ${student.rollNo} with ${images.length} samples`);

    return {
      message: `Face enrolled successfully with ${images.length} samples`,
      success: true,
      samplesStored: faceDataRecords.length
    };
  } catch (error) {
    console.error('Face enrollment error:', error);
    throw new Error(`Failed to enroll face: ${error.message}`);
  }
};

// Verify face against all stored encodings with accuracy threshold
async function verifyFaceWithMultipleSamples(studentId, testImage, student) {
  try {
    // Get all stored face encodings for this student
    const faceDataRecords = await prisma.faceData.findMany({
      where: { studentId },
      select: { encoding: true, id: true }
    });

    if (!faceDataRecords || faceDataRecords.length === 0) {
      throw new Error('No face data found for student');
    }

    console.log(`🔍 Comparing against ${faceDataRecords.length} stored face samples`);

    let bestMatch = {
      verified: false,
      similarity: 0,
      matchedSampleId: null
    };

    // Compare against each stored encoding
    for (const faceData of faceDataRecords) {
      try {
        const response = await axios.post(FACE_API_URL, {
          stored_image: faceData.encoding,
          test_image: testImage
        }, {
          timeout: API_TIMEOUT
        });

        const similarity = response.data?.similarity || 0;
        const verified = response.data?.verified || false;

        console.log(`  Sample ${faceData.id}: Similarity ${similarity}%`);

        // Update best match if this one is better
        if (similarity > bestMatch.similarity) {
          bestMatch = {
            verified: verified || (similarity >= FACE_MATCH_THRESHOLD * 100),
            similarity,
            matchedSampleId: faceData.id
          };
        }
      } catch (err) {
        console.error(`  Error comparing with sample ${faceData.id}:`, err.message);
        continue;
      }
    }

    return bestMatch;
  } catch (error) {
    console.error('Face verification error:', error);
    throw error;
  }
}

export const markAttendance = async (studentId, testImage) => {
  // First, get the student to ensure they exist and are enrolled
  const student = await prisma.student.findUnique({
    where: { id: studentId },
    select: { 
      id: true,
      faceIdUrl: true, 
      rollNo: true, 
      name: true,
      faceEnrolled: true
    }
  });

  if (!student) {
    throw new Error('Student not found');
  }

  if (!student.faceEnrolled || !student.faceIdUrl) {
    throw new Error('❌ Face not enrolled. Please enroll your face first from the dashboard.');
  }

  // Check time window
  const timeCheck = checkTimeWindow();
  if (!timeCheck.allowed) {
    throw new Error('Attendance window closed');
  }

  // Get current time and today's date range
  const currentTime = new Date();
  const today = getToday();
  const { start: startOfDay, end: startOfNextDay } = getDateRange();
  
  console.log(`🕒 Checking for existing attendance between ${formatDate(startOfDay)} and ${formatDate(startOfNextDay)}`);
  
  // Check if attendance already exists for today
  const existing = await prisma.attendance.findFirst({
    where: {
      studentId,
      date: {
        gte: startOfDay,
        lt: startOfNextDay
      }
    }
  });

  // If attendance exists, update it
  if (existing) {
    console.log(`📝 Found existing attendance record:`, {
      id: existing.id,
      date: existing.date,
      status: existing.status
    });
    
    const updatedAttendance = await prisma.attendance.update({
      where: { id: existing.id },
      data: {
        time: currentTime,
        status: timeCheck.status,
        faceVerified: true
      }
    });
    
    console.log(`🔄 Updated existing attendance for ${student.rollNo} at ${currentTime.toISOString()}`);
    
    return {
      message: `✅ Attendance updated successfully as ${timeCheck.status}!`,
      status: timeCheck.status,
      faceVerified: true,
      updated: true
    };
  }

  console.log(`🔍 Verifying face for student: ${student.rollNo} - ${student.name}`);

  let faceVerified = false;
  let similarity = 0;
  let matchedSampleId = null;

  try {
    // Verify against multiple stored samples
    const verificationResult = await verifyFaceWithMultipleSamples(studentId, testImage, student);
    
    faceVerified = verificationResult.verified;
    similarity = verificationResult.similarity;
    matchedSampleId = verificationResult.matchedSampleId;

    console.log(`📊 Face match result: ${faceVerified ? '✅ MATCHED' : '❌ NOT MATCHED'} (Best Similarity: ${similarity}%)`);
  } catch (err) {
    console.error('❌ Face API error:', err.message);
    
    // For development: allow if API is not available
    if (process.env.NODE_ENV !== 'production') {
      console.log('⚠️ Face API unavailable, allowing for development');
      faceVerified = true;
    } else {
      throw new Error('Face verification service unavailable. Please try again later.');
    }
  }

  if (!faceVerified) {
    throw new Error(`❌ Face verification failed (${Math.round(similarity)}% match). Your face does not match the enrolled image. Please try again.`);
  }

  console.log(`✅ Face verified successfully for ${student.rollNo}`);

  // Create new attendance record with consistent date handling
  const attendanceDate = new Date();
  attendanceDate.setHours(0, 0, 0, 0); // Set to start of day in local timezone
  
  const attendanceData = {
    studentId,
    date: attendanceDate,  // Use consistent date format
    time: currentTime,
    status: timeCheck.status,
    faceVerified: true
  };
  
  console.log('📝 Creating new attendance record:', {
    studentId,
    date: formatDate(attendanceDate),
    dateISO: attendanceDate.toISOString(),
    time: currentTime.toISOString(),
    status: timeCheck.status
  });
  
  // Use raw query to ensure consistent date handling
  const attendance = await prisma.$executeRaw`
    INSERT INTO Attendance (studentId, date, time, status, faceVerified)
    VALUES (
      ${studentId}, 
      ${attendanceDate.toISOString().split('T')[0]}, 
      ${currentTime}, 
      ${timeCheck.status}, 
      TRUE
    )
    ON DUPLICATE KEY UPDATE 
      time = VALUES(time),
      status = VALUES(status),
      faceVerified = VALUES(faceVerified)
  `;
  
  console.log(`✅ Created new attendance record:`, {
    id: attendance.id,
    studentId: attendance.studentId,
    rollNo: student.rollNo,
    date: attendance.date,
    status: attendance.status,
    time: attendance.time,
    faceVerified: attendance.faceVerified
  });

  console.log(`✅ Attendance marked: ${student.rollNo} - ${student.name} - ${timeCheck.status}`);

  return {
    message: `✅ Attendance marked successfully as ${timeCheck.status}!`,
    status: timeCheck.status,
    faceVerified: true,
    similarity: Math.round(similarity),
    threshold: Math.round(FACE_MATCH_THRESHOLD * 100),
    matchedSampleId: matchedSampleId,
    accuracy: {
      percentage: Math.round(similarity),
      status: similarity >= 90 ? 'Excellent' : similarity >= 80 ? 'Good' : similarity >= 70 ? 'Fair' : 'Low',
      message: `Face matched with ${Math.round(similarity)}% accuracy (threshold: ${Math.round(FACE_MATCH_THRESHOLD * 100)}%)`
    },
    student: {
      name: student.name,
      rollNo: student.rollNo
    },
    timestamp: currentTime.toISOString()
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
