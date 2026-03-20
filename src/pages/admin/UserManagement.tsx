import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { useToast } from '@/components/ui/toast'
import { Search, Edit3, Plus, Minus, Infinity, Save, X } from 'lucide-react'

interface DemoUser {
  id: string
  username: string
  full_name: string
  email: string
  contact_number: string
  plan: string
  credits: number
  expiry: string | null
}

const initialUsers: DemoUser[] = [
  { id: '1', username: 'rajeshk', full_name: 'Rajesh Kumar', email: 'rajesh@example.com', contact_number: '+91 9876543210', plan: 'Professional', credits: 45.5, expiry: '2026-09-20' },
  { id: '2', username: 'priya_s', full_name: 'Priya Sharma', email: 'priya@corp.in', contact_number: '+91 9876543211', plan: 'Enterprise', credits: 820, expiry: '2027-03-17' },
  { id: '3', username: 'amitpatel', full_name: 'Amit Patel', email: 'amit@business.com', contact_number: '+91 9876543212', plan: 'Starter', credits: 12.3, expiry: '2026-04-16' },
  { id: '4', username: 'snehareddy', full_name: 'Sneha Reddy', email: 'sneha@firm.in', contact_number: '+91 9876543213', plan: 'Professional', credits: 167, expiry: '2026-06-15' },
  { id: '5', username: 'vikrams', full_name: 'Vikram Singh', email: 'vikram@co.in', contact_number: '+91 9876543214', plan: 'Starter', credits: 38.8, expiry: '2026-05-14' },
]

export function UserManagement() {
  const [users, setUsers] = useState<DemoUser[]>(initialUsers)
  const [search, setSearch] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editForm, setEditForm] = useState<Partial<DemoUser>>({})
  const [creditAdjust, setCreditAdjust] = useState('')
  const { addToast } = useToast()

  const filtered = users.filter(u =>
    u.full_name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase()) ||
    u.username.toLowerCase().includes(search.toLowerCase())
  )

  const startEdit = (user: DemoUser) => {
    setEditingId(user.id)
    setEditForm({ ...user })
    setCreditAdjust('')
  }

  const cancelEdit = () => {
    setEditingId(null)
    setEditForm({})
  }

  const saveEdit = () => {
    if (!editingId) return
    const adjustment = parseFloat(creditAdjust) || 0
    setUsers(prev => prev.map(u => u.id === editingId ? {
      ...u,
      ...editForm,
      credits: u.credits + adjustment,
    } : u))
    setEditingId(null)
    addToast({ title: 'User updated successfully', variant: 'success' })
  }

  const setUnlimitedExpiry = () => {
    setEditForm(prev => ({ ...prev, expiry: null }))
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">User Management</h1>
          <p className="text-muted-foreground mt-1">{users.length} registered users</p>
        </div>
      </div>

      <div className="max-w-sm">
        <Input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search users..."
          icon={<Search className="h-4 w-4" />}
        />
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="text-left p-3 font-medium text-muted-foreground">User</th>
                  <th className="text-left p-3 font-medium text-muted-foreground">Contact</th>
                  <th className="text-left p-3 font-medium text-muted-foreground">Plan</th>
                  <th className="text-right p-3 font-medium text-muted-foreground">Credits</th>
                  <th className="text-left p-3 font-medium text-muted-foreground">Expiry</th>
                  <th className="text-center p-3 font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(user => (
                  <tr key={user.id} className="border-b hover:bg-muted/30 transition-colors">
                    <td className="p-3">
                      <p className="font-medium text-foreground">{user.full_name}</p>
                      <p className="text-xs text-muted-foreground">@{user.username}</p>
                    </td>
                    <td className="p-3">
                      <p className="text-foreground">{user.email}</p>
                      <p className="text-xs text-muted-foreground">{user.contact_number}</p>
                    </td>
                    <td className="p-3"><Badge variant="secondary">{user.plan}</Badge></td>
                    <td className="p-3 text-right font-medium text-foreground">{user.credits}</td>
                    <td className="p-3">
                      {user.expiry ? (
                        <span className="text-muted-foreground">{user.expiry}</span>
                      ) : (
                        <Badge variant="success" className="text-xs"><Infinity className="h-3 w-3 mr-1" /> Unlimited</Badge>
                      )}
                    </td>
                    <td className="p-3 text-center">
                      <Button variant="ghost" size="sm" onClick={() => startEdit(user)}>
                        <Edit3 className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Edit Modal */}
      {editingId && (
        <div className="fixed inset-0 bg-foreground/20 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={cancelEdit}>
          <Card className="w-full max-w-md shadow-elegant animate-scale-in" onClick={e => e.stopPropagation()}>
            <CardHeader className="flex-row items-center justify-between pb-3">
              <CardTitle className="text-base">Edit User</CardTitle>
              <button onClick={cancelEdit} className="text-muted-foreground hover:text-foreground"><X className="h-5 w-5" /></button>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">Full Name</label>
                <Input value={editForm.full_name || ''} onChange={e => setEditForm(prev => ({ ...prev, full_name: e.target.value }))} />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">Email</label>
                <Input value={editForm.email || ''} onChange={e => setEditForm(prev => ({ ...prev, email: e.target.value }))} />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">Adjust Credits</label>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => setCreditAdjust(String((parseFloat(creditAdjust) || 0) - 10))}>
                    <Minus className="h-3 w-3 mr-1" /> 10
                  </Button>
                  <Input value={creditAdjust} onChange={e => setCreditAdjust(e.target.value)} placeholder="e.g. +50 or -10" className="text-center" />
                  <Button variant="outline" size="sm" onClick={() => setCreditAdjust(String((parseFloat(creditAdjust) || 0) + 10))}>
                    <Plus className="h-3 w-3 mr-1" /> 10
                  </Button>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">Expiry Date</label>
                <div className="flex gap-2">
                  <Input
                    type="date"
                    value={editForm.expiry || ''}
                    onChange={e => setEditForm(prev => ({ ...prev, expiry: e.target.value }))}
                  />
                  <Button variant="outline" size="sm" onClick={setUnlimitedExpiry}>
                    <Infinity className="h-4 w-4 mr-1" /> Unlimited
                  </Button>
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <Button variant="outline" onClick={cancelEdit}>Cancel</Button>
                <Button variant="premium" onClick={saveEdit}>
                  <Save className="h-4 w-4 mr-1" /> Save
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
