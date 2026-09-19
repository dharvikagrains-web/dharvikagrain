import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireAuth } from '@/lib/auth/session';

export async function GET() {
  try {
    const auth = await requireAuth(['SUPER_ADMIN', 'ADMIN', 'OPERATIONS']);
    if ('error' in auth) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    const coupons = db.getAllCoupons();
    return NextResponse.json({ success: true, coupons });
  } catch {
    return NextResponse.json({ error: 'Failed to fetch coupons' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const auth = await requireAuth(['SUPER_ADMIN', 'ADMIN']);
    if ('error' in auth) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    const body = await req.json();
    const {
      code,
      type = 'PERCENTAGE',
      discountPercent,
      discountAmount,
      minOrderValue = 499,
      maxDiscount,
      description,
      expiryDate,
      usageLimit = 500,
    } = body;

    if (!code) {
      return NextResponse.json({ error: 'Coupon code is mandatory.' }, { status: 400 });
    }

    const saved = db.createOrUpdateCoupon(
      {
        code: code.trim().toUpperCase(),
        type,
        discountPercent: discountPercent ? Number(discountPercent) : undefined,
        discountAmount: discountAmount ? Number(discountAmount) : undefined,
        minOrderValue: Number(minOrderValue),
        maxDiscount: maxDiscount ? Number(maxDiscount) : undefined,
        description: description || `Special offer with ${code}`,
        expiryDate: expiryDate || '31 Dec 2026',
        usageLimit: Number(usageLimit),
        timesUsed: 0,
        perUserLimit: 1,
        isActive: true,
      },
      auth.user.email
    );

    return NextResponse.json({ success: true, coupon: saved });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Coupon save failed' }, { status: 500 });
  }
}
