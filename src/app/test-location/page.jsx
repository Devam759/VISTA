"use client";

import { useState } from "react";
import locationService from "../../lib/location";
import { verifyLocation } from "../../lib/api";

export default function TestLocationPage() {
  const [location, setLocation] = useState(null);
  const [error, setError] = useState(null);
  const [verification, setVerification] = useState(null);
  const [loading, setLoading] = useState(false);
  const [debugInfo, setDebugInfo] = useState({});

  const testLocation = async () => {
    setLoading(true);
    setError(null);
    setLocation(null);
    setVerification(null);

    try {
      // Collect debug information
      const debug = {
        userAgent: navigator.userAgent,
        isMobile: locationService.isMobileDevice(),
        geolocationSupported: !!navigator.geolocation,
        permissionsAPI: !!navigator.permissions,
        protocol: window.location.protocol,
        host: window.location.host,
        screenWidth: window.innerWidth,
        screenHeight: window.innerHeight,
        touchSupport: 'ontouchstart' in window,
        maxTouchPoints: navigator.maxTouchPoints || 0
      };
      setDebugInfo(debug);

      // Test permissions
      const permissionCheck = await locationService.checkPermissions();
      console.log('Permission check:', permissionCheck);

      if (!permissionCheck.available) {
        throw new Error(permissionCheck.reason);
      }

      // Get location
      const position = await locationService.getCurrentPosition();
      setLocation(position);

      // Test verification
      const verificationResult = await verifyLocation(
        "mock-token",
        position.latitude,
        position.longitude,
        position.accuracy
      );
      setVerification(verificationResult);

    } catch (err) {
      setError(err.message);
      console.error('Location test error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">Location Testing Tool</h1>
          
          <button
            onClick={testLocation}
            disabled={loading}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 mb-8"
          >
            {loading ? "Testing..." : "Test Location"}
          </button>

          {/* Debug Information */}
          <div className="bg-gray-50 rounded-lg p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Debug Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <strong>Mobile Device:</strong> {debugInfo.isMobile ? 'Yes' : 'No'}
              </div>
              <div>
                <strong>Geolocation Support:</strong> {debugInfo.geolocationSupported ? 'Yes' : 'No'}
              </div>
              <div>
                <strong>Permissions API:</strong> {debugInfo.permissionsAPI ? 'Yes' : 'No'}
              </div>
              <div>
                <strong>Protocol:</strong> {debugInfo.protocol}
              </div>
              <div>
                <strong>Screen Size:</strong> {debugInfo.screenWidth}x{debugInfo.screenHeight}
              </div>
              <div>
                <strong>Touch Support:</strong> {debugInfo.touchSupport ? 'Yes' : 'No'}
              </div>
              <div>
                <strong>Max Touch Points:</strong> {debugInfo.maxTouchPoints}
              </div>
              <div className="col-span-1 md:col-span-2">
                <strong>User Agent:</strong> {debugInfo.userAgent}
              </div>
            </div>
          </div>

          {/* Location Information */}
          {location && (
            <div className="bg-green-50 rounded-lg p-6 mb-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Location Data</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div><strong>Latitude:</strong> {location.latitude}</div>
                <div><strong>Longitude:</strong> {location.longitude}</div>
                <div><strong>Accuracy:</strong> {location.accuracy}m</div>
                <div><strong>Timestamp:</strong> {new Date(location.timestamp).toLocaleString()}</div>
              </div>
            </div>
          )}

          {/* Verification Result */}
          {verification && (
            <div className={`rounded-lg p-6 mb-6 ${verification.gps_verified ? 'bg-green-50' : 'bg-red-50'}`}>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Verification Result</h2>
              <div className="text-sm space-y-2">
                <div><strong>Verified:</strong> {verification.gps_verified ? 'Yes' : 'No'}</div>
                <div><strong>Reason:</strong> {verification.reason}</div>
                {verification.distance && (
                  <div><strong>Distance from Center:</strong> {verification.distance.toFixed(1)}m</div>
                )}
              </div>
            </div>
          )}

          {/* Error Display */}
          {error && (
            <div className="bg-red-50 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-red-800 mb-4">Error</h2>
              <p className="text-red-700">{error}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
