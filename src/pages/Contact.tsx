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

      {/* Contact Form */}
      <section className="py-16 bg-background-secondary">
        <div className="container mx-auto px-4 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center justify-center gap-3 mb-8">
              <Mail className="w-6 h-6 text-primary" />
              <h2 className="text-2xl font-bold text-foreground">Send Us a Message</h2>
            </div>
            
            <div className="max-w-2xl mx-auto">
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
              <h2 className="text-2xl font-bold text-foreground">Head Office</h2>
            </div>
            
            <div className="card-industrial p-8 rounded-lg">
              <div className="grid md:grid-cols-3 gap-8">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">Address</h3>
                    <p className="text-foreground-muted leading-relaxed">
                      <strong>Kolkata</strong><br />
                      Western Consolidated Private Limited<br />
                      19, Ganesh Chandra Avenue, Kolkata 700013
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Mail className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">Email</h3>
                    <a href="mailto:response@westernconsolidated.com" className="text-foreground-muted hover:text-primary transition-colors block">
                      response@westernconsolidated.com
                    </a>
                    <a href="mailto:western@westernconsolidated.com" className="text-foreground-muted hover:text-primary transition-colors block">
                      western@westernconsolidated.com
                    </a>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Phone className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">Phone</h3>
                    <div className="text-foreground-muted">
                      (033)-22376813 / 22378962
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Branch Offices */}
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
              <h2 className="text-2xl font-bold text-foreground">Branch Offices</h2>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  city: 'Bihar (Patna)',
                  phone: '61233122392',
                  address: 'Western Consolidated Private Limited\n201, Shyam Centre, Exhibition Road\nPatna 800001, Bihar',
                },
                {
                  city: 'Jharkhand (Ranchi)',
                  address: 'Western Consolidated Private Limited\nAnandmani Tower, Mazzanine Floor,\nShree Vishnu Talkies Lane, Main Road,\nRanchi – 834001, Jharkhand',
                },
                {
                  city: 'Mumbai',
                  address: 'Western Consolidated Private Limited\nF-102, Remi Biz Court, Plot No 9\nShah Industrial Estate, Veera Desai Road,\nAndheri (W), Mumbai, 400053,\nOpposite Supreme Chambers',
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
                    <div className="w-full">
                      <h3 className="text-lg font-semibold text-foreground mb-2">{branch.city}</h3>
                      <p className="text-foreground-muted text-sm whitespace-pre-line mb-2">
                        {branch.address}
                      </p>
                      {branch.phone && (
                        <div className="flex items-center gap-2 text-sm text-foreground-muted">
                          <Phone size={14} className="text-primary" />
                          <span>{branch.phone}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Works */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center gap-3 mb-8">
              <Factory className="w-6 h-6 text-primary" />
              <h2 className="text-2xl font-bold text-foreground">Works</h2>
            </div>
            
            <div className="card-industrial p-8 rounded-lg">
              <div className="grid md:grid-cols-2 gap-8">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">Sitarganj: Uttarakhand</h3>
                    <p className="text-foreground-muted leading-relaxed">
                      Western Consolidated Private Limited<br />
                      Plot. No. A-194D, 194E, 194F, 194G, 194H,<br />
                      Eldeco Sidcul Industrial Park Limited<br />
                      Phase 1 Sitarganj, Dist. Udham Singh Nagar,<br />
                      262405, Uttarakhand
                    </p>
                    <div className="mt-4 flex items-center gap-2 text-foreground-muted">
                      <Phone size={16} className="text-primary" />
                      <span>05948-256199 / 256200</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Mail className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">Email</h3>
                    <a 
                      href="mailto:wcplsitarganj@westernconsolidated.com" 
                      className="text-foreground-muted hover:text-primary transition-colors"
                    >
                      wcplsitarganj@westernconsolidated.com
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

{/* Map Section */}

      <section className="py-16 bg-background-secondary">

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

                  src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d7368.549507369673!2d88.354976!3d22.568825!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a0277a91a13a94f%3A0xf2368156fc970667!2sWestern%20Consolidated%20Private%20Limited!5e0!3m2!1sen!2sus!4v1770465156684!5m2!1sen!2sus"

                  width="100%"

                  height="100%"

                  style={{ border: 0 }}

                  allowFullScreen

                  loading="lazy"

                  referrerPolicy="no-referrer-when-downgrade"

                  title="WCPL Location"

                  className="w-full h-full"

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
