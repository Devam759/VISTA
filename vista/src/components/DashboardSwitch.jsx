"use client";

import { useAuth } from "./AuthProvider";
import Card from "./Card";

export default function DashboardSwitch() {
  const { role } = useAuth();
  if (role === "Student") return (
    <div className="grid gap-6 sm:grid-cols-2">
      <Card title="My Attendance" href="/attendance"><p className="text-sm">View your daily status and history.</p></Card>
      <Card title="Mark Attendance" href="/mark"><p className="text-sm">Open camera and capture now.</p></Card>
    </div>
  );
  if (role === "Warden") return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      <Card title="Students" href="/students"><p className="text-sm">Manage assigned hostel students.</p></Card>
      <Card title="Attendance" href="/attendance"><p className="text-sm">Monitor present/late/absent.</p></Card>
      <Card title="Face Enrollment" href="/face"><p className="text-sm">Enroll student faces.</p></Card>
    </div>
  );
  if (role === "ChiefWarden") return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      <Card title="Hostels" href="/hostels"><p className="text-sm">Overview across all hostels.</p></Card>
      <Card title="Attendance" href="/attendance"><p className="text-sm">Institute-wide logs.</p></Card>
      <Card title="Students" href="/students"><p className="text-sm">Global roster view.</p></Card>
    </div>
  );
  return null;
}


