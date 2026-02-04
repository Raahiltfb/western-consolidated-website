import { motion } from 'framer-motion';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { FloatingButtons } from '@/components/layout/FloatingButtons';
import { Award, Users, Clock, Target, CheckCircle } from 'lucide-react';

const milestones = [
  { year: '1960s', title: 'Foundation', description: 'WCPL established as a power solutions provider.' },
  { year: '1980s', title: 'KOEL Partnership', description: 'Became authorized GOEM of Kirloskar Oil Engines.' },
  { year: '2000s', title: 'Expansion', description: 'Extended operations across India.' },
  { year: '2020s', title: 'Innovation', description: 'Launched hybrid and eco-friendly solutions.' },
];

const values = [
  { icon: Award, title: 'Excellence', description: 'Commitment to highest quality standards.' },
  { icon: Users, title: 'Customer First', description: 'Building lasting relationships.' },
  { icon: Clock, title: 'Reliability', description: 'Dependable service, every time.' },
  { icon: Target, title: 'Innovation', description: 'Continuous improvement and advancement.' },
];

const About = () => {
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
                About Us
              </span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6">
              Powering India's
              <br />
              <span className="text-primary">Industrial Growth</span>
            </h1>
            <p className="text-foreground-muted text-lg leading-relaxed">
              For over six decades, Western Consolidated Private Limited has been 
              at the forefront of industrial power solutions, delivering reliable 
              generator sets that power India's industrial backbone.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-20 bg-background-secondary">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="space-y-6"
            >
              <h2 className="text-4xl font-bold text-foreground">
                Our <span className="text-primary">Story</span>
              </h2>
              <p className="text-foreground-muted leading-relaxed">
                Established in the 1960s, WCPL began its journey with a vision to provide 
                reliable power solutions to India's growing industrial sector. What started 
                as a small enterprise has grown into one of the most trusted names in the 
                power generation industry.
              </p>
              <p className="text-foreground-muted leading-relaxed">
                As an authorized GOEM (Generator OEM) of Kirloskar Oil Engines Limited (KOEL), 
                we bring together cutting-edge technology with decades of engineering expertise 
                to deliver power solutions that exceed expectations.
              </p>
              <ul className="space-y-3">
                {['60+ Years of Experience', 'KOEL Authorized Partner', '5000+ Installations', 'Pan-India Service Network'].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-foreground">
                    <CheckCircle className="w-5 h-5 text-primary" />
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="aspect-square bg-card border border-border rounded-lg flex items-center justify-center"
            >
              <div className="text-center p-8">
                <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
                  <svg className="w-10 h-10 text-foreground-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <p className="text-foreground-muted">Company Image</p>
                <p className="text-muted-foreground text-sm">Placeholder</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-foreground mb-4">
              Our <span className="text-primary">Journey</span>
            </h2>
          </motion.div>
          
          <div className="grid md:grid-cols-4 gap-6">
            {milestones.map((milestone, index) => (
              <motion.div
                key={milestone.year}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="card-industrial p-6 rounded-lg text-center"
              >
                <div className="text-3xl font-bold text-primary mb-2">{milestone.year}</div>
                <h3 className="text-lg font-semibold text-foreground mb-2">{milestone.title}</h3>
                <p className="text-foreground-muted text-sm">{milestone.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-background-secondary">
        <div className="container mx-auto px-4 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-foreground mb-4">
              Our <span className="text-primary">Values</span>
            </h2>
          </motion.div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="card-industrial p-6 rounded-lg text-center"
              >
                <div className="w-14 h-14 mx-auto rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <value.icon className="w-7 h-7 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">{value.title}</h3>
                <p className="text-foreground-muted text-sm">{value.description}</p>
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

export default About;
