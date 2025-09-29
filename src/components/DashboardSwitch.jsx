"use client";

import { useState, useEffect } from "react";
import { useAuth } from "./AuthProvider";
import Card from "./Card";
import { request } from "../lib/api";

export default function DashboardSwitch() {
  const { role } = useAuth();
  const [recentActivity, setRecentActivity] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const { token, user } = useAuth();

  // Fetch recent activity from backend
  const fetchRecentActivity = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Call backend API to get recent attendance activity
      const response = await request("/attendance/recent", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      if (response && response.activities) {
        setRecentActivity(response.activities);
        setLastUpdated(new Date());
      }
    } catch (err) {
      console.error("Error fetching recent activity:", err);
      setError("Failed to load recent activity");
      
      // Fallback to mock data for development
      const mockData = [
        { id: 1, studentName: "Aarav Patel", rollNo: "23BCS001", roomNo: "B-205", timestamp: new Date(Date.now() - 2 * 60 * 1000), status: "Present" },
        { id: 2, studentName: "Isha Sharma", rollNo: "23BCS002", roomNo: "G-310", timestamp: new Date(Date.now() - 5 * 60 * 1000), status: "Present" },
        { id: 3, studentName: "Rohan Mehta", rollNo: "23BCS003", roomNo: "B-110", timestamp: new Date(Date.now() - 8 * 60 * 1000), status: "Late" },
        { id: 4, studentName: "Priya Singh", rollNo: "23BCS004", roomNo: "B-206", timestamp: new Date(Date.now() - 12 * 60 * 1000), status: "Present" },
        { id: 5, studentName: "Arjun Kumar", rollNo: "23BCS005", roomNo: "B-111", timestamp: new Date(Date.now() - 15 * 60 * 1000), status: "Present" },
      ];
        setRecentActivity(mockData);
        setLastUpdated(new Date());
    } finally {
      setIsLoading(false);
    }
  };

  // Live clock update
  useEffect(() => {
    const clockInterval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000); // Update every second

    return () => clearInterval(clockInterval);
  }, []);

  // Real-time updates from backend
  useEffect(() => {
    if (role === "Warden" && token) {
      // Initial fetch
      fetchRecentActivity();
      
      // Poll for updates every 10 seconds
      const interval = setInterval(() => {
        fetchRecentActivity();
      }, 10000); // 10 seconds

      return () => clearInterval(interval);
    }
  }, [role, token]);

  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    
    if (minutes < 1) return "Just now";
    if (minutes === 1) return "1 minute ago";
    if (minutes < 60) return `${minutes} minutes ago`;
    
    const hours = Math.floor(minutes / 60);
    if (hours === 1) return "1 hour ago";
    return `${hours} hours ago`;
  };

  // Function to get full name and determine gender for wardens
  const getDisplayName = () => {
    if (!user?.email) return role === "Warden" ? "WARDEN" : "STUDENT";
    
    const email = user.email;
    const nameFromEmail = email.split('@')[0];
    
    // Convert to full name format (replace dots/underscores with spaces and capitalize)
    const fullName = nameFromEmail
      .replace(/[._]/g, ' ')
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
    
    return fullName.toUpperCase();
  };

  // Function to determine gender and add appropriate title for wardens
  const getWardenTitle = () => {
    if (role !== "Warden") return "";
    
    const email = user?.email || "";
    const nameFromEmail = email.split('@')[0].toLowerCase();
    
    // Simple gender detection based on common name patterns
    // This is a basic implementation - in a real app, you'd have gender data in the user profile
    const femaleNames = ['priya', 'isha', 'sneha', 'ananya', 'kavya', 'meera', 'riya', 'sita', 'gita', 'rita'];
    const isFemale = femaleNames.some(name => nameFromEmail.includes(name));
    
    return isFemale ? "MA'AM" : "SIR";
  };

  if (role === "Student") return (
    <div className="space-y-6">
      {/* Welcome Back Section for Students */}
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
              Welcome Back, {getDisplayName()}
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Manage your attendance and stay connected with your hostel
            </p>
          </div>
          <div className="flex flex-col sm:items-end">
            <div className="text-2xl font-mono font-medium text-gray-800 dark:text-gray-200 mb-1">
              {currentTime.toLocaleTimeString('en-US', { 
                hour12: false,
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit'
              })}
            </div>
            <div className="text-gray-500 dark:text-gray-400 text-sm">
              {currentTime.toLocaleDateString('en-US', { 
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Student Dashboard Cards */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <Card title="My Attendance" href="/attendance"><p className="text-sm">View your daily status and history.</p></Card>
        <Card title="Mark Attendance" href="/mark"><p className="text-sm">Open camera and capture now.</p></Card>
        <Card title="Face Enrollment" href="/face"><p className="text-sm">Enroll your face for attendance.</p></Card>
      </div>
    </div>
  );
  if (role === "Warden") return (
    <div className="space-y-6">
      {/* Welcome Back Section */}
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
              Welcome back, {getDisplayName()} {getWardenTitle()}
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Here's what's happening with your hostel attendance today
            </p>
          </div>
          <div className="flex flex-col sm:items-end">
            <div className="text-2xl font-mono font-medium text-gray-800 dark:text-gray-200 mb-1">
              {currentTime.toLocaleTimeString('en-US', { 
                hour12: false,
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit'
              })}
            </div>
            <div className="text-gray-500 dark:text-gray-400 text-sm">
              {currentTime.toLocaleDateString('en-US', { 
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Main Dashboard Cards */}
      <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        <Card title="Students" href="/students"><p className="text-sm">Manage assigned hostel students.</p></Card>
        <Card title="Attendance" href="/attendance"><p className="text-sm">Monitor present/late/absent.</p></Card>
        <Card title="Hostels" href="/hostels"><p className="text-sm">Overview across all hostels.</p></Card>
      </div>
      
      {/* Recent Activity Section */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Recent Activity</h3>
            <div className="flex items-center gap-3">
              <button
                onClick={fetchRecentActivity}
                disabled={isLoading}
                className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors disabled:opacity-50"
                title="Refresh data"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </button>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm text-gray-600 dark:text-gray-400">Live Updates</span>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-between mt-1">
            <p className="text-sm text-gray-600">Students who have marked attendance recently</p>
            {lastUpdated && (
              <p className="text-xs text-gray-500">
                Last updated: {lastUpdated.toLocaleTimeString()}
              </p>
            )}
          </div>
        </div>
        
        <div className="p-6">
          {isLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <div className="text-gray-600">Loading recent activity...</div>
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <div className="text-red-500 text-lg mb-2">⚠️ Error loading data</div>
              <div className="text-sm text-gray-500 mb-4">{error}</div>
              <button 
                onClick={fetchRecentActivity}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Retry
              </button>
            </div>
          ) : recentActivity.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-gray-400 dark:text-gray-500 text-lg mb-2">No recent activity</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Attendance updates will appear here in real-time</div>
            </div>
          ) : (
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 dark:text-blue-400 font-semibold text-sm">
                        {activity.studentName.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div>
                      <div className="font-medium text-gray-900 dark:text-gray-100">{activity.studentName}</div>
                      <div className="text-sm text-gray-600 dark:text-gray-300">
                        {activity.rollNo} • Room {activity.roomNo}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      activity.status === 'Present' 
                        ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200' 
                        : 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200'
                    }`}>
                      {activity.status}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {formatTimeAgo(activity.timestamp)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
  return null;
}


