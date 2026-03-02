import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const clientLogos = [
  { name: 'Adyaraj', logo: '/images/clients/adyaraj.png', sector: 'Infrastructure' },
  { name: 'CSN Developers', logo: '/images/clients/csn.png', sector: 'Real Estate' },
  { name: 'Kamladityya Construction', logo: '/images/clients/kamladityya.png', sector: 'Construction' },
  { name: 'Laiba Developers', logo: '/images/clients/laiba.png', sector: 'Construction' },
  { name: 'Ram Kripal', logo: '/images/clients/ramkripal.png', sector: 'Infrastructure' },
  { name: 'Shanti Construction', logo: '/images/clients/shanti.png', sector: 'Construction' },
  { name: 'Adyaraj', logo: '/images/clients/adyaraj.png', sector: 'Infrastructure' },
  { name: 'CSN Developers', logo: '/images/clients/csn.png', sector: 'Real Estate' },
];

export const ClientsSection = () => {
  return (
    <section className="py-24 bg-background relative">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="line-accent" />
            <span className="text-primary font-semibold tracking-wider text-sm uppercase">
              Trusted By
            </span>
            <div className="line-accent" />
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Our <span className="text-primary">Clients</span>
          </h2>
          
          <p className="text-foreground-muted text-lg">
            Powering India's leading enterprises across diverse industries.
          </p>
        </motion.div>

        {/* Client Logos Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {clientLogos.map((client, index) => (
            <motion.div
              key={`${client.name}-${index}`}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              className="card-industrial p-8 rounded-lg flex flex-col items-center justify-center text-center group"
            >
              <div className="w-24 h-24 flex items-center justify-center mb-4 grayscale group-hover:grayscale-0 opacity-70 group-hover:opacity-100 transition-all duration-500">
                <img
                  src={client.logo}
                  alt={client.name}
                  className="max-w-full max-h-full object-contain"
                  loading="lazy"
                />
              </div>
              <span className="text-foreground text-sm font-medium">
                {client.name}
              </span>
              <span className="text-foreground-muted text-xs mt-1">
                {client.sector}
              </span>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <Link to="/clients">
            <Button variant="heroOutline" size="lg" className="group">
              View All Clients
              <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};
