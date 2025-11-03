import React, { useEffect, useState } from 'react'
import { apiFetch } from '../../utils/api.js'
import { useAuth } from '../../context/AuthContext.jsx'

export default function History() {
  const { token } = useAuth()
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true
    ;(async () => {
      try {
        setLoading(true)
        const data = await apiFetch('/attendance/history?limit=30', { token })
        if (active) setRows(Array.isArray(data) ? data : [])
      } catch (e) {
        if (active) setError(e.message || 'Failed to load history')
      } finally {
        if (active) setLoading(false)
      }
    })()
    return () => { active = false }
  }, [token])

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-semibold">Attendance History</h1>
      <div className="mt-6 bg-white rounded-xl shadow overflow-hidden">
        {error && <div className="p-4 text-sm text-red-700 bg-red-50 border-b">{error}</div>}
        <table className="w-full text-left">
          <thead className="bg-gray-50 text-sm text-gray-600">
            <tr>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td className="px-4 py-3 text-sm text-gray-500" colSpan={2}>Loading...</td></tr>
            ) : rows.length === 0 ? (
              <tr><td className="px-4 py-3 text-sm text-gray-500" colSpan={2}>No records</td></tr>
            ) : (
              rows.map((r) => {
                const date = r.date ? new Date(r.date).toISOString().slice(0, 10) : '-'
                const status = r.status || 'NOT_MARKED'
                return (
                  <tr key={`${date}-${r.id || Math.random()}`} className="border-t">
                    <td className="px-4 py-2">{date}</td>
                    <td className="px-4 py-2">
                      <span className={`px-2 py-1 rounded text-sm ${status === 'Marked' ? 'bg-green-100 text-green-700' : status === 'Late' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>
                        {status}
                      </span>
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

