import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import {
  Upload, Brain, FileCode2, Download, Shield, Zap,
  FileSpreadsheet, Sparkles, ArrowRight, Check, Clock,
  BarChart3, Lock, RefreshCcw,
} from 'lucide-react'

const workflowSteps = [
  { icon: Upload, title: 'Upload', desc: 'Upload your bank statement in PDF, CSV, or Excel format' },
  { icon: Brain, title: 'Auto Map', desc: 'AI analyzes transactions and maps ledgers automatically' },
  { icon: FileCode2, title: 'Convert', desc: 'Review mappings and convert to Tally XML vouchers' },
  { icon: Download, title: 'Download', desc: 'Download your ready-to-import XML file instantly' },
]

const features = [
  { icon: Brain, title: 'AI-Powered Mapping', desc: 'Intelligent ledger mapping that learns from your corrections and improves over time.' },
  { icon: Zap, title: 'Lightning Fast', desc: 'Process hundreds of transactions in seconds. No more manual data entry.' },
  { icon: Shield, title: 'Privacy First', desc: 'Your financial data is never stored. Statements are deleted immediately after processing.' },
  { icon: FileSpreadsheet, title: 'Free Excel Tool', desc: 'Convert any bank statement to a clean, structured Excel file — completely free, no login required.' },
  { icon: RefreshCcw, title: 'Continuous Learning', desc: 'The system remembers your manual corrections and uses them for future automatic mapping.' },
  { icon: Lock, title: 'Secure Processing', desc: 'Bank-grade security. Only the last 3 XML outputs are stored for your convenience.' },
]

const pricingPreview = [
  { name: 'Starter', price: 499, credits: 50, popular: false },
  { name: 'Professional', price: 1499, credits: 200, popular: true },
  { name: 'Enterprise', price: 3999, credits: 1000, popular: false },
]

export function Landing() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 bg-gradient-hero opacity-[0.03]" />
        <div className="absolute top-20 right-0 w-96 h-96 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full bg-accent/5 blur-3xl" />

        <div className="max-w-7xl mx-auto px-6 relative">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <Badge variant="secondary" className="px-4 py-1.5 text-sm">
                <Sparkles className="h-3.5 w-3.5 mr-1.5" />
                AI-Powered Financial Automation
              </Badge>
              <h1 className="text-5xl lg:text-6xl font-extrabold leading-tight text-balance">
                Bank Statements to{' '}
                <span className="gradient-text">Tally XML</span>{' '}
                in Minutes
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed max-w-xl">
                Stop wasting hours on manual data entry. Accountesy uses AI to automatically
                map your bank transactions to the right ledgers and generate
                ready-to-import Tally XML vouchers.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link to="/register">
                  <Button variant="premium" size="xl">
                    Get Started Free <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link to="/convert-excel">
                  <Button variant="outline" size="xl">
                    Try Free Excel Tool
                  </Button>
                </Link>
              </div>
              <div className="flex items-center gap-6 text-sm text-muted-foreground pt-2">
                <span className="flex items-center gap-1.5"><Check className="h-4 w-4 text-accent" /> No credit card needed</span>
                <span className="flex items-center gap-1.5"><Clock className="h-4 w-4 text-accent" /> Setup in 2 minutes</span>
              </div>
            </div>

            {/* Hero Illustration — SVG based */}
            <div className="hidden lg:block relative">
              <div className="relative w-full aspect-square max-w-lg mx-auto">
                {/* Decorative rings */}
                <div className="absolute inset-0 rounded-full border border-primary/10 animate-pulse-soft" />
                <div className="absolute inset-8 rounded-full border border-primary/15" />
                <div className="absolute inset-16 rounded-full border border-primary/20" />

                {/* Center card */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="bg-card rounded-2xl shadow-elegant p-8 border w-72 animate-float">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <FileCode2 className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-foreground">XML Generated</p>
                        <p className="text-xs text-muted-foreground">124 vouchers</p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="h-2 bg-primary/20 rounded-full">
                        <div className="h-2 bg-primary rounded-full w-[92%]" />
                      </div>
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>92% mapped automatically</span>
                        <span className="text-primary font-medium">12.4 credits</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Floating badges */}
                <div className="absolute top-12 right-8 bg-card rounded-lg shadow-elegant px-3 py-2 border animate-float" style={{ animationDelay: '1s' }}>
                  <div className="flex items-center gap-2">
                    <Brain className="h-4 w-4 text-accent" />
                    <span className="text-xs font-medium text-foreground">AI Mapping</span>
                  </div>
                </div>

                <div className="absolute bottom-16 left-4 bg-card rounded-lg shadow-elegant px-3 py-2 border animate-float" style={{ animationDelay: '2s' }}>
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4 text-accent" />
                    <span className="text-xs font-medium text-foreground">Privacy First</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Workflow Section */}
      <section id="workflow" className="py-20 bg-muted/50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-4">How It Works</Badge>
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground">
              Four Simple Steps to Automate Your Accounting
            </h2>
            <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">
              From bank statement upload to Tally-ready XML — fully automated with AI intelligence.
            </p>
          </div>
          <div className="grid md:grid-cols-4 gap-6">
            {workflowSteps.map((step, i) => (
              <div key={step.title} className="relative animate-fade-in" style={{ animationDelay: `${i * 100}ms` }}>
                <Card className="hover:shadow-card-hover hover:-translate-y-1 transition-all duration-300 h-full">
                  <CardContent className="p-6 text-center">
                    <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                      <step.icon className="h-7 w-7 text-primary" />
                    </div>
                    <div className="text-xs font-bold text-primary mb-2">STEP {i + 1}</div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">{step.title}</h3>
                    <p className="text-sm text-muted-foreground">{step.desc}</p>
                  </CardContent>
                </Card>
                {i < 3 && (
                  <div className="hidden md:block absolute top-1/2 -right-3 transform -translate-y-1/2 z-10">
                    <ArrowRight className="h-5 w-5 text-primary/40" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-4">Features</Badge>
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground">
              Everything You Need for Effortless Accounting
            </h2>
            <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">
              Powerful features designed to save you time and eliminate manual errors.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <Card key={feature.title} className="hover:shadow-card-hover hover:-translate-y-1 transition-all duration-300" style={{ animationDelay: `${i * 50}ms` }}>
                <CardContent className="p-6">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{feature.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Preview */}
      <section id="pricing" className="py-20 bg-muted/50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-4">Pricing</Badge>
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground">
              Simple, Transparent Pricing
            </h2>
            <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">
              Pay only for what you use. Start free and upgrade when you need more.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {pricingPreview.map(plan => (
              <Card key={plan.name} className={`relative hover:shadow-card-hover transition-all duration-300 ${plan.popular ? 'border-primary shadow-elegant scale-[1.02]' : ''}`}>
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge>Most Popular</Badge>
                  </div>
                )}
                <CardContent className="p-8 text-center">
                  <h3 className="text-lg font-semibold text-foreground">{plan.name}</h3>
                  <div className="my-6">
                    <span className="text-4xl font-bold text-foreground">&#8377;{plan.price}</span>
                    <span className="text-muted-foreground text-sm"> /month</span>
                  </div>
                  <div className="flex items-center justify-center gap-2 mb-6 text-sm text-muted-foreground">
                    <BarChart3 className="h-4 w-4 text-primary" />
                    <span>{plan.credits} credits included</span>
                  </div>
                  <Link to="/register">
                    <Button variant={plan.popular ? 'premium' : 'outline'} className="w-full">
                      Get Started
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
          <p className="text-center text-sm text-muted-foreground mt-8">
            1 voucher = 0.1 credit &middot; All plans include AI mapping &middot;{' '}
            <Link to="/pricing" className="text-primary hover:underline">View all plans</Link>
          </p>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-hero opacity-[0.03]" />
        <div className="max-w-3xl mx-auto px-6 text-center relative">
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
            Ready to Automate Your Accounting?
          </h2>
          <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
            Join thousands of accountants and businesses who save hours every week with Accountesy.
          </p>
          <div className="flex justify-center gap-4">
            <Link to="/register">
              <Button variant="premium" size="xl">
                Start Free Trial <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link to="/feedback">
              <Button variant="outline" size="xl">Contact Us</Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
