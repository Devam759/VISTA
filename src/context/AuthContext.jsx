import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { apiFetch } from '../utils/api.js'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState('')

  useEffect(() => {
    const stored = localStorage.getItem('vista-auth')
    if (stored) {
      try {
        const obj = JSON.parse(stored)
        setUser(obj.user || null)
        setToken(obj.token || '')
      } catch {}
    }
  }, [])

  const login = async (email, password) => {
    const em = (email || '').trim()
    const pass = (password || '').trim()
    if (!em || !pass) throw new Error('Enter credentials')

    let data
    try {
      data = await apiFetch('/auth/student-login', { method: 'POST', body: { email: em, password: pass } })
    } catch (e1) {
      data = await apiFetch('/auth/warden-login', { method: 'POST', body: { email: em, password: pass } })
    }

    const { token: tkn, role, user: u } = data || {}
    if (!tkn || !u) throw new Error('Invalid response')
    const auth = { token: tkn, role, user: { ...u, role } }
    localStorage.setItem('vista-auth', JSON.stringify(auth))
    setUser(auth.user)
    setToken(tkn)
    return auth.user
  }

  const logout = () => {
    localStorage.removeItem('vista-auth')
    setUser(null)
    setToken('')
  }

  const value = useMemo(() => ({ user, token, login, logout }), [user, token])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}

