import express from 'express';
import { 
  verifyGeofenceEndpoint, 
  getPolygonInfoEndpoint, 
  clearCacheEndpoint 
} from '../controllers/geofenceController.js';

const router = express.Router();

// Public endpoint - no authentication required
// Verify geofence for login/attendance
router.post('/verify', verifyGeofenceEndpoint);

// Get polygon information (for debugging)
router.get('/polygon-info', getPolygonInfoEndpoint);

// Clear cache (admin only - can add auth later)
router.post('/clear-cache', clearCacheEndpoint);

export default router;
