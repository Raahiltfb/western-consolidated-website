import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/theme/ThemeToggle';
import { useTheme } from '@/components/theme/ThemeProvider';
import wcplLogoLight from '@/assets/wcpl-logo.png';
import wcplLogoDark from '@/assets/wcpl-logo-dark.png';

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
  const { theme } = useTheme();
  const logo = theme === 'dark' ? wcplLogoDark : wcplLogoLight;

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
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
          initial={{ y: -80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -80, opacity: 0 }}
          transition={{ duration: 0.45, ease: 'easeOut' }}
          className={`fixed top-0 left-0 right-0 z-50 ${
            isScrolled ? 'navbar-solid' : 'navbar-transparent'
          }`}
        >
          <div className="container mx-auto px-4 lg:px-8">
            <div className="flex items-center justify-between h-20">

              {/* Logo */}
              <Link to="/" className="flex items-center">
                <img
                  src={logo}
                  alt="Western Consolidated"
                  className="h-16 w-auto"
                />
              </Link>
              
              {/* Desktop Navigation */}
              <nav className="hidden lg:flex items-center gap-2">
                {navLinks.map((link) => (
          <Link
            key={link.path}
            to={link.path}
            className={`relative px-4 py-2 text-[13px] font-semibold tracking-[0.05em] uppercase transition-all duration-300 rounded-md ${
              location.pathname === link.path
              ? 'text-primary'
              : 'text-foreground/70 hover:text-primary'
            }`}
            >
            {link.name}
            {/* Subtle underline for the active link */}
            {location.pathname === link.path && (
              <motion.div 
                layoutId="nav-underline"
                className="absolute bottom-1 left-4 right-4 h-[2px] bg-primary" 
                />
            )}
          </Link>
        ))}
              </nav>

              {/* CTA, Theme Toggle & Mobile Menu */}
              <div className="flex items-center gap-3">
                <ThemeToggle />
                
                <Link to="/enquiry" className="hidden sm:block">
                  <Button variant="hero">Enquiry</Button>
                </Link>

                <button
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="lg:hidden p-2 text-foreground hover:text-primary"
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
                      className={`px-4 py-3 rounded-md ${
                        location.pathname === link.path
                          ? 'text-primary bg-card'
                          : 'text-foreground-muted hover:bg-card'
                      }`}
                    >
                      {link.name}
                    </Link>
                  ))}
                </nav>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.header>
      )}
    </AnimatePresence>
  );
};
