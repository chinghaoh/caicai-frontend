import { NavLink, useNavigate } from 'react-router-dom'
import { LayoutDashboard, PlusCircle, Sparkles, Settings, LogOut } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'

const NAV_ITEMS = [
  { label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
  { label: 'Log',       icon: PlusCircle,      path: '/log'       },
  { label: 'AI', icon: Sparkles, path: '/ai' },
  { label: 'Settings',  icon: Settings,        path: '/settings'  },
]

function UserAvatar({ name }) {
  const initial = name ? name.charAt(0).toUpperCase() : '?'
  return (
    <div className="w-8 h-8 rounded-full bg-green flex items-center justify-center flex-shrink-0">
      <span className="text-sm font-semibold text-white">{initial}</span>
    </div>
  )
}

export default function Sidebar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  async function handleLogout() {
    await logout()
    navigate('/login')
  }

  return (
    <aside className="hidden md:flex flex-col w-60 min-h-screen bg-bg-card border-r border-border fixed top-0 left-0 z-40">

      {/* Top — wordmark only */}
      <div className="px-5 pt-6 pb-4 border-b border-border">
        <span className="text-lg font-bold text-green">Caicai</span>
      </div>

      {/* Nav items */}
      <nav className="flex-1 px-3 py-4 flex flex-col gap-1">
        {NAV_ITEMS.map(({ label, icon: Icon, path }) => (
          <NavLink
            key={path}
            to={path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition-colors ${
                isActive
                  ? 'text-text-primary bg-bg-input'
                  : 'text-text-muted hover:text-text-secondary hover:bg-bg-input/50'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <Icon size={18} strokeWidth={isActive ? 2 : 1.5} />
                <span className="text-sm font-medium">{label}</span>
                {isActive && (
                  <span className="ml-auto w-1.5 h-1.5 rounded-full bg-green" />
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Bottom — user card → /profile, logout inline */}
      {user && (
        <div className="border-t border-border px-4 py-3 flex items-center gap-3">
          <NavLink to="/settings" className="flex-shrink-0">
            <UserAvatar name={user.name} />
          </NavLink>
          <div className="min-w-0 flex-1">
            <NavLink to="/profile" className="block">
              <p className="text-sm font-medium text-text-primary truncate hover:text-green transition-colors">{user.name}</p>
            </NavLink>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1 text-xs text-text-muted hover:text-red transition-colors cursor-pointer mt-0.5"
            >
              <LogOut size={12} strokeWidth={1.5} />
              <span>Log out</span>
            </button>
          </div>
        </div>
      )}
    </aside>
  )
}