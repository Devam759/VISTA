/**
 * Geofencing utility to check if a point is within a polygon.
 */

// Campus boundary coordinates in decimal degrees.
// These coordinates should define the vertices of the campus polygon in order.
const campusPolygon = [
  { lat: 26.837722, lng: 75.649694 }, // 26°50'15.8"N 75°38'58.9"E
  { lat: 26.836222, lng: 75.649167 }, // 26°50'10.4"N 75°38'57.0"E
  { lat: 26.835500, lng: 75.649778 }, // 26°50'07.8"N 75°38'59.2"E
  { lat: 26.832694, lng: 75.652722 }, // 26°49'57.7"N 75°39'09.8"E
  { lat: 26.835000, lng: 75.652417 }, // 26°50'06.0"N 75°39'08.7"E
];

/**
 * Checks if a given point (latitude, longitude) is inside the campus polygon.
 * Uses the Ray Casting algorithm.
 * @param {number} latitude The latitude of the point to check.
 * @param {number} longitude The longitude of the point to check.
 * @returns {boolean} True if the point is inside the polygon, false otherwise.
 */
export function isWithinCampus(latitude, longitude) {
  let isInside = false;
  const polygon = campusPolygon;
  const x = latitude;
  const y = longitude;

  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const xi = polygon[i].lat;
    const yi = polygon[i].lng;
    const xj = polygon[j].lat;
    const yj = polygon[j].lng;

    const intersect =
      yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi;

    if (intersect) {
      isInside = !isInside;
    }
  }

  return isInside;
}

/**
 * Verifies the location against the campus geofence.
 * @param {number} latitude
 * @param {number} longitude
 * @returns {{gps_verified: boolean, reason: string}}
 */
export function verifyGeofence(latitude, longitude) {
  if (isWithinCampus(latitude, longitude)) {
    return {
      gps_verified: true,
      reason: "You are within the campus boundary.",
    };
  } else {
    return {
      gps_verified: false,
      reason: "You are outside the campus boundary.",
    };
  }
}