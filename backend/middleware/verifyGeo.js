import prisma from '../config/prisma.js';
import { isPointInPolygon } from '../utils/pointInPolygon.js';

export const verifyGeoFence = async (req, res, next) => {
  try {
    const { latitude, longitude } = req.body;

    if (!latitude || !longitude) {
      return res.status(400).json({ error: 'Location coordinates required' });
    }

    const lat = parseFloat(latitude);
    const lng = parseFloat(longitude);

    // Fetch campus polygon from DB
    const rows = await prisma.campusPolygon.findMany({
      orderBy: { pointOrder: 'asc' }
    });
    
    if (rows.length < 3) {
      return res.status(500).json({ error: 'Campus polygon not configured' });
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

    const inside = isPointInPolygon(lat, lng, polygon);

    // Enhanced logging for debugging
    console.log('📍 Geolocation Check:');
    console.log(`   User Location: ${lat.toFixed(6)}, ${lng.toFixed(6)}`);
    console.log(`   Polygon Points: ${polygon.length}`);
    console.log(`   Inside Polygon: ${inside}`);
    
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
      
      // For development: allow if polygon check fails but log it
      console.log('⚠️ Location outside polygon, but allowing for development');
      // Uncomment the line below to enforce geofencing in production:
      // return res.status(403).json({ error: 'Location verification failed: Outside campus boundary' });
    }

    req.geoVerified = inside;
    next();
  } catch (error) {
    console.error('Geo verification error:', error);
    res.status(500).json({ error: 'Geo verification failed' });
  }
};
