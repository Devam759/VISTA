"use client";

import { useState, useEffect } from "react";
import { useAuth } from "./AuthProvider";
import locationService from "../lib/location";
import { verifyLocation } from "../lib/api";

export default function LocationTracing({ onLocationVerified, onLocationError }) {
  const { token } = useAuth();
  const [location, setLocation] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [verificationStatus, setVerificationStatus] = useState(null);
  const [retryCount, setRetryCount] = useState(0);
  const [maxRetries] = useState(3);

  useEffect(() => {
    const getLocationAndVerify = async () => {
      setIsLoading(true);
      setError(null);
      setVerificationStatus(null);

      try {
        // Get current location
        const position = await locationService.getCurrentPosition();
        setLocation(position);

        // Verify location with backend
        if (token) {
          try {
            const verificationResult = await verifyLocation(
              token,
              position.latitude,
              position.longitude,
              position.accuracy
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
          } catch (apiError) {
            console.error('API verification error:', apiError);
            setError('Failed to verify location with server');
            onLocationError('Failed to verify location with server');
          }
        } else {
          // If no token, just proceed with location data without verification
          onLocationVerified({
            ...position,
            verified: true,
            reason: 'Location detected (no server verification)'
          });
        }
      } catch (locationError) {
        console.error('Location error:', locationError);
        setError(locationError.message);
        onLocationError(locationError.message);
      } finally {
        setIsLoading(false);
      }
    };

    getLocationAndVerify();
  }, [token, onLocationVerified, onLocationError]);

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
            const position = await locationService.getCurrentPosition();
            setLocation(position);

            if (token) {
              const verificationResult = await verifyLocation(
                token,
                position.latitude,
                position.longitude,
                position.accuracy
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
            } else {
              // If no token, just proceed with location data without verification
              onLocationVerified({
                ...position,
                verified: true,
                reason: 'Location detected (no server verification)'
              });
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

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-2xl">📍</span>
          </div>
          <h2 className="text-2xl font-bold text-red-600 mb-2">Location Error</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          
          {retryCount < maxRetries ? (
            <div className="space-y-4">
              <button
                onClick={handleRetry}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                Try Again ({retryCount}/{maxRetries})
              </button>
              <p className="text-sm text-gray-500">
                Please ensure location services are enabled and permissions are granted.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-red-600 font-medium">Maximum retries reached</p>
              <button
                onClick={() => window.location.reload()}
                className="bg-gray-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-700 transition-colors"
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
          
          {location && (
            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <h3 className="font-medium text-gray-800 mb-2">Your Location:</h3>
              <p className="text-sm text-gray-600">
                Latitude: {location.latitude.toFixed(6)}
              </p>
              <p className="text-sm text-gray-600">
                Longitude: {location.longitude.toFixed(6)}
              </p>
              <p className="text-sm text-gray-600">
                Accuracy: {location.accuracy?.toFixed(0)}m
              </p>
            </div>
          )}
          
          <div className="space-y-3">
            <button
              onClick={handleRetry}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors w-full"
            >
              Try Again
            </button>
            <p className="text-sm text-gray-500">
              Please ensure you are within the campus boundaries.
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
          
          {location && (
            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <h3 className="font-medium text-gray-800 mb-2">Your Location:</h3>
              <p className="text-sm text-gray-600">
                Latitude: {location.latitude.toFixed(6)}
              </p>
              <p className="text-sm text-gray-600">
                Longitude: {location.longitude.toFixed(6)}
              </p>
              <p className="text-sm text-gray-600">
                Accuracy: {location.accuracy?.toFixed(0)}m
              </p>
            </div>
          )}
          
          <div className="animate-pulse">
            <p className="text-sm text-gray-500">Redirecting to dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
