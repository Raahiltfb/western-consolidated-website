// src/lib/productCatalogue.ts

export type ProductSpecs = {
  powerRating: string;
  engine: string;
  frequency: string;
  voltage: string;
  fuel: string;
  cooling: string;
};

export type ProductModel = {
  id: string;
  name: string;
  images: string[];
  brochure: string;
  highlights: string[];
  specs: ProductSpecs;
};

export type ProductCategory = {
  id: string;
  name: string;
  models: ProductModel[];
};

export const productCatalogue: { categories: ProductCategory[] } = {
  categories: [
    {
      id: "kva-7-5-750-hhp",
      name: "7.5–750 kVA & HHP",
      models: [
        {
          id: "7-5-25-kva",
          name: "7.5–25 kVA",
          images: ["/products/kva-7-5-750-hhp/7-5-25-kva/image-1.png"],
          brochure: "/products/kva-7-5-750-hhp/7-5-25-kva/brochure.pdf",
          highlights: [
            "Advanced noise reduction technology",
            "Fuel-efficient diesel engine",
            "Compact and space-saving design",
            "Reliable performance for industrial applications",
            "Easy maintenance access",
            "Digital control panel"
          ],
          specs: {
            powerRating: "7.5–25 kVA",
            engine: "KOEL",
            frequency: "50 Hz",
            voltage: "415V / 240V",
            fuel: "Diesel",
            cooling: "Water Cooled"
          }
        },
        {
          id: "30-58-5-kva",
          name: "30–58.5 kVA",
          images: ["/products/kva-7-5-750-hhp/30-58-5-kva/image-1.png"],
          brochure: "/products/kva-7-5-750-hhp/30-58-5-kva/brochure.pdf",
          highlights: [
            "Robust industrial-grade construction",
            "Low fuel consumption",
            "Silent operation with acoustic enclosure",
            "Automatic voltage regulation",
            "Extended service intervals",
            "Heavy-duty alternator"
          ],
          specs: {
            powerRating: "30–58.5 kVA",
            engine: "KOEL",
            frequency: "50 Hz",
            voltage: "415V / 240V",
            fuel: "Diesel",
            cooling: "Water Cooled"
          }
        },
        {
          id: "cpcb-iv-82-5-160-kva",
          name: "CPCB IV+ 82.5–160 kVA",
          images: ["/products/kva-7-5-750-hhp/cpcb-iv-82-5-160-kva/image-1.png"],
          brochure: "/products/kva-7-5-750-hhp/cpcb-iv-82-5-160-kva/brochure.pdf",
          highlights: [
            "CPCB IV+ emission compliant",
            "Environment-friendly operation",
            "Advanced exhaust after-treatment",
            "Superior fuel efficiency",
            "Intelligent engine management",
            "Reduced carbon footprint"
          ],
          specs: {
            powerRating: "82.5–160 kVA",
            engine: "KOEL",
            frequency: "50 Hz",
            voltage: "415V / 240V",
            fuel: "Diesel",
            cooling: "Water Cooled"
          }
        },
        {
          id: "200-250-kva",
          name: "200–250 kVA",
          images: ["/products/kva-7-5-750-hhp/200-250-kva/image-1.png"],
          brochure: "/products/kva-7-5-750-hhp/200-250-kva/brochure.pdf",
          highlights: [
            "High power output capacity",
            "Industrial-grade reliability",
            "Advanced cooling system",
            "Low noise operation",
            "Remote monitoring capability",
            "Durable powder-coated enclosure"
          ],
          specs: {
            powerRating: "200–250 kVA",
            engine: "KOEL",
            frequency: "50 Hz",
            voltage: "415V / 240V",
            fuel: "Diesel",
            cooling: "Water Cooled"
          }
        },
        {
          id: "320-750-kva",
          name: "320–750 kVA",
          images: ["/products/kva-7-5-750-hhp/320-750-kva/image-1.png"],
          brochure: "/products/kva-7-5-750-hhp/320-750-kva/brochure.pdf",
          highlights: [
            "Heavy-duty industrial application",
            "Maximum uptime reliability",
            "Advanced load management",
            "Integrated safety systems",
            "Extended fuel tank options",
            "Professional-grade control panel"
          ],
          specs: {
            powerRating: "320–750 kVA",
            engine: "KOEL",
            frequency: "50 Hz",
            voltage: "415V / 240V",
            fuel: "Diesel",
            cooling: "Water Cooled"
          }
        },
        {
          id: "1010-1500-kva",
          name: "1010–1500 kVA",
          images: ["/products/kva-7-5-750-hhp/1010-1500-kva/image-1.png"],
          brochure: "/products/kva-7-5-750-hhp/1010-1500-kva/brochure.pdf",
          highlights: [
            "Ultra-high power capacity",
            "Mission-critical reliability",
            "Parallel operation capability",
            "Advanced synchronization",
            "Industrial-scale power delivery",
            "Comprehensive monitoring systems"
          ],
          specs: {
            powerRating: "1010–1500 kVA",
            engine: "KOEL",
            frequency: "50 Hz",
            voltage: "415V / 240V",
            fuel: "Diesel",
            cooling: "Water Cooled"
          }
        },
        {
          id: "hd-200-625-kva",
          name: "HD 200–625 kVA",
          images: ["/products/kva-7-5-750-hhp/hd-200-625-kva/image-1.png"],
          brochure: "/products/kva-7-5-750-hhp/hd-200-625-kva/brochure.pdf",
          highlights: [
            "Heavy-duty series construction",
            "Extreme condition performance",
            "Reinforced structural frame",
            "Enhanced vibration isolation",
            "Extended operating life",
            "Premium component quality"
          ],
          specs: {
            powerRating: "200–625 kVA",
            engine: "KOEL",
            frequency: "50 Hz",
            voltage: "415V / 240V",
            fuel: "Diesel",
            cooling: "Water Cooled"
          }
        }
      ]
    },
    {
      id: "hybrid",
      name: "Hybrid Series",
      models: [
        {
          id: "hybrid-series",
          name: "Hybrid Series",
          images: ["/products/hybrid/hybrid-series/image-1.png"],
          brochure: "/products/hybrid/hybrid-series/brochure.pdf",
          highlights: [
            "Dual power source capability",
            "Seamless power transition",
            "Reduced fuel consumption",
            "Lower emissions output",
            "Intelligent power management",
            "Future-ready technology"
          ],
          specs: {
            powerRating: "Variable",
            engine: "KOEL Hybrid",
            frequency: "50 Hz",
            voltage: "415V / 240V",
            fuel: "Diesel / Electric",
            cooling: "Water Cooled"
          }
        }
      ]
    },
    {
      id: "optiprime",
      name: "Optiprime Series",
      models: [
        {
          id: "optiprime-series",
          name: "Optiprime Series",
          images: ["/products/optiprime/optiprime-series/image-1.png"],
          brochure: "/products/optiprime/optiprime-series/brochure.pdf",
          highlights: [
            "Optimized prime power rating",
            "Continuous duty operation",
            "Enhanced fuel efficiency",
            "Extended service intervals",
            "Premium build quality",
            "Industrial reliability"
          ],
          specs: {
            powerRating: "Prime Rated",
            engine: "KOEL",
            frequency: "50 Hz",
            voltage: "415V / 240V",
            fuel: "Diesel",
            cooling: "Water Cooled"
          }
        }
      ]
    },
    {
      id: "png-range",
      name: "PNG Range (CPCB IV+)",
      models: [
        {
          id: "natural-gas-15-500-kva",
          name: "Natural Gas 15–500 kVA",
          images: ["/products/png-range/natural-gas-15-500-kva/image-1.png"],
          brochure: "/products/png-range/natural-gas-15-500-kva/brochure.pdf",
          highlights: [
            "Natural gas powered operation",
            "CPCB IV+ compliant",
            "Lower emissions than diesel",
            "Cost-effective fuel option",
            "Clean combustion technology",
            "Environmentally responsible"
          ],
          specs: {
            powerRating: "15–500 kVA",
            engine: "KOEL",
            frequency: "50 Hz",
            voltage: "415V / 240V",
            fuel: "Natural Gas (PNG)",
            cooling: "Water Cooled"
          }
        },
        {
          id: "natural-gas-250-kva",
          name: "Natural Gas 250 kVA",
          images: ["/products/png-range/natural-gas-250-kva/image-1.png"],
          brochure: "/products/png-range/natural-gas-250-kva/brochure.pdf",
          highlights: [
            "Dedicated 250 kVA capacity",
            "Optimized gas consumption",
            "Low operating costs",
            "Minimal environmental impact",
            "Reliable continuous operation",
            "Advanced gas management"
          ],
          specs: {
            powerRating: "250 kVA",
            engine: "KOEL",
            frequency: "50 Hz",
            voltage: "415V / 240V",
            fuel: "Natural Gas (PNG)",
            cooling: "Water Cooled"
          }
        }
      ]
    },
    {
      id: "sentinel",
      name: "Sentinel Range",
      models: [
        {
          id: "sentinel-series",
          name: "Sentinel Series",
          images: ["/products/sentinel/sentinel-series/image-1.png"],
          brochure: "/products/sentinel/sentinel-series/brochure.pdf",
          highlights: [
            "Critical infrastructure grade",
            "Maximum reliability design",
            "Advanced monitoring systems",
            "Redundant safety features",
            "Extended warranty coverage",
            "Premium service support"
          ],
          specs: {
            powerRating: "Variable",
            engine: "KOEL",
            frequency: "50 Hz",
            voltage: "415V / 240V",
            fuel: "Diesel",
            cooling: "Water Cooled"
          }
        }
      ]
    }
  ]
};
