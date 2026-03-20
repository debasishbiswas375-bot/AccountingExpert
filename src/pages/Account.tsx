import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { useAuth } from '@/context/AuthContext'
import { useToast } from '@/components/ui/toast'
import { User, Mail, Phone, MapPin, Building, Eye, EyeOff, Save } from 'lucide-react'

export function Account() {
  const { user, updateUser } = useAuth()
  const { addToast } = useToast()
  const [showPassword, setShowPassword] = useState(false)
  const [form, setForm] = useState({
    full_name: user?.full_name || '',
    email: user?.email || '',
    contact_number: user?.contact_number || '',
    address_line: user?.address_line || '',
    pincode: user?.pincode || '',
    district: user?.district || '',
    state: user?.state || '',
    country: user?.country || '',
    company_name: user?.company_name || '',
    current_password: '',
    new_password: '',
    confirm_password: '',
  })

  const handleChange = (field: string, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault()
    updateUser({
      full_name: form.full_name,
      email: form.email,
      contact_number: form.contact_number,
      address_line: form.address_line,
      pincode: form.pincode,
      district: form.district,
      state: form.state,
      country: form.country,
      company_name: form.company_name,
    })
    addToast({ title: 'Profile updated successfully', variant: 'success' })
  }

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault()
    if (form.new_password.length < 8) {
      addToast({ title: 'Password must be at least 8 characters', variant: 'destructive' })
      return
    }
    if (form.new_password !== form.confirm_password) {
      addToast({ title: 'Passwords do not match', variant: 'destructive' })
      return
    }
    addToast({ title: 'Password changed successfully', variant: 'success' })
    setForm(prev => ({ ...prev, current_password: '', new_password: '', confirm_password: '' }))
  }

  return (
    <div className="space-y-6 animate-fade-in max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Account Settings</h1>
        <p className="text-muted-foreground mt-1">Manage your profile and preferences</p>
      </div>

      {/* Profile Form */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <User className="h-4 w-4 text-primary" /> Personal Information
          </CardTitle>
          <CardDescription>Update your personal details</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSaveProfile} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">Full Name</label>
                <Input value={form.full_name} onChange={e => handleChange('full_name', e.target.value)} icon={<User className="h-4 w-4" />} />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">Email</label>
                <Input type="email" value={form.email} onChange={e => handleChange('email', e.target.value)} icon={<Mail className="h-4 w-4" />} />
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">Contact Number</label>
                <Input value={form.contact_number} onChange={e => handleChange('contact_number', e.target.value)} icon={<Phone className="h-4 w-4" />} />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">Company Name</label>
                <Input value={form.company_name} onChange={e => handleChange('company_name', e.target.value)} icon={<Building className="h-4 w-4" />} />
              </div>
            </div>

            <div className="border-t pt-4">
              <p className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                <MapPin className="h-4 w-4" /> Address
              </p>
              <div className="space-y-4">
                <Input value={form.address_line} onChange={e => handleChange('address_line', e.target.value)} placeholder="Address Line" icon={<MapPin className="h-4 w-4" />} />
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Input value={form.pincode} onChange={e => handleChange('pincode', e.target.value)} placeholder="Pincode" />
                  <Input value={form.district} onChange={e => handleChange('district', e.target.value)} placeholder="District" />
                  <Input value={form.state} onChange={e => handleChange('state', e.target.value)} placeholder="State" />
                  <Input value={form.country} onChange={e => handleChange('country', e.target.value)} placeholder="Country" />
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <Button type="submit" variant="premium">
                <Save className="h-4 w-4 mr-2" /> Save Changes
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Change Password */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Eye className="h-4 w-4 text-primary" /> Change Password
          </CardTitle>
          <CardDescription>Update your password for security</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleChangePassword} className="space-y-4">
            <div>
              <label className="text-sm font-medium text-foreground mb-1.5 block">Current Password</label>
              <div className="relative">
                <Input
                  type={showPassword ? 'text' : 'password'}
                  value={form.current_password}
                  onChange={e => handleChange('current_password', e.target.value)}
                  placeholder="Enter current password"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">New Password</label>
                <Input type="password" value={form.new_password} onChange={e => handleChange('new_password', e.target.value)} placeholder="Min 8 characters" />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">Confirm New Password</label>
                <Input type="password" value={form.confirm_password} onChange={e => handleChange('confirm_password', e.target.value)} placeholder="Re-enter new password" />
              </div>
            </div>
            <div className="flex justify-end">
              <Button type="submit" variant="outline">Change Password</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
