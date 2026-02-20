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

const defaultHighlights = [
  'Advanced noise reduction technology',
  'Fuel-efficient engine design',
  'Robust industrial-grade construction',
  'Easy maintenance access',
  'Digital control panel',
  'Auto start/stop capability',
];

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
    description: 'Industrial diesel generator sets for diverse applications.',
    icon: Factory,
    models: [
      {
        id: '7-5-25-kva',
        name: '7.5–25 kVA',
        description: 'Compact generators for residential and light commercial use.',
        image: '/products/standard-range/7-5-25-kva/image.png',
        brochure: '/products/standard-range/7-5-25-kva/brochure.pdf',
        highlights: defaultHighlights,
        specifications: createSpecifications('7.5–25 kVA'),
      },
      {
        id: '30-58-5-kva',
        name: '30–58.5 kVA',
        description: 'Mid-range generators for offices and retail establishments.',
        image: '/products/standard-range/30-58-5-kva/image.png',
        brochure: '/products/standard-range/30-58-5-kva/brochure.pdf',
        highlights: defaultHighlights,
        specifications: createSpecifications('30–58.5 kVA'),
      },
      {
        id: 'cpcb-iv-82-5-160-kva',
        name: 'CPCB IV+ 82.5–160 kVA',
        description: 'CPCB IV+ compliant industrial generators.',
        image: '/products/standard-range/cpcb-iv-82-5-160-kva/image.png',
        brochure: '/products/standard-range/cpcb-iv-82-5-160-kva/brochure.pdf',
        highlights: defaultHighlights,
        specifications: createSpecifications('82.5–160 kVA'),
      },
      {
        id: '200-250-kva',
        name: '200–250 kVA',
        description: 'High-capacity generators for demanding applications.',
        image: '/products/standard-range/200-250-kva/image.png',
        brochure: '/products/standard-range/200-250-kva/brochure.pdf',
        highlights: defaultHighlights,
        specifications: createSpecifications('200–250 kVA'),
      },
      {
        id: 'hd-200-625-kva',
        name: 'HD 200–625 kVA',
        description: 'Heavy-duty generators for extreme industrial environments.',
        image: '/products/standard-range/hd-200-625-kva/image.png',
        brochure: '/products/standard-range/hd-200-625-kva/brochure.pdf',
        highlights: defaultHighlights,
        specifications: createSpecifications('200–625 kVA'),
      },
      {
        id: '320-750-kva',
        name: '320–750 kVA',
        description: 'Heavy-duty power solutions for large-scale operations.',
        image: '/products/standard-range/320-750-kva/image.png',
        brochure: '/products/standard-range/320-750-kva/brochure.pdf',
        highlights: defaultHighlights,
        specifications: createSpecifications('320–750 kVA'),
      },
      {
        id: '1010-1500-kva',
        name: '1010–1500 kVA',
        description: 'Ultra-high capacity generators for mission-critical use.',
        image: '/products/standard-range/1010-1500-kva/image.png',
        brochure: '/products/standard-range/1010-1500-kva/brochure.pdf',
        highlights: defaultHighlights,
        specifications: createSpecifications('1010–1500 kVA'),
      },
    ],
  },
  {
    id: 'hybrid',
    name: 'Hybrid Series',
    description: 'Hybrid power solutions for fuel efficiency.',
    icon: Zap,
    models: [
      {
        id: 'hybrid-series',
        name: 'Hybrid Series',
        description: 'Diesel + renewable hybrid power solutions.',
        image: '/products/hybrid/hybrid-series/image.png',
        brochure: '/products/hybrid/hybrid-series/brochure.pdf',
        highlights: [
          'Integrated hybrid control',
          'Reduced fuel consumption',
          'Lower emissions',
          'Smart energy switching',
          'Remote monitoring',
          'Sustainable operation',
        ],
        specifications: createSpecifications('Variable'),
      },
    ],
  },
  {
    id: 'optiprime',
    name: 'Optiprime Series',
    description: 'Premium optimized generators.',
    icon: Shield,
    models: [
      {
        id: 'optiprime-series',
        name: 'Optiprime Series',
        description: 'High-performance premium generator series.',
        image: '/products/optiprime/optiprime-series/image.png',
        brochure: '/products/optiprime/optiprime-series/brochure.pdf',
        highlights: [
          'Optimized performance',
          'Advanced diagnostics',
          'Premium enclosure',
          'Extended service intervals',
          'High efficiency',
          'Reliable operation',
        ],
        specifications: createSpecifications('Various capacities'),
      },
    ],
  },
  {
    id: 'png-range',
    name: 'PNG Range',
    description: 'Natural gas generator solutions.',
    icon: Leaf,
    models: [
      {
        id: 'natural-gas-15-500',
        name: 'Natural Gas 15–500 kVA',
        description: 'Clean and efficient natural gas generators.',
        image: '/products/png-range/natural-gas-15-500/image.png',
        brochure: '/products/png-range/natural-gas-15-500/brochure.pdf',
        highlights: [
          'Low emissions',
          'Reduced operating costs',
          'Quiet operation',
          'Continuous duty rated',
          'CPCB compliant',
          'Gas optimized engine',
        ],
        specifications: createSpecifications('15–500 kVA', 'Natural Gas'),
      },
      {
        id: 'natural-gas-250',
        name: 'Natural Gas 250 kVA',
        description: 'Dedicated 250 kVA natural gas genset.',
        image: '/products/png-range/natural-gas-250/image.png',
        brochure: '/products/png-range/natural-gas-250/brochure.pdf',
        highlights: defaultHighlights,
        specifications: createSpecifications('250 kVA', 'Natural Gas'),
      },
    ],
  },
  {
    id: 'sentinel',
    name: 'Sentinel Range',
    description: 'Mission-critical power solutions.',
    icon: Sun,
    models: [
      {
        id: 'sentinel-series',
        name: 'Sentinel Series',
        description: 'High-reliability generators for critical infrastructure.',
        image: '/products/sentinel/sentinel-series/image.png',
        brochure: '/products/sentinel/sentinel-series/brochure.pdf',
        highlights: [
          '24/7 continuous operation',
          'Redundant systems',
          'Remote monitoring',
          'Rapid service support',
          'High autonomy',
          'Mission-critical reliability',
        ],
        specifications: createSpecifications('Various capacities'),
      },
    ],
  },
];


// Helper function to find a category by ID
export const getCategoryById = (
  categoryId: string
): ProductCategory | undefined => {
  return productCatalogue.find((cat) => cat.id === categoryId);
};

// Helper function to find a model by category and model ID
export const getModelById = (
  categoryId: string,
  modelId: string
): ProductModel | undefined => {
  const category = getCategoryById(categoryId);
  return category?.models.find((model) => model.id === modelId);
};

// Helper function to get both category and model together
export const getModelWithCategory = (
  categoryId: string,
  modelId: string
) => {
  const category = getCategoryById(categoryId);
  const model = category?.models.find((m) => m.id === modelId);

  if (!category || !model) return null;

  return {
    category,
    model,
  };
};
