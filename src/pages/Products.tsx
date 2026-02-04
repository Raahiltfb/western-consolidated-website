import { motion } from 'framer-motion';
import { Link, useParams } from 'react-router-dom';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { FloatingButtons } from '@/components/layout/FloatingButtons';
import { ArrowRight, Factory, Zap, Shield, Leaf, Sun } from 'lucide-react';

const productCategories = [
  {
    id: 'standard-range',
    name: '7.5–750 kVA & HHP',
    description: 'Standard industrial diesel generator sets for diverse applications.',
    icon: Factory,
    subcategories: [
      { id: '7-5-25-kva', name: '7.5–25 kVA', description: 'Compact generators for small-scale applications.' },
      { id: '30-58-5-kva', name: '30–58.5 kVA', description: 'Mid-range generators for commercial use.' },
      { id: 'cpcb-iv-82-5-160-kva', name: 'CPCB IV+ 82.5–160 kVA', description: 'CPCB IV+ compliant generators.' },
      { id: '200-250-kva', name: '200–250 kVA', description: 'High-capacity industrial generators.' },
      { id: '320-750-kva', name: '320–750 kVA', description: 'Heavy-duty industrial power solutions.' },
      { id: '1010-1500-kva', name: '1010–1500 kVA', description: 'Ultra-high capacity generators.' },
      { id: 'hd-200-625-kva', name: 'HD 200–625 kVA', description: 'Heavy-duty series generators.' },
    ],
  },
  {
    id: 'hybrid',
    name: 'Hybrid Series',
    description: 'Advanced hybrid power solutions combining efficiency with sustainability.',
    icon: Zap,
    subcategories: [
      { id: 'hybrid-series', name: 'Hybrid Series', description: 'Advanced hybrid power solutions.' },
    ],
  },
  {
    id: 'optiprime',
    name: 'Optiprime Series',
    description: 'Premium optimized generators for maximum performance and reliability.',
    icon: Shield,
    subcategories: [
      { id: 'optiprime-series', name: 'Optiprime Series', description: 'Optimized performance generators.' },
    ],
  },
  {
    id: 'png-range',
    name: 'PNG Range',
    description: 'Natural gas powered generators for cleaner industrial operations.',
    icon: Leaf,
    subcategories: [
      { id: 'natural-gas-15-500', name: 'Natural Gas 15–500', description: 'Natural gas generators 15-500 kVA.' },
      { id: 'natural-gas-250', name: 'Natural Gas 250', description: 'Specialized 250 kVA natural gas unit.' },
    ],
  },
  {
    id: 'sentinel',
    name: 'Sentinel Range',
    description: 'Heavy-duty sentinel series for critical infrastructure applications.',
    icon: Sun,
    subcategories: [
      { id: 'sentinel-series', name: 'Sentinel Series', description: 'Heavy-duty sentinel generators.' },
    ],
  },
];

const Products = () => {
  const { categoryId } = useParams();
  const category = categoryId ? productCategories.find(c => c.id === categoryId) : null;

  if (category) {
    return <ProductCategory category={category} />;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar isVisible={true} />
      
      {/* Hero */}
      <section className="pt-32 pb-20 bg-background relative">
        <div className="container mx-auto px-4 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="line-accent" />
              <span className="text-primary font-semibold tracking-wider text-sm uppercase">
                Our Products
              </span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6">
              Power Solutions
              <br />
              <span className="text-primary">For Every Need</span>
            </h1>
            <p className="text-foreground-muted text-lg leading-relaxed">
              From compact 7.5 kVA units to powerful 1500 kVA generators, 
              explore our comprehensive range of diesel and natural gas power solutions.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="py-20 bg-background-secondary">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {productCategories.map((cat, index) => (
              <motion.div
                key={cat.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Link 
                  to={`/products/${cat.id}`}
                  className="block card-industrial p-8 rounded-lg group h-full"
                >
                  <div className="flex items-start justify-between mb-6">
                    <div className="w-14 h-14 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                      <cat.icon className="w-7 h-7 text-primary" />
                    </div>
                    <ArrowRight className="w-5 h-5 text-foreground-muted group-hover:text-primary group-hover:translate-x-1 transition-all" />
                  </div>
                  
                  <h3 className="text-xl font-semibold text-foreground mb-3 group-hover:text-primary transition-colors">
                    {cat.name}
                  </h3>
                  
                  <p className="text-foreground-muted text-sm leading-relaxed mb-4">
                    {cat.description}
                  </p>
                  
                  <div className="text-sm text-primary">
                    {cat.subcategories.length} model{cat.subcategories.length > 1 ? 's' : ''}
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
      <FloatingButtons />
    </div>
  );
};

interface ProductCategoryProps {
  category: typeof productCategories[0];
}

const ProductCategory = ({ category }: ProductCategoryProps) => {
  const Icon = category.icon;
  
  return (
    <div className="min-h-screen bg-background">
      <Navbar isVisible={true} />
      
      {/* Hero */}
      <section className="pt-32 pb-20 bg-background relative">
        <div className="container mx-auto px-4 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Link to="/products" className="text-foreground-muted hover:text-primary transition-colors text-sm mb-4 inline-block">
              ← Back to Products
            </Link>
            
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 rounded-lg bg-primary/10 flex items-center justify-center">
                <Icon className="w-8 h-8 text-primary" />
              </div>
              <div>
                <h1 className="text-4xl md:text-5xl font-bold text-foreground">
                  {category.name}
                </h1>
              </div>
            </div>
            <p className="text-foreground-muted text-lg leading-relaxed max-w-2xl">
              {category.description}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Models Grid */}
      <section className="py-20 bg-background-secondary">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {category.subcategories.map((model, index) => (
              <motion.div
                key={model.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Link 
                  to={`/products/${category.id}/${model.id}`}
                  className="block card-industrial rounded-lg overflow-hidden group h-full"
                >
                  {/* Image placeholder */}
                  <div className="aspect-video bg-card flex items-center justify-center border-b border-border">
                    <div className="text-center p-4">
                      <div className="w-12 h-12 mx-auto mb-2 rounded-full bg-muted flex items-center justify-center">
                        <svg className="w-6 h-6 text-foreground-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <p className="text-foreground-muted text-sm">Product Image</p>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                      {model.name}
                    </h3>
                    <p className="text-foreground-muted text-sm mb-4">
                      {model.description}
                    </p>
                    <div className="flex items-center text-primary text-sm font-medium">
                      View Details
                      <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
      <FloatingButtons />
    </div>
  );
};

export default Products;
