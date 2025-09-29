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
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [dateFilter, setDateFilter] = useState("");
  const [hostelFilter, setHostelFilter] = useState("All Hostels");

  const data = useMemo(() => {
    if (role === "Student") {
      // Sample data for the logged-in student
      const email = user?.email || "";
      const studentName = email === "devamgupta@jklu.edu.in" ? "Devam Gupta" : "You";
      const rollNo = email === "devamgupta@jklu.edu.in" ? "23BCS999" : "ROLL-XXX";
      return [
        { id: 1, date: "2025-09-12", time: "22:03", rollNo, name: studentName, status: "Present", hostel: "BH1", roomNo: "B-205" },
        { id: 2, date: "2025-09-13", time: "22:11", rollNo, name: studentName, status: "Present", hostel: "BH1", roomNo: "B-205" },
        { id: 3, date: "2025-09-14", time: "22:22", rollNo, name: studentName, status: "Late", hostel: "BH1", roomNo: "B-205" },
        { id: 4, date: "2025-09-15", time: "22:05", rollNo, name: studentName, status: "Present", hostel: "BH1", roomNo: "B-205" },
        { id: 5, date: "2025-09-16", time: "22:00", rollNo, name: studentName, status: "Present", hostel: "BH1", roomNo: "B-205" },
      ];
    }
    // Staff sample data
    return [
      { id: 1, date: "2025-09-15", time: "22:05", rollNo: "23BCS001", name: "Aarav Patel", status: "Present", hostel: "BH1", roomNo: "B-205" },
      { id: 2, date: "2025-09-15", time: "22:17", rollNo: "23BCS002", name: "Isha Sharma", status: "Late", hostel: "GH1", roomNo: "G-310" },
      { id: 3, date: "2025-09-15", time: "22:45", rollNo: "23BCS003", name: "Rohan Mehta", status: "Absent", hostel: "BH2", roomNo: "B-110" },
      { id: 4, date: "2025-09-15", time: "22:08", rollNo: "23BCS004", name: "Priya Singh", status: "Present", hostel: "BH1", roomNo: "B-206" },
      { id: 5, date: "2025-09-15", time: "22:12", rollNo: "23BCS005", name: "Arjun Kumar", status: "Present", hostel: "BH2", roomNo: "B-111" },
      { id: 6, date: "2025-09-15", time: "22:15", rollNo: "23BCS009", name: "Kavya Nair", status: "Present", hostel: "GH2", roomNo: "G-401" },
      { id: 7, date: "2025-09-15", time: "22:20", rollNo: "23BCS010", name: "Meera Joshi", status: "Late", hostel: "GH2", roomNo: "G-402" },
      { id: 8, date: "2025-09-15", time: "22:25", rollNo: "23BCS011", name: "Riya Agarwal", status: "Present", hostel: "GH2", roomNo: "G-403" },
    ];
  }, [role, user]);

  const filtered = data.filter((r) => {
    if (statusFilter !== "All Status" && r.status !== statusFilter) return false;
    if (dateFilter && r.date !== dateFilter) return false;
    // Only apply hostel filter for Wardens, not for Students
    if (!isStudent && hostelFilter !== "All Hostels" && r.hostel !== hostelFilter) return false;
    return true;
  });

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground mb-2">Attendance Records</h1>
          <p className="text-sm text-foreground/60">Daily logs with verification and confidence scores</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <input 
              type="date" 
              value={dateFilter} 
              onChange={(e) => setDateFilter(e.target.value)} 
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-[color:var(--border)] bg-[color:var(--card)] text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 shadow-sm hover:shadow-md" 
              placeholder="Select date"
            />
          </div>
          <select 
            value={statusFilter} 
            onChange={(e) => setStatusFilter(e.target.value)} 
            className="px-4 py-3 rounded-xl border border-[color:var(--border)] bg-[color:var(--card)] text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 shadow-sm hover:shadow-md flex-1"
          >
            <option>All Status</option>
            <option>Present</option>
            <option>Late</option>
            <option>Absent</option>
          </select>
        </div>
      </div>

      {/* Hostel Filter Buttons - Only show for Wardens */}
      {!isStudent && (
        <div className="flex gap-2 flex-wrap overflow-x-auto pb-2">
          <button
            onClick={() => setHostelFilter("All Hostels")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-150 ${
              hostelFilter === "All Hostels"
                ? "bg-black text-white shadow-sm dark:bg-white dark:text-black"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
            }`}
          >
            All Hostels
          </button>
          <button
            onClick={() => setHostelFilter("BH1")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-150 ${
              hostelFilter === "BH1"
                ? "bg-black text-white shadow-sm dark:bg-white dark:text-black"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
            }`}
          >
            BH1
          </button>
          <button
            onClick={() => setHostelFilter("BH2")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-150 ${
              hostelFilter === "BH2"
                ? "bg-black text-white shadow-sm dark:bg-white dark:text-black"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
            }`}
          >
            BH2
          </button>
          <button
            onClick={() => setHostelFilter("GH1")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-150 ${
              hostelFilter === "GH1"
                ? "bg-black text-white shadow-sm dark:bg-white dark:text-black"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
            }`}
          >
            GH1
          </button>
          <button
            onClick={() => setHostelFilter("GH2")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-150 ${
              hostelFilter === "GH2"
                ? "bg-black text-white shadow-sm dark:bg-white dark:text-black"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
            }`}
          >
            GH2
          </button>
        </div>
      )}

      {/* Desktop Table View */}
      <div className="hidden lg:block overflow-hidden rounded-2xl surface shadow-sm border border-[color:var(--border)]">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[color:var(--border)] bg-[color:var(--muted)]/50">
              <th className="px-6 py-4 text-left text-xs font-semibold text-foreground/70 uppercase tracking-wider">Date</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-foreground/70 uppercase tracking-wider">Time</th>
              {!isStudent && <th className="px-6 py-4 text-left text-xs font-semibold text-foreground/70 uppercase tracking-wider">Roll No</th>}
              {!isStudent && <th className="px-6 py-4 text-left text-xs font-semibold text-foreground/70 uppercase tracking-wider">Name</th>}
              <th className="px-6 py-4 text-left text-xs font-semibold text-foreground/70 uppercase tracking-wider">Status</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-foreground/70 uppercase tracking-wider">Hostel</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-foreground/70 uppercase tracking-wider">Room No</th>
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
                <td className="px-6 py-4 text-sm text-foreground/80">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                    {r.hostel}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm font-medium text-foreground">{r.roomNo}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="lg:hidden space-y-4">
        {filtered.map((r, index) => (
          <div key={r.id} className="bg-[color:var(--card)] rounded-xl border border-[color:var(--border)] shadow-sm p-4">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-foreground">{r.name || 'You'}</h3>
                <p className="text-sm text-foreground/60 font-mono">{r.rollNo || 'N/A'}</p>
              </div>
              <StatusBadge status={r.status} />
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm mb-3">
              <div>
                <span className="text-foreground/60">Date:</span>
                <span className="ml-2 font-medium text-foreground">{r.date}</span>
              </div>
              <div>
                <span className="text-foreground/60">Time:</span>
                <span className="ml-2 font-medium text-foreground font-mono">{r.time}</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div>
                  <span className="text-foreground/60 text-xs">Hostel:</span>
                  <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                    {r.hostel}
                  </span>
                </div>
                <div>
                  <span className="text-foreground/60 text-xs">Room:</span>
                  <span className="ml-2 font-medium text-foreground">{r.roomNo}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}


