import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { apiClient } from '@/apiClient'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'

export default function Login() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [fieldErrors, setFieldErrors] = useState({})

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setFieldErrors({})
    setLoading(true)
    try {
      await apiClient('/api/auth/login', {
        method: 'POST',
        body: { email, password },
      })
      navigate('/dashboard')
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

        <h1 className="text-lg font-semibold text-text-primary mb-1">Caicai</h1>
        <p className="text-sm text-text-muted mb-8">Track your nutrition. Reach your goals.</p>

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

          {error && <p className="text-xs text-red">{error}</p>}

          <div className="flex justify-end">
            <Link to="/forgot-password" className="text-sm text-text-muted hover:text-text-secondary">
              Forgot password?
            </Link>
          </div>

          <Button type="submit" fullWidth loading={loading}>
            Log in
          </Button>
        </form>

        <p className="text-sm text-text-muted text-center mt-6">
          Don't have an account?{' '}
          <Link to="/register" className="text-green hover:opacity-80">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  )
}