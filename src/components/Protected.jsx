"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "./AuthProvider";

export default function Protected({ children, allow = ["Student", "Warden"] }) {
  const { role, token, isInitialized } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Only redirect if auth is initialized and user is not authenticated
    if (isInitialized && !token && !role) {
      router.push("/login");
    }
  }, [role, token, router, isInitialized]);

  // Show loading state while auth is initializing
  if (!isInitialized || role === null) {
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


