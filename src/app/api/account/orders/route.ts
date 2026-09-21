import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth/session';
import { db } from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized: Please sign in to view your orders.' },
        { status: 401 }
      );
    }

    // Retrieve all orders for this customer by email
    const liveOrders = db.getOrdersForCustomer(user.email || user.mobile);

    return NextResponse.json({
      success: true,
      orders: liveOrders.map((o) => ({
        id: o.id,
        orderNumber: o.orderNumber,
        date: o.createdAt,
        total: o.total,
        status: o.orderStatus === 'PROCESSING' || o.orderStatus === 'PENDING_PAYMENT' ? 'Processing' : o.orderStatus === 'SHIPPED' ? 'Shipped' : o.orderStatus === 'DELIVERED' ? 'Delivered' : 'Order Processing',
        paymentStatus: o.paymentStatus,
        paymentMethod: o.paymentMethod,
        itemsCount: o.items.reduce((sum, it) => sum + it.quantity, 0),
        items: o.items.map((it) => ({
          name: it.name,
          weight: it.selectedWeight,
          quantity: it.quantity,
          price: it.price,
          image: it.image,
        })),
        shippingAddress: o.shippingAddressSnapshot,
        trackingId: o.trackingId,
        courierPartner: o.courierPartner,
        estimatedDelivery: o.estimatedDelivery,
      })),
    });
  } catch (error: any) {
    console.error('[API ACCOUNT ORDERS ERROR]:', error);
    return NextResponse.json({ success: false, error: error?.message || 'Failed to retrieve orders.' }, { status: 500 });
  }
}
