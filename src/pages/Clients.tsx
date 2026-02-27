import { motion } from 'framer-motion';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { FloatingButtons } from '@/components/layout/FloatingButtons';

const clientSectors = [
  { name: 'Auto & ancillaries, FMCG.', count: 'Manufacturing' },
  { name: 'Pharma & Biotech, Textile, Chemical, Cement, Steel ', count: 'Process Ind' },
  { name: 'Hospitals & Clinics', count: 'Healthcare' },
  { name: 'Hotels & Restaurants', count: 'Hospitality' },
  { name: 'Infrastructure & Construction', count: 'Infrastructure' },
  { name: 'Education, Banks/BFSI, IT/ITES, Telecom, Petrol Stations', count: 'Services' },
  { name: 'Residential & Commercial', count: 'Real Estate' },
  { name: 'Defence & Railways', count: 'Government' },
];

const clientLogos = Array.from({ length: 12 }, (_, i) => ({
  name: `Client ${i + 1}`,
  sector: clientSectors[i % clientSectors.length].name,
}));

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
                key={client.name}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.03 }}
                className="card-industrial p-6 rounded-lg flex flex-col items-center justify-center text-center"
              >
                <div className="w-12 h-12 rounded bg-muted flex items-center justify-center mb-3">
                  <span className="text-lg font-bold text-foreground-muted">
                    {client.name.charAt(0)}
                  </span>
                </div>
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
