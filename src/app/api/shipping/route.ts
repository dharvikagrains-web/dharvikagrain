import { NextRequest, NextResponse } from 'next/server';
import { getShippingProvider } from '@/lib/shipping/provider';
import { db } from '@/lib/db';
import { requireAuth } from '@/lib/auth/session';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const originPin = searchParams.get('originPin') || '515001'; // Ananthapuramu warehouse
    const destPin = searchParams.get('destPin') || '500081'; // Hyderabad
    const weightKg = parseFloat(searchParams.get('weight') || '1.5');

    const provider = getShippingProvider();
    const rates = await provider.getRates(originPin, destPin, weightKg);

    return NextResponse.json({ success: true, rates, provider: provider.name });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to fetch shipping rates' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    // Admin only
    const auth = await requireAuth(['SUPER_ADMIN', 'ADMIN', 'OPERATIONS']);
    if ('error' in auth) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    const body = await req.json();
    const { orderNumber, courierPartner, trackingId, awbNumber } = body;

    if (!orderNumber) {
      return NextResponse.json({ error: 'Order Number is required' }, { status: 400 });
    }

    const order = db.getOrder(orderNumber);
    if (!order) {
      return NextResponse.json({ error: `Order #${orderNumber} not found` }, { status: 404 });
    }

    const updated = db.updateOrderStatus(orderNumber, 'SHIPPED', {
      courierPartner: courierPartner || 'BlueDart Express',
      trackingId: trackingId || awbNumber || `AWB-${Date.now()}`,
      awbNumber: awbNumber || trackingId || `AWB-${Date.now()}`,
      note: `Shipment created via ${courierPartner || 'BlueDart'}`,
    });

    db.addAuditLog(
      auth.user.email,
      auth.user.role,
      'SHIPMENT_ASSIGNED',
      'ORDER',
      orderNumber,
      `Assigned ${courierPartner} tracking ${trackingId || awbNumber} to ${orderNumber}`
    );

    return NextResponse.json({ success: true, order: updated });
  } catch {
    return NextResponse.json({ error: 'Failed to assign shipment' }, { status: 500 });
  }
}
