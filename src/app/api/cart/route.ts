import { NextRequest, NextResponse } from 'next/server';
import { db, isAdmin, isOwner } from '@/lib/db';
import { getAuthenticatedProfile } from '@/lib/auth/session';

/**
 * GET /api/cart
 * Fetch the authenticated customer's persisted cart with authoritative prices and subtotal.
 * Strict Customer Isolation: Customer A cannot access Customer B's cart.
 */
export async function GET(req: NextRequest) {
  try {
    const caller = await getAuthenticatedProfile();
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
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || 'Failed to fetch cart.' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/cart
 * Add a product to the authenticated customer's cart.
 * Authoritative pricing is calculated server-side. Frontend prices are ignored.
 */
export async function POST(req: NextRequest) {
  try {
    const caller = await getAuthenticatedProfile();
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
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || 'Failed to add item to cart.' },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/cart
 * Update cart item quantity, increase, or decrease.
 * Actions: 'SET' | 'INCREASE' | 'DECREASE'
 */
export async function PATCH(req: NextRequest) {
  try {
    const caller = await getAuthenticatedProfile();
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
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || 'Failed to update cart item.' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/cart
 * Remove an item from the cart or clear the cart completely.
 */
export async function DELETE(req: NextRequest) {
  try {
    const caller = await getAuthenticatedProfile();
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
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || 'Failed to delete from cart.' },
      { status: 500 }
    );
  }
}
