'use client';

import React, { Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { mockOrdersList } from '@/data/orders';
import { brandConfig } from '@/data/brandConfig';
import { Check, Truck, ArrowRight, ShoppingBag, ShieldCheck } from 'lucide-react';

function OrderSuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId') || 'DG10248';

  const order = mockOrdersList[0];

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12 sm:py-20 bg-[#FAF7F2]">
      <div className="w-full max-w-lg bg-white border border-[#E7DED4] p-8 sm:p-12 shadow-xl text-center space-y-8">
        {/* Animated Check Emblem */}
        <div className="flex flex-col items-center space-y-4">
          <div className="w-20 h-20 rounded-full bg-[#EBF7EE] border-2 border-[#0D3522] flex items-center justify-center text-[#0D3522] shadow-md animate-bounce">
            <Check className="w-10 h-10 stroke-[2.5]" />
          </div>

          <div className="space-y-1">
            <span className="text-xs font-bold tracking-[0.25em] text-[#C5A059] uppercase block">
              Payment Successful
            </span>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#0D3522] tracking-wide">
              ORDER CONFIRMED
            </h1>
            <p className="text-xs text-[#6B5B52] max-w-sm mx-auto leading-relaxed pt-1">
              Thank you for choosing <strong className="text-[#241611]">DHARVIKA GRAINS</strong>. Your harvest is being stone-picked and packed.
            </p>
          </div>
        </div>

        {/* Order ID & Estimated Delivery Box */}
        <div className="bg-[#FAF7F2] border border-[#C5A059]/40 p-5 rounded-xs space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-[#6B5B52]">Order Number:</span>
            <span className="font-mono font-bold text-sm text-[#0D3522]">#{orderId}</span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-[#6B5B52]">Estimated Delivery:</span>
            <span className="font-bold text-[#241611]">24–27 September 2026</span>
          </div>
          <div className="flex items-center justify-between text-xs pt-1 border-t border-[#E7DED4]">
            <span className="text-[#6B5B52]">Tracking Details:</span>
            <span className="text-[#0D3522] font-semibold">SMS & WhatsApp dispatched</span>
          </div>
        </div>

        {/* Ordered Items Preview */}
        <div className="text-left space-y-3 pt-2">
          <h2 className="text-[11px] font-bold uppercase tracking-wider text-[#6B5B52] pb-2 border-b border-[#E7DED4]">
            Order Items
          </h2>

          <div className="divide-y divide-[#E7DED4]">
            {order.items.map((item, idx) => (
              <div key={idx} className="py-2.5 flex items-center justify-between text-xs first:pt-0 last:pb-0">
                <div>
                  <p className="font-semibold text-[#241611]">{item.name}</p>
                  <p className="text-[11px] text-[#6B5B52]">{item.selectedWeight} × {item.quantity}</p>
                </div>
                <span className="font-bold text-[#0D3522]">
                  ₹{item.price * item.quantity}
                </span>
              </div>
            ))}
          </div>

          <div className="pt-3 border-t border-[#E7DED4] flex justify-between text-sm font-bold text-[#0D3522]">
            <span>Total Paid</span>
            <span>₹{order.total}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
          <Link
            href={`/account/orders/${orderId}`}
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
      </div>
    </div>
  );
}

export default function OrderSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[80vh] flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-[#0D3522] border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <OrderSuccessContent />
    </Suspense>
  );
}
