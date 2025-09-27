"use client";

import CameraCapture from "../../components/CameraCapture";
import Protected from "../../components/Protected";
import Geofencing from "../../components/Geofencing";
import { useState, useEffect } from "react";
import { useAuth } from "../../components/AuthProvider";
import locationService from "../../lib/location";

export default function MarkAttendancePage() {
  const [captured, setCaptured] = useState("");
  const [location, setLocation] = useState(null);
  const [isLocationVerified, setIsLocationVerified] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const { token } = useAuth();

  // Get location on component mount
  useEffect(() => {
    const getLocation = async () => {
      try {
        const position = await locationService.getCurrentPosition();
        setLocation(position);
        
        // Verify location with backend
        if (token) {
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
            setIsLocationVerified(result.gps_verified);
          }
        }
      } catch (error) {
        console.error('Location error:', error);
      }
    };

    getLocation();
  }, [token]);

  // Submit attendance
  const submitAttendance = async () => {
    if (!captured || !location || !isLocationVerified) {
      setSubmitError('Please ensure photo is captured and location is verified');
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const response = await fetch('/api/attendance/mark', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          face_image: captured,
          latitude: location.latitude,
          longitude: location.longitude,
          accuracy: location.accuracy,
          wifi_verified: true, // You can implement WiFi verification
          gps_verified: isLocationVerified,
          notes: 'Attendance marked with geofencing'
        })
      });

      if (response.ok) {
        const result = await response.json();
        setSubmitSuccess(true);
        setCaptured("");
        setLocation(null);
        setIsLocationVerified(false);
      } else {
        const errorData = await response.json();
        setSubmitError(errorData.error || 'Failed to mark attendance');
      }
    } catch (error) {
      setSubmitError('Network error. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Protected allow={["Student"]}>
      <Geofencing
        onLocationUpdate={(locationData) => {
          setLocation(locationData);
          setIsLocationVerified(locationData.verified);
        }}
        onLocationError={(error) => {
          console.error('Location error:', error);
        }}
      >
        <div className="space-y-8">
          <div>
            <h1 className="text-2xl font-bold text-foreground mb-2">Mark Attendance</h1>
            <p className="text-sm text-foreground/60">
              Position your face in the camera frame and ensure you're within hostel boundaries
            </p>
          </div>

          {/* Location Status */}
          <div className="rounded-xl bg-blue-50 border border-blue-200 p-4">
            <div className="flex items-center gap-2 text-blue-700 mb-2">
              <span className="text-lg">📍</span>
              <span className="text-sm font-medium">Location Status</span>
            </div>
            {location ? (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${
                    isLocationVerified ? 'bg-green-500' : 'bg-red-500'
                  }`}></div>
                  <span className="text-sm">
                    {isLocationVerified ? 'Within hostel boundaries' : 'Outside hostel boundaries'}
                  </span>
                </div>
                <p className="text-xs text-gray-600">
                  Accuracy: {location.accuracy?.toFixed(0)}m
                </p>
              </div>
            ) : (
              <p className="text-sm text-gray-600">Getting location...</p>
            )}
          </div>

          {/* Camera Capture */}
          <div className="rounded-2xl surface shadow-sm border border-[color:var(--border)] p-6">
            <CameraCapture onCapture={setCaptured} />
          </div>

          {/* Status Messages */}
          {captured && (
            <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-4">
              <div className="flex items-center gap-2 text-emerald-700">
                <span className="text-lg">✅</span>
                <span className="text-sm font-medium">Photo captured successfully!</span>
              </div>
            </div>
          )}

          {submitSuccess && (
            <div className="rounded-xl bg-green-50 border border-green-200 p-4">
              <div className="flex items-center gap-2 text-green-700">
                <span className="text-lg">🎉</span>
                <span className="text-sm font-medium">Attendance marked successfully!</span>
              </div>
            </div>
          )}

          {submitError && (
            <div className="rounded-xl bg-red-50 border border-red-200 p-4">
              <div className="flex items-center gap-2 text-red-700">
                <span className="text-lg">❌</span>
                <span className="text-sm font-medium">{submitError}</span>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <div className="flex justify-center">
            <button
              onClick={submitAttendance}
              disabled={!captured || !isLocationVerified || isSubmitting}
              className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                captured && isLocationVerified && !isSubmitting
                  ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-md'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              {isSubmitting ? 'Submitting...' : 'Mark Attendance'}
            </button>
          </div>

          {/* Requirements */}
          <div className="rounded-xl bg-gray-50 border border-gray-200 p-4">
            <h3 className="text-sm font-medium text-gray-800 mb-2">Requirements:</h3>
            <ul className="text-xs text-gray-600 space-y-1">
              <li className="flex items-center gap-2">
                <span className={captured ? 'text-green-500' : 'text-gray-400'}>✓</span>
                Photo captured
              </li>
              <li className="flex items-center gap-2">
                <span className={isLocationVerified ? 'text-green-500' : 'text-gray-400'}>✓</span>
                Location verified within hostel boundaries
              </li>
              <li className="flex items-center gap-2">
                <span className="text-gray-400">✓</span>
                GPS accuracy within acceptable range
              </li>
            </ul>
          </div>
        </div>
      </Geofencing>
    </Protected>
  );
}


