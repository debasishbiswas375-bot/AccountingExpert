import React, { createContext, useContext, useState, useCallback } from 'react'
import type { User } from '@/types'

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isAdmin: boolean
  login: (identifier: string, password: string) => Promise<void>
  register: (data: RegisterData) => Promise<void>
  logout: () => void
  updateUser: (data: Partial<User>) => void
}

interface RegisterData {
  username: string
  full_name: string
  email: string
  contact_number: string
  address_line: string
  pincode: string
  district: string
  state: string
  country: string
  password: string
  company_name?: string
}

const AuthContext = createContext<AuthContextType | null>(null)

const DEMO_USER: User = {
  id: '1',
  username: 'demouser',
  full_name: 'Rajesh Kumar',
  email: 'rajesh@example.com',
  contact_number: '+91 9876543210',
  address_line: '123 MG Road',
  pincode: '560001',
  district: 'Bangalore Urban',
  state: 'Karnataka',
  country: 'India',
  company_name: 'Kumar Enterprises',
  role: 'user',
  plan_id: '2',
  credits: 45.5,
  plan_expiry: '2026-09-20',
  created_at: '2026-01-15',
}

const ADMIN_USER: User = {
  id: 'admin-1',
  username: 'adminuser',
  full_name: 'Admin User',
  email: 'admin@accountesy.com',
  contact_number: '+91 9999999999',
  address_line: 'Accountesy HQ',
  pincode: '110001',
  district: 'New Delhi',
  state: 'Delhi',
  country: 'India',
  company_name: 'Accountesy',
  role: 'admin',
  plan_id: null,
  credits: 999,
  plan_expiry: null,
  created_at: '2025-01-01',
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)

  const login = useCallback(async (identifier: string, _password: string) => {
    // Demo: admin login
    if (identifier === 'admin' || identifier === 'admin@accountesy.com') {
      setUser(ADMIN_USER)
      return
    }
    // Demo: any other login
    setUser(DEMO_USER)
  }, [])

  const register = useCallback(async (data: RegisterData) => {
    setUser({
      id: crypto.randomUUID(),
      username: data.username,
      full_name: data.full_name,
      email: data.email,
      contact_number: data.contact_number,
      address_line: data.address_line,
      pincode: data.pincode,
      district: data.district,
      state: data.state,
      country: data.country,
      company_name: data.company_name || '',
      role: 'user',
      plan_id: '1',
      credits: 10,
      plan_expiry: '2026-09-20',
      created_at: new Date().toISOString(),
    })
  }, [])

  const logout = useCallback(() => {
    setUser(null)
  }, [])

  const updateUser = useCallback((data: Partial<User>) => {
    setUser(prev => prev ? { ...prev, ...data } : null)
  }, [])

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'admin',
        login,
        register,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
