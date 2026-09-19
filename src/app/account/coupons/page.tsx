'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { availableCoupons } from '@/data/coupons';
import { Tag, Copy, Check, ArrowLeft, ArrowRight, Sparkles } from 'lucide-react';

export default function AccountCouponsPage() {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-8">
      <div className="flex items-center space-x-2 text-xs text-[#6B5B52]">
        <Link href="/account" className="hover:text-[#0D3522] flex items-center transition-colors">
          <ArrowLeft className="w-3.5 h-3.5 mr-1" /> Back to My Account
        </Link>
      </div>

      <div className="border-b border-[#E7DED4] pb-6">
        <span className="text-xs font-semibold tracking-widest text-[#B35638] uppercase">
          Special Discounts
        </span>
        <h1 className="text-3xl font-serif font-bold text-[#0D3522] mt-1">
          Available Offers & Coupons
        </h1>
        <p className="text-xs text-[#6B5B52] mt-1">
          Apply these coupon codes at checkout or directly in your shopping cart.
        </p>
      </div>

      {/* Coupons Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {availableCoupons.map((coupon) => (
          <div
            key={coupon.code}
            className="bg-white border border-[#E7DED4] p-6 space-y-4 hover:border-[#C5A059] transition-all shadow-xs relative overflow-hidden flex flex-col justify-between"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center space-x-1.5 px-3 py-1 bg-[#FDF7E7] border border-[#C5A059]/40 text-xs font-mono font-bold text-[#0D3522] tracking-wider rounded-xs">
                  <Tag className="w-3 h-3 text-[#C5A059]" />
                  <span>{coupon.code}</span>
                </span>
                <span className="text-[10px] text-[#8C7A70] uppercase font-semibold">
                  Valid till {coupon.expiryDate}
                </span>
              </div>

              <h3 className="text-lg font-serif font-bold text-[#0D3522]">
                {coupon.discountPercent
                  ? `${coupon.discountPercent}% OFF`
                  : `₹${coupon.discountAmount} OFF`}
              </h3>
              <p className="text-xs text-[#6B5B52] leading-relaxed">
                {coupon.description}
              </p>
              <p className="text-[11px] text-[#8C7A70]">
                Minimum purchase value: <strong className="text-[#241611]">₹{coupon.minOrderValue}</strong>
              </p>
            </div>

            <div className="pt-4 border-t border-[#E7DED4] flex items-center justify-between">
              <button
                type="button"
                onClick={() => handleCopy(coupon.code)}
                className={`inline-flex items-center space-x-1.5 px-4 py-2 text-xs uppercase tracking-wider font-bold transition-colors ${
                  copiedCode === coupon.code
                    ? 'bg-[#EBF7EE] text-[#0D3522]'
                    : 'bg-[#FAF7F2] border border-[#E7DED4] text-[#241611] hover:border-[#0D3522]'
                }`}
              >
                {copiedCode === coupon.code ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-[#0D3522]" />
                    <span>COPIED!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>COPY CODE</span>
                  </>
                )}
              </button>

              <Link
                href="/shop"
                className="text-xs text-[#0D3522] font-semibold hover:underline flex items-center space-x-1"
              >
                <span>Shop Now</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
