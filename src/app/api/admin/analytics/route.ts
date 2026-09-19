import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireAuth } from '@/lib/auth/session';

export async function GET() {
  try {
    const auth = await requireAuth(['SUPER_ADMIN', 'ADMIN', 'OPERATIONS']);
    if ('error' in auth) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    const orders = db.getAllOrders();
    const inventory = db.getInventory();
    const customers = db.getAllCustomers();

    // Compute key e-commerce indicators
    const totalRevenue = orders.reduce((sum, o) => (o.paymentStatus === 'PAID' ? sum + o.total : sum), 0);
    const paidOrders = orders.filter((o) => o.paymentStatus === 'PAID');
    const pendingOrders = orders.filter((o) => o.orderStatus === 'PROCESSING' || o.orderStatus === 'PENDING_PAYMENT');
    const lowStockItems = inventory.filter((i) => i.stock <= i.threshold);

    return NextResponse.json({
      success: true,
      metrics: {
        totalRevenueINR: totalRevenue,
        totalOrdersCount: orders.length,
        paidOrdersCount: paidOrders.length,
        pendingOrdersCount: pendingOrders.length,
        totalCustomersCount: customers.length,
        lowStockAlertCount: lowStockItems.length,
        averageOrderValue: paidOrders.length > 0 ? Math.round(totalRevenue / paidOrders.length) : 0,
      },
      recentOrders: orders.slice(0, 10),
      lowStockItems,
    });
  } catch {
    return NextResponse.json({ error: 'Failed to compute metrics' }, { status: 500 });
  }
}
