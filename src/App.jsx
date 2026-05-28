import { useState, useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { setSessionExpiredHandler } from './apiClient'
import { AuthProvider, useAuth } from './context/AuthContext'
import SessionExpiredModal from './components/ui/SessionExpiredModal'
import LoadingSpinner from './components/ui/LoadingSpinner'
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import ForgotPassword from './pages/auth/ForgotPassword'
import ResetPassword from './pages/auth/ResetPassword'
import Onboarding from './pages/onboarding/Onboarding'

// ── Protected route — redirects to /login if not authenticated
function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen bg-bg-page flex items-center justify-center">
        <LoadingSpinner />
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return children
}

// ── Auth route — redirects authenticated users away from auth pages
function AuthRoute({ children }) {
  const { isAuthenticated, loading, user } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen bg-bg-page flex items-center justify-center">
        <LoadingSpinner />
      </div>
    )
  }

  if (isAuthenticated) {
    return <Navigate to={user.hasCompletedOnboarding ? '/dashboard' : '/onboarding'} replace />
  }

  return children
}

// ── Inner app —
function AppInner() {
  const [sessionExpired, setSessionExpired] = useState(false)

  useEffect(() => {
    setSessionExpiredHandler(() => setSessionExpired(true))
  }, [])

  return (
    <div className="min-h-screen bg-bg-page">
      <Routes>
        {/* Auth routes — redirect to dashboard if already logged in*/}
        <Route path="/login"          element={<AuthRoute><Login /></AuthRoute>} />
        <Route path="/register"       element={<AuthRoute><Register /></AuthRoute>} />
        <Route path="/forgot-password"element={<AuthRoute><ForgotPassword /></AuthRoute>} />
        <Route path="/reset-password" element={<AuthRoute><ResetPassword /></AuthRoute>} />

        {/* Protected routes — redirect to login if not authenticated */}
        <Route path="/onboarding" element={<ProtectedRoute><Onboarding /></ProtectedRoute>} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>

      <SessionExpiredModal
        isOpen={sessionExpired}
        onClose={() => setSessionExpired(false)}
      />
    </div>
  )
}

// ── Root —
export default function App() {
  return (
    <AuthProvider>
      <AppInner />
    </AuthProvider>
  )
}