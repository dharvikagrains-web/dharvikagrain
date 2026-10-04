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
        className="fixed inset-0 bg-[#140E0A]/60 backdrop-blur-xs transition-opacity"
        onClick={closeCart}
      />

      <div className="fixed inset-y-0 right-0 max-w-md w-full bg-[#FAF7F2] shadow-2xl flex flex-col z-10 border-l border-[#E2D9CE] overflow-hidden">
        {/* Drawer Header */}
        <div className="p-4 sm:p-5 border-b border-[#E2D9CE] bg-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-[6px] bg-[#FAF7F2] flex items-center justify-center border border-[#E2D9CE]">
              <ShoppingBag className="w-4 h-4 text-[#1A382B]" />
            </div>
            <div>
              <h2 className="text-[16px] font-serif font-semibold text-[#221814]">
                Your Basket ({cart.reduce((s, i) => s + i.quantity, 0)})
              </h2>
              <span className="text-[10px] text-[#685950] uppercase tracking-wider block font-data">
                Authentic Indian Provisions
              </span>
            </div>
          </div>
          <button
            onClick={closeCart}
            className="p-1.5 text-[#685950] hover:text-[#221814] transition-colors rounded-[4px]"
            aria-label="Close cart drawer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Free Shipping Progress Meter */}
        <div className="bg-[#F4EFEA] px-5 py-3 border-b border-[#E2D9CE] text-[12px]">
          {amountNeededForFreeShipping > 0 ? (
            <p className="text-[#221814] font-medium mb-1.5 text-[11px] font-data">
              Add <span className="text-[#1A382B] font-bold">{formatCurrency(amountNeededForFreeShipping)}</span> more for <span className="font-semibold text-[#1A382B]">Free Delivery</span>
            </p>
          ) : (
            <p className="text-[#1A382B] font-semibold flex items-center gap-1.5 mb-1.5 text-[11px]">
              <ShieldCheck className="w-4 h-4 text-[#1A382B]" /> You have unlocked Free Delivery.
            </p>
          )}
          <div className="w-full bg-[#E2D9CE] h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-[#1A382B] h-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Cart Item List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {cart.length === 0 ? (
            <div className="text-center py-16 space-y-3">
              <div className="w-14 h-14 mx-auto rounded-[8px] bg-white border border-[#E2D9CE] flex items-center justify-center text-[#8C7A70]">
                <ShoppingBag className="w-6 h-6 stroke-[1.4] text-[#1A382B]" />
              </div>
              <div>
                <p className="text-base font-serif font-semibold text-[#221814]">Your basket is empty</p>
                <p className="text-[12px] text-[#685950] mt-1 max-w-xs mx-auto leading-relaxed">
                  Explore our unpolished Chiru Dhanyalu and cold-milled spices.
                </p>
              </div>
              <button
                onClick={closeCart}
                className="mt-2 inline-block rounded-[6px] bg-[#1A382B] text-white text-[12px] font-semibold px-6 py-2.5 hover:bg-[#132B21] transition-all"
              >
                Browse Harvest
              </button>
            </div>
          ) : (
            cart.map((item) => (
              <div
                key={`${item.productId}-${item.selectedWeight}`}
                className="flex gap-3 p-3 rounded-[8px] bg-white border border-[#E2D9CE] relative group shadow-2xs"
              >
                <div className="w-18 h-18 relative bg-[#FAF7F2] rounded-[6px] flex-shrink-0 overflow-hidden border border-[#EDE6DC]">
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
                        <h4 className="text-[13px] font-semibold text-[#221814] leading-snug line-clamp-1 font-dmsans">
                          {item.name}
                        </h4>
                        {item.localName && (
                          <p className="text-[11px] text-[#9E462A] font-telugu">{item.localName}</p>
                        )}
                      </div>
                    </div>
                    <p className="text-[11px] text-[#685950] mt-0.5 font-data">
                      Pack: <span className="font-semibold text-[#221814]">{item.selectedWeight}</span>
                    </p>
                  </div>

                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-[#F0EAE1]">
                    {/* Quantity controls */}
                    <div className="flex items-center rounded-[4px] border border-[#E2D9CE] bg-[#FAF7F2] p-0.5">
                      <button
                        onClick={() => updateQuantity(item.productId, item.selectedWeight, -1)}
                        className="p-1 rounded-[2px] hover:bg-white text-[#685950] transition-colors"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="px-2 text-[11px] font-data font-semibold text-[#221814] min-w-[20px] text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.productId, item.selectedWeight, 1)}
                        className="p-1 rounded-[2px] hover:bg-white text-[#685950] transition-colors"
                        aria-label="Increase quantity"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <div className="text-right">
                      <p className="font-data font-bold text-[14px] text-[#221814]">
                        {formatCurrency(item.price * item.quantity)}
                      </p>
                      {item.mrp > item.price && (
                        <p className="font-data text-[10px] text-[#8C7A70] line-through">
                          {formatCurrency(item.mrp * item.quantity)}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Remove item button */}
                <button
                  onClick={() => removeFromCart(item.productId, item.selectedWeight)}
                  className="absolute top-2 right-2 p-1 text-[#8C7A70] hover:text-[#9E462A] transition-colors"
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
          <div className="p-4 sm:p-5 border-t border-[#E2D9CE] bg-white space-y-3">
            <div className="space-y-1.5 text-[12px] font-data">
              <div className="flex justify-between text-[#685950]">
                <span>Item Subtotal</span>
                <span className="font-semibold text-[#221814]">{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex justify-between text-[#685950]">
                <span>Delivery</span>
                <span className="font-semibold text-[#221814]">
                  {amountNeededForFreeShipping === 0 ? (
                    <span className="text-[#1A382B] font-bold">FREE</span>
                  ) : (
                    'Calculated at checkout'
                  )}
                </span>
              </div>
              <div className="flex justify-between text-[15px] font-bold text-[#221814] pt-2 border-t border-[#E2D9CE]">
                <span>Estimated Total</span>
                <span className="text-[#1A382B]">{formatCurrency(total)}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-1">
              <Link
                href="/cart"
                onClick={closeCart}
                className="w-full text-center py-2.5 rounded-[6px] border border-[#E2D9CE] bg-white text-[#221814] hover:bg-[#FAF7F2] text-[12px] font-semibold transition-all"
              >
                View Full Cart
              </Link>
              <Link
                href="/checkout"
                onClick={closeCart}
                className="w-full text-center py-2.5 rounded-[6px] bg-[#1A382B] hover:bg-[#132B21] text-white text-[12px] font-semibold transition-all shadow-2xs flex items-center justify-center gap-1.5"
              >
                <span>Checkout</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <p className="text-[10px] text-center text-[#8C7A70] pt-0.5 font-data">
              Fresh Batches · Direct from Farm Clusters · Pure Food Promise
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
