import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { verifyWebhookSignature } from '@/lib/payments/razorpay';

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get('x-razorpay-signature');

    if (!signature) {
      return NextResponse.json({ error: 'Missing webhook signature header' }, { status: 400 });
    }

    const isValid = verifyWebhookSignature(rawBody, signature);
    if (!isValid) {
      db.addAuditLog(
        'webhook@razorpay.com',
        'SYSTEM',
        'WEBHOOK_SIGNATURE_INVALID',
        'PAYMENT',
        'N/A',
        'Rejected unverified webhook call.'
      );
      return NextResponse.json({ error: 'Invalid webhook signature' }, { status: 401 });
    }

    const event = JSON.parse(rawBody);
    const eventType = event.event;
    const payload = event.payload;

    if (eventType === 'payment.captured') {
      const payment = payload.payment?.entity;
      const orderNumber = payment?.notes?.orderNumber;

      if (orderNumber) {
        const order = db.getOrder(orderNumber);
        if (order && order.paymentStatus !== 'PAID') {
          db.markOrderAsPaid(orderNumber, {
            razorpayPaymentId: payment.id,
            razorpayOrderId: payment.order_id,
            method: payment.method,
          });
        }
      }
    } else if (eventType === 'payment.failed') {
      const payment = payload.payment?.entity;
      const orderNumber = payment?.notes?.orderNumber;

      if (orderNumber) {
        const order = db.getOrder(orderNumber);
        if (order && order.paymentStatus === 'PENDING') {
          order.paymentStatus = 'FAILED';
          order.orderStatus = 'PAYMENT_FAILED';
          order.timeline.push({
            status: 'Payment Failed',
            timestamp: new Date().toLocaleDateString('en-IN'),
            note: payment?.error_description || 'Payment was unsuccessful or cancelled by customer',
          });

          // Release reserved inventory back to available stock
          const reservationItems = order.items.map((it) => ({
            sku: it.sku,
            quantity: it.quantity,
          }));
          db.releaseInventory(reservationItems, order.orderNumber);
        }
      }
    } else if (eventType === 'refund.processed') {
      const refund = payload.refund?.entity;
      const payment = payload.payment?.entity;
      const orderNumber = payment?.notes?.orderNumber;

      if (orderNumber) {
        const order = db.getOrder(orderNumber);
        if (order) {
          order.paymentStatus = 'REFUNDED';
          order.orderStatus = 'REFUNDED';
          order.timeline.push({
            status: 'Refund Completed',
            timestamp: new Date().toLocaleDateString('en-IN'),
            note: `Refund of ₹${(refund.amount / 100).toFixed(2)} credited via ${payment?.method || 'Original Source'}`,
          });
        }
      }
    }

    return NextResponse.json({ status: 'ok' });
  } catch (err: any) {
    console.error('Webhook processing error:', err);
    return NextResponse.json({ error: 'Webhook handler error' }, { status: 500 });
  }
}
