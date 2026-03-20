import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { useToast } from '@/components/ui/toast'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { User, Mail, Phone, MessageSquare, Send } from 'lucide-react'

export function Feedback() {
  const [form, setForm] = useState({
    full_name: '',
    email: '',
    contact: '',
    message: '',
  })
  const [submitted, setSubmitted] = useState(false)
  const { addToast } = useToast()

  const handleChange = (field: string, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.full_name.trim() || !form.email.trim() || !form.contact.trim()) {
      addToast({ title: 'Please fill in all required fields', variant: 'destructive' })
      return
    }
    if (form.message.trim().length < 30) {
      addToast({ title: 'Message must be at least 30 characters', variant: 'destructive' })
      return
    }
    setSubmitted(true)
    addToast({ title: 'Thank you for your feedback!', description: 'We will get back to you soon.', variant: 'success' })
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-1 pt-24 pb-12 px-6">
        <div className="max-w-xl mx-auto">
          {submitted ? (
            <Card className="shadow-elegant animate-fade-in text-center">
              <CardContent className="p-10">
                <div className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-4">
                  <Send className="h-8 w-8 text-success" />
                </div>
                <h2 className="text-xl font-bold text-foreground mb-2">Feedback Submitted!</h2>
                <p className="text-sm text-muted-foreground">Thank you for reaching out. Our team will review your message and get back to you shortly.</p>
              </CardContent>
            </Card>
          ) : (
            <Card className="shadow-elegant animate-fade-in">
              <CardHeader className="text-center">
                <CardTitle className="text-xl">Contact Us</CardTitle>
                <CardDescription>Have a question or feedback? We would love to hear from you.</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-foreground mb-1.5 block">
                      Full Name <span className="text-destructive">*</span>
                    </label>
                    <Input value={form.full_name} onChange={e => handleChange('full_name', e.target.value)} placeholder="Your full name" icon={<User className="h-4 w-4" />} />
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-foreground mb-1.5 block">
                        Email <span className="text-destructive">*</span>
                      </label>
                      <Input type="email" value={form.email} onChange={e => handleChange('email', e.target.value)} placeholder="your@email.com" icon={<Mail className="h-4 w-4" />} />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-foreground mb-1.5 block">
                        Contact Number <span className="text-destructive">*</span>
                      </label>
                      <Input value={form.contact} onChange={e => handleChange('contact', e.target.value)} placeholder="+91 9876543210" icon={<Phone className="h-4 w-4" />} />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground mb-1.5 block">
                      Message <span className="text-destructive">*</span>
                      <span className="text-xs text-muted-foreground font-normal ml-2">(min 30 characters)</span>
                    </label>
                    <textarea
                      value={form.message}
                      onChange={e => handleChange('message', e.target.value)}
                      placeholder="Tell us about your query, feedback, or suggestion..."
                      rows={5}
                      className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 transition-shadow duration-200 focus-visible:shadow-input-focus resize-none"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      {form.message.length}/30 characters minimum
                    </p>
                  </div>
                  <Button type="submit" variant="premium" className="w-full" size="lg">
                    <MessageSquare className="h-4 w-4 mr-2" /> Submit Feedback
                  </Button>
                </form>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}
