"use client";

import { useState, useEffect, useRef } from "react";
import locationService from "../lib/location";
import { verifyGeofence } from "./geofence"; // Import our new geofence utility
import LocationPermissionGuide from "./LocationPermissionGuide";

export default function LocationTracing({ onLocationVerified, onLocationError }) {
  const [location, setLocation] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [verificationStatus, setVerificationStatus] = useState(null);
  const [retryCount, setRetryCount] = useState(0);
  const [maxRetries] = useState(3);
  const [showPermissionGuide, setShowPermissionGuide] = useState(false);
  const [debugInfo, setDebugInfo] = useState({});
  const callbackCalledRef = useRef(false);

  useEffect(() => {
    const getLocationAndVerify = async () => {
      setIsLoading(true);
      setError(null);
      setVerificationStatus(null);
      
      // Collect debug information
      const debug = {
        userAgent: navigator.userAgent,
        isMobile: locationService.isMobileDevice(),
        geolocationSupported: !!navigator.geolocation,
        permissionsAPI: !!navigator.permissions,
        protocol: window.location.protocol,
        host: window.location.host
      };
      setDebugInfo(debug);
      console.log('Location debugging info:', debug);

      try {
        // Check permissions first
        const permissionCheck = await locationService.checkPermissions();
        console.log('Permission check result:', permissionCheck);
        
        if (!permissionCheck.available) {
          throw new Error(permissionCheck.reason);
        }

        // Get current location with retry
        const position = await locationService.getCurrentPositionWithRetry();
        setLocation(position);

        // For desktop users, skip geofencing verification
        if (position.isDesktop) {
          setVerificationStatus({
            gps_verified: true,
            reason: 'Desktop access granted (geofencing bypassed)'
          });
          return;
        }

        // Verify location with client-side geofencing for mobile users
        const verificationResult = verifyGeofence(
          position.latitude,
          position.longitude
        );
        
        setVerificationStatus(verificationResult);

      } catch (locationError) {
        console.error('Location error:', locationError);
        setError(locationError.message);
        onLocationError(locationError.message);
        
        // Show permission guide for permission-related errors
        if (locationError.message.includes('permission') || locationError.message.includes('denied')) {
          setShowPermissionGuide(true);
        }
      } finally {
        setIsLoading(false);
      }
    };

    getLocationAndVerify();
  }, [onLocationVerified, onLocationError]);

  // Handle location verification callback
  useEffect(() => {
    console.log('Verification status changed:', verificationStatus);
    if (verificationStatus && verificationStatus.gps_verified && onLocationVerified && !callbackCalledRef.current) {
      console.log('Calling onLocationVerified callback');
      callbackCalledRef.current = true;
      onLocationVerified({
        ...location,
        verified: true,
        reason: verificationStatus.reason
      });
    } else if (verificationStatus && !verificationStatus.gps_verified) {
      console.log('Location verification failed:', verificationStatus.reason);
    }
  }, [verificationStatus, location, onLocationVerified]);

  const handleRetry = () => {
    if (retryCount < maxRetries) {
      setRetryCount(prev => prev + 1);
      setError(null);
      setVerificationStatus(null);
      
      // Retry location detection
      setTimeout(() => {
        const getLocationAndVerify = async () => {
          setIsLoading(true);
          try {
            // Check permissions first
            const permissionCheck = await locationService.checkPermissions();
            if (!permissionCheck.available) {
              throw new Error(permissionCheck.reason);
            }

            // Get current location with retry
            const position = await locationService.getCurrentPositionWithRetry();
            setLocation(position);

            // For desktop users, skip geofencing verification
            if (position.isDesktop) {
              onLocationVerified({
                ...position,
                verified: true,
                reason: 'Desktop access granted (geofencing bypassed)'
              });
              return;
            }

            // Verify location with client-side geofencing
            const verificationResult = verifyGeofence(
              position.latitude,
              position.longitude
            );
            
            setVerificationStatus(verificationResult);
            
            if (verificationResult.gps_verified) {
              onLocationVerified({
                ...position,
                verified: true,
                reason: verificationResult.reason
              });
            } else {
              onLocationError(verificationResult.reason);
            }
          } catch (err) {
            setError(err.message);
            onLocationError(err.message);
          } finally {
            setIsLoading(false);
          }
        };
        
        getLocationAndVerify();
      }, 1000);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-6"></div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Location Tracing</h2>
          <p className="text-gray-600 mb-4">Getting your current location...</p>
          <div className="space-y-2">
            <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
              <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
              <span>Accessing GPS</span>
            </div>
            <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              <span>Verifying location</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (showPermissionGuide) {
    return (
      <LocationPermissionGuide
        onPermissionGranted={() => {
          setShowPermissionGuide(false);
          setError(null);
          handleRetry();
        }}
        onClose={() => {
          setShowPermissionGuide(false);
        }}
      />
    );
  }

  if (error) {
    const isDesktopError = error.includes('desktop devices');
    
    return (
      <div className={`min-h-screen bg-gradient-to-br flex items-center justify-center p-4 ${
        isDesktopError ? 'from-orange-50 to-yellow-100' : 'from-red-50 to-pink-100'
      }`}>
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-lg w-full text-center">
          <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 ${
            isDesktopError ? 'bg-orange-100' : 'bg-red-100'
          }`}>
            <span className="text-2xl">{isDesktopError ? '💻' : '📍'}</span>
          </div>
          <h2 className={`text-2xl font-bold mb-2 ${
            isDesktopError ? 'text-orange-600' : 'text-red-600'
          }`}>
            {isDesktopError ? 'Desktop Device Detected' : 'Location Access Required'}
          </h2>
          <p className="text-gray-600 mb-6">{error}</p>
          
          {/* Debug Information */}
          {process.env.NODE_ENV === 'development' && (
            <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
              <h3 className="font-semibold text-gray-800 mb-2">Debug Information:</h3>
              <div className="text-xs text-gray-600 space-y-1">
                <div>Mobile Device: {debugInfo.isMobile ? 'Yes' : 'No'}</div>
                <div>Geolocation Support: {debugInfo.geolocationSupported ? 'Yes' : 'No'}</div>
                <div>Permissions API: {debugInfo.permissionsAPI ? 'Yes' : 'No'}</div>
                <div>Protocol: {debugInfo.protocol}</div>
                <div>User Agent: {debugInfo.userAgent?.substring(0, 50)}...</div>
              </div>
            </div>
          )}
          
          {isDesktopError ? (
            <div className="bg-orange-50 rounded-lg p-4 mb-6 text-left">
              <h3 className="font-semibold text-orange-800 mb-2">Why is this happening?</h3>
              <p className="text-sm text-orange-700 mb-3">
                Geofencing is disabled for desktop devices to ensure accurate location-based attendance. 
                Desktop computers typically don't have GPS capabilities and may provide inaccurate location data.
              </p>
              <h4 className="font-semibold text-orange-800 mb-2">What you can do:</h4>
              <ol className="text-sm text-orange-700 space-y-1">
                <li>1. Use a mobile device (phone/tablet) for attendance</li>
                <li>2. Ensure location services are enabled on your mobile device</li>
                <li>3. Use a modern mobile browser (Chrome, Safari, Firefox)</li>
                <li>4. Make sure you're within the campus boundary</li>
              </ol>
            </div>
          ) : (
            <div className="bg-blue-50 rounded-lg p-4 mb-6 text-left">
              <h3 className="font-semibold text-blue-800 mb-2">How to Enable Location Access:</h3>
              <ol className="text-sm text-blue-700 space-y-1">
                <li>1. Look for the location icon (📍) in your browser's address bar</li>
                <li>2. Click on it and select "Allow" for this site</li>
                <li>3. Make sure your device's location services are enabled</li>
                <li>4. Try again after granting permission</li>
              </ol>
              
              {debugInfo.protocol === 'http:' && (
                <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded">
                  <p className="text-yellow-800 text-sm font-medium">⚠️ HTTPS Required</p>
                  <p className="text-yellow-700 text-xs mt-1">
                    Mobile browsers require HTTPS for location access. Please access this site via HTTPS.
                  </p>
                </div>
              )}
            </div>
          )}
          
          {isDesktopError ? (
            <div className="space-y-4">
              <button
                onClick={() => window.location.reload()}
                className="bg-orange-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-orange-700 transition-colors w-full"
              >
                Refresh Page
              </button>
              <p className="text-sm text-gray-500">
                Please use a mobile device to access location-based attendance features
              </p>
            </div>
          ) : retryCount < maxRetries ? (
            <div className="space-y-4">
              <button
                onClick={handleRetry}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                Try Again ({retryCount}/{maxRetries})
              </button>
              <button
                onClick={() => setShowPermissionGuide(true)}
                className="bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 transition-colors w-full"
              >
                Show Detailed Instructions
              </button>
              <p className="text-sm text-gray-500">
                After enabling location access, click "Try Again"
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-red-600 font-medium">Maximum retries reached</p>
              <button
                onClick={() => setShowPermissionGuide(true)}
                className="bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 transition-colors w-full"
              >
                Show Detailed Instructions
              </button>
              <button
                onClick={() => window.location.reload()}
                className="bg-gray-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-700 transition-colors w-full"
              >
                Refresh Page
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (verificationStatus && !verificationStatus.gps_verified) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-2xl">⚠️</span>
          </div>
          <h2 className="text-2xl font-bold text-yellow-600 mb-2">Location Not Verified</h2>
          <p className="text-gray-600 mb-4">{verificationStatus.reason}</p>
          
          <div className="bg-gray-50 rounded-lg p-4 mb-4">
            <h3 className="font-medium text-gray-800 mb-2">Location Status:</h3>
            <p className="text-lg text-red-600 font-semibold">
              Out of Campus
            </p>
            <p className="text-sm text-gray-600 mt-1">
              You are currently outside the campus boundaries
            </p>
          </div>
          
          <div className="space-y-3">
            <button
              onClick={handleRetry}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors w-full"
            >
              Try Again
            </button>
            <p className="text-sm text-gray-500">
              You must be within the campus boundaries to access the system.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (verificationStatus && verificationStatus.gps_verified) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-2xl">✅</span>
          </div>
          <h2 className="text-2xl font-bold text-green-600 mb-2">Location Verified</h2>
          <p className="text-gray-600 mb-4">{verificationStatus.reason}</p>
          
          <div className="bg-gray-50 rounded-lg p-4 mb-4">
            <h3 className="font-medium text-gray-800 mb-2">Location Status:</h3>
            <p className="text-lg text-green-600 font-semibold">
              ✅ In Campus
            </p>
            <p className="text-sm text-gray-600 mt-1">
              You are currently within the campus boundaries
            </p>
          </div>
          
          <div className="animate-pulse">
            <p className="text-sm text-gray-500">Location verified! Redirecting...</p>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
