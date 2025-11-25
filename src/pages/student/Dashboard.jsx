import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext.jsx'
import { apiFetch } from '../../utils/api.js'

function getDayName(date) {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  return days[date.getDay()]
}

function formatDate(date) {
  return date.toISOString().split('T')[0]
}

function normalizeProgram(p) {
  const s = (p || '').toString().trim().toLowerCase()
  if (!s) return ''
  if (s.includes('btech') || s.includes('b.tech') || s === 'btech' || s === 'b tech') return 'B. Tech.'
  if (s.includes('bba')) return 'BBA'
  if (s.includes('bdes') || s.includes('b.des') || s.includes('b design') || s.includes('b design')) return 'B. Des.'
  if (s.includes('mba')) return 'MBA'
  if (s.includes('mdes') || s.includes('m.des') || s.includes('m design')) return 'M. Des.'
  return p
}

export default function StudentDashboard() {
  const { user, token, logout } = useAuth()
  const [todayStatus, setTodayStatus] = useState('Loading...')
  const [weekData, setWeekData] = useState([])
  const [stats, setStats] = useState({ present: 0, late: 0, absent: 0, total: 0 })
  const [streak, setStreak] = useState(0)
  const [percentage, setPercentage] = useState(0)
  const today = new Date()

  const statusMeta = (() => {
    const raw = (todayStatus || '').toUpperCase()
    if (raw === 'MARKED' || raw === 'PRESENT') return { label: 'Marked', classes: 'bg-emerald-100 text-emerald-700' }
    if (raw === 'LATE') return { label: 'Late', classes: 'bg-amber-100 text-amber-700' }
    if (raw === 'NOT_MARKED' || raw === 'ABSENT' || raw === 'MISSED') return { label: 'Not Marked', classes: 'bg-rose-100 text-rose-700' }
    return { label: todayStatus, classes: 'bg-gray-100 text-gray-700' }
  })()

  useEffect(() => {
    let active = true
    let interval
    
    const fetchTodayStatus = async () => {
      try {
        const data = await apiFetch('/attendance/today', { token })
        const status = data?.status || 'NOT_MARKED'
        if (active) setTodayStatus(status)
      } catch (e) {
        if (active) setTodayStatus('NOT_MARKED')
      }
    }
    
    // Fetch immediately
    fetchTodayStatus()
    
    // Refresh every 5 seconds to show updated attendance
    interval = setInterval(fetchTodayStatus, 5000)
    
    return () => { 
      active = false
      if (interval) clearInterval(interval)
    }
  }, [token])

  useEffect(() => {
    let active = true
    ;(async () => {
      try {
        const data = await apiFetch('/attendance/history?limit=30', { token })
        if (active && Array.isArray(data)) {
          // Get last 7 days
          const last7Days = []
          for (let i = 6; i >= 0; i--) {
            const d = new Date()
            d.setDate(d.getDate() - i)
            d.setHours(0, 0, 0, 0)
            const dateStr = formatDate(d)
            const record = data.find(r => formatDate(new Date(r.date)) === dateStr)
            last7Days.push({
              date: d,
              dateStr,
              day: getDayName(d),
              status: record?.status || 'ABSENT',
              isToday: formatDate(d) === formatDate(new Date())
            })
          }
          setWeekData(last7Days)

          // Calculate stats
          const present = data.filter(r => r.status === 'Marked').length
          const late = data.filter(r => r.status === 'Late').length
          const absent = data.filter(r => r.status === 'Missed' || r.status === 'ABSENT').length
          setStats({ present, late, absent, total: data.length })

          // Calculate percentage
          const pct = data.length > 0 ? Math.round(((present + late) / data.length) * 100) : 0
          setPercentage(pct)

          // Calculate streak (consecutive present days)
          let currentStreak = 0
          const sortedData = [...data].sort((a, b) => new Date(b.date) - new Date(a.date))
          for (const record of sortedData) {
            if (record.status === 'Marked' || record.status === 'Late') {
              currentStreak++
            } else {
              break
            }
          }
          setStreak(currentStreak)
        }
      } catch (e) {
        console.error('Failed to load week data:', e)
      }
    })()
    return () => { active = false }
  }, [token])

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 text-white grid place-content-center text-lg font-bold">
            {user?.name?.charAt(0)?.toUpperCase()}
          </div>
          <div>
            <h1 className="text-xl font-semibold text-gray-900">Welcome back, {user?.name?.split(' ')?.[0] || 'Student'}</h1>
            <p className="text-xs text-gray-500">{getDayName(today)}, {today.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
          </div>
        </div>
        <button onClick={logout} className="px-3 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50">Logout</button>
      </div>

      {/* Today's Status Card */}
      <div className="mt-6 bg-white rounded-2xl shadow-lg ring-1 ring-gray-100 p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Today's Attendance</p>
            <div className="mt-2 flex items-center gap-3">
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${statusMeta.classes}`}>
                {statusMeta.label}
              </span>
              <span className="text-xs text-gray-400">Status as of {new Date().toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'})}</span>
            </div>
          </div>
          <Link to="/student/mark" className="px-5 py-2.5 bg-slate-800 hover:bg-slate-900 text-white rounded-lg font-medium">
            Mark Attendance
          </Link>
        </div>
      </div>

      

      

      {/* Profile & Quick Actions */}
      <div className="mt-6 grid md:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl shadow p-6 ring-1 ring-gray-100">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">{user?.name}</h2>
              <p className="text-sm text-gray-500">{user?.roll}</p>
            </div>
          </div>
          <div className="space-y-3 text-sm">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-gray-600">Program</span>
              <span className="font-medium text-gray-900">{normalizeProgram(user?.program)}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-gray-600">Hostel</span>
              <span className="font-medium text-gray-900">{user?.hostel}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-gray-600">Room No.</span>
              <span className="font-medium text-gray-900">{user?.room}</span>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl shadow p-6 ring-1 ring-gray-100">
          <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
          <div className="space-y-3">
            {!user?.faceIdUrl && (
              <Link to="/student/enroll-face" className="block w-full px-4 py-3 bg-slate-800 text-white rounded-lg hover:bg-slate-900 text-center font-medium">
                Enroll Face (Required)
              </Link>
            )}
            <Link to="/student/mark" className="block w-full px-4 py-3 bg-slate-800 text-white rounded-lg hover:bg-slate-900 text-center font-medium">
              Mark Attendance
            </Link>
            <Link to="/student/history" className="block w-full px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 text-center font-medium text-gray-700">
              View Full History
            </Link>
            {user?.faceIdUrl && (
              <Link to="/student/enroll-face" className="block w-full px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-center font-medium">
                Re-enroll Face
              </Link>
            )}
          </div>
        </div>
        <div className="bg-white rounded-2xl shadow p-6 ring-1 ring-gray-100">
          <h2 className="text-lg font-semibold mb-4">Attendance Window</h2>
          <div className="space-y-3 text-sm">
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <span className="text-gray-700">✅ On Time</span>
              <span className="font-semibold text-green-700">10:00 PM - 10:30 PM</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
              <span className="text-gray-700">⚠️ Late</span>
              <span className="font-semibold text-yellow-700">10:30 PM - 11:00 PM</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
              <span className="text-gray-700">❌ Absent</span>
              <span className="font-semibold text-red-700">After 11:00 PM</span>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg text-xs text-gray-600">
              ℹ️ Requires: Campus location and Face verification
            </div>
          </div>
        </div>
      </div>
      {/* Weekly Calendar */}
      <div className="mt-6 bg-white rounded-2xl shadow ring-1 ring-gray-100 p-6">
        <h2 className="text-lg font-semibold mb-4">Last 7 Days</h2>
        <div className="grid grid-cols-7 gap-2">
          {weekData.map((day, idx) => (
            <div key={idx} className={`text-center p-3 rounded-lg border ${
              day.isToday ? 'border-indigo-300 bg-indigo-50' : 'border-gray-200'
            }`}>
              <p className="text-xs text-gray-500 font-medium">{day.day.slice(0, 3)}</p>
              <p className="text-sm font-semibold mt-1">{day.date.getDate()}</p>
              <div className={`mt-2 w-9 h-9 mx-auto rounded-full flex items-center justify-center text-xs font-bold ${
                day.status === 'Marked' ? 'bg-emerald-100 text-emerald-700' :
                day.status === 'Late' ? 'bg-amber-100 text-amber-700' :
                'bg-rose-100 text-rose-700'
              }`}>
                {day.status === 'Marked' ? '✓' : day.status === 'Late' ? 'L' : '✗'}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

