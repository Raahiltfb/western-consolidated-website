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
          className="hidden md:block w-full h-full object-cover brightness-200 contrast-110 scale-[1.1] md:scale-100"
        />
      </motion.div>

        {/* Cinematic gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/20 via-black/10 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-black/10" />
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,rgba(255,255,255,0.1),transparent_90%)]" />
      </div>

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

      <div className="container mx-auto px-4 lg:px-8 relative z-10 pt-10 md:pt-0">
        <div className="dark">
          <div className="absolute inset-0 grid-overlay opacity-10 pointer-events-none" />
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            
            {/* LEFT SIDE */}
            <div className="space-y-4 pt-4 md:pt-0">
              <AnimatePresence>
                {showContent && (
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="mt-8 md:mt-20"
                  >
                    <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight">
                      <span className="text-white">Extensive </span>
                      
                      <span className="text-primary">Power</span>
                      <br />
                      <span className="text-white">Solutions</span>
                    </h1>
                  </motion.div>
                )}
              </AnimatePresence>

              <AnimatePresence>
                {showContent && (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    className="flex items-center gap-3 py-1"
                  >
                    <div className="line-accent bg-primary h-[2px] w-12" />
                    <span className="text-primary font-bold tracking-[0.15em] text-sm uppercase whitespace-nowrap drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                      KOEL Authorized Manufacturer
                    </span>
                  </motion.div>
                )}
              </AnimatePresence>

              <AnimatePresence>
                {showContent && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    className="bg-black/40 backdrop-blur-sm border-l-4 border-primary/60 p-5 rounded-r-lg max-w-lg mt-4"
                  >
                    <p className="text-white text-lg font-medium leading-relaxed [text-shadow:_0_1px_8px_rgb(0_0_0_/_80%)]">
                      Authorized GOEM of Kirloskar Oil Engines Ltd, delivering precision-engineered diesel generator sets from 3 kVA to 1010 kVA. 
                      Trusted by industrial, cellular, and private customers across India for mission-critical power solutions and emergency backup systems.
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>

              <AnimatePresence>
                {showContent && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.6 }}
                    className="flex flex-wrap gap-4 pt-4"
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
                        className="border-white/40 text-white hover:bg-white/10"
                      >
                        <FileText size={18} className="mr-2" />
                        Get Quote
                      </Button>
                    </Link>
                  </motion.div>
                )}
              </AnimatePresence>

              <AnimatePresence>
                {showContent && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.8 }}
                    className="flex items-center gap-6 md:gap-8 pt-8 border-t border-white/20"
                  >
                    <div>
                      <div className="text-3xl md:text-4xl font-bold text-white">60+</div>
                      <div className="text-white/50 text-xs md:text-sm">Years Engineering</div>
                    </div>
                    <div className="w-px h-10 bg-white/20" />
                    <div>
                      <div className="text-3xl md:text-4xl font-bold text-white">100,000+</div>
                      <div className="text-white/50 text-xs md:text-sm">Installations</div>
                    </div>
                    <div className="w-px h-10 bg-white/20" />
                    <div>
                      <div className="text-3xl md:text-4xl font-bold text-white">24/7</div>
                      <div className="text-white/50 text-xs md:text-sm">Support</div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* RIGHT SIDE */}
            <AnimatePresence>
              {showContent && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9, y: 40 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ duration: 1.2, delay: 0.5 }}
                  className="relative hidden lg:flex items-center justify-center"
                >
                  <div className="relative z-10 w-full max-w-xl">
                    <img
                      src=""
                      alt=""
                      className="w-full h-auto object-contain drop-shadow-[0_20px_60px_rgba(0,0,0,0.8)]"
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

          </div>
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
