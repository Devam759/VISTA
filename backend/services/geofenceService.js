import prisma from '../config/prisma.js';
import { checkPointWithTolerance, isPointInPolygon } from '../utils/pointInPolygon.js';

// Cache for campus polygon
let polygonCache = null;
let polygonCacheTime = 0;
const POLYGON_CACHE_TTL = 5 * 60 * 1000; // 5 minutes

/**
 * Get campus polygon from database with caching
 */
async function getCampusPolygon() {
  const now = Date.now();
  
  if (polygonCache && (now - polygonCacheTime) < POLYGON_CACHE_TTL) {
    return polygonCache;
  }

  const rows = await prisma.campusPolygon.findMany({
    orderBy: { pointOrder: 'asc' }
  });

  if (rows.length < 3) {
    throw new Error('Campus polygon not configured in database');
  }

  const polygon = rows.map(r => ({ lat: parseFloat(r.lat), lng: parseFloat(r.lng) }));
  
  // Ensure polygon is closed
  if (polygon.length > 0) {
    const first = polygon[0];
    const last = polygon[polygon.length - 1];
    if (first.lat !== last.lat || first.lng !== last.lng) {
      polygon.push({ lat: first.lat, lng: first.lng });
    }
  }

  polygonCache = polygon;
  polygonCacheTime = now;

  return polygon;
}

/**
 * Calculate distance between two points in meters using Haversine formula
 */
function calculateDistance(lat1, lng1, lat2, lng2) {
  const R = 6371000; // Earth's radius in meters
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Calculate minimum distance from point to polygon boundary
 */
function distanceToPolygon(lat, lng, polygon) {
  let minDistance = Infinity;
  
  for (let i = 0; i < polygon.length - 1; i++) {
    const p1 = polygon[i];
    const p2 = polygon[i + 1];
    
    const A = lng - p1.lng;
    const B = p2.lng - p1.lng;
    const C = lat - p1.lat;
    const D = p2.lat - p1.lat;
    
    const dot = A * B + C * D;
    const lenSq = B * B + D * D;
    let param = -1;
    
    if (lenSq !== 0) param = dot / lenSq;
    
    let xx, yy;
    
    if (param < 0) {
      xx = p1.lng;
      yy = p1.lat;
    } else if (param > 1) {
      xx = p2.lng;
      yy = p2.lat;
    } else {
      xx = p1.lng + param * B;
      yy = p1.lat + param * D;
    }
    
    const dist = calculateDistance(lat, lng, yy, xx);
    if (dist < minDistance) {
      minDistance = dist;
    }
  }
  
  return minDistance;
}

/**
 * Verify geofence with detailed accuracy information
 * @param {number} latitude - Device latitude
 * @param {number} longitude - Device longitude
 * @param {number} accuracy - GPS accuracy in meters
 * @returns {Object} - Detailed geofence verification result
 */
export const verifyGeofence = async (latitude, longitude, accuracy = null) => {
  // Validate inputs
  if (!latitude || !longitude) {
    throw new Error('Latitude and longitude are required');
  }

  const lat = parseFloat(latitude);
  const lng = parseFloat(longitude);
  const gpsAccuracy = accuracy ? parseFloat(accuracy) : null;

  // Validate coordinates
  if (isNaN(lat) || isNaN(lng) || lat < -90 || lat > 90 || lng < -180 || lng > 180) {
    throw new Error('Invalid coordinates provided');
  }

  // Get campus polygon from database
  const polygon = await getCampusPolygon();

  // Calculate polygon bounds
  const bounds = {
    minLat: Math.min(...polygon.map(p => p.lat)),
    maxLat: Math.max(...polygon.map(p => p.lat)),
    minLng: Math.min(...polygon.map(p => p.lng)),
    maxLng: Math.max(...polygon.map(p => p.lng))
  };

  // Check if point is inside polygon
  const isInside = isPointInPolygon(lat, lng, polygon);
  
  let distanceToBoundary = 0;
  let accuracyStatus = 'UNKNOWN';
  let allowed = false;

  if (isInside) {
    // Point is clearly inside
    distanceToBoundary = 0;
    accuracyStatus = 'INSIDE_BOUNDARY';
    allowed = true;
  } else {
    // Point is outside - calculate distance to boundary
    distanceToBoundary = distanceToPolygon(lat, lng, polygon);

    // Determine accuracy status based on GPS accuracy and distance
    if (gpsAccuracy) {
      if (distanceToBoundary <= gpsAccuracy) {
        // Point is within GPS accuracy radius of boundary - ALLOW with warning
        accuracyStatus = 'WITHIN_GPS_ACCURACY';
        allowed = true;
      } else if (distanceToBoundary <= gpsAccuracy + 50) {
        // Point is close to GPS accuracy boundary - MARGINAL
        accuracyStatus = 'MARGINAL_GPS_ACCURACY';
        allowed = false;
      } else {
        // Point is clearly outside
        accuracyStatus = 'OUTSIDE_BOUNDARY';
        allowed = false;
      }
    } else {
      // No GPS accuracy provided - strict check
      accuracyStatus = 'OUTSIDE_BOUNDARY';
      allowed = false;
    }
  }

  // Calculate accuracy percentage
  let accuracyPercentage = 0;
  if (gpsAccuracy) {
    if (isInside) {
      accuracyPercentage = 100;
    } else if (distanceToBoundary <= gpsAccuracy) {
      accuracyPercentage = Math.round(((gpsAccuracy - distanceToBoundary) / gpsAccuracy) * 100);
    } else {
      accuracyPercentage = 0;
    }
  }

  return {
    allowed,
    isInside,
    userLocation: {
      latitude: lat,
      longitude: lng,
      accuracy: gpsAccuracy
    },
    polygonInfo: {
      totalPoints: polygon.length - 1, // Exclude the closing point
      bounds
    },
    distanceMetrics: {
      distanceToBoundary: Math.round(distanceToBoundary),
      gpsAccuracy: gpsAccuracy ? Math.round(gpsAccuracy) : null,
      accuracyPercentage
    },
    accuracyStatus,
    message: getAccuracyMessage(accuracyStatus, distanceToBoundary, gpsAccuracy),
    detailedInfo: {
      direction: getDirection(lat, lng, bounds),
      recommendation: getRecommendation(accuracyStatus, distanceToBoundary, gpsAccuracy)
    }
  };
};

/**
 * Get human-readable accuracy message
 */
function getAccuracyMessage(status, distance, accuracy) {
  switch (status) {
    case 'INSIDE_BOUNDARY':
      return '✅ You are inside the campus boundary - Access GRANTED';
    case 'WITHIN_GPS_ACCURACY':
      return `✅ You are within GPS accuracy range (${Math.round(distance)}m from boundary) - Access GRANTED`;
    case 'MARGINAL_GPS_ACCURACY':
      return `⚠️ You are near the boundary (${Math.round(distance)}m away) - GPS accuracy uncertain - Access DENIED`;
    case 'OUTSIDE_BOUNDARY':
      return `❌ You are outside the campus boundary (${Math.round(distance)}m away) - Access DENIED`;
    default:
      return '❓ Unable to determine location status';
  }
}

/**
 * Get direction information
 */
function getDirection(lat, lng, bounds) {
  let direction = '';
  
  if (lat < bounds.minLat) direction += 'SOUTH ';
  if (lat > bounds.maxLat) direction += 'NORTH ';
  if (lng < bounds.minLng) direction += 'WEST ';
  if (lng > bounds.maxLng) direction += 'EAST ';
  
  return direction.trim() || 'WITHIN_BOUNDS';
}

/**
 * Get recommendation for user
 */
function getRecommendation(status, distance, accuracy) {
  switch (status) {
    case 'INSIDE_BOUNDARY':
      return 'You can proceed with login and attendance marking';
    case 'WITHIN_GPS_ACCURACY':
      return 'You are at the edge of campus. Move slightly inward for better accuracy';
    case 'MARGINAL_GPS_ACCURACY':
      return 'Move closer to campus center. GPS accuracy is uncertain at boundaries';
    case 'OUTSIDE_BOUNDARY':
      const meters = Math.round(distance);
      return `You are ${meters}m outside campus. Move ${meters}m closer to enter the boundary`;
    default:
      return 'Unable to provide recommendation';
  }
}

/**
 * Clear polygon cache (for testing/admin purposes)
 */
export const clearPolygonCache = () => {
  polygonCache = null;
  polygonCacheTime = 0;
};

/**
 * Get polygon info for debugging
 */
export const getPolygonInfo = async () => {
  const polygon = await getCampusPolygon();
  const bounds = {
    minLat: Math.min(...polygon.map(p => p.lat)),
    maxLat: Math.max(...polygon.map(p => p.lat)),
    minLng: Math.min(...polygon.map(p => p.lng)),
    maxLng: Math.max(...polygon.map(p => p.lng))
  };
  
  return {
    pointCount: polygon.length - 1,
    bounds,
    polygon: polygon.slice(0, -1), // Exclude closing point
    cacheStatus: {
      cached: !!polygonCache,
      cacheAge: polygonCache ? Date.now() - polygonCacheTime : null,
      cacheTTL: POLYGON_CACHE_TTL
    }
  };
};
