"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "./AuthProvider";

export default function Protected({ children, allow = ["Student", "Warden", "ChiefWarden"] }) {
  const { role } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // No redirect; app auto-logs in as Student via AuthProvider
  }, [role, router]);

  if (!role) return null;
  if (!allow.includes(role)) return <div className="text-sm">Unauthorized</div>;
  return children;
}


