import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, X, ArrowRight } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export const EnquiryWidget = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const location = useLocation();
  const isEnquiryPage = location.pathname === '/enquiry';
  const isPortalPage = location.pathname.startsWith('/portal');

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (isEnquiryPage || isPortalPage) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 100 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className="fixed bottom-24 right-6 z-[9998]"
        >
          <AnimatePresence mode="wait">
            {isExpanded ? (
              <motion.div
                key="expanded"
                initial={{ opacity: 0, scale: 0.9, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 10 }}
                transition={{ duration: 0.3 }}
                className="bg-card border border-border rounded-xl p-6 shadow-lg w-72"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-foreground font-semibold text-sm">Get a Quote</h3>
                  <button
                    onClick={() => setIsExpanded(false)}
                    className="text-foreground-muted hover:text-foreground transition-colors"
                  >
                    <X size={16} />
                  </button>
                </div>
                <p className="text-foreground-muted text-xs mb-4 leading-relaxed">
                  Need a power solution? Tell us your requirements and get a customized quote.
                </p>
                <Link to="/enquiry" onClick={() => setIsExpanded(false)}>
                  <Button variant="hero" size="sm" className="w-full group">
                    Submit Enquiry
                    <ArrowRight size={14} className="ml-1 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </motion.div>
            ) : (
              <motion.button
                key="collapsed"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsExpanded(true)}
                className="flex items-center gap-2 bg-primary text-primary-foreground px-5 py-3 rounded-full shadow-[0_4px_20px_hsl(350_80%_45%/0.4)] hover:shadow-[0_6px_25px_hsl(350_80%_45%/0.5)] transition-shadow font-semibold text-sm"
              >
                <FileText size={16} />
                Enquiry
              </motion.button>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
