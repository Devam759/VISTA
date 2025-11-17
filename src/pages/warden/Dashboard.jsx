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

export default function WardenDashboard() {
  const { user, logout, token } = useAuth()
  const [selectedDate, setSelectedDate] = useState(formatDate(new Date()))
  const [attendanceData, setAttendanceData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [filterStatus, setFilterStatus] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const today = new Date()

  useEffect(() => {
    let active = true
    let interval
    
    const fetchAttendanceData = async () => {
      try {
        setLoading(true)
        const data = await apiFetch(`/warden/attendance/hostel?date=${selectedDate}`, { token })
        if (active) setAttendanceData(data)
      } catch (e) {
        console.error('Failed to load attendance:', e)
      } finally {
        if (active) setLoading(false)
      }
    }
    
    // Fetch immediately
    fetchAttendanceData()
    
    // Refresh every 5 seconds to show updated attendance
    interval = setInterval(fetchAttendanceData, 5000)
    
    return () => { 
      active = false
      if (interval) clearInterval(interval)
    }
  }, [selectedDate, token])

  const metrics = attendanceData?.metrics || { present: 0, late: 0, absent: 0, total: 0 }
  const allStudents = attendanceData?.students || []
  
  // Filter and search students
  const students = allStudents.filter(s => {
    const matchesFilter = filterStatus === 'all' || 
      (filterStatus === 'present' && s.status === 'Marked') ||
      (filterStatus === 'late' && s.status === 'Late') ||
      (filterStatus === 'absent' && !s.status)
    
    const matchesSearch = searchQuery === '' ||
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.rollNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.roomNo.toLowerCase().includes(searchQuery.toLowerCase())
    
    return matchesFilter && matchesSearch
  })

  const exportToCSV = () => {
    const headers = ['Roll No', 'Name', 'Room', 'Status', 'Time', 'Face Verified']
    const rows = allStudents.map(s => [
      s.rollNo,
      s.name,
      s.roomNo,
      s.status || 'Absent',
      s.time ? new Date(s.time).toLocaleTimeString() : '-',
      s.faceVerified ? 'Yes' : 'No'
    ])
    
    const csv = [headers, ...rows].map(row => row.join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `attendance_${selectedDate}.csv`
    a.click()
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Warden Dashboard</h1>
          <p className="text-sm text-gray-500 mt-1">{user?.hostel} - {getDayName(today)}, {today.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
        </div>
        <button onClick={logout} className="text-sm text-red-600 hover:text-red-700">Logout</button>
      </div>

      {/* Date Selector */}
      <div className="mt-6 bg-white rounded-xl shadow p-4">
        <div className="flex items-center gap-4">
          <label className="text-sm font-medium text-gray-700">Select Date:</label>
          <input 
            type="date" 
            value={selectedDate} 
            onChange={(e) => setSelectedDate(e.target.value)}
            max={formatDate(new Date())}
            className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <button 
            onClick={() => setSelectedDate(formatDate(new Date()))}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium"
          >
            Today
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="mt-6 grid sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow p-5">
          <p className="text-sm text-gray-500">Present</p>
          <p className="text-3xl font-bold text-green-600">{metrics.present}</p>
          <p className="text-xs text-gray-400 mt-1">{metrics.total > 0 ? Math.round((metrics.present / metrics.total) * 100) : 0}%</p>
        </div>
        <div className="bg-white rounded-xl shadow p-5">
          <p className="text-sm text-gray-500">Late</p>
          <p className="text-3xl font-bold text-yellow-600">{metrics.late}</p>
          <p className="text-xs text-gray-400 mt-1">{metrics.total > 0 ? Math.round((metrics.late / metrics.total) * 100) : 0}%</p>
        </div>
        <div className="bg-white rounded-xl shadow p-5">
          <p className="text-sm text-gray-500">Absent</p>
          <p className="text-3xl font-bold text-red-600">{metrics.absent}</p>
          <p className="text-xs text-gray-400 mt-1">{metrics.total > 0 ? Math.round((metrics.absent / metrics.total) * 100) : 0}%</p>
        </div>
        <div className="bg-white rounded-xl shadow p-5">
          <p className="text-sm text-gray-500">Total Students</p>
          <p className="text-3xl font-bold text-gray-700">{metrics.total}</p>
          <p className="text-xs text-gray-400 mt-1">{attendanceData?.hostel || ''}</p>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="mt-6 bg-white rounded-xl shadow p-4">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex-1 min-w-[200px]">
            <input
              type="text"
              placeholder="Search by name, roll no, or room..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setFilterStatus('all')}
              className={`px-4 py-2 rounded-lg font-medium text-sm ${
                filterStatus === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All ({allStudents.length})
            </button>
            <button
              onClick={() => setFilterStatus('present')}
              className={`px-4 py-2 rounded-lg font-medium text-sm ${
                filterStatus === 'present' ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Present ({metrics.present})
            </button>
            <button
              onClick={() => setFilterStatus('late')}
              className={`px-4 py-2 rounded-lg font-medium text-sm ${
                filterStatus === 'late' ? 'bg-yellow-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Late ({metrics.late})
            </button>
            <button
              onClick={() => setFilterStatus('absent')}
              className={`px-4 py-2 rounded-lg font-medium text-sm ${
                filterStatus === 'absent' ? 'bg-red-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Absent ({metrics.absent})
            </button>
          </div>
        </div>
      </div>

      {/* Attendance Table */}
      <div className="mt-6 bg-white rounded-xl shadow overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b">
          <div>
            <h2 className="font-semibold text-lg">Attendance for {new Date(selectedDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</h2>
            <p className="text-sm text-gray-500 mt-1">Showing {students.length} of {allStudents.length} students</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={exportToCSV}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm font-medium flex items-center gap-2"
            >
              📥 Export CSV
            </button>
            <Link to="/warden/face-data" className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 text-sm font-medium">
              👤 Face Data
            </Link>
            <Link to="/warden/students" className="px-4 py-2 border-2 border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 text-sm font-medium">
              Manage Students →
            </Link>
          </div>
        </div>
        
        {loading ? (
          <div className="p-8 text-center text-gray-500">Loading...</div>
        ) : students.length === 0 ? (
          <div className="p-8 text-center text-gray-500">No students found</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 text-sm text-gray-600">
                <tr>
                  <th className="px-6 py-3 text-left font-medium">Roll No</th>
                  <th className="px-6 py-3 text-left font-medium">Name</th>
                  <th className="px-6 py-3 text-left font-medium">Room</th>
                  <th className="px-6 py-3 text-left font-medium">Status</th>
                  <th className="px-6 py-3 text-left font-medium">Time</th>
                  <th className="px-6 py-3 text-left font-medium">Face Verified</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {students.map((student) => (
                  <tr key={student.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{student.rollNo}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">{student.name}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{student.roomNo}</td>
                    <td className="px-6 py-4">
                      {student.status ? (
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          student.status === 'Marked' ? 'bg-green-100 text-green-700' :
                          student.status === 'Late' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                          {student.status}
                        </span>
                      ) : (
                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">Absent</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {student.time ? new Date(student.time).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) : '-'}
                    </td>
                    <td className="px-6 py-4">
                      {student.faceVerified ? (
                        <span className="text-green-600 text-sm">✓ Yes</span>
                      ) : student.status ? (
                        <span className="text-red-600 text-sm">✗ No</span>
                      ) : (
                        <span className="text-gray-400 text-sm">-</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
