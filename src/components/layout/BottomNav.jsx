import { NavLink } from 'react-router-dom'
import { LayoutDashboard, PlusCircle, TrendingUp, Target, Settings } from 'lucide-react'

const NAV_ITEMS = [
  { label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
  { label: 'Log',       icon: PlusCircle,      path: '/log'       },
  { label: 'Trends',    icon: TrendingUp,      path: '/trends'    },
  { label: 'Goals',     icon: Target,          path: '/goals'     },
  { label: 'Settings',  icon: Settings,        path: '/settings'  },
]

export default function BottomNav() {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-bg-card border-t border-border">
      <div className="flex items-center justify-around h-16 px-2">
        {NAV_ITEMS.map(({ label, icon: Icon, path }) => (
          <NavLink
            key={path}
            to={path}
            className={({ isActive }) =>
              `flex flex-col items-center gap-0.5 px-3 py-1 cursor-pointer ${
                isActive ? 'text-text-primary' : 'text-text-muted'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <Icon size={22} strokeWidth={isActive ? 2 : 1.5} />
                <span className="text-xs">{label}</span>
                {isActive && (
                  <span className="w-1 h-1 rounded-full bg-green" />
                )}
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  )
}