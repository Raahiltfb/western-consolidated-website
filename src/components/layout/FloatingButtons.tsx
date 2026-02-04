import { Phone, MessageCircle } from 'lucide-react';

export const FloatingButtons = () => {
  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-4">
      {/* WhatsApp Button */}
      <a
        href="https://wa.me/919876543210"
        target="_blank"
        rel="noopener noreferrer"
        className="floating-btn bg-[#25D366] hover:bg-[#20BD5A] text-white"
        aria-label="Contact via WhatsApp"
      >
        <MessageCircle size={24} />
      </a>
      
      {/* Phone Button */}
      <a
        href="tel:+919876543210"
        className="floating-btn bg-primary hover:bg-primary-hover text-primary-foreground animate-pulse-glow"
        aria-label="Call us"
      >
        <Phone size={24} />
      </a>
    </div>
  );
};
