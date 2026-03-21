import { useState, useCallback } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
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

// CAPTCHA
function generateCaptcha() {
  const a = Math.floor(Math.random() * 20) + 1
  const b = Math.floor(Math.random() * 20) + 1
  return { question: `${a} + ${b} = ?`, answer: String(a + b) }
}

export function Register() {
  const [form, setForm] = useState<FormData>(initialForm)
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [captcha, setCaptcha] = useState(generateCaptcha())
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({})
  const { addToast } = useToast()
  const navigate = useNavigate()

  const updateField = useCallback((field: keyof FormData, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }))
    setErrors(prev => ({ ...prev, [field]: undefined }))
  }, [])

  const validate = (): boolean => {
    const errs: Partial<Record<keyof FormData, string>> = {}

    if (form.username.trim().length < 6) errs.username = 'Minimum 6 characters'
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
      const res = await fetch("/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          username: form.username.trim(),
          email: form.email.trim(),
          password: form.password,
          contact: form.contact_number.trim(),
          address: form.address_line.trim(),
          pincode: form.pincode.trim(),
          district: form.district.trim(),
          state: form.state.trim(),
          country: form.country.trim()
        })
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.detail || "Signup failed")
      }

      addToast({
        title: 'Account created successfully!',
        variant: 'success'
      })

      navigate('/login')

    } catch (err: any) {
      addToast({
        title: err.message || 'Registration failed',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-8">
      <div className="w-full max-w-2xl">
        <Card>
          <CardHeader className="text-center">
            <CardTitle>Create Account</CardTitle>
            <CardDescription>Register with your email</CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">

              <Input placeholder="Username" value={form.username} onChange={e => updateField('username', e.target.value)} />
              <Input placeholder="Full Name" value={form.full_name} onChange={e => updateField('full_name', e.target.value)} />
              <Input type="email" placeholder="Email" value={form.email} onChange={e => updateField('email', e.target.value)} />
              <Input placeholder="Contact Number" value={form.contact_number} onChange={e => updateField('contact_number', e.target.value)} />
              <Input placeholder="Address" value={form.address_line} onChange={e => updateField('address_line', e.target.value)} />
              <Input placeholder="Pincode" value={form.pincode} onChange={e => updateField('pincode', e.target.value)} />

              <div className="flex gap-2">
                <Input placeholder="District" value={form.district} onChange={e => updateField('district', e.target.value)} />
                <Input placeholder="State" value={form.state} onChange={e => updateField('state', e.target.value)} />
                <Input placeholder="Country" value={form.country} onChange={e => updateField('country', e.target.value)} />
              </div>

              <div className="relative">
                <Input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Password"
                  value={form.password}
                  onChange={e => updateField('password', e.target.value)}
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <EyeOff /> : <Eye />}
                </button>
              </div>

              <Input
                type="password"
                placeholder="Confirm Password"
                value={form.confirm_password}
                onChange={e => updateField('confirm_password', e.target.value)}
              />

              <Input placeholder="Company Name" value={form.company_name} onChange={e => updateField('company_name', e.target.value)} />

              <div>
                <p>{captcha.question}</p>
                <Input
                  placeholder="Answer"
                  value={form.captcha_input}
                  onChange={e => updateField('captcha_input', e.target.value)}
                />
              </div>

              <Button type="submit" disabled={loading}>
                {loading ? "Creating..." : "Create Account"}
              </Button>

              <p className="text-center text-sm">
                Already have account? <Link to="/login">Login</Link>
              </p>

            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
