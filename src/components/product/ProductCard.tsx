'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Product } from '@/types';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { formatCurrency, calculateDiscount } from '@/lib/utils';
import { Heart, Plus, Check, Star } from 'lucide-react';

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

// Regional Telugu grain pairing for authentic cultural layer
const teluguGrainMap: Record<string, string> = {
  'millet-korralu': 'కొర్రలు · Foxtail',
  'millet-samalu': 'సామలు · Little',
  'millet-arikelu': 'అరికెలు · Kodo',
  'millet-udalu': 'ఊదలు · Barnyard',
  'millet-ragi': 'రాగులు · Finger',
  'millet-jowar': 'జొన్నలు · Sorghum',
  'spice-turmeric': 'పసుపు · Salem Curcumin',
  'spice-red-chilli': 'మిరప · Guntur Teja',
  'spice-coriander': 'ధనియాలు · Whole Seed',
  'spice-cumin': 'జీలకర్ర · Unpolished',
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
  const teluguLabel = teluguGrainMap[product.id] || product.localName || null;

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
    <article className="group bg-white border border-[#E2D9CE] hover:border-[#1A382B]/40 rounded-[12px] overflow-hidden transition-all duration-300 flex flex-col justify-between h-full shadow-[0_1px_3px_rgba(0,0,0,0.04)] hover:shadow-[0_4px_16px_rgba(0,0,0,0.06)]">
      {/* Visual Product Stage */}
      <div className="relative bg-[#FAF7F2] p-4 border-b border-[#EDE6DC]">
        {/* Top Badges & Wishlist Action */}
        <div className="flex items-center justify-between gap-2 mb-2 z-10 relative">
          <div className="flex items-center gap-1.5 flex-wrap">
            {product.bestseller ? (
              <span className="text-[11px] font-medium tracking-wide uppercase px-2 py-0.5 rounded-[4px] bg-[#EBF2EE] text-[#1A382B] border border-[#D1E0D7]">
                Bestseller
              </span>
            ) : discount > 0 ? (
              <span className="text-[11px] font-medium tracking-wide uppercase px-2 py-0.5 rounded-[4px] bg-[#FBEFEA] text-[#9E462A] border border-[#F0D5C9]">
                {discount}% OFF
              </span>
            ) : (
              <span className="text-[11px] font-medium tracking-wide uppercase px-2 py-0.5 rounded-[4px] bg-white text-[#685950] border border-[#E2D9CE]">
                {product.category === 'millets' ? 'Chiru Dhanyalu' : 'Pure Spice'}
              </span>
            )}
          </div>

          <button
            type="button"
            onClick={handleWishlistClick}
            className={`w-7 h-7 rounded-[6px] border flex items-center justify-center transition-colors ${
              inWishlist
                ? 'bg-[#9E462A] border-[#9E462A] text-white'
                : 'bg-white border-[#E2D9CE] text-[#685950] hover:text-[#9E462A] hover:border-[#9E462A]'
            }`}
            aria-label={inWishlist ? 'Remove from wishlist' : 'Save to wishlist'}
          >
            <Heart className="w-3.5 h-3.5 fill-current stroke-[1.5]" />
          </button>
        </div>

        {/* Clean Square Product Image Frame */}
        <Link
          href={`/products/${product.slug}`}
          className="relative block aspect-square w-full rounded-[8px] overflow-hidden bg-white"
        >
          <Image
            src={displayImage}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-cover card-image-zoom"
            priority={product.bestseller}
          />
        </Link>
      </div>

      {/* Card Content & Commerce Meta */}
      <div className="p-4 flex flex-col flex-1 justify-between gap-3 bg-white">
        <div>
          {/* Subtle Regional Heritage Layer */}
          {teluguLabel && (
            <p className="font-telugu text-[12px] text-[#9E462A] font-medium leading-none mb-1">
              {teluguLabel}
            </p>
          )}

          {/* Product Name */}
          <Link
            href={`/products/${product.slug}`}
            className="block font-dmsans text-[15px] sm:text-[16px] font-semibold text-[#221814] leading-snug line-clamp-1 group-hover:text-[#1A382B] transition-colors"
          >
            {product.name}
          </Link>

          {/* Short Descriptor */}
          <p className="text-[12px] text-[#685950] line-clamp-1 mt-0.5">
            {product.tagline || 'Direct harvest, traditionally stone-cleaned.'}
          </p>

          {/* Rating */}
          <div className="flex items-center gap-1 mt-1.5">
            <div className="flex items-center text-[#B8863A]">
              <Star className="w-3 h-3 fill-current" />
            </div>
            <span className="font-data text-[12px] font-medium text-[#221814]">
              {(product.rating ?? 4.9).toFixed(1)}
            </span>
            <span className="text-[11px] text-[#8C7A70]">
              ({product.reviewCount || 34})
            </span>
          </div>
        </div>

        {/* Weight Selector Segmented Tabs */}
        <div>
          <div className="flex items-center gap-1.5">
            {product.weights.map((w) => (
              <button
                key={w.size}
                type="button"
                onClick={() => setSelectedWeightSize(w.size)}
                className={`px-2.5 py-1 text-[11px] font-medium rounded-[6px] border transition-all ${
                  selectedWeightSize === w.size
                    ? 'bg-[#1A382B] text-white border-[#1A382B]'
                    : 'bg-[#FAF7F2] text-[#685950] border-[#E2D9CE] hover:border-[#1A382B]/50'
                }`}
                aria-label={`Select pack size ${w.size}`}
              >
                {w.size}
              </button>
            ))}
          </div>
        </div>

        {/* Price & Add to Cart Action */}
        <div className="flex items-center justify-between pt-2 border-t border-[#F0EAE1]">
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="font-data font-bold text-[17px] sm:text-[19px] text-[#221814] tracking-tight">
                {formatCurrency(currentWeightOpt.price)}
              </span>
              {currentWeightOpt.mrp > currentWeightOpt.price && (
                <span className="font-data text-[12px] text-[#8C7A70] line-through">
                  {formatCurrency(currentWeightOpt.mrp)}
                </span>
              )}
            </div>
            <span className="font-data text-[10px] text-[#8C7A70] block leading-none mt-0.5">
              Tax inclusive
            </span>
          </div>

          <button
            type="button"
            onClick={handleQuickAdd}
            disabled={isAdded || !currentWeightOpt.inStock}
            className={`px-3.5 py-2 rounded-[6px] text-[12px] font-semibold flex items-center gap-1.5 transition-all duration-200 ${
              isAdded
                ? 'bg-[#264A3B] text-white'
                : 'bg-[#1A382B] hover:bg-[#132B21] text-white shadow-2xs'
            }`}
            aria-label={`Add ${product.name} to cart`}
          >
            {isAdded ? (
              <>
                <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>Added</span>
              </>
            ) : (
              <>
                <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>Add</span>
              </>
            )}
          </button>
        </div>
      </div>
    </article>
  );
}
