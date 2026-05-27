import { useState, useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { setSessionExpiredHandler } from './apiClient'
import SessionExpiredModal from './components/ui/SessionExpiredModal'

export default function App() {
  const [sessionExpired, setSessionExpired] = useState(false)

  useEffect(() => {
    setSessionExpiredHandler(() => setSessionExpired(true))
  }, [])

  return (
    <div className="min-h-screen bg-bg-page">
      <Routes>
        <Route path="*" element={<p className="text-text-primary p-4">Caicai</p>} />
      </Routes>

      <SessionExpiredModal
        isOpen={sessionExpired}
        onClose={() => setSessionExpired(false)}
      />
    </div>
  )
}