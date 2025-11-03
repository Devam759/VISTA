import React from 'react'

const rows = [
  { date: '2025-10-28', status: 'Present' },
  { date: '2025-10-29', status: 'Late' },
  { date: '2025-10-30', status: 'Absent' },
]

export default function History() {
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-semibold">Attendance History</h1>
      <div className="mt-6 bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 text-sm text-gray-600">
            <tr>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.date} className="border-t">
                <td className="px-4 py-2">{r.date}</td>
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
