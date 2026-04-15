import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useParams } from 'react-router-dom';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { FloatingButtons } from '@/components/layout/FloatingButtons';
import { BrochureEnquiryModal } from '@/components/layout/BrochureEnquiryModal';
import { Button } from '@/components/ui/button';
import { ArrowRight, Download, CheckCircle, List } from 'lucide-react';
import { getModelWithCategory } from '@/data/productCatalogue';

const ProductModel = () => {
  const { categoryId, modelId } = useParams();
  const [isBrochureModalOpen, setIsBrochureModalOpen] = useState(false);
  
  const data = categoryId && modelId ? getModelWithCategory(categoryId, modelId) : null;
  
  const category = data?.category;
  const model = data?.model;
  
  const displayName = model?.name || modelId?.replace(/-/g, ' ') || 'Product';
  const displayDescription = model?.description || 'High-performance diesel generator set designed for reliable power supply in industrial applications.';
  const displayHighlights = model?.highlights || [];
  const displaySpecs = model?.specifications || [];
  const displayVariants = model?.variants || [];
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
              <div className="aspect-square bg-card border border-border rounded-lg flex items-center justify-center sticky top-28 overflow-hidden p-6 shadow-sm">
                <img 
                  src={displayImage} 
                  alt={displayName}
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    target.parentElement!.innerHTML = `<div class="text-muted-foreground italic">Image Preview</div>`;
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

              {/* Range Breakdown (IF VARIANTS EXIST) */}
              {displayVariants.length > 0 && (
                <div className="bg-muted/30 border border-border rounded-lg p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <List size={20} className="text-primary" />
                    <h2 className="text-lg font-semibold text-foreground">Gensets in this Range</h2>
                  </div>
                  <div className="overflow-hidden rounded-md border border-border bg-background">
                    <table className="w-full text-left text-sm">
                      <thead className="bg-muted text-foreground font-semibold">
                        <tr>
                          <th className="px-4 py-2">Model</th>
                          <th className="px-4 py-2 text-right">Rating</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                        {displayVariants.map((v, i) => (
                          <tr key={i} className="hover:bg-muted/50 transition-colors">
                            <td className="px-4 py-2 text-foreground-muted font-mono">{v.model}</td>
                            <td className="px-4 py-2 text-right font-medium">{v.rating}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

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
                <Button variant="heroOutline" size="lg" onClick={() => setIsBrochureModalOpen(true)}>
                  <Download size={18} className="mr-2" />
                  Download Brochure
                </Button>
              </div>

              {/* Specifications */}
              <div className="card-industrial p-6 rounded-lg bg-card border border-border">
                <h2 className="text-lg font-semibold text-foreground mb-4">Common Specifications</h2>
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
      <BrochureEnquiryModal
        isOpen={isBrochureModalOpen}
        onClose={() => setIsBrochureModalOpen(false)}
        brochureUrl={displayBrochure}
        productName={displayName}
      />
    </div>
  );
};

export default ProductModel;