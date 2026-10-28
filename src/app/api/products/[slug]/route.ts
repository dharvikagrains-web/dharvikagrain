import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedProfile } from '@/lib/auth/session';
import { db } from '@/lib/db';
import { hasDatabaseUrl, prisma } from '@/lib/db/client';
import { getPublishedProductBySlug } from '@/lib/db/products';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    if (!slug || typeof slug !== 'string') {
      return NextResponse.json({ success: false, error: 'Product slug is required' }, { status: 400 });
    }

    const caller = await getAuthenticatedProfile();
    const isPrivileged = Boolean(
      caller && (caller.role === 'ADMIN' || caller.role === 'OWNER')
    );

    // Explicit test seam: preserve in-memory test fixtures when running without database connection
    if (!hasDatabaseUrl || !prisma) {
      const product = db.getProductBySlug(slug, caller || undefined);
      if (!product) {
        return NextResponse.json({ success: false, error: 'Product not found' }, { status: 404 });
      }

      return NextResponse.json({
        success: true,
        product,
      });
    }

    const product = await getPublishedProductBySlug(slug, isPrivileged);
    if (!product) {
      return NextResponse.json({ success: false, error: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      product,
    });
  } catch {
    console.error('[API PRODUCT DETAIL ERROR]: Database query failed');
    return NextResponse.json({ success: false, error: 'Failed to fetch product' }, { status: 500 });
  }
}
