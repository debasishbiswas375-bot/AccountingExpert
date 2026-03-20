import { Link } from 'react-router-dom'
import { Mail, Phone, MapPin } from 'lucide-react'

export function Footer() {
  return (
    <footer className="bg-sidebar text-sidebar-foreground">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center">
                <span className="text-sm font-bold text-primary-foreground">A</span>
              </div>
              <span className="text-lg font-bold text-primary-foreground">Accountesy</span>
            </div>
            <p className="text-sm leading-relaxed">
              AI-powered financial automation. Convert bank statements to Tally XML
              vouchers with intelligent ledger mapping.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-primary-foreground mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link to="/pricing" className="text-sm hover:text-primary-foreground transition-colors">Pricing</Link></li>
              <li><Link to="/convert-excel" className="text-sm hover:text-primary-foreground transition-colors">Free Excel Tool</Link></li>
              <li><Link to="/help" className="text-sm hover:text-primary-foreground transition-colors">Help & Features</Link></li>
              <li><Link to="/feedback" className="text-sm hover:text-primary-foreground transition-colors">Contact Us</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-primary-foreground mb-4">Contact</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-2 text-sm">
                <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <span>123 Finance Street, Business District, Bangalore 560001, India</span>
              </li>
              <li className="flex items-center gap-2 text-sm">
                <Phone className="h-4 w-4 flex-shrink-0" />
                <span>+91 80 1234 5678</span>
              </li>
              <li className="flex items-center gap-2 text-sm">
                <Mail className="h-4 w-4 flex-shrink-0" />
                <span>support@accountesy.com</span>
              </li>
            </ul>
          </div>

          {/* Sponsor / Legal */}
          <div>
            <h4 className="font-semibold text-primary-foreground mb-4">Legal</h4>
            <ul className="space-y-2">
              <li><span className="text-sm hover:text-primary-foreground transition-colors cursor-pointer">Privacy Policy</span></li>
              <li><span className="text-sm hover:text-primary-foreground transition-colors cursor-pointer">Terms of Service</span></li>
              <li><span className="text-sm hover:text-primary-foreground transition-colors cursor-pointer">Refund Policy</span></li>
            </ul>
            <div className="mt-6 pt-4 border-t border-sidebar-hover">
              <p className="text-xs">Sponsored by</p>
              <p className="text-sm font-medium text-primary-foreground mt-1">Accountesy Technologies Pvt. Ltd.</p>
            </div>
          </div>
        </div>

        <div className="border-t border-sidebar-hover mt-10 pt-6 text-center">
          <p className="text-sm">&copy; 2026 Accountesy. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
