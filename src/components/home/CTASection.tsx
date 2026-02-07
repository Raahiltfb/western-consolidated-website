import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const CTASection = () => {
  return (
    <section className="py-24 bg-background-secondary relative overflow-hidden">
      {/* Background accent */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-primary/5" />
      
      {/* Grid overlay */}
      <div className="absolute inset-0 grid-overlay opacity-10" />
      
      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto text-center"
        >
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="line-accent" />
            <span className="text-primary font-semibold tracking-wider text-sm uppercase">
              Get Started
            </span>
            <div className="line-accent" />
          </div>
          
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">
            Ready to Power Your
            <br />
            <span className="text-primary">Operations?</span>
          </h2>
          
          <p className="text-foreground-muted text-lg mb-10 max-w-2xl mx-auto">
            Connect with our team to discuss your power requirements. 
            We'll help you find the perfect solution tailored to your specific requirements.
          </p>
          
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/enquiry">
              <Button variant="hero" size="xl" className="group">
                Request a Quote
                <ArrowRight size={20} className="ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <a href="tel:+919876543210">
              <Button variant="heroOutline" size="xl">
                <Phone size={20} className="mr-2" />
                Call Us Now
              </Button>
            </a>
          </div>
          
          {/* Trust badges */}
          <div className="flex flex-wrap justify-center items-center gap-8 mt-12 pt-12 border-t border-border">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-accent" />
              <span className="text-foreground-muted text-sm">ISO Certified</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-primary" />
              <span className="text-foreground-muted text-sm">KOEL Authorized</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-secondary" />
              <span className="text-foreground-muted text-sm">Pan-India Service</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
