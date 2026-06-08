import { Link } from 'react-router-dom'

const GRADIENT = 'radial-gradient(ellipse 80% 60% at 0% 0%, #052e16 0%, #0f0f0f 60%)'

export default function AuthShell({ children }) {
  return (
    <div className="min-h-screen flex flex-col" style={{ background: GRADIENT }}>
      <div className="flex-1 flex items-center justify-center px-4">
        <div className="w-full max-w-sm bg-bg-card border border-border rounded-2xl p-8">
          {children}
        </div>
      </div>
      <footer className="border-t border-border px-6 py-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-text-muted">© 2026 Caicai. All rights reserved.</p>
        <div className="flex items-center gap-6">
          <Link to="/privacy" className="text-sm text-text-muted hover:text-text-secondary">Privacy Policy</Link>
          <Link to="/terms"   className="text-sm text-text-muted hover:text-text-secondary">Terms of Service</Link>
        </div>
      </footer>
    </div>
  )
}