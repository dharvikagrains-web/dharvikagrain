import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedProfile } from '@/lib/auth/session';
import { db, isAdmin, isOwner } from '@/lib/db';

/**
 * GET /api/admin/products
 * Administrative endpoint to view full catalog (including DRAFT and ARCHIVED products).
 * Allowed: ADMIN, OWNER.
 * Denied: CUSTOMER, UNRECOGNIZED.
 */
export async function GET(req: NextRequest) {
  try {
    const caller = await getAuthenticatedProfile();
    if (!caller) {
      return NextResponse.json({ error: 'Unauthorized: Authentication required.' }, { status: 401 });
    }

    if (!isAdmin(caller.role) && !isOwner(caller.role)) {
      return NextResponse.json(
        { error: 'Forbidden: Insufficient administrative privileges.' },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category') || undefined;
    const status = searchParams.get('status') || undefined;
    const search = searchParams.get('search') || undefined;

    const products = db.getProducts({ category, status, search }, { id: caller.id, role: caller.role });

    return NextResponse.json({
      success: true,
      count: products.length,
      products,
    });
  } catch {
    return NextResponse.json({ error: 'Failed to fetch administrative products' }, { status: 500 });
  }
}

/**
 * POST /api/admin/products
 * Administrative endpoint to create a new product.
 * Allowed: ADMIN, OWNER.
 * Denied: CUSTOMER.
 */
export async function POST(req: NextRequest) {
  try {
    const caller = await getAuthenticatedProfile();
    if (!caller) {
      return NextResponse.json({ error: 'Unauthorized: Authentication required.' }, { status: 401 });
    }

    if (!isAdmin(caller.role) && !isOwner(caller.role)) {
      return NextResponse.json(
        { error: 'Forbidden: Insufficient administrative privileges.' },
        { status: 403 }
      );
    }

    const body = await req.json();
    const result = db.createProduct(body, { id: caller.id, role: caller.role });

    if (!result.success || !result.product) {
      return NextResponse.json({ error: result.error || 'Failed to create product.' }, { status: 400 });
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Product successfully created.',
        product: result.product,
      },
      { status: 201 }
    );
  } catch {
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 });
  }
}
