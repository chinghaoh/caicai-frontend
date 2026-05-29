import { useState } from 'react'
import { Link } from 'react-router-dom'
import { apiClient } from '@/apiClient'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'

const FOOTER_GRADIENT = 'radial-gradient(ellipse 80% 60% at 0% 0%, #052e16 0%, #0f0f0f 60%)'

function AuthShell({ children }) {
  return (
    <div className="min-h-screen flex flex-col" style={{ background: FOOTER_GRADIENT }}>
      <div className="flex-1 flex items-center justify-center px-4">
        <div className="w-full max-w-sm bg-bg-card border border-border rounded-2xl p-8">
          {children}
        </div>
      </div>
      <footer className="border-t border-border px-6 py-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-text-muted">© 2024 Caicai Nutrition. All rights reserved.</p>
        <div className="flex items-center gap-6">
          <a href="#" className="text-sm text-text-muted hover:text-text-secondary">Privacy Policy</a>
          <a href="#" className="text-sm text-text-muted hover:text-text-secondary">Terms of Service</a>
          <a href="#" className="text-sm text-text-muted hover:text-text-secondary">Support</a>
        </div>
      </footer>
    </div>
  )
}

export default function Register() {
  const [name, setName]               = useState('')
  const [email, setEmail]             = useState('')
  const [password, setPassword]       = useState('')
  const [loading, setLoading]         = useState(false)
  const [error, setError]             = useState(null)
  const [fieldErrors, setFieldErrors] = useState({})
  const [registered, setRegistered]   = useState(false)

  async function handleSubmit(e) {
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
      <AuthShell>
        <h1 className="text-2xl font-bold text-green mb-1">Check your email</h1>
        <p className="text-sm text-text-muted mt-2 mb-6">
          We sent a verification link to{' '}
          <span className="text-text-secondary">{email}</span>.
          Click it to activate your account.
        </p>
        <Link to="/login" className="text-sm text-green hover:opacity-80">
          Back to login
        </Link>
      </AuthShell>
    )
  }

  return (
    <AuthShell>
      <h1 className="text-2xl font-bold text-green mb-1">Caicai</h1>
      <p className="text-sm text-text-muted mb-8">Create your account. It's free.</p>

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
    </AuthShell>
  )
}