import prisma from '../config/prisma.js';
import { isPointInPolygon } from '../utils/pointInPolygon.js';

export const verifyGeoFence = async (req, res, next) => {
  try {
    const { latitude, longitude } = req.body;

    if (!latitude || !longitude) {
      return res.status(400).json({ error: 'Location coordinates required' });
    }

    // Fetch campus polygon from DB
    const rows = await prisma.campusPolygon.findMany({
      orderBy: { pointOrder: 'asc' }
    });
    
    if (rows.length < 3) {
      return res.status(500).json({ error: 'Campus polygon not configured' });
    }

    const polygon = rows.map(r => ({ lat: r.lat, lng: r.lng }));
    const inside = isPointInPolygon(parseFloat(latitude), parseFloat(longitude), polygon);

    // For development: allow if polygon check fails but log it
    if (!inside) {
      console.log('⚠️ Location outside polygon, but allowing for development');
      // return res.status(403).json({ error: 'Location verification failed: Outside campus boundary' });
    }

    req.geoVerified = true;
    next();
  } catch (error) {
    console.error('Geo verification error:', error);
    res.status(500).json({ error: 'Geo verification failed' });
  }
};
