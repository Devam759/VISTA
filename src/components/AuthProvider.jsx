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
  const [isInitialized, setIsInitialized] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Only run on client side
    if (typeof window === "undefined") return;
    
    const savedToken = window.localStorage.getItem("vista_token");
    const savedRole = window.localStorage.getItem("vista_role");
    const savedUser = window.localStorage.getItem("vista_user");
    
    if (savedToken && savedRole && savedUser) {
      setToken(savedToken);
      setRole(savedRole);
      try {
        setUser(JSON.parse(savedUser));
      } catch {
        setUser(null);
        // Clear invalid data
        window.localStorage.removeItem("vista_token");
        window.localStorage.removeItem("vista_role");
        window.localStorage.removeItem("vista_user");
      }
    }
    // No auto-login - let users authenticate properly
    
    setIsInitialized(true);
  }, []);

  useEffect(() => {
    async function hydrate() {
      if (token && !user) {
        try {
          const me = await getMe(token);
          setUser(me?.user || null);
          if (me?.user?.role) setRole(me.user.role);
        } catch {
          // If API call fails, clear the session
          console.warn('API call failed, clearing session');
          setToken(null);
          setUser(null);
          setRole(null);
          if (typeof window !== "undefined") {
            window.localStorage.removeItem("vista_token");
            window.localStorage.removeItem("vista_user");
            window.localStorage.removeItem("vista_role");
          }
          // Only redirect to login if we're not already on the login page
          if (pathname !== "/login") {
            router.push("/login");
          }
        }
      }
    }
    hydrate();
  }, [token, user, router, pathname]);

  function setSession(nextToken, nextUser) {
    setToken(nextToken || null);
    setUser(nextUser || null);
    setRole(nextUser?.role || null);
    if (typeof window !== "undefined") {
      if (nextToken) window.localStorage.setItem("vista_token", nextToken); else window.localStorage.removeItem("vista_token");
      if (nextUser) window.localStorage.setItem("vista_user", JSON.stringify(nextUser)); else window.localStorage.removeItem("vista_user");
      if (nextUser?.role) window.localStorage.setItem("vista_role", nextUser.role); else window.localStorage.removeItem("vista_role");
    }
  }

  function logout() {
    setToken(null);
    setUser(null);
    setRole(null);
    if (typeof window !== "undefined") {
      window.localStorage.removeItem("vista_token");
      window.localStorage.removeItem("vista_user");
      window.localStorage.removeItem("vista_role");
    }
    router.push("/login");
  }

  function clearAuth() {
    setToken(null);
    setUser(null);
    setRole(null);
    if (typeof window !== "undefined") {
      window.localStorage.removeItem("vista_token");
      window.localStorage.removeItem("vista_user");
      window.localStorage.removeItem("vista_role");
    }
  }

  const value = useMemo(() => ({ role, token, user, isInitialized, setSession, logout, clearAuth }), [role, token, user, isInitialized]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}


