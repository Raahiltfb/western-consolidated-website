import { motion } from 'framer-motion';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { FloatingButtons } from '@/components/layout/FloatingButtons';
import { Button } from '@/components/ui/button';
import { Mail, Users, Coffee } from 'lucide-react';
import { Link } from 'react-router-dom';

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
              People are our strength. If you believe you can add to our strength and bring a unique skill set to Western Consolidated, we'd love to meet you over a cup of coffee.
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
              { 
                icon: Users,
                title: 'People Are Our Strength', 
                description: 'Join a team where your unique skills and talents are valued and nurtured.' 
              },
              { 
                icon: Coffee,
                title: 'Collaborative Culture', 
                description: 'Work in an environment that encourages innovation, growth, and open dialogue.' 
              },
              { 
                icon: Mail,
                title: 'Career Growth', 
                description: 'Build your career with a company that has been powering India\'s industrial growth for decades.' 
              },
            ].map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="card-industrial p-8 rounded-lg text-center"
              >
                <div className="w-14 h-14 mx-auto mb-4 rounded-lg bg-primary/10 flex items-center justify-center">
                  <item.icon className="w-7 h-7 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-3">{item.title}</h3>
                <p className="text-foreground-muted">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Write to Us */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="card-industrial p-8 lg:p-12 rounded-lg text-center"
            >
              <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-primary/10 flex items-center justify-center">
                <Mail className="w-8 h-8 text-primary" />
              </div>
              
              <h2 className="text-3xl font-bold text-foreground mb-4">
                Write to <span className="text-primary">Us</span>
              </h2>
              
              <p className="text-foreground-muted text-lg leading-relaxed mb-8">
                People are our strength. If you believe you can contribute to our team and bring unique skills to the table, we'd be delighted to connect with you.
              </p>
              
              <div className="space-y-4 mb-8">
                <p className="text-foreground font-medium text-center">Email us your resume at:</p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-2">
                  <a 
                    href="mailto:response@westernconsolidated.com"
                    className="text-primary hover:underline font-medium"
                    >
                    response@westernconsolidated.com
                  </a>
    
                  <span className="text-foreground-muted hidden sm:inline mx-1">or</span>
    
                  <a 
                    href="mailto:western@cal.vsnl.net.in"
                    className="text-primary hover:underline font-medium"
                    >
                    western@cal.vsnl.net.in
                  </a>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a href="mailto:response@westernconsolidated.com">
                  <Button variant="hero" size="lg" className="w-full sm:w-auto">
                    Send Your Resume
                  </Button>
                </a>
                <Link to="/contact">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto">
                    Contact Us
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

export default Career;
