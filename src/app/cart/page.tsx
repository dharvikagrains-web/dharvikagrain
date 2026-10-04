'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { availableCoupons } from '@/data/coupons';
import { formatCurrency } from '@/lib/utils';
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag, ShieldCheck, ArrowLeft, Heart, Truck } from 'lucide-react';

export default function CartPage() {
  const {
    cart,
    updateQuantity,
    removeFromCart,
    subtotal,
    shippingFee,
    freeShippingThreshold,
    amountNeededForFreeShipping,
    total,
  } = useCart();

  const { addToWishlist } = useWishlist();

  const [promoCode, setPromoCode] = useState('');
  const [discountAmount, setDiscountAmount] = useState(0);
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [promoMessage, setPromoMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const freeShippingProgress = Math.min(100, Math.round((subtotal / freeShippingThreshold) * 100));

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    const code = promoCode.trim().toUpperCase();
    const match = availableCoupons.find((c) => c.code === code);

    if (!match) {
      setPromoMessage({ type: 'error', text: 'Invalid coupon code. Try WELCOME10 or TRADITION10.' });
      return;
    }

    if (subtotal < match.minOrderValue) {
      setPromoMessage({
        type: 'error',
        text: `Coupon valid on minimum orders of ₹${match.minOrderValue}. Add ₹${match.minOrderValue - subtotal} more.`,
      });
      return;
    }

    let calculatedDiscount = 0;
    if (match.discountPercent) {
      calculatedDiscount = Math.round((subtotal * match.discountPercent) / 100);
    } else if (match.discountAmount) {
      calculatedDiscount = match.discountAmount;
    }

    setDiscountAmount(calculatedDiscount);
    setAppliedCoupon(match.code);
    setPromoMessage({ type: 'success', text: `Coupon ${match.code} applied! Saved ₹${calculatedDiscount}` });
  };

  const handleMoveToWishlist = (productId: string, selectedWeight: string) => {
    addToWishlist(productId);
    removeFromCart(productId, selectedWeight);
  };

  const finalTotal = Math.max(0, total - discountAmount);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Return Link */}
      <div className="flex items-center gap-2 text-[12px] text-[#685950] mb-6">
        <Link
          href="/shop"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[6px] bg-white border border-[#E2D9CE] hover:text-[#1A382B] text-[#221814] font-medium transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Continue Shopping
        </Link>
      </div>

      {/* Header Banner */}
      <div className="rounded-[12px] bg-[#F4EFEA] border border-[#E2D9CE] p-6 sm:p-8 mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-semibold tracking-wider text-[#9E462A] uppercase block font-data">
            Order Review
          </span>
          <h1 className="text-2xl sm:text-3xl font-serif font-semibold text-[#221814] mt-0.5">
            Your Shopping Basket
          </h1>
        </div>
        <p className="text-[12px] font-data font-semibold px-3 py-1.5 rounded-[4px] bg-white border border-[#E2D9CE] text-[#1A382B] self-start sm:self-auto">
          {cart.reduce((sum, item) => sum + item.quantity, 0)} items in basket
        </p>
      </div>

      {cart.length === 0 ? (
        <div className="text-center py-16 rounded-[12px] bg-white border border-[#E2D9CE] p-8 max-w-lg mx-auto space-y-3">
          <div className="w-14 h-14 mx-auto rounded-[8px] bg-[#FAF7F2] border border-[#E2D9CE] flex items-center justify-center text-[#8C7A70]">
            <ShoppingBag className="w-6 h-6 stroke-[1.4] text-[#1A382B]" />
          </div>
          <h2 className="text-xl font-serif font-semibold text-[#221814]">Your basket is currently empty</h2>
          <p className="text-[13px] text-[#685950] leading-relaxed max-w-sm mx-auto">
            Discover the uncompromised purity of our unpolished Chiru Dhanyalu, single-origin spices, and curated combos.
          </p>
          <div className="pt-2">
            <Link
              href="/shop"
              className="inline-block px-6 py-2.5 rounded-[6px] bg-[#1A382B] hover:bg-[#132B21] text-white text-[13px] font-semibold transition-colors"
            >
              Explore Provisions
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          {/* Cart Items List */}
          <div className="lg:col-span-8 space-y-4">
            {/* Free Delivery Meter */}
            <div className="rounded-[10px] bg-white border border-[#E2D9CE] p-4 space-y-2">
              <div className="flex items-center justify-between text-[12px] font-medium">
                <div className="flex items-center gap-1.5 text-[#1A382B]">
                  <Truck className="w-4 h-4 text-[#1A382B]" />
                  <span>
                    {amountNeededForFreeShipping > 0 ? (
                      <>Add <strong className="font-data font-bold">₹{amountNeededForFreeShipping}</strong> more for <strong>FREE DELIVERY</strong></>
                    ) : (
                      <span className="font-semibold">✓ You have unlocked FREE DELIVERY</span>
                    )}
                  </span>
                </div>
                <span className="text-[11px] text-[#685950] font-data">{freeShippingProgress}%</span>
              </div>
              <div className="w-full bg-[#FAF7F2] border border-[#E2D9CE] h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-[#1A382B] h-full transition-all duration-300"
                  style={{ width: `${freeShippingProgress}%` }}
                />
              </div>
            </div>

            {/* Product Items Table */}
            <div className="space-y-3">
              {cart.map((item) => (
                <div
                  key={`${item.productId}-${item.selectedWeight}`}
                  className="rounded-[10px] bg-white border border-[#E2D9CE] p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-2xs"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="relative w-20 h-20 bg-[#FAF7F2] rounded-[6px] border border-[#EDE6DC] flex-shrink-0 overflow-hidden">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <span className="inline-block px-1.5 py-0.2 rounded-[2px] bg-[#FAF7F2] border border-[#E2D9CE] text-[9px] uppercase tracking-wider font-semibold text-[#1A382B] font-data">
                        {item.category}
                      </span>
                      <Link href={`/products/${item.slug}`}>
                        <h3 className="text-[15px] font-semibold text-[#221814] hover:text-[#1A382B] transition-colors mt-0.5 font-dmsans">
                          {item.name}
                        </h3>
                      </Link>
                      {item.localName && (
                        <p className="text-[11px] text-[#9E462A] font-telugu">
                          {item.localName}
                        </p>
                      )}
                      <div className="inline-block mt-1 text-[11px] text-[#685950] font-data">
                        Pack: <span className="font-semibold text-[#221814]">{item.selectedWeight}</span>
                      </div>
                    </div>
                  </div>

                  {/* Quantity & Pricing */}
                  <div className="flex items-center justify-between w-full sm:w-auto sm:gap-6 mt-2 sm:mt-0">
                    <div className="flex items-center rounded-[4px] border border-[#E2D9CE] bg-[#FAF7F2] p-0.5">
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.productId, item.selectedWeight, -1)}
                        className="p-1 rounded-[2px] text-[#685950] hover:bg-white transition-colors"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-8 text-center text-[12px] font-data font-bold text-[#221814]">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.productId, item.selectedWeight, 1)}
                        className="p-1 rounded-[2px] text-[#685950] hover:bg-white transition-colors"
                        aria-label="Increase quantity"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <div className="text-right">
                      <p className="font-data font-bold text-[16px] text-[#221814]">
                        ₹{item.price * item.quantity}
                      </p>
                      {item.mrp > item.price && (
                        <p className="font-data text-[11px] text-[#8C7A70] line-through">
                          ₹{item.mrp * item.quantity}
                        </p>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => handleMoveToWishlist(item.productId, item.selectedWeight)}
                        className="p-1.5 rounded-[4px] text-[#685950] hover:text-[#9E462A] hover:bg-[#FAF7F2] transition-colors"
                        title="Move to wishlist"
                      >
                        <Heart className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => removeFromCart(item.productId, item.selectedWeight)}
                        className="p-1.5 rounded-[4px] text-[#8C7A70] hover:text-[#9E462A] hover:bg-[#FAF7F2] transition-colors"
                        title="Remove item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Order Summary Card */}
          <div className="lg:col-span-4 space-y-5">
            <div className="rounded-[10px] bg-white border border-[#E2D9CE] p-5 sm:p-6 space-y-4 shadow-2xs">
              <h2 className="text-[14px] font-semibold text-[#221814] pb-3 border-b border-[#E2D9CE] uppercase tracking-wider font-data">
                Order Summary
              </h2>

              <div className="space-y-2.5 text-[13px] font-data">
                <div className="flex justify-between text-[#685950]">
                  <span>Subtotal</span>
                  <span className="font-semibold text-[#221814]">₹{subtotal}</span>
                </div>
                <div className="flex justify-between text-[#685950]">
                  <span>Delivery</span>
                  <span>
                    {shippingFee === 0 ? (
                      <strong className="text-[#1A382B] uppercase font-bold">FREE</strong>
                    ) : (
                      `₹${shippingFee}`
                    )}
                  </span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-[#9E462A] font-semibold">
                    <span>Coupon ({appliedCoupon})</span>
                    <span>-₹{discountAmount}</span>
                  </div>
                )}
                <div className="pt-3 border-t border-[#E2D9CE] flex justify-between text-[17px] font-bold text-[#221814]">
                  <span>Total</span>
                  <span className="text-[#1A382B]">₹{finalTotal}</span>
                </div>
              </div>

              {/* Coupon Form */}
              <form onSubmit={handleApplyPromo} className="pt-2">
                <label className="text-[11px] tracking-wider text-[#685950] uppercase font-semibold block mb-1 font-data">
                  Apply Coupon Code
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    placeholder="e.g. WELCOME10"
                    className="w-full bg-[#FAF7F2] rounded-[6px] border border-[#E2D9CE] px-3 py-2 text-[12px] uppercase tracking-wider focus:outline-none focus:border-[#1A382B] font-data"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-[6px] bg-[#1A382B] text-white hover:bg-[#132B21] text-[12px] font-semibold transition-colors flex-shrink-0"
                  >
                    Apply
                  </button>
                </div>
                {promoMessage && (
                  <p className={`text-[11px] mt-1.5 ${promoMessage.type === 'success' ? 'text-[#1A382B] font-semibold' : 'text-[#9E462A]'}`}>
                    {promoMessage.text}
                  </p>
                )}
              </form>

              {/* Checkout CTA */}
              <div className="pt-1">
                <Link
                  href="/checkout"
                  className="w-full py-3.5 rounded-[6px] bg-[#1A382B] hover:bg-[#132B21] text-white text-[13px] font-semibold transition-colors flex items-center justify-center gap-1.5 shadow-2xs"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              {/* Trust assurances */}
              <div className="pt-3 border-t border-[#E2D9CE] space-y-2 text-[11px] text-[#685950]">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#1A382B]" />
                  <span>100% Secure Checkout via UPI & Cards</span>
                </div>
                <div className="flex items-center gap-2">
                  <Truck className="w-4 h-4 text-[#1A382B]" />
                  <span>Dispatched in Food-Grade Aroma Pouches</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
