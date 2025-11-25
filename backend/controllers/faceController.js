import prisma from '../config/prisma.js';
import faceService from '../services/faceService.js';

/**
 * Enroll student's face
 * POST /face/enroll
 */
export const enrollFace = async (req, res) => {
  try {
    const { faceData } = req.body;
    const studentId = req.user.id;

    if (!faceData) {
      return res.status(400).json({ error: 'Face data is required' });
    }

    console.log(`📸 Enrolling face for student ${studentId}`);

    // Process and save face descriptor using face-api.js
    await faceService.enrollFace(studentId, faceData);

    // Get updated student record
    const student = await prisma.student.findUnique({
      where: { id: studentId },
      select: {
        id: true,
        name: true,
        rollNo: true,
        faceIdUrl: true
      }
    });

    res.json({
      success: true,
      message: 'Face enrolled successfully',
      student
    });
  } catch (error) {
    console.error('❌ Face enrollment error:', error);
    res.status(500).json({
      error: error.message || 'Face enrollment failed',
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

/**
 * Verify student's face
 * POST /face/verify
 */
export const verifyFace = async (req, res) => {
  try {
    const { imageBase64, testImage } = req.body;
    const image = imageBase64 || testImage; // Support both keys
    const studentId = req.user.id;

    if (!image) {
      return res.status(400).json({ error: 'Test image is required' });
    }

    console.log(`🔍 Verifying face for student ${studentId}`);

    // Get student's enrolled face status
    const student = await prisma.student.findUnique({
      where: { id: studentId },
      select: {
        faceDescriptor: true,
        faceIdUrl: true,
        name: true,
        rollNo: true
      }
    });

    if (!student) {
      return res.status(400).json({
        verified: false,
        message: 'Student not found',
        confidence: 0
      });
    }

    // Verify face using face-api.js (70% threshold)
    const { isMatch, confidence, distance } = await faceService.verifyFace(studentId, image);

    console.log(`📊 Face verification result for ${student.name}:`, {
      isMatch,
      confidence: `${confidence}%`,
      distance
    });

    if (isMatch && confidence >= 70) {
      return res.json({
        verified: true,
        message: 'Face verified successfully',
        confidence: parseFloat(confidence.toFixed(2)),
        accuracy: parseFloat(confidence.toFixed(2))
      });
    } else {
      return res.status(401).json({
        verified: false,
        message: `Face verification failed. Confidence: ${confidence.toFixed(2)}% (minimum 70% required)`,
        confidence: parseFloat(confidence.toFixed(2)),
        accuracy: parseFloat(confidence.toFixed(2))
      });
    }
  } catch (error) {
    console.error('❌ Face verification error:', error);
    res.status(500).json({
      error: error.message || 'Face verification failed',
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};
