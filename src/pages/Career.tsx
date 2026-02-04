import { motion } from 'framer-motion';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { FloatingButtons } from '@/components/layout/FloatingButtons';
import { Button } from '@/components/ui/button';
import { MapPin, Briefcase, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

const openings = [
  {
    title: 'Service Engineer',
    location: 'Pune, Maharashtra',
    type: 'Full-time',
    department: 'Service',
  },
  {
    title: 'Sales Executive',
    location: 'Mumbai, Maharashtra',
    type: 'Full-time',
    department: 'Sales',
  },
  {
    title: 'Technical Support',
    location: 'Bangalore, Karnataka',
    type: 'Full-time',
    department: 'Support',
  },
];

const Career = () => {
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
                Careers
              </span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6">
              Join Our
              <br />
              <span className="text-primary">Team</span>
            </h1>
            <p className="text-foreground-muted text-lg leading-relaxed">
              Build your career with a company that's powering India's industrial growth. 
              We're looking for passionate individuals to join our team.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Why Join Us */}
      <section className="py-20 bg-background-secondary">
        <div className="container mx-auto px-4 lg:px-8">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl font-bold text-foreground mb-12 text-center"
          >
            Why Join <span className="text-primary">WCPL?</span>
          </motion.h2>
          
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { title: 'Growth Opportunities', description: 'Continuous learning and career advancement paths.' },
              { title: 'Industry Leaders', description: 'Work with cutting-edge technology and industry experts.' },
              { title: 'Work-Life Balance', description: 'Supportive environment that values your well-being.' },
            ].map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="card-industrial p-8 rounded-lg text-center"
              >
                <h3 className="text-xl font-semibold text-foreground mb-3">{item.title}</h3>
                <p className="text-foreground-muted">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Current Openings */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 lg:px-8">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl font-bold text-foreground mb-12 text-center"
          >
            Current <span className="text-primary">Openings</span>
          </motion.h2>
          
          <div className="space-y-4 max-w-3xl mx-auto">
            {openings.map((job, index) => (
              <motion.div
                key={job.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="card-industrial p-6 rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">{job.title}</h3>
                  <div className="flex flex-wrap gap-4 text-sm text-foreground-muted">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {job.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {job.type}
                    </span>
                    <span className="flex items-center gap-1">
                      <Briefcase className="w-4 h-4" />
                      {job.department}
                    </span>
                  </div>
                </div>
                <Link to="/enquiry">
                  <Button variant="outline" size="sm">
                    Apply Now
                  </Button>
                </Link>
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

export default Career;
