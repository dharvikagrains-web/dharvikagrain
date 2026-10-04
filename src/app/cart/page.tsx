'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { availableCoupons } from '@/data/coupons';
import { formatCurrency } from '@/lib/utils';
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag, ShieldCheck, ArrowLeft, Heart, Truck, Check } from 'lucide-react';

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
      <div className="flex items-center space-x-2 text-xs text-[#6B5B52] mb-6">
        <Link href="/shop" className="inline-flex items-center px-4 py-1.5 rounded-full bg-[#EDE9E1] border border-[#D5CDBD] hover:bg-[#0D3522] hover:text-white transition-all text-[#0D3522] font-semibold shadow-2xs">
          <ArrowLeft className="w-3.5 h-3.5 mr-1.5" /> Continue Shopping
        </Link>
      </div>

      {/* Header Banner */}
      <div className="rounded-[28px] sm:rounded-[32px] bg-[#EDE9E1] border border-[#D5CDBD] p-6 sm:p-8 mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs">
        <div>
          <span className="inline-block px-3 py-0.5 rounded-full bg-white/80 border border-[#D5CDBD] text-[10px] font-semibold tracking-wider text-[#0D3522] uppercase">
            ✦ Order Review
          </span>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-[#241611] mt-1">
            Your Basket
          </h1>
        </div>
        <p className="text-xs font-semibold px-4 py-2 rounded-full bg-white/80 border border-[#D5CDBD] text-[#0D3522] self-start sm:self-auto">
          {cart.reduce((sum, item) => sum + item.quantity, 0)} items in your basket
        </p>
      </div>

      {cart.length === 0 ? (
        <div className="text-center py-20 rounded-[28px] bg-[#EDE9E1] border border-[#D5CDBD] p-8 max-w-xl mx-auto space-y-4 shadow-xs">
          <div className="w-16 h-16 mx-auto rounded-full bg-white/80 border border-[#D5CDBD] flex items-center justify-center text-[#9E8E84]">
            <ShoppingBag className="w-8 h-8 stroke-[1.4] text-[#0D3522]" />
          </div>
          <h2 className="text-2xl font-serif font-bold text-[#241611]">Your basket is currently empty</h2>
          <p className="text-xs sm:text-sm text-[#6B5B52] leading-relaxed max-w-md mx-auto">
            Discover the uncompromised purity of our unpolished Chiru Dhanyalu, single-origin spices, and curated combos.
          </p>
          <div className="pt-3">
            <Link
              href="/shop"
              className="inline-block px-8 py-3.5 rounded-full bg-[#0D3522] hover:bg-[#072417] text-white text-xs uppercase tracking-wider font-semibold transition-all shadow-sm"
            >
              Explore Provisions
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          {/* Cart Items List */}
          <div className="lg:col-span-8 space-y-4 sm:space-y-5">
            {/* Free Delivery Progress Bar */}
            <div className="rounded-[24px] bg-[#EDE9E1] border border-[#D5CDBD] p-4 sm:p-5 shadow-2xs space-y-2.5">
              <div className="flex items-center justify-between text-xs font-semibold">
                <div className="flex items-center space-x-2 text-[#0D3522]">
                  <Truck className="w-4 h-4 text-[#0D3522]" />
                  <span>
                    {amountNeededForFreeShipping > 0 ? (
                      <>Add <strong className="text-[#0D3522]">₹{amountNeededForFreeShipping}</strong> more for <span className="font-bold">FREE DELIVERY</span></>
                    ) : (
                      <span className="text-[#0D3522] font-bold">✓ Congratulations! You unlocked FREE DELIVERY</span>
                    )}
                  </span>
                </div>
                <span className="text-[11px] text-[#6B5B52] font-mono">{freeShippingProgress}%</span>
              </div>
              <div className="w-full bg-[#D5CDBD]/60 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-[#0D3522] h-full rounded-full transition-all duration-500"
                  style={{ width: `${freeShippingProgress}%` }}
                />
              </div>
            </div>

            {/* Product Items Table */}
            <div className="space-y-3.5">
              {cart.map((item) => (
                <div
                  key={`${item.productId}-${item.selectedWeight}`}
                  className="rounded-[24px] bg-[#EDE9E1] border border-[#D5CDBD] p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-2xs"
                >
                  <div className="flex items-center space-x-4">
                    <div className="relative w-20 h-20 bg-white/80 rounded-[18px] border border-[#D5CDBD]/70 flex-shrink-0 overflow-hidden">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <span className="inline-block px-2 py-0.5 rounded-full bg-white/80 border border-[#D5CDBD] text-[9px] uppercase tracking-wider font-semibold text-[#0D3522]">
                        {item.category}
                      </span>
                      <Link href={`/products/${item.slug}`}>
                        <h3 className="text-sm sm:text-base font-serif font-bold text-[#241611] hover:text-[#0D3522] transition-colors mt-0.5">
                          {item.name}
                        </h3>
                      </Link>
                      <p className="text-xs text-[#0D3522] font-medium">
                        {item.localName}
                      </p>
                      <div className="inline-block mt-1 px-2.5 py-0.5 rounded-full bg-white/80 border border-[#D5CDBD] text-[10px] text-[#6B5B52] font-medium">
                        Size: {item.selectedWeight}
                      </div>
                    </div>
                  </div>

                  {/* Quantity & Pricing */}
                  <div className="flex items-center justify-between w-full sm:w-auto sm:space-x-8 mt-2 sm:mt-0">
                    <div className="flex items-center rounded-full border border-[#D5CDBD] bg-white p-0.5 shadow-2xs">
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.productId, item.selectedWeight, -1)}
                        className="p-1 rounded-full text-[#6B5B52] hover:bg-[#EDE9E1] transition-colors"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-8 text-center text-xs font-bold text-[#241611]">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.productId, item.selectedWeight, 1)}
                        className="p-1 rounded-full text-[#6B5B52] hover:bg-[#EDE9E1] transition-colors"
                        aria-label="Increase quantity"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <div className="text-right">
                      <p className="text-base font-serif font-bold text-[#0D3522]">
                        ₹{item.price * item.quantity}
                      </p>
                      {item.mrp > item.price && (
                        <p className="text-[10px] text-[#8C7A70] line-through">
                          ₹{item.mrp * item.quantity}
                        </p>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex sm:flex-col items-center space-x-3 sm:space-x-0 sm:space-y-1.5">
                      <button
                        type="button"
                        onClick={() => handleMoveToWishlist(item.productId, item.selectedWeight)}
                        className="p-1.5 rounded-full hover:bg-white text-[#6B5B52] hover:text-[#0D3522] transition-colors"
                        title="Move to wishlist"
                      >
                        <Heart className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => removeFromCart(item.productId, item.selectedWeight)}
                        className="p-1.5 rounded-full hover:bg-white text-[#8C7A70] hover:text-[#B35638] transition-colors"
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
          <div className="lg:col-span-4 space-y-6">
            <div className="rounded-[28px] bg-[#EDE9E1] border border-[#D5CDBD] p-6 sm:p-7 space-y-5 shadow-xs">
              <h2 className="text-base font-serif font-bold text-[#241611] pb-3 border-b border-[#D5CDBD] uppercase tracking-wider">
                Order Summary
              </h2>

              <div className="space-y-3 text-xs">
                <div className="flex justify-between text-[#6B5B52]">
                  <span>Subtotal</span>
                  <span className="font-semibold text-[#241611]">₹{subtotal}</span>
                </div>
                <div className="flex justify-between text-[#6B5B52]">
                  <span>Delivery</span>
                  <span>
                    {shippingFee === 0 ? (
                      <strong className="text-[#0D3522] uppercase tracking-wider font-bold">FREE</strong>
                    ) : (
                      `₹${shippingFee}`
                    )}
                  </span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-[#0D3522] font-semibold">
                    <span>Coupon Discount ({appliedCoupon})</span>
                    <span>-₹{discountAmount}</span>
                  </div>
                )}
                <div className="pt-3 border-t border-[#D5CDBD] flex justify-between text-lg font-serif font-bold text-[#0D3522]">
                  <span>Total</span>
                  <span>₹{finalTotal}</span>
                </div>
              </div>

              {/* Coupon Form */}
              <form onSubmit={handleApplyPromo} className="pt-2">
                <label className="text-[10px] tracking-wider text-[#6B5B52] uppercase font-bold block mb-1.5">
                  ✦ Have a Coupon?
                </label>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    placeholder="e.g. WELCOME10"
                    className="w-full bg-white rounded-full border border-[#D5CDBD] px-4 py-2.5 text-xs uppercase tracking-wider focus:outline-none focus:border-[#0D3522] shadow-2xs"
                  />
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-full bg-[#0D3522] text-white hover:bg-[#072417] text-xs uppercase tracking-wider font-semibold transition-all shadow-sm flex-shrink-0"
                  >
                    Apply
                  </button>
                </div>
                {promoMessage && (
                  <p className={`text-[11px] mt-2 ${promoMessage.type === 'success' ? 'text-[#0D3522] font-semibold' : 'text-[#B35638]'}`}>
                    {promoMessage.text}
                  </p>
                )}
              </form>

              {/* Checkout CTA */}
              <div className="pt-2">
                <Link
                  href="/checkout"
                  className="w-full py-4 rounded-full bg-[#0D3522] hover:bg-[#072417] text-white text-xs uppercase tracking-widest font-semibold transition-all flex items-center justify-center space-x-2 shadow-sm"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              {/* Trust assurances */}
              <div className="pt-4 border-t border-[#D5CDBD] space-y-2.5 text-[11px] text-[#6B5B52]">
                <div className="flex items-center space-x-2.5">
                  <ShieldCheck className="w-4 h-4 text-[#0D3522]" />
                  <span>100% Secure Checkout via UPI & Cards</span>
                </div>
                <div className="flex items-center space-x-2.5">
                  <Truck className="w-4 h-4 text-[#0D3522]" />
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
