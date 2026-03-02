import { motion } from 'framer-motion';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { FloatingButtons } from '@/components/layout/FloatingButtons';

const clientSectors = [
  { name: 'Auto & Ancillaries, FMCG.', count: 'Manufacturing' },
  { name: 'Pharma & Biotech, Textile, Chemical, Cement, Steel ', count: 'Process' },
  { name: 'Hospitals & Clinics', count: 'Healthcare' },
  { name: 'Hotels & Restaurants', count: 'Hospitality' },
  { name: 'Infrastructure & Construction, Petrol Stations', count: 'Infrastructure' },
  { name: 'Education, Banks/BFSI, IT/ITES, Telecom', count: 'Services' },
  { name: 'Residential & Commercial', count: 'Real Estate' },
  { name: 'Defence & Railways', count: 'Government' },
];

const clientLogos = [
  { name: 'Adyaraj Developers', logo: '/images/clients/adyaraj.png', sector: 'Infrastructure' },
  { name: 'Larsen & Toubro', logo: '/images/clients/lt.png', sector: 'Engineering' },
  { name: 'Topsel Toyota', logo: '/images/clients/topsel.png', sector: 'Automotive' },
  { name: 'Philips', logo: '/images/clients/philips.png', sector: 'Electronics' },
  { name: 'Ram Kripal Singh Construction', logo: '/images/clients/ramkripal.png', sector: 'Infrastructure' },
  { name: 'Shanti Construction', logo: '/images/clients/shanti.png', sector: 'Construction' },
  { name: 'Linde', logo: '/images/clients/linde.png', sector: 'Gases' },
  { name: 'DHL', logo: '/images/clients/dhl.png', sector: 'Logistics' },
  { name: 'Siemens', logo: '/images/clients/siemens.png', sector: 'Technology' },
  { name: 'SREI Infrastructure', logo: '/images/clients/srei.png', sector: 'Infrastructure' },
  { name: 'Apeejay Surrendra', logo: '/images/clients/apeejay.png', sector: 'Hospitality' },
  { name: 'Simplex Infrastructures', logo: '/images/clients/simplex.png', sector: 'Infrastructure' },
];

const Clients = () => {
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
                Our Clients
              </span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6">
              Trusted by
              <br />
              <span className="text-primary">Industry Leaders</span>
            </h1>
            <p className="text-foreground-muted text-lg leading-relaxed">
              Over 5000 installations across India, powering enterprises 
              in manufacturing, healthcare, infrastructure, and more.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Sectors */}
      <section className="py-20 bg-background-secondary">
        <div className="container mx-auto px-4 lg:px-8">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl font-bold text-foreground mb-12 text-center"
          >
            Industries We <span className="text-primary">Serve</span>
          </motion.h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {clientSectors.map((sector, index) => (
              <motion.div
                key={sector.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                className="card-industrial p-6 rounded-lg text-center"
              >
                <div className="text-3xl font-bold text-primary mb-2">{sector.count}</div>
                <div className="text-foreground text-sm">{sector.name}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Client Logos */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 lg:px-8">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl font-bold text-foreground mb-12 text-center"
          >
            Our <span className="text-primary">Partners</span>
          </motion.h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {clientLogos.map((client, index) => (
              <motion.div
                key={`${client.name}-${index}`}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.03 }}
                className="card-industrial p-6 rounded-lg flex flex-col items-center justify-center text-center group"
              >
                <div className="w-20 h-20 flex items-center justify-center mb-3 grayscale group-hover:grayscale-0 opacity-70 group-hover:opacity-100 transition-all duration-500">
                  <img
                    src={client.logo}
                    alt={client.name}
                    className="max-w-full max-h-full object-contain"
                    loading="lazy"
                  />
                </div>
                <span className="text-foreground text-xs font-medium">{client.name}</span>
                <span className="text-foreground-muted text-xs">{client.sector}</span>
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

export default Clients;
