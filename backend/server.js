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
