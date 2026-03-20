import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Users, FileCode2, Coins, BarChart3, ArrowUpRight } from 'lucide-react'

const stats = [
  { title: 'Total Users', value: '1,247', icon: Users, change: '+28 this week', color: 'text-primary', bgColor: 'bg-primary/10' },
  { title: 'Total Conversions', value: '8,392', icon: FileCode2, change: '+156 this week', color: 'text-accent', bgColor: 'bg-accent/10' },
  { title: 'Total Vouchers', value: '142,830', icon: BarChart3, change: '+2,340 this week', color: 'text-warning', bgColor: 'bg-warning/10' },
  { title: 'Credits Used', value: '14,283', icon: Coins, change: '+234 this week', color: 'text-success', bgColor: 'bg-success/10' },
]

const recentUsers = [
  { name: 'Rajesh Kumar', email: 'rajesh@example.com', plan: 'Professional', credits: 45.5, joined: '2026-03-18' },
  { name: 'Priya Sharma', email: 'priya@corp.in', plan: 'Enterprise', credits: 820, joined: '2026-03-17' },
  { name: 'Amit Patel', email: 'amit@business.com', plan: 'Starter', credits: 12.3, joined: '2026-03-16' },
  { name: 'Sneha Reddy', email: 'sneha@firm.in', plan: 'Professional', credits: 167, joined: '2026-03-15' },
  { name: 'Vikram Singh', email: 'vikram@co.in', plan: 'Starter', credits: 38.8, joined: '2026-03-14' },
]

export function AdminDashboard() {
  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Admin Dashboard</h1>
        <p className="text-muted-foreground mt-1">System overview and statistics</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(stat => (
          <Card key={stat.title} className="hover:shadow-card-hover transition-all duration-300">
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.title}</p>
                  <p className="text-2xl font-bold text-foreground mt-1">{stat.value}</p>
                  <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                    <ArrowUpRight className="h-3 w-3" /> {stat.change}
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

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Users className="h-4 w-4 text-primary" /> Recent Signups
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="text-left p-3 font-medium text-muted-foreground">Name</th>
                  <th className="text-left p-3 font-medium text-muted-foreground">Email</th>
                  <th className="text-left p-3 font-medium text-muted-foreground">Plan</th>
                  <th className="text-right p-3 font-medium text-muted-foreground">Credits</th>
                  <th className="text-left p-3 font-medium text-muted-foreground">Joined</th>
                </tr>
              </thead>
              <tbody>
                {recentUsers.map(u => (
                  <tr key={u.email} className="border-b hover:bg-muted/30 transition-colors">
                    <td className="p-3 font-medium text-foreground">{u.name}</td>
                    <td className="p-3 text-muted-foreground">{u.email}</td>
                    <td className="p-3 text-foreground">{u.plan}</td>
                    <td className="p-3 text-right font-medium text-foreground">{u.credits}</td>
                    <td className="p-3 text-muted-foreground">{u.joined}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
