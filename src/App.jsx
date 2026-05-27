import { useState, useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { setSessionExpiredHandler } from './apiClient'
import SessionExpiredModal from './components/ui/SessionExpiredModal'
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import ForgotPassword from './pages/auth/ForgotPassword'
import ResetPassword from './pages/auth/ResetPassword'

export default function App() {
  const [sessionExpired, setSessionExpired] = useState(false)

  useEffect(() => {
    setSessionExpiredHandler(() => setSessionExpired(true))
  }, [])

  return (
    <div className="min-h-screen bg-bg-page">
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>

      <SessionExpiredModal
        isOpen={sessionExpired}
        onClose={() => setSessionExpired(false)}
      />
    </div>
  )
}