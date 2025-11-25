import React, { useState, useEffect } from 'react'
import { apiFetch } from '../utils/api.js'

export default function GeofenceChecker({ onVerified, onFailed }) {
  const [checking, setChecking] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    checkGeofence()
  }, [])

  const checkGeofence = async () => {
    try {
      setChecking(true)
      setError(null)

      // Get device location
      if (!navigator.geolocation) {
        throw new Error('Geolocation not supported by your device')
      }

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude, accuracy } = position.coords

          console.log(`📍 Device Location: ${latitude}, ${longitude}`)
          console.log(`📍 GPS Accuracy: ${Math.round(accuracy)}m`)

          try {
            const response = await apiFetch('/geofence/verify', {
              method: 'POST',
              body: { latitude, longitude, accuracy }
            })

            setResult(response)
            console.log('📍 Geofence Result:', response)

            if (response.allowed) {
              onVerified?.(response)
            } else {
              onFailed?.(response)
            }
          } catch (err) {
            setError(err.message)
            onFailed?.(err)
          }
        },
        (error) => {
          const errorMsg = `Geolocation error: ${error.message}`
          setError(errorMsg)
          onFailed?.(error)
        },
        { enableHighAccuracy: true, maximumAge: 0, timeout: 10000 }
      )
    } catch (err) {
      setError(err.message)
      onFailed?.(err)
    } finally {
      setChecking(false)
    }
  }

  if (checking) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl shadow-2xl p-8 max-w-md w-full mx-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Checking Location</h2>
            <p className="text-sm text-gray-600">Verifying your GPS location...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl shadow-2xl p-8 max-w-md w-full mx-4">
          <div className="text-center">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Location Error</h2>
            <p className="text-sm text-gray-600 mb-4">{error}</p>
            <button
              onClick={checkGeofence}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (result) {
    const isAllowed = result.allowed
    const { accuracyStatus, distanceMetrics, detailedInfo } = result

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl shadow-2xl p-8 max-w-md w-full mx-4">
          <div className="text-center">
            {/* Status Icon */}
            <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${
              isAllowed ? 'bg-green-100' : 'bg-red-100'
            }`}>
              <svg className={`w-8 h-8 ${isAllowed ? 'text-green-600' : 'text-red-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isAllowed ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l-2-2m0 0l-2-2m2 2l2-2m-2 2l-2 2m6-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                )}
              </svg>
            </div>

            {/* Status Message */}
            <h2 className={`text-lg font-semibold mb-2 ${isAllowed ? 'text-green-900' : 'text-red-900'}`}>
              {isAllowed ? 'Location Verified' : 'Location Not Verified'}
            </h2>

            {/* Accuracy Status */}
            <div className="mb-4 p-3 bg-gray-50 rounded-lg">
              <p className="text-sm font-medium text-gray-700 mb-1">Status: {accuracyStatus}</p>
              <p className="text-xs text-gray-600">{result.message}</p>
            </div>

            {/* Distance Metrics */}
            <div className="mb-4 space-y-2 text-left">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Distance to Boundary:</span>
                <span className="font-semibold text-gray-900">{distanceMetrics.distanceToBoundary}m</span>
              </div>
              {distanceMetrics.gpsAccuracy && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">GPS Accuracy:</span>
                  <span className="font-semibold text-gray-900">±{distanceMetrics.gpsAccuracy}m</span>
                </div>
              )}
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Accuracy Match:</span>
                <span className={`font-semibold ${distanceMetrics.accuracyPercentage >= 70 ? 'text-green-600' : 'text-red-600'}`}>
                  {distanceMetrics.accuracyPercentage}%
                </span>
              </div>
            </div>

            {/* Direction & Recommendation */}
            {!isAllowed && (
              <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-left">
                <p className="text-xs font-semibold text-yellow-900 mb-1">Direction: {detailedInfo.direction}</p>
                <p className="text-xs text-yellow-800">{detailedInfo.recommendation}</p>
              </div>
            )}

            {/* Action Button */}
            <div className="flex gap-2">
              <button
                onClick={checkGeofence}
                className={`flex-1 px-4 py-2 rounded-lg font-medium text-white ${
                  isAllowed ? 'bg-gray-600 hover:bg-gray-700' : 'bg-blue-600 hover:bg-blue-700'
                }`}
              >
                {isAllowed ? 'Close' : 'Retry'}
              </button>
              {isAllowed && (
                <button
                  onClick={() => onVerified?.(result)}
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium"
                >
                  Proceed
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return null
}
