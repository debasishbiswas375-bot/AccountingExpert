import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { useToast } from '@/components/ui/toast'
import { Mail, ArrowLeft } from 'lucide-react'

export function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const { addToast } = useToast()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      addToast({ title: 'Please enter a valid email address', variant: 'destructive' })
      return
    }
    setSent(true)
    addToast({ title: 'Reset link sent!', description: 'Check your email inbox', variant: 'success' })
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background relative px-4">
      <div className="absolute top-20 right-0 w-96 h-96 rounded-full bg-primary/5 blur-3xl" />

      <div className="w-full max-w-md relative">
        <Link to="/" className="flex items-center justify-center gap-2 mb-8">
          <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center">
            <span className="text-lg font-bold text-primary-foreground">A</span>
          </div>
          <span className="text-2xl font-bold text-foreground">Accountesy</span>
        </Link>

        <Card className="shadow-elegant animate-fade-in">
          <CardHeader className="text-center pb-2">
            <CardTitle className="text-xl">Reset Password</CardTitle>
            <CardDescription>
              {sent
                ? 'Check your email for the reset link'
                : 'Enter your email to receive a password reset link'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {sent ? (
              <div className="text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center mx-auto">
                  <Mail className="h-8 w-8 text-success" />
                </div>
                <p className="text-sm text-muted-foreground">
                  If an account exists with <strong className="text-foreground">{email}</strong>, you will
                  receive a password reset link shortly.
                </p>
                <Link to="/login">
                  <Button variant="outline" className="mt-4">
                    <ArrowLeft className="h-4 w-4 mr-2" /> Back to Login
                  </Button>
                </Link>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-foreground mb-1.5 block">Email Address</label>
                  <Input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="Enter your registered email"
                    icon={<Mail className="h-4 w-4" />}
                  />
                </div>
                <Button type="submit" variant="premium" className="w-full" size="lg">
                  Send Reset Link
                </Button>
                <Link to="/login" className="flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
                  <ArrowLeft className="h-4 w-4" /> Back to login
                </Link>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
