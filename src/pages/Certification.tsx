import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { FloatingButtons } from '@/components/layout/FloatingButtons';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

// Certificate images
import iso14001Img from '@/assets/certificates/iso14001.jpg';
import iso45001Img from '@/assets/certificates/iso45001.jpg';
import iso9001Img from '@/assets/certificates/iso9001.jpg';

const certificationData: Record<string, { 
  title: string; 
  fullTitle: string; 
  description: string;
  image: string;
  regNo: string;
}> = {
  'iso-14001': {
    title: 'ISO 14001:2015',
    fullTitle: 'Quality Management System',
    description: '',
    image: iso14001Img,
    regNo: 'EM 04 00015',
  },
  'iso-45001': {
    title: 'ISO 45001:2018',
    fullTitle: 'Health & Safety Management System',
    description: '',
    image: iso45001Img,
    regNo: 'OHS 04 00002',
  },
  'iso-9001': {
    title: 'ISO 9001:2015',
    fullTitle: 'Environment Management System',
    description: '',
    image: iso9001Img,
    regNo: 'QM 04 00510',
  },
};

const Certification = () => {
  const { certId } = useParams<{ certId: string }>();
  const cert = certId ? certificationData[certId] : null;

  if (!cert) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar isVisible={true} />
        <div className="pt-32 pb-20 container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold text-foreground mb-4">Certification Not Found</h1>
          <Link to="/">
            <Button variant="hero">Return Home</Button>
          </Link>
        </div>
        <Footer />
        <FloatingButtons />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar isVisible={true} />
      
      {/* Hero */}
      <section className="pt-32 pb-12 bg-background">
        <div className="container mx-auto px-4 lg:px-8">
          <Link to="/#certifications" className="inline-flex items-center gap-2 text-foreground-muted hover:text-primary transition-colors mb-8">
            <ArrowLeft size={18} />
            Back to Certifications
          </Link>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="line-accent" />
              <span className="text-primary font-semibold tracking-wider text-sm uppercase">
                Certification
              </span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-4">
              {cert.title}
            </h1>
            <h2 className="text-2xl text-primary font-medium mb-6">
              {cert.fullTitle}
            </h2>
            <p className="text-foreground-muted text-lg leading-relaxed">
              {cert.description}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Certificate Display */}
      <section className="py-12 bg-background-secondary">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Certificate Image */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-white rounded-lg overflow-hidden shadow-lg"
            >
              <img
                src={cert.image}
                alt={`${cert.title} Certificate`}
                className="w-full h-auto object-contain"
              />
            </motion.div>

            {/* Certificate Details */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="space-y-8"
            >
              <div className="card-industrial p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-foreground mb-4">Certification Details</h3>
                <div className="space-y-4">
                  <div className="flex justify-between border-b border-border pb-3">
                    <span className="text-foreground-muted">Standard</span>
                    <span className="text-foreground font-medium">{cert.title}</span>
                  </div>
                  <div className="flex justify-between border-b border-border pb-3">
                    <span className="text-foreground-muted">Registration No.</span>
                    <span className="text-foreground font-medium">{cert.regNo}</span>
                  </div>
                  <div className="flex justify-between border-b border-border pb-3">
                    <span className="text-foreground-muted">Accreditation Body</span>
                    <span className="text-foreground font-medium">TUV INDIA PVT. LTD.</span>
                  </div>
                  <div className="flex justify-between border-b border-border pb-3">
                    <span className="text-foreground-muted">Status</span>
                    <span className="text-primary font-medium">Active</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-foreground-muted">Scope</span>
                    <span className="text-foreground font-medium text-right max-w-[200px]">Manufacture of Silent DG Sets and its Acoustic Enclosures & Control Panels</span>
                  </div>
                </div>
              </div>

              {/* Download Button Removed from here */}

              <div className="text-center lg:text-left">
                <Link to="/enquiry">
                  <Button variant="hero" size="lg" className="w-full">
                    Request More Information
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <Footer />
      <FloatingButtons />
    </div>
  );
};

export default Certification;
