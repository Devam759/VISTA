import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import studentRoutes from './routes/student.js';
import wardenRoutes from './routes/warden.js';
import seedRoutes from './routes/seed.js';
import seedDatabase from './scripts/seedDatabase.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

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
      callback(null, true);
    } else {
      console.warn('⚠️ CORS blocked origin:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));
app.use(express.json({ limit: '10mb' })); // For base64 images
app.use(express.urlencoded({ extended: true }));

// Debug route for geolocation testing (no auth required)
app.post('/debug/geolocation', async (req, res) => {
  try {
    const { latitude, longitude } = req.body;
    
    if (!latitude || !longitude) {
      return res.status(400).json({ error: 'latitude and longitude required' });
    }

    const lat = parseFloat(latitude);
    const lng = parseFloat(longitude);

    const prisma = (await import('./config/prisma.js')).default;
    const { isPointInPolygon } = await import('./utils/pointInPolygon.js');

    // Fetch campus polygon
    const rows = await prisma.campusPolygon.findMany({
      orderBy: { pointOrder: 'asc' }
    });

    if (rows.length < 3) {
      return res.status(500).json({ error: 'Campus polygon not configured' });
    }

    const polygon = rows.map(r => ({ lat: r.lat, lng: r.lng }));
    
    // Ensure polygon is closed
    if (polygon.length > 0) {
      const first = polygon[0];
      const last = polygon[polygon.length - 1];
      if (first.lat !== last.lat || first.lng !== last.lng) {
        polygon.push({ lat: first.lat, lng: first.lng });
      }
    }

    const inside = isPointInPolygon(lat, lng, polygon);

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
      message: inside 
        ? '✅ You are INSIDE the campus boundary' 
        : '❌ You are OUTSIDE the campus boundary'
    });
  } catch (error) {
    console.error('Debug geolocation error:', error);
    return res.status(500).json({ error: error.message });
  }
});

// Routes
app.use('/auth', authRoutes);
app.use('/attendance', studentRoutes);
app.use('/warden', wardenRoutes);
app.use('/api', seedRoutes); // Seed endpoint at /api/seed

// Health check
app.get('/', (req, res) => {
  res.json({ 
    message: 'VISTA Backend API',
    version: '1.0.0',
    status: 'running'
  });
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

app.listen(PORT, async () => {
  console.log(`🚀 VISTA Backend running on port ${PORT}`);
  
  // Auto-seed database on first run (only if AUTO_SEED=true)
  if (process.env.AUTO_SEED === 'true') {
    try {
      await seedDatabase();
    } catch (error) {
      console.error('⚠️  Auto-seed failed, but server is running');
    }
  }
});
