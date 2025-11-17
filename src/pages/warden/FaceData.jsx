import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext.jsx'
import { apiFetch } from '../../utils/api.js'

export default function FaceData() {
  const { user, logout, token } = useAuth()
  const [faceData, setFaceData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [selectedStudent, setSelectedStudent] = useState(null)
  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    let active = true

    const fetchFaceData = async () => {
      try {
        setLoading(true)
        const data = await apiFetch('/warden/face-data', { token })
        if (active) setFaceData(data)
      } catch (e) {
        console.error('Failed to load face data:', e)
      } finally {
        if (active) setLoading(false)
      }
    }

    fetchFaceData()
    return () => { active = false }
  }, [token])

  const allStudents = faceData?.students || []

  // Filter and search students
  const students = allStudents.filter(s => {
    const matchesFilter = filterStatus === 'all' || 
      (filterStatus === 'enrolled' && s.faceEnrolled) ||
      (filterStatus === 'not-enrolled' && !s.faceEnrolled)
    
    const matchesSearch = searchQuery === '' ||
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.rollNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.roomNo.toLowerCase().includes(searchQuery.toLowerCase())
    
    return matchesFilter && matchesSearch
  })

  const openModal = (student) => {
    setSelectedStudent(student)
    setShowModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
    setSelectedStudent(null)
  }

  const downloadFaceImage = (student) => {
    if (!student.faceImage) return
    
    const link = document.createElement('a')
    link.href = student.faceImage
    link.download = `${student.rollNo}_${student.name.replace(/\s+/g, '_')}_face.png`
    link.click()
  }

  const exportToCSV = () => {
    const headers = ['Roll No', 'Name', 'Room', 'Email', 'Program', 'Face Enrolled', 'Has Descriptor']
    const rows = allStudents.map(s => [
      s.rollNo,
      s.name,
      s.roomNo,
      s.email,
      s.program,
      s.faceEnrolled ? 'Yes' : 'No',
      s.hasDescriptor ? 'Yes' : 'No'
    ])
    
    const csv = [headers, ...rows].map(row => row.map(cell => `"${cell}"`).join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `face_enrollment_${new Date().toISOString().split('T')[0]}.csv`
    a.click()
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Face Enrollment Database</h1>
          <p className="text-gray-600 mt-2">{user?.hostel} Hostel - View all student face data</p>
        </div>
        <button onClick={logout} className="text-sm text-red-600 hover:text-red-700 font-medium">Logout</button>
      </div>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl shadow p-5">
          <p className="text-sm text-gray-500">Total Students</p>
          <p className="text-3xl font-bold text-gray-700">{faceData?.total || 0}</p>
        </div>
        <div className="bg-white rounded-xl shadow p-5">
          <p className="text-sm text-gray-500">Face Enrolled</p>
          <p className="text-3xl font-bold text-green-600">{faceData?.enrolled || 0}</p>
          <p className="text-xs text-gray-400 mt-1">{faceData?.total > 0 ? Math.round((faceData.enrolled / faceData.total) * 100) : 0}%</p>
        </div>
        <div className="bg-white rounded-xl shadow p-5">
          <p className="text-sm text-gray-500">Not Enrolled</p>
          <p className="text-3xl font-bold text-red-600">{faceData?.notEnrolled || 0}</p>
          <p className="text-xs text-gray-400 mt-1">{faceData?.total > 0 ? Math.round((faceData.notEnrolled / faceData.total) * 100) : 0}%</p>
        </div>
        <div className="bg-white rounded-xl shadow p-5">
          <p className="text-sm text-gray-500">With Descriptor</p>
          <p className="text-3xl font-bold text-blue-600">{allStudents.filter(s => s.hasDescriptor).length}</p>
          <p className="text-xs text-gray-400 mt-1">ML Ready</p>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-xl shadow p-4 mb-6">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex-1 min-w-[250px]">
            <input
              type="text"
              placeholder="Search by name, roll no, or room..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => setFilterStatus('all')}
              className={`px-4 py-2 rounded-lg font-medium text-sm ${
                filterStatus === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All ({allStudents.length})
            </button>
            <button
              onClick={() => setFilterStatus('enrolled')}
              className={`px-4 py-2 rounded-lg font-medium text-sm ${
                filterStatus === 'enrolled' ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Enrolled ({faceData?.enrolled || 0})
            </button>
            <button
              onClick={() => setFilterStatus('not-enrolled')}
              className={`px-4 py-2 rounded-lg font-medium text-sm ${
                filterStatus === 'not-enrolled' ? 'bg-red-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Not Enrolled ({faceData?.notEnrolled || 0})
            </button>
          </div>
          <button
            onClick={exportToCSV}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm font-medium"
          >
            📥 Export CSV
          </button>
          <Link 
            to="/warden/dashboard" 
            className="px-4 py-2 border-2 border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 text-sm font-medium"
          >
            ← Back
          </Link>
        </div>
      </div>

      {/* Face Data Table */}
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <div className="p-6 border-b">
          <h2 className="font-semibold text-lg">Face Enrollment Status</h2>
          <p className="text-sm text-gray-500 mt-1">Showing {students.length} of {allStudents.length} students</p>
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
                  <th className="px-6 py-3 text-left font-medium">Email</th>
                  <th className="px-6 py-3 text-left font-medium">Program</th>
                  <th className="px-6 py-3 text-left font-medium">Face Status</th>
                  <th className="px-6 py-3 text-left font-medium">Descriptor</th>
                  <th className="px-6 py-3 text-left font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {students.map((student) => (
                  <tr key={student.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{student.rollNo}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">{student.name}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{student.roomNo}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{student.email}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{student.program}</td>
                    <td className="px-6 py-4">
                      {student.faceEnrolled ? (
                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                          ✓ Enrolled
                        </span>
                      ) : (
                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700">
                          ✗ Not Enrolled
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {student.hasDescriptor ? (
                        <span className="text-xs font-medium text-blue-600">✓ Yes</span>
                      ) : (
                        <span className="text-xs font-medium text-gray-400">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {student.faceEnrolled && (
                        <button
                          onClick={() => openModal(student)}
                          className="px-3 py-1 bg-blue-100 text-blue-700 rounded text-xs font-medium hover:bg-blue-200"
                        >
                          View
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal for viewing face image */}
      {showModal && selectedStudent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full">
            <div className="p-6 border-b flex items-center justify-between">
              <h2 className="text-lg font-semibold">{selectedStudent.name}</h2>
              <button
                onClick={closeModal}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ×
              </button>
            </div>
            
            <div className="p-6">
              <div className="mb-4">
                <p className="text-sm text-gray-600 mb-2">
                  <span className="font-medium">Roll No:</span> {selectedStudent.rollNo}
                </p>
                <p className="text-sm text-gray-600 mb-2">
                  <span className="font-medium">Room:</span> {selectedStudent.roomNo}
                </p>
                <p className="text-sm text-gray-600 mb-4">
                  <span className="font-medium">Email:</span> {selectedStudent.email}
                </p>
              </div>

              {selectedStudent.faceImage ? (
                <div className="mb-4">
                  <p className="text-sm font-medium text-gray-700 mb-2">Enrolled Face Image:</p>
                  <img
                    src={selectedStudent.faceImage}
                    alt={selectedStudent.name}
                    className="w-full rounded-lg border-2 border-gray-200"
                  />
                </div>
              ) : (
                <div className="mb-4 p-8 bg-gray-100 rounded-lg text-center">
                  <p className="text-sm text-gray-500">No face image available</p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-2">
                {selectedStudent.faceImage && (
                  <button
                    onClick={() => downloadFaceImage(selectedStudent)}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm font-medium"
                  >
                    📥 Download
                  </button>
                )}
                <button
                  onClick={closeModal}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 text-sm font-medium"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
