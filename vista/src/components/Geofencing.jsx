"use client";

import { useState, useEffect, useCallback } from "react";
import locationService from "../lib/location";
import { useAuth } from "./AuthProvider";

export default function Geofencing({ onLocationUpdate, onLocationError, children }) {
  const [location, setLocation] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isWithinBoundaries, setIsWithinBoundaries] = useState(false);
  const [boundaries, setBoundaries] = useState(null);
  const { token } = useAuth();

  // Get geofencing boundaries from backend
  const fetchBoundaries = useCallback(async () => {
    try {
      const response = await fetch('/api/geofencing/boundaries', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setBoundaries(data.boundaries);
      }
    } catch (err) {
      console.error('Failed to fetch boundaries:', err);
    }
  }, [token]);

  // Verify location with backend
  const verifyLocation = useCallback(async (position) => {
    if (!token) return;

    try {
      const response = await fetch('/api/geofencing/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          latitude: position.latitude,
          longitude: position.longitude,
          accuracy: position.accuracy
        })
      });

      if (response.ok) {
        const result = await response.json();
        setIsWithinBoundaries(result.gps_verified);
        
        if (onLocationUpdate) {
          onLocationUpdate({
            ...position,
            verified: result.gps_verified,
            reason: result.reason,
            distance: result.distance,
            hostel: result.hostel
          });
        }
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Location verification failed');
        setIsWithinBoundaries(false);
      }
    } catch (err) {
      console.error('Location verification error:', err);
      setError('Failed to verify location');
      setIsWithinBoundaries(false);
    }
  }, [token, onLocationUpdate]);

  // Get current location
  const getCurrentLocation = useCallback(async () => {
    if (!locationService.isSupported()) {
      setError('Geolocation is not supported by this browser');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const position = await locationService.getCurrentPosition();
      setLocation(position);
      
      // Verify location if we have a token
      if (token) {
        await verifyLocation(position);
      }
    } catch (err) {
      setError(err.message || 'Failed to get location');
      if (onLocationError) {
        onLocationError(err);
      }
    } finally {
      setIsLoading(false);
    }
  }, [token, verifyLocation, onLocationError]);

  // Start watching location
  const startWatching = useCallback(() => {
    if (!locationService.isSupported()) {
      setError('Geolocation is not supported by this browser');
      return;
    }

    locationService.startWatching(async (position, error) => {
      if (error) {
        setError(error.message);
        if (onLocationError) {
          onLocationError(error);
        }
        return;
      }

      setLocation(position);
      
      if (token) {
        await verifyLocation(position);
      }
    });
  }, [token, verifyLocation, onLocationError]);

  // Stop watching location
  const stopWatching = useCallback(() => {
    locationService.stopWatching();
  }, []);

  // Initialize boundaries on mount
  useEffect(() => {
    if (token) {
      fetchBoundaries();
    }
  }, [token, fetchBoundaries]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopWatching();
    };
  }, [stopWatching]);

  return (
    <div className="geofencing-container">
      {children}
      
      {/* Location Status */}
      <div className="location-status">
        {isLoading && (
          <div className="flex items-center gap-2 text-blue-600">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
            <span className="text-sm">Getting location...</span>
          </div>
        )}
        
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <div className="flex items-center gap-2">
              <span className="text-red-600">⚠️</span>
              <div>
                <p className="text-sm font-medium text-red-800">Location Error</p>
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}
        
        {location && (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-800">Location Status</p>
                <p className="text-xs text-gray-600">
                  Accuracy: {location.accuracy?.toFixed(0)}m
                </p>
              </div>
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${
                  isWithinBoundaries ? 'bg-green-500' : 'bg-red-500'
                }`}></div>
                <span className="text-sm font-medium">
                  {isWithinBoundaries ? 'Within Boundaries' : 'Outside Boundaries'}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Hook for using geofencing
export function useGeofencing() {
  const [location, setLocation] = useState(null);
  const [isWithinBoundaries, setIsWithinBoundaries] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const getLocation = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const position = await locationService.getCurrentPosition();
      setLocation(position);
      return position;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const startWatching = useCallback(() => {
    locationService.startWatching((position, error) => {
      if (error) {
        setError(error.message);
        return;
      }
      setLocation(position);
    });
  }, []);

  const stopWatching = useCallback(() => {
    locationService.stopWatching();
  }, []);

  return {
    location,
    isWithinBoundaries,
    isLoading,
    error,
    getLocation,
    startWatching,
    stopWatching,
    isSupported: locationService.isSupported()
  };
}
