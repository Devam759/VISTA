"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../components/AuthProvider";
import { useGeoFence } from "../../components/GeoFenceProvider";
import { loginWithEmailPassword } from "../../lib/api";
import { clearAuthenticationData } from "../../utils/clearAuth";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const { setSession, role: existingRole, clearAuth } = useAuth();
  const { status: geoStatus, location, verification, error: geoError, checkLocation } = useGeoFence();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [autoFilled, setAutoFilled] = useState(false);

  useEffect(() => {
    if (existingRole) router.replace("/");
  }, [existingRole, router]);

  async function onSubmit(e) {
    e.preventDefault();
    setError("");
    if (geoStatus !== "verified" || !location) {
      setError("Location verification required before logging in.");
      return;
    }

    setLoading(true);
    try {
      const { token, user, location_verification } = await loginWithEmailPassword(
        email,
        password,
        location
      );
      setSession(token, user, location_verification || verification);
      router.replace("/");
    } catch (err) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full border border-gray-200">
      <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <span className="text-2xl">🔐</span>
      </div>
      <h2 className="text-2xl font-bold text-gray-900 mb-2 text-center">Welcome to VISTA</h2>
      <p className="text-gray-600 mb-6 text-center">Please sign in to continue</p>
      
      {/* Development: Clear Auth Button */}
      {process.env.NODE_ENV === 'development' && (
        <div className="mb-4">
          <button
            onClick={() => {
              clearAuth();
              clearAuthenticationData();
              window.location.reload();
            }}
            className="w-full bg-red-100 hover:bg-red-200 text-red-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            🗑️ Clear Authentication Data (Dev)
          </button>
        </div>
      )}
      
      {/* Test Credentials */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <h3 className="text-sm font-medium text-blue-800 mb-2">Test Credentials:</h3>
        <p className="text-xs text-blue-600 mb-3">Click on any credential to auto-fill the form</p>
        <div className="space-y-2 text-sm">
          <div 
            className="flex justify-between cursor-pointer hover:bg-blue-100 p-3 rounded-lg transition-all duration-200 hover:shadow-sm border border-transparent hover:border-blue-300"
            onClick={() => {
              setEmail("bhuwanesh@jklu.edu.in");
              setPassword("123");
              setError(""); // Clear any previous errors
              setAutoFilled(true);
              setTimeout(() => setAutoFilled(false), 2000); // Hide feedback after 2 seconds
            }}
          >
            <span className="text-blue-700 font-medium">Warden:</span>
            <span className="text-blue-600">bhuwanesh@jklu.edu.in / 123</span>
          </div>
          <div 
            className="flex justify-between cursor-pointer hover:bg-blue-100 p-3 rounded-lg transition-all duration-200 hover:shadow-sm border border-transparent hover:border-blue-300"
            onClick={() => {
              setEmail("devamgupta@jklu.edu.in");
              setPassword("abc");
              setError(""); // Clear any previous errors
              setAutoFilled(true);
              setTimeout(() => setAutoFilled(false), 2000); // Hide feedback after 2 seconds
            }}
          >
            <span className="text-blue-700 font-medium">Student:</span>
            <span className="text-blue-600">devamgupta@jklu.edu.in / abc</span>
          </div>
        </div>
      </div>
      
      {/* Auto-fill feedback */}
      {autoFilled && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
          <div className="flex items-center gap-2 text-green-700">
            <span className="text-sm">✅</span>
            <span className="text-sm font-medium">Form auto-filled! You can now click "Sign in"</span>
          </div>
        </div>
      )}
      
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
          <input 
            type="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none"
            placeholder="Enter your email"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
          <input 
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            placeholder="Enter your password"
            required
          />
        </div>
        
        {(error || geoError) && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <div className="flex">
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Login Failed</h3>
                <div className="mt-2 text-sm text-red-700">
                  <p>{error || geoError}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {geoStatus === "checking" && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-blue-800">
            Verifying your location. Please wait...
          </div>
        )}

        {geoStatus === "outside" && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-sm text-yellow-800">
            You are currently outside the campus boundary. Move within the campus and try again.
          </div>
        )}

        {geoStatus === "permission_denied" && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-800">
            Location permission is required. Please enable it in your browser and retry.
          </div>
        )}

        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => checkLocation()}
            className="text-sm text-blue-600 hover:text-blue-800"
          >
            Re-check location
          </button>
          {location && (
            <span className="text-xs text-gray-500">
              Accuracy: {Math.round(location.accuracy)}m
            </span>
          )}
        </div>

        <button 
          disabled={loading || geoStatus !== "verified"}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed shadow-sm hover:shadow-md"
        >
          {loading ? "Signing in..." : geoStatus !== "verified" ? "Verify location" : "Sign in"}
        </button>
      </form>
    </div>
  );
}
