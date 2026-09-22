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
  | 'SUPER_ADMIN'
  | 'ADMIN'
  | 'OPERATIONS'
  | 'INVENTORY_MANAGER'
  | 'CUSTOMER_SUPPORT'
  | 'CUSTOMER'
  | 'INVESTOR';

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
  stock: number; // Available stock for sale
  reserved: number; // Temporarily locked in pending checkout
  threshold: number; // Low-stock alert threshold
  status: 'In Stock' | 'Low Stock' | 'Out of Stock';
  batchNumber: string;
  sellingPrice: number;
  mrp: number;
  updatedAt: string;
}

export interface InventoryTransaction {
  id: string;
  sku: string;
  type: 'PURCHASE' | 'RESERVATION' | 'RELEASE' | 'ADJUSTMENT' | 'RETURN';
  quantity: number;
  stockBefore: number;
  stockAfter: number;
  referenceId?: string; // Order Number or Batch ID
  notes: string;
  actorEmail: string;
  createdAt: string;
}

export interface BatchEntity {
  id: string;
  batchNumber: string;
  productId: string;
  productName: string;
  cropName: string;
  harvestDate?: string;
  manufacturingDate?: string;
  expiryDate?: string;
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

// =============================================================================
// In-Memory Production State Store (with Seed Data & Relational Methods)
// =============================================================================

class DatabaseStore {
  private users: Map<string, User> = new Map();
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

  constructor() {
    this.seed();
  }

  private seed() {
    // 1. Seed Core Admin User (Email alone never bypasses authentication)
    const adminEmail = process.env.ADMIN_EMAIL || 'dharvikagrains@gmail.com';
    const adminUser: User = {
      id: 'usr_admin_001',
      fullName: 'Dharvika Grains Admin',
      email: adminEmail.toLowerCase(),
      mobile: '9876543210',
      role: 'SUPER_ADMIN',
      isVerified: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.users.set(adminUser.id, adminUser);

    // 2. Seed Test Customer User
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

    // 3. Seed Saved Addresses for Test Customer
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

    // 5. Seed Inventory from Product Catalog Variants
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
  // Inventory Control & Atomic Reservations
  // ===========================================================================

  public getInventory(): InventoryEntity[] {
    return Array.from(this.inventory.values());
  }

  public getInventoryItem(sku: string): InventoryEntity | undefined {
    return this.inventory.get(sku.toUpperCase());
  }

  /**
   * Atomically reserve inventory during checkout initialization.
   * Prevents double selling / overselling across simultaneous checkouts.
   */
  public reserveInventory(
    items: { sku: string; quantity: number }[],
    orderNumber: string
  ): { success: boolean; error?: string } {
    // 1. Verify all items have sufficient available stock
    for (const item of items) {
      const inv = this.inventory.get(item.sku.toUpperCase());
      if (!inv) {
        return { success: false, error: `SKU ${item.sku} not found in inventory` };
      }
      const available = inv.stock - inv.reserved;
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
      inv.reserved += item.quantity;
      inv.updatedAt = new Date().toISOString();

      this.transactions.push({
        id: `tx_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        sku: inv.sku,
        type: 'RESERVATION',
        quantity: item.quantity,
        stockBefore: before,
        stockAfter: inv.stock,
        referenceId: orderNumber,
        notes: `Reserved ${item.quantity} units for Order #${orderNumber}`,
        actorEmail: 'system@dharvikagrains.in',
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
        inv.reserved = Math.max(0, inv.reserved - item.quantity);
        inv.updatedAt = new Date().toISOString();

        this.transactions.push({
          id: `tx_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
          sku: inv.sku,
          type: 'RELEASE',
          quantity: item.quantity,
          stockBefore: inv.stock,
          stockAfter: inv.stock,
          referenceId: orderNumber,
          notes: `Released reservation of ${item.quantity} units for Order #${orderNumber}`,
          actorEmail: 'system@dharvikagrains.in',
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
        inv.reserved = Math.max(0, inv.reserved - item.quantity);
        inv.stock = Math.max(0, inv.stock - item.quantity);
        inv.status =
          inv.stock > inv.threshold ? 'In Stock' : inv.stock > 0 ? 'Low Stock' : 'Out of Stock';
        inv.updatedAt = new Date().toISOString();

        this.transactions.push({
          id: `tx_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
          sku: inv.sku,
          type: 'PURCHASE',
          quantity: item.quantity,
          stockBefore: before,
          stockAfter: inv.stock,
          referenceId: orderNumber,
          notes: `Deducted ${item.quantity} sold units for confirmed Order #${orderNumber}`,
          actorEmail: 'system@dharvikagrains.in',
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

    const before = inv.stock;
    inv.stock = Math.max(0, inv.stock + delta);
    inv.status =
      inv.stock > inv.threshold ? 'In Stock' : inv.stock > 0 ? 'Low Stock' : 'Out of Stock';
    inv.updatedAt = new Date().toISOString();

    this.transactions.push({
      id: `tx_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      sku: inv.sku,
      type: 'ADJUSTMENT',
      quantity: delta,
      stockBefore: before,
      stockAfter: inv.stock,
      notes: `Manual stock adjustment by ${actorEmail}: ${reason}`,
      actorEmail,
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
    if (sku) {
      return this.transactions.filter((t) => t.sku.toUpperCase() === sku.toUpperCase());
    }
    return [...this.transactions].reverse();
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

