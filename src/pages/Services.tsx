import { motion } from 'framer-motion';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { FloatingButtons } from '@/components/layout/FloatingButtons';
import { Wrench, Clock, Shield, Users, Phone, Truck, CheckCircle, Activity, Globe } from 'lucide-react';

const services = [
  {
    icon: CheckCircle,
    title: 'Free Service Checks',
    description: 'Comprehensive health assessments to ensure your equipment remains in peak condition.',
  },
  {
    icon: Globe,
    title: 'KOEL CARE Network',
    description: 'Authorized neighborhood centers providing prompt response, operational support, and repair contracts.',
  },
  {
    icon: Wrench,
    title: 'Single Window Solutions',
    description: 'Unified support for Gensets and customized Annual Maintenance Contracts (AMC).',
  },
  {
    icon: Phone,
    title: '24/7 Helpline',
    description: 'Round-the-clock assistance and technical support to address inquiries instantly.',
  },
  {
    icon: Activity,
    title: 'Advanced CRM Support',
    description: 'Fully implemented CRM modules for proactive and rapid service response times.',
  },
  {
    icon: Users,
    title: 'Expert Service Team',
    description: 'Highly trained engineers delivering value-added support to international standards.',
  },
  {
    icon: Clock,
    title: 'Uptime Optimization',
    description: "Specialized 'Mean Time to Restore' systems and 'First Pick Availability' to maximize generator uptime.",
  },
  {
    icon: Shield,
    title: 'Product Life Extension',
    description: 'Specialized K-oil and K-cool Super Plus fluids to enhance engine longevity and performance.',
  },
  {
    icon: Truck,
    title: 'Comprehensive Logistics',
    description: 'Seamless spare parts availability, product training, and expert warranty administration.',
  },
];

const Services = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar isVisible={true} />
      
      {/* Hero */}
      <section className="pt-32 pb-20 bg-background relative overflow-hidden">
        {/* Adjusted Background: 70% width and moved to the right */}
        <div className="absolute top-0 right-0 bottom-0 w-[70%] z-0 hidden md:block">
          <div 
            className="absolute inset-0 opacity-100 dark:opacity-100 transition-opacity duration-500"
            style={{
              backgroundImage: 'url("/images/services-bg.jpg")',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              maskImage: 'linear-gradient(to right, transparent, black 40%)',
              WebkitMaskImage: 'linear-gradient(to right, transparent, black 40%)'
            }}
          />
          {/* Max Brightness Reduction: Solid overlays */}
          <div className="absolute inset-0 bg-white/15 dark:bg-black/20 z-10" />
        </div>

        {/* Mobile background (full width low opacity) */}
        <div className="absolute inset-0 z-0 md:hidden opacity-10">
           <div 
            className="absolute inset-0 brightness-[0.4]"
            style={{
              backgroundImage: 'url("/images/services-bg.jpg")',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          />
        </div>

        <div className="container mx-auto px-4 lg:px-8 relative z-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="line-accent" />
              <span className="text-primary font-semibold tracking-wider text-sm uppercase">
                Customer Care
              </span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6">
              At Your Service,
              <br />
              <span className="text-primary">Whenever & Wherever</span>
            </h1>
            {/* Added drop-shadow and subtle blur/bg for legibility */}
            <p className="text-foreground-muted text-lg leading-relaxed max-w-2xl font-medium dark:font-normal drop-shadow-sm p-1 -ml-1 rounded-sm">
              After-sales support is the cornerstone of long-term business viability.<br></br> 
              With <strong>60+ years of service excellence</strong>, we believe in the<br></br> "Think Global, Act Local" 
              philosophy, building enduring relationships<br></br> with every customer through 
              full dedication and world-class support.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20 bg-background-secondary">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-foreground">Service Offerings</h2>
            <div className="h-1 w-20 bg-primary mt-4" />
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, index) => (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.05 }}
                className="card-industrial p-8 rounded-lg border border-primary/5 hover:border-primary/20 transition-colors"
              >
                <div className="w-14 h-14 rounded-lg bg-primary/10 flex items-center justify-center mb-6">
                  <service.icon className="w-7 h-7 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-3">
                  {service.title}
                </h3>
                <p className="text-foreground-muted leading-relaxed text-sm">
                  {service.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
      <FloatingButtons />
    </div>
  );
};

export default Services;