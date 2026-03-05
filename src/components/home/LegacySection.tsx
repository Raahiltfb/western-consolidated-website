import { motion } from 'framer-motion';
import { Award, Shield, Clock, Users, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const features = [
  {
    icon: Award,
    title: '60+ Years Legacy',
    description: 'Six decades of engineering excellence and trusted power solutions across industries.',
  },
  {
    icon: Shield,
    title: 'KOEL Authorized',
    description: 'Generator Original Equipment Manufactuer of Kirloskar Oil Engines Limited.',
  },
  {
    icon: Clock,
    title: '24/7 Support',
    description: 'Round-the-clock technical support and emergency service coverage.',
  },
  {
    icon: Users,
    title: '100000+ Installations',
    description: 'Trusted by leading enterprises and private customers across industrial, cellular, and commercial sectors.',
  },
];

export const LegacySection = () => {
  return (
    <section id="legacy-section" className="py-24 bg-background-secondary relative overflow-hidden">
      {/* Background accent */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-primary/5 to-transparent" />
      
      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="space-y-6"
          >
            <div className="flex items-center gap-3">
              <div className="line-accent" />
              <span className="text-primary font-semibold tracking-wider text-sm uppercase">
                Our Legacy
              </span>
            </div>
            
            <h2 className="text-4xl md:text-5xl font-bold text-foreground leading-tight">
              Engineering Excellence
              <br />
              <span className="text-primary">Since 1957</span>
            </h2>
            
            <p className="text-foreground-muted text-lg leading-relaxed max-w-lg">
              For over 60 years, Western Consolidated Private Limited has lived by one belief: the consumer is king. 
              This commitment has driven us to become a leading authorized GOEM of Kirloskar Oil Engines Limited, 
              delivering precision-engineered diesel generator sets across India.
            </p>
            
            <p className="text-foreground-muted leading-relaxed max-w-lg">
              We chose the harder path: being solution-savvy, not just problem-aware. 
              Backed by world-class infrastructure, advanced technology, and round-the-clock customer care, we ensure your operations 
              never stop. Because for us, excellence isn't just about products; it's about service, values, and the relationships we build.
            </p>

            <Link to="/about">
              <Button variant="heroOutline" size="lg" className="group mt-8">
                Learn More About Us
                <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </motion.div>

          {/* Right - Features Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="card-industrial p-6 rounded-lg group"
              >
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  {feature.title}
                </h3>
                <p className="text-foreground-muted text-sm leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
