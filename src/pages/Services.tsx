import { motion } from 'framer-motion';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { FloatingButtons } from '@/components/layout/FloatingButtons';
import { Wrench, Clock, Shield, Users, Phone, Truck } from 'lucide-react';

const services = [
  {
    icon: Wrench,
    title: 'Installation & Commissioning',
    description: 'Professional installation by certified engineers with comprehensive commissioning and testing.',
  },
  {
    icon: Clock,
    title: 'Annual Maintenance Contracts',
    description: 'Preventive maintenance programs to ensure optimal performance and longevity of your equipment.',
  },
  {
    icon: Shield,
    title: 'Warranty Services',
    description: 'Comprehensive warranty coverage with prompt response to any manufacturing defects or issues.',
  },
  {
    icon: Users,
    title: 'Technical Consultation',
    description: 'Expert guidance on power requirements, system design, and optimal generator selection.',
  },
  {
    icon: Phone,
    title: '24/7 Emergency Support',
    description: 'Round-the-clock technical support and emergency breakdown service across India.',
  },
  {
    icon: Truck,
    title: 'Spare Parts Supply',
    description: 'Genuine KOEL spare parts with nationwide availability and quick delivery.',
  },
];

const Services = () => {
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
                Our Services
              </span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6">
              Comprehensive
              <br />
              <span className="text-primary">Support Solutions</span>
            </h1>
            <p className="text-foreground-muted text-lg leading-relaxed">
              From installation to maintenance, we provide end-to-end services 
              to ensure your power systems operate at peak efficiency.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20 bg-background-secondary">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, index) => (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="card-industrial p-8 rounded-lg"
              >
                <div className="w-14 h-14 rounded-lg bg-primary/10 flex items-center justify-center mb-6">
                  <service.icon className="w-7 h-7 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-3">
                  {service.title}
                </h3>
                <p className="text-foreground-muted leading-relaxed">
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
