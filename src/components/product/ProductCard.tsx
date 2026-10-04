'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Product } from '@/types';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { formatCurrency, calculateDiscount } from '@/lib/utils';
import { Heart, Plus, Check } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

const studioImageMap: Record<string, string> = {
  'millet-korralu': '/images/products/studio/foxtail-millet.jpg',
  'spice-turmeric': '/images/products/studio/salem-turmeric.jpg',
  'millet-samalu': '/images/products/studio/little-millet.jpg',
  'spice-red-chilli': '/images/products/studio/guntur-chilli.jpg',
  'millet-arikelu': '/images/products/studio/kodo-millet.jpg',
};

export function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const [selectedWeightSize, setSelectedWeightSize] = useState(product.weights[0].size);
  const [isAdded, setIsAdded] = useState(false);

  const currentWeightOpt =
    product.weights.find((w) => w.size === selectedWeightSize) || product.weights[0];
  const discount = calculateDiscount(currentWeightOpt.price, currentWeightOpt.mrp);
  const inWishlist = isInWishlist(product.id);
  const displayImage = studioImageMap[product.id] || product.images[0];

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, selectedWeightSize, 1);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1400);
  };

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product.id);
  };

  return (
    <div className="group relative bg-[#EDE9E1]/80 hover:bg-[#E7E2D8] transition-all duration-300 rounded-[24px] sm:rounded-[28px] p-5 flex flex-col justify-between border border-[#E3DDD1] shadow-2xs hover:shadow-md h-full">
      {/* Top Pill Badge & Wishlist Button */}
      <div className="flex items-center justify-between z-10">
        <span className="text-[10px] uppercase tracking-wider font-medium px-2.5 py-0.5 rounded-full border border-[#D0C7B9] bg-white/80 text-[#6B5B52]">
          {product.bestseller
            ? 'Bestseller'
            : discount > 0
            ? `${discount}% OFF`
            : product.category === 'millets'
            ? 'Chiru Dhanyalu'
            : 'Pure Spice'}
        </span>

        <button
          type="button"
          onClick={handleWishlistClick}
          className={`w-7 h-7 rounded-full flex items-center justify-center transition-colors ${
            inWishlist
              ? 'bg-[#B35638] text-white'
              : 'bg-white/80 text-[#8C7A70] hover:text-[#B35638]'
          }`}
          aria-label={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <Heart className="w-3.5 h-3.5 fill-current stroke-[1.5]" />
        </button>
      </div>

      {/* Product Image Stage - Large, Prominent & Crystal Clear */}
      <Link
        href={`/products/${product.slug}`}
        className="relative aspect-square w-full my-3 flex items-center justify-center group-hover:scale-[1.02] transition-transform duration-300"
      >
        <div className="relative w-full h-full rounded-2xl overflow-hidden shadow-xs border border-[#DDD5C7]/60">
          <Image
            src={displayImage}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-cover"
            priority={product.bestseller}
          />
        </div>
      </Link>

      {/* Card Content */}
      <div className="space-y-3">
        {/* Dynamic Weight / Pack Size Selector Dots */}
        <div className="flex items-center gap-1.5 pt-1">
          {product.weights.map((w, idx) => (
            <button
              key={w.size}
              type="button"
              onClick={() => setSelectedWeightSize(w.size)}
              title={`Select ${w.size}`}
              className={`w-3.5 h-3.5 rounded-full transition-all ${
                selectedWeightSize === w.size
                  ? 'ring-2 ring-offset-2 ring-[#0D3522] scale-110'
                  : 'opacity-60 hover:opacity-100'
              } ${
                idx === 0
                  ? 'bg-[#76A89B]'
                  : idx === 1
                  ? 'bg-[#E39D55]'
                  : 'bg-[#B57A58]'
              }`}
              aria-label={`Select pack size ${w.size}`}
            />
          ))}
          <span className="text-[10px] text-[#7A6B62] uppercase tracking-wider ml-1">
            {selectedWeightSize}
          </span>
        </div>

        {/* Product Titles */}
        <Link href={`/products/${product.slug}`} className="block group-hover:text-[#0D3522] transition-colors">
          <h3 className="text-xs sm:text-sm font-semibold text-[#241611] leading-snug line-clamp-1">
            {product.name}
          </h3>
          <p className="text-[11px] text-[#7A6B62] font-medium mt-0.5 line-clamp-1">
            {product.localName || product.tagline}
          </p>
        </Link>

        {/* Price & Green Pill + Cart Button */}
        <div className="flex items-center justify-between pt-1">
          <div>
            <div className="flex items-baseline space-x-1.5">
              <span className="text-sm sm:text-base font-bold text-[#241611]">
                {formatCurrency(currentWeightOpt.price)}
              </span>
              {currentWeightOpt.mrp > currentWeightOpt.price && (
                <span className="text-[11px] text-[#8C7A70] line-through">
                  {formatCurrency(currentWeightOpt.mrp)}
                </span>
              )}
            </div>
            <span className="text-[9px] text-[#8C7A70] block">Taxes included</span>
          </div>

          <button
            type="button"
            onClick={handleQuickAdd}
            disabled={isAdded || !currentWeightOpt.inStock}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold flex items-center space-x-1 transition-all duration-200 shadow-2xs ${
              isAdded
                ? 'bg-[#274135] text-white scale-95'
                : 'bg-[#0D3522] hover:bg-[#082417] text-white hover:shadow-sm'
            }`}
            aria-label={`Add ${product.name} to cart`}
          >
            {isAdded ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Added</span>
              </>
            ) : (
              <>
                <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>Cart</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
