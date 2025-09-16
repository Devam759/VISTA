"use client";

import { useMemo, useState } from "react";
import { useAuth } from "./AuthProvider";

function StatusBadge({ status }) {
  const color = status === "Present" 
    ? "bg-emerald-500/15 text-emerald-600 border-emerald-200" 
    : status === "Late" 
    ? "bg-amber-500/15 text-amber-600 border-amber-200" 
    : "bg-rose-500/15 text-rose-600 border-rose-200";
  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${color}`}>
      <div className={`w-2 h-2 rounded-full mr-2 ${
        status === "Present" ? "bg-emerald-500" : status === "Late" ? "bg-amber-500" : "bg-rose-500"
      }`}></div>
      {status}
    </span>
  );
}

export default function AttendanceView() {
  const { role, user } = useAuth();
  const isStudent = role === "Student";
  const [statusFilter, setStatusFilter] = useState("All");
  const [dateFilter, setDateFilter] = useState("");

  const data = useMemo(() => {
    if (role === "Student") {
      // Sample data for the logged-in student
      const email = user?.email || "";
      const studentName = email === "devamgupta@jklu.edu.in" ? "Devam Gupta" : "You";
      const rollNo = email === "devamgupta@jklu.edu.in" ? "23BCS999" : "ROLL-XXX";
      return [
        { id: 1, date: "2025-09-12", time: "22:03", rollNo, name: studentName, status: "Present", wifi: true, geo: true, confidence: 97.3 },
        { id: 2, date: "2025-09-13", time: "22:11", rollNo, name: studentName, status: "Present", wifi: true, geo: true, confidence: 96.4 },
        { id: 3, date: "2025-09-14", time: "22:22", rollNo, name: studentName, status: "Late", wifi: true, geo: false, confidence: 93.1 },
        { id: 4, date: "2025-09-15", time: "22:05", rollNo, name: studentName, status: "Present", wifi: true, geo: true, confidence: 98.4 },
        { id: 5, date: "2025-09-16", time: "22:00", rollNo, name: studentName, status: "Present", wifi: true, geo: true, confidence: 99.1 },
      ];
    }
    // Staff sample data
    return [
      { id: 1, date: "2025-09-15", time: "22:05", rollNo: "23BCS001", name: "Aarav Patel", status: "Present", wifi: true, geo: true, confidence: 98.4 },
      { id: 2, date: "2025-09-15", time: "22:17", rollNo: "23BCS002", name: "Isha Sharma", status: "Late", wifi: true, geo: false, confidence: 92.1 },
      { id: 3, date: "2025-09-15", time: "22:45", rollNo: "23BCS003", name: "Rohan Mehta", status: "Absent", wifi: false, geo: false, confidence: 0 },
    ];
  }, [role, user]);

  const filtered = data.filter((r) => {
    if (statusFilter !== "All" && r.status !== statusFilter) return false;
    if (dateFilter && r.date !== dateFilter) return false;
    return true;
  });

  return (
    <div className="space-y-8">
      <div className="flex items-end justify-between gap-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground mb-2">Attendance Records</h1>
          <p className="text-sm text-foreground/60">Daily logs with verification and confidence scores</p>
        </div>
        <div className="flex gap-3">
          <input 
            type="date" 
            value={dateFilter} 
            onChange={(e) => setDateFilter(e.target.value)} 
            className="px-4 py-2 rounded-xl border border-[color:var(--border)] bg-[color:var(--card)] text-sm focus:outline-none focus:ring-2 focus:ring-[color:var(--accent)]/20 focus:border-[color:var(--accent)] transition-colors" 
          />
          <select 
            value={statusFilter} 
            onChange={(e) => setStatusFilter(e.target.value)} 
            className="px-4 py-2 rounded-xl border border-[color:var(--border)] bg-[color:var(--card)] text-sm focus:outline-none focus:ring-2 focus:ring-[color:var(--accent)]/20 focus:border-[color:var(--accent)] transition-colors"
          >
            <option>All Status</option>
            <option>Present</option>
            <option>Late</option>
            <option>Absent</option>
          </select>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl surface shadow-sm border border-[color:var(--border)]">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[color:var(--border)] bg-[color:var(--muted)]/50">
              <th className="px-6 py-4 text-left text-xs font-semibold text-foreground/70 uppercase tracking-wider">Date</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-foreground/70 uppercase tracking-wider">Time</th>
              {!isStudent && <th className="px-6 py-4 text-left text-xs font-semibold text-foreground/70 uppercase tracking-wider">Roll No</th>}
              {!isStudent && <th className="px-6 py-4 text-left text-xs font-semibold text-foreground/70 uppercase tracking-wider">Name</th>}
              <th className="px-6 py-4 text-left text-xs font-semibold text-foreground/70 uppercase tracking-wider">Status</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-foreground/70 uppercase tracking-wider">Confidence</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[color:var(--border)]">
            {filtered.map((r, index) => (
              <tr key={r.id} className={`hover:bg-[color:var(--muted)]/30 transition-colors ${index % 2 === 0 ? 'bg-[color:var(--card)]' : 'bg-[color:var(--muted)]/20'}`}>
                <td className="px-6 py-4 text-sm font-medium text-foreground">{r.date}</td>
                <td className="px-6 py-4 text-sm text-foreground/80 font-mono">{r.time}</td>
                {!isStudent && <td className="px-6 py-4 text-sm font-mono text-foreground/80">{r.rollNo}</td>}
                {!isStudent && <td className="px-6 py-4 text-sm font-medium text-foreground">{r.name}</td>}
                <td className="px-6 py-4">
                  <StatusBadge status={r.status} />
                </td>
                <td className="px-6 py-4 text-sm">
                  {r.confidence ? (
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-[color:var(--muted)] rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full transition-all duration-300 ${
                            r.confidence >= 95 ? 'bg-emerald-500' : 
                            r.confidence >= 90 ? 'bg-amber-500' : 'bg-rose-500'
                          }`}
                          style={{ width: `${r.confidence}%` }}
                        ></div>
                      </div>
                      <span className="text-xs font-medium text-foreground/70 min-w-[3rem]">
                        {r.confidence.toFixed(1)}%
                      </span>
                    </div>
                  ) : (
                    <span className="text-xs text-foreground/40">-</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}


