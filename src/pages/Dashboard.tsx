import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useAuth } from '@/context/AuthContext'
import {
  FileCode2, BarChart3, Coins, Clock, CalendarDays,
  TrendingUp, ArrowUpRight,
} from 'lucide-react'

const recentActivity = [
  { id: '1', file_name: 'HDFC_March_2026.pdf', date: '2026-03-18', voucher_count: 87, credits_used: 8.7 },
  { id: '2', file_name: 'SBI_Feb_2026.csv', date: '2026-03-10', voucher_count: 124, credits_used: 12.4 },
  { id: '3', file_name: 'ICICI_Jan_2026.xlsx', date: '2026-02-28', voucher_count: 56, credits_used: 5.6 },
]

export function Dashboard() {
  const { user } = useAuth()

  const stats = [
    {
      title: 'Statements Processed',
      value: '23',
      icon: FileCode2,
      change: '+3 this month',
      color: 'text-primary',
      bgColor: 'bg-primary/10',
    },
    {
      title: 'Vouchers Generated',
      value: '1,847',
      icon: BarChart3,
      change: '+267 this month',
      color: 'text-accent',
      bgColor: 'bg-accent/10',
    },
    {
      title: 'Credits Used',
      value: '184.7',
      icon: Coins,
      change: 'of 230 total',
      color: 'text-warning',
      bgColor: 'bg-warning/10',
    },
    {
      title: 'Remaining Credits',
      value: String(user?.credits ?? 0),
      icon: TrendingUp,
      change: user?.plan_expiry ? `Expires ${user.plan_expiry}` : 'Unlimited',
      color: 'text-success',
      bgColor: 'bg-success/10',
    },
  ]

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground mt-1">Welcome back, {user?.full_name || 'User'}. Here is your overview.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <Card key={stat.title} className="hover:shadow-card-hover transition-all duration-300" style={{ animationDelay: `${i * 50}ms` }}>
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.title}</p>
                  <p className="text-2xl font-bold text-foreground mt-1">{stat.value}</p>
                  <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                    <ArrowUpRight className="h-3 w-3" />
                    {stat.change}
                  </p>
                </div>
                <div className={`w-10 h-10 rounded-xl ${stat.bgColor} flex items-center justify-center`}>
                  <stat.icon className={`h-5 w-5 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Plan Info + Recent Activity */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Plan Card */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <CalendarDays className="h-4 w-4 text-primary" />
              Current Plan
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Plan</span>
              <Badge>Professional</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Credits</span>
              <span className="text-sm font-semibold text-foreground">{user?.credits ?? 0} remaining</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Expiry</span>
              <span className="text-sm font-semibold text-foreground">{user?.plan_expiry ?? 'Unlimited'}</span>
            </div>
            <div className="pt-2">
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div className="h-2 bg-primary rounded-full transition-all duration-500" style={{ width: '65%' }} />
              </div>
              <p className="text-xs text-muted-foreground mt-1">65% credits used</p>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="lg:col-span-2">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Clock className="h-4 w-4 text-primary" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentActivity.map(item => (
                <div key={item.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
                      <FileCode2 className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">{item.file_name}</p>
                      <p className="text-xs text-muted-foreground">{item.date}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-foreground">{item.voucher_count} vouchers</p>
                    <p className="text-xs text-muted-foreground">{item.credits_used} credits</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
