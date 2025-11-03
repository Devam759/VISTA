import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext.jsx'
import { apiFetch } from '../../utils/api.js'

export default function StudentDashboard() {
  const { user, token, logout } = useAuth()
  const [todayStatus, setTodayStatus] = useState('Loading...')

  useEffect(() => {
    let active = true
    ;(async () => {
      try {
        const data = await apiFetch('/attendance/today', { token })
        const status = data?.status || 'NOT_MARKED'
        if (active) setTodayStatus(status)
      } catch (e) {
        if (active) setTodayStatus('NOT_MARKED')
      }
    })()
    return () => { active = false }
  }, [token])

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Student Dashboard</h1>
        <button onClick={logout} className="text-sm text-red-600">Logout</button>
      </div>

      <div className="mt-6 grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Profile</h2>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="text-gray-500">Name</div><div className="font-medium">{user?.name}</div>
            <div className="text-gray-500">Roll</div><div className="font-medium">{user?.roll}</div>
            <div className="text-gray-500">Hostel</div><div className="font-medium">{user?.hostel}</div>
            <div className="text-gray-500">Room</div><div className="font-medium">{user?.room}</div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Today</h2>
          <p className="text-sm text-gray-500">Status</p>
          <p className="text-2xl font-bold mt-1">{todayStatus}</p>
          <div className="mt-6 flex gap-3">
            <Link to="/student/mark" className="px-4 py-2 bg-primary-600 text-white rounded hover:bg-primary-700">Mark Attendance</Link>
            <Link to="/student/history" className="px-4 py-2 border rounded hover:bg-gray-50">View History</Link>
          </div>
        </div>
      </div>
    </div>
  )
}

