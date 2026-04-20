import { Factory, Zap, Shield, Leaf, Sun, LucideIcon } from 'lucide-react';

export interface ProductVariant {
  model: string;
  rating: string;
}

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
  variants?: ProductVariant[];
}

export interface ProductCategory {
  id: string;
  name: string;
  description: string;
  icon: LucideIcon;
  models: ProductModel[];
}

export const productCatalogue: ProductCategory[] = [
  {
    id: 'lhp',
    name: 'LHP',
    description: 'Low horsepower industrial diesel generator sets.',
    icon: Factory,
    models: [
      {
        id: '7-5-25-kva',
        name: '7.5–25 kVA',
        description: 'Compact and reliable power solutions for residential and light commercial use.',
        image: '/products/standard-range/7-5-25-kva/image.png',
        brochure: '/products/standard-range/7-5-25-kva/brochure.pdf',
        highlights: ['Prime rating and Stand-by rating', 'No replacement to displacement', 'Best Fluid Efficiency (Fuel)', 'State of the art Genset Controller'],
        specifications: [
          { label: 'Power Rating', value: '7.5–25 kVA' },
          { label: 'Frequency', value: '50 Hz' },
          { label: 'Power Factor', value: '0.8 Lagging' },
          { label: 'Fuel', value: 'Diesel' },
          { label: 'Electrical Battery Starting Voltage', value: '12 Volts-DC' },
        ],
        variants: [
          { model: 'KG1-7.5', rating: '7.5 kVA' },
          { model: 'KG1-10', rating: '10 kVA' },
          { model: 'KG1-15', rating: '15 kVA' },
          { model: 'KG1-20', rating: '20 kVA' },
          { model: 'KG1-25', rating: '25 kVA' },
        ]
      },
      {
        id: '30-58-5-kva',
        name: '30–58.5 kVA',
        description: 'Dependable power for offices, retail, and small industrial units.',
        image: '/products/standard-range/30-58-5-kva/image.png',
        brochure: '/products/standard-range/30-58-5-kva/brochure.pdf',
        highlights: ['Exhaust gas recirculation (EGR)', 'Common Rail Direct Injection System (CRDi)', 'On Board Diagnostics', 'Peace-of-mind ownership'],
        specifications: [
          { label: 'Power Rating', value: '30–58.5 kVA' },
          { label: 'Frequency', value: '50 Hz' },
          { label: 'Power Factor', value: '0.8 Lagging' },
          { label: 'Fuel', value: 'Diesel' },
          { label: 'Electrical Battery Starting Voltage', value: '12 Volts-DC' },
        ],
        variants: [
          { model: 'KG1-30', rating: '30 kVA' },
          { model: 'KG1-40', rating: '40 kVA' },
          { model: 'KG1-58.5', rating: '58.5 kVA' },
        ]
      },
      {
        id: 'cpcb-iv-82-5-160-kva',
        name: 'CPCB IV+ 82.5–160 kVA',
        description: 'Environment-friendly generators compliant with the latest emission norms.',
        image: '/products/standard-range/cpcb-iv-82-5-160-kva/image.png',
        brochure: '/products/standard-range/cpcb-iv-82-5-160-kva/brochure.pdf',
        highlights: ['Low emission, high efficiency engine', 'Best in class monitoring and diagnostic capability', 'Tank size is optimized in accordance to DEF consumption', 'Compact, Robust and Rugged Design'],
        specifications: [
          { label: 'Power Rating', value: '82.5–160 kVA' },
          { label: 'Frequency', value: '50 Hz' },
          { label: 'Power Factor', value: '0.8 Lagging' },
          { label: 'Fuel', value: 'Diesel' },
          { label: 'Noise Level', value: '< 75' },
        ],
        variants: [
          { model: 'KG1-82.5', rating: '82.5 kVA' },
          { model: 'KG1-100', rating: '100 kVA' },
          { model: 'KG1-125', rating: '125 kVA' },
          { model: 'KG1-160', rating: '160 kVA' },
        ]
      },
      {
        id: '200-250-kva',
        name: '200–250 kVA',
        description: 'Robust power for medium-scale industrial and commercial operations.',
        image: '/products/standard-range/200-250-kva/image.png',
        brochure: '/products/standard-range/200-250-kva/brochure.pdf',
        highlights: ['Integral set - mounted radiator system, designed & tested for 50°C ambient temperature', 'Integrable with AMF', 'Reduction in NOx & HC', 'Microprocessor based controller'],
        specifications: [
          { label: 'Power Rating', value: '200–250 kVA' },
          { label: 'Frequency', value: '50 Hz' },
          { label: 'Voltage', value: '415 V' },
          { label: 'Fuel', value: 'Diesel' },
          { label: 'DG set Noise level at 1 meter', value: '< 75 (Genset with canopy)' },
        ],
        variants: [
          { model: 'KG1-200', rating: '200 kVA' },
          { model: 'KG1-250', rating: '250 kVA' },
        ]
      },
    ],
  },
  {
    id: 'mhp',
    name: 'MHP',
    description: 'Medium horsepower industrial diesel generator sets.',
    icon: Factory,
    models: [
      {
        id: 'hd-200-625-kva',
        name: '200–625 kVA',
        description: 'Heavy-duty power designed for rigorous industrial environments.',
        image: '/products/standard-range/hd-200-625-kva/image.png',
        brochure: '/products/standard-range/hd-200-625-kva/brochure.pdf',
        highlights: ['Industrial grade construction', '500 hours lube-oil change period', 'Graphical LCD display', 'DOC & SCR system sets off the reaction to meet the latest CPCB norms'],
        specifications: [
          { label: 'Power Rating', value: '200–625 kVA' },
          { label: 'Voltage', value: '415 V' },
          { label: 'Frequency', value: '50 Hz' },
          { label: 'Noise level', value: '<75 (Genset with canopy)' },
        ],
        variants: [
          { model: 'KG1-400', rating: '400 kVA' },
          { model: 'KG1-500', rating: '500 kVA' },
          { model: 'KG1-625', rating: '625 kVA' },
        ]
      },
      {
        id: '320-750-kva',
        name: '320–750 kVA',
        description: 'Large-scale power solutions for factories and infrastructure.',
        image: '/products/standard-range/320-750-kva/image.png',
        brochure: '/products/standard-range/320-750-kva/brochure.pdf',
        highlights: ['Graphical LCD display', 'Communication Compatible', 'Reduction in PM', 'Control & monitor the DEF'],
        specifications: [
          { label: 'Power Rating', value: '320–750 kVA' },
          { label: 'Voltage', value: '415 V' },
          { label: 'DG set Noise level at 1 meter', value: '< 75 (Genset with canopy)' },
          { label: 'Fuel', value: 'Diesel' },
        ],
        variants: [
          { model: 'KG1-320', rating: '320 kVA' },
          { model: 'KG1-750', rating: '750 kVA' },
        ]
      },
    ],
  },
  {
    id: 'hhp',
    name: 'HHP',
    description: 'High horsepower industrial diesel generator sets.',
    icon: Factory,
    models: [
      {
        id: '1010-1500-kva',
        name: '1010–1500 kVA',
        description: 'Ultra-high capacity generators for mission-critical installations.',
        image: '/products/standard-range/1010-1500-kva/image.png',
        brochure: '/products/standard-range/1010-1500-kva/brochure.pdf',
        highlights: ['CAQM & CPCB Compliant', 'Redundancy capable', 'Precision controls', 'Global standards'],
        specifications: [
          { label: 'Power Rating', value: '1010–1500 kVA' },
          { label: 'Frequency', value: '50 Hz' },
          { label: 'Noise level compliance as per CPCB norms', value: '25 dBA Insertion loss' },
          { label: 'Fuel tank capacity', value: '990' },
        ],
        variants: [
          { model: 'KG1-1010', rating: '1010 kVA' },
          { model: 'KG1-1250', rating: '1250 kVA' },
          { model: 'KG1-1500', rating: '1500 kVA' },
        ]
      },
    ],
  },
  {
    id: 'hybrid',
    name: 'Hybrid Series',
    description: 'Eco-friendly hybrid power solutions.',
    icon: Zap,
    models: [
      {
        id: 'hybrid-series',
        name: 'Hybrid',
        description: 'Smart integration of diesel and renewable power.',
        image: '/products/hybrid/hybrid-series/image.png',
        brochure: '/products/hybrid/hybrid-series/brochure.pdf',
        highlights: ['Integrates multiple Energy Sources', 'Sustainable Green Technology', 'Optimized Operation & Maintenance', 'Fuel efficiency and cost reduction'],
        specifications: [
          { label: 'Frequency', value: '50 Hz' },
          { label: 'Noise Level', value: 'Max 70 dBA @ 7 Mtr' },
          { label: 'Voltage', value: '230 V' },
        ],
        variants: [
          { model: 'HYB-10', rating: '10 kVA' },
        ]
      },
    ],
  },
  {
    id: 'optiprime',
    name: 'Optiprime',
    description: 'Premium optimized industrial generators.',
    icon: Shield,
    models: [
      {
        id: 'optiprime-series',
        name: 'Optiprime',
        description: 'Versatile and high-performance range for diverse industrial loads.',
        image: '/products/optiprime/optiprime-series/image.png',
        brochure: '/products/optiprime/optiprime-series/brochure.pdf',
        highlights: ['Patented Hybrid Technology', 'Multi-core operations', 'Reduced Nitrous Oxide Emissions', 'Reduce CO2 Emissions'],
        specifications: [
          { label: 'Frequency', value: '50 Hz' },
          { label: 'Noise level at 1 Mtr', value: '< 75 dBA' },
          { label: 'Fuel', value: 'Diesel' },
        ],
        variants: [
          { model: 'OPT-125', rating: '125 kVA' },
          { model: 'OPT-250', rating: '250 kVA' },
          { model: 'OPT-320', rating: '320 kVA' },
          { model: 'OPT-400', rating: '400 kVA' },
          { model: 'OPT-500', rating: '500 kVA' },
          { model: 'OPT-640', rating: '640 kVA' },
          { model: 'OPT-700', rating: '700 kVA' },
          { model: 'OPT-1000', rating: '1000 kVA' },
          { model: 'OPT-1250', rating: '1250 kVA' },
          { model: 'OPT-1400', rating: '1400 kVA' },
          { model: 'OPT-1500', rating: '1500 kVA' },
          { model: 'OPT-2000', rating: '2000 kVA' },
          { model: 'OPT-2020', rating: '2020 kVA' },
          { model: 'OPT-2500', rating: '2500 kVA' },
          { model: 'OPT-3000', rating: '3000 kVA' },
          { model: 'OPT-3300', rating: '3300 kVA' },
          { model: 'OPT-4000', rating: '4000 kVA' },
          { model: 'OPT-5000', rating: '5000 kVA' },
          { model: 'OPT-6000', rating: '6000 kVA' },
          { model: 'OPT-6600', rating: '6600 kVA' },
          { model: 'OPT-8000', rating: '8000 kVA' },
          { model: 'OPT-10000', rating: '10000 kVA' },
          { model: 'OPT-12000', rating: '12000 kVA' },
        ]
      },
    ],
  },
  {
    id: 'sentinel',
    name: 'Sentinel Series',
    description: 'Portable and reliable critical power.',
    icon: Sun,
    models: [
      {
        id: 'sentinel-series',
        name: 'Sentinel',
        description: 'Compact power units for residential and small professional use.',
        image: '/products/sentinel/sentinel-series/image.png',
        brochure: '/products/sentinel/sentinel-series/brochure.pdf',
        highlights: ['Lowest Footprint', 'Easy mobility on wheels', 'Fuel saving', 'Aesthetical'],
        specifications: [
          { label: 'Fuel', value: 'Diesel / Petrol' },
          { label: 'Voltage', value: '230 V' },
          { label: 'Engine RPM', value: '3000' },
        ],
        variants: [
          { model: 'SNT-2.8P', rating: '2.8 kW (Petrol)' },
          { model: 'SNT-5P', rating: '5 kW (Petrol)' },
          { model: 'SNT-3.5D', rating: '3.5 kVA (Diesel)' },
          { model: 'SNT-5.5D', rating: '5.5 kVA (Diesel)' },
          { model: 'SNT-7.5D', rating: '7.5 kVA (Diesel)' },
        ]
      },
    ],
  },
  {
    id: 'png-range',
    name: 'PNG Range',
    description: 'Clean energy natural gas solutions.',
    icon: Leaf,
    models: [
      {
        id: 'natural-gas-15-500',
        name: 'Natural Gas 15–500 kVA',
        description: 'Clean burning gas engines for continuous and standby power.',
        image: '/products/png-range/natural-gas-15-500/image.png',
        brochure: '/products/png-range/natural-gas-15-500/brochure.pdf',
        highlights: ['Consistent Fuel Quality', 'Low Operating Cost', 'In built catalytic convertor', 'Fully electronic controlled'],
        specifications: [
          { label: 'Engine Rated Speed', value: '1500 RPM' },
          { label: 'Frequency', value: '50 Hz' },
          { label: 'Noise level at 75% rated load', value: '< 75 dBA' },
        ],
        variants: [
          { model: 'G-15', rating: '15 kVA' },
          { model: 'G-30', rating: '30 kVA' },
          { model: 'G-58.5', rating: '58.5 kVA' },
          { model: 'G-125', rating: '125 kVA' },
          { model: 'G-500', rating: '500 kVA' },
        ]
      },
      {
        id: 'natural-gas-250',
        name: 'Natural Gas 250 kVA',
        description: 'Dedicated medium-capacity natural gas genset.',
        image: '/products/png-range/natural-gas-250/image.png',
        brochure: '/products/png-range/natural-gas-250/brochure.pdf',
        highlights: ['Higher Cubic capacity results higher block loading', 'Residential silencer with Protection cover', 'Consists of Gas filter, Solenoid & PRVs', 'Microprocessor based KG 645 controller'],
        specifications: [
          { label: 'Frequency', value: '50 Hz' },
          { label: 'Noise level @ 75% rated load', value: '< 75 dBA' },
          { label: 'Engine Rated Speed', value: '1500 RPM' },
        ],
        variants: [
          { model: 'G-250', rating: '250 kVA' },
        ]
      },
    ],
  },
];

export const getCategoryById = (categoryId: string) => 
  productCatalogue.find((cat) => cat.id === categoryId);

export const getModelWithCategory = (categoryId: string, modelId: string) => {
  const category = getCategoryById(categoryId);
  const model = category?.models.find((m) => m.id === modelId);
  return category && model ? { category, model } : null;
};