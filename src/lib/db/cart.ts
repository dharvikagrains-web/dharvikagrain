import { prisma } from './client';
import { EnrichedCartItem, CartResponse } from './index';

export class CartError extends Error {
  status: number;
  constructor(message: string, status: number = 400) {
    super(message);
    this.name = 'CartError';
    this.status = status;
  }
}

/**
 * Normalizes weight options from Prisma Product JSON column
 */
function getNormalizedWeightOption(product: any, selectedWeight: string) {
  const reqWeight = selectedWeight.trim().toLowerCase();
  let rawWeights = product.weights;
  if (typeof rawWeights === 'string') {
    try {
      rawWeights = JSON.parse(rawWeights);
    } catch {
      rawWeights = [];
    }
  }

  const weights = Array.isArray(rawWeights) ? rawWeights : [];
  const matched = weights.find((w: any) => String(w.size || '').toLowerCase() === reqWeight);

  if (matched) {
    return {
      size: String(matched.size),
      price: Number(matched.price || product.price || 0),
      mrp: Number(matched.mrp || product.comparePrice || matched.price || product.price || 0),
      inStock: Boolean(matched.inStock ?? product.isAvailable ?? true),
    };
  }

  // If no weight options exist on product, default to product weight & unit
  if (weights.length === 0) {
    const defaultSize = `${Number(product.weight || 500)}${product.unit || 'g'}`.toLowerCase();
    if (defaultSize === reqWeight || reqWeight === '500g') {
      return {
        size: `${Number(product.weight || 500)}${product.unit || 'g'}`,
        price: Number(product.price || 0),
        mrp: Number(product.comparePrice || product.price || 0),
        inStock: Boolean(product.isAvailable ?? true),
      };
    }
  }

  return null;
}

/**
 * Gets or creates the unique Cart record for an authenticated customer UUID.
 * Uses atomic upsert on public.carts(user_id) to eliminate concurrency race conditions.
 */
export async function getOrCreateCartRecord(userId: string) {
  if (!prisma) {
    throw new Error('Database client is not available');
  }

  return prisma.cart.upsert({
    where: { userId },
    update: {},
    create: { userId },
  });
}

/**
 * Reads the authoritative customer cart from PostgreSQL with live catalog pricing.
 * Client prices, totals, or stock values are strictly ignored.
 */
export async function getAuthoritativeCart(userId: string): Promise<CartResponse> {
  if (!prisma) {
    throw new Error('Database client is not available');
  }

  const cart = await getOrCreateCartRecord(userId);

  const cartItems = await prisma.cartItem.findMany({
    where: { cartId: cart.id },
    orderBy: { createdAt: 'asc' },
  });

  const enrichedItems: EnrichedCartItem[] = [];
  let subtotal = 0;
  let itemCount = 0;

  if (cartItems.length > 0) {
    const productIds = Array.from(new Set(cartItems.map((ci) => ci.productId)));
    const products = await prisma.product.findMany({
      where: {
        id: { in: productIds },
      },
    });

    const productMap = new Map(products.map((p) => [p.id, p]));

    for (const item of cartItems) {
      const prod = productMap.get(item.productId);
      if (!prod) {
        // Product no longer exists in catalog, omit from calculation
        continue;
      }

      const weightOpt = getNormalizedWeightOption(prod, item.selectedWeight);
      const unitPrice = weightOpt ? weightOpt.price : Number(prod.price || 0);
      const mrp = weightOpt ? weightOpt.mrp : Number(prod.comparePrice || unitPrice + 30);
      const lineTotal = unitPrice * item.quantity;

      subtotal += lineTotal;
      itemCount += item.quantity;

      enrichedItems.push({
        id: item.id,
        productId: prod.id,
        slug: prod.slug,
        name: prod.name,
        localName: prod.localName || undefined,
        image:
          Array.isArray(prod.images) && prod.images.length > 0
            ? prod.images[0]
            : '/images/products/korralu-foxtail-millet.jpg',
        selectedWeight: weightOpt ? weightOpt.size : item.selectedWeight,
        unitPrice,
        mrp,
        quantity: item.quantity,
        lineTotal,
        inStock: Boolean(prod.isAvailable),
        availableStock: 50,
      });
    }
  }

  return {
    cartId: cart.id,
    userId: cart.userId,
    items: enrichedItems,
    itemCount,
    subtotal,
    updatedAt: cart.updatedAt instanceof Date ? cart.updatedAt.toISOString() : new Date().toISOString(),
  };
}

/**
 * Adds an item to the cart atomically using public.cart_items compound unique key
 * (cart_id, product_id, selected_weight). Eliminates duplicate-insert race conditions.
 */
export async function addCartItemAtomic(
  userId: string,
  productIdOrSlug: string,
  selectedWeight: string = '500g',
  quantity: number = 1
): Promise<CartResponse> {
  if (!prisma) {
    throw new Error('Database client is not available');
  }

  // 1. Validate quantity: positive integer
  if (
    typeof quantity !== 'number' ||
    !Number.isInteger(quantity) ||
    quantity <= 0 ||
    isNaN(quantity)
  ) {
    throw new CartError('Invalid quantity: Quantity must be a positive integer greater than zero.', 400);
  }

  // 2. Validate authoritative product from database
  const product = await prisma.product.findFirst({
    where: {
      OR: [{ id: productIdOrSlug }, { slug: productIdOrSlug }],
    },
  });

  if (!product) {
    throw new CartError(`Invalid product reference: Product "${productIdOrSlug}" does not exist.`, 404);
  }

  if (product.status !== 'PUBLISHED') {
    throw new CartError(`Product "${product.name}" is not currently available for purchase.`, 400);
  }

  // 3. Validate and normalize weight option
  const weightOpt = getNormalizedWeightOption(product, selectedWeight);
  if (!weightOpt) {
    throw new CartError(
      `Unsupported weight "${selectedWeight}" for product "${product.name}".`,
      400
    );
  }

  const cart = await getOrCreateCartRecord(userId);

  // 4. Atomic upsert using compound unique constraint on (cartId, productId, selectedWeight)
  await prisma.cartItem.upsert({
    where: {
      cartId_productId_selectedWeight: {
        cartId: cart.id,
        productId: product.id,
        selectedWeight: weightOpt.size,
      },
    },
    update: {
      quantity: { increment: quantity },
    },
    create: {
      cartId: cart.id,
      productId: product.id,
      selectedWeight: weightOpt.size,
      quantity,
    },
  });

  // Touch cart updatedAt
  await prisma.cart.update({
    where: { id: cart.id },
    data: { updatedAt: new Date() },
  });

  return getAuthoritativeCart(userId);
}

/**
 * Updates cart item quantity. If quantity is 0, removes the item.
 */
export async function updateCartItemQuantityAtomic(
  userId: string,
  itemId: string,
  quantity: number
): Promise<CartResponse> {
  if (!prisma) {
    throw new Error('Database client is not available');
  }

  if (typeof quantity !== 'number' || !Number.isInteger(quantity) || isNaN(quantity) || quantity < 0) {
    throw new CartError('Invalid quantity: Quantity must be a non-negative integer.', 400);
  }

  const cart = await getOrCreateCartRecord(userId);

  const existingItem = await prisma.cartItem.findUnique({
    where: { id: itemId },
  });

  if (!existingItem || existingItem.cartId !== cart.id) {
    throw new CartError('Cart item not found in customer cart.', 404);
  }

  if (quantity === 0) {
    await prisma.cartItem.delete({
      where: { id: itemId },
    });
  } else {
    await prisma.cartItem.update({
      where: { id: itemId },
      data: { quantity },
    });
  }

  await prisma.cart.update({
    where: { id: cart.id },
    data: { updatedAt: new Date() },
  });

  return getAuthoritativeCart(userId);
}

/**
 * Modifies cart item quantity by delta (INCREASE or DECREASE).
 * Automatically removes item if decreased to zero or below.
 */
export async function changeCartItemQuantityDelta(
  userId: string,
  itemId: string,
  delta: number = 1,
  action: 'INCREASE' | 'DECREASE'
): Promise<CartResponse> {
  if (!prisma) {
    throw new Error('Database client is not available');
  }

  if (typeof delta !== 'number' || !Number.isInteger(delta) || delta <= 0 || isNaN(delta)) {
    throw new CartError(`Invalid ${action.toLowerCase()} delta: Must be a positive integer.`, 400);
  }

  const cart = await getOrCreateCartRecord(userId);

  const existingItem = await prisma.cartItem.findUnique({
    where: { id: itemId },
  });

  if (!existingItem || existingItem.cartId !== cart.id) {
    throw new CartError('Cart item not found in customer cart.', 404);
  }

  if (action === 'INCREASE') {
    await prisma.cartItem.update({
      where: { id: itemId },
      data: { quantity: { increment: delta } },
    });
  } else {
    const newQty = existingItem.quantity - delta;
    if (newQty <= 0) {
      await prisma.cartItem.delete({
        where: { id: itemId },
      });
    } else {
      await prisma.cartItem.update({
        where: { id: itemId },
        data: { quantity: newQty },
      });
    }
  }

  await prisma.cart.update({
    where: { id: cart.id },
    data: { updatedAt: new Date() },
  });

  return getAuthoritativeCart(userId);
}

/**
 * Removes a specific item from customer cart
 */
export async function removeCartItemAtomic(userId: string, itemId: string): Promise<CartResponse> {
  if (!prisma) {
    throw new Error('Database client is not available');
  }

  const cart = await getOrCreateCartRecord(userId);

  const existingItem = await prisma.cartItem.findUnique({
    where: { id: itemId },
  });

  if (!existingItem || existingItem.cartId !== cart.id) {
    throw new CartError('Cart item not found in customer cart.', 404);
  }

  await prisma.cartItem.delete({
    where: { id: itemId },
  });

  await prisma.cart.update({
    where: { id: cart.id },
    data: { updatedAt: new Date() },
  });

  return getAuthoritativeCart(userId);
}

/**
 * Clears all items from the customer cart
 */
export async function clearCartAtomic(userId: string): Promise<CartResponse> {
  if (!prisma) {
    throw new Error('Database client is not available');
  }

  const cart = await getOrCreateCartRecord(userId);

  await prisma.cartItem.deleteMany({
    where: { cartId: cart.id },
  });

  await prisma.cart.update({
    where: { id: cart.id },
    data: { updatedAt: new Date() },
  });

  return getAuthoritativeCart(userId);
}

/**
 * Finds an existing cart item ID by (userId, productIdOrSlug, selectedWeight)
 */
export async function findCartItemId(
  userId: string,
  productIdOrSlug: string,
  selectedWeight: string = '500g'
): Promise<string | null> {
  if (!prisma) {
    throw new Error('Database client is not available');
  }

  const cart = await getOrCreateCartRecord(userId);

  const product = await prisma.product.findFirst({
    where: {
      OR: [{ id: productIdOrSlug }, { slug: productIdOrSlug }],
    },
  });

  if (!product) return null;

  const item = await prisma.cartItem.findFirst({
    where: {
      cartId: cart.id,
      productId: product.id,
      selectedWeight: { equals: selectedWeight.trim(), mode: 'insensitive' },
    },
  });

  return item ? item.id : null;
}
