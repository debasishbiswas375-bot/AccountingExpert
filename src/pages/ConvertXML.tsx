import { useState, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useToast } from '@/components/ui/toast'
import {
  Upload, FileCode2, Download, Brain, Trash2, Plus,
  AlertCircle, Check, ChevronDown, Sparkles, Coins,
} from 'lucide-react'
import type { Voucher } from '@/types'

const DEMO_VOUCHERS: Voucher[] = [
  { date: '2026-03-01', description: 'NEFT CR-ACME CORP-SALARY MAR', debit: 0, credit: 75000, type: 'Receipt', ledger: 'Salary Account', confidence: 95 },
  { date: '2026-03-02', description: 'UPI/DR/AMAZON/AMZN-PRIME', debit: 1499, credit: 0, type: 'Payment', ledger: 'Subscription Expenses', confidence: 88 },
  { date: '2026-03-03', description: 'ATM WDL-CASH WITHDRAWAL', debit: 10000, credit: 0, type: 'Payment', ledger: 'Cash Account', confidence: 97 },
  { date: '2026-03-05', description: 'NEFT DR-RENT MARCH 2026', debit: 25000, credit: 0, type: 'Payment', ledger: 'Rent Expenses', confidence: 92 },
  { date: '2026-03-07', description: 'IMPS CR-CLIENT PAYMENT INV-445', debit: 0, credit: 150000, type: 'Receipt', ledger: 'Accounts Receivable', confidence: 78 },
  { date: '2026-03-10', description: 'UPI/DR/SWIGGY/ORDER', debit: 856, credit: 0, type: 'Payment', ledger: 'Food & Beverages', confidence: 85 },
  { date: '2026-03-12', description: 'NACH DR-SBI LIFE PREMIUM', debit: 5000, credit: 0, type: 'Payment', ledger: 'Insurance Premium', confidence: 91 },
  { date: '2026-03-15', description: 'ECS DR-HOME LOAN EMI', debit: 35000, credit: 0, type: 'Payment', ledger: 'Loan EMI Account', confidence: 96 },
]

export function ConvertXML() {
  const [file, setFile] = useState<File | null>(null)
  const [masterFile, setMasterFile] = useState<File | null>(null)
  const [vouchers, setVouchers] = useState<Voucher[]>([])
  const [step, setStep] = useState<'upload' | 'review' | 'done'>('upload')
  const [processing, setProcessing] = useState(false)
  const { addToast } = useToast()

  const handleUpload = useCallback(() => {
    if (!file) {
      addToast({ title: 'Please select a file', variant: 'destructive' })
      return
    }
    setProcessing(true)
    // Simulate processing
    setTimeout(() => {
      setVouchers(DEMO_VOUCHERS)
      setStep('review')
      setProcessing(false)
      addToast({ title: 'Statement parsed successfully', description: `${DEMO_VOUCHERS.length} transactions found`, variant: 'success' })
    }, 1500)
  }, [file, addToast])

  const handleLedgerChange = (index: number, value: string) => {
    setVouchers(prev => prev.map((v, i) => i === index ? { ...v, ledger: value } : v))
  }

  const handleDeleteRow = (index: number) => {
    setVouchers(prev => prev.filter((_, i) => i !== index))
  }

  const handleAddRow = () => {
    setVouchers(prev => [...prev, { date: '', description: '', debit: 0, credit: 0, type: 'Payment', ledger: '', confidence: 0 }])
  }

  const handleGenerateXML = () => {
    setProcessing(true)
    setTimeout(() => {
      setStep('done')
      setProcessing(false)
      addToast({ title: 'XML generated successfully!', description: `${vouchers.length} vouchers created`, variant: 'success' })
    }, 1000)
  }

  const handleDownload = () => {
    // Generate demo XML
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<ENVELOPE>
  <HEADER><TALLYREQUEST>Import Data</TALLYREQUEST></HEADER>
  <BODY><IMPORTDATA><REQUESTDESC><REPORTNAME>Vouchers</REPORTNAME></REQUESTDESC>
    <REQUESTDATA>${vouchers.map(v => `
      <TALLYMESSAGE>
        <VOUCHER VCHTYPE="${v.type}" ACTION="Create">
          <DATE>${v.date.replace(/-/g, '')}</DATE>
          <NARRATION>${v.description}</NARRATION>
          <ALLLEDGERENTRIES.LIST>
            <LEDGERNAME>${v.ledger}</LEDGERNAME>
            <AMOUNT>${v.debit > 0 ? v.debit : -v.credit}</AMOUNT>
          </ALLLEDGERENTRIES.LIST>
        </VOUCHER>
      </TALLYMESSAGE>`).join('')}
    </REQUESTDATA>
  </IMPORTDATA></BODY>
</ENVELOPE>`
    const blob = new Blob([xml], { type: 'text/xml' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `accountesy_vouchers_${Date.now()}.xml`
    a.click()
    URL.revokeObjectURL(url)
    addToast({ title: 'XML downloaded!', variant: 'success' })
  }

  const handleReset = () => {
    setFile(null)
    setMasterFile(null)
    setVouchers([])
    setStep('upload')
  }

  const totalCredits = (vouchers.length * 0.1).toFixed(1)

  const confidenceColor = (c: number) => {
    if (c >= 90) return 'text-success'
    if (c >= 70) return 'text-warning'
    return 'text-destructive'
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Convert to XML</h1>
        <p className="text-muted-foreground mt-1">Upload your bank statement and generate Tally XML vouchers</p>
      </div>

      {/* Step: Upload */}
      {step === 'upload' && (
        <div className="grid lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Upload className="h-4 w-4 text-primary" /> Bank Statement
              </CardTitle>
              <CardDescription>Upload PDF, CSV, or Excel file</CardDescription>
            </CardHeader>
            <CardContent>
              <div
                className="border-2 border-dashed rounded-xl p-8 text-center hover:border-primary/50 transition-colors cursor-pointer"
                onClick={() => document.getElementById('stmt-upload')?.click()}
              >
                <Upload className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
                <p className="text-sm font-medium text-foreground">
                  {file ? file.name : 'Click to upload or drag and drop'}
                </p>
                <p className="text-xs text-muted-foreground mt-1">PDF, CSV, XLSX (max 10MB)</p>
                <input
                  id="stmt-upload"
                  type="file"
                  accept=".pdf,.csv,.xlsx,.xls"
                  className="hidden"
                  onChange={e => setFile(e.target.files?.[0] || null)}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <FileCode2 className="h-4 w-4 text-primary" /> Master HTML (Optional)
              </CardTitle>
              <CardDescription>Upload master.html for ledger suggestions</CardDescription>
            </CardHeader>
            <CardContent>
              <div
                className="border-2 border-dashed rounded-xl p-8 text-center hover:border-primary/50 transition-colors cursor-pointer"
                onClick={() => document.getElementById('master-upload')?.click()}
              >
                <FileCode2 className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
                <p className="text-sm font-medium text-foreground">
                  {masterFile ? masterFile.name : 'Upload master.html (optional)'}
                </p>
                <p className="text-xs text-muted-foreground mt-1">Used for ledger name suggestions only</p>
                <input
                  id="master-upload"
                  type="file"
                  accept=".html,.htm"
                  className="hidden"
                  onChange={e => setMasterFile(e.target.files?.[0] || null)}
                />
              </div>
            </CardContent>
          </Card>

          <div className="lg:col-span-2 flex justify-end">
            <Button variant="premium" size="lg" onClick={handleUpload} disabled={!file || processing}>
              {processing ? (
                <><Sparkles className="h-4 w-4 mr-2 animate-spin" /> Processing...</>
              ) : (
                <><Brain className="h-4 w-4 mr-2" /> Parse & Map with AI</>
              )}
            </Button>
          </div>
        </div>
      )}

      {/* Step: Review */}
      {step === 'review' && (
        <div className="space-y-4">
          {/* Summary bar */}
          <Card>
            <CardContent className="p-4 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <FileCode2 className="h-4 w-4 text-primary" />
                  <span className="text-sm text-foreground"><strong>{vouchers.length}</strong> vouchers</span>
                </div>
                <div className="flex items-center gap-2">
                  <Coins className="h-4 w-4 text-warning" />
                  <span className="text-sm text-foreground">Estimated: <strong>{totalCredits}</strong> credits</span>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={handleReset}>
                  <Trash2 className="h-4 w-4 mr-1" /> Reset
                </Button>
                <Button variant="outline" size="sm" onClick={handleAddRow}>
                  <Plus className="h-4 w-4 mr-1" /> Add Row
                </Button>
                <Button variant="premium" size="sm" onClick={handleGenerateXML} disabled={processing}>
                  {processing ? 'Generating...' : 'Generate XML'}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Editable Table */}
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="text-left p-3 font-medium text-muted-foreground">Date</th>
                      <th className="text-left p-3 font-medium text-muted-foreground">Description</th>
                      <th className="text-right p-3 font-medium text-muted-foreground">Debit</th>
                      <th className="text-right p-3 font-medium text-muted-foreground">Credit</th>
                      <th className="text-left p-3 font-medium text-muted-foreground">Type</th>
                      <th className="text-left p-3 font-medium text-muted-foreground">Ledger</th>
                      <th className="text-center p-3 font-medium text-muted-foreground">AI</th>
                      <th className="p-3 w-10"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {vouchers.map((v, i) => (
                      <tr key={i} className="border-b hover:bg-muted/30 transition-colors">
                        <td className="p-3">
                          <Input
                            value={v.date}
                            onChange={e => setVouchers(prev => prev.map((item, idx) => idx === i ? { ...item, date: e.target.value } : item))}
                            className="h-8 text-xs w-28"
                          />
                        </td>
                        <td className="p-3">
                          <span className="text-xs text-foreground truncate max-w-[200px] block" title={v.description}>
                            {v.description}
                          </span>
                        </td>
                        <td className="p-3 text-right">
                          {v.debit > 0 && <span className="text-destructive font-medium">{v.debit.toLocaleString()}</span>}
                        </td>
                        <td className="p-3 text-right">
                          {v.credit > 0 && <span className="text-success font-medium">{v.credit.toLocaleString()}</span>}
                        </td>
                        <td className="p-3">
                          <div className="relative">
                            <select
                              value={v.type}
                              onChange={e => setVouchers(prev => prev.map((item, idx) => idx === i ? { ...item, type: e.target.value } : item))}
                              className="h-8 text-xs rounded-md border border-input bg-background px-2 pr-7 appearance-none"
                            >
                              <option>Payment</option>
                              <option>Receipt</option>
                              <option>Contra</option>
                              <option>Journal</option>
                            </select>
                            <ChevronDown className="h-3 w-3 absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                          </div>
                        </td>
                        <td className="p-3">
                          <Input
                            value={v.ledger}
                            onChange={e => handleLedgerChange(i, e.target.value)}
                            className="h-8 text-xs w-40"
                          />
                        </td>
                        <td className="p-3 text-center">
                          {v.confidence ? (
                            <Badge variant={v.confidence >= 90 ? 'success' : v.confidence >= 70 ? 'warning' : 'destructive'} className="text-xs">
                              {v.confidence}%
                            </Badge>
                          ) : (
                            <span className="text-xs text-muted-foreground">-</span>
                          )}
                        </td>
                        <td className="p-3">
                          <button onClick={() => handleDeleteRow(i)} className="text-muted-foreground hover:text-destructive transition-colors">
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* AI Mapping Legend */}
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1"><AlertCircle className="h-3 w-3" /> AI Confidence:</span>
            <span className={`flex items-center gap-1 ${confidenceColor(95)}`}><Check className="h-3 w-3" /> 90%+ High</span>
            <span className={`flex items-center gap-1 ${confidenceColor(80)}`}><AlertCircle className="h-3 w-3" /> 70-89% Medium</span>
            <span className={`flex items-center gap-1 ${confidenceColor(50)}`}><AlertCircle className="h-3 w-3" /> &lt;70% Low</span>
          </div>
        </div>
      )}

      {/* Step: Done */}
      {step === 'done' && (
        <Card className="max-w-lg mx-auto text-center">
          <CardContent className="p-10">
            <div className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-4">
              <Check className="h-8 w-8 text-success" />
            </div>
            <h2 className="text-xl font-bold text-foreground mb-2">XML Generated Successfully!</h2>
            <p className="text-sm text-muted-foreground mb-2">
              {vouchers.length} vouchers &middot; {totalCredits} credits used
            </p>
            <div className="flex justify-center gap-3 mt-6">
              <Button variant="premium" size="lg" onClick={handleDownload}>
                <Download className="h-4 w-4 mr-2" /> Download XML
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
}
