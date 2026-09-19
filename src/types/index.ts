export type ProductCategory = 'millets' | 'spices' | 'masalas' | 'combos' | 'signature';

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
  origin: string; // Origin / Sourcing location
  processing: string; // Processing description
  cookingInstructions: string[];
  culinaryUses: string[];
  storage: string;
  nutrition: ProductNutrition;
  certificationsPlaceholder: string;
  batchInfo: BatchInfo;
  labTestPlaceholder: string;
  bestseller?: boolean;
  featured?: boolean;
  rating?: number | null; // null if unrated, avoids fake ratings
  reviewCount?: number;
  sku?: string;
  stockQuantity?: number;
  dietaryPreferences?: string[]; // 'Gluten-Free', 'Low GI', 'High Fiber', 'Cold-Ground', 'Single-Origin'
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

export interface SavedAddress {
  id: string;
  type: 'Home' | 'Work';
  isDefault?: boolean;
  fullName: string;
  mobile: string;
  pincode: string;
  houseFlat: string;
  streetArea: string;
  landmark?: string;
  city: string;
  state: string;
}

export interface Coupon {
  id?: string;
  code: string;
  discountPercent?: number;
  discountAmount?: number;
  minOrderValue: number;
  minOrderAmount?: number;
  description: string;
  expiryDate?: string;
  expiresAt?: string;
  usageCount?: number;
  isActive?: boolean;
}

export interface ProductReview {
  id: string;
  productId: string;
  productName: string;
  customerName: string;
  rating: number;
  date: string;
  verifiedPurchase: boolean;
  comment: string;
  images?: string[];
}

export interface BatchRecord {
  batchNumber: string;
  batchId?: string;
  productId: string;
  productName: string;
  cropName?: string;
  harvestDate: string;
  sourceRegion: string;
  farmerCluster?: string;
  processingDate: string;
  millingDate?: string;
  qualityCheckStatus: 'Passed' | 'Pending' | 'Flagged';
  qualityPassed?: boolean;
  packagingDate: string;
  bestBefore: string;
  moisturePercent: string;
  moisturePercentage?: number;
  totalQuantityKg?: number;
  purityPercent: string;
  labReportUrl?: string;
}

export interface InventoryItem {
  id: string;
  sku: string;
  productName: string;
  variant: string;
  stock: number;
  threshold: number;
  status: 'In Stock' | 'Low Stock' | 'Out of Stock';
  batchNumber: string;
  sellingPrice: number;
}

export interface ShipmentRecord {
  id?: string;
  orderId: string;
  customerName?: string;
  trackingId?: string;
  awbNumber?: string;
  courierPartner: string;
  destinationCity?: string;
  dispatchDate?: string;
  status: 'Ready to Ship' | 'Shipped' | 'In Transit' | 'Out for Delivery' | 'Delivered';
  labelGenerated?: boolean;
  estimatedDelivery: string;
}

export interface ReturnRequest {
  id: string;
  orderId: string;
  customerName: string;
  productName: string;
  reason: string;
  status: 'Pending Review' | 'Approved' | 'Rejected' | 'Refund Processed';
  refundAmount: number;
  refundMethod: string;
  requestedAt: string;
}

export interface AdminMetrics {
  todaySales: number;
  todayOrders: number;
  totalCustomers: number;
  activeProducts: number;
  pendingOrders: number;
  revenueLakhs: number;
  totalLifetimeOrders: number;
  aov: number;
  conversionRate: number;
  repeatRate: number;
}

export interface OrderDetails {
  id?: string;
  orderId: string;
  date: string;
  status: 'Order Placed' | 'Payment Confirmed' | 'Order Processing' | 'Processing' | 'Packed' | 'Shipped' | 'Out for Delivery' | 'Delivered' | 'Cancelled';
  customerName: string;
  mobile: string;
  email: string;
  shippingAddress: {
    name?: string;
    fullName?: string;
    phone?: string;
    type?: 'Home' | 'Work';
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
  courierPartner?: string;
  trackingId?: string;
  estimatedDelivery?: string;
}
