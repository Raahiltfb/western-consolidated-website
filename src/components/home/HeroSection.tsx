import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import kirloskarLogo from '@/assets/kirloskar-logo.png';
import optiprimeImage1 from '@/assets/optiprimeback1.png';

interface HeroSectionProps {
  onAnimationComplete: () => void;
}

export const HeroSection = ({ onAnimationComplete }: HeroSectionProps) => {
  const [animationPhase, setAnimationPhase] = useState<'intro' | 'main' | 'complete'>('intro');
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    const introTimer = setTimeout(() => {
      setAnimationPhase('main');
    }, 1500);

    const mainTimer = setTimeout(() => {
      setShowContent(true);
    }, 2000);

    const completeTimer = setTimeout(() => {
      setAnimationPhase('complete');
      onAnimationComplete();
    }, 3500);

    return () => {
      clearTimeout(introTimer);
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

  useEffect(() => {
    if (animationPhase === 'complete') {
      const scrollTimer = setTimeout(scrollToNext, 500);
      return () => clearTimeout(scrollTimer);
    }
  }, [animationPhase, scrollToNext]);

  return (
    <section className="relative min-h-screen flex items-center hero-gradient overflow-hidden">
      <div className="lighting-effect" />
      <div className="absolute inset-0 grid-overlay opacity-20" />
      
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-primary/30 rounded-full"
            initial={{ 
              x: Math.random() * window.innerWidth, 
              y: Math.random() * window.innerHeight,
              opacity: 0 
            }}
            animate={{ 
              y: [null, Math.random() * -200],
              opacity: [0, 0.5, 0]
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2
            }}
          />
        ))}
      </div>

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <AnimatePresence>
              {showContent && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6 }}
                  className="flex items-center gap-3"
                >
                  <div className="line-accent" />
                  <span className="text-primary font-semibold tracking-wider text-sm uppercase">
                    KOEL Authorized Manufacturer
                  </span>
                </motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence>
              {showContent && (
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                >
                  <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight">
                    <span className="text-foreground">Extensive</span>
                    <br />
                    <span className="text-primary">Power</span>
                    <br />
                    <span className="text-foreground">Solutions</span>
                  </h1>
                </motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence>
              {showContent && (
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                  className="text-foreground-muted text-lg max-w-lg leading-relaxed"
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
                  className="flex flex-wrap gap-4"
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
                  className="flex items-center gap-8 pt-8 border-t border-border"
                >
                  <div>
                    <div className="text-4xl font-bold text-foreground">60+</div>
                    <div className="text-foreground-muted text-sm">Years Engineering</div>
                  </div>
                  <div className="stat-divider" />
                  <div>
                    <div className="text-4xl font-bold text-foreground">5000+</div>
                    <div className="text-foreground-muted text-sm">Installations</div>
                  </div>
                  <div className="stat-divider" />
                  <div>
                    <div className="text-4xl font-bold text-foreground">24/7</div>
                    <div className="text-foreground-muted text-sm">Support</div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Right - Hero Image (MODIFIED HERE) */}
          <AnimatePresence>
            {showContent && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95, x: 50 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                transition={{ duration: 1, delay: 0.3 }}
                className="relative hidden lg:block"
              >
                <div className="relative aspect-square max-w-lg mx-auto">
                  {/* Glow effect behind image */}
                  <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full" />
                  
                  {/* Actual Product Image */}
                  <div className="relative z-10 aspect-square overflow-hidden flex items-center justify-center">
                    <img 
                      src={optiprimeImage1} 
                      alt="Kirloskar Optiprime Generator" 
                      className="w-full h-full object-contain drop-shadow-2xl"
                    />
                  </div>
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
              className="w-6 h-10 border-2 border-foreground-muted rounded-full flex items-start justify-center p-2"
            >
              <div className="w-1.5 h-3 bg-foreground-muted rounded-full" />
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
            className="absolute bottom-8 right-8 hidden lg:block"
          >
            <div className="bg-secondary/90 dark:bg-secondary/80 backdrop-blur-sm border border-border rounded-lg px-4 py-3 flex items-center gap-3 shadow-sm">
              <div className="w-10 h-10 bg-white rounded flex items-center justify-center p-1.5">
                <img src={kirloskarLogo} alt="Kirloskar" className="w-full h-full object-contain" />
              </div>
              <div>
                <div className="text-[10px] leading-tight font-medium text-white uppercase">
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
