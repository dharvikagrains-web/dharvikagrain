'use client';

import React, { useEffect, useState, use } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { brandConfig } from '@/data/brandConfig';
import { formatCurrency } from '@/lib/utils';
import { CheckCircle2, Package, Truck, ArrowRight, Clock, ShieldCheck } from 'lucide-react';

export default function OrderSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ orderId?: string }>;
}) {
  const { orderId: paramOrderId } = use(searchParams);
  const [order, setOrder] = useState<any>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = sessionStorage.getItem('latest_order');
      if (saved) {
        setOrder(JSON.parse(saved));
      }
    }
  }, []);

  const displayOrderId = order?.orderId || paramOrderId || 'ORD-IN-839210';
  const orderDate = order?.date || new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
      <div className="bg-white border border-[#E7DED4] p-8 sm:p-12 shadow-sm space-y-8">
        {/* Success Icon & Header */}
        <div className="text-center space-y-3 pb-6 border-b border-[#E7DED4]">
          <div className="w-16 h-16 bg-[#F5EFEB] rounded-full mx-auto flex items-center justify-center text-[#274135]">
            <CheckCircle2 className="w-10 h-10 stroke-[1.8]" />
          </div>
          <span className="text-xs uppercase tracking-widest font-bold text-[#B35638]">
            Order Placed Successfully
          </span>
          <h1 className="text-2xl sm:text-3xl font-serif font-semibold text-[#241611]">
            Thank You for Supporting Authentic Grains & Spices
          </h1>
          <p className="text-xs sm:text-sm text-[#6B5B52] max-w-md mx-auto">
            Your order has been recorded. Our facility will freshly pack your unpolished grains
            and cold-ground spices.
          </p>
          <div className="pt-2 inline-flex items-center space-x-3 text-xs bg-[#FAF7F2] border border-[#E7DED4] px-4 py-2">
            <span className="text-[#6B5B52]">Order Number:</span>
            <span className="font-mono font-bold text-[#241611]">{displayOrderId}</span>
          </div>
        </div>

        {/* Status Tracker */}
        <div className="space-y-4">
          <h3 className="text-xs uppercase tracking-widest font-semibold text-[#241611]">
            Order Status & Timeline
          </h3>
          <div className="grid grid-cols-4 gap-2 text-center text-xs">
            <div className="space-y-1">
              <div className="w-7 h-7 mx-auto rounded-full bg-[#274135] text-white flex items-center justify-center text-xs font-bold">
                ✓
              </div>
              <span className="font-semibold text-[#241611] block text-[11px]">Confirmed</span>
              <span className="text-[10px] text-[#8C7A70]">{orderDate}</span>
            </div>
            <div className="space-y-1">
              <div className="w-7 h-7 mx-auto rounded-full bg-[#FAF7F2] border border-[#B35638] text-[#B35638] flex items-center justify-center text-xs font-bold">
                2
              </div>
              <span className="font-semibold text-[#6B5B52] block text-[11px]">Processing</span>
              <span className="text-[10px] text-[#8C7A70]">Next 24 hrs</span>
            </div>
            <div className="space-y-1">
              <div className="w-7 h-7 mx-auto rounded-full bg-[#FAF7F2] border border-[#E7DED4] text-[#8C7A70] flex items-center justify-center text-xs">
                3
              </div>
              <span className="text-[#8C7A70] block text-[11px]">Packed & Shipped</span>
            </div>
            <div className="space-y-1">
              <div className="w-7 h-7 mx-auto rounded-full bg-[#FAF7F2] border border-[#E7DED4] text-[#8C7A70] flex items-center justify-center text-xs">
                4
              </div>
              <span className="text-[#8C7A70] block text-[11px]">Delivered</span>
            </div>
          </div>
        </div>

        {/* Order Details & Summary */}
        {order && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-[#E7DED4] text-xs">
            <div>
              <h4 className="font-serif font-semibold text-[#241611] text-sm mb-2">
                Shipping Details
              </h4>
              <p className="font-medium text-[#241611]">{order.customer.fullName}</p>
              <p className="text-[#6B5B52]">{order.customer.houseAddress}, {order.customer.streetAddress}</p>
              <p className="text-[#6B5B52]">{order.customer.city}, {order.customer.state} — {order.customer.pincode}</p>
              <p className="text-[#6B5B52] mt-1">Mobile: +91 {order.customer.mobile}</p>
              <p className="text-[#6B5B52]">Email: {order.customer.email}</p>
            </div>

            <div>
              <h4 className="font-serif font-semibold text-[#241611] text-sm mb-2">
                Payment Breakdown
              </h4>
              <div className="space-y-1.5 text-[#6B5B52]">
                <div className="flex justify-between">
                  <span>Method</span>
                  <span className="font-medium text-[#241611] uppercase">{order.paymentMethod}</span>
                </div>
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-medium text-[#241611]">{formatCurrency(order.subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery</span>
                  <span>{order.shippingFee === 0 ? 'FREE' : formatCurrency(order.shippingFee)}</span>
                </div>
                <div className="flex justify-between text-sm font-bold text-[#241611] pt-2 border-t border-[#E7DED4]">
                  <span>Total Paid</span>
                  <span>{formatCurrency(order.total)}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Customer Support Information */}
        <div className="p-4 bg-[#FAF7F2] border border-[#E7DED4] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <div className="space-y-0.5 text-center sm:text-left">
            <span className="font-semibold text-[#241611]">Need assistance with this order?</span>
            <p className="text-[#6B5B52]">
              Contact our care desk at {brandConfig.supportEmail} or {brandConfig.supportPhone}
            </p>
          </div>
          <Link
            href="/shop"
            className="px-6 py-2.5 bg-[#241611] hover:bg-[#B35638] text-white uppercase tracking-wider font-semibold transition-colors whitespace-nowrap"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
