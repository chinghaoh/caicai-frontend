import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { User, Target, Shield } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import ProfileTab from './ProfileTab'
import GoalsTab from './GoalsTab'
import AccountTab from './AccountTab'

const TABS = [
  { key: 'profile', label: 'Profile', icon: User },
  { key: 'goals',   label: 'Goals',   icon: Target },
  { key: 'account', label: 'Account', icon: Shield },
]

export default function Settings() {
  const { user, loading } = useAuth()
  const [searchParams, setSearchParams] = useSearchParams()
  const initialTab = searchParams.get('tab') ?? 'profile'
  const [activeTab, setActiveTab] = useState(
    TABS.find(t => t.key === initialTab) ? initialTab : 'profile'
  )

  function switchTab(key) {
    setActiveTab(key)
    setSearchParams({ tab: key })
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    )
  }

  return (
    <div className="px-4 py-6">
      <h1 className="text-lg font-semibold text-text-primary mb-6">Settings</h1>

      <div className="flex flex-col md:flex-row gap-6">

        <aside className="hidden md:flex flex-col gap-1 w-48 flex-shrink-0">
          {TABS.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => switchTab(key)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors cursor-pointer text-left ${
                activeTab === key
                  ? 'bg-bg-input text-text-primary'
                  : 'text-text-muted hover:text-text-secondary hover:bg-bg-input/50'
              }`}
            >
              <Icon size={16} strokeWidth={activeTab === key ? 2 : 1.5} />
              {label}
              {activeTab === key && (
                <span className="ml-auto w-1.5 h-1.5 rounded-full bg-green" />
              )}
            </button>
          ))}
        </aside>

        <div className="md:hidden flex border-b border-border mb-2">
          {TABS.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => switchTab(key)}
              className={`flex-1 py-2.5 text-sm font-medium transition-colors cursor-pointer ${
                activeTab === key
                  ? 'text-green border-b-2 border-green'
                  : 'text-text-muted'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="flex-1 min-w-0">
          {activeTab === 'profile' && <ProfileTab user={user} />}
          {activeTab === 'goals'   && <GoalsTab user={user} />}
          {activeTab === 'account' && <AccountTab user={user} />}
        </div>

      </div>
    </div>
  )
}