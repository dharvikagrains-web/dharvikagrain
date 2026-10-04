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

      <div className="fixed inset-y-0 right-0 max-w-md w-full bg-[#FAF7F2] shadow-2xl flex flex-col z-10 border-l border-[#D5CDBD] rounded-l-[28px] sm:rounded-l-[36px] overflow-hidden">
        {/* Drawer Header */}
        <div className="p-5 sm:p-6 border-b border-[#D5CDBD] bg-[#EDE9E1] flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center border border-[#D5CDBD] shadow-2xs">
              <ShoppingBag className="w-4 h-4 text-[#0D3522]" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-serif font-bold text-[#241611]">
                Your Basket ({cart.reduce((s, i) => s + i.quantity, 0)})
              </h2>
              <span className="text-[10px] text-[#6B5B52] uppercase tracking-wider block">Authentic Indian Provisions</span>
            </div>
          </div>
          <button
            onClick={closeCart}
            className="p-2 text-[#6B5B52] hover:text-[#241611] transition-colors rounded-full bg-white/80 border border-[#D5CDBD]"
            aria-label="Close cart drawer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Free Shipping Progress Meter */}
        <div className="bg-[#EDE9E1]/60 px-5 py-3.5 border-b border-[#D5CDBD] text-xs">
          {amountNeededForFreeShipping > 0 ? (
            <p className="text-[#241611] font-medium mb-1.5 text-[11px]">
              Add <span className="text-[#0D3522] font-bold">{formatCurrency(amountNeededForFreeShipping)}</span> more for <span className="font-semibold text-[#0D3522]">Free Delivery</span>
            </p>
          ) : (
            <p className="text-[#0D3522] font-semibold flex items-center mb-1.5 text-[11px]">
              <ShieldCheck className="w-4 h-4 mr-1 text-[#0D3522]" /> Congratulations! You have unlocked Free Delivery.
            </p>
          )}
          <div className="w-full bg-[#D5CDBD]/50 h-2 rounded-full overflow-hidden">
            <div
              className="bg-[#0D3522] h-full transition-all duration-300 rounded-full"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Cart Item List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3.5">
          {cart.length === 0 ? (
            <div className="text-center py-16 space-y-4">
              <div className="w-16 h-16 mx-auto rounded-full bg-[#EDE9E1] border border-[#D5CDBD] flex items-center justify-center text-[#8C7A70]">
                <ShoppingBag className="w-7 h-7 stroke-[1.4] text-[#0D3522]" />
              </div>
              <div>
                <p className="text-lg font-serif font-bold text-[#241611]">Your basket is empty</p>
                <p className="text-xs text-[#6B5B52] mt-1 max-w-xs mx-auto leading-relaxed">
                  Explore our authentic Chiru Dhanyalu and single-origin spices.
                </p>
              </div>
              <button
                onClick={closeCart}
                className="inline-block rounded-full bg-[#0D3522] text-white text-xs uppercase tracking-wider font-semibold px-7 py-3 hover:bg-[#072417] transition-all shadow-sm"
              >
                Start Shopping
              </button>
            </div>
          ) : (
            cart.map((item) => (
              <div
                key={`${item.productId}-${item.selectedWeight}`}
                className="flex space-x-3.5 p-3.5 rounded-[22px] bg-[#EDE9E1] border border-[#D5CDBD] relative group shadow-2xs"
              >
                <div className="w-20 h-20 relative bg-white/80 rounded-[16px] flex-shrink-0 overflow-hidden border border-[#D5CDBD]/60">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0 flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between pr-6">
                      <div>
                        <h4 className="text-xs sm:text-sm font-serif font-bold text-[#241611] leading-snug">
                          {item.name}
                        </h4>
                        <p className="text-[11px] text-[#0D3522] font-semibold">{item.localName}</p>
                      </div>
                    </div>
                    <p className="text-[11px] text-[#6B5B52] mt-0.5">
                      Pack Size: <span className="font-semibold text-[#241611]">{item.selectedWeight}</span>
                    </p>
                  </div>

                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-[#D5CDBD]/60">
                    {/* Quantity controls */}
                    <div className="flex items-center rounded-full border border-[#D5CDBD] bg-white p-0.5 shadow-2xs">
                      <button
                        onClick={() => updateQuantity(item.productId, item.selectedWeight, -1)}
                        className="p-1 rounded-full hover:bg-[#EDE9E1] text-[#6B5B52] transition-colors"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="px-2 text-xs font-bold text-[#241611] min-w-[20px] text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.productId, item.selectedWeight, 1)}
                        className="p-1 rounded-full hover:bg-[#EDE9E1] text-[#6B5B52] transition-colors"
                        aria-label="Increase quantity"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <div className="text-right">
                      <p className="text-xs sm:text-sm font-serif font-bold text-[#0D3522]">
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
                  className="absolute top-2.5 right-2.5 rounded-full p-1.5 text-[#9E8E84] hover:text-[#B35638] hover:bg-white/80 transition-colors"
                  aria-label="Remove item from cart"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Drawer Footer / Subtotal & Actions */}
        {cart.length > 0 && (
          <div className="p-5 sm:p-6 border-t border-[#D5CDBD] bg-[#EDE9E1] space-y-3.5">
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between text-[#6B5B52]">
                <span>Item Subtotal</span>
                <span className="font-semibold text-[#241611]">{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex justify-between text-[#6B5B52]">
                <span>Delivery</span>
                <span className="font-semibold text-[#241611]">
                  {amountNeededForFreeShipping === 0 ? (
                    <span className="text-[#0D3522] font-bold">FREE</span>
                  ) : (
                    'Calculated at checkout'
                  )}
                </span>
              </div>
              <div className="flex justify-between text-base font-serif font-bold text-[#0D3522] pt-2 border-t border-[#D5CDBD]">
                <span>Estimated Total</span>
                <span>{formatCurrency(total)}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2.5 pt-2">
              <Link
                href="/cart"
                onClick={closeCart}
                className="w-full text-center py-3 rounded-full border border-[#D5CDBD] bg-white text-[#241611] hover:bg-[#FAF7F2] text-xs uppercase tracking-wider font-semibold transition-all"
              >
                View Full Cart
              </Link>
              <Link
                href="/checkout"
                onClick={closeCart}
                className="w-full text-center py-3 rounded-full bg-[#0D3522] hover:bg-[#072417] text-white text-xs uppercase tracking-wider font-semibold transition-all shadow-sm flex items-center justify-center space-x-1"
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
