import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'

const AuthContext = createContext(null)

const demoUsers = [
  {
    id: '2024btech014',
    password: '123',
    role: 'student',
    roll: '2024btech014',
    name: 'Sample Student',
    hostel: 'Hostel A',
    room: 'A-101',
  },
  {
    id: 'karan',
    password: '123',
    role: 'warden',
    name: 'Karan',
  },
]

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)

  useEffect(() => {
    const stored = localStorage.getItem('vista-user')
    if (stored) setUser(JSON.parse(stored))
  }, [])

  const login = async (identifier, password) => {
    const id = (identifier || '').trim().toLowerCase()
    const pass = (password || '').trim()
    // Dummy logic: match against fixed users (ID case-insensitive)
    if (!id || !pass) throw new Error('Enter credentials')

    const found = demoUsers.find(u => u.id.toLowerCase() === id)
    if (!found || found.password !== pass) {
      throw new Error('Invalid credentials')
    }

    const { password: _p, ...safeUser } = found
    localStorage.setItem('vista-user', JSON.stringify(safeUser))
    setUser(safeUser)
    return safeUser
  }

  const logout = () => {
    localStorage.removeItem('vista-user')
    setUser(null)
  }

  const value = useMemo(() => ({ user, login, logout }), [user])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
