import React, { useEffect, useState } from 'react'
import { verifyInsideCampus } from '../utils/geoCheck.js'

export default function AccessGate({ children }) {
  const [checking, setChecking] = useState(true)
  const [geoOk, setGeoOk] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    checkAccess()
    // Re-check every 5 minutes
    const interval = setInterval(checkAccess, 5 * 60 * 1000)
    return () => clearInterval(interval)
  }, [])

  async function checkAccess() {
    try {
      setChecking(true)
      setError('')
      const geoResult = await verifyInsideCampus()
      setGeoOk(geoResult.ok)
      if (!geoResult.ok) {
        setError('Access denied: You must be on campus')
      }
    } catch (err) {
      setError('Failed to verify access requirements')
      setGeoOk(false)
    } finally {
      setChecking(false)
    }
  }

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Verifying access...</p>
        </div>
      </div>
    )
  }

  if (!geoOk) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
        <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100">
              <svg className="h-8 w-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h2 className="mt-4 text-xl font-semibold text-gray-900">Access Restricted</h2>
            <p className="mt-2 text-sm text-gray-600">{error}</p>
            
            <div className="mt-6 space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm font-medium text-gray-700">📍 Campus Location</span>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  geoOk ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                }`}>
                  {geoOk ? '✓ Verified' : '✗ Not Verified'}
                </span>
              </div>
            </div>

            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <p className="text-xs text-blue-800">
                <strong>Requirements:</strong><br/>
                • Be physically present on campus<br/>
                • Enable location services
              </p>
            </div>

            <button
              onClick={checkAccess}
              className="mt-6 w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
            >
              Retry Verification
            </button>
          </div>
        </div>
      </div>
    )
  }

  return children
}
