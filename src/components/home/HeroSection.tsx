import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import kirloskarLogo from '@/assets/kirloskar-logo.png';
import heroBg from '@/assets/hero-bg.jpg';

interface HeroSectionProps {
  onAnimationComplete: () => void;
}

const NAVBAR_HEIGHT = 80; // adjust if your navbar height differs

const AssemblyParts = () => {
  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <motion.div className="absolute w-32 h-24 border-2 border-primary/40 rounded-md bg-primary/5"
        initial={{ x: -200, opacity: 0, rotate: -15 }}
        animate={{ x: 0, opacity: 1, rotate: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }} />
      <motion.div className="absolute w-20 h-28 border-2 border-primary/30 rounded-sm bg-primary/5"
        style={{ left: '55%' }}
        initial={{ x: 200, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.4 }} />
      <motion.div className="absolute w-16 h-16 border-2 border-primary/40 rounded bg-primary/10"
        style={{ top: '20%', right: '30%' }}
        initial={{ y: -150, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, delay: 0.6 }} />
      <motion.div className="absolute bottom-[30%] w-48 h-4 border-2 border-primary/30 bg-primary/5"
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.3 }} />
      <motion.div className="absolute w-6 h-20 border-2 border-primary/20 rounded-full bg-primary/5"
        style={{ top: '15%', left: '40%' }}
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.8 }} />
    </div>
  );
};

export const HeroSection = ({ onAnimationComplete }: HeroSectionProps) => {
  const [animationPhase, setAnimationPhase] = useState<'assembly' | 'transition' | 'main' | 'complete'>('assembly');
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setAnimationPhase('transition'), 2000);
    const t2 = setTimeout(() => { setAnimationPhase('main'); setShowContent(true); }, 2500);
    const t3 = setTimeout(() => { setAnimationPhase('complete'); onAnimationComplete(); }, 4000);

    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [onAnimationComplete]);

  const scrollToNext = useCallback(() => {
    document.getElementById('legacy-section')?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  return (
    <section
      className="relative flex items-center overflow-hidden bg-background"
      style={{
        paddingTop: NAVBAR_HEIGHT,
        minHeight: `calc(100vh - ${NAVBAR_HEIGHT}px)`
      }}
    >
      <div className="absolute inset-0 grid-overlay opacity-10 pointer-events-none" />

      <AnimatePresence>
        {animationPhase === 'assembly' && (
          <motion.div className="absolute inset-0 z-20 flex items-center justify-center"
            exit={{ opacity: 0 }}>
            <div className="flex flex-col items-center px-4 w-full">
              <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" />
              <div className="relative h-64 w-64 flex items-center justify-center">
                <AssemblyParts />
              </div>
              <motion.p className="relative text-foreground text-2xl md:text-3xl font-bold tracking-[0.4em] mt-8">
                WESTERN CONSOLIDATED
              </motion.p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative z-10 w-full h-full">
        <div className="grid lg:grid-cols-2 h-full">

          {/* LEFT */}
          <div className="px-4 lg:px-12 flex flex-col justify-center space-y-6">
            {showContent && (
              <>
                <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.05]">
                  <span className="text-foreground">Extensive</span><br />
                  <span className="text-primary">Power</span><br />
                  <span className="text-foreground">Solutions</span>
                </h1>

                <div className="flex items-center gap-3">
                  <div className="line-accent" />
                  <span className="text-primary text-sm uppercase">
                    KOEL Authorized Manufacturer
                  </span>
                </div>

                <p className="text-muted-foreground max-w-lg">
                  Authorized GOEM of Kirloskar Oil Engines Ltd, delivering precision-engineered diesel generator sets from 3 kVA to 1010 kVA.
                </p>

                <div className="flex gap-4">
                  <Link to="/products">
                    <Button variant="hero">Explore Generator Sets</Button>
                  </Link>
                  <Link to="/enquiry">
                    <Button variant="heroOutline">Get Quote</Button>
                  </Link>
                </div>
              </>
            )}
          </div>

          {/* RIGHT */}
          {showContent && (
            <div className="relative hidden lg:block h-full">
              <img
                src={heroBg}
                alt=""
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-l from-transparent via-background/20 to-background/80" />
            </div>
          )}

        </div>
      </div>
    </section>
  );
};