import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const allSlides = [
  {
    id: 1,
    title: 'Precision Assembly',
    description: 'Expert integration of high-performance alternators and engines',
    image: '/images/showcase1.jpg',
  },
  {
    id: 2,
    title: 'Digital Diagnostics',
    description: 'Advanced smart monitoring and real-time system testing',
    image: '/images/showcase2.jpg',
  },
  {
    id: 3,
    title: 'Scalable Production',
    description: 'Streamlined assembly of acoustic enclosures for rapid deployment',
    image: '/images/showcase3.jpg',
  },
  {
    id: 4,
    title: 'Core Integration',
    description: 'Precision coupling of high-capacity cooling and drive systems',
    image: '/images/showcase4.jpg',
  },
  {
    id: 5,
    title: 'Master Fabrication',
    description: 'Precision welding and assembly of heavy-duty acoustic enclosures',
    image: '/images/showcase5.jpg'
  },
];

export const ImageSlideshow = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [activeSlides, setActiveSlides] = useState(allSlides);

  // 1. Handle Responsive Filtering
  useEffect(() => {
    const handleResize = () => {
      // If mobile (less than 768px), remove ID 5
      if (window.innerWidth < 768) {
        const filtered = allSlides.filter(slide => slide.id !== 5);
        setActiveSlides(filtered);
      } else {
        setActiveSlides(allSlides);
      }
    };

    handleResize(); // Run on mount
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // 2. Safety check: Reset index if it exceeds the new array length after resize
  useEffect(() => {
    if (currentSlide >= activeSlides.length) {
      setCurrentSlide(0);
    }
  }, [activeSlides, currentSlide]);

  // 3. Auto-play Logic
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % activeSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [activeSlides.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % activeSlides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + activeSlides.length) % activeSlides.length);
  };

  // Safeguard against empty array or undefined access during initial render
  if (!activeSlides[currentSlide]) return null;

  return (
    <section className="py-24 bg-background-secondary relative overflow-hidden">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="line-accent" />
            <span className="text-primary font-semibold tracking-wider text-sm uppercase">
              Our Work
            </span>
            <div className="line-accent" />
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Installations
            <span className="text-primary"> Showcase</span>
          </h2>
        </motion.div>

        {/* Slideshow Container */}
        <div className="relative max-w-5xl mx-auto">
          <div className="aspect-[16/9] bg-card border border-border rounded-xl overflow-hidden relative">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeSlides[currentSlide].id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="absolute inset-0"
              >
                <img
                  src={activeSlides[currentSlide].image}
                  alt={activeSlides[currentSlide].title}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                
                {/* Content overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-8">
                  <h3 className="text-2xl font-bold text-white mb-2">
                    {activeSlides[currentSlide].title}
                  </h3>
                  <p className="text-white/80">
                    {activeSlides[currentSlide].description}
                  </p>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Navigation Arrows */}
            <button
              onClick={prevSlide}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-background/80 backdrop-blur-sm border border-border flex items-center justify-center text-foreground hover:bg-card transition-colors z-20"
              aria-label="Previous slide"
            >
              <ChevronLeft size={24} />
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-background/80 backdrop-blur-sm border border-border flex items-center justify-center text-foreground hover:bg-card transition-colors z-20"
              aria-label="Next slide"
            >
              <ChevronRight size={24} />
            </button>
          </div>

          {/* Slide indicators - These now automatically hide the 5th dot on mobile */}
          <div className="flex justify-center gap-2 mt-6">
            {activeSlides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === currentSlide 
                    ? 'w-8 bg-primary' 
                    : 'bg-muted hover:bg-muted-foreground'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};