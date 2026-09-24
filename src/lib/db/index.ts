import { products } from '@/data/products';
import { batchRecords } from '@/data/batches';
import { availableCoupons } from '@/data/coupons';
import { initialAddresses } from '@/data/addresses';
import { mockOrdersList } from '@/data/orders';
import { CartItem, SavedAddress } from '@/types';

// =============================================================================
// DHARVIKA GRAINS — Production Database Entity Types & Relational Schema
// =============================================================================

export type UserRole =
  | 'CUSTOMER'
  | 'ADMIN'
  | 'OWNER'
  | 'SUPER_ADMIN'
  | 'OPERATIONS'
  | 'INVENTORY_MANAGER'
  | 'CUSTOMER_SUPPORT'
  | 'INVESTOR';

export interface ProfileEntity {
  id: string; // references auth.users.id
  fullName: string;
  email: string;
  phone: string;
  avatarUrl?: string;
  role: 'CUSTOMER' | 'ADMIN' | 'OWNER';
  createdAt: string;
  updatedAt: string;
}

export type ProductCatalogCategory = 'Millets' | 'Spices' | 'Combo Packs';
export type ProductCatalogStatus = 'PUBLISHED' | 'DRAFT' | 'ARCHIVED';

export interface ProductEntity {
  id: string;
  name: string;
  slug: string;
  category: ProductCatalogCategory;
  description: string;
  images: string[];
  price: number;
  comparePrice?: number;
  weight: number;
  unit: string;
  isAvailable: boolean;
  status: ProductCatalogStatus;
  createdAt: string;
  updatedAt: string;
}

export function isCustomer(role?: string): boolean {
  return role === 'CUSTOMER';
}

export function isAdmin(role?: string): boolean {
  return role === 'ADMIN' || role === 'SUPER_ADMIN' || role === 'OWNER';
}

export function isOwner(role?: string): boolean {
  return role === 'OWNER' || role === 'SUPER_ADMIN';
}

export function canAccessAdmin(role?: string): boolean {
  return role === 'ADMIN' || role === 'SUPER_ADMIN' || role === 'OWNER' || role === 'OPERATIONS';
}

export function canManageRoles(role?: string): boolean {
  return role === 'OWNER' || role === 'SUPER_ADMIN';
}

export interface User {
  id: string;
  fullName: string;
  email: string;
  mobile: string;
  role: UserRole;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CustomerProfile {
  userId: string;
  fullName: string;
  email: string;
  mobile: string;
  defaultAddressId?: string;
  createdAt: string;
}

export interface InventoryEntity {
  id: string;
  sku: string;
  productId: string;
  productName: string;
  variant: string;
  stockReceived: number;
  stockReserved: number;
  stockSold: number;
  stockAdjusted: number;
  stockReturned: number;
  stock: number; // Available stock = (stockReceived + stockReturned + stockAdjusted) - (stockReserved + stockSold)
  reserved: number; // View of stockReserved
  threshold: number; // Low-stock alert threshold
  status: 'In Stock' | 'Low Stock' | 'Out of Stock';
  batchNumber: string;
  sellingPrice: number;
  mrp: number;
  updatedAt: string;
}

export type InventoryTransactionType =
  | 'STOCK_RECEIVED'
  | 'STOCK_RESERVED'
  | 'STOCK_SOLD'
  | 'STOCK_ADJUSTED'
  | 'STOCK_RETURNED'
  | 'STOCK_RELEASED'
  | 'PURCHASE'
  | 'RESERVATION'
  | 'RELEASE'
  | 'ADJUSTMENT'
  | 'RETURN';

export interface InventoryTransaction {
  id: string;
  sku: string;
  batchNumber?: string;
  type: InventoryTransactionType;
  quantity: number;
  stockBefore: number;
  stockAfter: number;
  referenceId?: string; // Order Number or Batch ID
  notes: string;
  actorEmail: string;
  actorRole?: string;
  createdAt: string;
}

export interface BatchEntity {
  id: string;
  batchNumber: string;
  productId: string;
  productName: string;
  cropName: string;
  harvestDate?: string;
  manufacturingDate: string;
  expiryDate: string;
  sourceRegion: string;
  farmerCluster?: string;
  supplier?: string;
  purchaseCost?: number;
  sellingPrice?: number;
  processingDate?: string;
  millingDate?: string;
  qualityPassed: boolean;
  packagingDate?: string;
  bestBefore?: string;
  moisturePercent?: string;
  totalQuantityKg: number;
  remainingQuantityKg: number;
  purityPercent?: string;
  status: 'ACTIVE' | 'ARCHIVED' | 'DEPLETED' | 'LOW_STOCK' | 'EXPIRED';
  createdAt: string;
}

export type PaymentStatus =
  | 'CREATED'
  | 'PENDING'
  | 'AUTHORIZED'
  | 'CAPTURED'
  | 'PAID'
  | 'FAILED'
  | 'REFUNDED'
  | 'PARTIALLY_REFUNDED';

export type OrderStatus =
  | 'PENDING_PAYMENT'
  | 'PAYMENT_FAILED'
  | 'PAID'
  | 'PROCESSING'
  | 'PACKED'
  | 'SHIPPED'
  | 'OUT_FOR_DELIVERY'
  | 'DELIVERED'
  | 'CANCELLED'
  | 'REFUND_REQUESTED'
  | 'REFUNDED';

export interface OrderItemSnapshot {
  productId: string;
  sku: string;
  name: string;
  localName: string;
  selectedWeight: string;
  price: number; // Locked price at time of purchase
  mrp: number;
  quantity: number;
  image: string;
  batchNumber?: string;
}

export interface OrderEntity {
  id: string;
  orderNumber: string; // Human-friendly e.g. DG-2026-1082
  customerId?: string;
  customerName: string;
  email: string;
  mobile: string;
  shippingAddressSnapshot: SavedAddress;
  billingAddressSnapshot: SavedAddress;
  items: OrderItemSnapshot[];
  subtotal: number; // Server-side calculated
  discount: number; // Server-side verified coupon discount
  shippingFee: number;
  tax: number;
  total: number;
  currency: string;
  paymentStatus: PaymentStatus;
  orderStatus: OrderStatus;
  paymentMethod: 'UPI' | 'CARD' | 'NETBANKING' | 'WALLET' | 'COD' | 'RAZORPAY';
  couponCode?: string;
  paymentId?: string;
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  shipmentId?: string;
  courierPartner?: string;
  trackingId?: string;
  awbNumber?: string;
  estimatedDelivery?: string;
  timeline: {
    status: string;
    timestamp: string;
    note: string;
  }[];
  createdAt: string;
  updatedAt: string;
}

export interface PaymentEntity {
  id: string;
  orderId: string;
  orderNumber: string;
  amount: number; // In paise for Razorpay
  currency: string;
  provider: 'RAZORPAY' | 'COD';
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  signature?: string;
  status: PaymentStatus;
  method?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PaymentEvent {
  id: string;
  paymentId?: string;
  orderNumber: string;
  eventType: string;
  eventPayload: any;
  signatureVerified: boolean;
  receivedAt: string;
}

export interface CouponEntity {
  code: string;
  type: 'PERCENTAGE' | 'FIXED';
  discountPercent?: number;
  discountAmount?: number;
  minOrderValue: number;
  maxDiscount?: number;
  description: string;
  expiryDate: string;
  usageLimit: number;
  timesUsed: number;
  perUserLimit: number;
  isActive: boolean;
}

export interface CouponUsageRecord {
  id: string;
  couponCode: string;
  customerEmail: string;
  orderNumber: string;
  discountApplied: number;
  usedAt: string;
}

export interface ReviewEntity {
  id: string;
  productId: string;
  productName: string;
  customerName: string;
  customerEmail: string;
  rating: number;
  comment: string;
  verifiedPurchase: boolean;
  status: 'APPROVED' | 'PENDING' | 'REJECTED';
  createdAt: string;
}

export interface ReturnRequestEntity {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  productName: string;
  reason: string;
  status: 'REQUESTED' | 'APPROVED' | 'PROCESSING' | 'COMPLETED' | 'REJECTED';
  refundAmount: number;
  refundMethod: string;
  requestedAt: string;
  updatedAt: string;
}

export interface AuditLogEntity {
  id: string;
  actorEmail: string;
  actorRole: string;
  action: string;
  entity: string;
  entityId: string;
  details: string;
  timestamp: string;
}

export interface CartEntity {
  id: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CartItemEntity {
  id: string;
  cartId: string;
  productId: string;
  selectedWeight: string;
  quantity: number;
  createdAt: string;
  updatedAt: string;
}

export interface EnrichedCartItem {
  id: string;
  productId: string;
  slug: string;
  name: string;
  localName?: string;
  image: string;
  selectedWeight: string;
  unitPrice: number; // Strictly computed server-side from catalog/DB
  mrp: number;
  quantity: number;
  lineTotal: number;
  inStock: boolean;
  availableStock: number;
}

export interface CartResponse {
  cartId: string;
  userId: string;
  items: EnrichedCartItem[];
  itemCount: number;
  subtotal: number;
  updatedAt: string;
}

// =============================================================================
// In-Memory Production State Store (with Seed Data & Relational Methods)
// =============================================================================

class DatabaseStore {
  private users: Map<string, User> = new Map();
  private profiles: Map<string, ProfileEntity> = new Map();
  private productsList: Map<string, ProductEntity> = new Map();
  private addresses: Map<string, SavedAddress[]> = new Map();
  private inventory: Map<string, InventoryEntity> = new Map();
  private transactions: InventoryTransaction[] = [];
  private batches: Map<string, BatchEntity> = new Map();
  private orders: Map<string, OrderEntity> = new Map();
  private payments: Map<string, PaymentEntity> = new Map();
  private paymentEvents: PaymentEvent[] = [];
  private coupons: Map<string, CouponEntity> = new Map();
  private couponUsages: CouponUsageRecord[] = [];
  private reviews: ReviewEntity[] = [];
  private returnRequests: ReturnRequestEntity[] = [];
  private auditLogs: AuditLogEntity[] = [];
  private carts: Map<string, CartEntity> = new Map();
  private userCarts: Map<string, string> = new Map(); // userId -> cartId
  private cartItems: Map<string, CartItemEntity> = new Map(); // itemId -> CartItemEntity

  constructor() {
    this.seed();
  }

  private seed() {
    // 1. Seed Core Admin User
    const adminEmail = process.env.ADMIN_EMAIL || 'dharvikagrains@gmail.com';
    const adminUser: User = {
      id: 'usr_admin_001',
      fullName: 'Dharvika Grains Admin',
      email: adminEmail.toLowerCase(),
      mobile: '9876543210',
      role: 'ADMIN',
      isVerified: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.users.set(adminUser.id, adminUser);
    this.profiles.set(adminUser.id, {
      id: adminUser.id,
      fullName: adminUser.fullName,
      email: adminUser.email,
      phone: adminUser.mobile,
      role: 'ADMIN',
      createdAt: adminUser.createdAt,
      updatedAt: adminUser.updatedAt,
    });

    // 2. Seed Executive Owner User
    const ownerEmail = process.env.OWNER_EMAIL || 'owner@dharvikagrains.in';
    const ownerUser: User = {
      id: 'usr_owner_001',
      fullName: 'Dharvika Executive Owner',
      email: ownerEmail.toLowerCase(),
      mobile: '9876543211',
      role: 'OWNER',
      isVerified: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.users.set(ownerUser.id, ownerUser);
    this.profiles.set(ownerUser.id, {
      id: ownerUser.id,
      fullName: ownerUser.fullName,
      email: ownerUser.email,
      phone: ownerUser.mobile,
      role: 'OWNER',
      createdAt: ownerUser.createdAt,
      updatedAt: ownerUser.updatedAt,
    });

    // 3. Seed Test Customer User
    const testCustomerEmail = process.env.TEST_CUSTOMER_EMAIL || 'pavangeesala81@gmail.com';
    const testCustomer: User = {
      id: 'usr_cust_001',
      fullName: 'Pavan Geesala',
      email: testCustomerEmail.toLowerCase(),
      mobile: '9876543210',
      role: 'CUSTOMER',
      isVerified: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.users.set(testCustomer.id, testCustomer);
    this.profiles.set(testCustomer.id, {
      id: testCustomer.id,
      fullName: testCustomer.fullName,
      email: testCustomer.email,
      phone: testCustomer.mobile,
      role: 'CUSTOMER',
      createdAt: testCustomer.createdAt,
      updatedAt: testCustomer.updatedAt,
    });

    // 4. Seed Saved Addresses for Test Customer
    this.addresses.set(testCustomer.email, [...initialAddresses]);

    // 4. Seed Batches
    batchRecords.forEach((b, idx) => {
      const entityId = `batch_${b.productId}_${b.batchNumber.toLowerCase()}_${idx}`;
      const entity: BatchEntity = {
        id: entityId,
        batchNumber: b.batchNumber,
        productId: b.productId,
        productName: b.productName,
        cropName: b.cropName || b.productName,
        harvestDate: b.harvestDate,
        manufacturingDate: b.manufacturingDate || b.packagingDate || '2026-08-01',
        expiryDate: b.expiryDate || b.bestBefore || '2027-07-31',
        sourceRegion: b.sourceRegion,
        farmerCluster: b.farmerCluster || b.supplier || 'Regional Organic Cluster',
        supplier: b.supplier || b.farmerCluster || 'Regional Organic Cluster',
        purchaseCost: b.purchaseCost || 50,
        sellingPrice: b.sellingPrice || 150,
        processingDate: b.processingDate,
        millingDate: b.millingDate || b.processingDate,
        qualityPassed: b.qualityPassed ?? (b.qualityCheckStatus === 'Passed'),
        packagingDate: b.packagingDate,
        bestBefore: b.bestBefore,
        moisturePercent: b.moisturePercent,
        totalQuantityKg: b.quantity || b.totalQuantityKg || 1000,
        remainingQuantityKg:
          b.remainingQuantity !== undefined
            ? b.remainingQuantity
            : b.remainingQuantityKg !== undefined
            ? b.remainingQuantityKg
            : b.totalQuantityKg
            ? Math.round(b.totalQuantityKg * 0.8)
            : 800,
        purityPercent: b.purityPercent,
        status: b.status || 'ACTIVE',
        createdAt: new Date().toISOString(),
      };
      this.batches.set(entity.id, entity);
    });

    // 5. Seed Product Catalog (Millets, Spices, Combo Packs)
    products.forEach((p) => {
      let cat: ProductCatalogCategory = 'Millets';
      if (p.category === 'spices' || p.category === 'masalas' || p.category === 'signature') {
        cat = 'Spices';
      } else if (p.category === 'combos') {
        cat = 'Combo Packs';
      }

      const defaultWeight = p.weights && p.weights[0];
      const weightVal = defaultWeight ? (parseInt(defaultWeight.size) || 500) : 500;
      const weightUnit = defaultWeight?.size?.includes('kg') ? 'kg' : 'g';
      const priceVal = defaultWeight?.price || 150;
      const comparePriceVal = defaultWeight?.mrp || (priceVal + 30);

      this.productsList.set(p.id, {
        id: p.id,
        name: p.name,
        slug: p.slug,
        category: cat,
        description: p.description || p.shortDescription,
        images: p.images && p.images.length > 0 ? p.images : ['/images/products/korralu-foxtail-millet.jpg'],
        price: priceVal,
        comparePrice: comparePriceVal,
        weight: weightVal,
        unit: weightUnit,
        isAvailable: defaultWeight?.inStock ?? true,
        status: 'PUBLISHED',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    });

    // 6. Seed Traceable Inventory from Product Catalog Variants
    products.forEach((p) => {
      p.weights.forEach((w) => {
        const sku = `${p.slug.toUpperCase()}-${w.size.replace(/\s+/g, '').toUpperCase()}`;
        const associatedBatch = Array.from(this.batches.values()).find(
          (b) => b.productId === p.id
        )?.batchNumber || 'DG-GEN-2026';

        const stockAmount = w.inStock ? (p.bestseller ? 120 : 65) : 0;

        const item: InventoryEntity = {
          id: `inv_${sku}`,
          sku,
          productId: p.id,
          productName: p.name,
          variant: w.size,
          stockReceived: stockAmount,
          stockReserved: 0,
          stockSold: 0,
          stockAdjusted: 0,
          stockReturned: 0,
          stock: stockAmount,
          reserved: 0,
          threshold: 15,
          status: stockAmount > 15 ? 'In Stock' : stockAmount > 0 ? 'Low Stock' : 'Out of Stock',
          batchNumber: associatedBatch,
          sellingPrice: w.price,
          mrp: w.mrp,
          updatedAt: new Date().toISOString(),
        };
        this.inventory.set(sku, item);

        if (stockAmount > 0) {
          this.transactions.push({
            id: `tx_init_${sku}`,
            sku,
            batchNumber: associatedBatch,
            type: 'STOCK_RECEIVED',
            quantity: stockAmount,
            stockBefore: 0,
            stockAfter: stockAmount,
            referenceId: associatedBatch,
            notes: `Initial harvest stock receipt for ${item.productName} (${w.size})`,
            actorEmail: 'system@dharvikagrains.in',
            actorRole: 'SUPER_ADMIN',
            createdAt: new Date().toISOString(),
          });
        }
      });
    });

    // 6. Seed Coupons
    availableCoupons.forEach((c) => {
      const coupon: CouponEntity = {
        code: c.code.toUpperCase(),
        type: c.discountPercent ? 'PERCENTAGE' : 'FIXED',
        discountPercent: c.discountPercent,
        discountAmount: c.discountAmount,
        minOrderValue: c.minOrderValue,
        description: c.description,
        expiryDate: c.expiryDate || '31 Dec 2026',
        usageLimit: 500,
        timesUsed: 14,
        perUserLimit: 1,
        isActive: true,
      };
      this.coupons.set(coupon.code, coupon);
    });

    // 7. Seed Initial Mock Orders
    mockOrdersList.forEach((o) => {
      const orderEntity: OrderEntity = {
        id: `ord_${o.orderId.toLowerCase()}`,
        orderNumber: o.orderId,
        customerName: o.customerName,
        email: o.email || testCustomerEmail,
        mobile: o.mobile,
        shippingAddressSnapshot: {
          id: 'addr_snap_1',
          type: 'Home',
          fullName: o.customerName,
          mobile: o.mobile,
          pincode: o.shippingAddress.pincode,
          houseFlat: o.shippingAddress.apartment || o.shippingAddress.street,
          streetArea: o.shippingAddress.street,
          city: o.shippingAddress.city,
          state: o.shippingAddress.state,
        },
        billingAddressSnapshot: {
          id: 'addr_snap_1',
          type: 'Home',
          fullName: o.customerName,
          mobile: o.mobile,
          pincode: o.shippingAddress.pincode,
          houseFlat: o.shippingAddress.apartment || o.shippingAddress.street,
          streetArea: o.shippingAddress.street,
          city: o.shippingAddress.city,
          state: o.shippingAddress.state,
        },
        items: o.items.map((it) => ({
          productId: it.productId,
          sku: `${it.slug?.toUpperCase() || 'PROD'}-${it.selectedWeight}`,
          name: it.name,
          localName: it.localName || '',
          selectedWeight: it.selectedWeight,
          price: it.price,
          mrp: it.mrp || it.price,
          quantity: it.quantity,
          image: it.image,
        })),
        subtotal: o.subtotal,
        discount: o.discount || 0,
        shippingFee: o.shippingFee || 0,
        tax: 0,
        total: o.total,
        currency: 'INR',
        paymentStatus: o.paymentStatus.includes('Paid') ? 'PAID' : 'PENDING',
        orderStatus: o.status === 'Delivered' ? 'DELIVERED' : o.status === 'Shipped' ? 'SHIPPED' : 'PROCESSING',
        paymentMethod: o.paymentMethod.toUpperCase().includes('COD') ? 'COD' : 'UPI',
        courierPartner: o.courierPartner || 'BlueDart Express',
        trackingId: o.trackingId || 'BD-IN-88392019',
        estimatedDelivery: o.estimatedDelivery || '24–27 September 2026',
        timeline: [
          { status: 'Order Placed', timestamp: o.date, note: 'Order registered successfully' },
          { status: 'Payment Confirmed', timestamp: o.date, note: 'Verified by Payment Gateway' },
          { status: 'Order Processing', timestamp: o.date, note: 'Cleaned and packed fresh' },
        ],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      this.orders.set(orderEntity.orderNumber, orderEntity);
    });

    // 8. Audit Log
    this.auditLogs.push({
      id: 'aud_001',
      actorEmail: 'system@dharvikagrains.in',
      actorRole: 'SUPER_ADMIN',
      action: 'SYSTEM_INITIALIZED',
      entity: 'DATABASE',
      entityId: 'ROOT',
      details: 'DHARVIKA GRAINS production relational store ready.',
      timestamp: new Date().toISOString(),
    });
  }

  // ===========================================================================
  // User & Customer Management
  // ===========================================================================

  public getUserById(id: string): User | undefined {
    return this.users.get(id);
  }

  public getUserByEmail(email: string): User | undefined {
    const normalized = email.trim().toLowerCase();
    for (const u of this.users.values()) {
      if (u.email.toLowerCase() === normalized) return u;
    }
    return undefined;
  }

  public getUserByMobile(mobile: string): User | undefined {
    const cleanMobile = mobile.replace(/\D/g, '').slice(-10);
    for (const u of this.users.values()) {
      if (u.mobile.replace(/\D/g, '').slice(-10) === cleanMobile) return u;
    }
    return undefined;
  }

  public upsertUser(data: {
    fullName: string;
    email: string;
    mobile: string;
    role?: UserRole;
  }): User {
    const existing = this.getUserByEmail(data.email) || this.getUserByMobile(data.mobile);
    const adminEmail = (process.env.ADMIN_EMAIL || 'dharvikagrains@gmail.com').toLowerCase();

    // Enforce role assignment: Admin email is assigned SUPER_ADMIN once verified; customers are CUSTOMER
    let assignedRole: UserRole = data.role || 'CUSTOMER';
    if (data.email.toLowerCase() === adminEmail) {
      assignedRole = 'SUPER_ADMIN';
    }

    if (existing) {
      existing.fullName = data.fullName || existing.fullName;
      existing.email = data.email.toLowerCase() || existing.email;
      existing.mobile = data.mobile || existing.mobile;
      if (data.email.toLowerCase() === adminEmail) {
        existing.role = 'SUPER_ADMIN';
      }
      existing.updatedAt = new Date().toISOString();
      return existing;
    }

    const newUser: User = {
      id: `usr_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      fullName: data.fullName,
      email: data.email.toLowerCase(),
      mobile: data.mobile,
      role: assignedRole,
      isVerified: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.users.set(newUser.id, newUser);

    this.addAuditLog(
      newUser.email,
      newUser.role,
      'USER_CREATED',
      'USER',
      newUser.id,
      `User ${newUser.fullName} registered with role ${newUser.role}`
    );

    return newUser;
  }

  public getAllCustomers(): User[] {
    return Array.from(this.users.values()).filter((u) => u.role === 'CUSTOMER');
  }

  // ===========================================================================
  // Profiles Management & Multi-Role Authorization (auth.users -> profiles)
  // ===========================================================================

  public getProfileById(id: string, actor?: { id: string; role: string }): ProfileEntity | undefined {
    const profile = this.profiles.get(id);
    if (!profile) return undefined;

    // Authorization check if actor is provided
    if (actor) {
      if (actor.role === 'CUSTOMER' && actor.id !== id) {
        // Customer cannot access another customer's profile
        return undefined;
      }
    }
    return profile;
  }

  public getProfileByEmail(email: string, actor?: { id: string; role: string }): ProfileEntity | undefined {
    const normalized = email.trim().toLowerCase();
    for (const p of this.profiles.values()) {
      if (p.email.toLowerCase() === normalized) {
        if (actor && actor.role === 'CUSTOMER' && actor.id !== p.id) {
          return undefined;
        }
        return p;
      }
    }
    return undefined;
  }

  public getAllProfiles(actor?: { id: string; role: string }): ProfileEntity[] {
    // Only ADMIN or OWNER can view all profiles
    if (actor && actor.role === 'CUSTOMER') {
      const own = this.profiles.get(actor.id);
      return own ? [own] : [];
    }
    return Array.from(this.profiles.values());
  }

  public upsertProfile(data: {
    id: string;
    fullName?: string;
    email?: string;
    phone?: string;
    avatarUrl?: string;
    role?: 'CUSTOMER' | 'ADMIN' | 'OWNER';
  }): ProfileEntity {
    const existing = this.profiles.get(data.id);
    const now = new Date().toISOString();

    if (existing) {
      existing.fullName = data.fullName ?? existing.fullName;
      existing.email = data.email ?? existing.email;
      existing.phone = data.phone ?? existing.phone;
      if (data.avatarUrl !== undefined) existing.avatarUrl = data.avatarUrl;
      if (data.role) existing.role = data.role;
      existing.updatedAt = now;
      return existing;
    }

    const newProfile: ProfileEntity = {
      id: data.id,
      fullName: data.fullName || '',
      email: data.email || '',
      phone: data.phone || '',
      avatarUrl: data.avatarUrl,
      role: data.role || 'CUSTOMER',
      createdAt: now,
      updatedAt: now,
    };
    this.profiles.set(newProfile.id, newProfile);
    return newProfile;
  }

  public updateProfile(
    id: string,
    updates: {
      fullName?: string;
      email?: string;
      phone?: string;
      avatarUrl?: string;
      role?: 'CUSTOMER' | 'ADMIN' | 'OWNER';
    },
    actor?: { id: string; role: string }
  ): { success: boolean; profile?: ProfileEntity; error?: string } {
    const profile = this.profiles.get(id);
    if (!profile) {
      return { success: false, error: 'Profile not found' };
    }

    if (actor) {
      // 1. CUSTOMER role checks:
      if (actor.role === 'CUSTOMER') {
        if (actor.id !== id) {
          return { success: false, error: 'Unauthorized: Cannot access or update another customer\'s profile' };
        }
        if (updates.role && updates.role !== profile.role) {
          return { success: false, error: 'Unauthorized: Customers cannot change their own role' };
        }
      }

      // 2. ADMIN role checks:
      if (actor.role === 'ADMIN') {
        if (profile.role === 'OWNER') {
          return { success: false, error: 'Unauthorized: Admins cannot modify Owner profiles' };
        }
        if (updates.role === 'OWNER') {
          return { success: false, error: 'Unauthorized: Admins cannot promote users to Owner' };
        }
      }

      // 3. OWNER can modify all profiles and roles
    }

    if (updates.fullName !== undefined) profile.fullName = updates.fullName;
    if (updates.email !== undefined) profile.email = updates.email;
    if (updates.phone !== undefined) profile.phone = updates.phone;
    if (updates.avatarUrl !== undefined) profile.avatarUrl = updates.avatarUrl;
    if (updates.role !== undefined && (!actor || actor.role === 'OWNER' || (actor.role === 'ADMIN' && updates.role !== 'OWNER'))) {
      profile.role = updates.role;
    }
    profile.updatedAt = new Date().toISOString();

    return { success: true, profile };
  }

  public deleteProfile(
    id: string,
    actor?: { id: string; role: string }
  ): { success: boolean; error?: string } {
    if (actor && actor.role !== 'OWNER' && actor.role !== 'SUPER_ADMIN') {
      return { success: false, error: 'Unauthorized: Only an OWNER can delete profiles' };
    }
    const existed = this.profiles.delete(id);
    return { success: existed };
  }

  // ===========================================================================
  // Product Catalog System & Row Level Security
  // ===========================================================================

  public getProducts(
    filters?: { category?: string; status?: string; search?: string },
    actor?: { id: string; role: string }
  ): ProductEntity[] {
    const isPrivileged = actor && (actor.role === 'ADMIN' || actor.role === 'OWNER' || actor.role === 'SUPER_ADMIN');
    let list = Array.from(this.productsList.values());

    // RLS Enforcement: Customers & Public can ONLY view PUBLISHED products
    if (!isPrivileged) {
      list = list.filter((p) => p.status === 'PUBLISHED');
    } else if (filters?.status) {
      list = list.filter((p) => p.status === filters.status);
    }

    if (filters?.category && filters.category !== 'all') {
      const catLower = filters.category.toLowerCase();
      list = list.filter((p) => {
        if (catLower === 'millets') return p.category === 'Millets';
        if (catLower === 'spices') return p.category === 'Spices';
        if (catLower === 'combos' || catLower === 'combo packs') return p.category === 'Combo Packs';
        return p.category.toLowerCase() === catLower;
      });
    }

    if (filters?.search && filters.search.trim()) {
      const q = filters.search.toLowerCase().trim();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q)
      );
    }

    return list;
  }

  public getProductBySlug(slug: string, actor?: { id: string; role: string }): ProductEntity | undefined {
    const isPrivileged = actor && (actor.role === 'ADMIN' || actor.role === 'OWNER' || actor.role === 'SUPER_ADMIN');
    const cleanSlug = slug.toLowerCase().trim();
    for (const p of this.productsList.values()) {
      if (p.slug.toLowerCase() === cleanSlug) {
        if (!isPrivileged && p.status !== 'PUBLISHED') {
          return undefined; // RLS: hidden from regular users
        }
        return p;
      }
    }
    return undefined;
  }

  public getProductById(id: string, actor?: { id: string; role: string }): ProductEntity | undefined {
    const isPrivileged = actor && (actor.role === 'ADMIN' || actor.role === 'OWNER' || actor.role === 'SUPER_ADMIN');
    const product = this.productsList.get(id);
    if (!product) return undefined;
    if (!isPrivileged && product.status !== 'PUBLISHED') {
      return undefined;
    }
    return product;
  }

  public createProduct(
    data: Omit<ProductEntity, 'id' | 'createdAt' | 'updatedAt'>,
    actor?: { id: string; role: string }
  ): { success: boolean; product?: ProductEntity; error?: string } {
    if (!actor || (!isAdmin(actor.role) && !isOwner(actor.role))) {
      return { success: false, error: 'Unauthorized: Admin or Owner role required to create products' };
    }

    if (!data.name || !data.slug || !data.category || data.price === undefined) {
      return { success: false, error: 'Missing required product fields (name, slug, category, price)' };
    }

    // Check slug uniqueness
    for (const existing of this.productsList.values()) {
      if (existing.slug.toLowerCase() === data.slug.toLowerCase()) {
        return { success: false, error: 'Product slug already exists' };
      }
    }

    const now = new Date().toISOString();
    const newProduct: ProductEntity = {
      id: `prod_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      name: data.name,
      slug: data.slug.toLowerCase().trim(),
      category: data.category,
      description: data.description || '',
      images: data.images && data.images.length > 0 ? data.images : ['/images/products/korralu-foxtail-millet.jpg'],
      price: Number(data.price),
      comparePrice: data.comparePrice ? Number(data.comparePrice) : undefined,
      weight: data.weight ? Number(data.weight) : 500,
      unit: data.unit || 'g',
      isAvailable: data.isAvailable ?? true,
      status: data.status || 'PUBLISHED',
      createdAt: now,
      updatedAt: now,
    };

    this.productsList.set(newProduct.id, newProduct);

    this.addAuditLog(
      actor.id,
      actor.role,
      'PRODUCT_CREATED',
      'PRODUCT',
      newProduct.id,
      `Product ${newProduct.name} created by ${actor.role} (${actor.id})`
    );

    return { success: true, product: newProduct };
  }

  public updateProduct(
    id: string,
    updates: Partial<ProductEntity>,
    actor?: { id: string; role: string }
  ): { success: boolean; product?: ProductEntity; error?: string } {
    if (!actor || (!isAdmin(actor.role) && !isOwner(actor.role))) {
      return { success: false, error: 'Unauthorized: Admin or Owner role required to update products' };
    }

    const product = this.productsList.get(id);
    if (!product) {
      return { success: false, error: 'Product not found' };
    }

    if (updates.name !== undefined) product.name = updates.name;
    if (updates.slug !== undefined) product.slug = updates.slug.toLowerCase().trim();
    if (updates.category !== undefined) product.category = updates.category;
    if (updates.description !== undefined) product.description = updates.description;
    if (updates.images !== undefined) product.images = updates.images;
    if (updates.price !== undefined) product.price = Number(updates.price);
    if (updates.comparePrice !== undefined) product.comparePrice = Number(updates.comparePrice);
    if (updates.weight !== undefined) product.weight = Number(updates.weight);
    if (updates.unit !== undefined) product.unit = updates.unit;
    if (updates.isAvailable !== undefined) product.isAvailable = updates.isAvailable;
    if (updates.status !== undefined) product.status = updates.status;
    product.updatedAt = new Date().toISOString();

    this.addAuditLog(
      actor.id,
      actor.role,
      'PRODUCT_UPDATED',
      'PRODUCT',
      product.id,
      `Product ${product.name} updated by ${actor.role}`
    );

    return { success: true, product };
  }

  public archiveProduct(
    id: string,
    actor?: { id: string; role: string }
  ): { success: boolean; product?: ProductEntity; error?: string } {
    if (!actor || (!isAdmin(actor.role) && !isOwner(actor.role))) {
      return { success: false, error: 'Unauthorized: Admin or Owner role required to archive products' };
    }

    const product = this.productsList.get(id);
    if (!product) {
      return { success: false, error: 'Product not found' };
    }

    product.status = 'ARCHIVED';
    product.isAvailable = false;
    product.updatedAt = new Date().toISOString();

    this.addAuditLog(
      actor.id,
      actor.role,
      'PRODUCT_ARCHIVED',
      'PRODUCT',
      product.id,
      `Product ${product.name} archived by ${actor.role}`
    );

    return { success: true, product };
  }

  // ===========================================================================
  // Address Book Management
  // ===========================================================================

  public getAddresses(email: string): SavedAddress[] {
    return this.addresses.get(email.toLowerCase()) || [];
  }

  public saveAddress(email: string, address: Omit<SavedAddress, 'id'> & { id?: string }): SavedAddress {
    const normalized = email.toLowerCase();
    const existingList = this.getAddresses(normalized);
    const addressId = address.id || `addr_${Date.now()}`;

    const newAddress: SavedAddress = {
      ...address,
      id: addressId,
      fullName: address.fullName.trim(),
      mobile: address.mobile.trim(),
      pincode: address.pincode.trim(),
    };

    const index = existingList.findIndex((a) => a.id === addressId);
    let updated: SavedAddress[];

    if (index >= 0) {
      updated = [...existingList];
      updated[index] = newAddress;
    } else {
      updated = [newAddress, ...existingList];
    }

    this.addresses.set(normalized, updated);
    return newAddress;
  }

  public deleteAddress(email: string, addressId: string): boolean {
    const normalized = email.toLowerCase();
    const existingList = this.getAddresses(normalized);
    const filtered = existingList.filter((a) => a.id !== addressId);
    this.addresses.set(normalized, filtered);
    return true;
  }

  // ===========================================================================
  // Inventory Control, Batch Traceability & Ledger Transactions
  // ===========================================================================

  public isBatchExpired(batch: BatchEntity): boolean {
    if (batch.status === 'EXPIRED') return true;
    if (new Date(batch.expiryDate).getTime() < Date.now()) {
      batch.status = 'EXPIRED';
      return true;
    }
    return false;
  }

  public getInventory(): InventoryEntity[] {
    return Array.from(this.inventory.values());
  }

  public getInventoryItem(sku: string): InventoryEntity | undefined {
    return this.inventory.get(sku.toUpperCase());
  }

  /**
   * Admin / Owner: Add verified stock linked to a specific Batch
   */
  public addStock(
    sku: string,
    quantity: number,
    batchNumber: string,
    actor: { id: string; role: string; email: string },
    notes?: string
  ): { success: boolean; inventory?: InventoryEntity; error?: string } {
    if (!isAdmin(actor.role) && !isOwner(actor.role)) {
      return { success: false, error: 'Unauthorized: Admin or Owner role required to manage inventory' };
    }

    if (!quantity || isNaN(quantity) || quantity <= 0 || !Number.isInteger(quantity)) {
      return { success: false, error: 'Invalid quantity: Stock addition must be a positive integer' };
    }

    const inv = this.inventory.get(sku.toUpperCase());
    if (!inv) {
      return { success: false, error: `SKU ${sku} not found in inventory` };
    }

    const batch = this.getBatch(batchNumber);
    if (!batch) {
      return { success: false, error: `Batch ${batchNumber} not found` };
    }

    if (this.isBatchExpired(batch)) {
      return { success: false, error: `Expired batch: Cannot add stock from expired batch ${batchNumber} (expired on ${batch.expiryDate})` };
    }

    const before = inv.stock;
    inv.stockReceived += quantity;
    inv.batchNumber = batch.batchNumber;
    inv.stock = (inv.stockReceived + inv.stockReturned + inv.stockAdjusted) - (inv.stockReserved + inv.stockSold);
    inv.reserved = inv.stockReserved;
    inv.status = inv.stock > inv.threshold ? 'In Stock' : inv.stock > 0 ? 'Low Stock' : 'Out of Stock';
    inv.updatedAt = new Date().toISOString();

    this.transactions.push({
      id: `tx_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      sku: inv.sku,
      batchNumber: batch.batchNumber,
      type: 'STOCK_RECEIVED',
      quantity,
      stockBefore: before,
      stockAfter: inv.stock,
      referenceId: batch.batchNumber,
      notes: notes || `Stock received from Batch ${batch.batchNumber}`,
      actorEmail: actor.email,
      actorRole: actor.role,
      createdAt: new Date().toISOString(),
    });

    this.addAuditLog(
      actor.email,
      actor.role,
      'STOCK_ADDED',
      'INVENTORY',
      inv.sku,
      `Received ${quantity} units for ${inv.sku} from batch ${batch.batchNumber} (${before} -> ${inv.stock})`
    );

    return { success: true, inventory: inv };
  }

  /**
   * Admin / Owner: Deduct stock with traceable transaction
   */
  public deductStock(
    sku: string,
    quantity: number,
    type: 'STOCK_SOLD' | 'STOCK_ADJUSTED',
    actor: { id: string; role: string; email: string },
    referenceId?: string,
    notes?: string
  ): { success: boolean; inventory?: InventoryEntity; error?: string } {
    if (!isAdmin(actor.role) && !isOwner(actor.role)) {
      return { success: false, error: 'Unauthorized: Admin or Owner role required to manage inventory' };
    }

    if (!quantity || isNaN(quantity) || quantity <= 0 || !Number.isInteger(quantity)) {
      return { success: false, error: 'Invalid quantity: Stock deduction must be a positive integer' };
    }

    const inv = this.inventory.get(sku.toUpperCase());
    if (!inv) {
      return { success: false, error: `SKU ${sku} not found in inventory` };
    }

    if (inv.stock < quantity) {
      return {
        success: false,
        error: `Insufficient stock: Cannot deduct ${quantity} units. Only ${inv.stock} available for SKU ${sku}`,
      };
    }

    const before = inv.stock;
    if (type === 'STOCK_SOLD') {
      inv.stockSold += quantity;
    } else {
      inv.stockAdjusted -= quantity;
    }

    inv.stock = (inv.stockReceived + inv.stockReturned + inv.stockAdjusted) - (inv.stockReserved + inv.stockSold);
    inv.reserved = inv.stockReserved;
    inv.status = inv.stock > inv.threshold ? 'In Stock' : inv.stock > 0 ? 'Low Stock' : 'Out of Stock';
    inv.updatedAt = new Date().toISOString();

    this.transactions.push({
      id: `tx_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      sku: inv.sku,
      batchNumber: inv.batchNumber,
      type,
      quantity: -quantity,
      stockBefore: before,
      stockAfter: inv.stock,
      referenceId: referenceId || 'MANUAL',
      notes: notes || `Stock deduction of ${quantity} units (${type})`,
      actorEmail: actor.email,
      actorRole: actor.role,
      createdAt: new Date().toISOString(),
    });

    this.addAuditLog(
      actor.email,
      actor.role,
      'STOCK_DEDUCTED',
      'INVENTORY',
      inv.sku,
      `Deducted ${quantity} units from ${inv.sku} (${before} -> ${inv.stock}). Reason: ${notes || type}`
    );

    return { success: true, inventory: inv };
  }

  /**
   * Return customer items back into salable stock
   */
  public returnStock(
    sku: string,
    quantity: number,
    orderNumber: string,
    actor: { id: string; role: string; email: string },
    notes?: string
  ): { success: boolean; inventory?: InventoryEntity; error?: string } {
    if (!isAdmin(actor.role) && !isOwner(actor.role)) {
      return { success: false, error: 'Unauthorized: Admin or Owner role required to return stock' };
    }

    if (!quantity || isNaN(quantity) || quantity <= 0 || !Number.isInteger(quantity)) {
      return { success: false, error: 'Invalid quantity: Returned quantity must be a positive integer' };
    }

    const inv = this.inventory.get(sku.toUpperCase());
    if (!inv) {
      return { success: false, error: `SKU ${sku} not found in inventory` };
    }

    const before = inv.stock;
    inv.stockReturned += quantity;
    inv.stock = (inv.stockReceived + inv.stockReturned + inv.stockAdjusted) - (inv.stockReserved + inv.stockSold);
    inv.reserved = inv.stockReserved;
    inv.status = inv.stock > inv.threshold ? 'In Stock' : inv.stock > 0 ? 'Low Stock' : 'Out of Stock';
    inv.updatedAt = new Date().toISOString();

    this.transactions.push({
      id: `tx_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      sku: inv.sku,
      batchNumber: inv.batchNumber,
      type: 'STOCK_RETURNED',
      quantity,
      stockBefore: before,
      stockAfter: inv.stock,
      referenceId: orderNumber,
      notes: notes || `Customer return restocked for Order #${orderNumber}`,
      actorEmail: actor.email,
      actorRole: actor.role,
      createdAt: new Date().toISOString(),
    });

    return { success: true, inventory: inv };
  }

  /**
   * Atomically reserve inventory during checkout initialization.
   * Checks batch expiration and prevents overselling across simultaneous checkouts.
   */
  public reserveInventory(
    items: { sku: string; quantity: number }[],
    orderNumber: string
  ): { success: boolean; error?: string } {
    if (!items || items.length === 0) {
      return { success: false, error: 'No items provided for reservation' };
    }

    // 1. Verify all items exist, quantities are positive, batch is valid, and stock is available
    for (const item of items) {
      if (!item.quantity || item.quantity <= 0 || !Number.isInteger(item.quantity)) {
        return { success: false, error: `Invalid quantity for SKU ${item.sku}: Must be positive integer` };
      }

      const inv = this.inventory.get(item.sku.toUpperCase());
      if (!inv) {
        return { success: false, error: `SKU ${item.sku} not found in inventory` };
      }

      // Check batch expiration
      if (inv.batchNumber) {
        const batch = this.getBatch(inv.batchNumber);
        if (batch && this.isBatchExpired(batch)) {
          return {
            success: false,
            error: `Expired batch: Cannot reserve SKU ${item.sku} from expired batch ${inv.batchNumber}`,
          };
        }
      }

      const available = inv.stock - inv.stockReserved;
      if (available < item.quantity) {
        return {
          success: false,
          error: `Insufficient stock for ${inv.productName} (${inv.variant}). Only ${available} available.`,
        };
      }
    }

    // 2. Perform atomic reservation
    for (const item of items) {
      const inv = this.inventory.get(item.sku.toUpperCase())!;
      const before = inv.stock;
      inv.stockReserved += item.quantity;
      inv.reserved = inv.stockReserved;
      inv.stock = (inv.stockReceived + inv.stockReturned + inv.stockAdjusted) - (inv.stockReserved + inv.stockSold);
      inv.updatedAt = new Date().toISOString();

      this.transactions.push({
        id: `tx_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        sku: inv.sku,
        batchNumber: inv.batchNumber,
        type: 'STOCK_RESERVED',
        quantity: item.quantity,
        stockBefore: before,
        stockAfter: inv.stock,
        referenceId: orderNumber,
        notes: `Reserved ${item.quantity} units for Order #${orderNumber}`,
        actorEmail: 'system@dharvikagrains.in',
        actorRole: 'SYSTEM',
        createdAt: new Date().toISOString(),
      });
    }

    return { success: true };
  }

  /**
   * Release reserved inventory if payment fails, is cancelled, or order expires.
   */
  public releaseInventory(items: { sku: string; quantity: number }[], orderNumber: string) {
    for (const item of items) {
      const inv = this.inventory.get(item.sku.toUpperCase());
      if (inv) {
        const before = inv.stock;
        inv.stockReserved = Math.max(0, inv.stockReserved - item.quantity);
        inv.reserved = inv.stockReserved;
        inv.stock = (inv.stockReceived + inv.stockReturned + inv.stockAdjusted) - (inv.stockReserved + inv.stockSold);
        inv.updatedAt = new Date().toISOString();

        this.transactions.push({
          id: `tx_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
          sku: inv.sku,
          batchNumber: inv.batchNumber,
          type: 'STOCK_RELEASED',
          quantity: item.quantity,
          stockBefore: before,
          stockAfter: inv.stock,
          referenceId: orderNumber,
          notes: `Released reservation of ${item.quantity} units for Order #${orderNumber}`,
          actorEmail: 'system@dharvikagrains.in',
          actorRole: 'SYSTEM',
          createdAt: new Date().toISOString(),
        });
      }
    }
  }

  /**
   * Commit reserved stock into permanently sold stock upon confirmed payment.
   */
  public commitInventory(items: { sku: string; quantity: number }[], orderNumber: string) {
    for (const item of items) {
      const inv = this.inventory.get(item.sku.toUpperCase());
      if (inv) {
        const before = inv.stock;
        inv.stockReserved = Math.max(0, inv.stockReserved - item.quantity);
        inv.stockSold += item.quantity;
        inv.reserved = inv.stockReserved;
        inv.stock = (inv.stockReceived + inv.stockReturned + inv.stockAdjusted) - (inv.stockReserved + inv.stockSold);
        inv.status =
          inv.stock > inv.threshold ? 'In Stock' : inv.stock > 0 ? 'Low Stock' : 'Out of Stock';
        inv.updatedAt = new Date().toISOString();

        this.transactions.push({
          id: `tx_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
          sku: inv.sku,
          batchNumber: inv.batchNumber,
          type: 'STOCK_SOLD',
          quantity: item.quantity,
          stockBefore: before,
          stockAfter: inv.stock,
          referenceId: orderNumber,
          notes: `Deducted ${item.quantity} sold units for confirmed Order #${orderNumber}`,
          actorEmail: 'system@dharvikagrains.in',
          actorRole: 'SYSTEM',
          createdAt: new Date().toISOString(),
        });
      }
    }
  }

  /**
   * Admin manual stock adjustment with required audit record.
   */
  public adjustStock(
    sku: string,
    delta: number,
    reason: string,
    actorEmail: string
  ): InventoryEntity {
    const inv = this.inventory.get(sku.toUpperCase());
    if (!inv) throw new Error(`SKU ${sku} not found`);

    if (delta === 0) throw new Error('Adjustment delta cannot be zero');

    if (inv.stock + delta < 0) {
      throw new Error(`Cannot adjust stock below zero. Current stock is ${inv.stock}, adjustment is ${delta}`);
    }

    const before = inv.stock;
    inv.stockAdjusted += delta;
    inv.stock = (inv.stockReceived + inv.stockReturned + inv.stockAdjusted) - (inv.stockReserved + inv.stockSold);
    inv.reserved = inv.stockReserved;
    inv.status =
      inv.stock > inv.threshold ? 'In Stock' : inv.stock > 0 ? 'Low Stock' : 'Out of Stock';
    inv.updatedAt = new Date().toISOString();

    this.transactions.push({
      id: `tx_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      sku: inv.sku,
      batchNumber: inv.batchNumber,
      type: 'STOCK_ADJUSTED',
      quantity: delta,
      stockBefore: before,
      stockAfter: inv.stock,
      notes: `Manual stock adjustment by ${actorEmail}: ${reason}`,
      actorEmail,
      actorRole: 'INVENTORY_MANAGER',
      createdAt: new Date().toISOString(),
    });

    this.addAuditLog(
      actorEmail,
      'INVENTORY_MANAGER',
      'STOCK_ADJUSTED',
      'INVENTORY',
      inv.sku,
      `Adjusted ${inv.sku} by ${delta} (${before} -> ${inv.stock}). Reason: ${reason}`
    );

    return inv;
  }

  public getInventoryTransactions(sku?: string): InventoryTransaction[] {
    const list = sku
      ? this.transactions.filter((t) => t.sku.toUpperCase() === sku.toUpperCase())
      : this.transactions;
    return [...list].reverse();
  }

  // ===========================================================================
  // Coupon Verification & Redemption
  // ===========================================================================

  public validateCoupon(
    code: string,
    subtotal: number,
    customerEmail?: string
  ): { valid: boolean; coupon?: CouponEntity; discount: number; message: string } {
    const coupon = this.coupons.get(code.toUpperCase());
    if (!coupon || !coupon.isActive) {
      return { valid: false, discount: 0, message: 'Invalid or inactive coupon code.' };
    }

    if (subtotal < coupon.minOrderValue) {
      return {
        valid: false,
        discount: 0,
        message: `Minimum order value of ₹${coupon.minOrderValue} required for ${coupon.code}`,
      };
    }

    if (coupon.timesUsed >= coupon.usageLimit) {
      return { valid: false, discount: 0, message: 'Coupon usage limit has been reached.' };
    }

    if (customerEmail) {
      const userUsage = this.couponUsages.filter(
        (u) =>
          u.couponCode === coupon.code &&
          u.customerEmail.toLowerCase() === customerEmail.toLowerCase()
      ).length;
      if (userUsage >= coupon.perUserLimit) {
        return {
          valid: false,
          discount: 0,
          message: `You have already redeemed coupon ${coupon.code}.`,
        };
      }
    }

    let discount = 0;
    if (coupon.type === 'PERCENTAGE' && coupon.discountPercent) {
      discount = Math.round((subtotal * coupon.discountPercent) / 100);
      if (coupon.maxDiscount && discount > coupon.maxDiscount) {
        discount = coupon.maxDiscount;
      }
    } else if (coupon.discountAmount) {
      discount = coupon.discountAmount;
    }

    return {
      valid: true,
      coupon,
      discount,
      message: `Coupon ${coupon.code} applied successfully! Saved ₹${discount}`,
    };
  }

  public redeemCoupon(code: string, customerEmail: string, orderNumber: string, discount: number) {
    const coupon = this.coupons.get(code.toUpperCase());
    if (coupon) {
      coupon.timesUsed += 1;
      this.couponUsages.push({
        id: `cuse_${Date.now()}`,
        couponCode: coupon.code,
        customerEmail: customerEmail.toLowerCase(),
        orderNumber,
        discountApplied: discount,
        usedAt: new Date().toISOString(),
      });
    }
  }

  public getAllCoupons(): CouponEntity[] {
    return Array.from(this.coupons.values());
  }

  public createOrUpdateCoupon(coupon: CouponEntity, actorEmail: string): CouponEntity {
    coupon.code = coupon.code.toUpperCase();
    this.coupons.set(coupon.code, coupon);

    this.addAuditLog(
      actorEmail,
      'ADMIN',
      'COUPON_SAVED',
      'COUPON',
      coupon.code,
      `Coupon ${coupon.code} created/updated with discount ${coupon.discountPercent || coupon.discountAmount}`
    );

    return coupon;
  }

  // ===========================================================================
  // Order Management (Server-Side Price Validation & Price Snapshots)
  // ===========================================================================

  /**
   * Create an order with SERVER-SIDE recalculation of prices.
   * Never trusts prices sent from the client.
   */
  public createOrderWithPriceSnapshot(data: {
    customerId?: string;
    customerName: string;
    email: string;
    mobile: string;
    shippingAddress: SavedAddress;
    billingAddress?: SavedAddress;
    items: { productId: string; selectedWeight: string; quantity: number }[];
    couponCode?: string;
    paymentMethod: 'UPI' | 'CARD' | 'NETBANKING' | 'WALLET' | 'COD' | 'RAZORPAY';
  }): { success: boolean; order?: OrderEntity; error?: string } {
    if (!data.items || data.items.length === 0) {
      return { success: false, error: 'Cannot create order with empty items.' };
    }

    // 1. Build Item Snapshots with Server-Side Recalculated Prices
    const itemSnapshots: OrderItemSnapshot[] = [];
    const reservationItems: { sku: string; quantity: number }[] = [];
    let serverSubtotal = 0;

    for (const item of data.items) {
      const product = products.find((p) => p.id === item.productId || p.slug === item.productId);
      if (!product) {
        return { success: false, error: `Product ${item.productId} does not exist.` };
      }

      const weightOption = product.weights.find((w) => w.size === item.selectedWeight) || product.weights[0];
      const sku = `${product.slug.toUpperCase()}-${weightOption.size.replace(/\s+/g, '').toUpperCase()}`;

      const verifiedPrice = weightOption.price;
      const verifiedMrp = weightOption.mrp;
      const lineTotal = verifiedPrice * item.quantity;
      serverSubtotal += lineTotal;

      itemSnapshots.push({
        productId: product.id,
        sku,
        name: product.name,
        localName: product.localName,
        selectedWeight: weightOption.size,
        price: verifiedPrice,
        mrp: verifiedMrp,
        quantity: item.quantity,
        image: product.images[0],
      });

      reservationItems.push({
        sku,
        quantity: item.quantity,
      });
    }

    // 2. Server-side Shipping Fee Calculation
    const freeShippingThreshold = 500;
    const flatShippingRate = 49;
    const shippingFee = serverSubtotal >= freeShippingThreshold ? 0 : flatShippingRate;

    // 3. Server-side Coupon Discount Validation
    let discount = 0;
    let validatedCouponCode: string | undefined = undefined;

    if (data.couponCode) {
      const couponCheck = this.validateCoupon(data.couponCode, serverSubtotal, data.email);
      if (couponCheck.valid) {
        discount = couponCheck.discount;
        validatedCouponCode = couponCheck.coupon?.code;
      }
    }

    const total = Math.max(0, serverSubtotal + shippingFee - discount);

    // 4. Generate Unique Order Number
    const orderSequence = Math.floor(1000 + Math.random() * 9000);
    const orderNumber = `DG-${new Date().getFullYear()}-${orderSequence}`;

    // 5. Atomically Reserve Inventory
    const reserveResult = this.reserveInventory(reservationItems, orderNumber);
    if (!reserveResult.success) {
      return { success: false, error: reserveResult.error };
    }

    // 6. Persist Order Entity
    const newOrder: OrderEntity = {
      id: `ord_${orderNumber.toLowerCase()}`,
      orderNumber,
      customerId: data.customerId,
      customerName: data.customerName,
      email: data.email.toLowerCase(),
      mobile: data.mobile,
      shippingAddressSnapshot: data.shippingAddress,
      billingAddressSnapshot: data.billingAddress || data.shippingAddress,
      items: itemSnapshots,
      subtotal: serverSubtotal,
      discount,
      shippingFee,
      tax: 0,
      total,
      currency: 'INR',
      paymentStatus: 'PENDING',
      orderStatus: 'PENDING_PAYMENT',
      paymentMethod: data.paymentMethod,
      couponCode: validatedCouponCode,
      estimatedDelivery: '24–27 September 2026',
      timeline: [
        {
          status: 'Order Placed',
          timestamp: new Date().toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
          }),
          note: 'Awaiting payment verification',
        },
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.orders.set(orderNumber, newOrder);

    // Also link user
    this.upsertUser({
      fullName: data.customerName,
      email: data.email,
      mobile: data.mobile,
      role: 'CUSTOMER',
    });

    return { success: true, order: newOrder };
  }

  public getOrder(orderIdOrNumber: string): OrderEntity | undefined {
    const cleaned = orderIdOrNumber.toUpperCase().trim();
    // Check direct orderNumber
    if (this.orders.has(cleaned)) return this.orders.get(cleaned);

    // Check with DG prefix or search
    for (const order of this.orders.values()) {
      if (
        order.orderNumber.toUpperCase() === cleaned ||
        order.id.toUpperCase() === cleaned ||
        order.orderNumber.replace(/[^a-zA-Z0-9]/g, '').toUpperCase() ===
          cleaned.replace(/[^a-zA-Z0-9]/g, '')
      ) {
        return order;
      }
    }
    return undefined;
  }

  public getOrdersForCustomer(
    criteria: { id?: string; email?: string; mobile?: string } | string
  ): OrderEntity[] {
    if (typeof criteria === 'object' && criteria !== null) {
      const cleanId = criteria.id?.trim().toLowerCase();
      const cleanEmail = criteria.email?.trim().toLowerCase();
      const rawMobile = criteria.mobile?.replace(/\D/g, '');
      const cleanMobile = rawMobile && rawMobile.length >= 10 ? rawMobile.slice(-10) : '';

      return Array.from(this.orders.values())
        .filter((o) => {
          const matchesId = Boolean(cleanId && o.customerId && o.customerId.toLowerCase() === cleanId);
          const matchesEmail = Boolean(cleanEmail && o.email && o.email.toLowerCase() === cleanEmail);
          const orderMobile = o.mobile ? o.mobile.replace(/\D/g, '').slice(-10) : '';
          const matchesMobile = Boolean(cleanMobile && orderMobile && orderMobile === cleanMobile);
          return matchesId || matchesEmail || matchesMobile;
        })
        .reverse();
    }

    const clean = criteria.trim().toLowerCase();
    const rawPhone = criteria.replace(/\D/g, '');
    const cleanPhone = rawPhone.length >= 10 ? rawPhone.slice(-10) : '';

    return Array.from(this.orders.values())
      .filter((o) => {
        const matchesCustomerId = Boolean(o.customerId && o.customerId.toLowerCase() === clean);
        const matchesEmail = Boolean(o.email && o.email.toLowerCase() === clean);
        const orderPhone = o.mobile ? o.mobile.replace(/\D/g, '').slice(-10) : '';
        const matchesMobile = Boolean(cleanPhone && orderPhone && orderPhone === cleanPhone);
        return matchesCustomerId || matchesEmail || matchesMobile;
      })
      .reverse();
  }

  public getAllOrders(): OrderEntity[] {
    return Array.from(this.orders.values()).reverse();
  }

  public updateOrderStatus(
    orderNumber: string,
    status: OrderStatus,
    meta?: { courierPartner?: string; trackingId?: string; awbNumber?: string; note?: string }
  ): OrderEntity {
    const order = this.getOrder(orderNumber);
    if (!order) throw new Error(`Order ${orderNumber} not found.`);

    order.orderStatus = status;
    if (meta?.courierPartner) order.courierPartner = meta.courierPartner;
    if (meta?.trackingId) order.trackingId = meta.trackingId;
    if (meta?.awbNumber) order.awbNumber = meta.awbNumber;

    order.timeline.push({
      status,
      timestamp: new Date().toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      }),
      note: meta?.note || `Status updated to ${status}`,
    });

    order.updatedAt = new Date().toISOString();
    return order;
  }

  public markOrderAsPaid(
    orderNumber: string,
    paymentDetails: {
      razorpayPaymentId?: string;
      razorpayOrderId?: string;
      signature?: string;
      method?: string;
    }
  ): OrderEntity {
    const order = this.getOrder(orderNumber);
    if (!order) throw new Error(`Order ${orderNumber} not found.`);

    if (order.paymentStatus === 'PAID') {
      return order; // Idempotent
    }

    order.paymentStatus = 'PAID';
    order.orderStatus = 'PROCESSING';
    order.razorpayPaymentId = paymentDetails.razorpayPaymentId;
    order.razorpayOrderId = paymentDetails.razorpayOrderId;
    order.updatedAt = new Date().toISOString();

    order.timeline.push({
      status: 'Payment Confirmed',
      timestamp: new Date().toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      }),
      note: `Verified via Razorpay (Tx: ${paymentDetails.razorpayPaymentId || 'CONFIRMED'})`,
    });

    // Commit inventory reservation into sold stock
    const reservationItems = order.items.map((it) => ({
      sku: it.sku,
      quantity: it.quantity,
    }));
    this.commitInventory(reservationItems, order.orderNumber);

    // Record coupon usage if applied
    if (order.couponCode) {
      this.redeemCoupon(order.couponCode, order.email, order.orderNumber, order.discount);
    }

    // Save payment entity
    const paymentEntity: PaymentEntity = {
      id: `pay_${Date.now()}`,
      orderId: order.id,
      orderNumber: order.orderNumber,
      amount: order.total * 100, // In paise
      currency: 'INR',
      provider: 'RAZORPAY',
      razorpayOrderId: paymentDetails.razorpayOrderId,
      razorpayPaymentId: paymentDetails.razorpayPaymentId,
      signature: paymentDetails.signature,
      status: 'PAID',
      method: paymentDetails.method || 'UPI',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.payments.set(order.orderNumber, paymentEntity);

    this.addAuditLog(
      order.email,
      'CUSTOMER',
      'PAYMENT_CAPTURED',
      'ORDER',
      order.orderNumber,
      `Payment of ₹${order.total} confirmed for Order ${order.orderNumber}`
    );

    return order;
  }

  // ===========================================================================
  // Batches & Traceability
  // ===========================================================================

  public getAllBatches(): BatchEntity[] {
    return Array.from(this.batches.values());
  }

  public getBatchesByProduct(productId: string): BatchEntity[] {
    return Array.from(this.batches.values()).filter((b) => b.productId === productId);
  }

  public getBatch(batchIdentifier: string, productId?: string): BatchEntity | undefined {
    if (productId) {
      return Array.from(this.batches.values()).find(
        (b) =>
          b.productId === productId &&
          (b.batchNumber.toUpperCase() === batchIdentifier.toUpperCase() || b.id === batchIdentifier)
      );
    }
    return (
      this.batches.get(batchIdentifier) ||
      Array.from(this.batches.values()).find(
        (b) =>
          b.batchNumber.toUpperCase() === batchIdentifier.toUpperCase() ||
          b.id === batchIdentifier
      )
    );
  }

  public createBatch(batch: Omit<BatchEntity, 'id' | 'createdAt'>, actorEmail: string): BatchEntity {
    const id = `batch_${batch.productId}_${batch.batchNumber.toLowerCase()}_${Date.now()}`;
    const newBatch: BatchEntity = {
      ...batch,
      id,
      batchNumber: batch.batchNumber.toUpperCase(),
      createdAt: new Date().toISOString(),
    };
    this.batches.set(newBatch.id, newBatch);

    this.addAuditLog(
      actorEmail,
      'OPERATIONS',
      'BATCH_CREATED',
      'BATCH',
      `${newBatch.productId}:${newBatch.batchNumber}`,
      `Batch ${newBatch.batchNumber} created for ${newBatch.productName} (${newBatch.totalQuantityKg} kg)`
    );

    return newBatch;
  }

  public updateBatch(
    batchIdentifier: string,
    updates: Partial<BatchEntity>,
    actorEmail: string
  ): BatchEntity {
    const batch = this.getBatch(batchIdentifier);
    if (!batch) throw new Error(`Batch ${batchIdentifier} not found.`);

    Object.assign(batch, updates);

    this.addAuditLog(
      actorEmail,
      'OPERATIONS',
      'BATCH_UPDATED',
      'BATCH',
      `${batch.productId}:${batch.batchNumber}`,
      `Updated batch parameters: ${Object.keys(updates).join(', ')}`
    );

    return batch;
  }

  // ===========================================================================
  // Reviews, Returns & Refunds
  // ===========================================================================

  public getReviewsForProduct(productId: string): ReviewEntity[] {
    return this.reviews.filter((r) => r.productId === productId && r.status === 'APPROVED');
  }

  public getAllReviews(): ReviewEntity[] {
    return this.reviews;
  }

  public addReview(review: Omit<ReviewEntity, 'id' | 'status' | 'createdAt'>): ReviewEntity {
    const newReview: ReviewEntity = {
      ...review,
      id: `rev_${Date.now()}`,
      status: 'PENDING',
      createdAt: new Date().toISOString(),
    };
    this.reviews.push(newReview);
    return newReview;
  }

  public updateReviewStatus(reviewId: string, status: 'APPROVED' | 'REJECTED'): ReviewEntity {
    const rev = this.reviews.find((r) => r.id === reviewId);
    if (!rev) throw new Error(`Review ${reviewId} not found`);
    rev.status = status;
    return rev;
  }

  public getAllReturns(): ReturnRequestEntity[] {
    return this.returnRequests;
  }

  public createReturnRequest(
    data: Omit<ReturnRequestEntity, 'id' | 'status' | 'requestedAt' | 'updatedAt'>
  ): ReturnRequestEntity {
    const newReq: ReturnRequestEntity = {
      ...data,
      id: `ret_${Date.now()}`,
      status: 'REQUESTED',
      requestedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.returnRequests.push(newReq);
    return newReq;
  }

  public updateReturnStatus(
    returnId: string,
    status: ReturnRequestEntity['status'],
    actorEmail: string
  ): ReturnRequestEntity {
    const req = this.returnRequests.find((r) => r.id === returnId);
    if (!req) throw new Error(`Return request ${returnId} not found`);

    req.status = status;
    req.updatedAt = new Date().toISOString();

    this.addAuditLog(
      actorEmail,
      'CUSTOMER_SUPPORT',
      'RETURN_STATUS_UPDATED',
      'RETURN',
      returnId,
      `Return for order ${req.orderNumber} updated to ${status}`
    );

    return req;
  }

  // ===========================================================================
  // Customer Cart Architecture & Authoritative Pricing (GATE 5)
  // ===========================================================================

  public getOrCreateCart(userId: string): CartEntity {
    let cartId = this.userCarts.get(userId);
    if (cartId && this.carts.has(cartId)) {
      return this.carts.get(cartId)!;
    }

    const newCart: CartEntity = {
      id: `cart_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      userId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.carts.set(newCart.id, newCart);
    this.userCarts.set(userId, newCart.id);
    return newCart;
  }

  public getAuthoritativeProductInfo(productIdOrSlug: string, selectedWeight?: string) {
    // 1. Check database productsList first (supports dynamic updates from Gate 3)
    const dbProd = this.getProductById(productIdOrSlug) || this.getProductBySlug(productIdOrSlug);
    // 2. Also check catalog source products
    const staticProd = products.find(
      (p) => p.id === productIdOrSlug || p.slug.toLowerCase() === productIdOrSlug.toLowerCase()
    );

    if (!dbProd && !staticProd) {
      return null;
    }

    const id = dbProd?.id || staticProd!.id;
    const slug = dbProd?.slug || staticProd!.slug;
    const name = dbProd?.name || staticProd!.name;
    const localName = staticProd?.localName;
    const images =
      dbProd?.images && dbProd.images.length > 0
        ? dbProd.images
        : staticProd?.images || ['/images/products/korralu-foxtail-millet.jpg'];
    const status = dbProd?.status || 'PUBLISHED';

    // Determine weight option and authoritative price
    const requestedWeight = (selectedWeight || '500g').trim();
    let weightOpt = staticProd?.weights?.find(
      (w) => w.size.toLowerCase() === requestedWeight.toLowerCase()
    );

    if (!weightOpt && staticProd?.weights && staticProd.weights.length > 0) {
      weightOpt = staticProd.weights[0];
    }

    const weightSize = weightOpt ? weightOpt.size : dbProd ? `${dbProd.weight}${dbProd.unit}` : '500g';
    let authoritativePrice = weightOpt ? weightOpt.price : dbProd?.price || 150;
    let authoritativeMrp = weightOpt ? weightOpt.mrp : dbProd?.comparePrice || authoritativePrice + 30;

    // If dbProd price was specifically updated in admin and matches base weight, reflect it
    if (dbProd && (!staticProd || staticProd.weights.length <= 1 || weightSize === `${dbProd.weight}${dbProd.unit}`)) {
      authoritativePrice = dbProd.price;
      if (dbProd.comparePrice) {
        authoritativeMrp = dbProd.comparePrice;
      }
    }

    const sku = `${slug.toUpperCase()}-${weightSize.replace(/\s+/g, '').toUpperCase()}`;
    const inv = this.getInventoryItem(sku);
    const availableStock = inv ? Math.max(0, inv.stock) : 50;

    return {
      productId: id,
      slug,
      name,
      localName,
      image: images[0],
      selectedWeight: weightSize,
      unitPrice: authoritativePrice,
      mrp: authoritativeMrp,
      sku,
      availableStock,
      inStock: availableStock > 0,
      status,
    };
  }

  public getCart(
    userId: string,
    requestingUser?: { id: string; role: string }
  ): { success: boolean; cart?: CartResponse; error?: string; status?: number } {
    // Prevent customer from accessing another customer's cart
    if (requestingUser) {
      const isPrivileged = isAdmin(requestingUser.role) || isOwner(requestingUser.role);
      if (!isPrivileged && requestingUser.id !== userId) {
        return {
          success: false,
          error: "Forbidden: You cannot access another customer's cart.",
          status: 403,
        };
      }
    }

    const cart = this.getOrCreateCart(userId);
    const items: EnrichedCartItem[] = [];
    let subtotal = 0;
    let itemCount = 0;

    // Iterate through items belonging to this cart
    for (const item of this.cartItems.values()) {
      if (item.cartId !== cart.id) continue;

      const info = this.getAuthoritativeProductInfo(item.productId, item.selectedWeight);
      if (!info) {
        // Product no longer exists, skip
        continue;
      }

      const lineTotal = info.unitPrice * item.quantity;
      subtotal += lineTotal;
      itemCount += item.quantity;

      items.push({
        id: item.id,
        productId: info.productId,
        slug: info.slug,
        name: info.name,
        localName: info.localName,
        image: info.image,
        selectedWeight: info.selectedWeight,
        unitPrice: info.unitPrice,
        mrp: info.mrp,
        quantity: item.quantity,
        lineTotal,
        inStock: info.inStock,
        availableStock: info.availableStock,
      });
    }

    return {
      success: true,
      cart: {
        cartId: cart.id,
        userId: cart.userId,
        items,
        itemCount,
        subtotal,
        updatedAt: cart.updatedAt,
      },
    };
  }

  public addToCart(
    userId: string,
    productId: string,
    selectedWeight: string = '500g',
    quantity: number = 1,
    requestingUser?: { id: string; role: string }
  ): { success: boolean; cart?: CartResponse; error?: string; status?: number } {
    // 1. Authorization check
    if (requestingUser) {
      const isPrivileged = isAdmin(requestingUser.role) || isOwner(requestingUser.role);
      if (!isPrivileged && requestingUser.id !== userId) {
        return {
          success: false,
          error: "Forbidden: You cannot modify another customer's cart.",
          status: 403,
        };
      }
    }

    // 2. Validate quantity (Must be positive integer: > 0, no floats, no NaN)
    if (
      typeof quantity !== 'number' ||
      !Number.isInteger(quantity) ||
      quantity <= 0 ||
      isNaN(quantity)
    ) {
      return {
        success: false,
        error: 'Invalid quantity: Quantity must be a positive integer greater than zero.',
        status: 400,
      };
    }

    // 3. Validate product reference
    const info = this.getAuthoritativeProductInfo(productId, selectedWeight);
    if (!info) {
      return {
        success: false,
        error: `Invalid product reference: Product "${productId}" does not exist.`,
        status: 404,
      };
    }

    if (info.status !== 'PUBLISHED') {
      const isPrivileged = requestingUser && (isAdmin(requestingUser.role) || isOwner(requestingUser.role));
      if (!isPrivileged) {
        return {
          success: false,
          error: `Product "${info.name}" is not currently available for purchase.`,
          status: 400,
        };
      }
    }

    const cart = this.getOrCreateCart(userId);

    // 4. Check if item already exists in this cart
    let existingItem: CartItemEntity | undefined;
    for (const item of this.cartItems.values()) {
      if (
        item.cartId === cart.id &&
        item.productId === info.productId &&
        item.selectedWeight.toLowerCase() === info.selectedWeight.toLowerCase()
      ) {
        existingItem = item;
        break;
      }
    }

    const newQuantity = existingItem ? existingItem.quantity + quantity : quantity;

    // 5. Check inventory / stock limits
    if (info.availableStock > 0 && newQuantity > info.availableStock) {
      return {
        success: false,
        error: `Cannot add ${quantity} item(s). Only ${info.availableStock} unit(s) available in stock.`,
        status: 400,
      };
    }

    const now = new Date().toISOString();
    if (existingItem) {
      existingItem.quantity = newQuantity;
      existingItem.updatedAt = now;
    } else {
      const newItem: CartItemEntity = {
        id: `ci_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        cartId: cart.id,
        productId: info.productId,
        selectedWeight: info.selectedWeight,
        quantity,
        createdAt: now,
        updatedAt: now,
      };
      this.cartItems.set(newItem.id, newItem);
    }

    cart.updatedAt = now;
    return this.getCart(userId);
  }

  public updateCartItemQuantity(
    userId: string,
    itemId: string,
    quantity: number,
    requestingUser?: { id: string; role: string }
  ): { success: boolean; cart?: CartResponse; error?: string; status?: number } {
    // 1. Authorization check
    if (requestingUser) {
      const isPrivileged = isAdmin(requestingUser.role) || isOwner(requestingUser.role);
      if (!isPrivileged && requestingUser.id !== userId) {
        return {
          success: false,
          error: "Forbidden: You cannot modify another customer's cart.",
          status: 403,
        };
      }
    }

    // 2. Validate item belongs to user's cart
    const cart = this.getOrCreateCart(userId);
    const item = this.cartItems.get(itemId);
    if (!item || item.cartId !== cart.id) {
      return {
        success: false,
        error: 'Cart item not found in customer cart.',
        status: 404,
      };
    }

    // 3. Validate quantity
    if (typeof quantity !== 'number' || !Number.isInteger(quantity) || isNaN(quantity) || quantity < 0) {
      return {
        success: false,
        error: 'Invalid quantity: Quantity must be a non-negative integer.',
        status: 400,
      };
    }

    // If quantity is 0, remove item
    if (quantity === 0) {
      this.cartItems.delete(itemId);
      cart.updatedAt = new Date().toISOString();
      return this.getCart(userId);
    }

    // Check inventory stock
    const info = this.getAuthoritativeProductInfo(item.productId, item.selectedWeight);
    if (info && info.availableStock > 0 && quantity > info.availableStock) {
      return {
        success: false,
        error: `Cannot update quantity to ${quantity}. Only ${info.availableStock} unit(s) available in stock.`,
        status: 400,
      };
    }

    item.quantity = quantity;
    item.updatedAt = new Date().toISOString();
    cart.updatedAt = item.updatedAt;

    return this.getCart(userId);
  }

  public increaseCartItemQuantity(
    userId: string,
    itemId: string,
    delta: number = 1,
    requestingUser?: { id: string; role: string }
  ): { success: boolean; cart?: CartResponse; error?: string; status?: number } {
    if (typeof delta !== 'number' || !Number.isInteger(delta) || delta <= 0) {
      return {
        success: false,
        error: 'Invalid increment delta: Must be a positive integer.',
        status: 400,
      };
    }
    const cart = this.getOrCreateCart(userId);
    const item = this.cartItems.get(itemId);
    if (!item || item.cartId !== cart.id) {
      return { success: false, error: 'Cart item not found in customer cart.', status: 404 };
    }
    return this.updateCartItemQuantity(userId, itemId, item.quantity + delta, requestingUser);
  }

  public decreaseCartItemQuantity(
    userId: string,
    itemId: string,
    delta: number = 1,
    requestingUser?: { id: string; role: string }
  ): { success: boolean; cart?: CartResponse; error?: string; status?: number } {
    if (typeof delta !== 'number' || !Number.isInteger(delta) || delta <= 0) {
      return {
        success: false,
        error: 'Invalid decrement delta: Must be a positive integer.',
        status: 400,
      };
    }
    const cart = this.getOrCreateCart(userId);
    const item = this.cartItems.get(itemId);
    if (!item || item.cartId !== cart.id) {
      return { success: false, error: 'Cart item not found in customer cart.', status: 404 };
    }
    const newQty = item.quantity - delta;
    return this.updateCartItemQuantity(userId, itemId, Math.max(0, newQty), requestingUser);
  }

  public removeCartItem(
    userId: string,
    itemId: string,
    requestingUser?: { id: string; role: string }
  ): { success: boolean; cart?: CartResponse; error?: string; status?: number } {
    if (requestingUser) {
      const isPrivileged = isAdmin(requestingUser.role) || isOwner(requestingUser.role);
      if (!isPrivileged && requestingUser.id !== userId) {
        return {
          success: false,
          error: "Forbidden: You cannot modify another customer's cart.",
          status: 403,
        };
      }
    }
    const cart = this.getOrCreateCart(userId);
    const item = this.cartItems.get(itemId);
    if (!item || item.cartId !== cart.id) {
      return {
        success: false,
        error: 'Cart item not found in customer cart.',
        status: 404,
      };
    }
    this.cartItems.delete(itemId);
    cart.updatedAt = new Date().toISOString();
    return this.getCart(userId);
  }

  public findCartItem(userId: string, productId: string, selectedWeight: string = '500g'): CartItemEntity | undefined {
    const cart = this.getOrCreateCart(userId);
    for (const item of this.cartItems.values()) {
      if (
        item.cartId === cart.id &&
        (item.productId === productId || item.productId.toLowerCase() === productId.toLowerCase()) &&
        item.selectedWeight.toLowerCase() === selectedWeight.toLowerCase()
      ) {
        return item;
      }
    }
    return undefined;
  }

  public clearCart(
    userId: string,
    requestingUser?: { id: string; role: string }
  ): { success: boolean; cart?: CartResponse; error?: string; status?: number } {
    if (requestingUser) {
      const isPrivileged = isAdmin(requestingUser.role) || isOwner(requestingUser.role);
      if (!isPrivileged && requestingUser.id !== userId) {
        return {
          success: false,
          error: "Forbidden: You cannot modify another customer's cart.",
          status: 403,
        };
      }
    }
    const cart = this.getOrCreateCart(userId);
    for (const [id, item] of this.cartItems.entries()) {
      if (item.cartId === cart.id) {
        this.cartItems.delete(id);
      }
    }
    cart.updatedAt = new Date().toISOString();
    return this.getCart(userId);
  }

  // ===========================================================================
  // Audit Logs & Security Telemetry
  // ===========================================================================

  public addAuditLog(
    actorEmail: string,
    actorRole: string,
    action: string,
    entity: string,
    entityId: string,
    details: string
  ) {
    this.auditLogs.unshift({
      id: `aud_${Date.now()}_${Math.random().toString(36).substring(2, 5)}`,
      actorEmail,
      actorRole,
      action,
      entity,
      entityId,
      details,
      timestamp: new Date().toISOString(),
    });
    // Keep max 200 logs
    if (this.auditLogs.length > 200) {
      this.auditLogs.length = 200;
    }
  }

  public getAuditLogs(): AuditLogEntity[] {
    return this.auditLogs;
  }
}

// Global Singleton instance for Next.js App Router
const globalForDb = global as unknown as { dharvikaDbInstance?: DatabaseStore };
export const db = globalForDb.dharvikaDbInstance || new DatabaseStore();
if (process.env.NODE_ENV !== 'production') globalForDb.dharvikaDbInstance = db;

export { prisma, hasDatabaseUrl } from './client';

