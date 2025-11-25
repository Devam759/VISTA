import React, { useEffect, useMemo, useState } from 'react'
import Camera from '../../components/Camera.jsx'
import { verifyInsideCampus } from '../../utils/geoCheck.js'
import { useToast } from '../../components/Toast.jsx'
import { apiFetch } from '../../utils/api.js'
import { useAuth } from '../../context/AuthContext.jsx'

function withinWindow(date = new Date()) {
  const start = new Date(date)
  start.setHours(22, 0, 0, 0) // 10:00 PM
  const end = new Date(date)
  end.setHours(22, 30, 0, 0) // 10:30 PM
  const lateEnd = new Date(date)
  lateEnd.setHours(23, 0, 0, 0) // 11:00 PM
  return { allowed: date >= start && date <= end, end, lateEnd, isLateWindow: date > end && date <= lateEnd }
}

export default function MarkAttendance() {
  const { push } = useToast()
  const { token } = useAuth()
  const [locOk, setLocOk] = useState(false)
  const [img, setImg] = useState('')
  const [now, setNow] = useState(new Date())
  const [camOn, setCamOn] = useState(false)
  const [coords, setCoords] = useState({ lat: null, lng: null, accuracy: null })
  const [submitting, setSubmitting] = useState(false)
  const [desktopBlocked, setDesktopBlocked] = useState(false)

  const time = useMemo(() => withinWindow(now), [now])

  useEffect(() => {
    let t = setInterval(() => setNow(new Date()), 30_000)
    return () => clearInterval(t)
  }, [])

  useEffect(() => {
    ; (async () => {
      const ua = (navigator.userAgent || '').toLowerCase()
      const isMobile = /(android|iphone|ipad|ipod|mobile)/i.test(ua)
      if (!isMobile) {
        setDesktopBlocked(true)
        setLocOk(false)
        return
      }
      const g = await verifyInsideCampus()
      setLocOk(!!g.ok)
    })()
  }, [])

  useEffect(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setCoords({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
            accuracy: pos.coords.accuracy || null
          })
        },
        () => {
          setCoords({ lat: null, lng: null, accuracy: null })
        },
        { enableHighAccuracy: true, maximumAge: 60000, timeout: 5000 }
      )
    }
  }, [])

  // Auto-submit when image is captured
  useEffect(() => {
    if (img && !submitting) {
      markAttendance()
    }
  }, [img])

  const markAttendance = async () => {
    if (desktopBlocked) {
      push('Attendance marking is restricted to mobile devices.', 'error')
      return
    }
    if (!locOk) {
      push('Verification failed. Please ensure you are on campus.', 'error')
      return
    }
    // Time window check disabled for development
    try {
      setSubmitting(true)

      // Step 1: Verify face first
      // Step 1: Verify face first
      console.log('🔍 Verifying face...');
      const faceVerification = await apiFetch('/attendance/verify-face', {
        method: 'POST',
        body: { imageBase64: img }, // Changed key to imageBase64 to match faceService
        token
      });

      if (!faceVerification.verified) {
        push(`Face verification failed: ${faceVerification.message}`, 'error');
        setImg('');
        setSubmitting(false);
        return;
      }

      console.log(`✅ Face verified with ${faceVerification.confidence || faceVerification.accuracy}% confidence`);
      const confidence = faceVerification.confidence || faceVerification.accuracy;
      push(`Face verified (${confidence}% match, minimum 70% required)`, 'success');

      // Step 2: Mark attendance after face verification
      const body = {
        test_image: img,
        latitude: coords.lat,
        longitude: coords.lng,
        accuracy: coords.accuracy || null,
        faceAccuracy: parseFloat(faceVerification.confidence || faceVerification.accuracy)
      }
      const data = await apiFetch('/attendance/mark', { method: 'POST', body, token })
      const status = time.allowed ? 'On Time' : 'Late'

      // Display detailed accuracy information
      const accuracyMsg = data?.accuracy ? ` (${data.accuracy.status} - ${data.accuracy.percentage}% match)` : ''
      push(`${data?.message || 'Attendance marked successfully'}${accuracyMsg}`, 'success')

      // Disable camera after successful submission
      setCamOn(false)
    } catch (err) {
      push(err.message || 'Failed to mark attendance', 'error')
      setImg('') // Clear image to allow retry
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Mark Attendance</h1>
        <p className="text-gray-600 mt-2">Capture your face to mark attendance automatically</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl shadow-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-lg text-gray-900">Face Verification</h2>
            {!camOn && !img && !desktopBlocked && (
              <button
                onClick={() => setCamOn(true)}
                className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-sm font-medium rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all shadow-md"
              >
                Start Camera
              </button>
            )}
          </div>

          <Camera onCapture={setImg} active={camOn} showFaceDetection={true} />

          {img && (
            <div className="mt-4">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium text-gray-700">Captured Image</p>
                {submitting && (
                  <div className="flex items-center gap-2 text-sm text-indigo-600">
                    <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </div>
                )}
              </div>
              <img src={img} className="w-full rounded-xl border-2 border-gray-200 shadow-sm" alt="Captured face" />
              <p className="text-xs text-gray-500 mt-2 text-center">Attendance will be marked automatically</p>
            </div>
          )}

          {!camOn && !img && (
            <div className="mt-4 p-8 bg-gray-50 rounded-xl text-center">
              <svg className="w-16 h-16 mx-auto text-gray-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <p className="text-sm text-gray-600">Click "Start Camera" to begin</p>
            </div>
          )}
        </div>
        <div className="bg-white rounded-2xl shadow-xl p-6">
          <h2 className="font-semibold text-lg text-gray-900 mb-4">System Status</h2>

          <div className="space-y-4">
            {/* Location Status */}
            <div className="p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${locOk ? 'bg-green-100' : 'bg-red-100'
                    }`}>
                    <svg className={`w-5 h-5 ${locOk ? 'text-green-600' : 'text-red-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">Campus Location</p>
                    <p className="text-xs text-gray-500">GPS verification</p>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${locOk ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
                  }`}>
                  {locOk ? 'Verified' : 'Failed'}
                </span>
              </div>
            </div>



            {/* Time Window Status */}
            <div className="p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${time.allowed ? 'bg-green-100' : time.isLateWindow ? 'bg-yellow-100' : 'bg-red-100'
                    }`}>
                    <svg className={`w-5 h-5 ${time.allowed ? 'text-green-600' : time.isLateWindow ? 'text-yellow-600' : 'text-red-600'
                      }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">Time Window</p>
                    <p className="text-xs text-gray-500">
                      {time.allowed ? 'On Time (10:00-10:30 PM)' : time.isLateWindow ? 'Late (10:30-11:00 PM)' : 'Closed'}
                    </p>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${time.allowed ? 'bg-green-500 text-white' : time.isLateWindow ? 'bg-yellow-500 text-white' : 'bg-red-500 text-white'
                  }`}>
                  {time.allowed ? 'On Time' : time.isLateWindow ? 'Late' : 'Closed'}
                </span>
              </div>
            </div>
          </div>

          {/* Info Box */}
          <div className="mt-6 p-4 bg-indigo-50 border border-indigo-100 rounded-xl">
            <div className="flex gap-3">
              <svg className="w-5 h-5 text-indigo-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              <div className="text-sm text-indigo-900">
                <p className="font-semibold mb-1">Automatic Attendance</p>
                <p className="text-xs text-indigo-700">Simply capture your face and attendance will be marked automatically based on the current time window.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
