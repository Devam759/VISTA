const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

// Check if we're in production and backend is not available
const isProduction = process.env.NODE_ENV === 'production';
const isBackendAvailable = process.env.NEXT_PUBLIC_BACKEND_AVAILABLE === 'true';

// Campus boundary configuration (corrected center and radius)
const CAMPUS_BOUNDARY = {
  center: { latitude: 26.8351, longitude: 75.6508 }, // Calculated from actual coordinates
  radius: 800, // meters - covers the main campus area
  polygon: [
    [26.836760, 75.651187], [26.837109, 75.649523], [26.836655, 75.648472], 
    [26.836079, 75.648307], [26.835495, 75.650194], [26.834788, 75.650150], 
    [26.834635, 75.650973], [26.833430, 75.651435], [26.832659, 75.652500], 
    [26.833776, 75.653021], [26.834072, 75.652374], [26.834935, 75.652472], 
    [26.835321, 75.651554], [26.835838, 75.651320]
    // Removed outlier coordinate (26.896678, 75.649331) which was 6.4km away
  ]
};

// Calculate distance between two points using Haversine formula
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371000; // Earth's radius in meters
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

// Check if point is inside polygon using ray casting algorithm
function isPointInPolygon(point, polygon) {
  const x = point[0], y = point[1];
  let inside = false;
  
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const xi = polygon[i][0], yi = polygon[i][1];
    const xj = polygon[j][0], yj = polygon[j][1];
    
    if (((yi > y) !== (yj > y)) && (x < (xj - xi) * (y - yi) / (yj - yi) + xi)) {
      inside = !inside;
    }
  }
  
  return inside;
}

// Check if location is within campus boundary (polygon only)
function checkLocationInCampus(latitude, longitude, accuracy) {
  try {
    // Check if coordinates are valid
    if (!(-90 <= latitude && latitude <= 90) || !(-180 <= longitude && longitude <= 180)) {
      return {
        valid: false,
        reason: 'Invalid GPS coordinates',
        distance: null
      };
    }
    
    // Check accuracy if provided (relaxed requirement)
    if (accuracy && accuracy > 500) {
      return {
        valid: false,
        reason: `GPS accuracy too low: ${accuracy}m (required: <500m)`,
        distance: null
      };
    }
    
    // Calculate distance from campus center for information
    const distanceFromCenter = calculateDistance(
      latitude, longitude,
      CAMPUS_BOUNDARY.center.latitude, CAMPUS_BOUNDARY.center.longitude
    );
    
    // Only check if within campus polygon boundary (no radius check)
    if (isPointInPolygon([longitude, latitude], CAMPUS_BOUNDARY.polygon)) {
      return {
        valid: true,
        reason: 'Location verified within campus boundary',
        distance: distanceFromCenter
      };
    }
    
    return {
      valid: false,
      reason: `Location outside campus boundary: ${distanceFromCenter.toFixed(1)}m from center`,
      distance: distanceFromCenter
    };
    
  } catch (error) {
    return {
      valid: false,
      reason: `Location verification error: ${error.message}`,
      distance: null
    };
  }
}

// Fallback request handler for when backend is not available
async function handleFallbackRequest(path, options = {}) {
  console.log(`Using fallback for ${path} in production`);

  switch (path) {
    case "/auth/me":
      return { user: { id: 1, email: "bhuwanesh@jklu.edu.in", role: "Warden" } };

    case "/geofencing/boundaries":
      return {
        center: { latitude: 26.2389, longitude: 73.0243 },
        radius: 1000,
        polygon: [
          [26.836760, 75.651187], [26.837109, 75.649523], [26.896678, 75.649331],
          [26.836655, 75.648472], [26.836079, 75.648307], [26.835495, 75.650194],
          [26.834788, 75.650150], [26.834635, 75.650973], [26.833430, 75.651435],
          [26.832659, 75.652500], [26.833776, 75.653021], [26.834072, 75.652374],
          [26.834935, 75.652472], [26.835321, 75.651554], [26.835838, 75.651320]
        ]
      };

    case "/geofencing/verify":
      let body = {};
      try {
        body = options.body ? (typeof options.body === 'string' ? JSON.parse(options.body) : options.body) : {};
      } catch (e) {
        console.warn('Failed to parse request body:', e);
      }

      if (body.latitude && body.longitude) {
        // Implement proper geofencing logic in fallback mode
        const isWithinCampus = checkLocationInCampus(body.latitude, body.longitude, body.accuracy);
        
        if (isWithinCampus.valid) {
          return {
            gps_verified: true,
            reason: "Location verified within campus boundary (fallback mode)",
            distance: isWithinCampus.distance,
            campus: "Campus",
            accuracy: body.accuracy || 10
          };
        } else {
          return {
            gps_verified: false,
            reason: isWithinCampus.reason,
            distance: isWithinCampus.distance,
            campus: null
          };
        }
      }
      return {
        gps_verified: false,
        reason: "No location data provided",
        distance: null,
        campus: null
      };

    case "/students":
      return { students: [] };

    case "/attendance":
      return { attendance: [] };

    default:
      return { message: "Backend not available in production mode" };
  }
}

async function request(path, options = {}) {
  try {
    // If in production and backend is not available, use fallback
    if (isProduction && !isBackendAvailable) {
      return await handleFallbackRequest(path, options);
    }

    const url = `${BASE_URL}${path}`;
    const res = await fetch(url, {
      method: options.method || "POST",
      headers: {
        "Content-Type": "application/json",
        ...(options.token ? { Authorization: `Bearer ${options.token}` } : {}),
        ...(options.headers || {}),
      },
      body: options.body ? JSON.stringify(options.body) : undefined,
      cache: "no-store",
    });
    const text = await res.text();
    let data;
    try { data = text ? JSON.parse(text) : {}; } catch { data = { message: text }; }
    if (!res.ok) {
      const message = data?.message || `Request failed (${res.status})`;
      throw new Error(message);
    }
    return data;
  } catch (error) {
    console.warn(`API request failed: ${error.message}`);
    
    // If in production and backend is not available, use fallback
    if (isProduction && !isBackendAvailable) {
      return await handleFallbackRequest(path, options);
    }
    
    // For development, return mock data
    if (path === "/auth/me") {
      return { user: { id: 1, email: "bhuwanesh@jklu.edu.in", role: "Warden" } };
    }
    throw error;
  }
}

export async function loginWithEmailPassword(email, password) {
  // Use mock login endpoint for development
  try {
    return await request("/auth/mock-login", { body: { email, password } });
  } catch (error) {
    // Fallback to original mock for development
    if (email === "bhuwanesh@jklu.edu.in" && password === "123") {
      return { 
        token: "mock-token", 
        user: { id: 1, email: "bhuwanesh@jklu.edu.in", role: "Warden" } 
      };
    }
    if (email === "devamgupta@jklu.edu.in" && password === "abc") {
      return { 
        token: "mock-token", 
        user: { id: 2, email: "devamgupta@jklu.edu.in", role: "Student" } 
      };
    }
    throw error;
  }
}

export async function getMe(token) {
  return request("/auth/me", { method: "GET", token });
}

export async function getStudents(token, hostel = "All Hostels") {
  const url = hostel === "All Hostels" ? "/students" : `/students?hostel=${hostel}`;
  return request(url, { method: "GET", token });
}

// Geofencing API functions
export async function getGeofencingBoundaries(token) {
  return request("/geofencing/boundaries", { method: "GET", token });
}

export async function verifyLocation(token, latitude, longitude, accuracy) {
  return request("/geofencing/verify", {
    method: "POST",
    token,
    body: { latitude, longitude, accuracy }
  });
}

export async function markAttendance(token, attendanceData) {
  return request("/attendance/mark", {
    method: "POST",
    token,
    body: attendanceData
  });
}

export async function getAttendance(token, dateFilter = "", statusFilter = "All") {
  const url = `/attendance?${dateFilter ? `date=${dateFilter}` : ''}${statusFilter !== 'All' ? `&status=${statusFilter}` : ''}`;
  return request(url, { method: "GET", token });
}


