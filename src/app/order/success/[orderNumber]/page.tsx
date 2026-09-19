'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { Check, Truck, ShoppingBag, ShieldCheck, MapPin, RefreshCw } from 'lucide-react';

interface OrderData {
  orderNumber: string;
  date: string;
  status: string;
  paymentStatus: string;
  paymentMethod: string;
  customerName: string;
  mobile: string;
  email: string;
  shippingAddress: {
    fullName?: string;
    street: string;
    apartment?: string;
    houseFlat?: string;
    streetArea?: string;
    city: string;
    state: string;
    pincode: string;
  };
  items: {
    productId: string;
    name: string;
    selectedWeight: string;
    price: number;
    quantity: number;
    image: string;
  }[];
  subtotal: number;
  shippingFee: number;
  discount: number;
  total: number;
  estimatedDelivery?: string;
}

export default function DynamicOrderSuccessPage() {
  const params = useParams();
  const rawOrderNumber = (params.orderNumber as string) || '';
  const orderNumber = decodeURIComponent(rawOrderNumber);

  const [order, setOrder] = useState<OrderData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadOrder() {
      try {
        const res = await fetch(`/api/orders/${encodeURIComponent(orderNumber)}`);
        if (res.ok) {
          const data = await res.json();
          if (data.order) {
            setOrder(data.order);
          } else {
            setError('Order details could not be retrieved.');
          }
        } else {
          setError(`Order #${orderNumber} could not be located.`);
        }
      } catch {
        setError('Network error fetching order details.');
      } finally {
        setLoading(false);
      }
    }

    if (orderNumber) {
      loadOrder();
    }
  }, [orderNumber]);

  if (loading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center bg-[#FAF7F2]">
        <div className="text-center space-y-3">
          <RefreshCw className="w-8 h-8 animate-spin text-[#0D3522] mx-auto" />
          <p className="text-xs text-[#6B5B52] uppercase tracking-wider font-semibold">
            Verifying order confirmation...
          </p>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-[75vh] flex items-center justify-center px-4 py-16 bg-[#FAF7F2]">
        <div className="max-w-md w-full bg-white border border-[#E7DED4] p-8 text-center space-y-4">
          <h2 className="text-xl font-serif font-bold text-[#0D3522]">Order Confirmation</h2>
          <p className="text-xs text-[#6B5B52]">{error || 'Unable to display order details.'}</p>
          <Link
            href="/shop"
            className="inline-block px-6 py-3 bg-[#0D3522] text-white text-xs uppercase tracking-widest font-semibold"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12 sm:py-20 bg-[#FAF7F2]">
      <div className="w-full max-w-xl bg-white border border-[#E7DED4] p-8 sm:p-12 shadow-xl text-center space-y-8">
        {/* Animated Check Emblem */}
        <div className="flex flex-col items-center space-y-4">
          <div className="w-20 h-20 rounded-full bg-[#EBF7EE] border-2 border-[#0D3522] flex items-center justify-center text-[#0D3522] shadow-md animate-bounce">
            <Check className="w-10 h-10 stroke-[2.5]" />
          </div>

          <div className="space-y-1">
            <span className="text-xs font-bold tracking-[0.25em] text-[#C5A059] uppercase block">
              {order.paymentStatus === 'PAID' ? '✓ Payment Confirmed' : '✓ Order Placed'}
            </span>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#0D3522] tracking-wide">
              ORDER CONFIRMED
            </h1>
            <p className="text-xs text-[#6B5B52] max-w-sm mx-auto leading-relaxed pt-1">
              Thank you for choosing <strong className="text-[#241611]">DHARVIKA GRAINS</strong>. Your harvest is being stone-picked and packed.
            </p>
          </div>
        </div>

        {/* Order Details Card */}
        <div className="bg-[#FAF7F2] border border-[#C5A059]/40 p-5 rounded-xs space-y-2.5 text-left text-xs">
          <div className="flex items-center justify-between">
            <span className="text-[#6B5B52]">Order Number:</span>
            <span className="font-mono font-bold text-sm text-[#0D3522]">#{order.orderNumber}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[#6B5B52]">Estimated Delivery:</span>
            <span className="font-bold text-[#241611]">{order.estimatedDelivery || '24–27 September 2026'}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[#6B5B52]">Payment Method:</span>
            <span className="font-semibold text-[#0D3522] uppercase tracking-wider">{order.paymentMethod}</span>
          </div>
          <div className="pt-2 border-t border-[#E7DED4] text-[#6B5B52]">
            <p className="font-semibold text-[#241611]">Delivery Address:</p>
            <p className="pt-0.5">
              {order.shippingAddress.fullName || order.customerName} — {order.shippingAddress.houseFlat || order.shippingAddress.street},{' '}
              {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.pincode}
            </p>
          </div>
        </div>

        {/* Ordered Items Preview */}
        <div className="text-left space-y-3 pt-2">
          <h2 className="text-[11px] font-bold uppercase tracking-wider text-[#6B5B52] pb-2 border-b border-[#E7DED4]">
            Order Items ({order.items.length})
          </h2>

          <div className="divide-y divide-[#E7DED4]">
            {order.items.map((item, idx) => (
              <div key={idx} className="py-2.5 flex items-center justify-between text-xs first:pt-0 last:pb-0">
                <div className="flex items-center space-x-3">
                  <div className="relative w-10 h-10 bg-[#FAF7F2] border border-[#E7DED4] overflow-hidden flex-shrink-0">
                    <Image src={item.image} alt={item.name} fill className="object-cover" />
                  </div>
                  <div>
                    <p className="font-semibold text-[#241611]">{item.name}</p>
                    <p className="text-[11px] text-[#6B5B52]">{item.selectedWeight} × {item.quantity}</p>
                  </div>
                </div>
                <span className="font-bold text-[#0D3522]">
                  ₹{item.price * item.quantity}
                </span>
              </div>
            ))}
          </div>

          <div className="pt-3 border-t border-[#E7DED4] space-y-1 text-xs text-[#6B5B52]">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span>₹{order.subtotal}</span>
            </div>
            {order.discount > 0 && (
              <div className="flex justify-between text-[#0D3522] font-semibold">
                <span>Coupon Savings:</span>
                <span>-₹{order.discount}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>Shipping Fee:</span>
              <span>{order.shippingFee === 0 ? 'FREE' : `₹${order.shippingFee}`}</span>
            </div>
            <div className="pt-2 border-t border-[#E7DED4] flex justify-between text-sm font-bold text-[#0D3522]">
              <span>Total Paid:</span>
              <span>₹{order.total}</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
          <Link
            href={`/account/orders/${order.orderNumber}`}
            className="w-full sm:w-1/2 py-3.5 bg-[#0D3522] hover:bg-[#134B31] text-white text-xs uppercase tracking-widest font-semibold transition-colors flex items-center justify-center space-x-1.5 shadow-md"
          >
            <Truck className="w-4 h-4" />
            <span>TRACK ORDER</span>
          </Link>
          <Link
            href="/shop"
            className="w-full sm:w-1/2 py-3.5 border border-[#E7DED4] hover:border-[#241611] text-[#241611] text-xs uppercase tracking-widest font-semibold transition-colors flex items-center justify-center space-x-1.5"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>CONTINUE SHOPPING</span>
          </Link>
        </div>

        <div className="text-[10px] text-[#8C7A70] flex items-center justify-center space-x-1">
          <ShieldCheck className="w-3.5 h-3.5 text-[#C5A059]" />
          <span>Confirmation dispatched via SMS and registered email</span>
        </div>
      </div>
    </div>
  );
}
