import { motion } from 'framer-motion';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { FloatingButtons } from '@/components/layout/FloatingButtons';
import { Button } from '@/components/ui/button';
import { Mail, Users, Coffee, Rocket, ShieldCheck, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';

const Career = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar isVisible={true} />
      
      {/* Hero Section - Standardized to match Clients Page */}
      <section className="pt-32 pb-20 bg-background relative overflow-hidden">
        {/* Desktop Background */}
        <div className="absolute top-0 right-0 bottom-0 w-[70%] z-0 hidden md:block">
          <div 
            className="absolute inset-0 z-0 transition-opacity duration-500"
            style={{
              backgroundImage: 'url("/images/career-bg.jpg")',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              maskImage: 'linear-gradient(to right, transparent, black 40%)',
              WebkitMaskImage: 'linear-gradient(to right, transparent, black 40%)'
            }}
          />
          {/* Your Preferred Overlay Settings */}
          <div className="absolute inset-0 bg-white/10 dark:bg-black/40 z-10" />
        </div>

        {/* Mobile background */}
        <div className="absolute inset-0 z-0 md:hidden opacity-10">
           <div 
            className="absolute inset-0 brightness-[0.4]"
            style={{
              backgroundImage: 'url("/images/career-bg.jpg")',
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
                Careers
              </span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6">
              Join Our
              <br />
              <span className="text-primary">Team</span>
            </h1>
            
            {/* Standardized Hero Paragraph font-size and styling */}
            <p className="text-foreground-muted text-lg leading-relaxed font-medium dark:font-normal drop-shadow-sm md:bg-background/5 p-1 -ml-1 rounded-sm max-w-2xl">
              Join a 60-year legacy of engineering excellence. <br className="hidden md:block" />
              Build the future of Indian energy.
            </p>

            <div className="mt-8 flex gap-4">
               <Button variant="hero" size="lg" onClick={() => document.getElementById('apply')?.scrollIntoView({ behavior: 'smooth' })}>
                View Openings
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Core Pillars Section */}
      <section className="py-20 bg-background-secondary border-y border-primary/5">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground">
                Why Your Career <span className="text-primary">Starts Here</span>
              </h2>
              <div className="grid gap-6">
                {[
                  { icon: ShieldCheck, title: "Stability & Legacy", desc: "60+ years in the industry provides a foundation you can trust for long-term growth." },
                  { icon: Zap, title: "Cutting Edge Tech", desc: "Work with KOEL technology and sustainable power solutions of tomorrow." },
                  { icon: Rocket, title: "Impactful Work", desc: "Every project you touch keeps a factory running or a hospital powered." }
                ].map((pillar, i) => (
                  <motion.div 
                    key={i}
                    whileHover={{ x: 10 }}
                    className="flex gap-4 p-4 rounded-xl hover:bg-background transition-colors border border-transparent hover:border-primary/10"
                  >
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <pillar.icon className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-foreground">{pillar.title}</h4>
                      <p className="text-foreground-muted text-sm">{pillar.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="aspect-rectangle rounded-2xl overflow-hidden border border-primary/20 shadow-2xl">
                <img 
                  src="/images/work.jpg" 
                  alt="Life at WCPL"
                  className="w-full h-full object-contain transition-transform duration-500 scale-100"
                />
              </div>
              <div className="absolute -bottom-6 -left-6 bg-primary p-6 rounded-xl shadow-xl hidden md:block">
                <p className="text-primary-foreground font-bold text-2xl">60+ Years</p>
                <p className="text-primary-foreground/80 text-sm italic">of empowerment</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* The "Coffee" Culture Block */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="/images/work2.jpg" 
            className="w-full h-full object-cover opacity-20 grayscale"
            alt="Background"
          />
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            className="max-w-4xl mx-auto bg-card/60 backdrop-blur-xl border border-primary/20 p-8 md:p-16 rounded-[2rem] text-center shadow-2xl"
          >
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-8 border border-primary/20">
              <Coffee className="w-10 h-10 text-primary animate-pulse" />
            </div>
            <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-6">
            A 60-Year Legacy. <span className="text-primary">Your Next Chapter.</span>
            </h2>
            <p className="text-xl text-foreground-muted leading-relaxed mb-10 italic">
              If you believe you can add to our strength and bring a unique skill set to Western Consolidated, 
              we'd love to meet you over a cup of coffee.
            </p>
            <div className="h-px w-24 bg-primary/30 mx-auto mb-10" />
            <p className="text-foreground-muted max-w-xl mx-auto mb-0">
              We value human connection over automated filters. Every great journey at WCPL starts with a simple conversation.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Write to Us / CTA */}
      <section id="apply" className="py-20 bg-background-secondary">
        <div className="container mx-auto px-4 lg:px-8 text-center">
          <div className="max-w-3xl mx-auto space-y-8">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
              Shape the <span className="text-primary">Legacy</span>
            </h2>
            <p className="text-foreground-muted text-lg">
              We are always looking for visionaries, pioneers, and innovators. 
              Send us your resume and we'll be in touch!
            </p>
            
            <div className="grid gap-4 py-8">
              <div className="card-industrial p-6 flex flex-col items-center gap-2 group hover:border-primary/40">
                <Mail className="w-8 h-8 text-primary group-hover:scale-110 transition-transform" />
                <span className="text-xs uppercase tracking-widest text-foreground-muted">Send Us Your Resume</span>
                <a href="mailto:response@westernconsolidated.com" className="text-xl md:text-2xl font-bold text-foreground hover:text-primary transition-colors">
                  response@westernconsolidated.com
                </a>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="mailto:response@westernconsolidated.com">
                <Button variant="hero" size="lg" className="px-12">
                  Submit Resume
                </Button>
              </a>
              <Link to="/contact">
                <Button variant="heroOutline" size="lg" className="px-12 border-primary/20 hover:bg-primary/5">
                  General Inquiry
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
      <FloatingButtons />
    </div>
  );
};

export default Career;