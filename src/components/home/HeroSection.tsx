import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import kirloskarLogo from '@/assets/kirloskar-logo.png';
import heroGenerator from '@/assets/hero-generator.png';
import heroBg from '@/assets/hero-bg.jpg';

interface HeroSectionProps {
  onAnimationComplete: () => void;
}

// Assembly component parts for the intro animation
const AssemblyParts = () => {
  return (
    <div className="relative w-full h-full flex items-center justify-center">
      {/* Engine block */}
      <motion.div
        className="absolute w-32 h-24 border-2 border-primary/40 rounded-md bg-primary/5"
        initial={{ x: -200, opacity: 0, rotate: -15 }}
        animate={{ x: 0, opacity: 1, rotate: 0 }}
        transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
      />
      {/* Radiator */}
      <motion.div
        className="absolute w-20 h-28 border-2 border-primary/30 rounded-sm bg-primary/5"
        style={{ left: '55%' }}
        initial={{ x: 200, opacity: 0, rotate: 10 }}
        animate={{ x: 0, opacity: 1, rotate: 0 }}
        transition={{ duration: 0.8, delay: 0.4, ease: 'easeOut' }}
      />
      {/* Control panel */}
      <motion.div
        className="absolute w-16 h-16 border-2 border-primary/40 rounded bg-primary/10"
        style={{ top: '20%', right: '30%' }}
        initial={{ y: -150, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, delay: 0.6, ease: 'easeOut' }}
      />
      {/* Base frame */}
      <motion.div
        className="absolute bottom-[30%] w-48 h-4 border-2 border-primary/30 rounded-sm bg-primary/5"
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.3, ease: 'easeOut' }}
      />
      {/* Exhaust */}
      <motion.div
        className="absolute w-6 h-20 border-2 border-primary/20 rounded-full bg-primary/5"
        style={{ top: '15%', left: '40%' }}
        initial={{ y: -100, opacity: 0, scale: 0.5 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.8, ease: 'easeOut' }}
      />
    </div>
  );
};

export const HeroSection = ({ onAnimationComplete }: HeroSectionProps) => {
  const [animationPhase, setAnimationPhase] = useState<'assembly' | 'transition' | 'main' | 'complete'>('assembly');
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    // Phase 1: Assembly animation plays for 2s
    const transitionTimer = setTimeout(() => {
      setAnimationPhase('transition');
    }, 2000);

    // Phase 2: Transition to main content
    const mainTimer = setTimeout(() => {
      setAnimationPhase('main');
      setShowContent(true);
    }, 2500);

    // Phase 3: Complete
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
    const nextSection = document.getElementById('legacy-section');
    if (nextSection) {
      nextSection.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);



  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Full-bleed background image */}
      <div className="absolute inset-0">
        <img
          src={heroBg}
          alt=""
          className="w-full h-full object-cover"
        />
        {/* Cinematic gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/70 to-black/40" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30" />
        {/* Subtle warm accent glow from the welding light */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent" />
      </div>

      {/* Subtle grid overlay */}
      <div className="absolute inset-0 grid-overlay opacity-10" />

      {/* Assembly Animation Overlay */}
      <AnimatePresence>
        {(animationPhase === 'assembly') && (
          <motion.div
            className="absolute inset-0 z-20 flex items-center justify-center"
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex flex-col items-center px-4 w-full">
              <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
              <div className="relative h-64 w-64 flex items-center justify-center">
                <AssemblyParts />
              </div>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.8 }}
                className="relative text-white text-center w-full text-2xl md:text-3xl font-bold uppercase tracking-[0.4em] mt-8 md:mt-12"
              >
                WESTERN CONSOLIDATED
              </motion.p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          
          {/* LEFT SIDE */}
          <div className="space-y-4 pt-4 md:pt-0">
            <AnimatePresence>
              {showContent && (
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  className="mt-12 md:mt-20"
                >
                  <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight">
                    <span className="text-white">Extensive</span>
                    <br />
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
                  <div className="line-accent" />
                  <span className="text-primary font-semibold tracking-wider text-sm uppercase whitespace-nowrap">
                    KOEL Authorized Manufacturer
                  </span>
                </motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence>
              {showContent && (
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                  className="text-white/70 text-lg max-w-lg leading-relaxed mt-0"
                >
                  Authorized GOEM of Kirloskar Oil Engines Ltd, delivering precision-engineered diesel generator sets from 3 kVA to 1010 kVA. 
                  Trusted by industrial, cellular, and private customers across India for mission-critical power solutions and emergency backup systems.
                </motion.p>
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
                    <Button variant="heroOutline" size="lg">
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
                  className="flex items-center gap-8 pt-8 border-t border-white/20"
                >
                  <div>
                    <div className="text-4xl font-bold text-white">60+</div>
                    <div className="text-white/50 text-sm">Years Engineering</div>
                  </div>
                  <div className="w-px h-10 bg-white/20" />
                  <div>
                    <div className="text-4xl font-bold text-white">100,000+</div>
                    <div className="text-white/50 text-sm">Installations</div>
                  </div>
                  <div className="w-px h-10 bg-white/20" />
                  <div>
                    <div className="text-4xl font-bold text-white">24/7</div>
                    <div className="text-white/50 text-sm">Support</div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* RIGHT SIDE - Generator Image */}
          {/* RIGHT SIDE - Generator product floating over background */}
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

      {/* Scroll indicator */}
      <AnimatePresence>
        {animationPhase === 'complete' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="absolute bottom-8 left-1/2 -translate-x-1/2"
          >
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-6 h-10 border-2 border-white/40 rounded-full flex items-start justify-center p-2"
            >
              <div className="w-1.5 h-3 bg-white/40 rounded-full" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* KOEL Badge */}
      <AnimatePresence>
        {showContent && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1 }}
            className="absolute bottom-8 right-8 hidden lg:block z-10"
          >
            <div className="bg-black/60 backdrop-blur-md border border-white/10 rounded-lg px-4 py-3 flex items-center gap-3">
              <div className="w-10 h-10 bg-white rounded flex items-center justify-center p-1.5">
                <img src={kirloskarLogo} alt="Kirloskar" className="w-full h-full object-contain" />
              </div>
              <div>
                <div className="text-[10px] leading-tight font-medium text-white/70 uppercase">
                  AUTHORIZED GOEM
                </div>
                <div className="text-sm font-bold text-white">
                  of KOEL
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};
