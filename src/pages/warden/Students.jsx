import React, { useEffect, useMemo, useState } from 'react'
import { useAuth } from '../../context/AuthContext.jsx'
import { apiFetch } from '../../utils/api.js'

export default function Students() {
  const { token } = useAuth()
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [q, setQ] = useState('')
  const [status, setStatus] = useState('all')
  const [hostelFilter, setHostelFilter] = useState('all')
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(25)
  const [sortBy, setSortBy] = useState('room')
  const [sortDir, setSortDir] = useState('asc')
  const [compact, setCompact] = useState(false)

  useEffect(() => {
    let mounted = true
    async function load() {
      try {
        setLoading(true)
        const data = await apiFetch('/warden/students', { token })
        if (mounted) setStudents(Array.isArray(data) ? data : [])
      } catch (e) {
        if (mounted) setError(e.message || 'Failed to fetch students')
      } finally {
        if (mounted) setLoading(false)
      }
    }
    load()
    return () => { mounted = false }
  }, [token])

  const filtered = useMemo(() => {
    const s = q.toLowerCase()
    return students.filter(d => {
      const room = String(d.roomNo || '').toLowerCase()
      const roll = String(d.rollNo || '').toLowerCase()
      const name = String(d.name || '').toLowerCase()
      const matchesQuery = room.includes(s) || roll.includes(s) || name.includes(s)
      const dStatus = String(d.status || '').toLowerCase()
      const matchesStatus = status === 'all' ? true : dStatus === status
      const hostelName = String(d?.hostel?.name || '').toLowerCase()
      const matchesHostel = hostelFilter === 'all' ? true : hostelName === hostelFilter
      return matchesQuery && matchesStatus && matchesHostel
    })
  }, [students, q, status, hostelFilter])

  const sorted = useMemo(() => {
    const arr = filtered.slice()
    const dir = sortDir === 'asc' ? 1 : -1
    arr.sort((a, b) => {
      let av, bv
      if (sortBy === 'rollNo') { av = a.rollNo || ''; bv = b.rollNo || '' }
      else if (sortBy === 'name') { av = a.name || ''; bv = b.name || '' }
      else { // room
        av = a.room?.roomNo || a.roomNo || ''
        bv = b.room?.roomNo || b.roomNo || ''
      }
      return av.localeCompare(bv, undefined, { numeric: true, sensitivity: 'base' }) * dir
    })
    return arr
  }, [filtered, sortBy, sortDir])

  const hostelBadges = useMemo(() => {
    const set = new Set((students || []).map(s => s?.hostel?.name).filter(Boolean))
    return Array.from(set)
  }, [students])

  const totalCount = sorted.length
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize))
  const currentPage = Math.min(page, totalPages)
  const startIdx = (currentPage - 1) * pageSize
  const endIdx = Math.min(startIdx + pageSize, totalCount)
  const pageRows = sorted.slice(startIdx, endIdx)

  const toggleSort = (key) => {
    if (sortBy === key) {
      setSortDir(d => (d === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortBy(key)
      setSortDir('asc')
    }
  }

  function exportCurrentPageToCsv() {
    const headers = ['Roll No', 'Registration No', 'Name', 'Room', 'Room Type', 'Status']
    const rows = pageRows.map(r => [
      r.rollNo || '',
      r.regNo || '',
      r.name || '',
      (r.room?.roomNo || r.roomNo || ''),
      (r.room?.isAC ? 'AC' : 'Non AC'),
      r.status || ''
    ])
    const esc = (v) => {
      const s = String(v ?? '')
      return /[",\n]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s
    }
    const csv = [headers, ...rows].map(r => r.map(esc).join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `students_page_${currentPage}.csv`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  async function importFromCsvUrl() {
    const csvUrl = window.prompt('Enter public CSV URL to import (AC/NAC, Reg No.):')
    if (!csvUrl) return
    try {
      await apiFetch('/warden/import-students-meta', { method: 'POST', token, body: { csvUrl } })
      alert('Import completed. Refreshing list...')
      // reload
      setLoading(true)
      const data = await apiFetch('/warden/students', { token })
      setStudents(Array.isArray(data) ? data : [])
    } catch (e) {
      alert(e.message || 'Import failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Hostel Students</h1>
          <div className="mt-1 flex items-center gap-2 flex-wrap">
            <p className="text-sm text-gray-500">View and manage students in your hostel</p>
            {hostelBadges.map(h => (
              <span key={h} className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700 ring-1 ring-gray-200">
                {h}
              </span>
            ))}
          </div>
        </div>
        <div className="mt-1 text-sm text-gray-600 whitespace-nowrap">{totalCount} students</div>
      </div>

      <div className="mt-5 flex flex-col gap-3 sticky top-0 z-20 bg-gray-50/80 backdrop-blur supports-[backdrop-filter]:bg-gray-50/60 border-b rounded-b-none">
        {/* Top row: Search + Status filters */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-2">
        <div className="relative w-full sm:max-w-md">
          <div className="pointer-events-none absolute inset-y-0 left-0 pl-3 flex items-center">
            <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-4.35-4.35M10 18a8 8 0 100-16 8 8 0 000 16z" />
            </svg>
          </div>
          <input
            value={q}
            onChange={e => setQ(e.target.value)}
            placeholder="Search by Room No.(e.g.101), Roll or Name"
            className="w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-800 focus:border-slate-800"
          />
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setStatus('all')}
            className={`px-4 py-2 rounded-lg font-medium text-sm ${status === 'all' ? 'bg-slate-800 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
          >
            All
          </button>
          <button
            onClick={() => setStatus('present')}
            className={`px-4 py-2 rounded-lg font-medium text-sm ${status === 'present' ? 'bg-slate-800 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
          >
            Present
          </button>
          <button
            onClick={() => setStatus('late')}
            className={`px-4 py-2 rounded-lg font-medium text-sm ${status === 'late' ? 'bg-slate-800 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
          >
            Late
          </button>
          <button
            onClick={() => setStatus('absent')}
            className={`px-4 py-2 rounded-lg font-medium text-sm ${status === 'absent' ? 'bg-slate-800 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
          >
            Absent
          </button>
          <div className="hidden sm:flex sm:ml-2 items-center gap-2">
            <button onClick={exportCurrentPageToCsv} className="px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-sm font-medium">Export CSV</button>
            <button onClick={importFromCsvUrl} className="px-3 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-900 text-sm font-medium">Import from CSV</button>
            <button onClick={() => setCompact(c => !c)} className="px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-sm font-medium" title="Toggle density">
              {compact ? 'Comfortable' : 'Compact'}
            </button>
          </div>
        </div>
        </div>

        {/* Second row: Advanced filters */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 p-2">
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-600">Hostel</label>
            <select
              value={hostelFilter}
              onChange={(e) => setHostelFilter(e.target.value)}
              className="px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-800 focus:border-slate-800"
            >
              <option value="all">All</option>
              <option value="bh-1">BH-1</option>
              <option value="bh-2">BH-2</option>
              <option value="gh-1">GH-1</option>
              <option value="gh-2">GH-2</option>
            </select>
          </div>

          <div className="sm:ml-auto">
            <button
              type="button"
              onClick={() => { setQ(''); setStatus('all'); setHostelFilter('all'); }}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-sm font-medium"
            >
              Reset Filters
            </button>
            <div className="sm:hidden mt-2 flex items-center gap-2">
              <button onClick={exportCurrentPageToCsv} className="flex-1 px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-sm font-medium">Export CSV</button>
              <button onClick={importFromCsvUrl} className="flex-1 px-3 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-900 text-sm font-medium">Import CSV</button>
            </div>
          </div>
        </div>
      </div>

      {error && (
        <div className="mt-4 p-3 rounded-lg bg-red-50 text-red-700 border border-red-200 text-sm">{error}</div>
      )}

      <div className="mt-6 bg-white rounded-xl shadow ring-1 ring-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
        <table className="w-full text-left table-auto">
          <colgroup>
            <col className="w-[12rem]" />
            <col className="w-[14rem]" />
            <col />
            <col className="w-[10rem]" />
            <col className="w-[10rem]" />
            <col className="w-[10rem]" />
          </colgroup>
          <thead className="bg-gray-50 text-xs uppercase tracking-wide text-gray-500 sticky top-0 z-10 border-b border-gray-200">
            <tr>
              <th className="px-4 py-3 font-semibold text-left sticky left-0 bg-gray-50">
                <button onClick={() => toggleSort('rollNo')} className="flex items-center gap-1">
                  Roll {sortBy === 'rollNo' && <span className="text-gray-400">{sortDir === 'asc' ? '▲' : '▼'}</span>}
                </button>
              </th>
              <th className="px-4 py-3 font-semibold text-left">Registration No</th>
              <th className="px-4 py-3 font-semibold text-left">
                <button onClick={() => toggleSort('name')} className="flex items-center gap-1">
                  Name {sortBy === 'name' && <span className="text-gray-400">{sortDir === 'asc' ? '▲' : '▼'}</span>}
                </button>
              </th>
              <th className="px-4 py-3 font-semibold text-left">
                <button onClick={() => toggleSort('room')} className="flex items-center gap-1">
                  Room {sortBy === 'room' && <span className="text-gray-400">{sortDir === 'asc' ? '▲' : '▼'}</span>}
                </button>
              </th>
              <th className="px-4 py-3 font-semibold text-left">Room Type</th>
              <th className="px-4 py-3 font-semibold text-left">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
              <tr>
                <td colSpan="6" className="px-4 py-4">
                  <div className="space-y-2">
                    {Array.from({ length: 8 }).map((_, i) => (
                      <div key={i} className={`animate-pulse ${compact ? 'h-6' : 'h-8'} bg-gray-100 rounded`} />
                    ))}
                  </div>
                </td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan="6" className="px-4 py-10 text-center text-sm text-gray-600">
                  <div className="inline-flex flex-col items-center gap-2">
                    <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">🔎</div>
                    <div className="font-medium">No students match your filters</div>
                    <div className="text-gray-500">Try clearing filters or searching a different room</div>
                  </div>
                </td>
              </tr>
            ) : (
              pageRows.map((r, idx) => {
                const statusText = r.status || '—'
                const badgeClass = r.status === 'Present'
                  ? 'bg-green-50 text-green-700 ring-green-200'
                  : r.status === 'Late'
                  ? 'bg-yellow-50 text-yellow-700 ring-yellow-200'
                  : r.status === 'Absent'
                  ? 'bg-red-50 text-red-700 ring-red-200'
                  : 'bg-gray-50 text-gray-700 ring-gray-200'
                const isAC = r.room?.isAC === true
                const dotClass = r.status === 'Present'
                  ? 'bg-green-600'
                  : r.status === 'Late'
                  ? 'bg-yellow-600'
                  : r.status === 'Absent'
                  ? 'bg-red-600'
                  : 'bg-gray-500'
                return (
                  <tr key={r.rollNo} className={`hover:bg-gray-50 ${idx % 2 === 1 ? 'bg-gray-50/50' : ''}` }>
                    <td className={`px-4 ${compact ? 'py-2' : 'py-3'} text-sm text-gray-900 font-medium font-mono sticky left-0 bg-white`}>{r.rollNo}</td>
                    <td className={`px-4 ${compact ? 'py-2' : 'py-3'} text-sm text-gray-700 font-mono`}>{r.regNo || '—'}</td>
                    <td className={`px-4 ${compact ? 'py-2' : 'py-3'} text-sm text-gray-700`}>
                      <span title={r.name} className="inline-block max-w-[18rem] truncate align-middle">{r.name}</span>
                    </td>
                    <td className={`px-4 ${compact ? 'py-2' : 'py-3'} text-sm text-gray-700 font-mono`}>{r.room?.roomNo || r.roomNo || '—'}</td>
                    <td className={`px-4 ${compact ? 'py-2' : 'py-3'}`}>
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ring-1 ring-inset ${isAC ? 'bg-blue-50 text-blue-700 ring-blue-200' : 'bg-gray-50 text-gray-700 ring-gray-200'}`}>
                        {isAC ? 'AC' : 'Non AC'}
                      </span>
                    </td>
                    <td className={`px-4 ${compact ? 'py-2' : 'py-3'}`}>
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ring-1 ring-inset ${badgeClass}`}>
                        <span className={`inline-block w-1.5 h-1.5 rounded-full ${dotClass}`}></span>
                        {statusText}
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

      {!loading && totalCount > 0 && (
        <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-sm text-gray-600">Showing {startIdx + 1}–{endIdx} of {totalCount}</div>
          <div className="flex items-center gap-2">
            <select
              value={pageSize}
              onChange={(e) => { setPageSize(Number(e.target.value)); setPage(1) }}
              className="px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-800 focus:border-slate-800"
            >
              <option value={10}>10 / page</option>
              <option value={25}>25 / page</option>
              <option value={50}>50 / page</option>
              <option value={100}>100 / page</option>
            </select>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className={`px-3 py-2 rounded-lg border text-sm ${currentPage === 1 ? 'text-gray-400 border-gray-200 cursor-not-allowed' : 'text-gray-700 border-gray-300 hover:bg-gray-50'}`}
              >
                Prev
              </button>
              <span className="text-sm text-gray-600">Page {currentPage} / {totalPages}</span>
              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className={`px-3 py-2 rounded-lg border text-sm ${currentPage === totalPages ? 'text-gray-400 border-gray-200 cursor-not-allowed' : 'text-gray-700 border-gray-300 hover:bg-gray-50'}`}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
