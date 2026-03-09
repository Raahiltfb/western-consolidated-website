import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useParams } from 'react-router-dom';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { FloatingButtons } from '@/components/layout/FloatingButtons';
import { BrochureEnquiryModal } from '@/components/layout/BrochureEnquiryModal';
import { Button } from '@/components/ui/button';
import { ArrowRight, Download, CheckCircle } from 'lucide-react';
import { getModelWithCategory } from '@/data/productCatalogue';

const ProductModel = () => {
  const { categoryId, modelId } = useParams();
  
  const data = categoryId && modelId ? getModelWithCategory(categoryId, modelId) : null;
  
  // Fallback data if model not found
  const category = data?.category;
  const model = data?.model;
  
  const displayName = model?.name || modelId?.replace(/-/g, ' ') || 'Product';
  const displayDescription = model?.description || 'High-performance diesel generator set designed for reliable power supply in industrial applications. Built with precision engineering and manufactured to meet the highest quality standards.';
  const displayHighlights = model?.highlights || [
    'Advanced noise reduction technology',
    'Fuel-efficient engine design',
    'Robust industrial-grade construction',
    'Easy maintenance access',
    'Digital control panel',
    'Auto start/stop capability',
  ];
  const displaySpecs = model?.specifications || [
    { label: 'Power Rating', value: 'As per model' },
    { label: 'Engine', value: 'KOEL' },
    { label: 'Frequency', value: '50 Hz' },
    { label: 'Voltage', value: '415V / 240V' },
    { label: 'Fuel', value: 'Diesel' },
    { label: 'Cooling', value: 'Water Cooled' },
  ];
  const displayImage = model?.image || '/placeholder.svg';
  const displayBrochure = model?.brochure || '#';
  const displayCategoryName = category?.name || categoryId?.replace(/-/g, ' ') || 'Category';

  return (
    <div className="min-h-screen bg-background">
      <Navbar isVisible={true} />
      
      {/* Breadcrumb */}
      <section className="pt-28 pb-4 bg-background">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex items-center gap-2 text-sm text-foreground-muted">
            <Link to="/products" className="hover:text-primary transition-colors">Products</Link>
            <span>/</span>
            <Link to={`/products/${categoryId}`} className="hover:text-primary transition-colors">
              {displayCategoryName}
            </Link>
            <span>/</span>
            <span className="text-foreground">{displayName}</span>
          </div>
        </div>
      </section>

      {/* Product Details */}
      <section className="py-12 bg-background">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Image */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="aspect-square bg-card border border-border rounded-lg flex items-center justify-center sticky top-28 overflow-hidden p-6">
                <img 
                  src={displayImage} 
                  alt={displayName}
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    // Fallback to placeholder on error
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    target.parentElement!.innerHTML = `
                      <div class="text-center p-8">
                        <div class="w-24 h-24 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
                          <svg class="w-12 h-12 text-foreground-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                        <p class="text-foreground-muted">Product Image</p>
                        <p class="text-muted-foreground text-sm">Placeholder</p>
                      </div>
                    `;
                  }}
                />
              </div>
            </motion.div>

            {/* Details */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-8"
            >
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <div className="line-accent" />
                  <span className="text-primary font-semibold tracking-wider text-sm uppercase">
                    {displayCategoryName}
                  </span>
                </div>
                <h1 className="text-4xl font-bold text-foreground mb-4">
                  {displayName}
                </h1>
                <p className="text-foreground-muted text-lg leading-relaxed">
                  {displayDescription}
                </p>
              </div>

              {/* Key Highlights */}
              <div>
                <h2 className="text-xl font-semibold text-foreground mb-4">Key Highlights</h2>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {displayHighlights.map((highlight) => (
                    <li key={highlight} className="flex items-center gap-3 text-foreground-muted">
                      <CheckCircle className="w-5 h-5 text-primary shrink-0" />
                      <span className="text-sm">{highlight}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* CTAs */}
              <div className="flex flex-wrap gap-4 pt-4">
                <Link to="/enquiry">
                  <Button variant="hero" size="lg" className="group">
                    Get Quote
                    <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <a href={displayBrochure} download>
                  <Button variant="heroOutline" size="lg">
                    <Download size={18} className="mr-2" />
                    Download Brochure
                  </Button>
                </a>
              </div>

              {/* Specifications */}
              <div className="card-industrial p-6 rounded-lg">
                <h2 className="text-lg font-semibold text-foreground mb-4">Specifications</h2>
                <div className="space-y-3">
                  {displaySpecs.map((spec) => (
                    <div key={spec.label} className="flex justify-between items-center py-2 border-b border-border last:border-0">
                      <span className="text-foreground-muted">{spec.label}</span>
                      <span className="text-foreground font-medium">{spec.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <Footer />
      <FloatingButtons />
    </div>
  );
};

export default ProductModel;
