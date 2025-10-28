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
  
  // Detect if mobile device  
  const isMobile = typeof window !== 'undefined' && /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile|mobile|CriOS/i.test(navigator.userAgent);
  
  // Button should be disabled only if:
  // 1. Loading, OR
  // 2. On mobile AND (location not verified OR status is still checking)
  const isButtonDisabled = loading || (isMobile && geoStatus !== "verified");

  useEffect(() => {
    if (existingRole) router.replace("/");
  }, [existingRole, router]);

  async function onSubmit(e) {
    e.preventDefault();
    setError("");
    
    // For mobile, require location verification
    if (isMobile && (geoStatus !== "verified" || !location)) {
      setError("Location verification required before logging in.");
      return;
    }

    setLoading(true);
    try {
      const { token, user, location_verification } = await loginWithEmailPassword(
        email,
        password,
        location || null // Will be null for desktop, which is fine
      );
      setSession(token, user, location_verification || verification);
      router.replace("/");
    } catch (err) {
      setError(err.message || "Login failed");
      console.error("Login error:", err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-gray-800 rounded-2xl shadow-xl p-8 max-w-md w-full border border-gray-700">
      <div className="w-16 h-16 bg-blue-900/50 rounded-full flex items-center justify-center mx-auto mb-6">
        <span className="text-2xl">🔐</span>
      </div>
      <h2 className="text-2xl font-bold text-gray-100 mb-2 text-center">Welcome to VISTA</h2>
      <p className="text-gray-400 mb-6 text-center">Please sign in to continue</p>
      
      {/* Test Credentials */}
      <div className="bg-gray-700 border border-blue-900/50 rounded-lg p-4 mb-6">
        <h3 className="text-sm font-medium text-blue-300 mb-2">Test Credentials:</h3>
        <p className="text-xs text-blue-400 mb-3">Click on any credential to auto-fill the form</p>
        <div className="space-y-2 text-sm">
          <div 
            className="flex flex-col sm:flex-row sm:justify-between cursor-pointer hover:bg-gray-600 p-3 rounded-lg transition-all duration-200 hover:shadow-sm border border-transparent hover:border-blue-800"
            onClick={() => {
              setEmail("bhuwanesh@jklu.edu.in");
              setPassword("123");
              setError(""); // Clear any previous errors
              setAutoFilled(true);
              setTimeout(() => setAutoFilled(false), 2000); // Hide feedback after 2 seconds
            }}
          >
            <span className="text-blue-400 font-medium mb-1 sm:mb-0">Warden:</span>
            <span className="text-blue-400 break-all">bhuwanesh@jklu.edu.in / 123</span>
          </div>
          <div 
            className="flex flex-col sm:flex-row sm:justify-between cursor-pointer hover:bg-gray-600 p-3 rounded-lg transition-all duration-200 hover:shadow-sm border border-transparent hover:border-blue-800"
            onClick={() => {
              setEmail("devamgupta@jklu.edu.in");
              setPassword("abc");
              setError(""); // Clear any previous errors
              setAutoFilled(true);
              setTimeout(() => setAutoFilled(false), 2000); // Hide feedback after 2 seconds
            }}
          >
            <span className="text-blue-400 font-medium mb-1 sm:mb-0">Student:</span>
            <span className="text-blue-400 break-all">devamgupta@jklu.edu.in / abc</span>
          </div>
        </div>
      </div>
      
      {/* Auto-fill feedback */}
      {autoFilled && (
        <div className="bg-green-900/50 border border-green-700 rounded-lg p-3 mb-4">
          <div className="flex items-center gap-2 text-green-300">
            <span className="text-sm">✅</span>
            <span className="text-sm font-medium">Form auto-filled! You can now click "Sign in"</span>
          </div>
        </div>
      )}
      
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
          <input 
            type="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            className="w-full px-4 py-3 rounded-lg border border-gray-600 bg-gray-700 text-gray-100 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none"
            placeholder="Enter your email"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Password</label>
          <input 
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            className="w-full px-4 py-3 rounded-lg border border-gray-600 bg-gray-700 text-gray-100 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none"
            placeholder="Enter your password"
            required
          />
        </div>
        
        {(error || geoError) && (
          <div className="bg-red-900/50 border border-red-700 rounded-lg p-3">
            <div className="flex">
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-300">Login Failed</h3>
                <div className="mt-2 text-sm text-red-400">
                  <p>{error || geoError}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {geoStatus === "checking" && (
          <div className="bg-blue-900/50 border border-blue-700 rounded-lg p-3 text-sm text-blue-300">
            Verifying your location. Please wait...
          </div>
        )}

        {geoStatus === "outside" && (
          <div className="bg-yellow-900/50 border border-yellow-700 rounded-lg p-3 text-sm text-yellow-300">
            You are currently outside the campus boundary. Move within the campus and try again.
          </div>
        )}

        {geoStatus === "permission_denied" && (
          <div className="bg-red-900/50 border border-red-700 rounded-lg p-3 text-sm text-red-300">
            Location permission is required. Please enable it in your browser and retry.
          </div>
        )}

        {isMobile && (
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => checkLocation()}
              className="text-sm text-blue-400 hover:text-blue-300"
            >
              Re-check location
            </button>
            {location && (
              <span className="text-xs text-gray-500">
                Accuracy: {Math.round(location.accuracy)}m
              </span>
            )}
          </div>
        )}

        <button 
          disabled={isButtonDisabled}
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed shadow-sm hover:shadow-md"
        >
          {loading ? "Signing in..." : isButtonDisabled && !loading && isMobile ? "Verify location" : "Sign in"}
        </button>
      </form>
    </div>
  );
}
