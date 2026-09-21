import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { verifyRazorpaySignature } from '@/lib/payments/razorpay';
import { sendOrderConfirmationViaResend } from '@/lib/email/resend';
import { sendOrderConfirmationViaMsg91 } from '@/lib/sms/msg91';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      orderNumber,
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      method = 'UPI',
    } = body;

    if (!orderNumber || !razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json(
        { success: false, error: 'Missing required Razorpay payment signature parameters.' },
        { status: 400 }
      );
    }

    const order = db.getOrder(orderNumber);
    if (!order) {
      return NextResponse.json(
        { success: false, error: `Order #${orderNumber} not found.` },
        { status: 404 }
      );
    }

    // Verify HMAC-SHA256 signature server-side
    const isValid = verifyRazorpaySignature({
      razorpayOrderId: razorpay_order_id,
      razorpayPaymentId: razorpay_payment_id,
      razorpaySignature: razorpay_signature,
    });

    if (!isValid) {
      db.addAuditLog(
        order.email,
        'SYSTEM',
        'PAYMENT_SIGNATURE_MISMATCH',
        'ORDER',
        orderNumber,
        `Tampered or invalid signature attempt for Order #${orderNumber}`
      );

      return NextResponse.json(
        { success: false, error: 'Payment signature verification failed. Tampering detected.' },
        { status: 400 }
      );
    }

    // Atomically transition order to PAID, commit reserved stock to sold, record payment entity
    const updatedOrder = db.markOrderAsPaid(orderNumber, {
      razorpayOrderId: razorpay_order_id,
      razorpayPaymentId: razorpay_payment_id,
      signature: razorpay_signature,
      method,
    });

    // Fire and forget transactional receipt email & SMS
    sendOrderConfirmationViaResend({
      orderNumber: updatedOrder.orderNumber,
      email: updatedOrder.email,
      customerName: updatedOrder.customerName,
      items: updatedOrder.items,
      total: updatedOrder.total,
      subtotal: updatedOrder.subtotal,
      discount: updatedOrder.discount,
      shippingFee: updatedOrder.shippingFee,
      shippingAddress: updatedOrder.shippingAddressSnapshot,
      paymentMethod: method,
    }).catch((e) => console.error('Order confirmation email error:', e));

    sendOrderConfirmationViaMsg91({
      mobile: updatedOrder.mobile,
      orderNumber: updatedOrder.orderNumber,
      total: updatedOrder.total,
    }).catch((e) => console.error('Order confirmation SMS error:', e));

    return NextResponse.json({
      success: true,
      orderNumber: updatedOrder.orderNumber,
      status: updatedOrder.orderStatus,
      paymentStatus: updatedOrder.paymentStatus,
    });
  } catch (err: any) {
    console.error('Payment verification error:', err);
    return NextResponse.json(
      { success: false, error: 'Internal server error verifying payment.' },
      { status: 500 }
    );
  }
}
