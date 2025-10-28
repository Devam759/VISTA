"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";

import { getGeofencingBoundaries, verifyLocation } from "../lib/api";
import locationService from "../lib/location";

const GeoFenceContext = createContext({
  status: "idle",
  location: null,
  verification: null,
  error: null,
  boundaries: null,
  lastUpdated: null,
  checkLocation: async () => ({ success: false }),
});

export function GeoFenceProvider({ children }) {
  const [status, setStatus] = useState("idle");
  const [location, setLocation] = useState(null);
  const [verification, setVerification] = useState(null);
  const [error, setError] = useState(null);
  const [boundaries, setBoundaries] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const hasCheckedLocation = useRef(false);

  const checkLocation = useCallback(async () => {
    // Skip location check for desktop devices
    const isMobile = locationService.isMobileDevice();
    if (!isMobile) {
      setStatus("verified");
      setError(null);
      setLocation(null);
      setVerification(null);
      return { success: true, location: null, verification: null, desktop: true };
    }

    setStatus("checking");
    setError(null);

    try {
      const permission = await locationService.checkPermissions();
      if (!permission.available) {
        setStatus("permission_denied");
        setError(permission.reason || "Location permission is required");
        setLocation(null);
        setVerification(null);
        return { success: false, error: permission.reason };
      }

      const position = await locationService.getCurrentPositionWithRetry();
      setLocation(position);

      if (!boundaries) {
        try {
          const boundaryResponse = await getGeofencingBoundaries();
          if (boundaryResponse?.boundaries) {
            setBoundaries(boundaryResponse.boundaries);
          }
        } catch (boundaryError) {
          console.warn("Failed to fetch geofence boundaries", boundaryError);
        }
      }

      const verificationResponse = await verifyLocation(
        position.latitude,
        position.longitude,
        position.accuracy
      );

      const verificationResult =
        verificationResponse?.verification ?? verificationResponse ?? null;
      const success =
        verificationResponse?.success ?? verificationResult?.gps_verified ?? false;

      setVerification(verificationResult);

      if (success) {
        setStatus("verified");
        setError(null);
        setLastUpdated(Date.now());
        return { success: true, location: position, verification: verificationResult };
      }

      const reason =
        verificationResult?.reason || "You appear to be outside the campus boundary.";
      setStatus("outside");
      setError(reason);
      setLastUpdated(Date.now());
      return {
        success: false,
        location: position,
        verification: verificationResult,
        error: reason,
      };
    } catch (err) {
      console.error("Location check failed", err);
      const message = err?.message || "Location check failed";
      setStatus("error");
      setError(message);
      setLocation(null);
      setVerification(null);
      return { success: false, error: message };
    }
  }, [boundaries]);

  useEffect(() => {
    // Only run once on mount
    if (hasCheckedLocation.current) return;
    hasCheckedLocation.current = true;
    
    // Only auto-check location on mobile devices
    const isMobile = locationService.isMobileDevice();
    if (!isMobile) {
      // For desktop, set status to verified without location
      setStatus("verified");
      return;
    }
    
    // For mobile, check location (use setTimeout to ensure checkLocation is ready)
    setTimeout(() => {
      checkLocation();
    }, 0);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const value = useMemo(
    () => ({
      status,
      location,
      verification,
      error,
      boundaries,
      lastUpdated,
      checkLocation,
    }),
    [status, location, verification, error, boundaries, lastUpdated, checkLocation]
  );

  return <GeoFenceContext.Provider value={value}>{children}</GeoFenceContext.Provider>;
}

export function useGeoFence() {
  return useContext(GeoFenceContext);
}
