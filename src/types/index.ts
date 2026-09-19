export type ProductCategory = 'millets' | 'spices' | 'signature';

export interface ProductWeightOption {
  size: string; // e.g. "500g", "1kg", "250g"
  price: number; // in INR
  mrp: number; // in INR
  inStock: boolean;
}

export interface ProductNutrition {
  servingSize: string;
  energyKcal: string;
  protein: string;
  carbohydrates: string;
  dietaryFiber: string;
  fat: string;
  minerals?: string;
}

export interface BatchInfo {
  batchPrefix: string;
  shelfLifeMonths: number;
  fssaiCategory: string;
  packagingType: string;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  localName: string; // Telugu / Indian name e.g. "కొర్రలు (Korralu)"
  category: ProductCategory;
  tagline: string;
  shortDescription: string;
  description: string;
  images: string[];
  weights: ProductWeightOption[];
  ingredients: string[];
  origin: string; // Origin / Sourcing location (explicit, honest or marked placeholder)
  processing: string; // Processing description
  cookingInstructions: string[];
  culinaryUses: string[];
  storage: string;
  nutrition: ProductNutrition;
  certificationsPlaceholder: string; // e.g., "[ADD ORGANIC / NPOP CERTIFICATION WHEN CERTIFIED]"
  batchInfo: BatchInfo;
  labTestPlaceholder: string; // e.g., "[ADD INDEPENDENT LAB PURITY REPORT]"
  bestseller?: boolean;
  featured?: boolean;
  rating?: number | null; // null if unrated, avoids fake ratings
  reviewCount?: number;
  spiceProfile?: {
    aroma: string;
    heatLevel?: string;
    keyFlavors: string[];
  };
}

export interface CartItem {
  productId: string;
  slug: string;
  name: string;
  localName: string;
  category: ProductCategory;
  image: string;
  selectedWeight: string;
  price: number;
  mrp: number;
  quantity: number;
}

export interface Recipe {
  id: string;
  slug: string;
  title: string;
  localName?: string;
  milletOrSpiceUsed: string;
  productSlug: string;
  category: 'Breakfast' | 'Lunch' | 'Dinner' | 'Snacks' | 'Traditional' | 'Quick Recipes';
  prepTime: string;
  cookTime: string;
  servings: string;
  difficulty: 'Easy' | 'Medium' | 'Advanced';
  image: string;
  description: string;
  ingredients: string[];
  instructions: string[];
  pairingTips?: string;
}

export interface JournalArticle {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  category: string;
  readTime: string;
  publishedDate: string;
  author: string;
  image: string;
  excerpt: string;
  content: {
    heading?: string;
    body: string;
  }[];
  tags: string[];
}

export interface BrandConfig {
  brandName: string;
  tagline: string;
  subTagline: string;
  mission?: string;
  pillars?: string[];
  logoText: string;
  logoImage?: string;
  emblemImage?: string;
  fullLogoImage?: string;
  supportEmail: string;
  supportPhone: string;
  supportHours: string;
  registeredOffice: string;
  fssaiNumber: string;
  instagramHandle: string;
  instagramUrl: string;
  freeShippingThreshold: number; // e.g. 500
  flatShippingRate: number; // e.g. 49
  currencySymbol: string;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: 'Sourcing & Quality' | 'Millets & Preparation' | 'Spices & Storage' | 'Shipping & Orders';
}

export interface OrderDetails {
  orderId: string;
  date: string;
  status: 'Pending' | 'Confirmed' | 'Processing' | 'Packed' | 'Shipped' | 'Delivered' | 'Cancelled';
  customerName: string;
  mobile: string;
  email: string;
  shippingAddress: {
    street: string;
    apartment?: string;
    city: string;
    state: string;
    pincode: string;
  };
  items: CartItem[];
  subtotal: number;
  shippingFee: number;
  discount: number;
  total: number;
  paymentStatus: 'Pending' | 'Paid (Integration Ready)' | 'Cash on Delivery';
  paymentMethod: string;
}
