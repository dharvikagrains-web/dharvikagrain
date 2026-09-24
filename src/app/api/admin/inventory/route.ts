import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getAuthenticatedProfile } from '@/lib/auth/session';

/**
 * GET /api/admin/inventory
 * View inventory and append-only ledger transactions.
 * Allowed: ADMIN, OWNER, OPERATIONS, INVENTORY_MANAGER.
 * Denied: CUSTOMER.
 */
export async function GET() {
  try {
    const caller = await getAuthenticatedProfile();
    if (!caller) {
      return NextResponse.json({ error: 'Unauthorized: Authentication required.' }, { status: 401 });
    }

    if (caller.role !== 'ADMIN' && caller.role !== 'OWNER' && (caller.role as string) !== 'SUPER_ADMIN') {
      return NextResponse.json(
        { error: 'Forbidden: Insufficient privileges. Admin or Owner required.' },
        { status: 403 }
      );
    }

    const inventory = db.getInventory();
    const transactions = db.getInventoryTransactions();

    return NextResponse.json({
      success: true,
      inventory,
      transactions: transactions.slice(0, 100),
    });
  } catch {
    return NextResponse.json({ error: 'Failed to fetch inventory' }, { status: 500 });
  }
}

/**
 * POST /api/admin/inventory
 * Traceable inventory actions: ADD, DEDUCT, ADJUST, RETURN.
 * Allowed: ADMIN, OWNER.
 * Denied: CUSTOMER.
 */
export async function POST(req: NextRequest) {
  try {
    const caller = await getAuthenticatedProfile();
    if (!caller) {
      return NextResponse.json({ error: 'Unauthorized: Authentication required.' }, { status: 401 });
    }

    if (caller.role !== 'ADMIN' && caller.role !== 'OWNER' && (caller.role as string) !== 'SUPER_ADMIN') {
      return NextResponse.json(
        { error: 'Forbidden: Insufficient privileges. Admin or Owner required to modify inventory.' },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { action, sku, quantity, batchNumber, delta, reason, orderNumber, notes } = body;

    const actor = {
      id: caller.id,
      role: caller.role,
      email: caller.email || `${caller.role.toLowerCase()}@dharvikagrains.in`,
    };

    if (action === 'ADD') {
      if (!sku || !quantity || !batchNumber) {
        return NextResponse.json(
          { error: 'Bad request: sku, positive integer quantity, and batchNumber are required' },
          { status: 400 }
        );
      }
      const result = db.addStock(sku, quantity, batchNumber, actor, notes);
      if (!result.success) {
        return NextResponse.json({ error: result.error }, { status: 400 });
      }
      return NextResponse.json({
        success: true,
        message: `Successfully received ${quantity} units for ${sku} from batch ${batchNumber}.`,
        inventory: result.inventory,
      });
    }

    if (action === 'DEDUCT') {
      if (!sku || !quantity) {
        return NextResponse.json(
          { error: 'Bad request: sku and positive integer quantity are required' },
          { status: 400 }
        );
      }
      const result = db.deductStock(sku, quantity, 'STOCK_SOLD', actor, undefined, reason || notes);
      if (!result.success) {
        return NextResponse.json({ error: result.error }, { status: 400 });
      }
      return NextResponse.json({
        success: true,
        message: `Successfully deducted ${quantity} units for ${sku}.`,
        inventory: result.inventory,
      });
    }

    if (action === 'RETURN') {
      if (!sku || !quantity || !orderNumber) {
        return NextResponse.json(
          { error: 'Bad request: sku, quantity, and orderNumber are required' },
          { status: 400 }
        );
      }
      const result = db.returnStock(sku, quantity, orderNumber, actor, notes);
      if (!result.success) {
        return NextResponse.json({ error: result.error }, { status: 400 });
      }
      return NextResponse.json({
        success: true,
        message: `Successfully returned ${quantity} units for ${sku} (Order #${orderNumber}).`,
        inventory: result.inventory,
      });
    }

    // Default: ADJUST delta
    if (typeof delta === 'number') {
      if (!sku || !reason) {
        return NextResponse.json(
          { error: 'SKU, numeric adjustment delta, and audit reason are mandatory.' },
          { status: 400 }
        );
      }
      const updated = db.adjustStock(sku, delta, reason, actor.email);
      return NextResponse.json({
        success: true,
        inventory: updated,
        message: `Stock for ${sku} adjusted by ${delta > 0 ? `+${delta}` : delta} units.`,
      });
    }

    return NextResponse.json(
      { error: 'Invalid inventory action. Supported actions: ADD, DEDUCT, RETURN, or numeric delta.' },
      { status: 400 }
    );
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Inventory operation failed' }, { status: 500 });
  }
}
