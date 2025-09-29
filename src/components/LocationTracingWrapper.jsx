"use client";

import { useState, useEffect } from "react";
import { useAuth } from "./AuthProvider";
import LocationTracing from "./LocationTracing";
import locationService from "../lib/location";

export default function LocationTracingWrapper({ children }) {
  const { token } = useAuth();
  const [locationVerified, setLocationVerified] = useState(false);
  const [locationError, setLocationError] = useState(null);
  const [showLocationTracing, setShowLocationTracing] = useState(false);

  useEffect(() => {
    // Show location tracing for authenticated users only, but skip for desktop users
    if (token) {
      // Check if this is a desktop device - if so, skip location tracing
      if (locationService.isMobileDevice()) {
        setShowLocationTracing(true);
      } else {
        // For desktop users, automatically mark location as verified and skip the popup
        setLocationVerified(true);
        setShowLocationTracing(false);
      }
    } else {
      setShowLocationTracing(false);
    }
  }, [token]);

  const handleLocationVerified = (locationData) => {
    console.log('Location verified:', locationData);
    setLocationVerified(true);
    setLocationError(null);
    // Hide location tracing after a short delay
    setTimeout(() => {
      setShowLocationTracing(false);
    }, 2000);
  };

  const handleLocationError = (error) => {
    console.error('Location error:', error);
    setLocationError(error);
    setLocationVerified(false);
  };

  // Show location tracing interface for authenticated mobile users only
  if (showLocationTracing && token && locationService.isMobileDevice()) {
    return (
      <LocationTracing
        onLocationVerified={handleLocationVerified}
        onLocationError={handleLocationError}
      />
    );
  }

  // Show main content after location verification or for non-authenticated users
  return <>{children}</>;
}
