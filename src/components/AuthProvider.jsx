"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { getMe } from "../lib/api";

const AuthContext = createContext({ role: null, token: null, user: null, setSession: () => {}, logout: () => {} });

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
      }
    } else {
      // Auto-login as Warden if no session exists
      const mockUser = { id: 1, email: "warden@jklu.edu.in", role: "Warden" };
      setToken("mock-token");
      setRole("Warden");
      setUser(mockUser);
      window.localStorage.setItem("vista_token", "mock-token");
      window.localStorage.setItem("vista_role", "Warden");
      window.localStorage.setItem("vista_user", JSON.stringify(mockUser));
    }
    
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
          // invalid token
          logout();
        }
      }
    }
    hydrate();
  }, [token, user]);

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
    // Immediately auto-login as Warden again to keep the app usable without login
    const mockUser = { id: 1, email: "warden@jklu.edu.in", role: "Warden" };
    setToken("mock-token");
    setRole("Warden");
    setUser(mockUser);
    if (typeof window !== "undefined") {
      window.localStorage.setItem("vista_token", "mock-token");
      window.localStorage.setItem("vista_role", "Warden");
      window.localStorage.setItem("vista_user", JSON.stringify(mockUser));
    }
    router.push("/");
  }

  const value = useMemo(() => ({ role, token, user, setSession, logout }), [role, token, user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}


