import React, { useEffect, useMemo, useState } from 'react'
import Camera from '../../components/Camera.jsx'
import { verifyInsideCampus } from '../../utils/geoCheck.js'
import { verifyJKLUWifi } from '../../utils/wifiCheck.js'
import { useToast } from '../../components/Toast.jsx'

function withinWindow(date = new Date()) {
  const start = new Date(date)
  start.setHours(22, 0, 0, 0) // 10:00 PM
  const end = new Date(date)
  end.setHours(22, 30, 0, 0) // 10:30 PM
  return { allowed: date >= start && date <= end, end }
}

export default function MarkAttendance() {
  const { push } = useToast()
  const [locOk, setLocOk] = useState(false)
  const [wifiOk, setWifiOk] = useState(false)
  const [img, setImg] = useState('')
  const [now, setNow] = useState(new Date())
  const [camOn, setCamOn] = useState(false)

  const time = useMemo(() => withinWindow(now), [now])

  useEffect(() => {
    let t = setInterval(() => setNow(new Date()), 30_000)
    return () => clearInterval(t)
  }, [])

  useEffect(() => {
    ;(async () => {
      const [g, w] = await Promise.all([verifyInsideCampus(), verifyJKLUWifi()])
      setLocOk(!!g.ok)
      setWifiOk(!!w.ok)
    })()
  }, [])

  const mark = (isLate = false) => {
    if (!locOk || !wifiOk) return push('Verification failed. Recheck location/Wi-Fi.', 'error')
    if (!img) return push('Please capture your face image', 'error')
    if (!time.allowed && !isLate) return push('Time window closed', 'error')
    push(isLate ? 'Late attendance marked' : 'Attendance marked', 'success')
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-semibold">Mark Attendance</h1>
      <div className="mt-6 grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="font-semibold mb-3">Live Camera</h2>
          <div className="flex items-center gap-2 mb-3">
            <button onClick={() => setCamOn(true)} disabled={camOn} className="px-3 py-1.5 border rounded text-sm hover:bg-gray-50 disabled:opacity-60">Start Camera</button>
            <button onClick={() => setCamOn(false)} disabled={!camOn} className="px-3 py-1.5 border rounded text-sm hover:bg-gray-50 disabled:opacity-60">Stop Camera</button>
          </div>
          <Camera onCapture={setImg} active={camOn} />
          {img && (
            <div className="mt-3">
              <p className="text-sm text-gray-500">Captured Image</p>
              <img src={img} className="mt-1 w-full rounded border" />
            </div>
          )}
        </div>
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="font-semibold mb-3">Verification</h2>
          <ul className="space-y-2 text-sm">
            <li className="flex items-center justify-between">
              <span>Location</span>
              <span className={`px-2 py-1 rounded ${locOk ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{locOk ? 'OK' : 'Not OK'}</span>
            </li>
            <li className="flex items-center justify-between">
              <span>Wi-Fi</span>
              <span className={`px-2 py-1 rounded ${wifiOk ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{wifiOk ? 'OK' : 'Not OK'}</span>
            </li>
            <li className="flex items-center justify-between">
              <span>Time (10:00 PM – 10:30 PM)</span>
              <span className={`px-2 py-1 rounded ${time.allowed ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>{time.allowed ? 'Allowed' : 'Closed'}</span>
            </li>
          </ul>
          <div className="mt-6 space-y-2">
            <button onClick={() => mark(false)} disabled={!time.allowed} className="w-full px-4 py-2 bg-primary-600 text-white rounded hover:bg-primary-700 disabled:opacity-60">Scan & Mark Attendance</button>
            <button onClick={() => mark(true)} disabled={now <= time.end} className="w-full px-4 py-2 border rounded hover:bg-gray-50 disabled:opacity-60">Mark Late</button>
          </div>
        </div>
      </div>
    </div>
  )
}
