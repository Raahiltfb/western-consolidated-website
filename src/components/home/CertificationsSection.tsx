 import { motion } from 'framer-motion';
 import { Link } from 'react-router-dom';
 import { Award, ExternalLink } from 'lucide-react';
 import { Button } from '@/components/ui/button';
 
 const certifications = [
   {
     id: 'iso-14001',
     title: 'ISO 14001:2015',
     description: 'The Environment Management System is applicable to',
   },
   {
     id: 'iso-45001',
     title: 'ISO 45001:2018',
     description: 'The Health and Safety Management System is applicable to',
   },
   {
     id: 'iso-9001',
     title: 'ISO 9001:2015',
     description: 'The Quality Management System is applicable to',
   },
 ];
 
 export const CertificationsSection = () => {
   return (
     <section className="py-20 bg-background">
       <div className="container mx-auto px-4 lg:px-8">
         {/* Section Header */}
         <motion.div
           initial={{ opacity: 0, y: 20 }}
           whileInView={{ opacity: 1, y: 0 }}
           viewport={{ once: true }}
           transition={{ duration: 0.6 }}
           className="text-center mb-12"
         >
           <div className="flex items-center justify-center gap-3 mb-4">
             <div className="line-accent" />
             <span className="text-primary font-semibold tracking-wider text-sm uppercase">
               Quality Assurance
             </span>
             <div className="line-accent" />
           </div>
           <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
             Awards & <span className="text-primary">Certifications</span>
           </h2>
           <p className="text-foreground-muted text-lg max-w-3xl mx-auto leading-relaxed">
             We are an ISO 14001:2015, ISO 45001:2018, ISO 9001:2015 certified and TUV NORD accredited company.
           </p>
         </motion.div>
 
         {/* Certification Cards */}
         <div className="grid md:grid-cols-3 gap-8">
           {certifications.map((cert, index) => (
             <motion.div
               key={cert.id}
               initial={{ opacity: 0, y: 20 }}
               whileInView={{ opacity: 1, y: 0 }}
               viewport={{ once: true }}
               transition={{ duration: 0.6, delay: index * 0.1 }}
               className="card-industrial p-8 rounded-lg text-center group"
             >
               <div className="w-16 h-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
                 <Award className="w-8 h-8 text-primary" />
               </div>
               <h3 className="text-xl font-bold text-foreground mb-3">
                 {cert.title}
               </h3>
               <p className="text-foreground-muted text-sm mb-6 leading-relaxed">
                 {cert.description}
               </p>
               <Link to={`/certifications/${cert.id}`}>
                 <Button variant="outline" size="sm" className="group/btn">
                   View Certification
                   <ExternalLink size={14} className="ml-2 group-hover/btn:translate-x-0.5 transition-transform" />
                 </Button>
               </Link>
             </motion.div>
           ))}
         </div>
 
         {/* TUV NORD Badge */}
         <motion.div
           initial={{ opacity: 0, y: 20 }}
           whileInView={{ opacity: 1, y: 0 }}
           viewport={{ once: true }}
           transition={{ duration: 0.6, delay: 0.4 }}
           className="mt-12 text-center"
         >
           <div className="inline-flex items-center gap-4 px-6 py-4 bg-card border border-border rounded-lg">
             <div className="w-12 h-12 bg-secondary rounded-lg flex items-center justify-center">
               <span className="text-secondary-foreground font-bold text-sm">TUV</span>
             </div>
             <div className="text-left">
               <div className="text-foreground font-semibold">TUV NORD Accredited</div>
               <div className="text-foreground-muted text-sm">International Quality Certification</div>
             </div>
           </div>
         </motion.div>
       </div>
     </section>
   );
 };