import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { FloatingButtons } from '@/components/layout/FloatingButtons';
import { 
  Heart, 
  GraduationCap, 
  User, 
  Calendar, 
  Droplets, 
  ChevronDown, 
  Download, 
  X,
  ArrowUpRight,
  ShieldCheck,
  Users
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const csrCommittee = [
  { name: 'Mr. Vineet Dhingra', designation: 'Chairman' },
  { name: 'Mrs. Savita Dhingra', designation: 'Member' },
  { name: 'Mr. Pranab Biswas', designation: 'Member' },
];

const csrPolicySections = [
  {
    id: 'introduction',
    title: 'I. INTRODUCTION',
    content: `Corporate Social Responsibility is strongly connected with the principles of Sustainability; an organization should make decisions not only based on financial factors, but also on the social and environmental consequences. Western Consolidated Private Limited (WCPL) is committed to doing business with integrity and respect for the surrounding in which it works. Your Company has regularly been participating financially and otherwise in social upliftment and welfare activities. Corporate Social Responsibility (CSR) has always been a part of Company's conscience and our way of working. It is our mission to contribute to the society as part of our corporate social responsibility. Being one of the most respected company of India we believe in providing ceaseless value to all our stakeholders at large.`,
  },
  {
    id: 'objective',
    title: 'II. OBJECTIVE',
    content: `Our aim is to be one of the most respected companies in India delivering superior and everlasting value to all our customers, associates, shareholders, employees and Society at large. The CSR initiatives focus on holistic development of host communities and create social, environmental and economic value to the society.\n\nThe main objective of the CSR policy is to take up programmes that benefit the communities, enhance the quality of life of the people, promote education, alleviate hunger, poverty and malnutrition, promote healthcare including preventive healthcare.`,
  },
  {
    id: 'definitions',
    title: 'III. Definitions',
    content: 'In this policy, unless the context otherwise requires:',
    definitions: [
      { term: 'A. "Act"', definition: 'means the Companies Act, 2013.' },
      { term: 'B. "Company"', definition: 'means Western Consolidated Private Limited.' },
      { term: 'C. "Committee"', definition: 'refers to Corporate Social Responsibility (CSR) Committee of the Company as referred to in Section 135 of the Act.' },
    ],
  },
  {
    id: 'activities',
    title: 'IV. CSR ACTIVITIES',
    content: `The Company's CSR activities shall primarily include one or more of the items covered under Schedule VII of the Act as detailed below:`,
    activities: [
      'Eradicating hunger, poverty and malnutrition, promoting health care including preventive health care and sanitation including contribution to the Swach Bharat Kosh set-up by the Central Government for the promotion of sanitation and making available safe drinking water;',
      'Promoting education, including special education and employment enhancing vocation skills especially among children, women, elderly and the differently abled and livelihood enhancement projects;',
      'Promoting gender equality, empowering women, setting up homes and hostels for women and orphans, setting up old age homes, day care centers and such other facilities for senior citizens and measures for reducing inequalities faced by the socially and economically backward groups;',
      'Ensuring environmental sustainability, ecological balance, protection of flora and fauna, animal welfare, agro-forestry, conservation of natural resources and maintaining quality of soil, air and water including contribution to the Clean Ganga Fund set-up by the Central Government for rejuvenation of river Ganga;',
      'Protection of national heritage, art and culture including restoration of buildings and sites of historical importance and works of art; setting up public libraries; promotion and development of traditional art and handicrafts;',
      'Measures for the benefit of armed forces veterans, war widows and their dependents Central Armed Police Forces (CAPF) and Central Para Military Forces (CPMF) veterans, and their dependents including widows;',
      'Training to promote rural sports, nationality recognized sports, Paralympics sports and Olympics sports;',
      'Contribution to the Prime Minister\'s National Relief Fund/ Prime Minister\'s Citizen Assistance and Relief in Emergency Situations Fund (PM CARES Fund) or any other fund set up by the Central Government for social-economic development and relief and welfare of the Schedule Castes, the Schedule Tribes, other backward classes, minorities and women;',
      'a. Contribution to incubators or research and development projects in the field of science, technology, engineering and medicine, funded by the Central Government or State Government or Public Sector Undertaking or any agency of the Central Government or State Government;\nb. Contributions to public funded Universities; Indian Institute of Technology (IITs); National Laboratories and autonomous bodies established under Department of Atomic Energy (DAE); Department of Biotechnology (DBT); Department of Science and Technology (DST); Department of Pharmaceuticals; Ministry of Ayurveda, Yoga and Naturopathy, Unani, Siddha and Homoeopathy (AYUSH); Ministry of Electronics and Information Technology and other bodies, namely Defense Research and Development Organisation (DRDO); Indian Council of Agricultural Research (ICAR); Indian Council of Medical Research (ICMR) and Council of Scientific and Industrial Research (CSIR), engaged in conducting research in science, technology, engineering and medicine aimed at promoting Sustainable Development Goals (SDGs);',
      'Rural development projects;',
      'Slum area development;',
      'Disaster management, including relief, rehabilitation and reconstruction activities;',
      'Such other activity as may be permitted by Scheduled VII of the Companies Act, 2013.',
    ],
  },
  {
    id: 'expenditure',
    title: 'V. CSR EXPENDITURE',
    content: `It will be the Company's endeavour to spend in every financial year, two percent of its average net profits during the three immediately preceding financial years (or such other limit as may be prescribed under the Act), on CSR Programmes in pursuance of this Policy. All expenditure towards the programs to be diligently documented.\n\nThe CSR expenditure will include all expenditure, direct and indirect, incurred by the Company on CSR Programmes undertaken in accordance with the CSR Plan.\n\nAny surplus arising out of the CSR activities will not form part of the business profit and will be either ploughed back into the same project or transferred to the Unspent CSR Account and spent in pursuance of CSR policy and annual action plan of the company or transfer such surplus amount to a Fund specified in Schedule VII, within a period of six months of the expiry of the financial year.\n\nAny income arising from CSR Programmes will be netted off from the CSR expenditure and such net amount will be reported as CSR expenditure.\n\nIf CSR expenditure in a financial year exceeds the statutory limit, such excess may be set-off against CSR expenditure for the immediate succeeding three financial years with the approval of the Board, on the recommendation of the CSR Committee.\n\nIn case at least two percent of average net profit of the last three years is not spent in a financial year, reasons for the same to be specified in the CSR report and unless the unspent amount relates to any ongoing project, the said unspent amount shall be transfer to a Fund specified in Schedule VII of the Act within a period of six months from the expiry of the financial year.`,
  },
  {
    id: 'implementation',
    title: 'VI. IMPLEMENTATION OF CSR PROGRAMMES',
    content: `WCPL will undertake its CSR activities (being projects / programs / other permitted activities) either directly or through other eligible entity / organization as approved by the CSR Committee.\n\nThe CSR Committee shall recommend to the Board for approval an Annual CSR Action Plan, delineating the CSR Programmes to be carried out during the financial year, including the budgets thereof, their manner of execution, and any other matters as the CSR Committee may deem fit from time to time.\n\nThe Board may modify the Annual CSR Action Plan as per the recommendations of the CSR Committee at any time during the financial year, based on reasonable justification.`,
  },
  {
    id: 'monitoring',
    title: 'VII. MANAGEMENT AND MONITORING MECHANISM OF CSR PROGRAMMES',
    content: `Board of Directors: The Board reviews the impact of CSR activities, provides inputs and satisfies itself that the CSR spends are aligned to the CSR Policy and has been utilized for the purposes and in the manner as approved by it. In addition, at the end of financial year, any one Director shall certify that CSR spends have been utilized for the purposes and in the manner approved by the Board.\n\nCSR Committee: CSR Committee provides guidance on CSR activities and monitors compliance with CSR Policy, commitments, and applicable CSR provisions. The composition, scope and role of CSR Committee shall be as set out in the Act read with the CSR Rules.`,
  },
];

const amendmentsContent = `In case of any subsequent changes in the provisions of the Act or any other regulations which makes any of the provisions in the Policy inconsistent with the Act or regulations, then the provisions of the Act or regulations would prevail over the Policy and the provisions in the Policy would be modified in due course to make it consistent with the law.\n\nThis Policy will be reviewed by the Board, on the recommendation of the CSR Committee, as and when deemed necessary.`;

const activityCategories = [
  {
    id: 'education',
    title: 'Education & Skill Development',
    shortDesc: 'Empowering the next generation through digital literacy and academic support.',
    icon: GraduationCap,
    partners: [
      {
        name: 'Apna Ghar Welfare Society',
        content: 'Formed with the sole purpose of serving the community, Apna Ghar focuses on underprivileged children. Through our advisor Mr. Vijay Raina, we identified academic gaps and developed "India eschool"—a customized web platform mapping classes and subjects to digital content. This initiative has diversified from its roots into successful branches in Rishikesh and Vrindavan.',
        images: ['/images/csrimage/apnaghar.jpg'],
      },
      {
        name: 'The Chirag School',
        content: 'Nestled in the beautiful Kumaon hills and established in 2006, the school provides high-quality education to village children at an affordable cost. It serves as a model for education outreach, working with government schools across four districts of Uttarakhand to improve systemic education quality.',
        images: [],
        downloadUrl: '/csrpdfs/Chirag.pdf',
        downloadLabel: 'Download CHIRAG Profile'
      },
      {
        name: 'National Association for the Blind (NAB)',
        content: 'Based in Haldwani, NAB is a specialized non-profit established in 2003 to empower children with visual impairments. It operates as a residential boarding school providing CBSE education, vocational training, and essential rehabilitation services.',
        images: [],
      },
      {
        name: 'Dayanand Primary School',
        content: 'Support and donations provided to facilitate primary education and infrastructure improvements for students.',
        images: ['/images/csrimage/dayanand.jpg'],
      }
    ]
  },
  {
    id: 'healthcare',
    title: 'Healthcare & Social Welfare',
    shortDesc: 'Promoting the well-being of vulnerable groups, from migrants to the elderly.',
    icon: Heart,
    partners: [
      {
        name: 'Disha Foundation',
        content: 'A community-centered NGO working since 2002 to create an enabling environment for migrant workers and marginal groups across India. With 150+ successful projects, they use a multi-approach of research and policy advocacy combined with on-ground implementation.',
        images: ['/images/csrimage/disha.jpg'],
        downloadUrl: '/csrpdfs/Dishapdf.pdf',
        downloadLabel: 'Download Disha Foundation Report'
      },
      {
        name: 'Parvatiya Nav Jagran Samiti',
        content: 'Located in Bageshwar district of Uttarakhand, this organization primarily works to promote social development and de-addiction within the local communities, fostering a healthier and more stable social structure.',
        images: [],
      },
      {
        name: 'My Life Foundation',
        content: 'Established by development professionals and educationists, My Life Foundation (registered under NGO Darpan, NITI Ayog) shields the vulnerable. Their multi-disciplinary teams work across education, health, and environment to change lifestyles and ensure a sustainable future for the needy.',
        images: ['/images/csrimage/mylife1.jpg', '/images/csrimage/mylife2.jpg'],
      }
    ]
  },
  {
    id: 'hunger-elderly',
    title: 'Hunger Alleviation & Elderly Care',
    shortDesc: 'Providing nutrition and emotional support to the underprivileged and homeless.',
    icon: Users,
    partners: [
      {
        name: 'Uday Foundation',
        content: 'Addressing the crisis of 18 million homeless elderly in India, Uday Foundation conducts "Sing & Dance" programmes at old age homes to provide emotional healing. Additionally, they organize monthly food and grocery distribution drives across urban and rural Mumbai, ensuring the less privileged are healthy enough to be active citizens.',
        images: [],
      }
    ]
  }
];

const PolicyAccordionItem = ({ section }: { section: any }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-border/50">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between py-5 px-6 text-left hover:bg-muted/20 transition-colors"
      >
        <h3 className="text-sm font-bold text-foreground tracking-wider uppercase">{section.title}</h3>
        <motion.div animate={{ rotate: isOpen ? 180 : 0 }}>
          <ChevronDown className="w-4 h-4 text-primary" />
        </motion.div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden bg-muted/10"
          >
            <div className="px-10 py-8">
              <div className="text-foreground-muted leading-relaxed whitespace-pre-line text-sm max-w-4xl">
                {section.content}
              </div>

              {section.definitions && (
                <div className="mt-6 space-y-3 border-l-2 border-primary/30 pl-6">
                  {section.definitions.map((def: any, idx: number) => (
                    <p key={idx} className="text-sm text-foreground-muted">
                      <span className="font-bold text-primary mr-2">{def.term}</span> {def.definition}
                    </p>
                  ))}
                </div>
              )}

              {section.activities && (
                <div className="mt-8 space-y-4">
                   <h4 className="text-[10px] font-black text-primary tracking-[0.2em] uppercase mb-4">Specified Activities</h4>
                   <ul className="space-y-3">
                    {section.activities.map((activity: string, idx: number) => (
                      <li key={idx} className="flex gap-4 text-xs text-foreground-muted leading-relaxed">
                        <span className="text-primary font-bold">{(idx + 1).toString().padStart(2, '0')}</span>
                        {activity}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const ActivityOverlay = ({ category, onClose }: { category: any; onClose: () => void }) => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8"
    >
      <div className="absolute inset-0 bg-background/95 backdrop-blur-md" onClick={onClose} />
      
      <motion.div 
        initial={{ y: 50, opacity: 0, scale: 0.95 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        exit={{ y: 50, opacity: 0, scale: 0.95 }}
        className="relative w-full max-w-6xl max-h-[90vh] bg-card border border-border shadow-2xl overflow-y-auto rounded-none"
      >
        <div className="sticky top-0 z-10 bg-card/80 backdrop-blur-md p-6 border-b border-border flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-primary/10 text-primary">
              <category.icon size={24} />
            </div>
            <h2 className="text-2xl font-bold uppercase tracking-tighter">{category.title}</h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-muted transition-colors text-foreground-muted hover:text-foreground">
            <X size={24} />
          </button>
        </div>

        <div className="p-8 lg:p-12 space-y-20">
          {category.partners.map((partner: any, idx: number) => {
            const imageCount = partner.images?.length || 0;
            const hasImages = imageCount > 0;
            
            return (
              <div key={idx} className={`grid ${hasImages ? 'lg:grid-cols-[1.2fr_1fr]' : 'grid-cols-1'} gap-12 lg:gap-20 items-center border-b border-border/30 pb-20 last:border-0`}>
                <div className={hasImages ? '' : 'max-w-4xl mx-auto text-center lg:text-left'}>
                  <div className={`flex items-center gap-3 mb-4 ${!hasImages ? 'justify-center lg:justify-start' : ''}`}>
                    <div className="w-8 h-[2px] bg-primary" />
                    <span className="text-primary font-bold text-xs uppercase tracking-widest">Partner Organisation</span>
                  </div>
                  <h3 className="text-4xl font-bold mb-6 text-foreground tracking-tight uppercase">{partner.name}</h3>
                  <p className="text-foreground-muted leading-relaxed mb-8 text-lg font-light">
                    {partner.content}
                  </p>
                  
                  {partner.downloadUrl && (
                    <a href={partner.downloadUrl} download>
                      <Button variant="hero" size="sm" className="rounded-none px-10">
                        <Download className="mr-2" size={16} /> {partner.downloadLabel}
                      </Button>
                    </a>
                  )}
                </div>

                {hasImages && (
                  <div className="w-full">
                    <div className={`grid ${imageCount === 1 ? 'grid-cols-1' : 'grid-cols-2'} gap-4`}>
                      {partner.images.map((img: string, i: number) => (
                        <div key={i} className="overflow-hidden bg-muted aspect-[4/3] relative">
                          <img 
                            src={img} 
                            alt={`${partner.name} CSR activity`} 
                            className="w-full h-full object-cover" 
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </motion.div>
    </motion.div>
  );
};

const CSR = () => {
  const [selectedCategory, setSelectedCategory] = useState<any>(null);
  const [isPolicyVisible, setIsPolicyVisible] = useState(false);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar isVisible={true} />
      
      {/* Hero Section */}
      <section className="pt-32 pb-20 bg-background relative overflow-hidden">
        <div className="container mx-auto px-4 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="line-accent" />
              <span className="text-primary font-semibold tracking-wider text-sm uppercase">
                Social Impact
              </span>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold text-foreground mb-6 tracking-tighter">
              Corporate <br />
              <span className="text-primary">Social Responsibility</span>
            </h1>
            <p className="text-foreground-muted text-xl leading-relaxed max-w-2xl font-light">
              At Western Consolidated, our success is measured by the strength of the communities we build. We go beyond compliance to create tangible, lasting impact through strategic partnerships and transparent governance.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Interactive Activity Categories */}
      <section className="py-24 bg-background-secondary border-y border-border/50">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="mb-16">
            <h2 className="text-xs font-black text-primary tracking-[0.4em] uppercase mb-4">Focus Areas</h2>
            <h3 className="text-4xl font-bold tracking-tight">Approved <span className="text-primary">Programmes</span></h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {activityCategories.map((category) => (
              <motion.div
                key={category.id}
                whileHover={{ y: -5 }}
                className="bg-background border border-border p-10 flex flex-col justify-between group cursor-pointer hover:border-primary transition-colors"
                onClick={() => setSelectedCategory(category)}
              >
                <div>
                  <category.icon className="w-10 h-10 text-primary mb-8" strokeWidth={1.5} />
                  <h4 className="text-2xl font-bold mb-4 uppercase tracking-tighter leading-none group-hover:text-primary transition-colors">
                    {category.title}
                  </h4>
                  <p className="text-foreground-muted text-sm font-light leading-relaxed mb-8">
                    {category.shortDesc}
                  </p>
                </div>
                <div className="flex items-center text-[10px] font-black uppercase tracking-[0.2em] text-primary">
                  View Programmes <ArrowUpRight size={14} className="ml-2" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Governance & Policy Toggle */}
      <section className="py-32 bg-background">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
              <div>
                <h2 className="text-4xl font-bold tracking-tighter uppercase mb-4">Governance <br/>& <span className="text-primary">Policy</span></h2>
                <p className="text-foreground-muted text-sm font-light leading-relaxed">
                  Our CSR framework is anchored in transparency and strict adherence to the Companies Act, 2013, overseen by our dedicated committee.
                </p>
              </div>
              <div className="flex flex-col gap-4">
                <Button 
                  onClick={() => setIsPolicyVisible(!isPolicyVisible)}
                  variant="heroOutline" 
                  className="rounded-none h-16 justify-between px-8 text-xs tracking-widest uppercase font-bold"
                >
                  <div className="flex items-center gap-3">
                    <ShieldCheck size={20} className="text-primary" />
                    View CSR Policy
                  </div>
                  <ChevronDown className={`transition-transform duration-300 ${isPolicyVisible ? 'rotate-180' : ''}`} />
                </Button>
              </div>
            </div>

            <AnimatePresence>
              {isPolicyVisible && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden border border-border bg-background-secondary"
                >
                  {csrPolicySections.map((section) => (
                    <PolicyAccordionItem key={section.id} section={section} />
                  ))}
                  <PolicyAccordionItem
                    section={{
                      title: 'AMENDMENTS TO THIS POLICY',
                      content: amendmentsContent,
                    }}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* CSR Committee Section */}
      <section className="py-24 bg-background-secondary border-t border-border/50">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-12">
            <div>
              <h2 className="text-xs font-black text-primary tracking-[0.4em] uppercase mb-4">Advisory Board</h2>
              <h3 className="text-4xl font-bold text-foreground tracking-tight">CSR Committee</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-12">
              {csrCommittee.map((member) => (
                <div key={member.name} className="space-y-2">
                  <div className="text-[10px] font-bold text-primary uppercase tracking-[0.3em]">{member.designation}</div>
                  <div className="font-bold text-xl text-foreground tracking-tighter uppercase leading-none">{member.name}</div>
                  <div className="w-8 h-[1px] bg-border" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <Footer />
      <FloatingButtons />

      {/* Overlay Interaction */}
      <AnimatePresence>
        {selectedCategory && (
          <ActivityOverlay 
            category={selectedCategory} 
            onClose={() => setSelectedCategory(null)} 
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default CSR;