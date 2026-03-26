import { motion } from 'framer-motion';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { FloatingButtons } from '@/components/layout/FloatingButtons';
import { 
  Factory, 
  FlaskConical, 
  Stethoscope, 
  Hotel, 
  Building2, 
  Briefcase, 
  Home, 
  ShieldCheck 
} from 'lucide-react';

const clientSectors = [
  { 
    title: 'Manufacturing', 
    description: 'Auto & Ancillaries, FMCG, and Heavy Engineering.',
    icon: <Factory className="w-6 h-6" />
  },
  { 
    title: 'Process Industry', 
    description: 'Pharma, Biotech, Chemical, Cement, and Steel.',
    icon: <FlaskConical className="w-6 h-6" />
  },
  { 
    title: 'Healthcare', 
    description: 'Hospitals, Clinics, and Diagnostic Centers.',
    icon: <Stethoscope className="w-6 h-6" />
  },
  { 
    title: 'Hospitality', 
    description: 'Hotels, Restaurants, and Quick Service Outlets.',
    icon: <Hotel className="w-6 h-6" />
  },
  { 
    title: 'Infrastructure', 
    description: 'Construction, Petrol Stations, and Smart Cities.',
    icon: <Building2 className="w-6 h-6" />
  },
  { 
    title: 'Services & IT', 
    description: 'Banking, BFSI, IT/ITES, and Telecom Hubs.',
    icon: <Briefcase className="w-6 h-6" />
  },
  { 
    title: 'Real Estate', 
    description: 'Residential Complexes and Commercial Workspaces.',
    icon: <Home className="w-6 h-6" />
  },
  { 
    title: 'Government', 
    description: 'Defence Establishments and Railway Infrastructure.',
    icon: <ShieldCheck className="w-6 h-6" />
  },
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
      
      {/* Hero Section */}
      <section className="pt-32 pb-20 bg-background relative overflow-hidden">
        {/* Desktop Background */}
        <div className="absolute top-0 right-0 bottom-0 w-[70%] z-0 hidden md:block">
          <div 
            className="absolute inset-0 z-0 opacity-100 dark:opacity-100"
            style={{
              backgroundImage: 'url("/images/client-bg.jpeg")',
              backgroundSize: 'cover',
              backgroundPosition: 'center left',
              maskImage: 'linear-gradient(to right, transparent, black 40%)',
              WebkitMaskImage: 'linear-gradient(to right, transparent, black 40%)'
            }}
          />
          {/* Max Brightness Reduction: Solid overlays */}
          <div className="absolute inset-0 bg-white/5 dark:bg-black/60 z-10" />
        </div>

        {/* Mobile background: Very Dim */}
        <div className="absolute inset-0 z-0 md:hidden opacity-10">
           <div 
            className="absolute inset-0 brightness-[0.4]"
            style={{
              backgroundImage: 'url("/images/client-bg.jpeg")',
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
            {/* Added drop-shadow for legibility and backdrop-blur for desktop contrast */}
            <p className="text-foreground-muted text-lg leading-relaxed font-medium dark:font-normal drop-shadow-sm md:bg-background/5 p-1 -ml-1 rounded-sm">
              Over 100,000 installations across India, powering <br></br>enterprises 
              in manufacturing, healthcare,<br></br> infrastructure, and more.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Sectors Section */}
      <section className="py-20 bg-background-secondary">
        <div className="container mx-auto px-4 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Industries We <span className="text-primary">Serve</span>
            </h2>
            <p className="text-foreground-muted max-w-2xl mx-auto">
              Delivering specialized solutions tailored to the unique operational demands of diverse sectors.
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {clientSectors.map((sector, index) => (
              <motion.div
                key={sector.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                className="card-industrial p-8 rounded-xl bg-background border border-border/50 hover:border-primary/50 transition-colors group flex flex-col h-full"
              >
                <div className="w-12 h-12 rounded-lg bg-primary/10 text-primary flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  {sector.icon}
                </div>
                <h3 className="text-xl font-bold text-foreground mb-3">{sector.title}</h3>
                <p className="text-foreground-muted text-sm leading-relaxed">
                  {sector.description}
                </p>
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
            Our <span className="text-primary">Top Clients</span>
          </motion.h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {clientLogos.map((client, index) => (
              <motion.div
                key={`${client.name}-${index}`}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.03 }}
                className="card-industrial p-6 rounded-lg flex flex-col items-center justify-center text-center group hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
              >
                <div className="w-20 h-20 flex items-center justify-center mb-3 transition-transform duration-500 group-hover:scale-110">
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