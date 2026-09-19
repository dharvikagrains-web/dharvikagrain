'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/context/CartContext';
import { formatCurrency } from '@/lib/utils';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, ShieldCheck } from 'lucide-react';

export function CartDrawer() {
  const {
    cart,
    isCartOpen,
    closeCart,
    updateQuantity,
    removeFromCart,
    subtotal,
    freeShippingThreshold,
    amountNeededForFreeShipping,
    total,
  } = useCart();

  if (!isCartOpen) return null;

  const progressPercent = Math.min(100, Math.round((subtotal / freeShippingThreshold) * 100));

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#1E120D]/60 backdrop-blur-xs transition-opacity"
        onClick={closeCart}
      />

      <div className="fixed inset-y-0 right-0 max-w-md w-full bg-[#FAF7F2] shadow-2xl flex flex-col z-10 border-l border-[#E7DED4]">
        {/* Drawer Header */}
        <div className="p-5 sm:p-6 border-b border-[#E7DED4] bg-white flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <ShoppingBag className="w-5 h-5 text-[#241611] stroke-[1.5]" />
            <h2 className="text-base sm:text-lg font-serif font-semibold text-[#241611]">
              Your Cart ({cart.reduce((s, i) => s + i.quantity, 0)})
            </h2>
          </div>
          <button
            onClick={closeCart}
            className="p-1.5 text-[#6B5B52] hover:text-[#241611] transition-colors rounded-full"
            aria-label="Close cart drawer"
          >
            <X className="w-5 h-5 stroke-[1.5]" />
          </button>
        </div>

        {/* Free Shipping Progress Meter */}
        <div className="bg-[#F5EFEB] px-5 py-3 border-b border-[#E7DED4] text-xs">
          {amountNeededForFreeShipping > 0 ? (
            <p className="text-[#241611] font-medium mb-1.5">
              Add <span className="text-[#B35638] font-bold">{formatCurrency(amountNeededForFreeShipping)}</span> more for <span className="font-semibold">Free Delivery</span>
            </p>
          ) : (
            <p className="text-[#274135] font-semibold flex items-center mb-1.5">
              <ShieldCheck className="w-4 h-4 mr-1 text-[#274135]" /> Congratulations! You have unlocked Free Delivery.
            </p>
          )}
          <div className="w-full bg-[#E6DDD3] h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-[#B35638] h-full transition-all duration-300 rounded-full"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Cart Item List */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4">
          {cart.length === 0 ? (
            <div className="text-center py-16 space-y-4">
              <div className="w-16 h-16 mx-auto rounded-full bg-[#F5EFEB] flex items-center justify-center text-[#9E8E84]">
                <ShoppingBag className="w-8 h-8 stroke-[1.2]" />
              </div>
              <div>
                <p className="text-base font-serif text-[#241611]">Your cart is empty</p>
                <p className="text-xs text-[#6B5B52] mt-1 max-w-xs mx-auto">
                  Explore our authentic Chiru Dhanyalu and pure single-origin spices.
                </p>
              </div>
              <button
                onClick={closeCart}
                className="inline-block bg-[#241611] text-white text-xs uppercase tracking-widest font-semibold px-6 py-3 hover:bg-[#B35638] transition-colors"
              >
                Start Shopping
              </button>
            </div>
          ) : (
            cart.map((item) => (
              <div
                key={`${item.productId}-${item.selectedWeight}`}
                className="flex space-x-4 p-3 bg-white border border-[#E7DED4] relative group"
              >
                <div className="w-20 h-20 relative bg-[#F5EFEB] flex-shrink-0 overflow-hidden">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0 flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between pr-5">
                      <div>
                        <h4 className="text-xs sm:text-sm font-semibold text-[#241611] leading-snug">
                          {item.name}
                        </h4>
                        <p className="text-[11px] text-[#6B5B52]">{item.localName}</p>
                      </div>
                    </div>
                    <p className="text-[11px] text-[#8C7A70] mt-0.5">
                      Pack Size: <span className="font-semibold text-[#241611]">{item.selectedWeight}</span>
                    </p>
                  </div>

                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-[#F0E8DF]">
                    {/* Quantity controls */}
                    <div className="flex items-center border border-[#E7DED4] bg-[#FAF7F2]">
                      <button
                        onClick={() => updateQuantity(item.productId, item.selectedWeight, -1)}
                        className="p-1 hover:text-[#B35638] text-[#6B5B52] transition-colors"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="px-2 text-xs font-semibold text-[#241611] min-w-[20px] text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.productId, item.selectedWeight, 1)}
                        className="p-1 hover:text-[#B35638] text-[#6B5B52] transition-colors"
                        aria-label="Increase quantity"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="text-right">
                      <p className="text-xs sm:text-sm font-semibold text-[#241611]">
                        {formatCurrency(item.price * item.quantity)}
                      </p>
                      {item.mrp > item.price && (
                        <p className="text-[10px] text-[#9E8E84] line-through">
                          {formatCurrency(item.mrp * item.quantity)}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Remove item button */}
                <button
                  onClick={() => removeFromCart(item.productId, item.selectedWeight)}
                  className="absolute top-2.5 right-2.5 text-[#9E8E84] hover:text-[#B35638] p-1 transition-colors"
                  aria-label="Remove item from cart"
                >
                  <Trash2 className="w-4 h-4 stroke-[1.5]" />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Drawer Footer / Subtotal & Actions */}
        {cart.length > 0 && (
          <div className="p-5 sm:p-6 border-t border-[#E7DED4] bg-white space-y-3">
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between text-[#6B5B52]">
                <span>Item Subtotal</span>
                <span className="font-semibold text-[#241611]">{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex justify-between text-[#6B5B52]">
                <span>Delivery</span>
                <span className="font-semibold text-[#241611]">
                  {amountNeededForFreeShipping === 0 ? (
                    <span className="text-[#274135]">FREE</span>
                  ) : (
                    'Calculated at checkout'
                  )}
                </span>
              </div>
              <div className="flex justify-between text-sm font-bold text-[#241611] pt-2 border-t border-[#E7DED4]">
                <span>Estimated Total</span>
                <span>{formatCurrency(total)}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2">
              <Link
                href="/cart"
                onClick={closeCart}
                className="w-full text-center py-3 border border-[#241611] text-[#241611] hover:bg-[#FAF7F2] text-xs uppercase tracking-widest font-semibold transition-colors"
              >
                View Full Cart
              </Link>
              <Link
                href="/checkout"
                onClick={closeCart}
                className="w-full text-center py-3 bg-[#B35638] hover:bg-[#9E462A] text-white text-xs uppercase tracking-widest font-semibold transition-colors flex items-center justify-center space-x-1"
              >
                <span>Checkout</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <p className="text-[10px] text-center text-[#8C7A70] pt-1">
              Guaranteed Fresh Batches • Direct from Source • Pure Food Promise
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
