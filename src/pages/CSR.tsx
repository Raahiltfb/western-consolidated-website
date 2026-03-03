import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { FloatingButtons } from '@/components/layout/FloatingButtons';
import { 
  Heart, 
  GraduationCap, 
  User, 
  FileText, 
  Calendar, 
  Droplets, 
  Medal, 
  TreePine, 
  ChevronDown, 
  Download, 
  Activity 
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const csrCommittee = [
  { name: 'Mr. Pranab Biswas', designation: 'Member' },
  { name: 'Mr. Vineet Dhingra', designation: 'Chairman' },
  { name: 'Mrs. Savita Dhingra', designation: 'Member' },
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

const csrProgrammes = [
  {
    title: 'Poverty, Health & Nutrition',
    description: 'Eradicating hunger, poverty and malnutrition, promoting health care including preventive health care and sanitation.',
    icon: Heart,
  },
  {
    title: 'Flood Relief',
    description: 'Disaster management, including relief, rehabilitation and reconstruction activities.',
    icon: Droplets,
  },
  {
    title: 'Promoting Sports',
    description: 'Training to promote rural sports, nationally recognised sports, paralympic sports and olympic sports.',
    icon: Medal,
  },
  {
    title: 'Protection of Flora & Fauna',
    description: 'Ensuring environmental sustainability, ecological balance, protection of flora and fauna, conservation of natural resources.',
    icon: TreePine,
  },
  {
    title: 'Promoting Education',
    description: 'Promoting education, including special education and employment enhancing vocation skills.',
    icon: GraduationCap,
  },
];

const chiragStats = [
  { value: '3.9L+', label: 'People Impacted' },
  { value: '25,000+', label: 'Patients Treated Annually' },
  { value: '747', label: 'Springs Rejuvenated' },
  { value: '14M+', label: 'Saplings Planted' },
];

const PolicyAccordionItem = ({ section }: { section: { title: string; content: string; definitions?: { term: string; definition: string }[]; activities?: string[] } }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-border/50 group transition-colors hover:bg-muted/30">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between py-6 px-4 text-left"
      >
        <div className="flex items-center gap-6">
          <div className="relative">
            <div className={`absolute -left-4 top-0 bottom-0 w-1 bg-primary transition-transform duration-300 origin-top ${isOpen ? 'scale-y-100' : 'scale-y-0'}`} />
            <span className={`text-xs font-bold tracking-[0.2em] uppercase transition-colors ${isOpen ? 'text-primary' : 'text-muted-foreground'}`}>
              Section
            </span>
          </div>
          <h3 className="text-lg font-bold text-foreground tracking-wide uppercase">{section.title}</h3>
        </div>
        <motion.div animate={{ rotate: isOpen ? 180 : 0 }}>
          <ChevronDown className={`w-5 h-5 ${isOpen ? 'text-primary' : 'text-muted-foreground'}`} />
        </motion.div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="px-16 pb-8">
              <div className="text-foreground-muted leading-relaxed whitespace-pre-line text-sm lg:text-base max-w-4xl">
                {section.content}
              </div>

              {section.definitions && (
                <div className="mt-6 space-y-3 bg-background-secondary p-6 border-l-2 border-primary/30">
                  {section.definitions.map((def, idx) => (
                    <p key={idx} className="text-sm text-foreground-muted">
                      <span className="font-bold text-primary mr-2">{def.term}</span> {def.definition}
                    </p>
                  ))}
                </div>
              )}

              {section.activities && (
                <div className="mt-8 space-y-4">
                   <h4 className="text-[10px] font-black text-primary tracking-[0.2em] uppercase mb-4">Specified Activities</h4>
                   <ul className="space-y-4">
                    {section.activities.map((activity, idx) => (
                      <li key={idx} className="flex gap-4 text-sm text-foreground-muted leading-relaxed">
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

const CSR = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar isVisible={true} />
      
      {/* Hero Section */}
      <section className="pt-40 pb-24 bg-background relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-primary/5 blur-[120px] rounded-full -mr-20" />
        <div className="container mx-auto px-4 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-[2px] bg-primary" />
              <span className="text-primary font-bold tracking-[0.3em] text-xs uppercase">
                Social Impact
              </span>
            </div>
            <h1 className="text-6xl md:text-7xl font-normal text-foreground mb-8 tracking-tighter leading-[0.9]">
              Corporate <br />
              <span className="text-primary">Responsibility</span>
            </h1>
            <p className="text-foreground-muted text-lg lg:text-xl leading-relaxed max-w-2xl font-light">
              Corporate social responsibility is integral to WCPL. Our programs focus on education, healthcare, environment, poverty alleviation, and community development - delivering value to society at large.
            </p>
          </motion.div>
        </div>
      </section>

      {/* FY 2025-26 Programmes - The Industrial Grid */}
      <section className="py-24 bg-background-secondary border-y border-border/50">
        <div className="container mx-auto px-4 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-16"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-none bg-primary text-white mb-6">
              <Calendar size={14} />
              <span className="text-[10px] font-bold uppercase tracking-[0.2em]">FY 2025-26 Approved</span>
            </div>
            <h2 className="text-4xl font-bold text-foreground tracking-tight">
              Programmes Approved by the <span className="text-primary">Board</span>
            </h2>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-1px bg-border/50 border border-border/50">
            {csrProgrammes.map((programme, index) => (
              <motion.div
                key={programme.title}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-background p-10 group hover:bg-muted/20 transition-all"
              >
                <div className="w-12 h-12 bg-primary/10 flex items-center justify-center mb-8 group-hover:bg-primary transition-colors">
                  <programme.icon className="w-6 h-6 text-primary group-hover:text-white" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-4 uppercase tracking-wider leading-tight">
                  {programme.title}
                </h3>
                <p className="text-foreground-muted text-sm leading-relaxed font-light">
                  {programme.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Partner Section - CHIRAG */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid lg:grid-cols-[1fr_400px] gap-16 items-start">
            <div>
              <h2 className="text-xs font-black text-primary tracking-[0.4em] uppercase mb-8">Implementation Partner</h2>
              <h3 className="text-4xl font-bold text-foreground mb-6">Central Himalayan Rural Action Group (CHIRAG)</h3>
              <p className="text-foreground-muted text-lg leading-relaxed font-light mb-8 max-w-3xl">
                CHIRAG is a non-profit voluntary organization working in the Central Himalayan region of Uttarakhand. 
                Their holistic approach focuses on healthcare, education, agriculture, and environmental conservation — 
                aligning with WCPL's vision of creating lasting social impact.
              </p>
              
              <div className="grid grid-cols-2 gap-4">
                {chiragStats.map((stat) => (
                  <div key={stat.label} className="p-8 border border-border bg-background-secondary group hover:border-primary transition-colors">
                    <div className="text-3xl font-black text-primary mb-2 tracking-tighter">{stat.value}</div>
                    <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:sticky lg:top-32 p-8 border border-border bg-muted/10">
               <Activity className="text-primary mb-6" size={40} strokeWidth={1} />
               <h4 className="text-lg font-bold mb-4 uppercase tracking-tight">Partner Documentation</h4>
               <p className="text-sm text-muted-foreground mb-8 leading-relaxed">
                 Access detailed reports on CHIRAG's regional impact and technical implementation frameworks for the current financial year.
               </p>
               <a href="/brochure.pdf" download className="w-full">
                <Button className="w-full rounded-none h-14 uppercase tracking-widest text-xs font-bold">
                  <Download className="mr-2" size={16} /> Download Partner Profile
                </Button>
               </a>
            </div>
          </div>
        </div>
      </section>

      {/* Policy Accordions */}
      <section className="py-24 bg-background-secondary">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-black text-foreground tracking-tighter uppercase">CSR <span className="text-primary">Policy</span></h2>
              <div className="w-20 h-1 bg-primary mx-auto mt-4" />
            </div>
            
            <div className="border-t border-border/50">
              {csrPolicySections.map((section) => (
                <PolicyAccordionItem key={section.id} section={section} />
              ))}
              <PolicyAccordionItem
                section={{
                  title: 'AMENDMENTS TO THIS POLICY',
                  content: amendmentsContent,
                }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* CSR Committee - Final Footer Section */}
      <section className="py-24 bg-background border-t border-border/30">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex flex-col lg:flex-row justify-between items-end gap-12">
            <div>
              <h2 className="text-xs font-black text-primary tracking-[0.4em] uppercase mb-8">Governance</h2>
              <h3 className="text-4xl font-bold text-foreground tracking-tight">CSR Committee</h3>
            </div>
            <div className="flex flex-wrap gap-8">
              {csrCommittee.map((member) => (
                <div key={member.name} className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <User size={20} className="text-primary" />
                  </div>
                  <div>
                    <div className="font-bold text-foreground text-sm uppercase tracking-wider">{member.name}</div>
                    <div className="text-xs text-muted-foreground font-medium uppercase tracking-widest">{member.designation}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <Footer />
      <FloatingButtons />
    </div>
  );
};

export default CSR;
