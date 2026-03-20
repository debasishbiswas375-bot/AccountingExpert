import { Outlet, Link, useLocation } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import {
  Users, CreditCard, MessageSquare, BarChart3,
  LogOut, ChevronLeft, Shield,
} from 'lucide-react'

const adminNav = [
  { label: 'Dashboard', icon: BarChart3, path: '/admin' },
  { label: 'Users', icon: Users, path: '/admin/users' },
  { label: 'Plans', icon: CreditCard, path: '/admin/plans' },
  { label: 'Queries', icon: MessageSquare, path: '/admin/queries' },
]

export function AdminLayout() {
  const location = useLocation()
  const { logout } = useAuth()

  return (
    <div className="min-h-screen bg-background">
      {/* Admin Sidebar */}
      <aside className="fixed left-0 top-0 h-screen w-[240px] bg-sidebar text-sidebar-foreground flex flex-col z-40">
        <div className="flex items-center gap-3 px-4 h-16 border-b border-sidebar-hover">
          <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-destructive/80 flex items-center justify-center">
            <Shield className="h-4 w-4 text-primary-foreground" />
          </div>
          <span className="text-lg font-bold text-primary-foreground">Admin Panel</span>
        </div>

        <nav className="flex-1 py-4 px-2 space-y-1">
          {adminNav.map(item => {
            const isActive = location.pathname === item.path
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 ${
                  isActive
                    ? 'bg-sidebar-active text-sidebar-active-foreground shadow-elegant'
                    : 'text-sidebar-foreground hover:bg-sidebar-hover hover:text-primary-foreground'
                }`}
              >
                <item.icon className="h-5 w-5" />
                <span className="text-sm font-medium">{item.label}</span>
              </Link>
            )
          })}
        </nav>

        <div className="border-t border-sidebar-hover p-3 space-y-2">
          <Link
            to="/dashboard"
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-sidebar-foreground hover:bg-sidebar-hover hover:text-primary-foreground transition-all"
          >
            <ChevronLeft className="h-5 w-5" />
            <span className="text-sm">Back to App</span>
          </Link>
          <button
            onClick={logout}
            className="flex items-center gap-3 px-3 py-2 rounded-lg w-full text-sidebar-foreground hover:bg-destructive/20 hover:text-destructive transition-all"
          >
            <LogOut className="h-5 w-5" />
            <span className="text-sm font-medium">Logout</span>
          </button>
        </div>
      </aside>

      <main className="ml-[240px] min-h-screen p-8">
        <Outlet />
      </main>
    </div>
  )
}
