import { verifyGeofence, getPolygonInfo, clearPolygonCache } from '../services/geofenceService.js';

/**
 * Verify geofence endpoint
 * POST /geofence/verify
 * Body: { latitude, longitude, accuracy }
 */
export const verifyGeofenceEndpoint = async (req, res) => {
  try {
    const { latitude, longitude, accuracy } = req.body;

    console.log(`📍 Geofence verification request:`);
    console.log(`   Location: ${latitude}, ${longitude}`);
    console.log(`   GPS Accuracy: ${accuracy ? `${Math.round(accuracy)}m` : 'Unknown'}`);

    const result = await verifyGeofence(latitude, longitude, accuracy);

    console.log(`📍 Geofence result: ${result.allowed ? '✅ ALLOWED' : '❌ DENIED'}`);
    console.log(`   Status: ${result.accuracyStatus}`);
    console.log(`   Distance to boundary: ${result.distanceMetrics.distanceToBoundary}m`);

    res.json(result);
  } catch (error) {
    console.error('Geofence verification error:', error);
    res.status(400).json({ 
      error: error.message || 'Geofence verification failed',
      allowed: false
    });
  }
};

/**
 * Get polygon information (for debugging/admin)
 * GET /geofence/polygon-info
 */
export const getPolygonInfoEndpoint = async (req, res) => {
  try {
    const info = await getPolygonInfo();
    res.json(info);
  } catch (error) {
    console.error('Get polygon info error:', error);
    res.status(500).json({ error: error.message || 'Failed to fetch polygon info' });
  }
};

/**
 * Clear polygon cache (for admin/testing)
 * POST /geofence/clear-cache
 */
export const clearCacheEndpoint = async (req, res) => {
  try {
    clearPolygonCache();
    res.json({ message: 'Polygon cache cleared successfully' });
  } catch (error) {
    console.error('Clear cache error:', error);
    res.status(500).json({ error: 'Failed to clear cache' });
  }
};
