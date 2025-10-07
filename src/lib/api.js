const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000/api/v1";

export async function request(path, options = {}) {
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
}

export async function loginWithEmailPassword(email, password, location) {
  return request("/auth/login", {
    body: {
      email,
      password,
      latitude: location?.latitude,
      longitude: location?.longitude,
      accuracy: location?.accuracy,
    },
  });
}

export async function getMe(token) {
  return request("/auth/me", { method: "GET", token });
}

export async function getStudents(token, hostel = "All Hostels") {
  const url = hostel === "All Hostels" ? "/students" : `/students?hostel=${hostel}`;
  return request(url, { method: "GET", token });
}

export async function getGeofencingBoundaries() {
  return request("/geofencing/boundaries", { method: "GET" });
}

export async function verifyLocation(latitude, longitude, accuracy) {
  return request("/geofencing/verify", {
    method: "POST",
    body: { latitude, longitude, accuracy },
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

export async function enrollFace(token, payload) {
  return request("/face/enroll", {
    method: "POST",
    token,
    body: payload,
  });
}

export async function verifyFace(token, payload) {
  return request("/face/verify", {
    method: "POST",
    token,
    body: payload,
  });
}


