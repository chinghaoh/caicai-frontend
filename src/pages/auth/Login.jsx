import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { apiClient } from '@/apiClient'
import { useAuth } from '@/context/AuthContext'
import AuthShell from '@/components/ui/AuthShell'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'

export default function Login() {
  const navigate = useNavigate()
  const { login } = useAuth()

  const [email, setEmail]             = useState('')
  const [password, setPassword]       = useState('')
  const [loading, setLoading]         = useState(false)
  const [demoLoading, setDemoLoading] = useState(false)
  const [error, setError]             = useState(null)
  const [fieldErrors, setFieldErrors] = useState({})

  async function handleSubmit(e) {
    e.preventDefault()
    setError(null)
    setFieldErrors({})
    setLoading(true)
    try {
      const data = await apiClient('/api/auth/login', {
        method: 'POST',
        body: { email, password },
      })
      console.log('handleSubmit data:', data)
      login(data)
      navigate(data.hasCompletedOnboarding ? '/dashboard' : '/onboarding')
    } catch (err) {
      if (err.fieldErrors) setFieldErrors(err.fieldErrors)
      else setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  async function handleDemo() {
    setError(null)
    setDemoLoading(true)
    try {
      const data = await apiClient('/api/auth/demo', { method: 'POST' })
      login(data)
      navigate('/onboarding')
    } catch (err) {
      setError(err.message)
    } finally {
      setDemoLoading(false)
    }
  }

  return (
    <AuthShell>
      <h1 className="text-2xl font-bold text-green mb-1">Caicai</h1>
      <p className="text-sm text-text-muted mb-8">Track your nutrition. Reach your goals.</p>

      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
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
          labelAction={
            <Link to="/forgot-password" className="text-sm text-text-muted hover:text-text-secondary">
              Forgot password?
            </Link>
          }
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

      <div className="flex items-center gap-3 my-6">
        <div className="flex-1 h-px bg-border" />
        <span className="text-xs text-text-muted">or</span>
        <div className="flex-1 h-px bg-border" />
      </div>

      <Button variant="secondary" fullWidth loading={demoLoading} onClick={handleDemo}>
        Try a demo account
      </Button>
      <p className="text-xs text-text-muted text-center mt-2">
        No sign up needed. Demo data is deleted after 2 hours.
      </p>
    </AuthShell>
  )
}