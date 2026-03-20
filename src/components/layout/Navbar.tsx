import { Link } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { Button } from '@/components/ui/button'
import { Menu, X } from 'lucide-react'
import { useState } from 'react'

export function Navbar() {
  const { isAuthenticated } = useAuth()
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass-effect border-b">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center">
            <span className="text-sm font-bold text-primary-foreground">A</span>
          </div>
          <span className="text-xl font-bold text-foreground tracking-tight">Accountesy</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-6">
          <a href="#features" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Features</a>
          <a href="#workflow" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">How it Works</a>
          <a href="#pricing" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Pricing</a>
          <Link to="/convert-excel" className="text-sm font-medium text-accent hover:text-accent/80 transition-colors">Free Excel Tool</Link>
        </nav>

        <div className="hidden md:flex items-center gap-3">
          {isAuthenticated ? (
            <Link to="/dashboard">
              <Button>Go to Dashboard</Button>
            </Link>
          ) : (
            <>
              <Link to="/login">
                <Button variant="ghost">Log in</Button>
              </Link>
              <Link to="/register">
                <Button variant="premium">Sign up free</Button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile toggle */}
        <button className="md:hidden text-foreground" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden border-t bg-background px-6 py-4 space-y-4 animate-fade-in">
          <a href="#features" className="block text-sm font-medium text-muted-foreground" onClick={() => setMobileOpen(false)}>Features</a>
          <a href="#workflow" className="block text-sm font-medium text-muted-foreground" onClick={() => setMobileOpen(false)}>How it Works</a>
          <a href="#pricing" className="block text-sm font-medium text-muted-foreground" onClick={() => setMobileOpen(false)}>Pricing</a>
          <Link to="/convert-excel" className="block text-sm font-medium text-accent" onClick={() => setMobileOpen(false)}>Free Excel Tool</Link>
          <div className="flex gap-3 pt-2">
            <Link to="/login" className="flex-1"><Button variant="outline" className="w-full">Log in</Button></Link>
            <Link to="/register" className="flex-1"><Button variant="premium" className="w-full">Sign up</Button></Link>
          </div>
        </div>
      )}
    </header>
  )
}
