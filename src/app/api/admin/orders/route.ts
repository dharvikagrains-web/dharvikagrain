import { NextRequest, NextResponse } from 'next/server';
import { db, OrderStatus } from '@/lib/db';
import { requireAuth } from '@/lib/auth/session';

export async function GET(req: NextRequest) {
  try {
    const auth = await requireAuth(['SUPER_ADMIN', 'ADMIN', 'OPERATIONS', 'CUSTOMER_SUPPORT']);
    if ('error' in auth) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');
    const query = searchParams.get('q')?.toLowerCase();

    let orders = db.getAllOrders();

    if (status && status !== 'ALL') {
      orders = orders.filter((o) => o.orderStatus.toUpperCase() === status.toUpperCase());
    }

    if (query) {
      orders = orders.filter(
        (o) =>
          o.orderNumber.toLowerCase().includes(query) ||
          o.customerName.toLowerCase().includes(query) ||
          o.email.toLowerCase().includes(query) ||
          o.mobile.includes(query)
      );
    }

    return NextResponse.json({ success: true, orders });
  } catch {
    return NextResponse.json({ error: 'Failed to retrieve orders' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const auth = await requireAuth(['SUPER_ADMIN', 'ADMIN', 'OPERATIONS']);
    if ('error' in auth) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    const body = await req.json();
    const { orderNumber, status, courierPartner, trackingId, awbNumber, note } = body;

    if (!orderNumber || !status) {
      return NextResponse.json({ error: 'Order Number and Status are required' }, { status: 400 });
    }

    const updated = db.updateOrderStatus(orderNumber, status as OrderStatus, {
      courierPartner,
      trackingId,
      awbNumber,
      note,
    });

    db.addAuditLog(
      auth.user.email,
      auth.user.role,
      'ORDER_STATUS_CHANGED',
      'ORDER',
      orderNumber,
      `Status changed to ${status}${courierPartner ? ` via ${courierPartner}` : ''}`
    );

    return NextResponse.json({ success: true, order: updated });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to update order' }, { status: 500 });
  }
}
