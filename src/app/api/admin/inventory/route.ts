import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireAuth } from '@/lib/auth/session';

export async function GET() {
  try {
    const auth = await requireAuth(['SUPER_ADMIN', 'ADMIN', 'OPERATIONS', 'INVENTORY_MANAGER']);
    if ('error' in auth) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    const inventory = db.getInventory();
    const transactions = db.getInventoryTransactions();

    return NextResponse.json({
      success: true,
      inventory,
      transactions: transactions.slice(0, 50),
    });
  } catch (err: any) {
    return NextResponse.json({ error: 'Failed to fetch inventory' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const auth = await requireAuth(['SUPER_ADMIN', 'ADMIN', 'OPERATIONS', 'INVENTORY_MANAGER']);
    if ('error' in auth) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    const body = await req.json();
    const { sku, delta, reason } = body;

    if (!sku || typeof delta !== 'number' || !reason) {
      return NextResponse.json(
        { error: 'SKU, numeric adjustment delta, and audit reason are mandatory.' },
        { status: 400 }
      );
    }

    const updated = db.adjustStock(sku, delta, reason, auth.user.email);

    return NextResponse.json({
      success: true,
      item: updated,
      message: `Stock for ${sku} adjusted by ${delta > 0 ? `+${delta}` : delta} units.`,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Stock adjustment failed' }, { status: 500 });
  }
}
