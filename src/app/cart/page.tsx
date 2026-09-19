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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
      <div className="flex items-center space-x-2 text-xs text-[#6B5B52] mb-6">
        <Link href="/shop" className="hover:text-[#0D3522] flex items-center transition-colors">
          <ArrowLeft className="w-3.5 h-3.5 mr-1" /> Continue Shopping
        </Link>
      </div>

      <div className="border-b border-[#E7DED4] pb-6 mb-8 flex flex-col sm:flex-row sm:items-baseline justify-between gap-4">
        <div>
          <span className="text-xs font-semibold tracking-widest text-[#B35638] uppercase">
            Order Review
          </span>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-[#0D3522] mt-1">
            Your Cart
          </h1>
        </div>
        <p className="text-xs text-[#6B5B52]">
          {cart.reduce((sum, item) => sum + item.quantity, 0)} items in your basket
        </p>
      </div>

      {cart.length === 0 ? (
        <div className="text-center py-20 bg-white border border-[#E7DED4] p-8 max-w-xl mx-auto space-y-4 shadow-xs">
          <div className="w-16 h-16 mx-auto rounded-full bg-[#FAF7F2] flex items-center justify-center text-[#9E8E84]">
            <ShoppingBag className="w-8 h-8 stroke-[1.2]" />
          </div>
          <h2 className="text-xl font-serif font-semibold text-[#241611]">Your cart is currently empty</h2>
          <p className="text-xs sm:text-sm text-[#6B5B52] leading-relaxed">
            Discover the uncompromised purity of our unpolished Chiru Dhanyalu, single-origin spices, and curated combos.
          </p>
          <div className="pt-2">
            <Link
              href="/shop"
              className="inline-block px-8 py-3.5 bg-[#0D3522] hover:bg-[#134B31] text-white text-xs uppercase tracking-widest font-semibold transition-colors"
            >
              Explore Catalogue
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Cart Items List */}
          <div className="lg:col-span-8 space-y-6">
            {/* Free Delivery Progress Bar */}
            <div className="bg-[#FAF7F2] border border-[#C5A059]/40 p-4 sm:p-5 rounded-xs space-y-3">
              <div className="flex items-center justify-between text-xs font-semibold">
                <div className="flex items-center space-x-2 text-[#0D3522]">
                  <Truck className="w-4 h-4 text-[#C5A059]" />
                  <span>
                    {amountNeededForFreeShipping > 0 ? (
                      <>Add <strong className="text-[#B35638]">₹{amountNeededForFreeShipping}</strong> more for <span className="text-[#0D3522]">FREE DELIVERY</span></>
                    ) : (
                      <span className="text-[#0D3522]">✓ Congratulations! You unlocked FREE DELIVERY</span>
                    )}
                  </span>
                </div>
                <span className="text-[11px] text-[#6B5B52]">{freeShippingProgress}%</span>
              </div>
              <div className="w-full bg-[#E7DED4] h-2 rounded-full overflow-hidden">
                <div
                  className="bg-[#0D3522] h-full rounded-full transition-all duration-500"
                  style={{ width: `${freeShippingProgress}%` }}
                />
              </div>
            </div>

            {/* Product Items Table */}
            <div className="bg-white border border-[#E7DED4] divide-y divide-[#E7DED4]">
              {cart.map((item) => (
                <div key={`${item.productId}-${item.selectedWeight}`} className="p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-center space-x-4">
                    <div className="relative w-18 h-18 sm:w-20 sm:h-20 bg-[#FAF7F2] border border-[#E7DED4] flex-shrink-0 overflow-hidden">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <span className="text-[10px] tracking-widest text-[#C5A059] uppercase font-semibold">
                        {item.category}
                      </span>
                      <Link href={`/products/${item.slug}`}>
                        <h3 className="text-sm sm:text-base font-serif font-bold text-[#241611] hover:text-[#0D3522] transition-colors">
                          {item.name}
                        </h3>
                      </Link>
                      <p className="text-xs text-[#6B5B52] font-serif italic">
                        {item.localName}
                      </p>
                      <div className="inline-block mt-1 px-2 py-0.5 bg-[#FAF7F2] border border-[#E7DED4] text-[10px] text-[#6B5B52] font-semibold">
                        Weight: {item.selectedWeight}
                      </div>
                    </div>
                  </div>

                  {/* Quantity & Pricing */}
                  <div className="flex items-center justify-between w-full sm:w-auto sm:space-x-8 mt-2 sm:mt-0">
                    <div className="flex items-center border border-[#E7DED4] bg-[#FAF7F2]">
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.productId, item.selectedWeight, item.quantity - 1)}
                        className="p-2 text-[#6B5B52] hover:text-[#241611] hover:bg-white transition-colors"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="w-9 text-center text-xs font-semibold text-[#241611]">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.productId, item.selectedWeight, item.quantity + 1)}
                        className="p-2 text-[#6B5B52] hover:text-[#241611] hover:bg-white transition-colors"
                        aria-label="Increase quantity"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="text-right">
                      <p className="text-base font-bold text-[#0D3522]">
                        ₹{item.price * item.quantity}
                      </p>
                      <p className="text-[10px] text-[#8C7A70] line-through">
                        ₹{item.mrp * item.quantity}
                      </p>
                    </div>

                    {/* Actions */}
                    <div className="flex sm:flex-col items-center space-x-3 sm:space-x-0 sm:space-y-2">
                      <button
                        type="button"
                        onClick={() => handleMoveToWishlist(item.productId, item.selectedWeight)}
                        className="text-[11px] text-[#6B5B52] hover:text-[#0D3522] flex items-center space-x-1 transition-colors"
                        title="Move to wishlist"
                      >
                        <Heart className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Wishlist</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => removeFromCart(item.productId, item.selectedWeight)}
                        className="text-[11px] text-[#8C7A70] hover:text-[#B35638] flex items-center space-x-1 transition-colors"
                        title="Remove item"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Remove</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Order Summary Card */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white border border-[#E7DED4] p-6 space-y-5 shadow-xs">
              <h2 className="text-base font-serif font-bold text-[#241611] pb-3 border-b border-[#E7DED4] uppercase tracking-wider">
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
                      <strong className="text-[#0D3522] uppercase tracking-wider">FREE</strong>
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
                <div className="pt-3 border-t border-[#E7DED4] flex justify-between text-base font-bold text-[#0D3522]">
                  <span>Total</span>
                  <span>₹{finalTotal}</span>
                </div>
              </div>

              {/* Coupon Form */}
              <form onSubmit={handleApplyPromo} className="pt-2">
                <label className="text-[10px] tracking-widest text-[#6B5B52] uppercase font-bold block mb-1">
                  Have a Coupon?
                </label>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    placeholder="ENTER COUPON"
                    className="w-full bg-[#FAF7F2] border border-[#E7DED4] px-3 py-2 text-xs uppercase tracking-wider focus:outline-none focus:border-[#0D3522]"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-[#FAF7F2] border border-[#241611] text-[#241611] hover:bg-[#241611] hover:text-white text-xs uppercase tracking-widest font-semibold transition-colors flex-shrink-0"
                  >
                    Apply
                  </button>
                </div>
                {promoMessage && (
                  <p className={`text-[11px] mt-2 ${promoMessage.type === 'success' ? 'text-[#0D3522]' : 'text-[#B35638]'}`}>
                    {promoMessage.text}
                  </p>
                )}
              </form>

              {/* Checkout CTA */}
              <div className="pt-2">
                <Link
                  href="/checkout"
                  className="w-full py-3.5 bg-[#0D3522] hover:bg-[#134B31] text-white text-xs uppercase tracking-widest font-semibold transition-colors flex items-center justify-center space-x-2 shadow-md hover:shadow-lg"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              {/* Trust assurances */}
              <div className="pt-4 border-t border-[#E7DED4] space-y-2 text-[11px] text-[#6B5B52]">
                <div className="flex items-center space-x-2">
                  <ShieldCheck className="w-4 h-4 text-[#C5A059]" />
                  <span>100% Secure Checkout via UPI & Cards</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Truck className="w-4 h-4 text-[#C5A059]" />
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
