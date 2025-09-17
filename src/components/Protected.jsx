"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "./AuthProvider";

export default function Protected({ children, allow = ["Student", "Warden", "ChiefWarden"] }) {
  const { role } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // No redirect; app auto-logs in as Warden via AuthProvider
  }, [role, router]);

  // Show loading state while auth is initializing
  if (role === null) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }
  
  if (!allow.includes(role)) return <div className="text-sm">Unauthorized</div>;
  return children;
}


