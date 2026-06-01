  import { useEffect, useState } from 'react'
  import { useSearchParams, Link } from 'react-router-dom'
  import AuthShell from '@/components/ui/AuthShell'
  import LoadingSpinner from '@/components/ui/LoadingSpinner'
  import { apiClient } from '@/apiClient'

  export default function VerifyPage() {
    const [searchParams] = useSearchParams()
    const [status, setStatus] = useState('loading') 
    const [message, setMessage] = useState('')

    useEffect(() => {
      const token = searchParams.get('token')

      if (!token) {
        setStatus('error')
        setMessage('No verification token found. Please check your email link.')
        return
      }

      apiClient(`/api/auth/verify?token=${token}`, { method: 'GET' })
        .then(() => setStatus('success'))
        .catch((err) => {
          setStatus('error')
          setMessage(err.message || 'This link is invalid or has already been used.')
        })
    }, [])

    return (
      <AuthShell>
        <div className="flex flex-col items-center text-center gap-6 py-4">

          {status === 'loading' && (
            <>
              <LoadingSpinner />
              <p className="text-text-muted text-sm">Verifying your email...</p>
            </>
          )}

          {status === 'success' && (
            <>
              <div className="w-14 h-14 rounded-full bg-green-500/10 flex items-center justify-center">
                <svg className="w-7 h-7 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <h1 className="text-lg font-semibold text-text-primary">Email verified</h1>
                <p className="text-text-muted text-sm mt-1">Your account is ready. You can now sign in.</p>
              </div>
              <Link
                to="/login"
                className="w-full bg-green-500 hover:bg-green-400 text-black font-semibold text-sm py-3 rounded-xl transition-colors cursor-pointer text-center"
              >
                Go to login
              </Link>
            </>
          )}

          {status === 'error' && (
            <>
              <div className="w-14 h-14 rounded-full bg-red-500/10 flex items-center justify-center">
                <svg className="w-7 h-7 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <div>
                <h1 className="text-lg font-semibold text-text-primary">Verification failed</h1>
                <p className="text-text-muted text-sm mt-1">{message}</p>
              </div>
              <Link
                to="/login"
                className="w-full border border-border text-text-primary hover:bg-bg-card font-semibold text-sm py-3 rounded-xl transition-colors cursor-pointer text-center"
              >
                Back to login
              </Link>
            </>
          )}

        </div>
      </AuthShell>
    )
  }