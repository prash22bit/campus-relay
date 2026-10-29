import { createContext, useContext, useState, useEffect } from 'react'
import { adminLogin } from '../api/client'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [admin, setAdmin]   = useState(() => {
    try { return JSON.parse(localStorage.getItem('cr_admin')) } catch { return null }
  })
  const [token, setToken]   = useState(() => localStorage.getItem('cr_token') || null)
  const [loading, setLoading] = useState(false)

  const login = async (username, password) => {
    setLoading(true)
    try {
      const { data } = await adminLogin({ username, password })
      localStorage.setItem('cr_token', data.token)
      localStorage.setItem('cr_admin', JSON.stringify(data.admin))
      setToken(data.token)
      setAdmin(data.admin)
      return { success: true }
    } catch (err) {
      return { success: false, message: err.response?.data?.message || 'Login failed' }
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    localStorage.removeItem('cr_token')
    localStorage.removeItem('cr_admin')
    setToken(null)
    setAdmin(null)
  }

  return (
    <AuthContext.Provider value={{ admin, token, loading, login, logout, isAuthenticated: !!token }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
