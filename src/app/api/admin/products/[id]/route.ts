import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedProfile } from '@/lib/auth/session';
import { db, isAdmin, isOwner } from '@/lib/db';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const caller = await getAuthenticatedProfile();
    if (!caller || (!isAdmin(caller.role) && !isOwner(caller.role))) {
      return NextResponse.json({ error: 'Unauthorized: Admin access required.' }, { status: 403 });
    }

    const product = db.getProductById(id, { id: caller.id, role: caller.role });
    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, product });
  } catch {
    return NextResponse.json({ error: 'Failed to fetch product' }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const caller = await getAuthenticatedProfile();
    if (!caller) {
      return NextResponse.json({ error: 'Unauthorized: Authentication required.' }, { status: 401 });
    }

    if (!isAdmin(caller.role) && !isOwner(caller.role)) {
      return NextResponse.json({ error: 'Forbidden: Insufficient privileges.' }, { status: 403 });
    }

    const body = await req.json();
    const result = db.updateProduct(id, body, { id: caller.id, role: caller.role });

    if (!result.success || !result.product) {
      return NextResponse.json({ error: result.error || 'Failed to update product.' }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      message: 'Product successfully updated.',
      product: result.product,
    });
  } catch {
    return NextResponse.json({ error: 'Failed to update product' }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const caller = await getAuthenticatedProfile();
    if (!caller) {
      return NextResponse.json({ error: 'Unauthorized: Authentication required.' }, { status: 401 });
    }

    if (!isAdmin(caller.role) && !isOwner(caller.role)) {
      return NextResponse.json({ error: 'Forbidden: Insufficient privileges.' }, { status: 403 });
    }

    const result = db.archiveProduct(id, { id: caller.id, role: caller.role });

    if (!result.success || !result.product) {
      return NextResponse.json({ error: result.error || 'Failed to archive product.' }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      message: 'Product successfully archived.',
      product: result.product,
    });
  } catch {
    return NextResponse.json({ error: 'Failed to archive product' }, { status: 500 });
  }
}
