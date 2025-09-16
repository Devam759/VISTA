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
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const savedToken = typeof window !== "undefined" ? window.localStorage.getItem("vista_token") : null;
    const savedRole = typeof window !== "undefined" ? window.localStorage.getItem("vista_role") : null;
    const savedUser = typeof window !== "undefined" ? window.localStorage.getItem("vista_user") : null;
    if (savedToken && !token) setToken(savedToken);
    if (savedRole && !role) setRole(savedRole);
    if (savedUser && !user) try { setUser(JSON.parse(savedUser)); } catch {}
  }, [role, token, user]);

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
    router.push("/login");
  }

  const value = useMemo(() => ({ role, token, user, setSession, logout }), [role, token, user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}


