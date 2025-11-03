import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { useToast } from '../components/Toast.jsx'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const { push } = useToast()
  const [form, setForm] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)

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
    <div className="min-h-screen grid place-items-center p-6">
      <div className="w-full max-w-md bg-white rounded-xl shadow p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="h-10 w-10 rounded bg-primary-600 text-white grid place-content-center font-bold">V</div>
          <div>
            <h1 className="text-xl font-semibold">VISTA Login</h1>
            <p className="text-sm text-gray-500">Enter your credentials</p>
          </div>
        </div>
        <div className="mb-4 flex items-center gap-2 text-xs">
          <span className="text-gray-500">Autofill:</span>
          <button type="button" onClick={() => setForm({ email: 'student1@jklu.edu.in', password: '123' })} className="px-2 py-1 rounded border hover:bg-gray-50">Student</button>
          <button type="button" onClick={() => setForm({ email: 'karan@jklu.edu.in', password: '123' })} className="px-2 py-1 rounded border hover:bg-gray-50">Warden</button>
        </div>
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium">Email</label>
            <input name="email" value={form.email} onChange={onChange} placeholder="e.g., user@jklu.edu.in" className="mt-1 w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500" />
          </div>
          <div>
            <label className="text-sm font-medium">Password</label>
            <input type="password" name="password" value={form.password} onChange={onChange} className="mt-1 w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500" />
          </div>
          <button disabled={loading} type="submit" className="w-full px-4 py-2 bg-primary-600 text-white rounded hover:bg-primary-700 disabled:opacity-60">{loading ? 'Logging in...' : 'Login'}</button>
        </form>
        <p className="mt-3 text-xs text-gray-500">
          Sample users — Student: Email <span className="font-mono">student1@jklu.edu.in</span>, Pass <span className="font-mono">123</span>. Warden: Email <span className="font-mono">karan@jklu.edu.in</span>, Pass <span className="font-mono">123</span>.
        </p>
      </div>
    </div>
  )
}

