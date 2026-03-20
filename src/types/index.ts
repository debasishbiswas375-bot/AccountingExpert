export interface User {
  id: string
  username: string
  full_name: string
  email: string
  contact_number: string
  address_line: string
  pincode: string
  district: string
  state: string
  country: string
  company_name: string
  role: 'user' | 'admin'
  plan_id: string | null
  credits: number
  plan_expiry: string | null
  created_at: string
}

export interface Plan {
  id: string
  name: string
  credits: number
  price: number
  validity_months: number
  is_active: boolean
  is_default_signup: boolean
  description: string
  features: string[]
}

export interface ConversionHistory {
  id: string
  user_id: string
  file_name: string
  date: string
  voucher_count: number
  credits_used: number
  xml_url: string | null
}

export interface Voucher {
  date: string
  description: string
  debit: number
  credit: number
  type: string
  ledger: string
  confidence?: number
}

export interface FeedbackQuery {
  id: string
  full_name: string
  email: string
  contact: string
  message: string
  created_at: string
  status: 'new' | 'reviewed' | 'resolved'
}

export interface DashboardStats {
  total_statements: number
  total_vouchers: number
  credits_used: number
  remaining_credits: number
  plan_expiry: string | null
  recent_activity: ConversionHistory[]
}

export interface AdminStats {
  total_users: number
  total_conversions: number
  total_vouchers: number
  total_credits_used: number
}
