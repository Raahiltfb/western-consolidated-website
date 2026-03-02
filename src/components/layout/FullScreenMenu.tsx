import { motion, AnimatePresence } from 'framer-motion';
import { X, Phone, MessageCircle, Mail, MapPin, Linkedin, Facebook, ChevronRight } from 'lucide-react';
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
          // Adaptive background: dark grey for dark mode, slightly off-white for light mode
          className="fixed inset-0 z-[9999] bg-background dark:bg-[#121212] text-foreground overflow-y-auto lg:overflow-hidden transition-colors duration-300"
        >
          {/* Logo Watermark - Adapts via 'logo' variable and CSS opacity */}
          <div className="fixed inset-0 flex items-center justify-center pointer-events-none opacity-[0.04] dark:opacity-[0.02] grayscale transition-opacity">
            <img src={logo} alt="" className="w-[80%] max-w-2xl" />
          </div>

          {/* Close Button */}
          <button 
            onClick={onClose}
            className="absolute top-6 right-6 lg:top-10 lg:right-10 p-2 text-muted-foreground hover:text-primary transition-all z-50"
            aria-label="Close menu"
          >
            <X size={32} strokeWidth={1.5} />
          </button>

          <div className="container mx-auto px-6 lg:px-20 min-h-screen flex flex-col justify-center py-20 lg:py-0">
            <div className="grid lg:grid-cols-[1fr_450px] gap-12 lg:gap-24 items-start">
              
              {/* Left: Navigation Section */}
              <nav className="flex flex-col border-l border-border transition-colors">
                {menuLinks.map((link, index) => (
                  <motion.div
                    key={link.path}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: index * 0.05 }}
                    className="border-b border-border/50 last:border-0 group"
                  >
                    <Link
                      to={link.path}
                      onClick={onClose}
                      className="flex items-center justify-between py-4 lg:py-5 pl-6 lg:pl-8 text-2xl lg:text-3xl font-light tracking-[0.15em] uppercase hover:text-primary transition-all group-hover:bg-muted/50"
                    >
                      <span className="relative">
                        {link.name}
                        {/* Hover vertical accent */}
                        <span className="absolute -left-6 lg:-left-8 top-0 bottom-0 w-1 bg-primary scale-y-0 group-hover:scale-y-100 transition-transform origin-top duration-300" />
                      </span>
                      <ChevronRight className="opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-primary/50" size={24} />
                    </Link>
                  </motion.div>
                ))}

                {/* Mobile-only Quick Actions */}
                <div className="flex flex-wrap gap-3 mt-8 pl-6 lg:hidden">
                  <a href="https://wa.me/919876543210" target="_blank" rel="noopener noreferrer">
                    <Button variant="outline" size="sm" className="rounded-none uppercase tracking-widest text-[10px]">
                      <MessageCircle size={14} className="mr-2" /> WhatsApp
                    </Button>
                  </a>
                  <a href="tel:+919876543210">
                    <Button variant="outline" size="sm" className="rounded-none uppercase tracking-widest text-[10px]">
                      <Phone size={14} className="mr-2" /> Call
                    </Button>
                  </a>
                </div>
              </nav>

              {/* Right: Contact Information */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="flex flex-col space-y-10 lg:space-y-12 lg:border-l lg:border-border lg:pl-16"
              >
                <div>
                  <h3 className="flex items-center gap-3 text-xs font-bold tracking-[0.3em] text-muted-foreground mb-8 uppercase">
                    <span className="w-1 h-5 bg-primary" /> Quick Contact
                  </h3>
                  
                  <div className="space-y-8">
                    {/* Address */}
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <MapPin size={14} className="text-primary" />
                        <p className="text-[10px] font-black text-primary tracking-[0.2em] uppercase">Location</p>
                      </div>
                      <p className="text-sm lg:text-base text-muted-foreground leading-relaxed font-light pl-6">
                        Western Consolidated Pvt. Ltd.<br />
                        19, Ganesh Chandra Avenue, Kolkata 700013
                      </p>
                    </div>

                    {/* Phone & Email */}
                    <div className="grid grid-cols-1 gap-6 border-t border-border pt-8 pl-6">
                      <div className="space-y-1">
                        <p className="text-[10px] font-black text-primary tracking-[0.2em] uppercase">Call Us</p>
                        <a href="tel:(033)-22376813" className="block text-sm lg:text-base text-foreground/80 hover:text-primary transition-colors tracking-wide">
                          (033)-22376813
                        </a>
                      </div>
                      <div className="space-y-1">
                        <p className="text-[10px] font-black text-primary tracking-[0.2em] uppercase">Email Us</p>
                        <a href="mailto:western@westernconsolidated.com" className="block text-sm lg:text-base text-foreground/80 hover:text-primary transition-colors tracking-wide">
                          western@westernconsolidated.com
                        </a>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Connect & CTA */}
                <div className="space-y-8 lg:pt-4">
                  <div className="flex gap-4 pl-6">
                    {[
                      { icon: <Linkedin size={18} />, href: "https://www.linkedin.com/company/western-consolidated-private-ltd/" },
                      { icon: <Facebook size={18} />, href: "https://www.facebook.com/people/Western-Consolidated-Pvt-Ltd/100064480881327/#" },
                      { icon: <MessageCircle size={18} />, href: "https://wa.me/919876543210" }
                    ].map((item, i) => (
                      <a key={i} href={item.href} target="_blank" rel="noopener noreferrer" className="w-12 h-12 flex items-center justify-center border border-border text-muted-foreground hover:text-primary hover:border-primary transition-all">
                        {item.icon}
                      </a>
                    ))}
                  </div>

                  <Link to="/enquiry" onClick={onClose} className="block pl-6">
                    <Button variant="hero" className="w-full lg:w-auto h-14 px-12 rounded-none uppercase tracking-[0.2em] text-xs font-bold border border-border hover:border-primary">
                      Submit Enquiry
                    </Button>
                  </Link>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
