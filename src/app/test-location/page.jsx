"use client";

import { useState } from "react";
import locationService from "../../lib/location";
import { verifyLocation } from "../../lib/api";

// Campus boundary configuration (same as backend)
const CAMPUS_BOUNDARY = {
  center: { latitude: 26.8351, longitude: 75.6508 },
  radius: 100,
  polygon: [
    [75.651187, 26.836760], [75.649523, 26.837109], [75.649331, 26.836678],
    [75.648472, 26.836655], [75.648307, 26.836079], [75.650194, 26.835495],
    [75.650150, 26.834788], [75.650973, 26.834635], [75.651435, 26.833430],
    [75.652500, 26.832659], [75.653021, 26.833776], [75.652374, 26.834072],
    [75.652472, 26.834935], [75.651554, 26.835321], [75.651320, 26.835838]
  ]
};

// Calculate distance between two points using Haversine formula
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371000; // Earth's radius in meters
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

// Check if point is inside polygon using ray casting algorithm
function isPointInPolygon(point, polygon) {
  const x = point[0], y = point[1];
  let inside = false;
  
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const xi = polygon[i][0], yi = polygon[i][1];
    const xj = polygon[j][0], yj = polygon[j][1];
    
    if (((yi > y) !== (yj > y)) && (x < (xj - xi) * (y - yi) / (yj - yi) + xi)) {
      inside = !inside;
    }
  }
  
  return inside;
}

// Test geofencing logic directly
function testGeofencing(latitude, longitude, accuracy) {
  const distanceFromCenter = calculateDistance(
    latitude, longitude,
    CAMPUS_BOUNDARY.center.latitude, CAMPUS_BOUNDARY.center.longitude
  );
  
  const isInsidePolygon = isPointInPolygon([longitude, latitude], CAMPUS_BOUNDARY.polygon);
  
  return {
    distanceFromCenter,
    isInsidePolygon,
    centerCoordinates: CAMPUS_BOUNDARY.center,
    polygon: CAMPUS_BOUNDARY.polygon
  };
}

export default function TestLocationPage() {
  const [location, setLocation] = useState(null);
  const [error, setError] = useState(null);
  const [verification, setVerification] = useState(null);
  const [directGeofencingTest, setDirectGeofencingTest] = useState(null);
  const [loading, setLoading] = useState(false);
  const [debugInfo, setDebugInfo] = useState({});

  const testLocation = async () => {
    setLoading(true);
    setError(null);
    setLocation(null);
    setVerification(null);
    setDirectGeofencingTest(null);

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
      console.log('Location obtained:', position);

      // Test direct geofencing logic
      const directTest = testGeofencing(position.latitude, position.longitude, position.accuracy);
      setDirectGeofencingTest(directTest);
      console.log('Direct geofencing test:', directTest);

      // Test API verification
      const verificationResult = await verifyLocation(
        "mock-token",
        position.latitude,
        position.longitude,
        position.accuracy
      );
      setVerification(verificationResult);
      console.log('API verification result:', verificationResult);

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
          
          <div className="flex gap-4 mb-8">
            <button
              onClick={testLocation}
              disabled={loading}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {loading ? "Testing..." : "Test My Location"}
            </button>
            
            <button
              onClick={() => {
                // Test with known campus coordinates
                const campusCoords = { latitude: 26.8351, longitude: 75.6508, accuracy: 10 };
                setLocation(campusCoords);
                const directTest = testGeofencing(campusCoords.latitude, campusCoords.longitude, campusCoords.accuracy);
                setDirectGeofencingTest(directTest);
                
                verifyLocation("mock-token", campusCoords.latitude, campusCoords.longitude, campusCoords.accuracy)
                  .then(setVerification)
                  .catch(err => setError(err.message));
              }}
              className="bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 transition-colors"
            >
              Test Campus Center
            </button>
            
            <button
              onClick={() => {
                // Test with coordinates outside campus
                const outsideCoords = { latitude: 26.0000, longitude: 75.0000, accuracy: 10 };
                setLocation(outsideCoords);
                const directTest = testGeofencing(outsideCoords.latitude, outsideCoords.longitude, outsideCoords.accuracy);
                setDirectGeofencingTest(directTest);
                
                verifyLocation("mock-token", outsideCoords.latitude, outsideCoords.longitude, outsideCoords.accuracy)
                  .then(setVerification)
                  .catch(err => setError(err.message));
              }}
              className="bg-red-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-red-700 transition-colors"
            >
              Test Outside Campus
            </button>
          </div>

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

          {/* Direct Geofencing Test */}
          {directGeofencingTest && (
            <div className="bg-blue-50 rounded-lg p-6 mb-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Direct Geofencing Test</h2>
              <div className="text-sm space-y-2">
                <div><strong>Inside Campus Polygon:</strong> {directGeofencingTest.isInsidePolygon ? 'Yes' : 'No'}</div>
                <div><strong>Distance from Center:</strong> {directGeofencingTest.distanceFromCenter.toFixed(1)}m</div>
                <div><strong>Campus Center:</strong> {directGeofencingTest.centerCoordinates.latitude}, {directGeofencingTest.centerCoordinates.longitude}</div>
              </div>
              <div className="mt-4">
                <h3 className="font-semibold text-gray-700 mb-2">Campus Boundary Polygon:</h3>
                <div className="bg-white p-3 rounded border text-xs font-mono max-h-32 overflow-y-auto">
                  {directGeofencingTest.polygon.map((point, index) => (
                    <div key={index}>[{point[0]}, {point[1]}]</div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* API Verification Result */}
          {verification && (
            <div className={`rounded-lg p-6 mb-6 ${verification.gps_verified ? 'bg-green-50' : 'bg-red-50'}`}>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">API Verification Result</h2>
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
