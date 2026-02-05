import { Phone, MessageCircle } from 'lucide-react';

export const FloatingButtons = () => {
  return (
    <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-4">
      {/* WhatsApp Button */}
      <a
        href="https://wa.me/919876543210"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center w-14 h-14 rounded-full bg-[#25D366] hover:bg-[#20BD5A] text-white shadow-lg hover:scale-110 transition-all duration-300"
        aria-label="Contact via WhatsApp"
      >
        <MessageCircle size={24} />
      </a>
      
      {/* Phone Button */}
      <a
        href="tel:+919876543210"
        className="flex items-center justify-center w-14 h-14 rounded-full bg-primary hover:bg-primary-hover text-primary-foreground shadow-lg hover:scale-110 transition-all duration-300 animate-pulse-glow"
        aria-label="Call us"
      >
        <Phone size={24} />
      </a>
    </div>
  );
};
