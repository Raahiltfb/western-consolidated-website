import { useState } from 'react';
import { motion } from 'framer-motion';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { FloatingButtons } from '@/components/layout/FloatingButtons';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Phone, Mail, MapPin, Building2, Factory, ArrowRight, CheckCircle } from 'lucide-react';

const Contact = () => {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar isVisible={true} />

      {/* Hero */}
      <section className="pt-32 pb-20 bg-background relative">
        <div className="container mx-auto px-4 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="line-accent" />
              <span className="text-primary font-semibold tracking-wider text-sm uppercase">
                Contact
              </span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6">
              Get in
              <br />
              <span className="text-primary">Touch</span>
            </h1>
            <p className="text-foreground-muted text-lg leading-relaxed">
              Have questions about our products or services? Our team is ready 
              to assist you with all your power solution needs.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Form — MOVED TO TOP */}
      <section className="py-16 bg-background-secondary">
        <div className="container mx-auto px-4 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center justify-center gap-3 mb-8 text-center">
              <Mail className="w-6 h-6 text-primary" />
              <h2 className="text-2xl font-bold text-foreground">
                Send Us a Message
              </h2>
            </div>

            <div className="max-w-2xl mx-auto">
              {submitted ? (
                <div className="card-industrial p-12 rounded-lg text-center">
                  <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-primary/10 flex items-center justify-center">
                    <CheckCircle className="w-10 h-10 text-primary" />
                  </div>
                  <h2 className="text-2xl font-bold text-foreground mb-4">
                    Thank You!
                  </h2>
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
                      <Input required />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground">Company Name</label>
                      <Input />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <Input type="email" required placeholder="Email Address *" />
                    <Input type="tel" required placeholder="Phone Number *" />
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Product Category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="standard">7.5–750 kVA & HHP</SelectItem>
                        <SelectItem value="hybrid">Hybrid Series</SelectItem>
                        <SelectItem value="optiprime">Optiprime Series</SelectItem>
                        <SelectItem value="png">PNG Range</SelectItem>
                        <SelectItem value="sentinel">Sentinel Range</SelectItem>
                      </SelectContent>
                    </Select>
                    <Input placeholder="Power Requirement (kVA)" />
                  </div>

                  <Input required placeholder="Location / City *" />
                  <Textarea className="min-h-[120px]" />

                  <Button type="submit" variant="hero" size="lg" className="w-full group">
                    Enquiry
                    <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Head Office */}
      <section className="py-16 bg-background-secondary">
        <div className="container mx-auto px-4 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center gap-3 mb-8">
              <Building2 className="w-6 h-6 text-primary" />
              <h2 className="text-2xl font-bold text-foreground">Head Office</h2>
            </div>

            <div className="card-industrial p-8 rounded-lg">
              <div className="grid md:grid-cols-3 gap-8">
                {/* unchanged */}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Branch Offices */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center gap-3 mb-8">
              <Building2 className="w-6 h-6 text-primary" />
              <h2 className="text-2xl font-bold text-foreground">Branch Offices</h2>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  city: 'Mumbai',
                  address:
                    'Western Consolidated Pvt. Ltd.\nF-102, Remi Biz Court, Plot No 9,\nShah Industrial Estate, Veera Desai Road,\nAndheri (W), Mumbai, 400053',
                },
                {
                  city: 'Patna',
                  address:
                    'Western Consolidated Pvt. Ltd.\nGram-Fatehajangpur, Mauja-Sabalpur,\nJamabandi No.265, Khata No.762,\nPatna 800009,\nBihar, India',
                },
                {
                  city: 'Ranchi',
                  address:
                    'Western Consolidated Pvt. Ltd.\nMauza - Mesra, Thana - Sadar (169),\nKhata No. 26, Plot No. 411,\nNH 33, Near B I T More,\nRanchi 835217,\nJharkhand, India',
                },
              ].map((branch, index) => (
                <motion.div
                  key={branch.city}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="card-industrial p-6 rounded-lg"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-foreground mb-2">
                        {branch.city}
                      </h3>
                      <p className="text-foreground-muted text-sm whitespace-pre-line">
                        {branch.address}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Works — unchanged */}

      {/* Map Section */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center gap-3 mb-8">
              <MapPin className="w-6 h-6 text-primary" />
              <h2 className="text-2xl font-bold text-foreground">Location</h2>
            </div>

            <div className="card-industrial rounded-lg overflow-hidden">
              <div className="aspect-[21/9] w-full">
                <iframe
                  src="https://www.google.com/maps?q=19,+Ganesh+Chandra+Avenue,+Kolkata+700013&output=embed"
                  className="w-full h-full"
                  loading="lazy"
                />
              </div>
              <div className="p-4 bg-card border-t border-border">
                <a
                  href="https://maps.app.goo.gl/ketZuTgSnT95jrjn9"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:text-primary-hover transition-colors text-sm font-medium inline-flex items-center gap-2"
                >
                  <MapPin size={16} />
                  Open in Google Maps
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
      <FloatingButtons />
    </div>
  );
};

export default Contact;
