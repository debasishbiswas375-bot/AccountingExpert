import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { useToast } from '@/components/ui/toast'
import { Plus, Edit3, Trash2, Save, X, Star } from 'lucide-react'

interface PlanItem {
  id: string
  name: string
  credits: number
  price: number
  validity_months: number
  is_active: boolean
  is_default_signup: boolean
}

const initialPlans: PlanItem[] = [
  { id: '1', name: 'Starter', credits: 50, price: 499, validity_months: 1, is_active: true, is_default_signup: true },
  { id: '2', name: 'Professional', credits: 200, price: 1499, validity_months: 3, is_active: true, is_default_signup: false },
  { id: '3', name: 'Enterprise', credits: 1000, price: 3999, validity_months: 12, is_active: true, is_default_signup: false },
  { id: '4', name: 'Unlimited', credits: 9999, price: 9999, validity_months: 0, is_active: true, is_default_signup: false },
]

const emptyPlan: Omit<PlanItem, 'id'> = {
  name: '', credits: 0, price: 0, validity_months: 1, is_active: true, is_default_signup: false,
}

export function PlanManagement() {
  const [plans, setPlans] = useState<PlanItem[]>(initialPlans)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState<Omit<PlanItem, 'id'>>(emptyPlan)
  const [isNew, setIsNew] = useState(false)
  const { addToast } = useToast()

  const openNew = () => {
    setIsNew(true)
    setEditingId('new')
    setForm(emptyPlan)
  }

  const openEdit = (plan: PlanItem) => {
    setIsNew(false)
    setEditingId(plan.id)
    setForm({ name: plan.name, credits: plan.credits, price: plan.price, validity_months: plan.validity_months, is_active: plan.is_active, is_default_signup: plan.is_default_signup })
  }

  const cancel = () => {
    setEditingId(null)
    setIsNew(false)
  }

  const save = () => {
    if (!form.name.trim()) {
      addToast({ title: 'Plan name is required', variant: 'destructive' })
      return
    }
    if (isNew) {
      const newPlan: PlanItem = { id: crypto.randomUUID(), ...form }
      if (form.is_default_signup) {
        setPlans(prev => [...prev.map(p => ({ ...p, is_default_signup: false })), newPlan])
      } else {
        setPlans(prev => [...prev, newPlan])
      }
      addToast({ title: 'Plan created successfully', variant: 'success' })
    } else {
      setPlans(prev => prev.map(p => {
        if (p.id === editingId) return { ...p, ...form }
        if (form.is_default_signup) return { ...p, is_default_signup: false }
        return p
      }))
      addToast({ title: 'Plan updated successfully', variant: 'success' })
    }
    cancel()
  }

  const deletePlan = (id: string) => {
    setPlans(prev => prev.filter(p => p.id !== id))
    addToast({ title: 'Plan deleted', variant: 'success' })
  }

  const setDefault = (id: string) => {
    setPlans(prev => prev.map(p => ({ ...p, is_default_signup: p.id === id })))
    addToast({ title: 'Default signup plan updated', variant: 'success' })
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Plan Management</h1>
          <p className="text-muted-foreground mt-1">Create and manage subscription plans</p>
        </div>
        <Button variant="premium" onClick={openNew}>
          <Plus className="h-4 w-4 mr-2" /> Create Plan
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="text-left p-3 font-medium text-muted-foreground">Plan Name</th>
                  <th className="text-right p-3 font-medium text-muted-foreground">Credits</th>
                  <th className="text-right p-3 font-medium text-muted-foreground">Price (INR)</th>
                  <th className="text-center p-3 font-medium text-muted-foreground">Validity</th>
                  <th className="text-center p-3 font-medium text-muted-foreground">Status</th>
                  <th className="text-center p-3 font-medium text-muted-foreground">Default</th>
                  <th className="text-center p-3 font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {plans.map(plan => (
                  <tr key={plan.id} className="border-b hover:bg-muted/30 transition-colors">
                    <td className="p-3 font-medium text-foreground">{plan.name}</td>
                    <td className="p-3 text-right text-foreground">{plan.credits.toLocaleString()}</td>
                    <td className="p-3 text-right text-foreground">&#8377;{plan.price.toLocaleString()}</td>
                    <td className="p-3 text-center">
                      {plan.validity_months === 0 ? (
                        <Badge variant="success">Unlimited</Badge>
                      ) : (
                        <span className="text-muted-foreground">{plan.validity_months} months</span>
                      )}
                    </td>
                    <td className="p-3 text-center">
                      <Badge variant={plan.is_active ? 'success' : 'secondary'}>
                        {plan.is_active ? 'Active' : 'Inactive'}
                      </Badge>
                    </td>
                    <td className="p-3 text-center">
                      {plan.is_default_signup ? (
                        <Badge><Star className="h-3 w-3 mr-1" /> Default</Badge>
                      ) : (
                        <Button variant="ghost" size="sm" onClick={() => setDefault(plan.id)} className="text-xs">Set Default</Button>
                      )}
                    </td>
                    <td className="p-3 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <Button variant="ghost" size="sm" onClick={() => openEdit(plan)}><Edit3 className="h-4 w-4" /></Button>
                        <Button variant="ghost" size="sm" onClick={() => deletePlan(plan.id)} className="text-destructive hover:text-destructive"><Trash2 className="h-4 w-4" /></Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Edit/Create Modal */}
      {editingId && (
        <div className="fixed inset-0 bg-foreground/20 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={cancel}>
          <Card className="w-full max-w-md shadow-elegant animate-scale-in" onClick={e => e.stopPropagation()}>
            <CardHeader className="flex-row items-center justify-between pb-3">
              <CardTitle className="text-base">{isNew ? 'Create New Plan' : 'Edit Plan'}</CardTitle>
              <button onClick={cancel} className="text-muted-foreground hover:text-foreground"><X className="h-5 w-5" /></button>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">Plan Name</label>
                <Input value={form.name} onChange={e => setForm(prev => ({ ...prev, name: e.target.value }))} placeholder="e.g. Professional" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-foreground mb-1.5 block">Credits</label>
                  <Input type="number" value={form.credits} onChange={e => setForm(prev => ({ ...prev, credits: Number(e.target.value) }))} />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-1.5 block">Price (INR)</label>
                  <Input type="number" value={form.price} onChange={e => setForm(prev => ({ ...prev, price: Number(e.target.value) }))} />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">
                  Validity (months, 0 = unlimited)
                </label>
                <Input type="number" value={form.validity_months} onChange={e => setForm(prev => ({ ...prev, validity_months: Number(e.target.value) }))} />
              </div>
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <input type="checkbox" checked={form.is_active} onChange={e => setForm(prev => ({ ...prev, is_active: e.target.checked }))} className="rounded" />
                  <span className="text-foreground">Active</span>
                </label>
                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <input type="checkbox" checked={form.is_default_signup} onChange={e => setForm(prev => ({ ...prev, is_default_signup: e.target.checked }))} className="rounded" />
                  <span className="text-foreground">Default Signup Plan</span>
                </label>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <Button variant="outline" onClick={cancel}>Cancel</Button>
                <Button variant="premium" onClick={save}>
                  <Save className="h-4 w-4 mr-1" /> {isNew ? 'Create' : 'Save'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
