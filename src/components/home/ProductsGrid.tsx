import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { productCatalogue } from '@/data/productCatalogue';

export const ProductsGrid = () => {
  return (
    <section className="py-24 bg-background relative">
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
              Our Products
            </span>
            <div className="line-accent" />
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Power Solutions for
            <br />
            <span className="text-primary">Every Industry</span>
          </h2>
          
          <p className="text-foreground-muted text-lg">
            From standard industrial generators to advanced hybrid systems, 
            we offer comprehensive power solutions tailored to your needs.
          </p>
        </motion.div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {productCatalogue.map((category, index) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Link 
                to={`/products/${category.id}`}
                className="block card-industrial p-8 rounded-lg group h-full"
              >
                <div className="flex items-start justify-between mb-6">
                  <div className="w-14 h-14 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <category.icon className="w-7 h-7 text-primary" />
                  </div>
                  <ArrowRight className="w-5 h-5 text-foreground-muted group-hover:text-primary group-hover:translate-x-1 transition-all" />
                </div>
                
                <h3 className="text-xl font-semibold text-foreground mb-3 group-hover:text-primary transition-colors">
                  {category.name}
                </h3>
                
                <p className="text-foreground-muted text-sm leading-relaxed">
                  {category.description}
                </p>
              </Link>
            </motion.div>
          ))}
          
          {/* View All Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <Link 
              to="/products"
              className="block h-full border-2 border-dashed border-border hover:border-primary rounded-lg p-8 flex flex-col items-center justify-center text-center group transition-colors"
            >
              <div className="w-14 h-14 rounded-full border-2 border-border group-hover:border-primary flex items-center justify-center mb-4 transition-colors">
                <ArrowRight className="w-6 h-6 text-foreground-muted group-hover:text-primary transition-colors" />
              </div>
              <span className="text-foreground font-semibold group-hover:text-primary transition-colors">
                View All Products
              </span>
              <span className="text-foreground-muted text-sm mt-1">
                Explore complete range
              </span>
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
