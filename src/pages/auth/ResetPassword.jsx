import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { apiClient } from '@/apiClient'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'

export default function ResetPassword() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token')

  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [fieldErrors, setFieldErrors] = useState({})

  if (!token) {
    return (
      <div className="min-h-screen bg-bg-page flex items-center justify-center px-4">
        <div className="w-full max-w-sm text-center">
          <h1 className="text-lg font-semibold text-text-primary mb-2">Invalid link</h1>
          <p className="text-sm text-text-muted mb-6">
            This password reset link is invalid or has expired.
          </p>
          <Link to="/forgot-password" className="text-sm text-green hover:opacity-80">
            Request a new link
          </Link>
        </div>
      </div>
    )
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setFieldErrors({})
    setLoading(true)
    try {
      await apiClient('/api/auth/reset-password', {
        method: 'POST',
        body: { token, password },
      })
      navigate('/login')
    } catch (err) {
      if (err.fieldErrors) setFieldErrors(err.fieldErrors)
      else setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-bg-page flex items-center justify-center px-4">
      <div className="w-full max-w-sm">

        <h1 className="text-lg font-semibold text-text-primary mb-1">Reset your password</h1>
        <p className="text-sm text-text-muted mb-8">Enter your new password below.</p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Input
            label="New password"
            type="password"
            value={password}
            onChange={e => {
              setPassword(e.target.value)
              setFieldErrors(prev => ({ ...prev, password: null }))
            }}
            placeholder="••••••••"
            error={fieldErrors.password}
          />
          <p className="text-xs text-text-muted -mt-2">
            Min 6 characters, one uppercase letter and one digit.
          </p>

          {error && <p className="text-xs text-red">{error}</p>}

          <Button type="submit" fullWidth loading={loading}>
            Reset password
          </Button>
        </form>
      </div>
    </div>
  )
}