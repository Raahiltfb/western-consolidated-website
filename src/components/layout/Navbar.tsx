import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, Phone, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/theme/ThemeToggle';
import { useTheme } from '@/components/theme/ThemeProvider';
import { FullScreenMenu } from './FullScreenMenu';
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
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const { theme } = useTheme();

  // 🔥 FORCE DARK WHEN ON HERO
  const effectiveTheme = !isScrolled ? 'dark' : theme;

  const logo = effectiveTheme === 'dark' ? wcplLogoDark : wcplLogoLight;

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  return (
    <>
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

                {/* Hamburger */}
                <button
                  onClick={() => setIsMenuOpen(true)}
                  className={`p-2 transition-colors ${
                    effectiveTheme === 'dark'
                      ? 'text-white hover:text-primary'
                      : 'text-foreground hover:text-primary'
                  }`}
                  aria-label="Open menu"
                >
                  <Menu size={24} />
                </button>

                {/* Logo */}
                <Link to="/" className="flex items-center">
                  <img
                    src={logo}
                    alt="Western Consolidated"
                    className="h-16 w-auto"
                  />
                </Link>

                {/* Desktop Navigation */}
                <nav className="hidden lg:flex items-center gap-1">
                  {navLinks.map((link) => {
                    const isActive = location.pathname === link.path;
                    return (
                      <Link
                        key={link.path}
                        to={link.path}
                        className={`relative px-4 py-2 text-[13px] font-display font-bold uppercase tracking-wider transition-all duration-300 ${
                          isActive
                            ? 'text-primary'
                            : effectiveTheme === 'dark'
                              ? 'text-white/80 hover:text-primary'
                              : 'text-foreground-muted hover:text-primary'
                        }`}
                      >
                        <span className="relative z-10">{link.name}</span>
                        
                        {isActive && (
                          <motion.div
                            layoutId="nav-active"
                            className="absolute inset-0 bg-primary/5 rounded-md border-b-2 border-primary"
                            initial={false}
                            transition={{ type: "spring", stiffness: 380, damping: 30 }}
                          />
                        )}
                      </Link>
                    );
                  })}
                </nav>

                {/* CTA, Contact Icons & Theme Toggle */}
                <div className="flex items-center gap-2">
                  <a
                    href="https://wa.me/919876543210"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`hidden lg:flex items-center justify-center w-9 h-9 rounded-full transition-colors ${
                      effectiveTheme === 'dark'
                        ? 'text-white/70 hover:text-[#25D366]'
                        : 'text-foreground-muted hover:text-[#25D366]'
                    }`}
                    aria-label="WhatsApp"
                  >
                    <MessageCircle size={18} />
                  </a>

                  <a
                    href="tel:+919876543210"
                    className={`hidden lg:flex items-center justify-center w-9 h-9 rounded-full transition-colors ${
                      effectiveTheme === 'dark'
                        ? 'text-white/70 hover:text-primary'
                        : 'text-foreground-muted hover:text-primary'
                    }`}
                    aria-label="Call"
                  >
                    <Phone size={18} />
                  </a>

                  <ThemeToggle />
                  
                  <Link to="/enquiry" className="hidden sm:block">
                    <Button variant="hero">Enquiry</Button>
                  </Link>
                </div>

              </div>
            </div>
          </motion.header>
        )}
      </AnimatePresence>

      <FullScreenMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
    </>
  );
};