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
    if (!em || !pass) throw new Error('Please enter both email and password')

    let data
    let error = null
    
    // Try student login first
    try {
      data = await apiFetch('/auth/student-login', { 
        method: 'POST', 
        body: { email: em, password: pass } 
      })
    } catch (e1) {
      error = e1
      // If student login fails with 401, try warden login
      if (e1.status === 401) {
        try {
          data = await apiFetch('/auth/warden-login', { 
            method: 'POST', 
            body: { email: em, password: pass } 
          })
          error = null
        } catch (e2) {
          error = e2
        }
      }
    }

    // If we have data, login was successful
    if (data && data.token && data.user) {
      const { token: tkn, role, user: u } = data
      const auth = { token: tkn, role, user: { ...u, role } }
      localStorage.setItem('vista-auth', JSON.stringify(auth))
      setUser(auth.user)
      setToken(tkn)
      return auth.user
    }
    
    // If we get here, all login attempts failed
    throw error || new Error('Login failed. Please check your credentials.')
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

