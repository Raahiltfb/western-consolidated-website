import { motion } from 'framer-motion';
import { Link, useParams } from 'react-router-dom';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { FloatingButtons } from '@/components/layout/FloatingButtons';
import { Button } from '@/components/ui/button';
import { ArrowRight, Download, CheckCircle } from 'lucide-react';
import { productCatalogue } from '@/lib/productCatalogue';

const ProductModel = () => {
  const { categoryId, modelId } = useParams();

  const currentCategory = productCatalogue.categories.find(
    (category) => category.id === categoryId
  );

  const currentModel = currentCategory?.models.find(
    (model) => model.id === modelId
  );

  // Guard: invalid category or model
  if (!currentCategory || !currentModel) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-foreground-muted text-lg">Product not found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar isVisible={true} />

      {/* Breadcrumb */}
      <section className="pt-28 pb-4 bg-background">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex items-center gap-2 text-sm text-foreground-muted">
            <Link to="/products" className="hover:text-primary transition-colors">
              Products
            </Link>
            <span>/</span>
            <Link
              to={`/products/${currentCategory.id}`}
              className="hover:text-primary transition-colors"
            >
              {currentCategory.name}
            </Link>
            <span>/</span>
            <span className="text-foreground">{currentModel.name}</span>
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
              <div className="aspect-square bg-card border border-border rounded-lg flex items-center justify-center sticky top-28">
                <img
                  src={currentModel.images[0]}
                  alt={currentModel.name}
                  className="w-full h-full object-contain p-6"
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
                    {currentCategory.name}
                  </span>
                </div>
                <h1 className="text-4xl font-bold text-foreground mb-4">
                  {currentModel.name}
                </h1>
                <p className="text-foreground-muted text-lg leading-relaxed">
                  High-performance generator set designed for reliable power supply
                  in industrial and commercial applications. Built with precision
                  engineering and manufactured to meet stringent quality standards.
                </p>
              </div>

              {/* Key Highlights */}
              <div>
                <h2 className="text-xl font-semibold text-foreground mb-4">
                  Key Highlights
                </h2>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {currentModel.highlights.map((highlight) => (
                    <li
                      key={highlight}
                      className="flex items-center gap-3 text-foreground-muted"
                    >
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
                    <ArrowRight
                      size={18}
                      className="ml-2 group-hover:translate-x-1 transition-transform"
                    />
                  </Button>
                </Link>

                <a
                  href={currentModel.brochure}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button variant="heroOutline" size="lg">
                    <Download size={18} className="mr-2" />
                    Download Brochure
                  </Button>
                </a>
              </div>

              {/* Specifications */}
              <div className="card-industrial p-6 rounded-lg">
                <h2 className="text-lg font-semibold text-foreground mb-4">
                  Specifications
                </h2>
                <div className="space-y-3">
                  {[
                    {
                      label: 'Power Rating',
                      value: currentModel.specs.powerRating,
                    },
                    { label: 'Engine', value: currentModel.specs.engine },
                    { label: 'Frequency', value: currentModel.specs.frequency },
                    { label: 'Voltage', value: currentModel.specs.voltage },
                    { label: 'Fuel', value: currentModel.specs.fuel },
                    { label: 'Cooling', value: currentModel.specs.cooling },
                  ].map((spec) => (
                    <div
                      key={spec.label}
                      className="flex justify-between items-center py-2 border-b border-border last:border-0"
                    >
                      <span className="text-foreground-muted">
                        {spec.label}
                      </span>
                      <span className="text-foreground font-medium">
                        {spec.value}
                      </span>
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
