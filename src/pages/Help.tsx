import { Card, CardContent } from '@/components/ui/card'
import {
  Upload, Brain, FileCode2, Download, Shield, HelpCircle,
  ChevronDown, ChevronUp, FileSpreadsheet, Sparkles, Lock, RefreshCcw,
} from 'lucide-react'
import { useState } from 'react'

const guideSteps = [
  { icon: Upload, title: 'Upload Your Statement', desc: 'Navigate to "Convert to XML" and upload your bank statement in PDF, CSV, or Excel format. Optionally, upload a master.html file for additional ledger suggestions.' },
  { icon: Brain, title: 'AI-Powered Mapping', desc: 'Our AI engine analyzes each transaction and automatically maps it to the most appropriate ledger. The system learns from your corrections and improves over time.' },
  { icon: FileCode2, title: 'Review & Edit', desc: 'Review the mapped transactions in an editable table. You can modify ledger names, add new entries, change transaction types, and delete rows as needed.' },
  { icon: Download, title: 'Generate & Download', desc: 'Once satisfied, generate your Tally-compatible XML file. The XML is ready to import directly into Tally ERP. Credits are deducted at 0.1 per voucher.' },
]

const faqs = [
  { q: 'What file formats are supported?', a: 'We support PDF, CSV, and Excel (XLSX/XLS) bank statement formats. The system automatically detects the format and parses the transactions.' },
  { q: 'How does the credit system work?', a: 'Each voucher generated costs 0.1 credits. For example, if your statement has 100 transactions, it will use 10 credits. Credits are deducted only when you generate the XML file.' },
  { q: 'Is my financial data safe?', a: 'Absolutely. We never store your uploaded statements, master.html files, or generated Excel files. Only the last 3 XML outputs and their metadata are stored for your convenience. All processing happens securely and files are deleted immediately after processing.' },
  { q: 'What is the master.html file?', a: 'The master.html is an optional file exported from Tally that contains your chart of accounts. Uploading it helps the AI suggest more accurate ledger names based on your existing Tally setup. It is used for suggestions only and does not restrict mapping.' },
  { q: 'How does AI mapping priority work?', a: 'The system follows this priority: 1) Previously learned mappings from your corrections, 2) AI matching based on transaction patterns, 3) master.html suggestions, 4) Manual mapping. This ensures the system gets smarter with each use.' },
  { q: 'What happens when my plan expires?', a: 'When your plan expires, you cannot generate new XML files. However, your last 3 XML files remain downloadable. You can renew your plan at any time. Plans with validity = 0 never expire.' },
  { q: 'Can I use the Excel tool without an account?', a: 'Yes! The "Convert to Excel" tool is completely free and requires no login. Upload your statement, convert it, and download — all without creating an account.' },
  { q: 'How are XML files stored?', a: 'We store only the last 3 XML files per user. When a new XML is generated and the limit is exceeded, the oldest file is automatically deleted. This ensures minimal data retention while providing convenient access to recent conversions.' },
]

export function Help() {
  const [openFaq, setOpenFaq] = useState<number | null>(0)

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Help & Features</h1>
        <p className="text-muted-foreground mt-1">Learn how to use Accountesy and make the most of its features</p>
      </div>

      {/* Getting Started Guide */}
      <div>
        <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" /> Getting Started Guide
        </h2>
        <div className="grid md:grid-cols-2 gap-4">
          {guideSteps.map((step, i) => (
            <Card key={step.title} className="hover:shadow-card-hover transition-all duration-300">
              <CardContent className="p-5">
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <step.icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-primary mb-1">STEP {i + 1}</p>
                    <h3 className="font-semibold text-foreground mb-1">{step.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{step.desc}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Key Features */}
      <div>
        <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
          <FileCode2 className="h-5 w-5 text-primary" /> Key Features
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { icon: Brain, title: 'AI Ledger Mapping', desc: 'Automatic intelligent mapping with confidence scores' },
            { icon: RefreshCcw, title: 'Continuous Learning', desc: 'System learns from your corrections' },
            { icon: FileSpreadsheet, title: 'Free Excel Conversion', desc: 'Convert statements to Excel for free' },
            { icon: Shield, title: 'Privacy First', desc: 'No statement storage, immediate deletion' },
            { icon: Lock, title: 'Secure Processing', desc: 'Bank-grade security for all operations' },
            { icon: FileCode2, title: 'Tally Compatible', desc: 'Generate XML ready for Tally import' },
          ].map(f => (
            <Card key={f.title}>
              <CardContent className="p-4 flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0">
                  <f.icon className="h-4 w-4 text-accent" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-foreground">{f.title}</h4>
                  <p className="text-xs text-muted-foreground">{f.desc}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* FAQ */}
      <div>
        <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
          <HelpCircle className="h-5 w-5 text-primary" /> Frequently Asked Questions
        </h2>
        <Card>
          <CardContent className="p-0 divide-y">
            {faqs.map((faq, i) => (
              <div key={i}>
                <button
                  className="w-full text-left p-4 flex items-center justify-between hover:bg-muted/30 transition-colors"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                >
                  <span className="text-sm font-medium text-foreground pr-4">{faq.q}</span>
                  {openFaq === i ? (
                    <ChevronUp className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                  ) : (
                    <ChevronDown className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                  )}
                </button>
                {openFaq === i && (
                  <div className="px-4 pb-4 animate-fade-in">
                    <p className="text-sm text-muted-foreground leading-relaxed">{faq.a}</p>
                  </div>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
