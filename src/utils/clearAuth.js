// Utility function to clear authentication data
export function clearAuthenticationData() {
  if (typeof window !== "undefined") {
    window.localStorage.removeItem("vista_token");
    window.localStorage.removeItem("vista_user");
    window.localStorage.removeItem("vista_role");
    console.log("Authentication data cleared");
  }
}

// Function to check if user is authenticated
export function isAuthenticated() {
  if (typeof window === "undefined") return false;
  
  const token = window.localStorage.getItem("vista_token");
  const role = window.localStorage.getItem("vista_role");
  const user = window.localStorage.getItem("vista_user");
  
  return !!(token && role && user);
}
