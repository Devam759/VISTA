"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../components/AuthProvider";
import { loginWithEmailPassword } from "../../lib/api";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const { setSession, role: existingRole } = useAuth();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (existingRole) router.replace("/");
  }, [existingRole, router]);

  async function onSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { token, user } = await loginWithEmailPassword(email, password);
      setSession(token, user);
      router.replace("/");
    } catch (err) {
      // Fallback sample credentials for Student role
      if (email === "devamgupta@jklu.edu.in" && password === "abc") {
        setSession("mock-token", { id: 1, email, role: "Student" });
        router.replace("/");
      } else {
        setError(err.message || "Login failed");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-md mx-auto mt-16">
      <div className="rounded-2xl bg-white shadow-md p-6">
        <h1 className="text-xl font-semibold mb-4">Login</h1>
        <form onSubmit={onSubmit} className="space-y-3">
          <div>
            <label className="text-sm">Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-3 py-2 rounded-md border border-black/[.12] bg-white shadow-xs" />
          </div>
          <div>
            <label className="text-sm">Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-3 py-2 rounded-md border border-black/[.12] bg-white shadow-xs" />
          </div>
          {error ? <div className="text-sm text-rose-600">{error}</div> : null}
          <button disabled={loading} className="w-full px-3 py-2 rounded-md bg-black text-white disabled:opacity-60">{loading ? "Signing in..." : "Sign in"}</button>
        </form>
      </div>
    </div>
  );
}


