import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { createRazorpayOrder } from '@/lib/payments/razorpay';
import { getCurrentUser } from '@/lib/auth/session';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      customerName,
      email,
      mobile,
      shippingAddress,
      billingAddress,
      items,
      couponCode,
      paymentMethod = 'RAZORPAY',
    } = body;

    // 0. Enforce mandatory customer authentication
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Authentication required. Please sign in or register to place your order.' },
        { status: 401 }
      );
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Cannot create order with an empty cart.' },
        { status: 400 }
      );
    }

    if (!shippingAddress) {
      return NextResponse.json(
        { success: false, error: 'Delivery shipping address is required.' },
        { status: 400 }
      );
    }

    // 1. Create order in database with server-side price recalculation & atomic inventory reservation
    // Customer details are strictly bound to the authenticated user account
    const result = db.createOrderWithPriceSnapshot({
      customerId: user.id,
      customerName: user.fullName || customerName || 'Customer',
      email: user.email || email,
      mobile: user.mobile || mobile,
      shippingAddress,
      billingAddress,
      items: items.map((it: any) => ({
        productId: it.productId || it.id,
        selectedWeight: it.selectedWeight,
        quantity: it.quantity,
      })),
      couponCode,
      paymentMethod: paymentMethod === 'COD' ? 'COD' : 'RAZORPAY',
    });

    if (!result.success || !result.order) {
      return NextResponse.json(
        { success: false, error: result.error || 'Failed to initialize order.' },
        { status: 400 }
      );
    }

    const order = result.order;

    // 2. Handle Cash on Delivery
    if (paymentMethod === 'COD') {
      order.orderStatus = 'PROCESSING';
      order.paymentStatus = 'PENDING';
      order.paymentMethod = 'COD';
      order.timeline.push({
        status: 'Order Placed (COD)',
        timestamp: new Date().toLocaleDateString('en-IN', {
          day: 'numeric',
          month: 'short',
          year: 'numeric',
        }),
        note: 'Pay cash or UPI QR to delivery agent on arrival',
      });

      return NextResponse.json({
        success: true,
        orderNumber: order.orderNumber,
        isCod: true,
        total: order.total,
      });
    }

    // 3. Create Razorpay Payment Order (Amount in Paise)
    const amountPaise = Math.round(order.total * 100);
    const razorpayOrder = await createRazorpayOrder({
      amountPaise,
      currency: 'INR',
      receipt: order.orderNumber,
      notes: {
        orderNumber: order.orderNumber,
        customerEmail: order.email,
        mobile: order.mobile,
      },
    });

    // Update order with razorpay order ID
    order.razorpayOrderId = razorpayOrder.id;

    return NextResponse.json({
      success: true,
      orderNumber: order.orderNumber,
      razorpayOrderId: razorpayOrder.id,
      amount: amountPaise,
      currency: 'INR',
      keyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'rzp_test_placeholder_key',
      customerName: order.customerName,
      customerEmail: order.email,
      customerMobile: order.mobile,
      total: order.total,
    });
  } catch (err: any) {
    console.error('Error creating payment order:', err);
    return NextResponse.json(
      { success: false, error: 'Internal server error initializing payment.' },
      { status: 500 }
    );
  }
}
