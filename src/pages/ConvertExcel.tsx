import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useToast } from '@/components/ui/toast'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { useAuth } from '@/context/AuthContext'
import { Upload, FileSpreadsheet, Download, Check, Sparkles, Shield } from 'lucide-react'

export function ConvertExcel() {
  const { isAuthenticated } = useAuth()
  const [file, setFile] = useState<File | null>(null)
  const [step, setStep] = useState<'upload' | 'processing' | 'done'>('upload')
  const { addToast } = useToast()

  const handleConvert = () => {
    if (!file) {
      addToast({ title: 'Please select a file first', variant: 'destructive' })
      return
    }
    setStep('processing')
    setTimeout(() => {
      setStep('done')
      addToast({ title: 'Excel file ready!', variant: 'success' })
    }, 2000)
  }

  const handleDownload = () => {
    // Demo: create a CSV and download as simulated Excel
    const csvContent = `Date,Description,Debit,Credit,Balance,Type,Ledger
2026-03-01,NEFT CR-ACME CORP-SALARY MAR,0,75000,175000,Receipt,Salary Account
2026-03-02,UPI/DR/AMAZON/AMZN-PRIME,1499,0,173501,Payment,Subscription Expenses
2026-03-03,ATM WDL-CASH WITHDRAWAL,10000,0,163501,Payment,Cash Account
2026-03-05,NEFT DR-RENT MARCH 2026,25000,0,138501,Payment,Rent Expenses
2026-03-07,IMPS CR-CLIENT PAYMENT INV-445,0,150000,288501,Receipt,Accounts Receivable
2026-03-10,UPI/DR/SWIGGY/ORDER,856,0,287645,Payment,Food & Beverages
2026-03-12,NACH DR-SBI LIFE PREMIUM,5000,0,282645,Payment,Insurance Premium
2026-03-15,ECS DR-HOME LOAN EMI,35000,0,247645,Payment,Loan EMI Account`
    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `accountesy_converted_${Date.now()}.csv`
    a.click()
    URL.revokeObjectURL(url)
    addToast({ title: 'Excel downloaded!', variant: 'success' })
  }

  const handleReset = () => {
    setFile(null)
    setStep('upload')
  }

  const content = (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-3">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Convert to Excel</h1>
          <p className="text-muted-foreground mt-1">Convert any bank statement to a clean, structured Excel file</p>
        </div>
        <Badge variant="success" className="ml-auto">Free Tool</Badge>
      </div>

      {/* Privacy Notice */}
      <Card className="border-accent/30 bg-accent/5">
        <CardContent className="p-4 flex items-start gap-3">
          <Shield className="h-5 w-5 text-accent mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-sm font-medium text-foreground">Privacy Guaranteed</p>
            <p className="text-xs text-muted-foreground">Your files are processed locally and deleted immediately. No data is stored, logged, or shared.</p>
          </div>
        </CardContent>
      </Card>

      {step === 'upload' && (
        <Card className="max-w-xl mx-auto">
          <CardHeader className="text-center">
            <CardTitle className="text-base">Upload Bank Statement</CardTitle>
            <CardDescription>PDF, CSV, or Excel files supported</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div
              className="border-2 border-dashed rounded-xl p-10 text-center hover:border-primary/50 transition-colors cursor-pointer"
              onClick={() => document.getElementById('excel-upload')?.click()}
            >
              <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-sm font-medium text-foreground">
                {file ? file.name : 'Click to upload or drag and drop'}
              </p>
              <p className="text-xs text-muted-foreground mt-1">PDF, CSV, XLSX (max 10MB)</p>
              <input
                id="excel-upload"
                type="file"
                accept=".pdf,.csv,.xlsx,.xls"
                className="hidden"
                onChange={e => setFile(e.target.files?.[0] || null)}
              />
            </div>
            <Button variant="premium" className="w-full" size="lg" onClick={handleConvert} disabled={!file}>
              <Sparkles className="h-4 w-4 mr-2" /> Convert to Excel
            </Button>
          </CardContent>
        </Card>
      )}

      {step === 'processing' && (
        <Card className="max-w-md mx-auto text-center">
          <CardContent className="p-10">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4 animate-pulse-soft">
              <FileSpreadsheet className="h-8 w-8 text-primary" />
            </div>
            <h2 className="text-lg font-semibold text-foreground mb-2">Processing your statement...</h2>
            <p className="text-sm text-muted-foreground">This will only take a moment</p>
            <div className="mt-4 h-2 bg-muted rounded-full overflow-hidden max-w-xs mx-auto">
              <div className="h-2 bg-primary rounded-full animate-shimmer" style={{ width: '60%', backgroundSize: '200% 100%', backgroundImage: 'linear-gradient(90deg, hsl(var(--primary)) 0%, hsl(var(--primary)/0.5) 50%, hsl(var(--primary)) 100%)' }} />
            </div>
          </CardContent>
        </Card>
      )}

      {step === 'done' && (
        <Card className="max-w-md mx-auto text-center">
          <CardContent className="p-10">
            <div className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-4">
              <Check className="h-8 w-8 text-success" />
            </div>
            <h2 className="text-xl font-bold text-foreground mb-2">Excel Ready!</h2>
            <p className="text-sm text-muted-foreground mb-1">Your structured Excel file has been generated</p>
            <p className="text-xs text-muted-foreground">Includes: Transactions, Mapping, and Summary sheets</p>
            <div className="flex justify-center gap-3 mt-6">
              <Button variant="premium" size="lg" onClick={handleDownload}>
                <Download className="h-4 w-4 mr-2" /> Download Excel
              </Button>
              <Button variant="outline" size="lg" onClick={handleReset}>
                Convert Another
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )

  // If accessed as guest (not authenticated), wrap with Navbar/Footer
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Navbar />
        <main className="flex-1 pt-24 pb-12 px-6 max-w-4xl mx-auto w-full">
          {content}
        </main>
        <Footer />
      </div>
    )
  }

  // If accessed from sidebar (authenticated), render inline
  return content
}
