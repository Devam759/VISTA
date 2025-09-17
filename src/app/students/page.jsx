"use client";

import { useState, useEffect } from "react";
import Protected from "../../components/Protected";
import { useAuth } from "../../components/AuthProvider";
import { getStudents } from "../../lib/api";

function Badge({ children }) {
  return (
    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
      {children}
    </span>
  );
}

export default function StudentsPage() {
  const [selectedHostel, setSelectedHostel] = useState("All Hostels");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { token } = useAuth();

  useEffect(() => {
    fetchStudents();
  }, [selectedHostel, token]);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getStudents(token, selectedHostel);
      setData(response.students || []);
    } catch (err) {
      console.error("Error fetching students:", err);
      setError("Failed to load student data");
      // Fallback to mock data if API fails
      setData([
        { studentId: 1, rollNo: "23BCS001", name: "Aarav Patel", roomNo: "B-205", hostel: "BH1" },
        { studentId: 2, rollNo: "23BCS002", name: "Isha Sharma", roomNo: "G-310", hostel: "GH1" },
        { studentId: 3, rollNo: "23BCS003", name: "Rohan Mehta", roomNo: "B-110", hostel: "BH2" },
        { studentId: 4, rollNo: "23BCS004", name: "Priya Singh", roomNo: "B-206", hostel: "BH1" },
        { studentId: 5, rollNo: "23BCS005", name: "Arjun Kumar", roomNo: "B-111", hostel: "BH2" },
        { studentId: 6, rollNo: "23BCS006", name: "Sneha Reddy", roomNo: "B-207", hostel: "BH1" },
        { studentId: 7, rollNo: "23BCS007", name: "Vikram Joshi", roomNo: "B-112", hostel: "BH2" },
        { studentId: 8, rollNo: "23BCS008", name: "Ananya Gupta", roomNo: "G-311", hostel: "GH1" },
        { studentId: 9, rollNo: "23BCS009", name: "Kavya Nair", roomNo: "G-401", hostel: "GH2" },
        { studentId: 10, rollNo: "23BCS010", name: "Meera Joshi", roomNo: "G-402", hostel: "GH2" },
        { studentId: 11, rollNo: "23BCS011", name: "Riya Agarwal", roomNo: "G-403", hostel: "GH2" },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Protected allow={["Warden"]}>
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold">Students</h1>
        <p className="text-sm text-foreground/70">Roster across hostels with rooms</p>
      </div>
      
      {/* Filter Buttons */}
      <div className="flex gap-2 flex-wrap">
        <button
          onClick={() => setSelectedHostel("All Hostels")}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-150 ${
            selectedHostel === "All Hostels"
              ? "bg-black text-white shadow-sm dark:bg-white dark:text-black"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
          }`}
        >
          All Hostels
        </button>
        <button
          onClick={() => setSelectedHostel("BH1")}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-150 ${
            selectedHostel === "BH1"
              ? "bg-black text-white shadow-sm dark:bg-white dark:text-black"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
          }`}
        >
          BH1
        </button>
        <button
          onClick={() => setSelectedHostel("BH2")}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-150 ${
            selectedHostel === "BH2"
              ? "bg-black text-white shadow-sm dark:bg-white dark:text-black"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
          }`}
        >
          BH2
        </button>
        <button
          onClick={() => setSelectedHostel("GH1")}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-150 ${
            selectedHostel === "GH1"
              ? "bg-black text-white shadow-sm dark:bg-white dark:text-black"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
          }`}
        >
          GH1
        </button>
        <button
          onClick={() => setSelectedHostel("GH2")}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-150 ${
            selectedHostel === "GH2"
              ? "bg-black text-white shadow-sm dark:bg-white dark:text-black"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
          }`}
        >
          GH2
        </button>
      </div>
      
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading students...</p>
          </div>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex">
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error loading data</h3>
              <div className="mt-2 text-sm text-red-700">
                <p>{error}</p>
                <p className="mt-1">Showing fallback data instead.</p>
              </div>
            </div>
          </div>
        </div>
      ) : null}
      
      <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">S.No.</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Roll No</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Name</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Room No</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Hostel</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {data.map((s, index) => (
              <tr key={s.studentId} className={`hover:bg-gray-50 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{s.studentId}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-mono">{s.rollNo}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">{s.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{s.roomNo}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <Badge>{s.hostel}</Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
    </Protected>
  );
}


