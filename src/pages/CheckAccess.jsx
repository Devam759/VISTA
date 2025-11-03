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

  const runChecks = async () => {
    setLoading(true)
    const [geo, wifi] = await Promise.all([
      verifyInsideCampus(),
      verifyJKLUWifi(),
    ])
    setLocOk(!!geo.ok)
    setWifiOk(!!wifi.ok)
    setLoading(false)
    if (geo.ok && wifi.ok) {
      setTimeout(() => navigate('/login', { replace: true }), 600)
    }
  }

  useEffect(() => {
    runChecks()
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
          <div className="flex items-center justify-center py-12"><Loader label="Running checks..." /></div>
        ) : (
          <div className="space-y-4">
            <div className={`flex items-center justify-between p-4 rounded border ${locOk ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}`}>
              <span className="font-medium">Location verification</span>
              <span className={`text-sm px-2 py-1 rounded ${locOk ? 'bg-green-600 text-white' : 'bg-red-600 text-white'}`}>{locOk ? 'Verified' : 'Not verified'}</span>
            </div>
            <div className={`flex items-center justify-between p-4 rounded border ${wifiOk ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}`}>
              <span className="font-medium">JKLU Wi-Fi connection</span>
              <span className={`text-sm px-2 py-1 rounded ${wifiOk ? 'bg-green-600 text-white' : 'bg-red-600 text-white'}`}>{wifiOk ? 'Verified' : 'Not verified'}</span>
            </div>
            {!(locOk && wifiOk) && (
              <button onClick={runChecks} className="w-full mt-2 px-4 py-2 bg-primary-600 text-white rounded hover:bg-primary-700">Recheck</button>
            )}
            {(locOk && wifiOk) && (
              <button onClick={() => navigate('/login')} className="w-full mt-2 px-4 py-2 bg-primary-600 text-white rounded hover:bg-primary-700">Continue to Login</button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
