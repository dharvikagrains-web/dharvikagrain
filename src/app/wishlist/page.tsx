'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useWishlist } from '@/context/WishlistContext';
import { useCart } from '@/context/CartContext';
import { products } from '@/data/products';
import { Heart, Trash2, ShoppingBag, ArrowRight, ShieldCheck } from 'lucide-react';

export default function WishlistPage() {
  const { wishlist, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();

  const wishlistProducts = products.filter((p) => wishlist.includes(p.id));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-8">
      {/* Page Header */}
      <div className="border-b border-[#E7DED4] pb-6 flex flex-col sm:flex-row sm:items-baseline justify-between gap-4">
        <div>
          <span className="text-xs font-semibold tracking-widest text-[#B35638] uppercase">
            Saved For Later
          </span>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-[#0D3522] mt-1">
            My Wishlist
          </h1>
        </div>
        <p className="text-xs text-[#6B5B52]">
          {wishlistProducts.length} {wishlistProducts.length === 1 ? 'item' : 'items'} saved
        </p>
      </div>

      {wishlistProducts.length === 0 ? (
        <div className="text-center py-20 bg-white border border-[#E7DED4] p-8 space-y-4 max-w-lg mx-auto">
          <div className="w-16 h-16 rounded-full bg-[#F5EFEB] flex items-center justify-center mx-auto text-[#C5A059]">
            <Heart className="w-8 h-8 stroke-[1.5]" />
          </div>
          <h2 className="text-xl font-serif font-semibold text-[#241611]">
            Your wishlist is empty
          </h2>
          <p className="text-xs text-[#6B5B52] leading-relaxed">
            Explore our harvest of unpolished Chiru Dhanyalu, cold-ground pure spices, and curated combos.
          </p>
          <div className="pt-2">
            <Link
              href="/shop"
              className="inline-flex items-center space-x-2 px-6 py-3 bg-[#0D3522] hover:bg-[#134B31] text-white text-xs uppercase tracking-widest font-semibold transition-colors"
            >
              <span>Explore Products</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
          {wishlistProducts.map((product) => {
            const defaultWeight = product.weights[0];
            return (
              <div
                key={product.id}
                className="bg-white border border-[#E2D9CE] rounded-[10px] sm:rounded-[12px] p-2.5 sm:p-4 flex flex-col justify-between group hover:border-[#1A382B]/40 transition-all relative shadow-[0_1px_3px_rgba(0,0,0,0.04)]"
              >
                <button
                  type="button"
                  onClick={() => removeFromWishlist(product.id)}
                  className="absolute top-2 right-2 sm:top-3 sm:right-3 z-10 w-6 h-6 sm:w-7 sm:h-7 rounded-[4px] sm:rounded-[6px] bg-white/90 border border-[#E2D9CE] text-[#685950] hover:text-[#9E462A] hover:border-[#9E462A] shadow-xs flex items-center justify-center transition-colors"
                  aria-label={`Remove ${product.name} from wishlist`}
                >
                  <Trash2 className="w-3 h-3 sm:w-3.5 sm:h-3.5 stroke-[1.5]" />
                </button>

                <div>
                  <Link href={`/products/${product.slug}`} className="block relative aspect-square bg-[#FAF7F2] rounded-[6px] sm:rounded-[8px] overflow-hidden mb-2 sm:mb-3">
                    <Image
                      src={product.images[0]}
                      alt={product.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </Link>

                  <span className="text-[9px] sm:text-[10px] font-data tracking-wider uppercase font-semibold text-[#9E462A] block">
                    {product.category === 'millets' ? 'Chiru Dhanyalu' : 'Pure Spice'}
                  </span>
                  <Link href={`/products/${product.slug}`}>
                    <h3 className="text-[13px] sm:text-base font-semibold text-[#221814] group-hover:text-[#1A382B] transition-colors line-clamp-1 mt-0.5">
                      {product.name}
                    </h3>
                  </Link>
                  {product.localName && (
                    <p className="text-[10px] sm:text-[11px] font-telugu text-[#685950] truncate mt-0.5">
                      {product.localName}
                    </p>
                  )}

                  <div className="mt-2 sm:mt-3 flex items-baseline space-x-1.5 flex-wrap">
                    <span className="text-[14px] sm:text-base font-bold text-[#1A382B] font-data">
                      ₹{defaultWeight.price}
                    </span>
                    {defaultWeight.mrp > defaultWeight.price && (
                      <span className="text-[10px] sm:text-xs text-[#8C7A70] line-through font-data">
                        ₹{defaultWeight.mrp}
                      </span>
                    )}
                    <span className="text-[10px] sm:text-[11px] text-[#685950] font-data">
                      ({defaultWeight.size})
                    </span>
                  </div>
                </div>

                <div className="mt-3 sm:mt-4 pt-2.5 sm:pt-3 border-t border-[#F0EAE1]">
                  <button
                    type="button"
                    onClick={() => addToCart(product, defaultWeight.size, 1)}
                    className="w-full py-1.5 sm:py-2.5 rounded-[6px] bg-[#1A382B] hover:bg-[#132B21] text-white text-[11px] sm:text-xs font-semibold transition-colors flex items-center justify-center space-x-1.5 shadow-2xs"
                  >
                    <ShoppingBag className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                    <span>Add to Cart</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Account Login Prompt for Guest Users */}
      <div className="bg-[#FAF7F2] border border-[#C5A059]/40 p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 mt-12">
        <div className="flex items-start space-x-4">
          <div className="p-3 bg-[#0D3522] text-[#C5A059] rounded-full flex-shrink-0">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-serif font-bold text-[#0D3522]">
              Save your favourite products across devices
            </h3>
            <p className="text-xs text-[#6B5B52] mt-0.5">
              Create an account or login to synchronize your wishlist, track orders, and receive harvest updates.
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-3 flex-shrink-0">
          <Link
            href="/login"
            className="px-5 py-2.5 border border-[#0D3522] text-[#0D3522] hover:bg-[#0D3522] hover:text-white text-xs uppercase tracking-widest font-semibold transition-colors"
          >
            Login
          </Link>
          <Link
            href="/signup"
            className="px-5 py-2.5 bg-[#0D3522] hover:bg-[#134B31] text-white text-xs uppercase tracking-widest font-semibold transition-colors"
          >
            Create Account
          </Link>
        </div>
      </div>
    </div>
  );
}
