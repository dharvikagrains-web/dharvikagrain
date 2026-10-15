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
    <article className="group bg-white border border-[#E7D8B8] hover:border-[#354C36]/50 rounded-[8px] sm:rounded-[10px] overflow-hidden transition-all duration-300 flex flex-col justify-between h-full shadow-[0_1px_3px_rgba(41,43,37,0.04)] hover:shadow-[0_6px_20px_rgba(41,43,37,0.06)]">
      {/* Visual Product Stage */}
      <div className="relative bg-[#FBF9F3] p-2.5 sm:p-4 border-b border-[#EBE1CF]">
        {/* Top Badges & Wishlist Action */}
        <div className="flex items-center justify-between gap-1.5 mb-2 z-10 relative">
          <div className="flex items-center gap-1 sm:gap-1.5 flex-wrap">
            {product.bestseller ? (
              <span className="text-[9px] sm:text-[10.5px] font-medium tracking-wide uppercase px-2 py-0.5 rounded-[4px] bg-[#E7D8B8]/50 text-[#243725] border border-[#D5C29B]">
                Bestseller
              </span>
            ) : discount > 0 ? (
              <span className="text-[9px] sm:text-[10.5px] font-medium tracking-wide uppercase px-2 py-0.5 rounded-[4px] bg-[#F7EBE1] text-[#C47B4B] border border-[#EACBB5]">
                {discount}% OFF
              </span>
            ) : (
              <span className="text-[9px] sm:text-[10.5px] font-medium tracking-wide uppercase px-2 py-0.5 rounded-[4px] bg-white text-[#5F6156] border border-[#E7D8B8]">
                {product.category === 'millets' ? 'Chiru Dhanyalu' : 'Pure Spice'}
              </span>
            )}
          </div>

          <button
            type="button"
            onClick={handleWishlistClick}
            className={`w-6 h-6 sm:w-7 sm:h-7 rounded-[4px] sm:rounded-[6px] border flex items-center justify-center transition-colors shrink-0 cursor-pointer ${
              inWishlist
                ? 'bg-[#C47B4B] border-[#C47B4B] text-white'
                : 'bg-white border-[#E7D8B8] text-[#5F6156] hover:text-[#C47B4B] hover:border-[#C47B4B]'
            }`}
            aria-label={inWishlist ? 'Remove from wishlist' : 'Save to wishlist'}
          >
            <Heart className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-current stroke-[1.5]" />
          </button>
        </div>

        {/* Clean Square Product Image Frame */}
        <Link
          href={`/products/${product.slug}`}
          className="relative block aspect-square w-full rounded-[4px] sm:rounded-[6px] overflow-hidden bg-white"
        >
          <Image
            src={displayImage}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 50vw, 25vw"
            className="object-cover card-image-zoom"
            priority={product.bestseller}
          />
        </Link>
      </div>

      {/* Card Content & Commerce Meta */}
      <div className="p-3 sm:p-4 flex flex-col flex-1 justify-between gap-2.5 sm:gap-3 bg-white">
        <div>
          {/* Subtle Regional Heritage Layer */}
          {teluguLabel && (
            <p className="font-telugu text-[10px] sm:text-[11.5px] text-[#C47B4B] font-medium leading-none mb-1 truncate">
              {teluguLabel}
            </p>
          )}

          {/* Product Name */}
          <Link
            href={`/products/${product.slug}`}
            className="block font-dmsans text-[13.5px] sm:text-[16px] font-semibold text-[#292B25] leading-snug line-clamp-1 group-hover:text-[#354C36] transition-colors"
          >
            {product.name}
          </Link>

          {/* Short Descriptor */}
          <p className="text-[11px] sm:text-[12px] text-[#5F6156] line-clamp-1 mt-0.5">
            {product.tagline || 'Direct harvest, traditionally stone-cleaned.'}
          </p>

          {/* Verified Rating or Fresh Harvest Indicator */}
          <div className="flex items-center gap-1 mt-1 sm:mt-1.5">
            {product.rating && product.reviewCount && product.reviewCount > 0 ? (
              <>
                <div className="flex items-center text-[#C47B4B]">
                  <Star className="w-2.5 h-2.5 sm:w-3 sm:h-3 fill-current" />
                </div>
                <span className="font-data text-[11px] sm:text-[12px] font-medium text-[#292B25]">
                  {product.rating.toFixed(1)}
                </span>
                <span className="text-[10px] sm:text-[11px] text-[#8A8B80]">
                  ({product.reviewCount})
                </span>
              </>
            ) : (
              <span className="text-[9.5px] text-[#354C36] bg-[#E7D8B8]/40 px-1.5 py-0.5 rounded-[3px] font-data font-medium">
                ✦ Fresh Harvest Batch
              </span>
            )}
          </div>
        </div>

        {/* Weight Selector Segmented Tabs */}
        <div>
          <div className="flex items-center gap-1 sm:gap-1.5 flex-wrap">
            {product.weights.map((w) => (
              <button
                key={w.size}
                type="button"
                onClick={() => setSelectedWeightSize(w.size)}
                className={`px-2 sm:px-2.5 py-0.5 sm:py-1 text-[10px] sm:text-[11px] font-medium rounded-[4px] border transition-all cursor-pointer ${
                  selectedWeightSize === w.size
                    ? 'bg-[#354C36] text-white border-[#354C36]'
                    : 'bg-[#F8F4EA] text-[#5F6156] border-[#E7D8B8] hover:border-[#354C36]/50'
                }`}
                aria-label={`Select pack size ${w.size}`}
              >
                {w.size}
              </button>
            ))}
          </div>
        </div>

        {/* Price & Add to Cart Action */}
        <div className="flex items-center justify-between pt-2.5 border-t border-[#F1E8D6] gap-1.5">
          <div className="min-w-0">
            <div className="flex items-baseline gap-1 sm:gap-1.5 flex-wrap">
              <span className="font-data font-bold text-[15px] sm:text-[18px] text-[#292B25] tracking-tight">
                {formatCurrency(currentWeightOpt.price)}
              </span>
              {currentWeightOpt.mrp > currentWeightOpt.price && (
                <span className="font-data text-[10px] sm:text-[11.5px] text-[#8A8B80] line-through">
                  {formatCurrency(currentWeightOpt.mrp)}
                </span>
              )}
            </div>
            <span className="font-data text-[9px] sm:text-[10px] text-[#8A8B80] block leading-none mt-0.5">
              Tax inclusive
            </span>
          </div>

          <button
            type="button"
            onClick={handleQuickAdd}
            disabled={isAdded || !currentWeightOpt.inStock}
            className={`px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-[5px] text-[11px] sm:text-[12px] font-semibold flex items-center gap-1 transition-all duration-200 shrink-0 cursor-pointer ${
              isAdded
                ? 'bg-[#243725] text-white'
                : 'bg-[#354C36] hover:bg-[#243725] text-white shadow-2xs'
            }`}
            aria-label={`Add ${product.name} to cart`}
          >
            {isAdded ? (
              <>
                <Check className="w-3 h-3 sm:w-3.5 sm:h-3.5 stroke-[2.5]" />
                <span>Added</span>
              </>
            ) : (
              <>
                <Plus className="w-3 h-3 sm:w-3.5 sm:h-3.5 stroke-[2.5]" />
                <span>Add</span>
              </>
            )}
          </button>
        </div>
      </div>
    </article>
  );
}
