import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from '@/context/AuthContext'
import { ToastProvider } from '@/components/ui/toast'
import { AppLayout } from '@/components/layout/AppLayout'
import { Landing } from '@/pages/Landing'
import { Login } from '@/pages/Login'
import { Register } from '@/pages/Register'
import { ForgotPassword } from '@/pages/ForgotPassword'
import { Dashboard } from '@/pages/Dashboard'
import { ConvertXML } from '@/pages/ConvertXML'
import { ConvertExcel } from '@/pages/ConvertExcel'
import { Pricing } from '@/pages/Pricing'
import { HistoryPage } from '@/pages/History'
import { Help } from '@/pages/Help'
import { Account } from '@/pages/Account'
import { Feedback } from '@/pages/Feedback'
import { AdminLayout } from '@/pages/admin/AdminLayout'
import { AdminDashboard } from '@/pages/admin/AdminDashboard'
import { UserManagement } from '@/pages/admin/UserManagement'
import { PlanManagement } from '@/pages/admin/PlanManagement'
import { QueryManagement } from '@/pages/admin/QueryManagement'

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth()
  if (!isAuthenticated) return <Navigate to="/login" replace />
  return <>{children}</>
}

function AdminRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isAdmin } = useAuth()
  if (!isAuthenticated) return <Navigate to="/login" replace />
  if (!isAdmin) return <Navigate to="/dashboard" replace />
  return <>{children}</>
}

function AppRoutes() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/feedback" element={<Feedback />} />
      {/* Free Excel tool — no auth needed */}
      <Route path="/convert-excel" element={<ConvertExcel />} />

      {/* Protected app routes */}
      <Route element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/convert-xml" element={<ConvertXML />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/history" element={<HistoryPage />} />
        <Route path="/help" element={<Help />} />
        <Route path="/account" element={<Account />} />
      </Route>

      {/* Admin routes */}
      <Route element={<AdminRoute><AdminLayout /></AdminRoute>}>
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/users" element={<UserManagement />} />
        <Route path="/admin/plans" element={<PlanManagement />} />
        <Route path="/admin/queries" element={<QueryManagement />} />
      </Route>

      {/* Catch all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider>
          <AppRoutes />
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
