import prisma from '../config/prisma.js';
import { checkPointWithTolerance } from '../utils/pointInPolygon.js';

// Cache for campus polygon to avoid repeated DB queries
let polygonCache = null;
let polygonCacheTime = 0;
const POLYGON_CACHE_TTL = 5 * 60 * 1000; // 5 minutes

async function getCampusPolygon() {
  const now = Date.now();
  
  // Return cached polygon if still valid
  if (polygonCache && (now - polygonCacheTime) < POLYGON_CACHE_TTL) {
    return polygonCache;
  }

  // Fetch from database
  const rows = await prisma.campusPolygon.findMany({
    orderBy: { pointOrder: 'asc' }
  });

  if (rows.length < 3) {
    throw new Error('Campus polygon not configured');
  }

  const polygon = rows.map(r => ({ lat: r.lat, lng: r.lng }));
  
  // Ensure polygon is closed (first point = last point)
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
}

export const verifyGeoFence = async (req, res, next) => {
  try {
    const { latitude, longitude } = req.body;

    if (!latitude || !longitude) {
      return res.status(400).json({ error: 'Location coordinates required' });
    }

    const lat = parseFloat(latitude);
    const lng = parseFloat(longitude);
    const accuracy = req.body.accuracy ? parseFloat(req.body.accuracy) : null;

    // Get campus polygon (cached for performance)
    const polygon = await getCampusPolygon();

    // Check with GPS accuracy tolerance for laptop GPS inaccuracy
    const result = checkPointWithTolerance(lat, lng, polygon, accuracy);
    const inside = result.inside;

    // Enhanced logging for debugging
    console.log('📍 Geolocation Check:');
    console.log(`   User Location: ${lat.toFixed(6)}, ${lng.toFixed(6)}`);
    console.log(`   GPS Accuracy: ${accuracy ? `${Math.round(accuracy)}m` : 'Unknown'}`);
    console.log(`   Polygon Points: ${polygon.length}`);
    console.log(`   Inside Polygon: ${inside}`);
    if (!inside) {
      console.log(`   Distance to Boundary: ${Math.round(result.distanceToBoundary || 0)}m`);
    }
    
    if (!inside) {
      // Log polygon bounds for debugging
      const bounds = {
        minLat: Math.min(...polygon.map(p => p.lat)),
        maxLat: Math.max(...polygon.map(p => p.lat)),
        minLng: Math.min(...polygon.map(p => p.lng)),
        maxLng: Math.max(...polygon.map(p => p.lng))
      };
      console.log(`   Polygon Bounds: Lat [${bounds.minLat.toFixed(6)}, ${bounds.maxLat.toFixed(6)}], Lng [${bounds.minLng.toFixed(6)}, ${bounds.maxLng.toFixed(6)}]`);
      console.log(`   User is ${lat < bounds.minLat ? 'SOUTH' : lat > bounds.maxLat ? 'NORTH' : 'WITHIN'} of latitude bounds`);
      console.log(`   User is ${lng < bounds.minLng ? 'WEST' : lng > bounds.maxLng ? 'EAST' : 'WITHIN'} of longitude bounds`);
      
      // ENFORCE GEOFENCING - No bypass allowed
      console.log('❌ Location outside polygon - Access denied');
      return res.status(403).json({ 
        error: 'Location verification failed: Outside campus boundary',
        userLocation: { lat, lng },
        polygonBounds: bounds,
        message: 'You must be physically present on campus to access this feature'
      });
    }

    req.geoVerified = inside;
    next();
  } catch (error) {
    console.error('Geo verification error:', error);
    res.status(500).json({ error: 'Geo verification failed' });
  }
};
