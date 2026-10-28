import { NextRequest, NextResponse } from 'next/server';
import { db, isAdmin, isOwner } from '@/lib/db';
import { getAuthenticatedProfile, getCurrentUser, verifySession, AUTH_COOKIE_NAME } from '@/lib/auth/session';
import { hasDatabaseUrl, prisma } from '@/lib/db/client';
import { isValidUuid } from '@/lib/db/addresses';
import {
  CartError,
  getAuthoritativeCart,
  addCartItemAtomic,
  updateCartItemQuantityAtomic,
  changeCartItemQuantityDelta,
  removeCartItemAtomic,
  clearCartAtomic,
  findCartItemId,
} from '@/lib/db/cart';

/**
 * Resolves caller profile from either Supabase SSR session or direct request session cookie
 */
async function getCallerProfile(req: NextRequest) {
  let caller = await getAuthenticatedProfile();
  if (caller && isValidUuid(caller.id)) return caller;

  const token = req.cookies.get(AUTH_COOKIE_NAME)?.value;
  if (token) {
    const payload = verifySession(token);
    if (payload) {
      let role: 'CUSTOMER' | 'ADMIN' | 'OWNER' = 'CUSTOMER';
      if (payload.role === 'OWNER' || payload.role === 'SUPER_ADMIN') role = 'OWNER';
      else if (payload.role === 'ADMIN' || payload.role === 'OPERATIONS') role = 'ADMIN';

      return {
        id: payload.userId,
        fullName: payload.fullName,
        email: payload.email,
        phone: payload.mobile,
        role,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
    }
  }

  const user = await getCurrentUser(req);
  if (user) {
    let role: 'CUSTOMER' | 'ADMIN' | 'OWNER' = 'CUSTOMER';
    if (user.role === 'OWNER' || user.role === 'SUPER_ADMIN') role = 'OWNER';
    else if (user.role === 'ADMIN' || user.role === 'OPERATIONS') role = 'ADMIN';

    return {
      id: user.id,
      fullName: user.fullName,
      email: user.email,
      phone: user.mobile,
      role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  return null;
}

/**
 * GET /api/cart
 * Fetch the authenticated customer's persisted cart with authoritative prices and subtotal.
 * Strict Customer Isolation: Customer A cannot access Customer B's cart.
 */
export async function GET(req: NextRequest) {
  try {
    const caller = await getCallerProfile(req);
    if (!caller) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized: Authentication required.' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    const requestedUserId = searchParams.get('userId') || caller.id;

    // Boundary check: Customer cannot view another customer's cart
    if (requestedUserId !== caller.id && !isAdmin(caller.role) && !isOwner(caller.role)) {
      return NextResponse.json(
        { success: false, error: "Forbidden: You cannot access another customer's cart." },
        { status: 403 }
      );
    }

    // Explicit test seam: preserve in-memory test fixtures when running without database connection
    if (!hasDatabaseUrl || !prisma) {
      const result = db.getCart(requestedUserId, caller);
      if (!result.success) {
        return NextResponse.json(
          { success: false, error: result.error },
          { status: result.status || 400 }
        );
      }
      return NextResponse.json({
        success: true,
        cart: result.cart,
      });
    }

    // Database mode: Verify authentic UUID ownership key
    if (!isValidUuid(requestedUserId)) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized: Valid account identifier required.' },
        { status: 401 }
      );
    }

    const cart = await getAuthoritativeCart(requestedUserId);
    return NextResponse.json({
      success: true,
      cart,
    });
  } catch (err: any) {
    if (err instanceof CartError) {
      return NextResponse.json({ success: false, error: err.message }, { status: err.status });
    }
    console.error('[API CART GET ERROR]: Database operation failed');
    return NextResponse.json({ success: false, error: 'Failed to fetch cart.' }, { status: 500 });
  }
}

/**
 * POST /api/cart
 * Add a product to the authenticated customer's cart.
 * Authoritative pricing is calculated server-side. Frontend prices are ignored.
 */
export async function POST(req: NextRequest) {
  try {
    const caller = await getCallerProfile(req);
    if (!caller) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized: Authentication required.' },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { productId, selectedWeight = '500g', quantity = 1, targetUserId } = body;

    const effectiveUserId = targetUserId || caller.id;

    // Security check: Customer cannot modify another customer's cart
    if (effectiveUserId !== caller.id && !isAdmin(caller.role) && !isOwner(caller.role)) {
      return NextResponse.json(
        { success: false, error: "Forbidden: You cannot modify another customer's cart." },
        { status: 403 }
      );
    }

    if (!productId) {
      return NextResponse.json(
        { success: false, error: 'Bad Request: productId is required.' },
        { status: 400 }
      );
    }

    // Validate quantity is a positive integer before delegating
    if (
      typeof quantity !== 'number' ||
      !Number.isInteger(quantity) ||
      quantity <= 0 ||
      isNaN(quantity)
    ) {
      return NextResponse.json(
        { success: false, error: 'Invalid quantity: Quantity must be a positive integer greater than zero.' },
        { status: 400 }
      );
    }

    // Explicit test seam: preserve in-memory test fixtures when running without database connection
    if (!hasDatabaseUrl || !prisma) {
      const result = db.addToCart(
        effectiveUserId,
        productId,
        selectedWeight,
        quantity,
        caller
      );

      if (!result.success) {
        return NextResponse.json(
          { success: false, error: result.error },
          { status: result.status || 400 }
        );
      }

      return NextResponse.json({
        success: true,
        message: 'Product added to cart successfully.',
        cart: result.cart,
      });
    }

    // Database mode: Verify authentic UUID ownership key
    if (!isValidUuid(effectiveUserId)) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized: Valid account identifier required.' },
        { status: 401 }
      );
    }

    const cart = await addCartItemAtomic(
      effectiveUserId,
      productId,
      selectedWeight,
      quantity
    );

    return NextResponse.json({
      success: true,
      message: 'Product added to cart successfully.',
      cart,
    });
  } catch (err: any) {
    if (err instanceof CartError) {
      return NextResponse.json({ success: false, error: err.message }, { status: err.status });
    }
    console.error('[API CART POST ERROR]: Database operation failed');
    return NextResponse.json({ success: false, error: 'Failed to add item to cart.' }, { status: 500 });
  }
}

/**
 * PATCH /api/cart
 * Update cart item quantity, increase, or decrease.
 * Actions: 'SET' | 'INCREASE' | 'DECREASE'
 */
export async function PATCH(req: NextRequest) {
  try {
    const caller = await getCallerProfile(req);
    if (!caller) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized: Authentication required.' },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { itemId, productId, selectedWeight, action = 'SET', quantity, delta = 1, targetUserId } = body;

    const effectiveUserId = targetUserId || caller.id;

    if (effectiveUserId !== caller.id && !isAdmin(caller.role) && !isOwner(caller.role)) {
      return NextResponse.json(
        { success: false, error: "Forbidden: You cannot modify another customer's cart." },
        { status: 403 }
      );
    }

    // Explicit test seam: preserve in-memory test fixtures when running without database connection
    if (!hasDatabaseUrl || !prisma) {
      let resolvedItemId = itemId;
      if (!resolvedItemId && productId) {
        const found = db.findCartItem(effectiveUserId, productId, selectedWeight || '500g');
        if (found) {
          resolvedItemId = found.id;
        }
      }

      if (!resolvedItemId) {
        return NextResponse.json(
          { success: false, error: 'Bad Request: itemId or valid (productId, selectedWeight) is required.' },
          { status: 400 }
        );
      }

      let result;
      if (action === 'INCREASE') {
        result = db.increaseCartItemQuantity(effectiveUserId, resolvedItemId, delta, caller);
      } else if (action === 'DECREASE') {
        result = db.decreaseCartItemQuantity(effectiveUserId, resolvedItemId, delta, caller);
      } else if (action === 'SET') {
        if (quantity === undefined || typeof quantity !== 'number') {
          return NextResponse.json(
            { success: false, error: 'Bad Request: numeric quantity is required for SET action.' },
            { status: 400 }
          );
        }
        result = db.updateCartItemQuantity(effectiveUserId, itemId, quantity, caller);
      } else {
        return NextResponse.json(
          { success: false, error: "Invalid action. Supported actions: 'SET', 'INCREASE', 'DECREASE'." },
          { status: 400 }
        );
      }

      if (!result.success) {
        return NextResponse.json(
          { success: false, error: result.error },
          { status: result.status || 400 }
        );
      }

      return NextResponse.json({
        success: true,
        cart: result.cart,
      });
    }

    // Database mode: Verify authentic UUID ownership key
    if (!isValidUuid(effectiveUserId)) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized: Valid account identifier required.' },
        { status: 401 }
      );
    }

    let resolvedItemId = itemId;
    if (!resolvedItemId && productId) {
      resolvedItemId = await findCartItemId(effectiveUserId, productId, selectedWeight || '500g');
    }

    if (!resolvedItemId) {
      return NextResponse.json(
        { success: false, error: 'Bad Request: itemId or valid (productId, selectedWeight) is required.' },
        { status: 400 }
      );
    }

    let cart;
    if (action === 'INCREASE') {
      cart = await changeCartItemQuantityDelta(effectiveUserId, resolvedItemId, delta, 'INCREASE');
    } else if (action === 'DECREASE') {
      cart = await changeCartItemQuantityDelta(effectiveUserId, resolvedItemId, delta, 'DECREASE');
    } else if (action === 'SET') {
      if (quantity === undefined || typeof quantity !== 'number') {
        return NextResponse.json(
          { success: false, error: 'Bad Request: numeric quantity is required for SET action.' },
          { status: 400 }
        );
      }
      cart = await updateCartItemQuantityAtomic(effectiveUserId, resolvedItemId, quantity);
    } else {
      return NextResponse.json(
        { success: false, error: "Invalid action. Supported actions: 'SET', 'INCREASE', 'DECREASE'." },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      cart,
    });
  } catch (err: any) {
    if (err instanceof CartError) {
      return NextResponse.json({ success: false, error: err.message }, { status: err.status });
    }
    console.error('[API CART PATCH ERROR]: Database operation failed');
    return NextResponse.json({ success: false, error: 'Failed to update cart item.' }, { status: 500 });
  }
}

/**
 * DELETE /api/cart
 * Remove an item from the cart or clear the cart completely.
 */
export async function DELETE(req: NextRequest) {
  try {
    const caller = await getCallerProfile(req);
    if (!caller) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized: Authentication required.' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    const itemIdParam = searchParams.get('itemId');
    const clearAllParam = searchParams.get('clearAll') === 'true';
    const targetUserIdParam = searchParams.get('targetUserId');

    let body: any = {};
    try {
      body = await req.json();
    } catch {
      // Body is optional for DELETE
    }

    const itemId = itemIdParam || body.itemId;
    const clearAll = clearAllParam || body.clearAll;
    const effectiveUserId = targetUserIdParam || body.targetUserId || caller.id;

    if (effectiveUserId !== caller.id && !isAdmin(caller.role) && !isOwner(caller.role)) {
      return NextResponse.json(
        { success: false, error: "Forbidden: You cannot modify another customer's cart." },
        { status: 403 }
      );
    }

    // Explicit test seam: preserve in-memory test fixtures when running without database connection
    if (!hasDatabaseUrl || !prisma) {
      let result;
      if (clearAll) {
        result = db.clearCart(effectiveUserId, caller);
      } else if (itemId) {
        result = db.removeCartItem(effectiveUserId, itemId, caller);
      } else {
        return NextResponse.json(
          { success: false, error: 'Bad Request: Provide either itemId to delete or clearAll=true.' },
          { status: 400 }
        );
      }

      if (!result.success) {
        return NextResponse.json(
          { success: false, error: result.error },
          { status: result.status || 400 }
        );
      }

      return NextResponse.json({
        success: true,
        message: clearAll ? 'Cart cleared successfully.' : 'Cart item removed successfully.',
        cart: result.cart,
      });
    }

    // Database mode: Verify authentic UUID ownership key
    if (!isValidUuid(effectiveUserId)) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized: Valid account identifier required.' },
        { status: 401 }
      );
    }

    let cart;
    if (clearAll) {
      cart = await clearCartAtomic(effectiveUserId);
    } else if (itemId) {
      cart = await removeCartItemAtomic(effectiveUserId, itemId);
    } else {
      return NextResponse.json(
        { success: false, error: 'Bad Request: Provide either itemId to delete or clearAll=true.' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: clearAll ? 'Cart cleared successfully.' : 'Cart item removed successfully.',
      cart,
    });
  } catch (err: any) {
    if (err instanceof CartError) {
      return NextResponse.json({ success: false, error: err.message }, { status: err.status });
    }
    console.error('[API CART DELETE ERROR]: Database operation failed');
    return NextResponse.json({ success: false, error: 'Failed to delete from cart.' }, { status: 500 });
  }
}
