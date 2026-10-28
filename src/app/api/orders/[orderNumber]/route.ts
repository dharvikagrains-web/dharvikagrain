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

    // 1. Mandatory authentication check
    const currentUser = await getCurrentUser(req);
    if (!currentUser) {
      return NextResponse.json(
        { error: 'Unauthorized: Authentication required to view order details.' },
        { status: 401 }
      );
    }

    // 2. Retrieve order after authentication
    const order = db.getOrder(orderNumber);
    if (!order) {
      return NextResponse.json({ error: `Order #${orderNumber} not found` }, { status: 404 });
    }

    // 2. Authorization check: Admin roles or owning customer only
    const isAdmin =
      currentUser.role === 'SUPER_ADMIN' ||
      currentUser.role === 'ADMIN' ||
      currentUser.role === 'OPERATIONS' ||
      currentUser.role === 'OWNER';

    const orderEmail = (order.email || '').toLowerCase().trim();
    const userEmail = (currentUser.email || '').toLowerCase().trim();
    const orderMobile = (order.mobile || '').replace(/\D/g, '').slice(-10);
    const userMobile = (currentUser.mobile || '').replace(/\D/g, '').slice(-10);

    const isOwner =
      (orderEmail && userEmail && orderEmail === userEmail) ||
      (order.customerId && order.customerId === currentUser.id) ||
      (orderMobile && userMobile && orderMobile === userMobile);

    if (!isAdmin && !isOwner) {
      return NextResponse.json(
        { error: 'Forbidden: You do not have permission to view this order.' },
        { status: 403 }
      );
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
  } catch {
    return NextResponse.json({ error: 'Failed to retrieve order' }, { status: 500 });
  }
}

export async function POST() {
  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
}

export async function PUT() {
  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
}

export async function PATCH() {
  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
}

export async function DELETE() {
  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
}
