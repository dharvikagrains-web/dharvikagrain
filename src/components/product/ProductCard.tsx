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

export function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const [selectedWeightSize, setSelectedWeightSize] = useState(product.weights[0].size);
  const [isAdded, setIsAdded] = useState(false);

  const currentWeightOpt =
    product.weights.find((w) => w.size === selectedWeightSize) || product.weights[0];
  const discount = calculateDiscount(currentWeightOpt.price, currentWeightOpt.mrp);
  const inWishlist = isInWishlist(product.id);

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, selectedWeightSize, 1);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1500);
  };

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product.id);
  };

  return (
    <div className="group relative bg-white border border-[#E7DED4] hover:border-[#B35638] transition-all duration-300 flex flex-col h-full">
      {/* Badges & Wishlist Overlay */}
      <div className="absolute top-3 left-3 z-10 flex flex-col gap-1">
        {product.bestseller && (
          <span className="bg-[#241611] text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1">
            Bestseller
          </span>
        )}
        {discount > 0 && (
          <span className="bg-[#B35638] text-white text-[10px] font-bold uppercase tracking-wider px-2 py-0.5">
            {discount}% OFF
          </span>
        )}
      </div>

      <button
        onClick={handleWishlistClick}
        className={`absolute top-3 right-3 z-10 p-2 rounded-full backdrop-blur-xs transition-colors ${
          inWishlist
            ? 'bg-[#B35638] text-white'
            : 'bg-white/80 text-[#6B5B52] hover:text-[#B35638] hover:bg-white'
        }`}
        aria-label={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
      >
        <Heart className="w-4 h-4 fill-current stroke-[1.5]" />
      </button>

      {/* Product Image Gallery Preview */}
      <Link
        href={`/products/${product.slug}`}
        className="relative aspect-square w-full bg-[#F5EFEB] overflow-hidden block"
      >
        <Image
          src={product.images[0]}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className="object-cover card-image-zoom transition-all duration-500 group-hover:scale-105"
        />
        {product.images[1] && (
          <Image
            src={product.images[1]}
            alt={`${product.name} alternate view`}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover transition-opacity duration-500 opacity-0 group-hover:opacity-100 absolute inset-0"
          />
        )}
      </Link>

      {/* Card Content */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Category Tag */}
          <span className="text-[10px] uppercase font-semibold tracking-widest text-[#B35638] block mb-1">
            {product.category === 'millets'
              ? 'Chiru Dhanyalu'
              : product.category === 'spices'
              ? 'Pure Spice'
              : 'Signature Masala'}
          </span>

          {/* Product Titles */}
          <Link href={`/products/${product.slug}`} className="block group-hover:text-[#B35638] transition-colors">
            <h3 className="text-sm sm:text-base font-semibold text-[#241611] leading-snug">
              {product.name}
            </h3>
            <p className="text-xs text-[#6B5B52] font-medium mt-0.5">{product.localName}</p>
          </Link>

          {/* Short description */}
          <p className="text-xs text-[#7A6B62] mt-2 line-clamp-2 leading-relaxed hidden sm:block">
            {product.shortDescription}
          </p>
        </div>

        {/* Dynamic Weight / Pack Size Selector */}
        <div className="mt-4 pt-3 border-t border-[#F0E8DF]">
          <div className="flex items-center gap-1.5 mb-3">
            {product.weights.map((w) => (
              <button
                key={w.size}
                type="button"
                onClick={() => setSelectedWeightSize(w.size)}
                className={`text-[11px] px-2.5 py-1 border transition-all font-medium ${
                  selectedWeightSize === w.size
                    ? 'border-[#241611] bg-[#241611] text-white'
                    : 'border-[#E7DED4] bg-white text-[#6B5B52] hover:border-[#241611]'
                }`}
              >
                {w.size}
              </button>
            ))}
          </div>

          {/* Price & Quick Add Button */}
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-baseline space-x-1.5">
                <span className="text-base sm:text-lg font-bold text-[#241611]">
                  {formatCurrency(currentWeightOpt.price)}
                </span>
                {currentWeightOpt.mrp > currentWeightOpt.price && (
                  <span className="text-xs text-[#9E8E84] line-through">
                    {formatCurrency(currentWeightOpt.mrp)}
                  </span>
                )}
              </div>
              <span className="text-[10px] text-[#8C7A70] block">Inclusive of all taxes</span>
            </div>

            <button
              type="button"
              onClick={handleQuickAdd}
              disabled={isAdded || !currentWeightOpt.inStock}
              className={`p-2.5 transition-colors duration-200 flex items-center justify-center rounded-none ${
                isAdded
                  ? 'bg-[#274135] text-white'
                  : 'bg-[#FAF7F2] border border-[#241611] text-[#241611] hover:bg-[#241611] hover:text-white'
              }`}
              aria-label={`Quick add ${product.name} ${currentWeightOpt.size} to cart`}
            >
              {isAdded ? (
                <Check className="w-4 h-4 stroke-[2]" />
              ) : (
                <Plus className="w-4 h-4 stroke-[2]" />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
