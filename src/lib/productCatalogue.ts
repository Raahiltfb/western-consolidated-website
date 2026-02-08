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
          images: [
            "/products/kva-7-5-750-hhp/7-5-25-kva/image-1.png"
          ],
          brochure:
            "/products/kva-7-5-750-hhp/7-5-25-kva/brochure.pdf",
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
        }
      ]
    }
  ]
};
