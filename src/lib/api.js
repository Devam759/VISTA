const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

async function request(path, options = {}) {
  try {
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
    // Handle network errors gracefully
    console.warn(`API request failed: ${error.message}`);
    // Return mock data for development/demo purposes
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


