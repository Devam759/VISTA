import express from 'express';
import importCSV from '../scripts/importCSV.js';

const router = express.Router();

// Seed endpoint - protected with a secret key or can be made public for one-time use
// You can add authentication here if needed
router.post('/seed', async (req, res) => {
  try {
    // Optional: Add a secret key check
    const secretKey = req.body.secretKey || req.query.secretKey;
    const expectedKey = process.env.SEED_SECRET_KEY || 'seed-secret-key-change-in-production';
    
    // Uncomment to enable secret key protection
    // if (secretKey !== expectedKey) {
    //   return res.status(401).json({ error: 'Unauthorized' });
    // }

    console.log('🌱 Seed endpoint called...');
    
    await importCSV();
    
    res.json({
      success: true,
      message: 'Database seeded successfully - CSV imported and warden account created'
    });
  } catch (error) {
    console.error('❌ Seed endpoint error:', error);
    res.status(500).json({
      success: false,
      error: error.message,
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

// Health check for seed endpoint
router.get('/seed/status', async (req, res) => {
  try {
    const { PrismaClient } = await import('@prisma/client');
    const prisma = new PrismaClient();
    
    const studentCount = await prisma.student.count();
    const wardenCount = await prisma.warden.count();
    const hostelCount = await prisma.hostel.count();
    const roomCount = await prisma.room.count();
    
    await prisma.$disconnect();
    
    res.json({
      success: true,
      counts: {
        students: studentCount,
        wardens: wardenCount,
        hostels: hostelCount,
        rooms: roomCount
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

export default router;

