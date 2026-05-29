import Sidebar from './Sidebar'
import BottomNav from './BottomNav'
import MobileHeader from './MobileHeader'

export default function AppShell({ children }) {
  return (
    <div className="bg-bg-page">
      <Sidebar />
      <MobileHeader />
      <BottomNav />

      {/* Main content area */}
      <main className="md:ml-60 min-h-screen pt-14 pb-16 md:pt-0 md:pb-0">
        {children}
      </main>
    </div>
  )
}