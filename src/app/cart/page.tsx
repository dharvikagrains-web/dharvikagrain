'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/context/CartContext';
import { formatCurrency } from '@/lib/utils';
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag, ShieldCheck, ArrowLeft } from 'lucide-react';

export default function CartPage() {
  const {
    cart,
    updateQuantity,
    removeFromCart,
    clearCart,
    subtotal,
    shippingFee,
    freeShippingThreshold,
    amountNeededForFreeShipping,
    total,
  } = useCart();

  const [promoCode, setPromoCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);
  const [promoMessage, setPromoMessage] = useState<string | null>(null);

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (promoCode.trim().toUpperCase() === 'TRADITION10') {
      setDiscountPercent(10);
      setPromoMessage('Promo code TRADITION10 applied: 10% discount!');
    } else {
      setPromoMessage('Invalid coupon code. Try TRADITION10');
    }
  };

  const discountAmount = Math.round((subtotal * discountPercent) / 100);
  const finalTotal = Math.max(0, total - discountAmount);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
      <div className="flex items-center space-x-2 text-xs text-[#6B5B52] mb-6">
        <Link href="/shop" className="hover:text-[#241611] flex items-center">
          <ArrowLeft className="w-3.5 h-3.5 mr-1" /> Continue Shopping
        </Link>
      </div>

      <h1 className="text-2xl sm:text-4xl font-serif font-semibold text-[#241611] mb-8">
        Your Shopping Cart
      </h1>

      {cart.length === 0 ? (
        <div className="text-center py-20 bg-white border border-[#E7DED4] p-8 max-w-xl mx-auto space-y-4">
          <div className="w-16 h-16 mx-auto rounded-full bg-[#FAF7F2] flex items-center justify-center text-[#9E8E84]">
            <ShoppingBag className="w-8 h-8 stroke-[1.2]" />
          </div>
          <h2 className="text-xl font-serif text-[#241611]">Your cart is currently empty</h2>
          <p className="text-xs sm:text-sm text-[#6B5B52]">
            Discover the uncompromised purity of our unpolished Chiru Dhanyalu and cold-ground spices.
          </p>
          <div className="pt-2">
            <Link
              href="/shop"
              className="inline-block px-8 py-3.5 bg-[#241611] hover:bg-[#B35638] text-white text-xs uppercase tracking-widest font-semibold transition-colors"
            >
              Explore Catalogue
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Left Column: Cart Items List */}
          <div className="lg:col-span-8 space-y-4">
            {/* Free Shipping Alert Bar */}
            <div className="bg-[#FAF7F2] border border-[#E7DED4] p-4 text-xs">
              {amountNeededForFreeShipping > 0 ? (
                <p className="text-[#241611]">
                  Add <strong className="text-[#B35638]">{formatCurrency(amountNeededForFreeShipping)}</strong> more of traditional goodness to unlock <strong className="font-semibold">Free Delivery</strong>!
                </p>
              ) : (
                <p className="text-[#274135] font-semibold flex items-center">
                  <ShieldCheck className="w-4 h-4 mr-1.5" /> Congratulations! You have unlocked Free Delivery across India.
                </p>
              )}
            </div>

            {/* Items Table */}
            <div className="border border-[#E7DED4] bg-white divide-y divide-[#E7DED4]">
              {cart.map((item) => (
                <div
                  key={`${item.productId}-${item.selectedWeight}`}
                  className="p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                >
                  <div className="flex items-center space-x-4">
                    <div className="relative w-20 h-20 bg-[#F5EFEB] flex-shrink-0 border border-[#E7DED4] overflow-hidden">
                      <Image src={item.image} alt={item.name} fill className="object-cover" />
                    </div>
                    <div>
                      <Link
                        href={`/products/${item.slug}`}
                        className="text-sm font-semibold text-[#241611] hover:text-[#B35638] transition-colors"
                      >
                        {item.name}
                      </Link>
                      <p className="text-xs text-[#6B5B52]">{item.localName}</p>
                      <p className="text-xs text-[#8C7A70] mt-1">
                        Pack Size: <span className="font-medium text-[#241611]">{item.selectedWeight}</span>
                      </p>
                      <p className="text-xs font-semibold text-[#241611] sm:hidden mt-1">
                        {formatCurrency(item.price * item.quantity)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto space-x-6">
                    {/* Quantity Selector */}
                    <div className="flex items-center border border-[#E7DED4] bg-[#FAF7F2]">
                      <button
                        onClick={() => updateQuantity(item.productId, item.selectedWeight, -1)}
                        className="p-1.5 text-[#6B5B52] hover:text-[#B35638]"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="px-3 text-xs font-semibold text-[#241611]">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.productId, item.selectedWeight, 1)}
                        className="p-1.5 text-[#6B5B52] hover:text-[#B35638]"
                        aria-label="Increase quantity"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Price Column */}
                    <div className="hidden sm:block text-right min-w-[80px]">
                      <span className="text-sm font-bold text-[#241611]">
                        {formatCurrency(item.price * item.quantity)}
                      </span>
                      {item.mrp > item.price && (
                        <p className="text-[10px] text-[#9E8E84] line-through">
                          {formatCurrency(item.mrp * item.quantity)}
                        </p>
                      )}
                    </div>

                    {/* Remove button */}
                    <button
                      onClick={() => removeFromCart(item.productId, item.selectedWeight)}
                      className="p-1.5 text-[#9E8E84] hover:text-[#B35638] transition-colors"
                      aria-label="Remove item"
                    >
                      <Trash2 className="w-4 h-4 stroke-[1.5]" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-between items-center pt-2">
              <button
                onClick={clearCart}
                className="text-xs text-[#6B5B52] hover:text-[#B35638] underline"
              >
                Clear Cart
              </button>
              <Link
                href="/shop"
                className="text-xs font-semibold text-[#241611] hover:text-[#B35638] uppercase tracking-wider"
              >
                + Add More Items
              </Link>
            </div>
          </div>

          {/* Right Column: Order Summary & Checkout */}
          <div className="lg:col-span-4 bg-white border border-[#E7DED4] p-6 sm:p-8 space-y-6">
            <h2 className="text-base font-serif font-semibold text-[#241611] pb-3 border-b border-[#E7DED4]">
              Order Summary
            </h2>

            {/* Promo Code Form */}
            <form onSubmit={handleApplyPromo} className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-[#6B5B52] block">
                Have a Promo Code?
              </label>
              <div className="flex">
                <input
                  type="text"
                  placeholder="e.g. TRADITION10"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  className="flex-1 bg-[#FAF7F2] border border-[#E7DED4] px-3 py-2 text-xs uppercase text-[#241611] focus:outline-none focus:border-[#B35638]"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#241611] text-white text-xs font-semibold uppercase tracking-wider hover:bg-[#B35638] transition-colors"
                >
                  Apply
                </button>
              </div>
              {promoMessage && (
                <p className="text-[11px] text-[#B35638] mt-1">{promoMessage}</p>
              )}
            </form>

            {/* Calculations Breakdown */}
            <div className="space-y-3 pt-2 text-xs border-t border-[#E7DED4]">
              <div className="flex justify-between text-[#6B5B52]">
                <span>Item Subtotal</span>
                <span className="font-semibold text-[#241611]">{formatCurrency(subtotal)}</span>
              </div>

              {discountAmount > 0 && (
                <div className="flex justify-between text-[#274135]">
                  <span>Discount ({discountPercent}%)</span>
                  <span>- {formatCurrency(discountAmount)}</span>
                </div>
              )}

              <div className="flex justify-between text-[#6B5B52]">
                <span>Delivery Charge</span>
                <span>
                  {shippingFee === 0 ? (
                    <strong className="text-[#274135] uppercase">FREE</strong>
                  ) : (
                    formatCurrency(shippingFee)
                  )}
                </span>
              </div>

              <div className="flex justify-between text-base font-bold text-[#241611] pt-3 border-t border-[#E7DED4]">
                <span>Order Total</span>
                <span>{formatCurrency(finalTotal)}</span>
              </div>
              <p className="text-[10px] text-[#8C7A70] text-right">
                Includes all applicable GST and taxes
              </p>
            </div>

            {/* Checkout Action */}
            <div className="pt-2">
              <Link
                href="/checkout"
                className="w-full py-4 bg-[#B35638] hover:bg-[#9E462A] text-white text-xs uppercase tracking-widest font-semibold transition-colors flex items-center justify-center space-x-2 shadow-sm"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="pt-4 border-t border-[#E7DED4] space-y-2 text-[11px] text-[#8C7A70]">
              <p className="flex items-center">
                <ShieldCheck className="w-3.5 h-3.5 mr-1.5 text-[#B35638]" /> Safe & Secure Indian Gateway
              </p>
              <p className="flex items-center">
                <ShieldCheck className="w-3.5 h-3.5 mr-1.5 text-[#B35638]" /> Direct Farm-Checked Freshness
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
