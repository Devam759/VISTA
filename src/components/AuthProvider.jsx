"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { getMe } from "../lib/api";

const AuthContext = createContext({ role: null, token: null, user: null, isInitialized: false, setSession: () => {}, logout: () => {}, clearAuth: () => {} });

export function useAuth() {
  return useContext(AuthContext);
}

export default function AuthProvider({ children }) {
  const [role, setRole] = useState(null);
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [locationVerification, setLocationVerification] = useState(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window === "undefined") return;

    const savedToken = window.localStorage.getItem("vista_token");
    const savedRole = window.localStorage.getItem("vista_role");
    const savedUser = window.localStorage.getItem("vista_user");
    const savedLocationVerification = window.localStorage.getItem("vista_location_verification");

    if (savedToken && savedRole && savedUser) {
      setToken(savedToken);
      setRole(savedRole);
      try {
        setUser(JSON.parse(savedUser));
        if (savedLocationVerification) {
          setLocationVerification(JSON.parse(savedLocationVerification));
        }
      } catch {
        setUser(null);
        setLocationVerification(null);
        window.localStorage.removeItem("vista_token");
        window.localStorage.removeItem("vista_role");
        window.localStorage.removeItem("vista_user");
        window.localStorage.removeItem("vista_location_verification");
      }
    }

    setIsInitialized(true);
  }, []);

  useEffect(() => {
    if (!token || !pathname) return;
    if (pathname.startsWith("/login")) {
      router.replace("/");
    }
  }, [token, pathname, router]);

  const setSession = (nextToken, nextUser, locationData) => {
    setToken(nextToken);
    setRole(nextUser?.role || null);
    setUser(nextUser || null);
    setLocationVerification(locationData || null);

    if (typeof window !== "undefined") {
      window.localStorage.setItem("vista_token", nextToken);
      window.localStorage.setItem("vista_role", nextUser?.role || "");
      window.localStorage.setItem("vista_user", JSON.stringify(nextUser || null));

      if (locationData) {
        window.localStorage.setItem(
          "vista_location_verification",
          JSON.stringify(locationData)
        );
      } else {
        window.localStorage.removeItem("vista_location_verification");
      }
    }
  };

  const logout = () => {
    setToken(null);
    setRole(null);
    setUser(null);
    setLocationVerification(null);

    if (typeof window !== "undefined") {
      window.localStorage.removeItem("vista_token");
      window.localStorage.removeItem("vista_role");
      window.localStorage.removeItem("vista_user");
      window.localStorage.removeItem("vista_location_verification");
    }

    router.push("/login");
  };

  const clearAuth = () => {
    logout();
  };

  const value = useMemo(
    () => ({
      role,
      token,
      user,
      locationVerification,
      isInitialized,
      setSession,
      logout,
      clearAuth,
    }),
    [role, token, user, locationVerification, isInitialized]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
