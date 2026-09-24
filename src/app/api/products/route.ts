import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedProfile } from '@/lib/auth/session';
import { db } from '@/lib/db';

/**
 * GET /api/products
 * Public / Customer Catalog Endpoint:
 * - Customers/Public can ONLY view PUBLISHED products.
 * - Admin/Owner can view all or filter by status.
 * - Prices are server-authoritative and not hardcoded on the frontend.
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category') || undefined;
    const status = searchParams.get('status') || undefined;
    const search = searchParams.get('search') || undefined;

    const caller = await getAuthenticatedProfile();
    const products = db.getProducts({ category, status, search }, caller || undefined);

    return NextResponse.json({
      success: true,
      count: products.length,
      products,
    });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}
