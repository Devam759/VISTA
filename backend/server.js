import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import studentRoutes from './routes/student.js';
import wardenRoutes from './routes/warden.js';
import seedRoutes from './routes/seed.js';
import faceRoutes from './routes/face.js';
import seedDatabase from './scripts/seedDatabase.js';
import faceService from './services/faceService.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

// Request logging middleware
app.use((req, res, next) => {
  console.log(`📨 ${req.method} ${req.path}`);
  next();
});

// Middleware
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  'http://127.0.0.1:5173',
  process.env.FRONTEND_URL // Your Vercel deployment URL
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    // Allow any Vercel deployment (*.vercel.app)
    if (origin && origin.includes('.vercel.app')) {
      return callback(null, true);
    }
    
    // Allow configured origins
    if (allowedOrigins.indexOf(origin) !== -1) {
      return callback(null, true);
    } else {
      console.warn('⚠️ CORS blocked origin:', origin);
      // Don't throw error, just log warning
      return callback(null, true);
    }
  },
  credentials: true
}));
app.use(express.json({ limit: '10mb' })); // For base64 images
app.use(express.urlencoded({ extended: true }));

// Cache for campus polygon to avoid repeated DB queries
let polygonCache = null;
let polygonCacheTime = 0;
const POLYGON_CACHE_TTL = 5 * 60 * 1000; // 5 minutes

async function getCampusPolygon(prisma) {
  const now = Date.now();
  
  // Return cached polygon if still valid
  if (polygonCache && (now - polygonCacheTime) < POLYGON_CACHE_TTL) {
    return polygonCache;
  }

  try {
    // Fetch from database
    const rows = await prisma.campusPolygon.findMany({
      orderBy: { pointOrder: 'asc' }
    });

    if (!rows || rows.length < 3) {
      throw new Error(`Campus polygon not configured. Found ${rows?.length || 0} points, need at least 3.`);
    }

    const polygon = rows.map(r => ({ lat: parseFloat(r.lat), lng: parseFloat(r.lng) }));
    
    // Validate polygon coordinates
    for (const point of polygon) {
      if (isNaN(point.lat) || isNaN(point.lng)) {
        throw new Error('Invalid polygon coordinates in database');
      }
    }
    
    // Ensure polygon is closed
    if (polygon.length > 0) {
      const first = polygon[0];
      const last = polygon[polygon.length - 1];
      if (first.lat !== last.lat || first.lng !== last.lng) {
        polygon.push({ lat: first.lat, lng: first.lng });
      }
    }

    // Cache the polygon
    polygonCache = polygon;
    polygonCacheTime = now;

    return polygon;
  } catch (dbError) {
    // Clear cache on error
    polygonCache = null;
    polygonCacheTime = 0;
    throw new Error(`Database error: ${dbError.message}`);
  }
}

// Debug route for geolocation testing (no auth required)
app.post('/debug/geolocation', async (req, res) => {
  try {
    const { latitude, longitude } = req.body;
    
    if (!latitude || !longitude) {
      return res.status(400).json({ error: 'latitude and longitude required' });
    }

    const lat = parseFloat(latitude);
    const lng = parseFloat(longitude);

    if (isNaN(lat) || isNaN(lng)) {
      return res.status(400).json({ error: 'Invalid latitude or longitude' });
    }

    let prisma;
    try {
      prisma = (await import('./config/prisma.js')).default;
    } catch (prismaError) {
      console.error('Failed to import Prisma:', prismaError);
      return res.status(500).json({ 
        error: 'Database connection failed',
        message: 'Please ensure the database is configured and running'
      });
    }

    let polygon;
    try {
      polygon = await getCampusPolygon(prisma);
    } catch (polygonError) {
      console.error('Failed to get campus polygon:', polygonError);
      return res.status(500).json({ 
        error: 'Campus polygon not configured',
        message: polygonError.message || 'Please configure the campus polygon in the database'
      });
    }

    const { checkPointWithTolerance } = await import('./utils/pointInPolygon.js');
    
    // Get GPS accuracy from request (for laptop GPS tolerance)
    const accuracy = req.body.accuracy ? parseFloat(req.body.accuracy) : null;
    
    // Check with tolerance for laptop GPS inaccuracy
    let result;
    try {
      result = checkPointWithTolerance(lat, lng, polygon, accuracy);
    } catch (checkError) {
      console.error('Failed to check point in polygon:', checkError);
      return res.status(500).json({ 
        error: 'Geolocation check failed',
        message: checkError.message
      });
    }
    
    const inside = result.inside;

    const bounds = {
      minLat: Math.min(...polygon.map(p => p.lat)),
      maxLat: Math.max(...polygon.map(p => p.lat)),
      minLng: Math.min(...polygon.map(p => p.lng)),
      maxLng: Math.max(...polygon.map(p => p.lng))
    };

    return res.json({
      userLocation: { lat, lng },
      insidePolygon: inside,
      polygonPoints: polygon.length,
      polygonBounds: bounds,
      polygonCoordinates: polygon,
      distanceToBoundary: result.distanceToBoundary || 0,
      gpsAccuracy: accuracy,
      message: inside 
        ? (accuracy && accuracy > 50 
          ? `✅ You are INSIDE the campus boundary (GPS accuracy: ${Math.round(accuracy)}m)` 
          : '✅ You are INSIDE the campus boundary')
        : `❌ You are OUTSIDE the campus boundary (${Math.round(result.distanceToBoundary || 0)}m away)`
    });
  } catch (error) {
    console.error('Debug geolocation error:', error);
    console.error('Error stack:', error.stack);
    return res.status(500).json({ 
      error: error.message || 'Internal server error',
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

// Routes
app.use('/auth', authRoutes);
app.use('/attendance', studentRoutes);
app.use('/warden', wardenRoutes);
app.use('/face', faceRoutes); // Face recognition endpoints
app.use('/api', seedRoutes); // Seed endpoint at /api/seed

// Health check
app.get('/', (req, res) => {
  console.log('📍 Root endpoint called');
  try {
    res.json({ 
      message: 'VISTA Backend API',
      version: '1.0.0',
      status: 'running'
    });
  } catch (err) {
    console.error('Error in root endpoint:', err);
    res.status(500).send('Internal error');
  }
});

// Health check endpoint for debugging
app.get('/health', async (req, res) => {
  try {
    const prisma = (await import('./config/prisma.js')).default;
    // Test database connection
    await prisma.$queryRaw`SELECT 1`;
    
    // Check if polygon exists
    const polygonCount = await prisma.campusPolygon.count();
    
    res.json({
      status: 'healthy',
      database: 'connected',
      polygonConfigured: polygonCount >= 3,
      polygonPoints: polygonCount
    });
  } catch (error) {
    res.status(500).json({
      status: 'unhealthy',
      error: error.message,
      database: 'disconnected'
    });
  }
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// Global error handlers to prevent server crashes
process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught Exception:', error);
  console.error('Stack:', error.stack);
  // Don't exit - let the server continue running
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection at:', promise);
  console.error('Reason:', reason);
  // Don't exit - let the server continue running
});

app.listen(PORT, async () => {
  console.log(`🚀 VISTA Backend running on port ${PORT}`);
  
  // Pre-load face recognition models in the background for faster first request
  console.log('🔄 Pre-loading face recognition models...');
  faceService.initialize()
    .then(() => {
      console.log('✅ Face recognition models pre-loaded successfully');
    })
    .catch((error) => {
      console.warn('⚠️  Face recognition models failed to pre-load:', error.message);
      console.warn('   Models will be loaded on first use (may cause slower first request)');
    });
  
  // Auto-seed database on first run (only if AUTO_SEED=true)
  if (process.env.AUTO_SEED === 'true') {
    try {
      await seedDatabase();
    } catch (error) {
      console.error('⚠️  Auto-seed failed, but server is running');
    }
  }
});
