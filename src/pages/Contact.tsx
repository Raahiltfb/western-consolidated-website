import { motion } from 'framer-motion';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { FloatingButtons } from '@/components/layout/FloatingButtons';
import { Phone, Mail, MapPin, Clock } from 'lucide-react';

const Contact = () => {
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

      {/* Contact Info */}
      <section className="py-20 bg-background-secondary">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: MapPin,
                title: 'Address',
                details: ['Industrial Area', 'Pune, Maharashtra', 'India - 411001'],
              },
              {
                icon: Phone,
                title: 'Phone',
                details: ['+91 98765 43210', '+91 20 1234 5678'],
                links: ['tel:+919876543210', 'tel:+912012345678'],
              },
              {
                icon: Mail,
                title: 'Email',
                details: ['info@wcpl.in', 'sales@wcpl.in'],
                links: ['mailto:info@wcpl.in', 'mailto:sales@wcpl.in'],
              },
              {
                icon: Clock,
                title: 'Business Hours',
                details: ['Mon - Sat: 9:00 AM - 6:00 PM', 'Sunday: Closed'],
              },
            ].map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="card-industrial p-6 rounded-lg"
              >
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <item.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-3">{item.title}</h3>
                <div className="space-y-1">
                  {item.details.map((detail, i) => (
                    item.links ? (
                      <a
                        key={i}
                        href={item.links[i]}
                        className="block text-foreground-muted hover:text-primary transition-colors"
                      >
                        {detail}
                      </a>
                    ) : (
                      <p key={i} className="text-foreground-muted">{detail}</p>
                    )
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Map Placeholder */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="aspect-[21/9] bg-card border border-border rounded-lg flex items-center justify-center"
          >
            <div className="text-center">
              <MapPin className="w-12 h-12 text-foreground-muted mx-auto mb-4" />
              <p className="text-foreground-muted">Map Placeholder</p>
              <p className="text-muted-foreground text-sm">Google Maps embed will go here</p>
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
