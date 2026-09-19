import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth/session';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ orderNumber: string }> }
) {
  try {
    const { orderNumber } = await params;
    if (!orderNumber) {
      return NextResponse.json({ error: 'Order Number is required' }, { status: 400 });
    }

    const order = db.getOrder(orderNumber);
    if (!order) {
      return NextResponse.json({ error: `Order #${orderNumber} not found` }, { status: 404 });
    }

    // Security check: Verify customer authorization
    const currentUser = await getCurrentUser();
    if (currentUser) {
      // Admin roles can view any order
      const isAdmin = currentUser.role === 'SUPER_ADMIN' || currentUser.role === 'ADMIN' || currentUser.role === 'OPERATIONS';
      if (!isAdmin) {
        // Customer can only view their own order
        const isOwner =
          order.email.toLowerCase() === currentUser.email.toLowerCase() ||
          order.mobile.replace(/\D/g, '').slice(-10) === currentUser.mobile.replace(/\D/g, '').slice(-10);

        if (!isOwner) {
          return NextResponse.json(
            { error: 'Forbidden: You do not have permission to view this order.' },
            { status: 403 }
          );
        }
      }
    }

    return NextResponse.json({
      success: true,
      order: {
        id: order.id,
        orderNumber: order.orderNumber,
        date: order.createdAt,
        status: order.orderStatus,
        paymentStatus: order.paymentStatus,
        paymentMethod: order.paymentMethod,
        customerName: order.customerName,
        email: order.email,
        mobile: order.mobile,
        shippingAddress: order.shippingAddressSnapshot,
        items: order.items,
        subtotal: order.subtotal,
        discount: order.discount,
        shippingFee: order.shippingFee,
        total: order.total,
        courierPartner: order.courierPartner,
        trackingId: order.trackingId,
        awbNumber: order.awbNumber,
        estimatedDelivery: order.estimatedDelivery,
        timeline: order.timeline,
      },
    });
  } catch (err: any) {
    return NextResponse.json({ error: 'Failed to retrieve order' }, { status: 500 });
  }
}
