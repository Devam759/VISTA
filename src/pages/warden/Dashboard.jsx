import React from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext.jsx'

const metrics = {
  present: 142,
  late: 12,
  absent: 18,
}

export default function WardenDashboard() {
  const { logout } = useAuth()
  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Warden Dashboard</h1>
        <button onClick={logout} className="text-sm text-red-600">Logout</button>
      </div>

      <div className="mt-6 grid sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl shadow p-5">
          <p className="text-sm text-gray-500">Present</p>
          <p className="text-3xl font-bold">{metrics.present}</p>
        </div>
        <div className="bg-white rounded-xl shadow p-5">
          <p className="text-sm text-gray-500">Late</p>
          <p className="text-3xl font-bold text-yellow-600">{metrics.late}</p>
        </div>
        <div className="bg-white rounded-xl shadow p-5">
          <p className="text-sm text-gray-500">Absent</p>
          <p className="text-3xl font-bold text-red-600">{metrics.absent}</p>
        </div>
      </div>

      <div className="mt-8 bg-white rounded-xl shadow p-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-semibold">Live Attendance</h2>
          <Link to="/warden/students" className="text-sm text-primary-600">Manage Students →</Link>
        </div>
        <div className="text-sm text-gray-500">This is a placeholder table. Connect to backend later.</div>
      </div>
    </div>
  )
}
