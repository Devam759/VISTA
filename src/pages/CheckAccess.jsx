import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Loader from '../components/Loader.jsx'
import { verifyInsideCampus } from '../utils/geoCheck.js'
import { verifyJKLUWifi } from '../utils/wifiCheck.js'

export default function CheckAccess() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [locOk, setLocOk] = useState(false)
  const [wifiOk, setWifiOk] = useState(false)
  const [geoDetails, setGeoDetails] = useState('')
  const [wifiDetails, setWifiDetails] = useState('')
  const [error, setError] = useState('')
  const isDev = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'

  const runChecks = async () => {
    setLoading(true)
    setError('')
    
    try {
      // Run checks in parallel for faster response
      const [geo, wifi] = await Promise.all([
        verifyInsideCampus().catch(err => ({ ok: false, details: err.message, error: err.message })),
        verifyJKLUWifi().catch(err => ({ ok: false, details: err.message, error: err.message })),
      ])
      
      setLocOk(!!geo.ok)
      setWifiOk(!!wifi.ok)
      setGeoDetails(geo.details || '')
      setWifiDetails(wifi.details || '')
      
      if (geo.ok && wifi.ok) {
        // Small delay for UX before navigation
        setTimeout(() => navigate('/login', { replace: true }), 500)
      } else {
        // Show helpful error message
        const errors = []
        if (!geo.ok) errors.push(`Location: ${geo.details || 'Not verified'}`)
        if (!wifi.ok) errors.push(`WiFi: ${wifi.details || 'Not verified'}`)
        setError(errors.join(' | '))
      }
    } catch (err) {
      setError(err.message || 'Verification failed')
      setLocOk(false)
      setWifiOk(false)
    } finally {
      setLoading(false)
    }
  }

  const bypassChecks = () => {
    setLocOk(true)
    setWifiOk(true)
    setGeoDetails('✅ Development Mode: Bypassed')
    setWifiDetails('✅ Development Mode: Bypassed')
    setError('')
    setLoading(false)
    setTimeout(() => navigate('/login', { replace: true }), 500)
  }

  useEffect(() => {
    // Auto-bypass geolocation checks in development
    if (isDev) {
      bypassChecks()
    } else {
      runChecks()
    }
  }, [])

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-lg bg-white rounded-xl shadow p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="h-10 w-10 rounded bg-primary-600 text-white grid place-content-center font-bold">V</div>
          <div>
            <h1 className="text-xl font-semibold">VISTA Access Check</h1>
            <p className="text-sm text-gray-500">Verified Intelligent Student Tracking & Attendance</p>
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <Loader label="Verifying access..." />
            <p className="mt-4 text-sm text-gray-500">Please ensure location services are enabled</p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className={`flex flex-col p-4 rounded border ${locOk ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}`}>
              <div className="flex items-center justify-between mb-1">
                <span className="font-medium">📍 Location verification</span>
                <span className={`text-sm px-2 py-1 rounded ${locOk ? 'bg-green-600 text-white' : 'bg-red-600 text-white'}`}>
                  {locOk ? '✓ Verified' : '✗ Not verified'}
                </span>
              </div>
              {geoDetails && (
                <p className="text-xs text-gray-600 mt-1">{geoDetails}</p>
              )}
            </div>
            <div className={`flex flex-col p-4 rounded border ${wifiOk ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}`}>
              <div className="flex items-center justify-between mb-1">
                <span className="font-medium">📶 JKLU Wi-Fi connection</span>
                <span className={`text-sm px-2 py-1 rounded ${wifiOk ? 'bg-green-600 text-white' : 'bg-red-600 text-white'}`}>
                  {wifiOk ? '✓ Verified' : '✗ Not verified'}
                </span>
              </div>
              {wifiDetails && (
                <p className="text-xs text-gray-600 mt-1">{wifiDetails}</p>
              )}
            </div>
            
            {error && (
              <div className="p-3 bg-yellow-50 border border-yellow-200 rounded text-sm text-yellow-800">
                <strong>⚠️ Access Requirements:</strong>
                <ul className="mt-1 list-disc list-inside space-y-1">
                  <li>You must be physically present on campus</li>
                  <li>Location services must be enabled</li>
                  <li>GPS must be working on your device</li>
                  <li>You must be connected to JKLU WiFi</li>
                </ul>
                {error.includes('backend') || error.includes('server') ? (
                  <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded">
                    <strong>🔧 Backend Connection Issue:</strong>
                    <p className="mt-1 text-xs">Make sure the backend server is running on http://localhost:4000</p>
                    <p className="text-xs">Run: <code className="bg-gray-100 px-1 rounded">cd backend && npm start</code></p>
                  </div>
                ) : null}
              </div>
            )}
            
            {!(locOk && wifiOk) && (
              <div className="space-y-2">
                <button 
                  onClick={runChecks} 
                  className="w-full mt-2 px-4 py-2 bg-primary-600 text-white rounded hover:bg-primary-700 transition-colors font-medium"
                >
                  🔄 Retry Verification
                </button>
                {isDev && (
                  <button 
                    onClick={bypassChecks} 
                    className="w-full px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 transition-colors font-medium text-sm"
                  >
                    ⚡ Dev Mode: Bypass Checks
                  </button>
                )}
              </div>
            )}
            {(locOk && wifiOk) && (
              <button 
                onClick={() => navigate('/login')} 
                className="w-full mt-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors font-medium"
              >
                ✓ Continue to Login
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
