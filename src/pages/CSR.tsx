import { motion } from 'framer-motion';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { FloatingButtons } from '@/components/layout/FloatingButtons';
import { Heart, Leaf, GraduationCap, Users, User, FileText, Calendar } from 'lucide-react';

const initiatives = [
  {
    icon: GraduationCap,
    title: 'Education Support',
    description: 'Supporting education initiatives in underprivileged communities through scholarships and infrastructure development.',
  },
  {
    icon: Heart,
    title: 'Healthcare Access',
    description: 'Providing reliable power solutions to rural healthcare centers and supporting medical equipment donations.',
  },
  {
    icon: Leaf,
    title: 'Environmental Sustainability',
    description: 'Committed to reducing carbon footprint through hybrid power solutions and sustainable manufacturing practices.',
  },
  {
    icon: Users,
    title: 'Community Development',
    description: 'Investing in local communities through skill development programs and employment opportunities.',
  },
];

const csrCommittee = [
  {
    name: 'Mr. Rajesh Kumar',
    designation: 'Chairman, CSR Committee',
  },
  {
    name: 'Mrs. Priya Sharma',
    designation: 'Independent Director',
  },
  {
    name: 'Mr. Anil Mehta',
    designation: 'Managing Director',
  },
];

const csrPolicySections = [
  {
    title: 'Objective',
    description: 'To operate in an economically, socially and environmentally sustainable manner, while recognizing the interests of all stakeholders.',
  },
  {
    title: 'Scope',
    description: 'CSR activities as specified in Schedule VII of the Companies Act, 2013 focusing on education, healthcare, environment, and community development.',
  },
  {
    title: 'Implementation',
    description: 'Activities implemented directly or through registered trusts, societies, or Section 8 companies with established track records.',
  },
  {
    title: 'Monitoring',
    description: 'Regular monitoring and evaluation of CSR projects through the CSR Committee with quarterly reviews and annual assessments.',
  },
  {
    title: 'Budget',
    description: 'Allocation of at least 2% of average net profits as per regulatory requirements with provisions for multi-year projects.',
  },
  {
    title: 'Reporting',
    description: 'Annual CSR report to be included in the Board\'s Report with details of implementation and impact assessment.',
  },
  {
    title: 'Transparency',
    description: 'Public disclosure of CSR policy, activities, and expenditure through annual reports and company website.',
  },
];

const csrProgrammes = [
  {
    title: 'Education & Skill Development Initiative',
    description: 'Supporting educational infrastructure and vocational training programs in underprivileged communities to enhance employability and create sustainable livelihoods.',
  },
  {
    title: 'Healthcare Access Programme',
    description: 'Providing healthcare facilities, medical camps, and health awareness programs in rural areas with focus on preventive healthcare and nutrition.',
  },
  {
    title: 'Environmental Sustainability Project',
    description: 'Tree plantation drives, waste management initiatives, and promotion of renewable energy solutions to reduce environmental footprint.',
  },
  {
    title: 'Rural Development Scheme',
    description: 'Infrastructure development in rural areas including roads, water supply systems, and community centers for holistic village development.',
  },
  {
    title: 'Women Empowerment Programme',
    description: 'Skills training, entrepreneurship development, and self-help group formation to promote economic independence among women.',
  },
];

const CSR = () => {
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
                CSR
              </span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6">
              Corporate Social
              <br />
              <span className="text-primary">Responsibility</span>
            </h1>
            <p className="text-foreground-muted text-lg leading-relaxed">
              At WCPL, we believe in giving back to society. Our CSR initiatives 
              focus on education, healthcare, environment, and community development.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Initiatives */}
      <section className="py-20 bg-background-secondary">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8">
            {initiatives.map((initiative, index) => (
              <motion.div
                key={initiative.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="card-industrial p-8 rounded-lg"
              >
                <div className="w-14 h-14 rounded-lg bg-primary/10 flex items-center justify-center mb-6">
                  <initiative.icon className="w-7 h-7 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-3">
                  {initiative.title}
                </h3>
                <p className="text-foreground-muted leading-relaxed">
                  {initiative.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CSR Committee */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-foreground mb-4">
              CSR <span className="text-primary">Committee</span>
            </h2>
          </motion.div>
          
          <div className="grid md:grid-cols-3 gap-6">
            {csrCommittee.map((member, index) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="card-industrial p-6 rounded-lg text-center"
              >
                <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                  <User className="w-10 h-10 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-1">
                  {member.name}
                </h3>
                <p className="text-foreground-muted text-sm">
                  {member.designation}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CSR Policy */}
      <section className="py-20 bg-background-secondary">
        <div className="container mx-auto px-4 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-foreground mb-4">
              CSR <span className="text-primary">Policy</span>
            </h2>
          </motion.div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {csrPolicySections.map((section, index) => (
              <motion.div
                key={section.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.05 }}
                className="card-industrial p-6 rounded-lg"
              >
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <FileText className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">
                      {section.title}
                    </h3>
                    <p className="text-foreground-muted text-sm leading-relaxed">
                      {section.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Amendments */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="card-industrial p-6 rounded-lg"
          >
            <h3 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-3">
              <FileText className="w-5 h-5 text-primary" />
              Amendments
            </h3>
            <p className="text-foreground-muted leading-relaxed">
              The CSR Policy shall be reviewed and amended as required to ensure alignment with regulatory changes 
              and evolving business priorities. All amendments shall be approved by the Board of Directors upon 
              recommendation of the CSR Committee.
            </p>
          </motion.div>
        </div>
      </section>

      {/* CSR Programmes */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-2 text-primary mb-4">
              <Calendar className="w-5 h-5" />
              <span className="text-sm font-semibold uppercase tracking-wider">Financial Year 2023-24</span>
            </div>
            <h2 className="text-3xl font-bold text-foreground">
              CSR Programmes Approved by the
              <br />
              <span className="text-primary">Board of Directors</span>
            </h2>
          </motion.div>
          
          <div className="space-y-6">
            {csrProgrammes.map((programme, index) => (
              <motion.div
                key={programme.title}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="card-industrial p-6 rounded-lg"
              >
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center flex-shrink-0 text-primary-foreground font-bold">
                    {index + 1}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">
                      {programme.title}
                    </h3>
                    <p className="text-foreground-muted leading-relaxed">
                      {programme.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Image Gallery Placeholder */}
      <section className="py-20 bg-background-secondary">
        <div className="container mx-auto px-4 lg:px-8">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl font-bold text-foreground mb-12 text-center"
          >
            Our <span className="text-primary">Impact</span>
          </motion.h2>
          
          <div className="grid md:grid-cols-3 gap-6">
            {[1, 2, 3].map((_, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="aspect-video bg-card border border-border rounded-lg flex items-center justify-center"
              >
                <div className="text-center">
                  <div className="w-12 h-12 mx-auto mb-2 rounded-full bg-muted flex items-center justify-center">
                    <svg className="w-6 h-6 text-foreground-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <p className="text-foreground-muted text-sm">CSR Activity Image</p>
                </div>
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

export default CSR;
