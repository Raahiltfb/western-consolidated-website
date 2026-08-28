import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import kirloskarLogo from '@/assets/kirloskar-logo.png';
import heroBg from '@/assets/bgagain.jpg';
import mobileBg from '@/assets/hero-bg.jpg';

interface HeroSectionProps {
  onAnimationComplete: () => void;
}

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
    const transitionTimer = setTimeout(() => {
      setAnimationPhase('transition');
    }, 2000);

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

  return (
    <section className="relative min-h-[100dvh] flex items-stretch overflow-hidden">
      {/* Full-bleed background image */}
      <div className="absolute inset-0">
        {/* Desktop */}
        <img
          src={heroBg}
          alt=""
          className="hidden md:block w-full h-full object-cover brightness-[0.95] contrast-100 scale-[1.1] md:scale-100"
        />

        {/* Mobile */}
        <img
          src={mobileBg}
          alt=""
          className="md:hidden w-full h-full object-cover brightness-[0.95] contrast-100 scale-[1.1]"
        />

        {/* Cinematic gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/0 via-black/0 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/0 via-transparent to-black/0" />
        <div className="absolute inset-0 bg-gradient-to-br from-primary/0 via-transparent to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_100%_0%,rgba(255,255,255,0.1),transparent_100%)]" />
      </div>

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

      <div className="container mx-auto px-4 lg:px-8 relative z-10 flex items-stretch py-12 md:py-24 min-h-[100dvh]">
        <div className="dark w-full flex items-stretch">
          <div className="absolute inset-0 grid-overlay opacity-10 pointer-events-none" />
          <div className="grid lg:grid-cols-12 gap-8 items-stretch w-full">
            
            {/* LEFT SIDE - Cohesive Editorial Content Column */}
            <div className="flex flex-col justify-between h-full lg:col-span-7 z-10 max-w-2xl pr-4">
              
              {/* Top Group: Headline & Subline (Desktop Only) */}
              <div className="hidden md:block space-y-6 pt-6 md:pt-24">
                {/* Headline (Three Lines, Standard Case & Font Weight) */}
                <AnimatePresence>
                  {showContent && (
                    <motion.div
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.8, delay: 0.2 }}
                    >
                      <h1 className="text-5xl lg:text-7xl font-bold tracking-tight text-white leading-[1.05] drop-shadow-[0_4px_8px_rgba(0,0,0,0.5)]">
                        Extensive <br />
                        <span className="text-primary">Power</span> <br />
                        Solutions
                      </h1>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Subline */}
                <AnimatePresence>
                  {showContent && (
                    <motion.p
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.4 }}
                      className="text-slate-300 text-sm md:text-base font-normal tracking-wide leading-relaxed drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] max-w-lg"
                    >
                      Power solutions. From 3 kVA to 1010 kVA. Trusted across India.
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>

              {/* Bottom Group: CTA Buttons and Metrics Stack */}
              <div className="mt-auto space-y-4 md:space-y-8 pb-6 md:pb-12">
                
                {/* Mobile-only Content Group (Headline & Subline positioned right over CTAs) */}
                <div className="md:hidden flex flex-col space-y-2 mb-6">
                  <AnimatePresence>
                    {showContent && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                        className="w-full text-center"
                      >
                        <h2 className="text-2xl sm:text-3xl font-black text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)] text-center">
                          Extensive <span className="text-primary">Power</span> Solutions
                        </h2>
                      </motion.div>
                    )}
                  </AnimatePresence>
                  
                  <AnimatePresence>
                    {showContent && (
                      <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                        className="text-xs sm:text-sm font-medium text-slate-200 tracking-wide whitespace-nowrap overflow-hidden text-ellipsis drop-shadow-[0_2px_6px_rgba(0,0,0,0.9)] text-left w-full"
                      >
                        Power solutions. From 3 kVA to 1010 kVA. Trusted across India.
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>

                {/* CTA Buttons - positioned just above the statistics divider line */}
                <AnimatePresence>
                  {showContent && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.6 }}
                      className="flex flex-col sm:flex-row gap-4"
                    >
                      <Link to="/products" className="w-full sm:w-auto">
                        <Button variant="hero" size="lg" className="group w-full sm:w-auto h-10 md:h-11 bg-primary hover:bg-primary/90 text-white font-bold transition-all shadow-lg hover:shadow-primary/20 hover:-translate-y-0.5">
                          Explore Generator Sets
                          <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
                        </Button>
                      </Link>

                      <Link to="/enquiry" className="w-full sm:w-auto">
                        <Button
                          variant="outline"
                          size="lg"
                          className="w-full sm:w-auto h-10 md:h-11 bg-white text-primary border-white hover:bg-slate-100 hover:text-primary transition-all font-bold shadow-lg"
                        >
                          <FileText size={18} className="mr-2" />
                          Get Quote
                        </Button>
                      </Link>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Metrics Stack */}
                <AnimatePresence>
                  {showContent && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.8 }}
                      className="hidden md:flex items-center gap-8 md:gap-12 pt-8 border-t border-white/10"
                    >
                      <div>
                        <div className="text-3xl md:text-4xl font-bold text-white tracking-tight leading-none drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">60+</div>
                        <div className="text-slate-300 text-xs uppercase tracking-wider font-semibold mt-2">Years</div>
                      </div>
                      <div className="w-px h-8 bg-white/10" />
                      <div>
                        <div className="text-3xl md:text-4xl font-bold text-white tracking-tight leading-none drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">100,000+</div>
                        <div className="text-slate-300 text-xs uppercase tracking-wider font-semibold mt-2">Installations</div>
                      </div>
                      <div className="w-px h-8 bg-white/10" />
                      <div>
                        <div className="text-3xl md:text-4xl font-bold text-white tracking-tight leading-none drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">24/7</div>
                        <div className="text-slate-300 text-xs uppercase tracking-wider font-semibold mt-2">Support</div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

            </div>

            {/* RIGHT SIDE - Empty to let the warehouse generators show through */}
            <div className="hidden lg:block lg:col-span-5" />

          </div>
        </div>
      </div>

      {/* KOEL Badge */}
      <AnimatePresence>
        {showContent && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1 }}
            className="absolute bottom-8 md:bottom-12 right-4 md:right-8 hidden sm:block z-10"
          >
            <div className="bg-slate-900/90 backdrop-blur-md border border-white/15 rounded-lg px-4 py-3 flex items-center gap-3">
              <div className="w-10 h-10 bg-white rounded flex items-center justify-center p-1.5 shadow-sm">
                <img src={kirloskarLogo} alt="Kirloskar" className="w-full h-full object-contain" />
              </div>
              <div>
                <div className="text-[10px] leading-tight font-bold text-slate-400 uppercase tracking-wider">
                  AUTHORIZED GOEM
                </div>
                <div className="text-sm font-extrabold text-white uppercase tracking-wide">
                  OF KOEL
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};