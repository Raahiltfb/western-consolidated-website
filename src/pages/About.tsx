import { motion } from 'framer-motion';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { FloatingButtons } from '@/components/layout/FloatingButtons';
import { Award, Users, Clock, CheckCircle, Eye, Compass, TrendingUp, Building } from 'lucide-react';

const milestones = [
  { year: '1960s', title: 'Foundation', description: 'WCPL established as a power solutions provider.' },
  { year: '1980s', title: 'KOEL Partnership', description: 'Became authorized GOEM of Kirloskar Oil Engines.' },
  { year: '2000s', title: 'Expansion', description: 'Extended operations across India.' },
  { year: '2020s', title: 'Innovation', description: 'Launched hybrid and eco-friendly solutions.' },
];

const values = [
  { icon: Award, title: 'Excellence', description: 'Uncompromising Focus on Quality' },
  { icon: Users, title: 'Ethics', description: 'High Ethical Standards Through Integrity and Mutual Trust' },
  { icon: Clock, title: 'Reliability', description: 'Speed and Responsiveness Through Employee Empowerment' },
];

const sections = [
  {
    id: 'vision',
    icon: Eye,
    title: 'Vision',
    content: 'To be the most admired power solutions provider with international standards, delivering sustainable value to all our customers.',
  },
  {
    id: 'mission',
    icon: Compass,
    title: 'Mission',
    content: 'Driving organizational transformation to build the conviction and capabilities needed to deliver quality products on time to our customers.',
  },
  {
    id: 'growth',
    icon: TrendingUp,
    title: 'Growth',
    content: 'Established in 1957 by Chairman Mr. K.C. Dhingra, Western Consolidated Private Limited (formerly Western India Machinery Co Pvt Ltd) has grown into one of India\'s leading providers of diesel generating sets and electrical control panels. Whether serving large corporations or small and medium enterprises, we bring the same level of dedication and excellence to every project.\n\nAs an authorized GOEM of Kirloskar Oil Engines Ltd (KOEL) - the country\'s largest independent diesel engine manufacturer with nationwide reach - WCPL delivers reliable, mission-critical power solutions. We partner with the best to serve the best: our generators feature KOEL Green alternators, recognized as industry leaders in quality and performance.',
  },
  {
    id: 'infrastructure',
    icon: Building,
    title: 'Infrastructure',
    content: 'Excellence in quality is embedded in WCPL through our advanced infrastructure and skilled workforce. Technology is our power, our people are our strength - together, they drive our commitment to quality.\n\nWCPL operates a state-of-the-art manufacturing facility in Sitarganj, Uttarakhand, capable of producing diesel generating sets from 3 kVA to 1010 kVA. Partnered with KOEL Green for sound-proof canopies, our facility has an annual production capacity of 5,000 units.\n\nOur nationwide network operates through strategically located branch offices, with robust presence across Bengal, Bihar, Jharkhand, and Sikkim, ensuring comprehensive coverage and responsive service throughout India.',
  },
];

const About = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar isVisible={true} />
      
      {/* Hero */}
      <section className="pt-32 pb-20 bg-background relative overflow-hidden">
        {/* Desktop Background */}
        <div className="absolute top-0 right-0 bottom-0 w-[70%] z-0 hidden md:block">
          <div 
            className="absolute inset-0 z-0 opacity-100 dark:opacity-100 transition-opacity duration-500"
            style={{
              backgroundImage: 'url("/images/about-bg.jpg")',
              backgroundSize: 'cover',
              backgroundPosition: 'center left',
              maskImage: 'linear-gradient(to right, transparent, black 40%)',
              WebkitMaskImage: 'linear-gradient(to right, transparent, black 40%)'
            }}
          />
          {/* Max Brightness Reduction: Solid overlays */}
          <div className="absolute inset-0 bg-white/10 dark:bg-black/40 z-10" />
        </div>

        {/* Mobile background (stays full width for small screens) */}
        <div className="absolute inset-0 z-0 md:hidden opacity-10">
           <div 
            className="absolute inset-0 brightness-[0.3]"
            style={{
              backgroundImage: 'url("/images/about-bg.jpg")',
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
                About Us
              </span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6">
              Powering India&apos;s
              <br />
              <span className="text-primary">Industrial Growth</span>
            </h1>
            {/* Added drop-shadow and backdrop-blur for maximum legibility */}
            <p className="text-foreground-muted text-lg leading-relaxed max-w-2xl font-medium dark:font-normal drop-shadow-sm md:backdrop-blur-[4px] md:bg-background/10 p-2 -ml-2 rounded-lg">
              For over six decades, Western Consolidated Private Limited has been 
              at the forefront of industrial power solutions, delivering reliable 
              generator sets that power India&apos;s industrial backbone.
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
                Established in 1957, WCPL began its journey with a vision to provide 
                reliable power solutions to India&apos;s growing industrial sector. What started 
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
              className="aspect-[4/3] bg-card border border-border rounded-lg overflow-hidden"
            >
              <img
                src="/images/about-team.jpg"
                alt="Western Consolidated team at KOEL-KGD Annual Conference"
                className="w-full h-full object-cover"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Vision, Mission, Growth, Infrastructure */}
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
              What <span className="text-primary">Drives Us</span>
            </h2>
          </motion.div>
          
          <div className="space-y-8">
            {sections.map((section, index) => (
              <motion.div
                key={section.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="card-industrial p-8 rounded-lg"
              >
                <div className="flex flex-col md:flex-row md:items-start gap-6">
                  <div className="w-14 h-14 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <section.icon className="w-7 h-7 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-foreground mb-3">
                      {section.title}
                    </h3>
                    <p className="text-foreground-muted leading-relaxed text-lg whitespace-pre-line">
                      {section.content}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
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
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
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