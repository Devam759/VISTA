"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "./AuthProvider";
import LocationTracing from "./LocationTracing";
import locationService from "../lib/location";

export default function LocationTracingWrapper({ children }) {
  const { token } = useAuth();
  const router = useRouter();
  const [locationVerified, setLocationVerified] = useState(false);
  const [locationError, setLocationError] = useState(null);
  const [showLocationTracing, setShowLocationTracing] = useState(false);

  useEffect(() => {
    // Always show location tracing for mobile devices on every visit (regardless of authentication)
    if (locationService.isMobileDevice()) {
      setShowLocationTracing(true);
    } else {
      // For desktop users, automatically mark location as verified and skip the popup
      setLocationVerified(true);
      setShowLocationTracing(false);
    }
  }, []);

  const handleLocationVerified = (locationData) => {
    console.log('Location verified:', locationData);
    setLocationVerified(true);
    setLocationError(null);
    
    // Hide location tracing after a short delay and redirect based on authentication status
    setTimeout(() => {
      setShowLocationTracing(false);
      // Redirect based on authentication status
      if (token) {
        // User is authenticated, redirect to main app
        router.push('/');
      } else {
        // User is not authenticated, redirect to login
        router.push('/login');
      }
    }, 2000);
  };

  const handleLocationError = (error) => {
    console.error('Location error:', error);
    setLocationError(error);
    setLocationVerified(false);
  };

  // Show location tracing interface for mobile users when checking location
  if (showLocationTracing && locationService.isMobileDevice() && !locationVerified) {
    return (
      <LocationTracing
        onLocationVerified={handleLocationVerified}
        onLocationError={handleLocationError}
      />
    );
  }

  // Show main content after location verification or for desktop users
  return <>{children}</>;
}
