import { Phone, MessageCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export const FloatingButtons = () => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, delay: 3.5 }}
      className="fixed top-1/2 -translate-y-1/2 right-6 z-[9999] flex flex-col gap-4"
    >
      {/* WhatsApp Button */}
      <a
        href="https://wa.me/919876543210"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center w-14 h-14 rounded-full bg-[#25D366] hover:bg-[#20BD5A] text-white shadow-[0_4px_20px_rgba(37,211,102,0.4)] hover:shadow-[0_6px_25px_rgba(37,211,102,0.5)] hover:scale-110 transition-all duration-300"
        aria-label="Contact via WhatsApp"
      >
        <MessageCircle size={24} />
      </a>
      
      {/* Phone Button */}
      <a
        href="tel:+919876543210"
        className="flex items-center justify-center w-14 h-14 rounded-full bg-primary hover:bg-primary-hover text-primary-foreground shadow-[0_4px_20px_hsl(350_80%_45%/0.4)] hover:shadow-[0_6px_25px_hsl(350_80%_45%/0.5)] hover:scale-110 transition-all duration-300 animate-pulse-glow"
        aria-label="Call us"
      >
        <Phone size={24} />
      </a>
    </motion.div>
  );
};
