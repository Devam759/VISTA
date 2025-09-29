"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import LocationTracingWrapper from "./LocationTracingWrapper";

export default function ConditionalLayout({ children }) {
  const pathname = usePathname();
  
  // Check if we're on the login page
  const isLoginPage = pathname === "/login";
  
  if (isLoginPage) {
    // Login page layout - minimal with just logo
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        {/* Minimal navbar for login page */}
        <header className="w-full navbar-glass sticky top-0 z-30">
          <div className="container-app py-4 flex items-center justify-center">
            <Link href="/" className="flex items-center group">
              <img src="/logo.webp" alt="VISTA" className="h-12 w-30 rounded-xl shadow-sm group-hover:shadow-md transition-all duration-200" />
            </Link>
          </div>
        </header>
        
        {/* Login page content */}
        <div className="flex items-center justify-center p-4 min-h-[calc(100vh-80px)]">
          {children}
        </div>
      </div>
    );
  }
  
  // Default layout for all other pages
  return (
    <LocationTracingWrapper>
      <Navbar />
      <div className="container-app py-6 flex gap-6 min-h-screen">
        <div className="hidden lg:block">
          <Sidebar />
        </div>
        <main className="flex-1 min-w-0 overflow-x-auto px-4 lg:px-0">{children}</main>
      </div>
    </LocationTracingWrapper>
  );
}
