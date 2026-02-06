import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Linkedin, Facebook, Twitter } from 'lucide-react';
import wcplLogo from '@/assets/wcpl-logo.jpeg';

const quickLinks = [
  { name: 'About Us', path: '/about' },
  { name: 'Products', path: '/products' },
  { name: 'Services', path: '/services' },
  { name: 'Clients', path: '/clients' },
  { name: 'Career', path: '/career' },
  { name: 'CSR', path: '/csr' },
  { name: 'Contact', path: '/contact' },
];

const productCategories = [
  { name: '7.5–750 kVA & HHP', path: '/products/standard-range' },
  { name: 'Hybrid Series', path: '/products/hybrid' },
  { name: 'Optiprime Series', path: '/products/optiprime' },
  { name: 'PNG Range', path: '/products/png-range' },
  { name: 'Sentinel Range', path: '/products/sentinel' },
];

export const Footer = () => {
  return (
    <footer className="bg-background-secondary border-t border-border">
      {/* Main Footer */}
      <div className="container mx-auto px-4 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="space-y-6">
            <Link to="/" className="flex items-center gap-3">
              <div className="relative flex items-center justify-center">
                {/* Subtle radial glow for contrast */}
                <div className="absolute inset-0 bg-gradient-radial from-white/8 via-white/3 to-transparent rounded-full scale-150 blur-sm" />
                <img 
                  src={wcplLogo} 
                  alt="Western Consolidated" 
                  className="relative h-16 w-auto drop-shadow-[0_4px_8px_rgba(0,0,0,0.6)] drop-shadow-[0_0_20px_rgba(255,255,255,0.1)]"
                />
              </div>
            </Link>
            <p className="text-foreground-muted text-sm leading-relaxed">
              Authorized GOEM of KOEL with 60+ years of engineering excellence. 
              Delivering mission-critical power solutions across India.
            </p>
            <div className="flex gap-4">
              <a 
                href="#" 
                className="w-10 h-10 rounded-full bg-card border border-border flex items-center justify-center text-foreground-muted hover:text-primary hover:border-primary transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin size={18} />
              </a>
              <a 
                href="#" 
                className="w-10 h-10 rounded-full bg-card border border-border flex items-center justify-center text-foreground-muted hover:text-primary hover:border-primary transition-colors"
                aria-label="Facebook"
              >
                <Facebook size={18} />
              </a>
              <a 
                href="#" 
                className="w-10 h-10 rounded-full bg-card border border-border flex items-center justify-center text-foreground-muted hover:text-primary hover:border-primary transition-colors"
                aria-label="Twitter"
              >
                <Twitter size={18} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-foreground font-semibold mb-6">Quick Links</h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.path}>
                  <Link 
                    to={link.path}
                    className="text-foreground-muted hover:text-primary transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Products */}
          <div>
            <h4 className="text-foreground font-semibold mb-6">Products</h4>
            <ul className="space-y-3">
              {productCategories.map((link) => (
                <li key={link.path}>
                  <Link 
                    to={link.path}
                    className="text-foreground-muted hover:text-primary transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-foreground font-semibold mb-6">Contact Us</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin size={18} className="text-primary mt-0.5 shrink-0" />
                <span className="text-foreground-muted text-sm">
                  Western Consolidated Pvt. Ltd. 19, Ganesh Chandra Avenue, Kolkata 700013
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={18} className="text-primary shrink-0" />
                <a 
                  href="tel:(033)-22376813" 
                  className="text-foreground-muted hover:text-primary transition-colors text-sm"
                >
                  (033)-22376813
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={18} className="text-primary shrink-0" />
                <a 
                  href="western@westernconsolidated.com" 
                  className="text-foreground-muted hover:text-primary transition-colors text-sm"
                >
                  western@westernconsolidated.com
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-border">
        <div className="container mx-auto px-4 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-foreground-muted">
            <p>© {new Date().getFullYear()} Western Consolidated Private Limited. All rights reserved.</p>
            <div className="flex gap-6">
              <Link to="/privacy" className="hover:text-foreground transition-colors">
                Privacy Policy
              </Link>
              <Link to="/terms" className="hover:text-foreground transition-colors">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
