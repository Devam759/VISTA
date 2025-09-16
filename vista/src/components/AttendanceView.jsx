"use client";

import { useMemo, useState } from "react";
import { useAuth } from "./AuthProvider";

function StatusBadge({ status }) {
  const color = status === "Present" ? "bg-emerald-500/15 text-emerald-600" : status === "Late" ? "bg-amber-500/15 text-amber-600" : "bg-rose-500/15 text-rose-600";
  return <span className={`px-2 py-0.5 rounded-full text-xs ${color}`}>{status}</span>;
}

export default function AttendanceView() {
  const { role, user } = useAuth();
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
    <div className="space-y-6">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold">Attendance</h1>
          <p className="text-sm text-foreground/70">Daily logs with verification flags</p>
        </div>
        <div className="flex gap-2 text-sm">
          <input type="date" value={dateFilter} onChange={(e) => setDateFilter(e.target.value)} className="px-2 py-1 rounded-md border border-black/[.12] bg-white shadow-xs" />
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="px-2 py-1 rounded-md border border-black/[.12] bg-white shadow-xs">
            <option>All</option>
            <option>Present</option>
            <option>Late</option>
            <option>Absent</option>
          </select>
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl bg-white shadow-sm">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="text-left border-b border-black/[.06]">
              <th className="py-2 pr-4">Date</th>
              <th className="py-2 pr-4">Time</th>
              <th className="py-2 pr-4">Roll No</th>
              <th className="py-2 pr-4">Name</th>
              <th className="py-2 pr-4">Status</th>
              <th className="py-2 pr-4">Confidence</th>
              <th className="py-2 pr-4">Wifi</th>
              <th className="py-2 pr-4">Geo</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((r) => (
              <tr key={r.id} className="border-b border-black/[.06]">
                <td className="py-2 pr-4">{r.date}</td>
                <td className="py-2 pr-4">{r.time}</td>
                <td className="py-2 pr-4 font-mono">{r.rollNo}</td>
                <td className="py-2 pr-4">{r.name}</td>
                <td className="py-2 pr-4"><StatusBadge status={r.status} /></td>
                <td className="py-2 pr-4">{r.confidence ? r.confidence.toFixed(2) + "%" : "-"}</td>
                <td className="py-2 pr-4">{r.wifi ? "✅" : "❌"}</td>
                <td className="py-2 pr-4">{r.geo ? "✅" : "❌"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}


