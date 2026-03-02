import { motion, AnimatePresence } from 'framer-motion';
import { X, Phone, MessageCircle, Mail, MapPin, Linkedin, Facebook } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/components/theme/ThemeProvider';
import wcplLogoLight from '@/assets/wcpl-logo.png';
import wcplLogoDark from '@/assets/wcpl-logo-dark.png';

const menuLinks = [
  { name: 'Home', path: '/' },
  { name: 'About', path: '/about' },
  { name: 'Products', path: '/products' },
  { name: 'Services', path: '/services' },
  { name: 'Clients', path: '/clients' },
  { name: 'CSR', path: '/csr' },
  { name: 'Career', path: '/career' },
  { name: 'Contact', path: '/contact' },
];

interface FullScreenMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FullScreenMenu = ({ isOpen, onClose }: FullScreenMenuProps) => {
  const { theme } = useTheme();
  const logo = theme === 'dark' ? wcplLogoDark : wcplLogoLight;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          className="fixed inset-0 z-[9999] bg-background/98 backdrop-blur-md"
        >
          {/* Logo watermark */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <img
              src={logo}
              alt=""
              className="w-96 h-auto opacity-[0.03]"
            />
          </div>

          {/* Close button */}
          <motion.button
            initial={{ opacity: 0, rotate: -90 }}
            animate={{ opacity: 1, rotate: 0 }}
            transition={{ delay: 0.2 }}
            onClick={onClose}
            className="absolute top-6 right-6 w-12 h-12 flex items-center justify-center text-foreground hover:text-primary transition-colors z-10"
            aria-label="Close menu"
          >
            <X size={28} />
          </motion.button>

          <div className="container mx-auto px-4 lg:px-8 h-full flex flex-col lg:flex-row items-center justify-center gap-16 lg:gap-24 py-20">
            {/* Left: Navigation */}
            <nav className="flex flex-col gap-2 lg:gap-3">
              {menuLinks.map((link, index) => (
                <motion.div
                  key={link.path}
                  initial={{ opacity: 0, x: -40 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 + index * 0.05, duration: 0.4 }}
                >
                  <Link
                    to={link.path}
                    onClick={onClose}
                    className="text-3xl lg:text-5xl font-bold font-display text-foreground hover:text-primary transition-colors duration-300 block py-1"
                  >
                    {link.name}
                  </Link>
                </motion.div>
              ))}

              {/* Mobile: Enquiry, WhatsApp, Call */}
              <motion.div
                initial={{ opacity: 0, x: -40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6, duration: 0.4 }}
                className="flex flex-wrap gap-3 mt-6 lg:hidden"
              >
                <Link to="/enquiry" onClick={onClose}>
                  <Button variant="hero" size="lg">Enquiry</Button>
                </Link>
                <a href="https://wa.me/919876543210" target="_blank" rel="noopener noreferrer">
                  <Button variant="heroOutline" size="lg">
                    <MessageCircle size={18} className="mr-2" /> WhatsApp
                  </Button>
                </a>
                <a href="tel:+919876543210">
                  <Button variant="heroOutline" size="lg">
                    <Phone size={18} className="mr-2" /> Call
                  </Button>
                </a>
              </motion.div>
            </nav>

            {/* Right: Contact Info (Desktop) */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="hidden lg:flex flex-col gap-8 max-w-sm"
            >
              <div>
                <h3 className="text-primary font-semibold text-sm uppercase tracking-wider mb-4">
                  Quick Contact
                </h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <MapPin size={18} className="text-primary mt-0.5 shrink-0" />
                    <p className="text-foreground-muted text-sm leading-relaxed">
                      Western Consolidated Pvt. Ltd.<br />
                      19, Ganesh Chandra Avenue,<br />
                      Kolkata 700013
                    </p>
                  </div>
                  <a href="tel:(033)-22376813" className="flex items-center gap-3 text-foreground-muted hover:text-primary transition-colors">
                    <Phone size={18} className="text-primary shrink-0" />
                    <span className="text-sm">(033)-22376813</span>
                  </a>
                  <a href="mailto:western@westernconsolidated.com" className="flex items-center gap-3 text-foreground-muted hover:text-primary transition-colors">
                    <Mail size={18} className="text-primary shrink-0" />
                    <span className="text-sm">western@westernconsolidated.com</span>
                  </a>
                </div>
              </div>

              <div>
                <h3 className="text-primary font-semibold text-sm uppercase tracking-wider mb-4">
                  Connect
                </h3>
                <div className="flex gap-3">
                  <a
                    href="https://www.linkedin.com/company/western-consolidated-private-ltd/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-full bg-card border border-border flex items-center justify-center text-foreground-muted hover:text-primary hover:border-primary transition-colors"
                  >
                    <Linkedin size={18} />
                  </a>
                  <a
                    href="https://www.facebook.com/people/Western-Consolidated-Pvt-Ltd/100064480881327/#"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-full bg-card border border-border flex items-center justify-center text-foreground-muted hover:text-primary hover:border-primary transition-colors"
                  >
                    <Facebook size={18} />
                  </a>
                  <a
                    href="https://wa.me/919876543210"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-full bg-card border border-border flex items-center justify-center text-foreground-muted hover:text-primary hover:border-primary transition-colors"
                  >
                    <MessageCircle size={18} />
                  </a>
                </div>
              </div>

              <Link to="/enquiry" onClick={onClose}>
                <Button variant="hero" size="lg" className="w-full">
                  Submit Enquiry
                </Button>
              </Link>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
