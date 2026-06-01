import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { apiClient } from '@/apiClient'
import Button from '@/components/ui/Button'

export default function AccountTab({ user }) {
  const { logout } = useAuth()
  const navigate = useNavigate()

  const [resetSent, setResetSent] = useState(false)
  const [resetLoading, setResetLoading] = useState(false)
  const [resetError, setResetError] = useState(null)

  const [confirmDelete, setConfirmDelete] = useState(false)
  const [deleteLoading, setDeleteLoading] = useState(false)
  const [deleteError, setDeleteError] = useState(null)

  async function handlePasswordReset() {
    if (!user?.email) return
    setResetLoading(true)
    setResetError(null)
    try {
      await apiClient('/api/auth/forgot-password', {
        method: 'POST',
        body: { email: user.email },
      })
      setResetSent(true)
    } catch (err) {
      setResetError(err.message)
    } finally {
      setResetLoading(false)
    }
  }

  async function handleDelete() {
    setDeleteLoading(true)
    setDeleteError(null)
    try {
      await apiClient('/api/users/me', { method: 'DELETE' })
      await logout()
      navigate('/login')
    } catch (err) {
      setDeleteError(err.message)
      setDeleteLoading(false)
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <h2 className="text-lg font-semibold text-text-primary">Account</h2>

      {/* password reset */}
      <div className="bg-bg-card rounded-xl p-5 flex flex-col gap-3">
        <h3 className="text-base font-medium text-text-primary">Change Password</h3>
        <p className="text-sm text-text-muted">
          We'll send a password reset link to <span className="text-text-secondary">{user?.demo ? 'Demo account' : (user?.email ?? '—')}</span>.
        </p>
        {resetSent ? (
          <p className="text-sm text-green">Reset link sent — check your email.</p>
        ) : (
          <>
            {resetError && <p className="text-xs text-red">{resetError}</p>}
            <div>
              <Button variant="secondary" onClick={handlePasswordReset} loading={resetLoading}>
                Send Reset Link
              </Button>
            </div>
          </>
        )}
      </div>

      {/* delete account */}
      <div className="bg-bg-card rounded-xl p-5 flex flex-col gap-3 border border-red/30">
        <h3 className="text-base font-medium text-red">Delete Account</h3>
        <p className="text-sm text-text-muted">
          Permanently deletes your account and all data. This cannot be undone.
        </p>
        {!confirmDelete ? (
          <div>
            <Button variant="danger" onClick={() => setConfirmDelete(true)}>
              Delete Account
            </Button>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            <p className="text-sm font-medium text-text-primary">Are you sure? This is permanent.</p>
            {deleteError && <p className="text-xs text-red">{deleteError}</p>}
            <div className="flex gap-3">
              <Button variant="danger" onClick={handleDelete} loading={deleteLoading}>
                Yes, delete my account
              </Button>
              <Button variant="secondary" onClick={() => setConfirmDelete(false)}>
                Cancel
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}