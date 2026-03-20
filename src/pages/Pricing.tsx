import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Check, Infinity, Star } from 'lucide-react'
import type { Plan } from '@/types'

const PLANS: Plan[] = [
  {
    id: '1',
    name: 'Starter',
    credits: 50,
    price: 499,
    validity_months: 1,
    is_active: true,
    is_default_signup: true,
    description: 'Perfect for freelancers and small businesses',
    features: ['50 credits', 'AI ledger mapping', 'XML generation', 'Email support', '1 month validity'],
  },
  {
    id: '2',
    name: 'Professional',
    credits: 200,
    price: 1499,
    validity_months: 3,
    is_active: true,
    is_default_signup: false,
    description: 'Best for growing accounting practices',
    features: ['200 credits', 'AI ledger mapping', 'Priority mapping', 'Priority support', '3 months validity', 'Master HTML support'],
  },
  {
    id: '3',
    name: 'Enterprise',
    credits: 1000,
    price: 3999,
    validity_months: 12,
    is_active: true,
    is_default_signup: false,
    description: 'For large firms with high volume needs',
    features: ['1000 credits', 'AI ledger mapping', 'Bulk processing', 'Dedicated support', '12 months validity', 'Master HTML support', 'API access'],
  },
  {
    id: '4',
    name: 'Unlimited',
    credits: 9999,
    price: 9999,
    validity_months: 0,
    is_active: true,
    is_default_signup: false,
    description: 'Unlimited access for enterprise clients',
    features: ['Unlimited credits', 'AI ledger mapping', 'Bulk processing', '24/7 support', 'No expiry', 'Master HTML support', 'API access', 'Custom integration'],
  },
]

export function Pricing() {
  return (
    <div className="space-y-8 animate-fade-in">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-foreground">Plans & Pricing</h1>
        <p className="text-muted-foreground mt-1 max-w-lg mx-auto">
          Choose the plan that fits your needs. All plans include AI-powered ledger mapping.
        </p>
        <p className="text-xs text-muted-foreground mt-2">1 voucher = 0.1 credit</p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
        {PLANS.map(plan => {
          const isPopular = plan.name === 'Professional'
          return (
            <Card
              key={plan.id}
              className={`relative flex flex-col hover:shadow-card-hover transition-all duration-300 ${isPopular ? 'border-primary shadow-elegant scale-[1.02]' : ''}`}
            >
              {isPopular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <Badge className="flex items-center gap-1"><Star className="h-3 w-3" /> Most Popular</Badge>
                </div>
              )}
              {plan.is_default_signup && (
                <div className="absolute top-3 right-3">
                  <Badge variant="success" className="text-xs">Signup Plan</Badge>
                </div>
              )}
              <CardContent className="p-6 flex flex-col flex-1">
                <h3 className="text-lg font-semibold text-foreground">{plan.name}</h3>
                <p className="text-sm text-muted-foreground mt-1">{plan.description}</p>

                <div className="my-6">
                  <span className="text-3xl font-bold text-foreground">&#8377;{plan.price.toLocaleString()}</span>
                  <span className="text-muted-foreground text-sm">
                    {plan.validity_months === 0 ? ' /lifetime' : plan.validity_months === 1 ? ' /month' : ` /${plan.validity_months} months`}
                  </span>
                </div>

                <div className="text-sm text-muted-foreground flex items-center gap-2 mb-4">
                  <span className="font-semibold text-foreground">{plan.credits.toLocaleString()}</span> credits
                  {plan.validity_months === 0 && (
                    <span className="flex items-center gap-1 text-accent">
                      <Infinity className="h-4 w-4" /> No expiry
                    </span>
                  )}
                </div>

                <ul className="space-y-2 flex-1">
                  {plan.features.map(feature => (
                    <li key={feature} className="flex items-start gap-2 text-sm">
                      <Check className="h-4 w-4 text-accent mt-0.5 flex-shrink-0" />
                      <span className="text-muted-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  variant={isPopular ? 'premium' : 'outline'}
                  className="w-full mt-6"
                  size="lg"
                >
                  Get {plan.name}
                </Button>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
