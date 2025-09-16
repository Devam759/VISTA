"use client";

import { useAuth } from "./AuthProvider";

export default function Navbar() {
  const { role, logout } = useAuth();
  return (
    <header className="w-full bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/70 border-b border-black/[.06] sticky top-0 z-20">
      <div className="max-w-6xl mx-auto px-6 py-3.5 flex items-center justify-between">
        <div className="text-base font-semibold tracking-tight">VISTA</div>
        <nav className="flex gap-4 text-sm items-center">
          {role ? (
            <>
              <a href="/" className="hover:underline">Dashboard</a>
              {role !== "Student" && (
                <>
                  <a href="/students" className="hover:underline">Students</a>
                  <a href="/hostels" className="hover:underline">Hostels</a>
                </>
              )}
              <a href="/attendance" className="hover:underline">Attendance</a>
              <span className="text-xs px-2 py-0.5 rounded-full bg-black/[.06]">{role}</span>
              <button onClick={logout} className="underline">Logout</button>
            </>
          ) : (
            <a href="/login" className="hover:underline">Login</a>
          )}
        </nav>
      </div>
    </header>
  );
}


