import { motion } from 'framer-motion';
import { Link, useParams } from 'react-router-dom';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { FloatingButtons } from '@/components/layout/FloatingButtons';
import { ArrowRight } from 'lucide-react';
import { productCatalogue, getCategoryById, ProductCategory } from '@/data/productCatalogue';

const Products = () => {
  const { categoryId } = useParams();
  const category = categoryId ? getCategoryById(categoryId) : null;

  if (category) {
    return <ProductCategoryView category={category} />;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar isVisible={true} />
      
      {/* Hero */}
      <section className="pt-32 pb-20 bg-background relative overflow-hidden">
        {/* Desktop Background */}
        <div className="absolute top-0 right-0 bottom-0 w-[100%] z-0 hidden md:block">
          <div 
            className="absolute inset-0 z-0 opacity-100 dark:opacity-70 transition-opacity duration-500"
            style={{
              backgroundImage: 'url("/images/product-bg.jpg")',
              backgroundSize: 'cover',
              backgroundPosition: 'center right',
              maskImage: 'linear-gradient(to right, transparent, black 40%)',
              WebkitMaskImage: 'linear-gradient(to right, transparent, black 40%)'
            }}
          />
          {/* Max Brightness Reduction: Solid overlays */}
          <div className="absolute inset-0 bg-white/10 dark:bg-black/70 z-10" />
        </div>

        {/* Mobile background (stays full width for small screens) */}
        <div className="absolute inset-0 z-0 md:hidden opacity-10">
           <div 
            className="absolute inset-0 brightness-[0.3]"
            style={{
              backgroundImage: 'url("/images/product-bg.jpg")',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          />
        </div>

        <div className="container mx-auto px-4 lg:px-8 relative z-20">
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
            {/* Added drop-shadow and backdrop-blur for maximum legibility */}
            <p className="text-foreground-muted text<-lg leading-relaxed max-w-2xl font-medium dark:font-normal drop-shadow-sm p-2 -ml-2 rounded-lg">
              From compact 7.5 kVA units to powerful<br></br> 1500 kVA generators,<br></br> 
              explore our comprehensive range of diesel<br></br> and natural gas power solutions.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="py-20 bg-background-secondary">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {productCatalogue.map((cat, index) => (
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
                    {cat.models.length} model{cat.models.length > 1 ? 's' : ''}
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

interface ProductCategoryViewProps {
  category: ProductCategory;
}

const ProductCategoryView = ({ category }: ProductCategoryViewProps) => {
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
            {category.models.map((model, index) => (
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
                  <div className="aspect-video bg-card flex items-center justify-center border-b border-border overflow-hidden p-4">
                    <img 
                      src={model.image} 
                      alt={model.name}
                      className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        target.parentElement!.innerHTML = `
                          <div class="text-center p-4">
                            <div class="w-12 h-12 mx-auto mb-2 rounded-full bg-muted flex items-center justify-center">
                              <svg class="w-6 h-6 text-foreground-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                            </div>
                            <p class="text-foreground-muted text-sm">Product Image</p>
                          </div>
                        `;
                      }}
                    />
                  </div>
                  
                  <div className="p-6">
                    <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                      {model.name}
                    </h3>
                    <p className="text-foreground-muted text-sm mb-4 line-clamp-2">
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
