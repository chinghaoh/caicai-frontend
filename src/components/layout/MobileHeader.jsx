import { NavLink } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'

function UserAvatar({ name }) {
  const initial = name ? name.charAt(0).toUpperCase() : '?'
  return (
    <div className="w-8 h-8 rounded-full bg-green flex items-center justify-center flex-shrink-0">
      <span className="text-sm font-semibold text-white">{initial}</span>
    </div>
  )
}

export default function MobileHeader() {
  const { user } = useAuth()

  return (
    <header className="md:hidden fixed top-0 left-0 right-0 z-40 bg-bg-card border-b border-border h-14 flex items-center justify-between px-4">
      <span className="text-base font-bold text-green">Caicai</span>
      {user && (
        <NavLink to="/settings" className="cursor-pointer">
          <UserAvatar name={user.name} />
        </NavLink>
      )}
    </header>
  )
}