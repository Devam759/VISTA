import axios from 'axios';
import prisma from '../config/prisma.js';

const FACE_API_URL = process.env.FACE_API || 'http://localhost:8000/verify-face';
const FACE_MATCH_THRESHOLD = parseFloat(process.env.FACE_MATCH_THRESHOLD || '0.6');
const API_TIMEOUT = 10000;

/**
 * Capture and store face data for a student
 * @param {number} studentId - Student ID
 * @param {string} capturedImage - Base64 encoded image or image URL
 * @returns {Promise<Object>} Face capture result
 */
export const captureFaceImage = async (studentId, capturedImage) => {
  try {
    if (!capturedImage) {
      throw new Error('No image provided');
    }

    const student = await prisma.student.findUnique({
      where: { id: studentId }
    });

    if (!student) {
      throw new Error('Student not found');
    }

    // Store the captured face image
    const faceData = await prisma.faceData.create({
      data: {
        studentId,
        encoding: capturedImage,
        imageUrl: capturedImage
      }
    });

    console.log(`📸 Face image captured for student ${student.rollNo}`);

    return {
      success: true,
      message: 'Face image captured successfully',
      faceDataId: faceData.id,
      timestamp: faceData.createdAt
    };
  } catch (error) {
    console.error('Face capture error:', error);
    throw error;
  }
};

/**
 * Get enrollment status for a student
 * @param {number} studentId - Student ID
 * @returns {Promise<Object>} Enrollment status
 */
export const getEnrollmentStatus = async (studentId) => {
  try {
    const student = await prisma.student.findUnique({
      where: { id: studentId },
      select: {
        id: true,
        name: true,
        rollNo: true,
        faceEnrolled: true,
        faceData: {
          select: {
            id: true,
            createdAt: true
          }
        }
      }
    });

    if (!student) {
      throw new Error('Student not found');
    }

    return {
      studentId: student.id,
      name: student.name,
      rollNo: student.rollNo,
      faceEnrolled: student.faceEnrolled,
      samplesCount: student.faceData.length,
      samples: student.faceData,
      readyForAttendance: student.faceEnrolled && student.faceData.length >= 3
    };
  } catch (error) {
    console.error('Get enrollment status error:', error);
    throw error;
  }
};

/**
 * Verify a captured face against stored encodings
 * @param {number} studentId - Student ID
 * @param {string} testImage - Base64 encoded test image
 * @returns {Promise<Object>} Verification result
 */
export const verifyFace = async (studentId, testImage) => {
  try {
    if (!testImage) {
      throw new Error('No test image provided');
    }

    const student = await prisma.student.findUnique({
      where: { id: studentId },
      select: {
        id: true,
        name: true,
        rollNo: true,
        faceEnrolled: true,
        faceData: {
          select: {
            id: true,
            encoding: true
          }
        }
      }
    });

    if (!student) {
      throw new Error('Student not found');
    }

    if (!student.faceEnrolled || student.faceData.length === 0) {
      throw new Error('Face not enrolled for this student');
    }

    console.log(`🔍 Verifying face for ${student.rollNo} against ${student.faceData.length} stored samples`);

    let bestMatch = {
      verified: false,
      similarity: 0,
      matchedSampleId: null,
      allMatches: []
    };

    // Compare against each stored encoding
    for (const faceData of student.faceData) {
      try {
        const response = await axios.post(FACE_API_URL, {
          stored_image: faceData.encoding,
          test_image: testImage
        }, {
          timeout: API_TIMEOUT
        });

        const similarity = response.data?.similarity || 0;
        const verified = response.data?.verified || false;

        bestMatch.allMatches.push({
          sampleId: faceData.id,
          similarity,
          verified
        });

        console.log(`  Sample ${faceData.id}: ${similarity}% match`);

        // Update best match if this one is better
        if (similarity > bestMatch.similarity) {
          bestMatch.verified = verified || (similarity >= FACE_MATCH_THRESHOLD * 100);
          bestMatch.similarity = similarity;
          bestMatch.matchedSampleId = faceData.id;
        }
      } catch (err) {
        console.error(`  Error comparing with sample ${faceData.id}:`, err.message);
        continue;
      }
    }

    return {
      verified: bestMatch.verified,
      similarity: Math.round(bestMatch.similarity),
      matchedSampleId: bestMatch.matchedSampleId,
      threshold: Math.round(FACE_MATCH_THRESHOLD * 100),
      allMatches: bestMatch.allMatches,
      student: {
        id: student.id,
        name: student.name,
        rollNo: student.rollNo
      }
    };
  } catch (error) {
    console.error('Face verification error:', error);
    throw error;
  }
};

/**
 * Delete a specific face sample
 * @param {number} faceDataId - Face data ID
 * @param {number} studentId - Student ID (for verification)
 * @returns {Promise<Object>} Deletion result
 */
export const deleteFaceSample = async (faceDataId, studentId) => {
  try {
    const faceData = await prisma.faceData.findUnique({
      where: { id: faceDataId }
    });

    if (!faceData || faceData.studentId !== studentId) {
      throw new Error('Face sample not found or unauthorized');
    }

    await prisma.faceData.delete({
      where: { id: faceDataId }
    });

    // Check if student still has samples
    const remainingSamples = await prisma.faceData.count({
      where: { studentId }
    });

    // If no samples left, mark as not enrolled
    if (remainingSamples === 0) {
      await prisma.student.update({
        where: { id: studentId },
        data: { faceEnrolled: false }
      });
    }

    console.log(`🗑️ Face sample ${faceDataId} deleted. Remaining: ${remainingSamples}`);

    return {
      success: true,
      message: 'Face sample deleted successfully',
      remainingSamples
    };
  } catch (error) {
    console.error('Delete face sample error:', error);
    throw error;
  }
};

/**
 * Get all face samples for a student
 * @param {number} studentId - Student ID
 * @returns {Promise<Array>} Array of face samples
 */
export const getFaceSamples = async (studentId) => {
  try {
    const samples = await prisma.faceData.findMany({
      where: { studentId },
      select: {
        id: true,
        createdAt: true,
        imageUrl: true
      },
      orderBy: { createdAt: 'desc' }
    });

    return samples;
  } catch (error) {
    console.error('Get face samples error:', error);
    throw error;
  }
};
