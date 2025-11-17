/**
 * Calculate distance between two points in meters using Haversine formula
 * @param {number} lat1 - Latitude of first point
 * @param {number} lng1 - Longitude of first point
 * @param {number} lat2 - Latitude of second point
 * @param {number} lng2 - Longitude of second point
 * @returns {number} Distance in meters
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
 * @param {number} lat - Latitude of the point
 * @param {number} lng - Longitude of the point
 * @param {Array} polygon - Array of {lat, lng} objects forming the polygon
 * @returns {number} Minimum distance to boundary in meters (negative if inside)
 */
function distanceToPolygon(lat, lng, polygon) {
  let minDistance = Infinity;
  
  // Check distance to each edge of the polygon
  for (let i = 0; i < polygon.length - 1; i++) {
    const p1 = polygon[i];
    const p2 = polygon[i + 1];
    
    // Calculate distance from point to line segment
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
 * Ray-casting algorithm to check if a point is inside a polygon
 * @param {number} lat - Latitude of the point
 * @param {number} lng - Longitude of the point
 * @param {Array} polygon - Array of {lat, lng} objects forming the polygon
 * @returns {boolean} - True if point is inside polygon
 */
export function isPointInPolygon(lat, lng, polygon) {
  let inside = false;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const xi = polygon[i].lng, yi = polygon[i].lat;
    const xj = polygon[j].lng, yj = polygon[j].lat;
    
    const intersect = ((yi > lat) !== (yj > lat))
        && (lng < (xj - xi) * (lat - yi) / (yj - yi) + xi);
    if (intersect) inside = !inside;
  }
  return inside;
}

/**
 * Check if point is inside polygon with GPS accuracy tolerance
 * @param {number} lat - Latitude of the point
 * @param {number} lng - Longitude of the point
 * @param {Array} polygon - Array of {lat, lng} objects forming the polygon
 * @param {number} accuracy - GPS accuracy in meters (optional)
 * @returns {Object} - { inside: boolean, distanceToBoundary: number }
 */
export function checkPointWithTolerance(lat, lng, polygon, accuracy = null) {
  const inside = isPointInPolygon(lat, lng, polygon);
  
  if (inside) {
    return { inside: true, distanceToBoundary: 0 };
  }
  
  // Calculate distance to boundary
  const distance = distanceToPolygon(lat, lng, polygon);
  
  // If GPS accuracy is provided and point is within accuracy radius of boundary, allow it
  // This handles laptop GPS inaccuracy
  if (accuracy && accuracy > 50 && distance <= accuracy) {
    return { inside: true, distanceToBoundary: distance };
  }
  
  return { inside: false, distanceToBoundary: distance };
}
