import { useState, useCallback } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { FloatingButtons } from '@/components/layout/FloatingButtons';
import { HeroSection } from '@/components/home/HeroSection';
import { LegacySection } from '@/components/home/LegacySection';
import { ProductsGrid } from '@/components/home/ProductsGrid';
import { ImageSlideshow } from '@/components/home/ImageSlideshow';
import { VideoSection } from '@/components/home/VideoSection';
import { ClientsSection } from '@/components/home/ClientsSection';
import { CTASection } from '@/components/home/CTASection';
import { CertificationsSection } from '@/components/home/CertificationsSection';

const Index = () => {
  const [navbarVisible, setNavbarVisible] = useState(false);

  const handleAnimationComplete = useCallback(() => {
    setNavbarVisible(true);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navbar isVisible={navbarVisible} />
      <HeroSection onAnimationComplete={handleAnimationComplete} />
      <LegacySection />
      <ProductsGrid />
      <ImageSlideshow />
      <VideoSection />
      <ClientsSection />
      <CertificationsSection />
      <CTASection />
      <Footer />
      <FloatingButtons />
    </div>
  );
};

export default Index;
