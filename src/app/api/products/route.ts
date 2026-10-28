import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedProfile } from '@/lib/auth/session';
import { db } from '@/lib/db';
import { hasDatabaseUrl, prisma } from '@/lib/db/client';
import { getPublishedProducts } from '@/lib/db/products';

/**
 * GET /api/products
 * Public / Customer Catalog Endpoint:
 * - Customers/Public can ONLY view PUBLISHED products.
 * - Admin/Owner can view all or filter by status.
 * - Prices are server-authoritative and serialized from the database.
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category') || undefined;
    const status = searchParams.get('status') || undefined;
    const search = searchParams.get('search') || undefined;

    const caller = await getAuthenticatedProfile();
    const isPrivileged = Boolean(
      caller && (caller.role === 'ADMIN' || caller.role === 'OWNER')
    );

    // Explicit test seam: preserve in-memory test fixtures when running without database connection
    if (!hasDatabaseUrl || !prisma) {
      const products = db.getProducts({ category, status, search }, caller || undefined);
      return NextResponse.json({
        success: true,
        count: products.length,
        products,
      });
    }

    const products = await getPublishedProducts(
      { category, status, search },
      isPrivileged
    );

    return NextResponse.json({
      success: true,
      count: products.length,
      products,
    });
  } catch {
    console.error('[API PRODUCTS GET ERROR]: Database query failed');
    return NextResponse.json({ success: false, error: 'Failed to fetch products' }, { status: 500 });
  }
}
