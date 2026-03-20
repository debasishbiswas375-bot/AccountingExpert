import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Download, FileCode2, AlertCircle } from 'lucide-react'
import { useToast } from '@/components/ui/toast'

const historyData = [
  { id: '1', file_name: 'HDFC_March_2026.xml', date: '2026-03-18', voucher_count: 87, credits_used: 8.7, downloadable: true },
  { id: '2', file_name: 'SBI_Feb_2026.xml', date: '2026-03-10', voucher_count: 124, credits_used: 12.4, downloadable: true },
  { id: '3', file_name: 'ICICI_Jan_2026.xml', date: '2026-02-28', voucher_count: 56, credits_used: 5.6, downloadable: true },
  { id: '4', file_name: 'Axis_Dec_2025.xml', date: '2025-12-15', voucher_count: 92, credits_used: 9.2, downloadable: false },
  { id: '5', file_name: 'BOB_Nov_2025.xml', date: '2025-11-20', voucher_count: 45, credits_used: 4.5, downloadable: false },
]

export function HistoryPage() {
  const { addToast } = useToast()

  const handleDownload = (fileName: string) => {
    addToast({ title: `Downloading ${fileName}`, variant: 'success' })
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Conversion History</h1>
        <p className="text-muted-foreground mt-1">View your past XML conversions. Only the last 3 XML files are downloadable.</p>
      </div>

      <Card className="border-warning/30 bg-warning/5">
        <CardContent className="p-4 flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-warning mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-sm font-medium text-foreground">Storage Policy</p>
            <p className="text-xs text-muted-foreground">Only the last 3 XML files are stored and available for download. Older conversions only retain metadata.</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <FileCode2 className="h-4 w-4 text-primary" /> All Conversions
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="text-left p-3 font-medium text-muted-foreground">File Name</th>
                  <th className="text-left p-3 font-medium text-muted-foreground">Date</th>
                  <th className="text-right p-3 font-medium text-muted-foreground">Vouchers</th>
                  <th className="text-right p-3 font-medium text-muted-foreground">Credits Used</th>
                  <th className="text-center p-3 font-medium text-muted-foreground">Status</th>
                  <th className="text-center p-3 font-medium text-muted-foreground">Action</th>
                </tr>
              </thead>
              <tbody>
                {historyData.map(item => (
                  <tr key={item.id} className="border-b hover:bg-muted/30 transition-colors">
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <FileCode2 className="h-4 w-4 text-primary" />
                        <span className="font-medium text-foreground">{item.file_name}</span>
                      </div>
                    </td>
                    <td className="p-3 text-muted-foreground">{item.date}</td>
                    <td className="p-3 text-right font-medium text-foreground">{item.voucher_count}</td>
                    <td className="p-3 text-right font-medium text-foreground">{item.credits_used}</td>
                    <td className="p-3 text-center">
                      <Badge variant={item.downloadable ? 'success' : 'secondary'}>
                        {item.downloadable ? 'Available' : 'Expired'}
                      </Badge>
                    </td>
                    <td className="p-3 text-center">
                      {item.downloadable ? (
                        <Button variant="ghost" size="sm" onClick={() => handleDownload(item.file_name)}>
                          <Download className="h-4 w-4" />
                        </Button>
                      ) : (
                        <span className="text-xs text-muted-foreground">—</span>
                      )}
                    </td>
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
