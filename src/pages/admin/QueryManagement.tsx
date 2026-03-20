import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/toast'
import { MessageSquare, Check, Eye, Clock } from 'lucide-react'

interface Query {
  id: string
  full_name: string
  email: string
  contact: string
  message: string
  created_at: string
  status: 'new' | 'reviewed' | 'resolved'
}

const initialQueries: Query[] = [
  { id: '1', full_name: 'Rajesh Kumar', email: 'rajesh@example.com', contact: '+91 9876543210', message: 'Having trouble with HDFC bank statement format. The CSV parser does not recognize the column headers. Can you add support for the new HDFC format?', created_at: '2026-03-18', status: 'new' },
  { id: '2', full_name: 'Priya Sharma', email: 'priya@corp.in', contact: '+91 9876543211', message: 'Excellent tool! Just wanted to suggest adding bulk upload feature where we can process multiple statements at once. Would save a lot of time for our accounting team.', created_at: '2026-03-17', status: 'reviewed' },
  { id: '3', full_name: 'Amit Patel', email: 'amit@business.com', contact: '+91 9876543212', message: 'I need help understanding how the credit system works. If I generate 50 vouchers, will it deduct 5 credits? Also, what happens when credits run out mid-conversion?', created_at: '2026-03-16', status: 'resolved' },
  { id: '4', full_name: 'Sneha Reddy', email: 'sneha@firm.in', contact: '+91 9876543213', message: 'The AI mapping feature is amazing but it mapped "Swiggy" to "Travel Expenses" instead of "Food & Beverages". I corrected it manually. Will it learn from this correction for future uploads?', created_at: '2026-03-15', status: 'new' },
]

export function QueryManagement() {
  const [queries, setQueries] = useState<Query[]>(initialQueries)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const { addToast } = useToast()

  const updateStatus = (id: string, status: Query['status']) => {
    setQueries(prev => prev.map(q => q.id === id ? { ...q, status } : q))
    addToast({ title: `Query marked as ${status}`, variant: 'success' })
  }

  const statusIcon = (status: Query['status']) => {
    switch (status) {
      case 'new': return <Clock className="h-3 w-3" />
      case 'reviewed': return <Eye className="h-3 w-3" />
      case 'resolved': return <Check className="h-3 w-3" />
    }
  }

  const statusVariant = (status: Query['status']): 'destructive' | 'warning' | 'success' => {
    switch (status) {
      case 'new': return 'destructive'
      case 'reviewed': return 'warning'
      case 'resolved': return 'success'
    }
  }

  const selected = queries.find(q => q.id === selectedId)

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Query Management</h1>
        <p className="text-muted-foreground mt-1">View and manage user feedback and queries</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Query list */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <MessageSquare className="h-4 w-4 text-primary" />
                All Queries ({queries.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0 divide-y">
              {queries.map(q => (
                <button
                  key={q.id}
                  onClick={() => setSelectedId(q.id)}
                  className={`w-full text-left p-4 hover:bg-muted/30 transition-colors ${selectedId === q.id ? 'bg-muted/50' : ''}`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-foreground">{q.full_name}</p>
                      <p className="text-xs text-muted-foreground">{q.email}</p>
                      <p className="text-sm text-muted-foreground mt-1 truncate">{q.message}</p>
                    </div>
                    <div className="flex flex-col items-end gap-1 flex-shrink-0">
                      <Badge variant={statusVariant(q.status)} className="flex items-center gap-1">
                        {statusIcon(q.status)} {q.status}
                      </Badge>
                      <span className="text-xs text-muted-foreground">{q.created_at}</span>
                    </div>
                  </div>
                </button>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Detail panel */}
        <div>
          {selected ? (
            <Card className="sticky top-8">
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Query Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-xs text-muted-foreground">Name</p>
                  <p className="text-sm font-medium text-foreground">{selected.full_name}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Email</p>
                  <p className="text-sm text-foreground">{selected.email}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Contact</p>
                  <p className="text-sm text-foreground">{selected.contact}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Date</p>
                  <p className="text-sm text-foreground">{selected.created_at}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Message</p>
                  <p className="text-sm text-foreground leading-relaxed mt-1">{selected.message}</p>
                </div>
                <div className="flex items-center gap-2 pt-2 border-t">
                  <p className="text-xs text-muted-foreground mr-auto">Status:</p>
                  <Button
                    variant={selected.status === 'reviewed' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => updateStatus(selected.id, 'reviewed')}
                  >
                    <Eye className="h-3 w-3 mr-1" /> Reviewed
                  </Button>
                  <Button
                    variant={selected.status === 'resolved' ? 'success' : 'outline'}
                    size="sm"
                    onClick={() => updateStatus(selected.id, 'resolved')}
                  >
                    <Check className="h-3 w-3 mr-1" /> Resolved
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <MessageSquare className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
                <p className="text-sm text-muted-foreground">Select a query to view details</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
