'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { mockOrdersList } from '@/data/orders';
import {
  ArrowLeft,
  Truck,
  CheckCircle2,
  Clock,
  Package,
  CreditCard,
  MapPin,
  ExternalLink,
  ShieldCheck,
} from 'lucide-react';

const trackingStages = [
  { key: 'Order Placed', label: 'Order Placed', desc: 'Received and verified in system' },
  { key: 'Payment Confirmed', label: 'Payment Confirmed', desc: 'Secure payment cleared via UPI' },
  { key: 'Order Processing', label: 'Order Processing', desc: 'Stone-picked & destoned fresh' },
  { key: 'Packed', label: 'Packed', desc: 'Sealed in moisture-barrier aroma pouches' },
  { key: 'Shipped', label: 'Shipped', desc: 'Handed over to courier partner' },
  { key: 'Out for Delivery', label: 'Out for Delivery', desc: 'Courier executive assigned' },
  { key: 'Delivered', label: 'Delivered', desc: 'Delivered to your doorstep' },
];

export default function OrderTrackingPage() {
  const params = useParams();
  const orderId = (params.id as string) || 'DG10248';

  const order =
    mockOrdersList.find((o) => o.orderId.toLowerCase() === orderId.toLowerCase()) ||
    mockOrdersList[0];

  // Determine which step index the order is currently at
  const currentStageIndex = trackingStages.findIndex((s) => s.key === order.status);
  const activeIndex = currentStageIndex !== -1 ? currentStageIndex : 5; // default to Out for Delivery

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-8">
      <div className="flex items-center space-x-2 text-xs text-[#6B5B52]">
        <Link href="/account/orders" className="hover:text-[#0D3522] flex items-center transition-colors">
          <ArrowLeft className="w-3.5 h-3.5 mr-1" /> Back to All Orders
        </Link>
      </div>

      {/* Header Banner */}
      <div className="bg-white border border-[#E7DED4] p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs">
        <div>
          <span className="text-xs font-semibold tracking-widest text-[#C5A059] uppercase block">
            Shipment Status
          </span>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#0D3522] mt-0.5">
            ORDER #{order.orderId}
          </h1>
          <p className="text-xs text-[#6B5B52] mt-1">
            Placed on {order.date} • Estimated Delivery: <strong className="text-[#241611]">{order.estimatedDelivery || '24–27 September 2026'}</strong>
          </p>
        </div>

        <div className="text-left sm:text-right bg-[#FAF7F2] p-4 border border-[#E7DED4] sm:min-w-[220px]">
          <p className="text-[10px] uppercase tracking-wider text-[#6B5B52] font-semibold">Delivery Partner</p>
          <p className="text-sm font-bold text-[#0D3522]">{order.courierPartner || 'BlueDart Express'}</p>
          <p className="text-[11px] text-[#241611] mt-0.5 font-mono">
            AWB: {order.trackingId || 'BD-IN-88392019'}
          </p>
        </div>
      </div>

      {/* 7-Stage Visual Timeline */}
      <div className="bg-white border border-[#E7DED4] p-6 sm:p-8 space-y-6 shadow-xs">
        <h2 className="text-base font-serif font-bold text-[#241611] uppercase tracking-wider pb-3 border-b border-[#E7DED4]">
          Live Shipment Progress
        </h2>

        <div className="relative pl-6 sm:pl-8 space-y-8 before:absolute before:left-2.5 sm:before:left-3.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-[#E7DED4]">
          {trackingStages.map((stage, idx) => {
            const isCompleted = idx < activeIndex;
            const isCurrent = idx === activeIndex;

            return (
              <div key={stage.key} className="relative flex items-start space-x-4">
                <div
                  className={`absolute -left-6 sm:-left-8 top-0.5 w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                    isCompleted
                      ? 'bg-[#0D3522] text-white'
                      : isCurrent
                      ? 'bg-[#C5A059] text-white ring-4 ring-[#C5A059]/20 animate-pulse'
                      : 'bg-white border-2 border-[#D8CCC0] text-[#8C7A70]'
                  }`}
                >
                  {isCompleted ? '✓' : idx + 1}
                </div>

                <div className="space-y-0.5">
                  <div className="flex items-center space-x-2">
                    <h3
                      className={`text-sm font-semibold tracking-wide ${
                        isCurrent
                          ? 'text-[#0D3522] font-bold'
                          : isCompleted
                          ? 'text-[#241611]'
                          : 'text-[#8C7A70]'
                      }`}
                    >
                      {stage.label}
                    </h3>
                    {isCurrent && (
                      <span className="px-2 py-0.5 bg-[#FDF7E7] text-[#C5A059] text-[10px] font-bold uppercase tracking-wider rounded-xs">
                        Current Status
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-[#6B5B52]">{stage.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Delivery & Items Summary */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        <div className="md:col-span-7 bg-white border border-[#E7DED4] p-6 space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#241611] pb-2 border-b border-[#E7DED4]">
            Package Contents ({order.items.length})
          </h3>
          <div className="divide-y divide-[#E7DED4]">
            {order.items.map((item, idx) => (
              <div key={idx} className="py-3 flex items-center justify-between gap-4 first:pt-0 last:pb-0">
                <div className="flex items-center space-x-3">
                  <div className="relative w-12 h-12 bg-[#FAF7F2] border border-[#E7DED4] overflow-hidden flex-shrink-0">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="text-xs">
                    <p className="font-semibold text-[#241611]">{item.name}</p>
                    <p className="text-[#6B5B52]">{item.selectedWeight} • Qty: {item.quantity}</p>
                  </div>
                </div>
                <span className="text-xs font-bold text-[#0D3522]">
                  ₹{item.price * item.quantity}
                </span>
              </div>
            ))}
          </div>

          <div className="pt-3 border-t border-[#E7DED4] space-y-1.5 text-xs text-[#6B5B52]">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>₹{order.subtotal}</span>
            </div>
            <div className="flex justify-between">
              <span>Delivery</span>
              <span className="text-[#0D3522] font-semibold">{order.shippingFee === 0 ? 'FREE' : `₹${order.shippingFee}`}</span>
            </div>
            <div className="flex justify-between font-bold text-sm text-[#0D3522] pt-2 border-t border-[#E7DED4]">
              <span>Total Paid</span>
              <span>₹{order.total}</span>
            </div>
          </div>
        </div>

        <div className="md:col-span-5 space-y-6">
          <div className="bg-white border border-[#E7DED4] p-6 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#241611] pb-2 border-b border-[#E7DED4] flex items-center space-x-1.5">
              <MapPin className="w-4 h-4 text-[#C5A059]" />
              <span>Delivery Address</span>
            </h3>
            <div className="text-xs text-[#6B5B52] space-y-1">
              <p className="font-bold text-[#241611]">{order.shippingAddress.fullName || order.customerName}</p>
              <p>{order.shippingAddress.street}</p>
              {order.shippingAddress.apartment && <p>{order.shippingAddress.apartment}</p>}
              <p>{order.shippingAddress.city}, {order.shippingAddress.state} — {order.shippingAddress.pincode}</p>
              <p className="pt-1 text-[#241611]">Contact: {order.mobile}</p>
            </div>
          </div>

          <div className="bg-[#FAF7F2] border border-[#C5A059]/40 p-5 space-y-2 text-xs">
            <div className="flex items-center space-x-2 text-[#0D3522] font-bold">
              <ShieldCheck className="w-4 h-4 text-[#C5A059]" />
              <span>Need help with this order?</span>
            </div>
            <p className="text-[#6B5B52] leading-relaxed">
              If you have any questions regarding delivery or batch lab verification, reach our care desk at{' '}
              <a href="mailto:care@dharvikagrains.in" className="text-[#0D3522] font-semibold underline">
                care@dharvikagrains.in
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
