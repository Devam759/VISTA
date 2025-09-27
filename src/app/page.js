"use client";

import { useState, useEffect } from "react";
import Protected from "../components/Protected";
import DashboardSwitch from "../components/DashboardSwitch";
import LocationTracing from "../components/LocationTracing";
import { useAuth } from "../components/AuthProvider";
import { loginWithEmailPassword } from "../lib/api";

export default function Home() {
  const { token, setSession, role } = useAuth();
  const [currentStep, setCurrentStep] = useState('location'); // 'location', 'login', 'dashboard'
  const [locationVerified, setLocationVerified] = useState(false);
  const [locationError, setLocationError] = useState(null);
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [loginError, setLoginError] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);

  useEffect(() => {
    // If user is already authenticated, go directly to dashboard
    if (token && role) {
      setCurrentStep('dashboard');
    } else {
      // Start with location tracing
      setCurrentStep('location');
    }
  }, [token, role]);

  const handleLocationVerified = (locationData) => {
    console.log('Location verified:', locationData);
    setLocationVerified(true);
    setLocationError(null);
    // Show login page after location verification
    console.log('Moving to login step...');
    setTimeout(() => {
      setCurrentStep('login');
      console.log('Login page should now be visible');
    }, 2000);
  };

  const handleLocationError = (error) => {
    console.error('Location error:', error);
    setLocationError(error);
    setLocationVerified(false);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError("");
    setLoginLoading(true);
    
    try {
      const { token: newToken, user } = await loginWithEmailPassword(loginData.email, loginData.password);
      setSession(newToken, user);
      setCurrentStep('dashboard');
    } catch (err) {
      // Fallback sample credentials for Student role
      if (loginData.email === "devamgupta@jklu.edu.in" && loginData.password === "abc") {
        setSession("mock-token", { id: 1, email: loginData.email, role: "Student" });
        setCurrentStep('dashboard');
      } else {
        setLoginError(err.message || "Login failed");
      }
    } finally {
      setLoginLoading(false);
    }
  };

  // Show location tracing interface first
  if (currentStep === 'location') {
    return (
      <LocationTracing
        onLocationVerified={handleLocationVerified}
        onLocationError={handleLocationError}
      />
    );
  }

  // Show login page after location verification
  console.log('Current step:', currentStep);
  
  if (currentStep === 'login') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-2xl">🔐</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2 text-center">Welcome to VISTA</h2>
          <p className="text-gray-600 mb-6 text-center">Please sign in to continue</p>
          
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <input 
                type="email" 
                value={loginData.email} 
                onChange={(e) => setLoginData({...loginData, email: e.target.value})} 
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter your email"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
              <input 
                type="password" 
                value={loginData.password} 
                onChange={(e) => setLoginData({...loginData, password: e.target.value})} 
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter your password"
                required
              />
            </div>
            
            {loginError && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-sm text-red-600">{loginError}</p>
              </div>
            )}
            
            <button 
              type="submit"
              disabled={loginLoading} 
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loginLoading ? "Signing in..." : "Sign In"}
            </button>
          </form>
          
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">
              Demo credentials: devamgupta@jklu.edu.in / abc
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Show main dashboard after authentication
  if (currentStep === 'dashboard' || (token && role)) {
    return (
      <Protected>
        <DashboardSwitch />
      </Protected>
    );
  }

  return null;
}
