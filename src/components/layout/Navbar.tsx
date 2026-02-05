import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import wcplLogo from '@/assets/wcpl-logo-transparent.png';

const navLinks = [
  { name: 'Home', path: '/' },
  { name: 'About', path: '/about' },
  { name: 'Products', path: '/products' },
  { name: 'Services', path: '/services' },
  { name: 'Clients', path: '/clients' },
  { name: 'CSR', path: '/csr' },
  { name: 'Career', path: '/career' },
  { name: 'Contact', path: '/contact' },
];

interface NavbarProps {
  isVisible?: boolean;
}

export const Navbar = ({ isVisible = true }: NavbarProps) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.header
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -100, opacity: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
            isScrolled ? 'navbar-solid' : 'navbar-transparent'
          }`}
        >
          <div className="container mx-auto px-4 lg:px-8">
            <div className="flex items-center justify-between h-20">
              {/* Logo */}
              <Link to="/" className="flex items-center gap-3">
                <div className="relative flex items-center justify-center">
                  {/* Logo with enhanced glow - no background circle */}
                  <img 
                    src={wcplLogo} 
                    alt="Western Consolidated" 
                    className="h-24 w-auto"
                    style={{
                      filter: 'brightness(1.2) contrast(1.1) drop-shadow(0px 0px 8px rgba(255, 255, 255, 0.4)) drop-shadow(0px 0px 16px rgba(255, 255, 255, 0.3)) drop-shadow(0px 2px 4px rgba(0, 0, 0, 0.8))'
                    }}
                  />
                </div>
              </Link>

              {/* Desktop Navigation */}
              <nav className="hidden lg:flex items-center gap-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`px-4 py-2 text-sm font-medium transition-colors duration-200 rounded-md ${
                      location.pathname === link.path
                        ? 'text-primary'
                        : 'text-foreground-muted hover:text-foreground'
                    }`}
                  >
                    {link.name}
                  </Link>
                ))}
              </nav>

              {/* CTA & Mobile Menu */}
              <div className="flex items-center gap-4">
                <Link to="/enquiry" className="hidden sm:block">
                  <Button variant="hero" size="default">
                    Enquiry
                  </Button>
                </Link>
                
                <button
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="lg:hidden p-2 text-foreground hover:text-primary transition-colors"
                  aria-label="Toggle menu"
                >
                  {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
              </div>
            </div>
          </div>

          {/* Mobile Menu */}
          <AnimatePresence>
            {isMobileMenuOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="lg:hidden bg-background border-t border-border"
              >
                <nav className="container mx-auto px-4 py-4 flex flex-col gap-2">
                  {navLinks.map((link) => (
                    <Link
                      key={link.path}
                      to={link.path}
                      className={`px-4 py-3 text-base font-medium transition-colors rounded-md ${
                        location.pathname === link.path
                          ? 'text-primary bg-card'
                          : 'text-foreground-muted hover:text-foreground hover:bg-card'
                      }`}
                    >
                      {link.name}
                    </Link>
                  ))}
                  <Link to="/enquiry" className="mt-2">
                    <Button variant="hero" size="lg" className="w-full">
                      Enquiry
                    </Button>
                  </Link>
                </nav>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.header>
      )}
    </AnimatePresence>
  );
};
