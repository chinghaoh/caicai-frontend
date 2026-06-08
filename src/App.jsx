import { useState, useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { setSessionExpiredHandler } from './apiClient'
import { AuthProvider, useAuth } from './context/AuthContext'
import SessionExpiredModal from './components/ui/SessionExpiredModal'
import LoadingSpinner from './components/ui/LoadingSpinner'
import AppShell from './components/layout/AppShell'
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import ForgotPassword from './pages/auth/ForgotPassword'
import ResetPassword from './pages/auth/ResetPassword'
import VerifyPage from './pages/auth/VerifyPage'
import Onboarding from './pages/onboarding/Onboarding'
import Favourites from './pages/favourites/Favourites'
import FoodLog from './pages/food-log/FoodLog'
import Dashboard from './pages/dashboard/Dashboard'
import Settings from './pages/settings/Settings'
import AiPage from './pages/ai/AiPage'
import PrivacyPolicy from './pages/legal/PrivacyPolicy'
import TermsOfService from './pages/legal/TermsOfService'

function ProtectedRoute({ children, shell = true }) {
  const { isAuthenticated, loading, user } = useAuth()

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

  if (!user.verified) {
    return <Navigate to="/login" replace />
  }

  if (!shell) return children
  return <AppShell>{children}</AppShell>
}

function AuthRoute({ children }) {
  const { isAuthenticated, loading, user } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen bg-bg-page flex items-center justify-center">
        <LoadingSpinner />
      </div>
    )
  }

  if (isAuthenticated && user.verified) {
    return <Navigate to={user.hasCompletedOnboarding ? '/dashboard' : '/onboarding'} replace />
  }

  return children
}

function AppInner() {
  const [sessionExpired, setSessionExpired] = useState(false)

  useEffect(() => {
    setSessionExpiredHandler(() => setSessionExpired(true))
  }, [])

  return (
    <div className="min-h-screen bg-bg-page">
      <Routes>
        {/* Public pages — no auth required */}
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/terms"   element={<TermsOfService />} />

        {/* Auth pages — no shell */}
        <Route path="/login"           element={<AuthRoute><Login /></AuthRoute>} />
        <Route path="/register"        element={<AuthRoute><Register /></AuthRoute>} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password"  element={<ResetPassword />} />
        <Route path="/verify"          element={<VerifyPage />} />

        {/* Onboarding — protected but no shell (full-screen flow) */}
        <Route path="/onboarding" element={<ProtectedRoute shell={false}><Onboarding /></ProtectedRoute>} />

        {/* App pages — protected + shell */}
        <Route path="/dashboard"  element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/log"        element={<ProtectedRoute><FoodLog /></ProtectedRoute>} />
        <Route path="/favourites" element={<ProtectedRoute><Favourites /></ProtectedRoute>} />
        <Route path="/ai"         element={<ProtectedRoute><AiPage /></ProtectedRoute>} />
        <Route path="/settings"   element={<ProtectedRoute><Settings /></ProtectedRoute>} />

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>

      <SessionExpiredModal
        isOpen={sessionExpired}
        onClose={() => setSessionExpired(false)}
      />
    </div>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <AppInner />
    </AuthProvider>
  )
}