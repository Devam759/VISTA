import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { useToast } from '../components/Toast.jsx'
import { verifyInsideCampus } from '../utils/geoCheck.js'
import { verifyJKLUWifi } from '../utils/wifiCheck.js'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const { push } = useToast()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [geoStatus, setGeoStatus] = useState({ checking: true, ok: false, details: '' })
  const [wifiStatus, setWifiStatus] = useState({ checking: true, ok: false, details: '' })
  const [showTestCreds, setShowTestCreds] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    checkAccessRequirements()
  }, [])

  async function checkAccessRequirements() {
    try {
      const [geo, wifi] = await Promise.all([
        verifyInsideCampus(),
        verifyJKLUWifi()
      ])
      setGeoStatus({ checking: false, ok: geo.ok, details: geo.details })
      setWifiStatus({ checking: false, ok: wifi.ok, details: wifi.details })
    } catch (err) {
      setGeoStatus({ checking: false, ok: false, details: 'Check failed' })
      setWifiStatus({ checking: false, ok: false, details: 'Check failed' })
    }
  }

  const onChange = e => setForm({ ...form, [e.target.name]: e.target.value })

  const onSubmit = async e => {
    e.preventDefault()
    try {
      setLoading(true)
      const u = await login(form.email, form.password)
      push('Login successful', 'success')
      navigate(u.role === 'warden' ? '/warden/dashboard' : '/student/dashboard', { replace: true })
    } catch (err) {
      push(err.message || 'Login failed', 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl mb-4 shadow-lg">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">VISTA</h1>
          <p className="text-gray-600">Smart Attendance System</p>
        </div>

        {/* Access Status */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-gray-900">System Status</h3>
            <button
              onClick={checkAccessRequirements}
              className="text-xs text-indigo-600 hover:text-indigo-700 font-medium flex items-center gap-1"
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Refresh
            </button>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  geoStatus.ok ? 'bg-green-100' : 'bg-red-100'
                }`}>
                  <svg className={`w-5 h-5 ${geoStatus.ok ? 'text-green-600' : 'text-red-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">Campus Location</p>
                  <p className="text-xs text-gray-500">GPS verification</p>
                </div>
              </div>
              {geoStatus.checking ? (
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></div>
                  <span className="text-xs text-gray-500">Checking</span>
                </div>
              ) : (
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  geoStatus.ok ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
                }`}>
                  {geoStatus.ok ? 'Verified' : 'Failed'}
                </span>
              )}
            </div>
            <div className="flex items-center justify-between p-3 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  wifiStatus.ok ? 'bg-green-100' : 'bg-red-100'
                }`}>
                  <svg className={`w-5 h-5 ${wifiStatus.ok ? 'text-green-600' : 'text-red-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">College WiFi</p>
                  <p className="text-xs text-gray-500">Network check</p>
                </div>
              </div>
              {wifiStatus.checking ? (
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></div>
                  <span className="text-xs text-gray-500">Checking</span>
                </div>
              ) : (
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  wifiStatus.ok ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
                }`}>
                  {wifiStatus.ok ? 'Connected' : 'Not Connected'}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {error && <div className="mb-4 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-lg text-sm flex items-start gap-3">
            <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <span>{error}</span>
          </div>}

          {/* Test Credentials */}
          <div className="mb-6">
            <button
              type="button"
              onClick={() => setShowTestCreds(!showTestCreds)}
              className="text-sm text-indigo-600 hover:text-indigo-700 font-medium flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
              </svg>
              {showTestCreds ? 'Hide' : 'Show'} Test Credentials
            </button>
            {showTestCreds && (
              <div className="mt-3 p-4 bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-100 rounded-xl text-sm space-y-3">
                <div>
                  <p className="font-semibold text-indigo-900 mb-1">Student Account</p>
                  <p className="text-indigo-700 font-mono text-xs">btech250231@jklu.edu.in</p>
                  <p className="text-indigo-600 font-mono text-xs">Password: 123</p>
                </div>
                <div className="border-t border-indigo-200 pt-3">
                  <p className="font-semibold text-purple-900 mb-1">Warden Account</p>
                  <p className="text-purple-700 font-mono text-xs">warden@jklu.edu.in</p>
                  <p className="text-purple-600 font-mono text-xs">Password: 123</p>
                </div>
              </div>
            )}
          </div>

          <form onSubmit={onSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                  </svg>
                </div>
                <input 
                  name="email" 
                  value={form.email} 
                  onChange={onChange} 
                  placeholder="your.email@jklu.edu.in" 
                  className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all" 
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <input 
                  type="password" 
                  name="password" 
                  value={form.password} 
                  onChange={onChange} 
                  placeholder="Enter your password"
                  className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all" 
                />
              </div>
            </div>
            <button 
              disabled={loading} 
              type="submit" 
              className="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-4 focus:ring-indigo-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Logging in...
                </span>
              ) : 'Sign In'}
            </button>
          </form>
        </div>

        {/* Footer */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600 font-medium">JK Lakshmipat University</p>
          <p className="text-xs text-gray-400 mt-1">Verified Intelligent Student Tracking & Attendance</p>
        </div>
      </div>
    </div>
  )
}

