import { createContext, useContext, useState, useEffect } from 'react'
import { apiClient } from '@/apiClient'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    apiClient('/api/users/me')
      .then(data => {
        setUser(data)})
      .catch(() => setUser(null))
      .finally(() => setLoading(false))
  }, [])

  function login(userData) {
    
    setUser(userData)
  }

  async function logout() {
    try {
      await apiClient('/api/auth/logout', { method: 'POST' })
    } catch {
    }
    setUser(null)
  }

  function completeOnboarding() {
    setUser(prev => ({ ...prev, hasCompletedOnboarding: true }))
  }

  function updateUser(patch) {
    setUser(prev => ({ ...prev, ...patch }))
  }

  const value = {
    user,
    loading,
    isAuthenticated: !!user,
    login,
    logout,
    completeOnboarding,
    updateUser,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}