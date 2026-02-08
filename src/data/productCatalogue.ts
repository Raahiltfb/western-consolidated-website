import { Factory, Zap, Shield, Leaf, Sun, LucideIcon } from 'lucide-react';

export interface ProductModel {
  id: string;
  name: string;
  description: string;
  image: string;
  brochure: string;
  highlights: string[];
  specifications: {
    label: string;
    value: string;
  }[];
}

export interface ProductCategory {
  id: string;
  name: string;
  description: string;
  icon: LucideIcon;
  models: ProductModel[];
}

// Default highlights used for all models
const defaultHighlights = [
  'Advanced noise reduction technology',
  'Fuel-efficient engine design',
  'Robust industrial-grade construction',
  'Easy maintenance access',
  'Digital control panel',
  'Auto start/stop capability',
];

// Default specifications template
const createSpecifications = (powerRating: string, fuel: string = 'Diesel') => [
  { label: 'Power Rating', value: powerRating },
  { label: 'Engine', value: 'KOEL' },
  { label: 'Frequency', value: '50 Hz' },
  { label: 'Voltage', value: '415V / 240V' },
  { label: 'Fuel', value: fuel },
  { label: 'Cooling', value: 'Water Cooled' },
];

export const productCatalogue: ProductCategory[] = [
  {
    id: 'standard-range',
    name: '7.5–750 kVA & HHP',
    description: 'Standard industrial diesel generator sets for diverse applications.',
    icon: Factory,
    models: [
      {
        id: '7-5-25-kva',
        name: '7.5–25 kVA',
        description: 'Compact generators for small-scale applications. Ideal for residential backup, small retail outlets, and light commercial use with reliable power output.',
        image: '/products/standard-range/7-5-25-kva/image.png',
        brochure: '/products/standard-range/7-5-25-kva/brochure.pdf',
        highlights: defaultHighlights,
        specifications: createSpecifications('7.5–25 kVA'),
      },
      {
        id: '30-58-5-kva',
        name: '30–58.5 kVA',
        description: 'Mid-range generators for commercial use. Perfect for medium-sized businesses, offices, and retail establishments requiring consistent power backup.',
        image: '/products/standard-range/30-58-5-kva/image.png',
        brochure: '/products/standard-range/30-58-5-kva/brochure.pdf',
        highlights: defaultHighlights,
        specifications: createSpecifications('30–58.5 kVA'),
      },
      {
        id: 'cpcb-iv-82-5-160-kva',
        name: 'CPCB IV+ 82.5–160 kVA',
        description: 'CPCB IV+ compliant generators meeting the latest emission standards. Environmentally responsible power solutions for industrial applications.',
        image: '/products/standard-range/cpcb-iv-82-5-160-kva/image.png',
        brochure: '/products/standard-range/cpcb-iv-82-5-160-kva/brochure.pdf',
        highlights: defaultHighlights,
        specifications: createSpecifications('82.5–160 kVA'),
      },
      {
        id: '200-250-kva',
        name: '200–250 kVA',
        description: 'High-capacity industrial generators designed for demanding applications. Reliable power for manufacturing facilities and large commercial establishments.',
        image: '/products/standard-range/200-250-kva/image.png',
        brochure: '/products/standard-range/200-250-kva/brochure.pdf',
        highlights: defaultHighlights,
        specifications: createSpecifications('200–250 kVA'),
      },
      {
        id: '320-750-kva',
        name: '320–750 kVA',
        description: 'Heavy-duty industrial power solutions for large-scale operations. Engineered for continuous duty cycles and critical infrastructure applications.',
        image: '/products/standard-range/320-750-kva/image.png',
        brochure: '/products/standard-range/320-750-kva/brochure.pdf',
        highlights: defaultHighlights,
        specifications: createSpecifications('320–750 kVA'),
      },
      {
        id: '1010-1500-kva',
        name: '1010–1500 kVA',
        description: 'Ultra-high capacity generators for mission-critical power requirements. Designed for data centers, hospitals, and large industrial complexes.',
        image: '/products/standard-range/1010-1500-kva/image.png',
        brochure: '/products/standard-range/1010-1500-kva/brochure.pdf',
        highlights: defaultHighlights,
        specifications: createSpecifications('1010–1500 kVA'),
      },
      {
        id: 'hd-200-625-kva',
        name: 'HD 200–625 kVA',
        description: 'Heavy-duty series generators built for extreme conditions. Enhanced durability and performance for mining, construction, and heavy industrial applications.',
        image: '/products/standard-range/hd-200-625-kva/image.png',
        brochure: '/products/standard-range/hd-200-625-kva/brochure.pdf',
        highlights: defaultHighlights,
        specifications: createSpecifications('200–625 kVA'),
      },
    ],
  },
  {
    id: 'hybrid',
    name: 'Hybrid Series',
    description: 'Advanced hybrid power solutions combining efficiency with sustainability.',
    icon: Zap,
    models: [
      {
        id: 'hybrid-series',
        name: 'Hybrid Series',
        description: 'Advanced hybrid power solutions combining diesel efficiency with renewable energy integration. Reduced fuel consumption and lower emissions for sustainable operations.',
        image: '/products/hybrid/hybrid-series/image.png',
        brochure: '/products/hybrid/hybrid-series/brochure.pdf',
        highlights: [
          'Integrated solar/battery hybrid system',
          'Intelligent load management',
          'Up to 40% fuel savings',
          'Reduced carbon footprint',
          'Smart energy switching',
          'Remote monitoring capability',
        ],
        specifications: createSpecifications('Variable'),
      },
    ],
  },
  {
    id: 'optiprime',
    name: 'Optiprime Series',
    description: 'Premium optimized generators for maximum performance and reliability.',
    icon: Shield,
    models: [
      {
        id: 'optiprime-series',
        name: 'Optiprime Series',
        description: 'Premium optimized generators engineered for maximum performance and exceptional reliability. Industry-leading efficiency with advanced control systems.',
        image: '/products/optiprime/optiprime-series/image.png',
        brochure: '/products/optiprime/optiprime-series/brochure.pdf',
        highlights: [
          'Optimized engine performance',
          'Premium alternator design',
          'Advanced acoustic enclosure',
          'Extended service intervals',
          'Smart diagnostics system',
          'Industry-leading warranty',
        ],
        specifications: createSpecifications('Various capacities'),
      },
    ],
  },
  {
    id: 'png-range',
    name: 'PNG Range',
    description: 'Natural gas powered generators for cleaner industrial operations.',
    icon: Leaf,
    models: [
      {
        id: 'natural-gas-15-500',
        name: 'Natural Gas 15–500 kVA',
        description: 'Natural gas generators ranging from 15 to 500 kVA. Cleaner emissions and lower operating costs compared to diesel alternatives.',
        image: '/products/png-range/natural-gas-15-500/image.png',
        brochure: '/products/png-range/natural-gas-15-500/brochure.pdf',
        highlights: [
          'Piped natural gas compatible',
          'Ultra-low emissions',
          'Reduced operating costs',
          'Quieter operation',
          'CPCB IV+ compliant',
          'Continuous duty rated',
        ],
        specifications: createSpecifications('15–500 kVA', 'Natural Gas'),
      },
      {
        id: 'natural-gas-250',
        name: 'Natural Gas 250 kVA',
        description: 'Specialized 250 kVA natural gas unit optimized for medium-scale industrial and commercial applications. Reliable, clean, and cost-effective power.',
        image: '/products/png-range/natural-gas-250/image.png',
        brochure: '/products/png-range/natural-gas-250/brochure.pdf',
        highlights: [
          'Dedicated 250 kVA output',
          'High efficiency gas engine',
          'Minimal environmental impact',
          'Lower fuel costs',
          'Suitable for continuous use',
          'Advanced emission control',
        ],
        specifications: createSpecifications('250 kVA', 'Natural Gas'),
      },
    ],
  },
  {
    id: 'sentinel',
    name: 'Sentinel Range',
    description: 'Heavy-duty sentinel series for critical infrastructure applications.',
    icon: Sun,
    models: [
      {
        id: 'sentinel-series',
        name: 'Sentinel Series',
        description: 'Heavy-duty sentinel generators designed for critical infrastructure and mission-critical applications. Maximum reliability and uptime for essential services.',
        image: '/products/sentinel/sentinel-series/image.png',
        brochure: '/products/sentinel/sentinel-series/brochure.pdf',
        highlights: [
          'Mission-critical reliability',
          'Redundant safety systems',
          '24/7 continuous operation',
          'Extended autonomy options',
          'Remote monitoring & control',
          'Rapid response support',
        ],
        specifications: createSpecifications('Various capacities'),
      },
    ],
  },
];

// Helper function to find a category by ID
export const getCategoryById = (categoryId: string): ProductCategory | undefined => {
  return productCatalogue.find(cat => cat.id === categoryId);
};

// Helper function to find a model by category and model ID
export const getModelById = (categoryId: string, modelId: string): ProductModel | undefined => {
  const category = getCategoryById(categoryId);
  return category?.models.find(model => model.id === modelId);
};

// Helper function to get category with its icon for the model
export const getModelWithCategory = (categoryId: string, modelId: string) => {
  const category = getCategoryById(categoryId);
  const model = category?.models.find(m => m.id === modelId);
  
  if (!category || !model) return null;
  
  return {
    category,
    model,
  };
};
