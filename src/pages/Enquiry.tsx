import { useState } from 'react';
import { motion } from 'framer-motion';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { FloatingButtons } from '@/components/layout/FloatingButtons';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowRight, CheckCircle } from 'lucide-react';

const Enquiry = () => {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar isVisible={true} />
      
      {/* Hero */}
      <section className="pt-32 pb-12 bg-background relative">
        <div className="container mx-auto px-4 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto text-center"
          >
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="line-accent" />
              <span className="text-primary font-semibold tracking-wider text-sm uppercase">
                Enquiry
              </span>
              <div className="line-accent" />
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6">
              Request a
              <span className="text-primary"> Quote</span>
            </h1>
            <p className="text-foreground-muted text-lg leading-relaxed">
              Fill out the form below and our team will get back to you 
              with a customized solution for your power requirements.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Form */}
      <section className="py-12 pb-24 bg-background">
        <div className="container mx-auto px-4 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="max-w-2xl mx-auto"
          >
            {submitted ? (
              <div className="card-industrial p-12 rounded-lg text-center">
                <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-primary/10 flex items-center justify-center">
                  <CheckCircle className="w-10 h-10 text-primary" />
                </div>
                <h2 className="text-2xl font-bold text-foreground mb-4">Thank You!</h2>
                <p className="text-foreground-muted mb-6">
                  Your enquiry has been submitted successfully. Our team will contact you shortly.
                </p>
                <Button variant="hero" onClick={() => setSubmitted(false)}>
                  Submit Another Enquiry
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="card-industrial p-8 rounded-lg space-y-6">
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
                    className="bg-background border-border min-h-[120px]"
                  />
                </div>

                <Button type="submit" variant="hero" size="lg" className="w-full group">
                  Submit Enquiry
                  <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </form>
            )}
          </motion.div>
        </div>
      </section>

      <Footer />
      <FloatingButtons />
    </div>
  );
};

export default Enquiry;
