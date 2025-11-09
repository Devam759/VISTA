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

// Seed only the campus polygon
router.post('/seed/polygon', async (req, res) => {
  try {
    console.log('📍 Seeding campus polygon...');
    
    const { PrismaClient } = await import('@prisma/client');
    const prisma = new PrismaClient();
    
    // Campus coordinates from CSV
    const campusCoordinates = [
      { lat: 26.835786216245545, lng: 75.65131165087223, pointOrder: 1 },
      { lat: 26.837407397333223, lng: 75.65114535391331, pointOrder: 2 },
      { lat: 26.836622388388918, lng: 75.64845744520426, pointOrder: 3 },
      { lat: 26.836051578163385, lng: 75.64818117767572, pointOrder: 4 },
      { lat: 26.835461618240164, lng: 75.65019752830267, pointOrder: 5 },
      { lat: 26.834609880617364, lng: 75.65087344497442, pointOrder: 6 },
      { lat: 26.834014228898674, lng: 75.651178881526, pointOrder: 7 },
      { lat: 26.83333241176029, lng: 75.65138272941113, pointOrder: 8 },
      { lat: 26.832626058039946, lng: 75.65278552472591, pointOrder: 9 },
      { lat: 26.833887678682544, lng: 75.65269734710455, pointOrder: 10 },
      { lat: 26.834122828616806, lng: 75.6522286310792, pointOrder: 11 },
      { lat: 26.83494166115547, lng: 75.6524958461523, pointOrder: 12 }
    ];
    
    // Delete existing polygon
    await prisma.campusPolygon.deleteMany({});
    console.log('✅ Cleared existing polygon');
    
    // Insert new coordinates
    for (const coord of campusCoordinates) {
      await prisma.campusPolygon.create({
        data: {
          lat: coord.lat,
          lng: coord.lng,
          pointOrder: coord.pointOrder
        }
      });
    }
    
    await prisma.$disconnect();
    
    console.log('✅ Campus polygon seeded successfully');
    
    res.json({
      success: true,
      message: 'Campus polygon seeded successfully',
      pointsAdded: campusCoordinates.length
    });
  } catch (error) {
    console.error('❌ Polygon seed error:', error);
    res.status(500).json({
      success: false,
      error: error.message
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
    const polygonCount = await prisma.campusPolygon.count();
    
    await prisma.$disconnect();
    
    res.json({
      success: true,
      counts: {
        students: studentCount,
        wardens: wardenCount,
        hostels: hostelCount,
        rooms: roomCount,
        polygonPoints: polygonCount
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

