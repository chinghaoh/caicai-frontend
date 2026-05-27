import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { apiClient } from '@/apiClient'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'

export default function Register() {
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [fieldErrors, setFieldErrors] = useState({})
  const [registered, setRegistered] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setFieldErrors({})
    setLoading(true)
    try {
      await apiClient('/api/auth/register', {
        method: 'POST',
        body: { name, email, password },
      })
      setRegistered(true)
    } catch (err) {
      if (err.fieldErrors) setFieldErrors(err.fieldErrors)
      else setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (registered) {
    return (
      <div className="min-h-screen bg-bg-page flex items-center justify-center px-4">
        <div className="w-full max-w-sm text-center">
          <h1 className="text-lg font-semibold text-text-primary mb-2">Check your email</h1>
          <p className="text-sm text-text-muted mb-6">
            We sent a verification link to <span className="text-text-secondary">{email}</span>.
            Click it to activate your account.
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

        <h1 className="text-lg font-semibold text-text-primary mb-1">Create your account</h1>
        <p className="text-sm text-text-muted mb-8">Start tracking your nutrition today.</p>

        <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
          <Input
            label="Name"
            type="text"
            value={name}
            onChange={e => {
              setName(e.target.value)
              setFieldErrors(prev => ({ ...prev, name: null }))
            }}
            placeholder="Your name"
            error={fieldErrors.name}
          />
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
          <Input
            label="Password"
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
            Create account
          </Button>
        </form>

        <p className="text-sm text-text-muted text-center mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-green hover:opacity-80">
            Log in
          </Link>
        </p>
      </div>
    </div>
  )
}