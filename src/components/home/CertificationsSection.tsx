import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';

// Certificate images
import iso14001Img from '@/assets/certificates/iso14001.jpg';
import iso45001Img from '@/assets/certificates/iso45001.jpg';
import iso9001Img from '@/assets/certificates/iso9001.jpg';

const certifications = [
  {
    id: 'iso-14001',
    title: 'ISO 14001:2015',
    description: 'Environmental Management System',
    image: iso14001Img,
  },
  {
    id: 'iso-45001',
    title: 'ISO 45001:2018',
    description: 'Occupational Health & Safety Management System',
    image: iso45001Img,
  },
  {
    id: 'iso-9001',
    title: 'ISO 9001:2015',
    description: 'Quality Management System',
    image: iso9001Img,
  },
];

export const CertificationsSection = () => {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="line-accent" />
            <span className="text-primary font-semibold tracking-wider text-sm uppercase">
              Quality Assurance
            </span>
            <div className="line-accent" />
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Awards & <span className="text-primary">Certifications</span>
          </h2>
          <p className="text-foreground-muted text-lg max-w-3xl mx-auto leading-relaxed">
            We are an ISO 14001:2015, ISO 45001:2018, ISO 9001:2015 certified and TUV NORD accredited company.
          </p>
        </motion.div>

        {/* Certification Cards */}
        <div className="grid md:grid-cols-3 gap-8">
          {certifications.map((cert, index) => (
            <motion.div
              key={cert.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Link to={`/certifications/${cert.id}`} className="block group">
                <div className="card-industrial rounded-lg overflow-hidden">
                  {/* Certificate Image */}
                  <div className="aspect-[3/4] overflow-hidden bg-white">
                    <img
                      src={cert.image}
                      alt={`${cert.title} Certificate`}
                      className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  
                  {/* Card Content */}
                  <div className="p-6 text-center">
                    <h3 className="text-xl font-bold text-foreground mb-2">
                      {cert.title}
                    </h3>
                    <p className="text-foreground-muted text-sm mb-4">
                      {cert.description}
                    </p>
                    <Button variant="outline" size="sm" className="group/btn">
                      View Certificate
                      <ExternalLink size={14} className="ml-2 group-hover/btn:translate-x-0.5 transition-transform" />
                    </Button>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* TUV NORD Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-12 text-center"
        >
          <div className="inline-flex items-center gap-4 px-6 py-4 bg-card border border-border rounded-lg">
            <div className="w-12 h-12 bg-secondary rounded-lg flex items-center justify-center">
              <span className="text-secondary-foreground font-bold text-sm">TUV</span>
            </div>
            <div className="text-left">
              <div className="text-foreground font-semibold">TUV NORD Accredited</div>
              <div className="text-foreground-muted text-sm">International Quality Certification</div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
