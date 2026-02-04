import { motion } from 'framer-motion';

const clients = [
  { name: 'Client 1', sector: 'Manufacturing' },
  { name: 'Client 2', sector: 'Healthcare' },
  { name: 'Client 3', sector: 'Infrastructure' },
  { name: 'Client 4', sector: 'IT Services' },
  { name: 'Client 5', sector: 'Energy' },
  { name: 'Client 6', sector: 'Logistics' },
  { name: 'Client 7', sector: 'Retail' },
  { name: 'Client 8', sector: 'Hospitality' },
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
          {clients.map((client, index) => (
            <motion.div
              key={client.name}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              className="card-industrial p-8 rounded-lg flex flex-col items-center justify-center text-center group"
            >
              {/* Logo placeholder */}
              <div className="w-16 h-16 rounded-lg bg-muted flex items-center justify-center mb-4 group-hover:bg-muted/80 transition-colors">
                <span className="text-2xl font-bold text-foreground-muted">
                  {client.name.charAt(0)}
                </span>
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
      </div>
    </section>
  );
};
