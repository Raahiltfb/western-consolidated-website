import { motion } from 'framer-motion';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { FloatingButtons } from '@/components/layout/FloatingButtons';
import { Heart, Leaf, GraduationCap, Users, User, FileText, Calendar } from 'lucide-react';

const csrCommittee = [
  {
    name: 'Mr. Vineet Dhingra',
    designation: 'Chairman',
  },
  {
    name: 'Mr. Pranab Biswas',
    designation: 'Member',
  },
  {
    name: 'Mrs. Savita Dhingra',
    designation: 'Member',
  },
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
    title: 'Poverty, Health and Nutrition Programme for children',
    description: 'Eradicating hunger, poverty and malnutrition, promoting health care including preventive health care and sanitation including contribution to the Swach Bharat Kosh set-up by the Central Government for the promotion of sanitation and making available safe drinking water.',
  },
  {
    title: 'Flood Relief',
    description: 'Disaster management, including relief, rehabilitation and reconstruction activities.',
  },
  {
    title: 'Promoting Sports',
    description: 'Training to promote rural sports, nationally recognised sports, paralympic sports and olympic sports.',
  },
  {
    title: 'Protection of Flora and Fauna',
    description: 'Ensuring environmental sustainability, ecological balance, protection of flora and fauna, animal welfare, agro forestry, conservation of natural resources and maintaining quality of soil, air and water including contribution to the Clean Ganga Fund set-up by the Central Government for rejuvenation of river Ganga.',
  },
  {
    title: 'Promoting Education',
    description: 'Promoting education, including special education and employment enhancing vocation skills especially among children, women, elderly and the differently abled and livelihood enhancement projects.',
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
              Corporate social responsibility is integral to WCPL. Our programs focus on education, healthcare, environment, poverty alleviation, and community development - delivering value to society at large.
            </p>
          </motion.div>
        </div>
      </section>

      {/* CSR Committee */}
      <section className="py-20 bg-background-secondary">
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
          
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
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
      <section className="py-20 bg-background">
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
          
          <div className="space-y-8 mb-12">
            {csrPolicySections.map((section, index) => (
              <motion.div
                key={section.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.05 }}
                className="card-industrial p-6 lg:p-8 rounded-lg"
              >
                <h3 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <FileText className="w-5 h-5 text-primary" />
                  </div>
                  {section.title}
                </h3>
                
                <div className="text-foreground-muted leading-relaxed whitespace-pre-line">
                  {section.content}
                </div>

                {/* Definitions */}
                {'definitions' in section && section.definitions && (
                  <div className="mt-4 space-y-2">
                    {section.definitions.map((def, idx) => (
                      <p key={idx} className="text-foreground-muted leading-relaxed">
                        <span className="font-semibold text-foreground">{def.term}</span> {def.definition}
                      </p>
                    ))}
                  </div>
                )}

                {/* Activities List */}
                {'activities' in section && section.activities && (
                  <ol className="mt-4 space-y-3 list-decimal list-outside ml-6">
                    {section.activities.map((activity, idx) => (
                      <li key={idx} className="text-foreground-muted leading-relaxed whitespace-pre-line">
                        {activity}
                      </li>
                    ))}
                  </ol>
                )}
              </motion.div>
            ))}
          </div>

          {/* Amendments */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="card-industrial p-6 lg:p-8 rounded-lg"
          >
            <h3 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                <FileText className="w-5 h-5 text-primary" />
              </div>
              AMENDMENTS TO THIS POLICY
            </h3>
            <p className="text-foreground-muted leading-relaxed whitespace-pre-line">
              {amendmentsContent}
            </p>
          </motion.div>
        </div>
      </section>

      {/* CSR Programmes */}
      <section className="py-20 bg-background-secondary">
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
      <section className="py-20 bg-background">
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
