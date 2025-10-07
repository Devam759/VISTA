"use client";

import { useEffect, useMemo, useState } from "react";
import { useAuth } from "./AuthProvider";
import { getAttendance } from "../lib/api";

function StatusBadge({ status }) {
  const color = status === "Present"
    ? "bg-emerald-500/15 text-emerald-600 border-emerald-200"
    : status === "Late"
    ? "bg-amber-500/15 text-amber-600 border-amber-200"
    : "bg-rose-500/15 text-rose-600 border-rose-200";
  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${color}`}>
      <div
        className={`w-2 h-2 rounded-full mr-2 ${
          status === "Present"
            ? "bg-emerald-500"
            : status === "Late"
            ? "bg-amber-500"
            : "bg-rose-500"
        }`}
      ></div>
      {status}
    </span>
  );
}

const resolveTimeDisplay = (value) => {
  if (!value) return "--:--";
  if (value.includes("T")) {
    const parsed = new Date(value);
    if (!Number.isNaN(parsed.getTime())) {
      return parsed
        .toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: false })
        .padStart(5, "0");
    }
  }
  return value.length >= 5 ? value.slice(0, 5) : value;
};

export default function AttendanceView() {
  const { role, user, token } = useAuth();
  const isStudent = role === "Student";
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [dateFilter, setDateFilter] = useState("");
  const [hostelFilter, setHostelFilter] = useState("All Hostels");
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!token) {
      setRecords([]);
      return;
    }

    let active = true;

    const fetchAttendance = async () => {
      setLoading(true);
      setError("");
      try {
        const statusParam = statusFilter === "All Status" ? "All" : statusFilter;
        const data = await getAttendance(token, dateFilter, statusParam);
        if (active) {
          setRecords(Array.isArray(data?.attendance) ? data.attendance : []);
        }
      } catch (err) {
        if (active) {
          setError(err.message || "Failed to load attendance records");
          setRecords([]);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    fetchAttendance();

    return () => {
      active = false;
    };
  }, [token, statusFilter, dateFilter]);

  const processedRecords = useMemo(() => {
    return records.map((record) => {
      const student = record?.student || {};
      const fallbackName = [student.user?.first_name, student.user?.last_name]
        .filter(Boolean)
        .join(" ")
        .trim();
      const studentName = student.name?.trim() || fallbackName || "Unknown Student";
      const rollNo = student.rollNo || student.roll_number || record.roll_number || "N/A";
      const hostel = student.hostel || student.hostel_name || "N/A";
      const roomNo = student.roomNo || student.room_number || record.roomNo || "N/A";

      return {
        id: record.id,
        date: record.attendance_date,
        time: resolveTimeDisplay(record.attendance_time),
        rollNo,
        name: studentName,
        status: record.status || "Unknown",
        hostel,
        roomNo,
      };
    });
  }, [records]);

  const hostelOptions = useMemo(() => {
    const options = new Set();
    processedRecords.forEach((record) => {
      if (record.hostel && record.hostel !== "N/A") {
        options.add(record.hostel);
      }
    });
    return Array.from(options).sort();
  }, [processedRecords]);

  const filteredRecords = useMemo(() => {
    return processedRecords.filter((record) => {
      if (!isStudent && hostelFilter !== "All Hostels" && record.hostel !== hostelFilter) {
        return false;
      }
      return true;
    });
  }, [processedRecords, hostelFilter, isStudent]);

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
          {!isStudent && (
            <select
              value={hostelFilter}
              onChange={(e) => setHostelFilter(e.target.value)}
              className="px-4 py-3 rounded-xl border border-[color:var(--border)] bg-[color:var(--card)] text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 shadow-sm hover:shadow-md flex-1"
            >
              <option value="All Hostels">All Hostels</option>
              {hostelOptions.map((hostel) => (
                <option key={hostel} value={hostel}>
                  {hostel}
                </option>
              ))}
            </select>
          )}
        </div>
      </div>

      {error ? (
        <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
          {error}
        </div>
      ) : null}

      {!token ? (
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-700">
          Login required to view attendance records.
        </div>
      ) : null}

      {loading ? (
        <div className="rounded-xl border border-blue-200 bg-blue-50 p-4 text-sm text-blue-700">
          Loading attendance records...
        </div>
      ) : filteredRecords.length === 0 ? (
        <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 text-sm text-gray-600">
          No attendance records found.
        </div>
      ) : null}

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
            {filteredRecords.map((record, index) => (
              <tr
                key={record.id}
                className={`hover:bg-[color:var(--muted)]/30 transition-colors ${
                  index % 2 === 0 ? "bg-[color:var(--card)]" : "bg-[color:var(--muted)]/20"
                }`}
              >
                <td className="px-6 py-4 text-sm font-medium text-foreground">{record.date}</td>
                <td className="px-6 py-4 text-sm text-foreground/80 font-mono">{record.time}</td>
                {!isStudent && <td className="px-6 py-4 text-sm font-mono text-foreground/80">{record.rollNo}</td>}
                {!isStudent && <td className="px-6 py-4 text-sm font-medium text-foreground">{record.name}</td>}
                <td className="px-6 py-4">
                  <StatusBadge status={record.status} />
                </td>
                <td className="px-6 py-4 text-sm text-foreground/80">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                    {record.hostel}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm font-medium text-foreground">{record.roomNo}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="lg:hidden space-y-4">
        {filteredRecords.map((record) => (
          <div key={record.id} className="bg-[color:var(--card)] rounded-xl border border-[color:var(--border)] shadow-sm p-4">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-foreground">{record.name}</h3>
                <p className="text-sm text-foreground/60 font-mono">{record.rollNo}</p>
              </div>
              <StatusBadge status={record.status} />
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm mb-3">
              <div>
                <span className="text-foreground/60">Date:</span>
                <span className="ml-2 font-medium text-foreground">{record.date}</span>
              </div>
              <div>
                <span className="text-foreground/60">Time:</span>
                <span className="ml-2 font-medium text-foreground font-mono">{record.time}</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div>
                  <span className="text-foreground/60 text-xs">Hostel:</span>
                  <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                    {record.hostel}
                  </span>
                </div>
                <div>
                  <span className="text-foreground/60 text-xs">Room:</span>
                  <span className="ml-2 font-medium text-foreground">{record.roomNo}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}



