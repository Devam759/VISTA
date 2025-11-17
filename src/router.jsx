import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import CheckAccess from './pages/CheckAccess.jsx'
import Login from './pages/Login.jsx'
import StudentDashboard from './pages/student/Dashboard.jsx'
import MarkAttendance from './pages/student/MarkAttendance.jsx'
import EnrollFace from './pages/student/EnrollFace.jsx'
import History from './pages/student/History.jsx'
import WardenDashboard from './pages/warden/Dashboard.jsx'
import Students from './pages/warden/Students.jsx'
import FaceData from './pages/warden/FaceData.jsx'
import AccessGate from './components/AccessGate.jsx'
import { useAuth } from './context/AuthContext.jsx'

function ProtectedRoute({ children, role, requireCampusAccess = false }) {
  const { user } = useAuth()
  if (!user) return <Navigate to="/login" replace />
  if (role && user.role !== role) return <Navigate to="/login" replace />
  
  // Wrap student routes with AccessGate to enforce campus/WiFi requirements
  if (requireCampusAccess && role === 'student') {
    return <AccessGate>{children}</AccessGate>
  }
  
  return children
}

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<CheckAccess />} />
      <Route path="/login" element={<Login />} />

      <Route
        path="/student/dashboard"
        element={
          <ProtectedRoute role="student" requireCampusAccess={true}>
            <StudentDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/student/mark"
        element={
          <ProtectedRoute role="student" requireCampusAccess={true}>
            <MarkAttendance />
          </ProtectedRoute>
        }
      />
      <Route
        path="/student/history"
        element={
          <ProtectedRoute role="student" requireCampusAccess={true}>
            <History />
          </ProtectedRoute>
        }
      />
      <Route
        path="/student/enroll-face"
        element={
          <ProtectedRoute role="student">
            <EnrollFace />
          </ProtectedRoute>
        }
      />

      <Route
        path="/warden/dashboard"
        element={
          <ProtectedRoute role="warden">
            <WardenDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/warden/students"
        element={
          <ProtectedRoute role="warden">
            <Students />
          </ProtectedRoute>
        }
      />
      <Route
        path="/warden/face-data"
        element={
          <ProtectedRoute role="warden">
            <FaceData />
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<div className="p-8 text-center"><h1 className="text-2xl font-semibold">404</h1><p className="text-gray-500">Page not found</p></div>} />
    </Routes>
  )
}
