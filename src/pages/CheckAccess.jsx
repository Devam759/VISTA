import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Loader from '../components/Loader.jsx'
import { verifyInsideCampus } from '../utils/geoCheck.js'

export default function CheckAccess() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [locOk, setLocOk] = useState(false)
  const [geoDetails, setGeoDetails] = useState('')

  const runChecks = async () => {
    setLoading(true)
    const geo = await verifyInsideCampus()
    setLocOk(!!geo.ok)
    setGeoDetails(geo.details || '')
    setLoading(false)
    if (geo.ok) {
      setTimeout(() => navigate('/login', { replace: true }), 600)
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
            {!locOk && (
              <button onClick={runChecks} className="w-full mt-2 px-4 py-2 bg-primary-600 text-white rounded hover:bg-primary-700">Recheck</button>
            )}
            {locOk && (
              <button onClick={() => navigate('/login')} className="w-full mt-2 px-4 py-2 bg-primary-600 text-white rounded hover:bg-primary-700">Continue to Login</button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
