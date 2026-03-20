import { useState, useCallback } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { useAuth } from '@/context/AuthContext'
import { useToast } from '@/components/ui/toast'
import { Eye, EyeOff, User, Mail, Phone, MapPin, Building, Check, RefreshCcw } from 'lucide-react'

interface FormData {
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
  confirm_password: string
  company_name: string
  captcha_input: string
}

const initialForm: FormData = {
  username: '', full_name: '', email: '', contact_number: '',
  address_line: '', pincode: '', district: '', state: '', country: '',
  password: '', confirm_password: '', company_name: '', captcha_input: '',
}

// Simple math CAPTCHA
function generateCaptcha() {
  const a = Math.floor(Math.random() * 20) + 1
  const b = Math.floor(Math.random() * 20) + 1
  return { question: `${a} + ${b} = ?`, answer: String(a + b) }
}

// Pincode data (demo)
const pincodeData: Record<string, { district: string; state: string; country: string }> = {
  '560001': { district: 'Bangalore Urban', state: 'Karnataka', country: 'India' },
  '110001': { district: 'New Delhi', state: 'Delhi', country: 'India' },
  '400001': { district: 'Mumbai', state: 'Maharashtra', country: 'India' },
  '600001': { district: 'Chennai', state: 'Tamil Nadu', country: 'India' },
  '700001': { district: 'Kolkata', state: 'West Bengal', country: 'India' },
  '500001': { district: 'Hyderabad', state: 'Telangana', country: 'India' },
}

export function Register() {
  const [form, setForm] = useState<FormData>(initialForm)
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [captcha, setCaptcha] = useState(generateCaptcha)
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({})
  const { register } = useAuth()
  const { addToast } = useToast()
  const navigate = useNavigate()

  const updateField = useCallback((field: keyof FormData, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }))
    setErrors(prev => ({ ...prev, [field]: undefined }))
  }, [])

  const handlePincodeChange = (value: string) => {
    updateField('pincode', value)
    const data = pincodeData[value]
    if (data) {
      setForm(prev => ({ ...prev, pincode: value, district: data.district, state: data.state, country: data.country }))
    }
  }

  const validate = (): boolean => {
    const errs: Partial<Record<keyof FormData, string>> = {}
    if (form.username.trim().length < 6) errs.username = 'Minimum 6 characters'
    if (form.username !== form.username.trim()) errs.username = 'No leading/trailing spaces'
    if (!form.full_name.trim()) errs.full_name = 'Required'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = 'Invalid email'
    if (!form.contact_number.trim()) errs.contact_number = 'Required'
    if (!form.pincode.trim()) errs.pincode = 'Required'
    if (form.password.length < 8) errs.password = 'Minimum 8 characters'
    if (form.password !== form.confirm_password) errs.confirm_password = 'Passwords do not match'
    if (form.captcha_input !== captcha.answer) errs.captcha_input = 'Incorrect answer'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return
    setLoading(true)
    try {
      await register({
        username: form.username.trim(),
        full_name: form.full_name.trim(),
        email: form.email.trim(),
        contact_number: form.contact_number.trim(),
        address_line: form.address_line.trim(),
        pincode: form.pincode.trim(),
        district: form.district.trim(),
        state: form.state.trim(),
        country: form.country.trim(),
        password: form.password,
        company_name: form.company_name.trim(),
      })
      addToast({ title: 'Account created successfully!', variant: 'success', description: 'Welcome to Accountesy' })
      navigate('/dashboard')
    } catch {
      addToast({ title: 'Registration failed', variant: 'destructive' })
    } finally {
      setLoading(false)
    }
  }

  const fieldGroup = (label: string, field: keyof FormData, icon: React.ReactNode, opts?: { type?: string; placeholder?: string; required?: boolean; onChange?: (v: string) => void }) => (
    <div>
      <label className="text-sm font-medium text-foreground mb-1.5 flex items-center gap-1.5">
        {label} {opts?.required !== false && <span className="text-destructive">*</span>}
      </label>
      <Input
        type={opts?.type || 'text'}
        value={form[field]}
        onChange={e => (opts?.onChange || ((v: string) => updateField(field, v)))(e.target.value)}
        placeholder={opts?.placeholder || `Enter ${label.toLowerCase()}`}
        icon={icon}
      />
      {errors[field] && <p className="text-xs text-destructive mt-1">{errors[field]}</p>}
    </div>
  )

  return (
    <div className="min-h-screen flex items-center justify-center bg-background relative px-4 py-8">
      <div className="absolute top-20 right-0 w-96 h-96 rounded-full bg-primary/5 blur-3xl" />
      <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full bg-accent/5 blur-3xl" />

      <div className="w-full max-w-2xl relative">
        <Link to="/" className="flex items-center justify-center gap-2 mb-8">
          <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center">
            <span className="text-lg font-bold text-primary-foreground">A</span>
          </div>
          <span className="text-2xl font-bold text-foreground">Accountesy</span>
        </Link>

        <Card className="shadow-elegant animate-fade-in">
          <CardHeader className="text-center pb-2">
            <CardTitle className="text-xl">Create Your Account</CardTitle>
            <CardDescription>Fill in the details below to get started</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                {fieldGroup('Username', 'username', <User className="h-4 w-4" />, { placeholder: 'Min 6 characters' })}
                {fieldGroup('Full Name', 'full_name', <User className="h-4 w-4" />)}
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                {fieldGroup('Email', 'email', <Mail className="h-4 w-4" />, { type: 'email' })}
                {fieldGroup('Contact Number', 'contact_number', <Phone className="h-4 w-4" />, { placeholder: '+91 9876543210' })}
              </div>

              {/* Address */}
              <div className="border-t pt-4 mt-4">
                <p className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                  <MapPin className="h-4 w-4" /> Address Details
                </p>
                {fieldGroup('Address Line', 'address_line', <MapPin className="h-4 w-4" />, { required: false })}
                <div className="grid md:grid-cols-2 gap-4 mt-4">
                  {fieldGroup('Pincode', 'pincode', <MapPin className="h-4 w-4" />, {
                    placeholder: 'Enter pincode for auto-fill',
                    onChange: handlePincodeChange,
                  })}
                  {fieldGroup('District', 'district', <MapPin className="h-4 w-4" />, { placeholder: 'Auto-filled from pincode' })}
                </div>
                <div className="grid md:grid-cols-2 gap-4 mt-4">
                  {fieldGroup('State', 'state', <MapPin className="h-4 w-4" />, { placeholder: 'Auto-filled from pincode' })}
                  {fieldGroup('Country', 'country', <MapPin className="h-4 w-4" />, { placeholder: 'Auto-filled from pincode' })}
                </div>
              </div>

              <div className="border-t pt-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-foreground mb-1.5 flex items-center gap-1.5">
                      Password <span className="text-destructive">*</span>
                    </label>
                    <div className="relative">
                      <Input
                        type={showPassword ? 'text' : 'password'}
                        value={form.password}
                        onChange={e => updateField('password', e.target.value)}
                        placeholder="Min 8 characters"
                      />
                      <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                    {errors.password && <p className="text-xs text-destructive mt-1">{errors.password}</p>}
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground mb-1.5 block">
                      Confirm Password <span className="text-destructive">*</span>
                    </label>
                    <Input
                      type="password"
                      value={form.confirm_password}
                      onChange={e => updateField('confirm_password', e.target.value)}
                      placeholder="Re-enter password"
                    />
                    {errors.confirm_password && <p className="text-xs text-destructive mt-1">{errors.confirm_password}</p>}
                  </div>
                </div>
              </div>

              {fieldGroup('Company Name', 'company_name', <Building className="h-4 w-4" />, { required: false })}

              {/* CAPTCHA */}
              <div className="border-t pt-4">
                <label className="text-sm font-medium text-foreground mb-1.5 flex items-center gap-2">
                  <Check className="h-4 w-4" /> Verify you are human
                </label>
                <div className="flex items-center gap-3">
                  <div className="bg-muted px-4 py-2 rounded-md text-sm font-mono font-semibold text-foreground select-none">
                    {captcha.question}
                  </div>
                  <button type="button" onClick={() => setCaptcha(generateCaptcha())} className="text-muted-foreground hover:text-foreground transition-colors">
                    <RefreshCcw className="h-4 w-4" />
                  </button>
                  <Input
                    value={form.captcha_input}
                    onChange={e => updateField('captcha_input', e.target.value)}
                    placeholder="Answer"
                    className="w-28"
                  />
                </div>
                {errors.captcha_input && <p className="text-xs text-destructive mt-1">{errors.captcha_input}</p>}
              </div>

              <Button type="submit" variant="premium" className="w-full" size="lg" disabled={loading}>
                {loading ? 'Creating account...' : 'Create Account'}
              </Button>
            </form>

            <p className="text-center text-sm text-muted-foreground mt-6">
              Already have an account?{' '}
              <Link to="/login" className="text-primary font-medium hover:underline">
                Sign in
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
