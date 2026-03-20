import { Link, useLocation } from 'react-router-dom'
import {
  LayoutDashboard,
  FileCode2,
  FileSpreadsheet,
  CreditCard,
  History,
  HelpCircle,
  UserCircle,
  LogOut,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'
import { useState } from 'react'
import { useAuth } from '@/context/AuthContext'

const navItems = [
  { label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
  { label: 'Convert to XML', icon: FileCode2, path: '/convert-xml' },
  { label: 'Convert to Excel', icon: FileSpreadsheet, path: '/convert-excel' },
  { label: 'Plans / Pricing', icon: CreditCard, path: '/pricing' },
  { label: 'History', icon: History, path: '/history' },
  { label: 'Help & Features', icon: HelpCircle, path: '/help' },
  { label: 'Account', icon: UserCircle, path: '/account' },
]

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false)
  const location = useLocation()
  const { logout, user } = useAuth()

  return (
    <aside
      className={`fixed left-0 top-0 h-screen bg-sidebar text-sidebar-foreground flex flex-col transition-all duration-300 z-40 ${
        collapsed ? 'w-[68px]' : 'w-[260px]'
      }`}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 h-16 border-b border-sidebar-hover">
        <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center">
          <span className="text-sm font-bold text-primary-foreground">A</span>
        </div>
        {!collapsed && (
          <span className="text-lg font-bold text-primary-foreground tracking-tight">
            Accountesy
          </span>
        )}
      </div>

      {/* Nav Items */}
      <nav className="flex-1 py-4 px-2 space-y-1 overflow-y-auto">
        {navItems.map(item => {
          const isActive = location.pathname === item.path
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group ${
                isActive
                  ? 'bg-sidebar-active text-sidebar-active-foreground shadow-elegant'
                  : 'text-sidebar-foreground hover:bg-sidebar-hover hover:text-primary-foreground'
              }`}
              title={collapsed ? item.label : undefined}
            >
              <item.icon className={`h-5 w-5 flex-shrink-0 ${isActive ? '' : 'opacity-70 group-hover:opacity-100'}`} />
              {!collapsed && <span className="text-sm font-medium">{item.label}</span>}
            </Link>
          )
        })}
      </nav>

      {/* User & Logout */}
      <div className="border-t border-sidebar-hover p-3">
        {!collapsed && user && (
          <div className="px-2 mb-3">
            <p className="text-sm font-medium text-primary-foreground truncate">{user.full_name}</p>
            <p className="text-xs text-sidebar-foreground truncate">{user.email}</p>
          </div>
        )}
        <button
          onClick={logout}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg w-full text-sidebar-foreground hover:bg-destructive/20 hover:text-destructive transition-all duration-200"
          title={collapsed ? 'Logout' : undefined}
        >
          <LogOut className="h-5 w-5 flex-shrink-0" />
          {!collapsed && <span className="text-sm font-medium">Logout</span>}
        </button>
      </div>

      {/* Collapse toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-20 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-elegant hover:shadow-glow transition-all duration-200"
      >
        {collapsed ? <ChevronRight className="h-3 w-3" /> : <ChevronLeft className="h-3 w-3" />}
      </button>
    </aside>
  )
}
