import { useNavigate } from 'react-router-dom'

export default function SessionExpiredModal({ isOpen, onClose }) {
  const navigate = useNavigate()

  if (!isOpen) return null

  const handleLogin = () => {
    onClose()
    navigate('/login')
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="bg-bg-card border border-border rounded-xl p-6 w-full max-w-sm mx-4">
        <h2 className="text-base font-semibold text-text-primary mb-2">Session expired</h2>
        <p className="text-sm text-text-muted mb-6">
          Your session has expired. Please log in again.
        </p>
        <button
          onClick={handleLogin}
          className="w-full bg-green text-white rounded-lg px-4 py-2 font-semibold hover:opacity-90"
        >
          Log in
        </button>
      </div>
    </div>
  )
}