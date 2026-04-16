import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import heroBg from '@/assets/hero-bg.jpg';
import { AssemblyParts } from './hero/AssemblyAnimation';
import { SparkParticles } from './hero/SparkParticles';
import { HeroStats } from './hero/HeroStats';
import { KoelBadge } from './hero/KoelBadge';

interface HeroSectionProps {
  onAnimationComplete: () => void;
}

export const HeroSection = ({ onAnimationComplete }: HeroSectionProps) => {
  const [animationPhase, setAnimationPhase] = useState<'assembly' | 'transition' | 'main' | 'complete'>('assembly');
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    const transitionTimer = setTimeout(() => setAnimationPhase('transition'), 2000);
    const mainTimer = setTimeout(() => {
      setAnimationPhase('main');
      setShowContent(true);
    }, 2500);
    const completeTimer = setTimeout(() => {
      setAnimationPhase('complete');
      onAnimationComplete();
    }, 4000);

    return () => {
      clearTimeout(transitionTimer);
      clearTimeout(mainTimer);
      clearTimeout(completeTimer);
    };
  }, [onAnimationComplete]);

  const scrollToNext = useCallback(() => {
    document.getElementById('legacy-section')?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  return (
    <section className="relative min-h-[100dvh] flex items-center overflow-hidden">
      {/* Background with Ken Burns zoom */}
      <motion.div
        className="absolute inset-0"
        initial={{ scale: 1.15 }}
        animate={{ scale: 1 }}
        transition={{ duration: 12, ease: 'easeOut' }}
      >
        <img
          src={heroBg}
          alt=""
          className="w-full h-full object-cover"
        />
      </motion.div>

      {/* Cinematic overlay stack */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/30" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/40" />
      <div className="absolute inset-0 bg-gradient-to-br from-[hsl(350,80%,45%)]/[0.06] via-transparent to-transparent" />
      
      {/* Bottom fade to next section */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent z-[6]" />

      {/* Industrial spark particles */}
      {showContent && <SparkParticles />}

      {/* Assembly Animation Overlay */}
      <AnimatePresence>
        {animationPhase === 'assembly' && (
          <motion.div
            className="absolute inset-0 z-20 flex items-center justify-center"
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex flex-col items-center px-4 w-full">
              <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
              <div className="relative h-64 w-64 flex items-center justify-center">
                <AssemblyParts />
              </div>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.8 }}
                className="relative text-white text-center w-full text-2xl md:text-3xl font-display font-bold uppercase tracking-[0.4em] mt-8 md:mt-12"
              >
                Western Consolidated
              </motion.p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="container mx-auto px-4 lg:px-8 relative z-10 pt-24 pb-32 md:pt-0 md:pb-0">
        <div className="max-w-3xl">
          
          {/* Eyebrow tag */}
          <AnimatePresence>
            {showContent && (
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.15 }}
                className="flex items-center gap-3 mb-6"
              >
                <div className="h-px w-10 bg-primary" />
                <span className="text-primary font-semibold tracking-[0.2em] text-xs uppercase">
                  KOEL Authorized Manufacturer
                </span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Main heading */}
          <AnimatePresence>
            {showContent && (
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.25 }}
              >
                <h1 className="text-5xl md:text-7xl lg:text-8xl font-display font-bold leading-[0.95] tracking-tight">
                  <span className="text-white">Extensive</span>
                  <br />
                  <span className="text-gradient-primary">Power</span>
                  <br />
                  <span className="text-white">Solutions</span>
                </h1>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Description */}
          <AnimatePresence>
            {showContent && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="mt-8 max-w-xl"
              >
                <p className="text-white/60 text-base md:text-lg leading-relaxed">
                  Precision-engineered diesel generator sets from{' '}
                  <span className="text-white/90 font-medium">3 kVA to 1010 kVA</span>.
                  Trusted across India for mission-critical power solutions
                  and emergency backup systems.
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* CTAs */}
          <AnimatePresence>
            {showContent && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.7 }}
                className="flex flex-wrap gap-4 mt-10"
              >
                <Link to="/products">
                  <Button variant="hero" size="lg" className="group">
                    Explore Generator Sets
                    <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <Link to="/enquiry">
                  <Button
                    variant="heroOutline"
                    size="lg"
                    className="border-white/20 text-white hover:bg-white/10"
                  >
                    <FileText size={18} className="mr-2" />
                    Get Quote
                  </Button>
                </Link>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Stats */}
          <AnimatePresence>
            {showContent && (
              <div className="mt-14 pt-8 border-t border-white/10">
                <HeroStats />
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* KOEL Badge */}
      <AnimatePresence>
        {showContent && <KoelBadge />}
      </AnimatePresence>

      {/* Scroll indicator */}
      <AnimatePresence>
        {animationPhase === 'complete' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 cursor-pointer"
            onClick={scrollToNext}
          >
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-5 h-9 border-2 border-white/30 rounded-full flex items-start justify-center p-1.5"
            >
              <div className="w-1 h-2.5 bg-white/30 rounded-full" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};
