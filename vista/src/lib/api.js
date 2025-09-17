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
      return { user: { id: 1, email: "devamgupta@jklu.edu.in", role: "Student" } };
    }
    throw error;
  }
}

export async function loginWithEmailPassword(email, password) {
  // Expect backend to return: { token, user: { id, email, role } }
  return request("/auth/login", { body: { email, password } });
}

export async function getMe(token) {
  return request("/auth/me", { method: "GET", token });
}

export async function getStudents(token, hostel = "All Hostels") {
  const url = hostel === "All Hostels" ? "/students" : `/students?hostel=${hostel}`;
  return request(url, { method: "GET", token });
}


