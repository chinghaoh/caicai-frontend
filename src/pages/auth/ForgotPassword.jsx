import { useState } from 'react'
import { Link } from 'react-router-dom'
import { apiClient } from '@/apiClient'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [fieldErrors, setFieldErrors] = useState({})
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setFieldErrors({})
    setLoading(true)
    try {
      await apiClient('/api/auth/forgot-password', {
        method: 'POST',
        body: { email },
      })
      setSubmitted(true)
    } catch (err) {
      if (err.fieldErrors) setFieldErrors(err.fieldErrors)
      else setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-bg-page flex items-center justify-center px-4">
        <div className="w-full max-w-sm text-center">
          <h1 className="text-lg font-semibold text-text-primary mb-2">Check your email</h1>
          <p className="text-sm text-text-muted mb-6">
            If an account exists for <span className="text-text-secondary">{email}</span>, you'll
            receive a password reset link shortly.
          </p>
          <Link to="/login" className="text-sm text-green hover:opacity-80">
            Back to login
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-bg-page flex items-center justify-center px-4">
      <div className="w-full max-w-sm">

        <h1 className="text-lg font-semibold text-text-primary mb-1">Forgot your password?</h1>
        <p className="text-sm text-text-muted mb-8">
          Enter your email and we'll send you a reset link.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Input
            label="Email"
            type="email"
            value={email}
            onChange={e => {
              setEmail(e.target.value)
              setFieldErrors(prev => ({ ...prev, email: null }))
            }}
            placeholder="you@example.com"
            error={fieldErrors.email}
          />

          {error && <p className="text-xs text-red">{error}</p>}

          <Button type="submit" fullWidth loading={loading}>
            Send reset link
          </Button>
        </form>

        <p className="text-sm text-text-muted text-center mt-6">
          <Link to="/login" className="text-green hover:opacity-80">
            Back to login
          </Link>
        </p>
      </div>
    </div>
  )
}