import React, { useMemo, useState } from 'react'

const data = Array.from({ length: 40 }).map((_, i) => ({
  roll: `JKLU21CS${String(i + 1).padStart(3, '0')}`,
  name: `Student ${i + 1}`,
  room: `A-${100 + i}`,
  status: ['Present', 'Late', 'Absent'][i % 3],
}))

export default function Students() {
  const [q, setQ] = useState('')

  const filtered = useMemo(() => {
    const s = q.toLowerCase()
    return data.filter(d => d.room.toLowerCase().includes(s) || d.roll.toLowerCase().includes(s))
  }, [q])

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-semibold">Hostel Students</h1>

      <div className="mt-4 flex items-center gap-3">
        <input value={q} onChange={e => setQ(e.target.value)} placeholder="Search by room or roll" className="w-full max-w-sm border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500" />
      </div>

      <div className="mt-6 bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 text-sm text-gray-600">
            <tr>
              <th className="px-4 py-3">Roll</th>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Room</th>
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((r) => (
              <tr key={r.roll} className="border-t">
                <td className="px-4 py-2">{r.roll}</td>
                <td className="px-4 py-2">{r.name}</td>
                <td className="px-4 py-2">{r.room}</td>
                <td className="px-4 py-2">
                  <span className={`px-2 py-1 rounded text-sm ${r.status === 'Present' ? 'bg-green-100 text-green-700' : r.status === 'Late' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>
                    {r.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
