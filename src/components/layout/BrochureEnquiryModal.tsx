import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowRight, CheckCircle, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface BrochureEnquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
  brochureUrl: string;
  productName?: string;
}

export const BrochureEnquiryModal = ({ isOpen, onClose, brochureUrl, productName }: BrochureEnquiryModalProps) => {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    
    // Trigger brochure download
    const link = document.createElement('a');
    link.href = brochureUrl;
    link.download = '';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleClose = () => {
    setSubmitted(false);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[10000] flex items-center justify-center p-4"
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={handleClose} />
          
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.3 }}
            className="relative bg-card border border-border rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
          >
            {/* Close button */}
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 text-foreground-muted hover:text-foreground transition-colors z-10"
            >
              <X size={20} />
            </button>

            <div className="p-8">
              {submitted ? (
                <div className="text-center py-8">
                  <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-primary/10 flex items-center justify-center">
                    <CheckCircle className="w-10 h-10 text-primary" />
                  </div>
                  <h2 className="text-2xl font-bold text-foreground mb-4">Thank You!</h2>
                  <p className="text-foreground-muted mb-2">
                    Your enquiry has been submitted successfully.
                  </p>
                  <p className="text-foreground-muted mb-6 flex items-center justify-center gap-2">
                    <Download size={16} className="text-primary" />
                    Your brochure download has started.
                  </p>
                  <Button variant="hero" onClick={handleClose}>
                    Close
                  </Button>
                </div>
              ) : (
                <>
                  {/* Header message */}
                  <div className="mb-6 text-center">
                    <div className="flex items-center justify-center gap-3 mb-3">
                      <div className="line-accent" />
                      <span className="text-primary font-semibold tracking-wider text-sm uppercase">
                        Brochure Download
                      </span>
                      <div className="line-accent" />
                    </div>
                    <h2 className="text-2xl font-bold text-foreground mb-2">
                      Please share your details to access the brochure.
                    </h2>
                    {productName && (
                      <p className="text-foreground-muted text-sm">
                        {productName}
                      </p>
                    )}
                  </div>

                  {/* Same enquiry form */}
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground">Full Name *</label>
                        <Input 
                          placeholder="Enter your name" 
                          required
                          className="bg-background border-border"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground">Company Name</label>
                        <Input 
                          placeholder="Enter company name"
                          className="bg-background border-border"
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground">Email Address *</label>
                        <Input 
                          type="email" 
                          placeholder="Enter your email" 
                          required
                          className="bg-background border-border"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground">Phone Number *</label>
                        <Input 
                          type="tel" 
                          placeholder="Enter phone number" 
                          required
                          className="bg-background border-border"
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground">Product Category</label>
                        <Select>
                          <SelectTrigger className="bg-background border-border">
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="standard">7.5–750 kVA & HHP</SelectItem>
                            <SelectItem value="hybrid">Hybrid Series</SelectItem>
                            <SelectItem value="optiprime">Optiprime Series</SelectItem>
                            <SelectItem value="png">PNG Range</SelectItem>
                            <SelectItem value="sentinel">Sentinel Range</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground">Power Requirement (kVA)</label>
                        <Input 
                          placeholder="e.g., 250 kVA"
                          className="bg-background border-border"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground">Location / City *</label>
                      <Input 
                        placeholder="Enter your city" 
                        required
                        className="bg-background border-border"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground">Message / Requirements</label>
                      <Textarea 
                        placeholder="Describe your requirements..."
                        className="bg-background border-border min-h-[100px]"
                      />
                    </div>

                    <Button type="submit" variant="hero" size="lg" className="w-full group">
                      Submit & Download Brochure
                      <Download size={18} className="ml-2 group-hover:translate-y-0.5 transition-transform" />
                    </Button>
                  </form>
                </>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
