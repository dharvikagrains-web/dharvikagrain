'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { products } from '@/data/products';
import { brandConfig } from '@/data/brandConfig';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { formatCurrency } from '@/lib/utils';
import {
  ArrowRight,
  Leaf,
  ChevronLeft,
  ChevronRight,
  Heart,
  Plus,
  Check,
  Star,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Compass,
} from 'lucide-react';

export default function HomePage() {
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  // Selected weight state for bestselling cards
  const [selectedWeights, setSelectedWeights] = useState<Record<string, string>>({
    'millet-korralu': '1kg',
    'millet-samalu': '1kg',
    'spice-turmeric': '250g',
    'millet-arikelu': '1kg',
    'spice-red-chilli': '250g',
    'signature-spice-blend': '200g',
  });

  // Track quick-add animation states
  const [addedIds, setAddedIds] = useState<Record<string, boolean>>({});

  // Carousel ref for bestsellers
  const carouselRef = useRef<HTMLDivElement>(null);

  const scrollCarousel = (direction: 'left' | 'right') => {
    if (carouselRef.current) {
      const scrollAmount = direction === 'left' ? -340 : 340;
      carouselRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const handleQuickAdd = (productId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const product = products.find((p) => p.id === productId);
    if (!product) return;

    const currentWeight = selectedWeights[productId] || product.weights[0].size;
    addToCart(product, currentWeight, 1);

    setAddedIds((prev) => ({ ...prev, [productId]: true }));
    setTimeout(() => {
      setAddedIds((prev) => ({ ...prev, [productId]: false }));
    }, 1400);
  };

  // Filter 4 premier items for bestselling shelf matching the reference
  const bestsellerProducts = [
    {
      ...products.find((p) => p.id === 'millet-korralu')!,
      badge: 'Promotion',
      refHeadline: 'Unpolished Foxtail Millet for daily nourishment.',
    },
    {
      ...products.find((p) => p.id === 'spice-turmeric')!,
      badge: 'New',
      refHeadline: 'Single-origin Salem turmeric for healing cooking.',
    },
    {
      ...products.find((p) => p.id === 'millet-samalu')!,
      badge: 'Customer favorite',
      refHeadline: 'Little Millet grains for light, wholesome meals.',
    },
    {
      ...products.find((p) => p.id === 'spice-red-chilli')!,
      badge: 'New',
      refHeadline: 'Stemless Guntur red chilli powder for rich flavour.',
    },
  ].filter(Boolean);

  return (
    <div className="bg-[#FAF8F5] text-[#241611] space-y-16 sm:space-y-24 pb-20">
      {/* =========================================================================
          SECTION 01 — HERO (Curved Contained Canvas matching Homedine reference)
          ========================================================================= */}
      <section className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 pt-2 sm:pt-4">
        <div className="relative rounded-[28px] sm:rounded-[36px] overflow-hidden min-h-[580px] sm:min-h-[660px] flex items-center shadow-xl border border-[#E8E2D5]">
          {/* Cinematic Background Image */}
          <div className="absolute inset-0 z-0">
            <Image
              src="/images/showcase/hero-kitchen.jpg"
              alt="Warm aesthetic kitchen with golden grains and spices"
              fill
              priority
              className="object-cover object-center filter brightness-[0.92] contrast-[1.03]"
            />
            {/* Subtle scrim overlay so text is crystal clear */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#140F0A]/85 via-[#140F0A]/50 to-transparent sm:w-2/3" />
          </div>

          {/* Hero Left Content */}
          <div className="relative z-10 max-w-xl px-6 sm:px-12 lg:px-14 py-16 sm:py-20 text-white space-y-6">
            <div className="inline-flex items-center space-x-2 px-3.5 py-1 bg-white/15 backdrop-blur-md border border-white/20 rounded-full text-[#FAF7F2] text-[11px] font-medium tracking-wider uppercase">
              <span className="w-2 h-2 rounded-full bg-[#86EFAC] animate-pulse" />
              <span>100% Unpolished & Farm Traceable</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-serif text-white tracking-tight leading-[1.12]">
              Eco-Friendly <br />
              <span className="italic font-serif font-light text-[#EFE7D8]">
                Kitchenware
              </span>{' '}
              for <br />
              a greener home
            </h1>

            <p className="text-xs sm:text-sm md:text-base text-[#E8DFD5] leading-relaxed font-light max-w-md">
              The unpolished Chiru Dhanyalu and cold-ground spices niche with a sense of
              reverence for natural harvest. Straight from dryland farmer clusters to your kitchen.
            </p>

            <div className="pt-2 flex items-center gap-4">
              <Link
                href="/shop"
                className="inline-flex items-center space-x-2 px-6 sm:px-7 py-3 sm:py-3.5 bg-[#FAF7F2] hover:bg-white text-[#18110D] text-xs uppercase tracking-widest font-bold rounded-full transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-[1.02] group"
              >
                <span>Shop now</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>

          {/* Hero Floating Glassmorphism Stat Card (Right Corner, matching reference) */}
          <div className="absolute bottom-6 right-6 sm:bottom-10 sm:right-10 z-10 bg-[#0F291E]/75 backdrop-blur-md border border-white/20 rounded-2xl p-5 sm:p-6 text-white max-w-[210px] shadow-2xl hidden xs:block">
            <div className="flex items-start justify-between">
              <p className="text-[11px] sm:text-xs text-[#E8DFD5]/90 leading-tight">
                Natural.<br />
                Sustainable.<br />
                Eco-conscious.
              </p>
              <Leaf className="w-5 h-5 text-[#86EFAC] stroke-[1.8]" />
            </div>
            <div className="mt-4 pt-3 border-t border-white/10 flex items-baseline justify-between">
              <span className="text-3xl sm:text-4xl font-serif font-bold text-white tracking-tight">
                96%
              </span>
              <span className="text-[10px] uppercase tracking-wider text-[#86EFAC] font-semibold">
                Nutrient Pure
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 02 — BESTSELLING PRODUCTS SHELF (Exact Homedine Product Cards)
          ========================================================================= */}
      <section className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-3">
          <div>
            <span className="text-xs uppercase tracking-widest font-semibold text-[#8A5A44] block">
              Eco Essentials Planet-Friendly
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif text-[#241611] mt-1 font-normal">
              Bestselling <span className="font-serif italic font-light">✦ Products</span>
            </h2>
          </div>

          <div className="flex items-center space-x-3">
            <Link
              href="/shop"
              className="text-xs uppercase tracking-widest font-bold text-[#0D3522] hover:text-[#B35638] flex items-center gap-1 group mr-2"
            >
              <span>More products</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </Link>

            {/* Slider Controls */}
            <div className="hidden sm:flex items-center space-x-2">
              <button
                type="button"
                onClick={() => scrollCarousel('left')}
                className="w-8 h-8 rounded-full border border-[#D5CDC2] bg-white hover:bg-[#F2ECE3] flex items-center justify-center text-[#241611] transition-colors shadow-2xs"
                aria-label="Scroll left"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => scrollCarousel('right')}
                className="w-8 h-8 rounded-full border border-[#D5CDC2] bg-white hover:bg-[#F2ECE3] flex items-center justify-center text-[#241611] transition-colors shadow-2xs"
                aria-label="Scroll right"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* 4 Cards Grid / Carousel */}
        <div
          ref={carouselRef}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 overflow-x-auto sm:overflow-visible pb-4 sm:pb-0 scroll-smooth snap-x snap-mandatory"
        >
          {bestsellerProducts.map((product) => {
            const currentWeightSize =
              selectedWeights[product.id] || product.weights[0].size;
            const currentWeightOpt =
              product.weights.find((w) => w.size === currentWeightSize) ||
              product.weights[0];
            const inWishlist = isInWishlist(product.id);
            const isAdded = addedIds[product.id];

            return (
              <div
                key={product.id}
                className="snap-start group relative bg-[#EDE9E1]/80 hover:bg-[#E7E2D8] transition-all duration-300 rounded-[24px] sm:rounded-[28px] p-5 flex flex-col justify-between border border-[#E3DDD1] shadow-2xs hover:shadow-md"
              >
                {/* Top Badge & Wishlist Button */}
                <div className="flex items-center justify-between z-10">
                  <span className="text-[10px] uppercase tracking-wider font-medium px-2.5 py-0.5 rounded-full border border-[#D0C7B9] bg-white/70 text-[#6B5B52]">
                    {product.badge}
                  </span>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      toggleWishlist(product.id);
                    }}
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

                {/* Product Image Stage */}
                <Link
                  href={`/products/${product.slug}`}
                  className="relative aspect-square w-full my-3 flex items-center justify-center group-hover:scale-[1.03] transition-transform duration-500"
                >
                  <div className="relative w-44 h-44 sm:w-48 sm:h-48 rounded-2xl overflow-hidden shadow-xs">
                    <Image
                      src={product.images[0]}
                      alt={product.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                </Link>

                {/* Variant Selector Dots (matching reference dots) */}
                <div className="space-y-3">
                  <div className="flex items-center gap-1.5 pt-1">
                    {product.weights.map((w, idx) => (
                      <button
                        key={w.size}
                        type="button"
                        onClick={() =>
                          setSelectedWeights((prev) => ({
                            ...prev,
                            [product.id]: w.size,
                          }))
                        }
                        title={`Select ${w.size}`}
                        className={`w-3.5 h-3.5 rounded-full transition-all ${
                          currentWeightSize === w.size
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
                      {currentWeightSize}
                    </span>
                  </div>

                  {/* Product Title */}
                  <Link href={`/products/${product.slug}`} className="block">
                    <h3 className="text-xs sm:text-sm font-medium text-[#241611] leading-snug line-clamp-2 hover:text-[#0D3522] transition-colors">
                      {product.refHeadline}
                    </h3>
                  </Link>

                  {/* Price & Green Pill + Cart Button */}
                  <div className="flex items-center justify-between pt-1">
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

                    <button
                      type="button"
                      onClick={(e) => handleQuickAdd(product.id, e)}
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
          })}
        </div>
      </section>

      {/* =========================================================================
          SECTION 03 — MID-PAGE ARCHITECTURAL BANNER (Sage Kitchen Quote Banner)
          ========================================================================= */}
      <section className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="relative rounded-[28px] sm:rounded-[36px] overflow-hidden min-h-[380px] sm:min-h-[460px] flex items-end p-6 sm:p-12 shadow-lg border border-[#E6E0D4]">
          <Image
            src="/images/showcase/kitchen-mid-banner.jpg"
            alt="Warm modern open kitchen with grain and spice jars on open shelves"
            fill
            className="object-cover object-center filter brightness-[0.95]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#140F0A]/85 via-[#140F0A]/35 to-transparent" />

          {/* Floating Inset Quote Card */}
          <div className="relative z-10 bg-[#160E0A]/80 backdrop-blur-md border border-white/15 rounded-2xl p-6 sm:p-8 max-w-xl text-white space-y-3 shadow-2xl">
            <p className="text-sm sm:text-base md:text-lg font-serif italic text-[#FAF7F2] leading-relaxed">
              &ldquo;We craft grains and spices you can trust for years to come &mdash; through
              everyday wholesome meals and evolving lifestyles. Each batch is thoughtfully grown
              with chemical-free, regenerative agriculture.&rdquo;
            </p>
            <div className="flex items-center space-x-2 text-[#C5A059] text-[11px] uppercase tracking-widest font-semibold">
              <span className="w-3 h-px bg-[#C5A059]" />
              <span>Dharvika Organic Farm Collective</span>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 04 — 3 VALUE PROPOSITION PILLS (Matching Homedine Pills)
          ========================================================================= */}
      <section className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-[#EDE8DE] hover:bg-[#E6E0D4] rounded-2xl p-5 flex items-center justify-center space-x-3 transition-colors border border-[#DDD5C7] shadow-2xs">
            <span className="w-8 h-8 rounded-full bg-white/70 flex items-center justify-center text-base">
              🌾
            </span>
            <div className="text-left">
              <span className="text-xs font-bold uppercase tracking-wider text-[#241611] block">
                Natural Finish
              </span>
              <span className="text-[11px] text-[#6B5B52]">100% Unpolished Chiru Dhanyalu</span>
            </div>
          </div>

          <div className="bg-[#EDE8DE] hover:bg-[#E6E0D4] rounded-2xl p-5 flex items-center justify-center space-x-3 transition-colors border border-[#DDD5C7] shadow-2xs">
            <span className="w-8 h-8 rounded-full bg-white/70 flex items-center justify-center text-base">
              🌿
            </span>
            <div className="text-left">
              <span className="text-xs font-bold uppercase tracking-wider text-[#241611] block">
                Eco Innovation
              </span>
              <span className="text-[11px] text-[#6B5B52]">Cold Stone-Ground & Pure</span>
            </div>
          </div>

          <div className="bg-[#EDE8DE] hover:bg-[#E6E0D4] rounded-2xl p-5 flex items-center justify-center space-x-3 transition-colors border border-[#DDD5C7] shadow-2xs">
            <span className="w-8 h-8 rounded-full bg-white/70 flex items-center justify-center text-base">
              🌱
            </span>
            <div className="text-left">
              <span className="text-xs font-bold uppercase tracking-wider text-[#241611] block">
                Sustainable Materials
              </span>
              <span className="text-[11px] text-[#6B5B52]">Aroma-Barrier Eco Packaging</span>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 05 — CATEGORY VISUAL PILLARS ("Explore our thoughtful Categories")
          ========================================================================= */}
      <section className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="mb-8">
          <span className="text-xs uppercase tracking-widest font-semibold text-[#8A5A44] block">
            Explore our thoughtful and
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif text-[#241611] mt-1 font-normal">
            planet-first <span className="font-serif italic font-light">✦ Categories</span>
          </h2>
        </div>

        {/* 4 Tall Portrait Cards (3:4 ratio, matching Homedine cards) */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {/* Card 1: Millets */}
          <Link
            href="/millets"
            className="group relative aspect-[3/4] rounded-[24px] sm:rounded-[28px] overflow-hidden shadow-md flex flex-col justify-end p-5 sm:p-6 text-white"
          >
            <Image
              src="/images/showcase/cat-millets.jpg"
              alt="Earthenware ceramic bowl overflowing with golden unpolished millets"
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#140F0A]/90 via-[#140F0A]/30 to-transparent" />
            <div className="relative z-10 text-center space-y-3">
              <h3 className="text-xs sm:text-sm font-medium tracking-wide uppercase text-white/90">
                Explore <br />
                <span className="text-sm sm:text-base font-serif font-bold text-white capitalize">
                  Chiru Dhanyalu
                </span>
              </h3>
              <div>
                <span className="inline-block px-4 py-1.5 bg-[#FAF7F2] hover:bg-white text-[#18110D] text-[11px] font-bold uppercase tracking-wider rounded-full shadow-md group-hover:scale-105 transition-transform">
                  Shop &rarr;
                </span>
              </div>
            </div>
          </Link>

          {/* Card 2: Spices */}
          <Link
            href="/spices"
            className="group relative aspect-[3/4] rounded-[24px] sm:rounded-[28px] overflow-hidden shadow-md flex flex-col justify-end p-5 sm:p-6 text-white"
          >
            <Image
              src="/images/showcase/cat-spices.jpg"
              alt="Handcrafted brass bowls and wooden spoons filled with rich Indian spices"
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#140F0A]/90 via-[#140F0A]/30 to-transparent" />
            <div className="relative z-10 text-center space-y-3">
              <h3 className="text-xs sm:text-sm font-medium tracking-wide uppercase text-white/90">
                Explore <br />
                <span className="text-sm sm:text-base font-serif font-bold text-white capitalize">
                  Pure Spices
                </span>
              </h3>
              <div>
                <span className="inline-block px-4 py-1.5 bg-[#FAF7F2] hover:bg-white text-[#18110D] text-[11px] font-bold uppercase tracking-wider rounded-full shadow-md group-hover:scale-105 transition-transform">
                  Shop &rarr;
                </span>
              </div>
            </div>
          </Link>

          {/* Card 3: Oils */}
          <Link
            href="/shop?category=oils"
            className="group relative aspect-[3/4] rounded-[24px] sm:rounded-[28px] overflow-hidden shadow-md flex flex-col justify-end p-5 sm:p-6 text-white"
          >
            <Image
              src="/images/showcase/cat-oils.jpg"
              alt="Glass bottle of golden cold-pressed oil with fresh seeds"
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#140F0A]/90 via-[#140F0A]/30 to-transparent" />
            <div className="relative z-10 text-center space-y-3">
              <h3 className="text-xs sm:text-sm font-medium tracking-wide uppercase text-white/90">
                Explore <br />
                <span className="text-sm sm:text-base font-serif font-bold text-white capitalize">
                  Cold-Pressed Oils
                </span>
              </h3>
              <div>
                <span className="inline-block px-4 py-1.5 bg-[#FAF7F2] hover:bg-white text-[#18110D] text-[11px] font-bold uppercase tracking-wider rounded-full shadow-md group-hover:scale-105 transition-transform">
                  Shop &rarr;
                </span>
              </div>
            </div>
          </Link>

          {/* Card 4: Flours & Rava */}
          <Link
            href="/shop?category=flours"
            className="group relative aspect-[3/4] rounded-[24px] sm:rounded-[28px] overflow-hidden shadow-md flex flex-col justify-end p-5 sm:p-6 text-white"
          >
            <Image
              src="/images/showcase/cat-flours.jpg"
              alt="Stone ground organic millet flour in jute sack with wooden scoop"
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#140F0A]/90 via-[#140F0A]/30 to-transparent" />
            <div className="relative z-10 text-center space-y-3">
              <h3 className="text-xs sm:text-sm font-medium tracking-wide uppercase text-white/90">
                Explore <br />
                <span className="text-sm sm:text-base font-serif font-bold text-white capitalize">
                  Millet Flours & Rava
                </span>
              </h3>
              <div>
                <span className="inline-block px-4 py-1.5 bg-[#FAF7F2] hover:bg-white text-[#18110D] text-[11px] font-bold uppercase tracking-wider rounded-full shadow-md group-hover:scale-105 transition-transform">
                  Shop &rarr;
                </span>
              </div>
            </div>
          </Link>
        </div>
      </section>

      {/* =========================================================================
          SECTION 06 — ASYMMETRIC SPLIT: "Best sellers" (Matching Homedine layout)
          ========================================================================= */}
      <section className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="bg-[#F3EFE9] rounded-[28px] sm:rounded-[36px] p-6 sm:p-12 lg:p-14 border border-[#E6E0D4] grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left: Text & CTA */}
          <div className="lg:col-span-5 space-y-5">
            <h2 className="text-3xl sm:text-4xl font-serif text-[#241611]">
              Best <span className="font-serif italic font-light">sellers</span>
            </h2>
            <p className="text-xs sm:text-sm text-[#6B5B52] leading-relaxed">
              A steaming traditional brass kadai of foxtail millet pulao rests on a rustic wooden
              surface, encircled by fresh farm spices &mdash; a perfect blend of durability,
              heritage, and mindful cooking.
            </p>
            <div className="pt-2">
              <Link
                href="/shop?category=bestsellers"
                className="inline-flex items-center space-x-2 px-6 py-3 bg-[#0D3522] hover:bg-[#072417] text-white text-xs uppercase tracking-widest font-semibold rounded-full transition-colors shadow-sm group"
              >
                <span>Shop now</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>

          {/* Right: Featured Photography */}
          <div className="lg:col-span-7 relative aspect-[4/3] rounded-[24px] overflow-hidden shadow-md">
            <Image
              src="/images/showcase/bestseller-dish.jpg"
              alt="Steaming hot traditional South Indian millet pulao in brass kadai"
              fill
              className="object-cover"
            />
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 07 — ASYMMETRIC SPLIT: "New Arrival" (Inverted Layout)
          ========================================================================= */}
      <section className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="bg-[#F3EFE9] rounded-[28px] sm:rounded-[36px] p-6 sm:p-12 lg:p-14 border border-[#E6E0D4] grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left: Photo */}
          <div className="lg:col-span-7 relative aspect-[4/3] rounded-[24px] overflow-hidden shadow-md order-2 lg:order-1">
            <Image
              src="/images/showcase/new-arrival-spice.jpg"
              alt="Minimalist luxury glass spice jar filled with vibrant golden turmeric"
              fill
              className="object-cover"
            />
          </div>

          {/* Right: Text & CTA */}
          <div className="lg:col-span-5 space-y-5 order-1 lg:order-2">
            <h2 className="text-3xl sm:text-4xl font-serif text-[#241611]">
              New <span className="font-serif italic font-light">Arrival</span>
            </h2>
            <p className="text-xs sm:text-sm text-[#6B5B52] leading-relaxed">
              A farm-direct harvest showcasing pure Salem Lakadong turmeric and sun-cured Guntur
              chillies &mdash; a vibrant celebration of zero-waste, planet-friendly kitchen practices.
              Stone-milled below 40&deg;C to preserve natural curcumin and volatile aroma oils.
            </p>
            <div className="pt-2">
              <Link
                href="/spices"
                className="inline-flex items-center space-x-2 px-6 py-3 bg-[#0D3522] hover:bg-[#072417] text-white text-xs uppercase tracking-widest font-semibold rounded-full transition-colors shadow-sm group"
              >
                <span>Shop now</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 08 — GALLERY STRIP ("Ideas and inspiration ✦ Gallery")
          ========================================================================= */}
      <section className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <span className="text-xs uppercase tracking-widest font-semibold text-[#8A5A44] block">
              Thoughtful, Planet-Prioritizing Ideas
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif text-[#241611] mt-1 font-normal">
              and inspiration <span className="font-serif italic font-light">✦ Gallery</span>
            </h2>
          </div>

          <div className="flex items-center space-x-2">
            <button
              type="button"
              className="w-7 h-7 rounded-full border border-[#D5CDC2] bg-white flex items-center justify-center text-[#241611] opacity-70 hover:opacity-100"
              aria-label="Previous gallery image"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              className="w-7 h-7 rounded-full border border-[#D5CDC2] bg-white flex items-center justify-center text-[#241611] opacity-70 hover:opacity-100"
              aria-label="Next gallery image"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* 5-Image Mosaic Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
          <div className="relative aspect-square rounded-2xl overflow-hidden shadow-xs group">
            <Image
              src="/images/products/korralu-foxtail-millet.jpg"
              alt="Raw foxtail millet"
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
          </div>
          <div className="relative aspect-square rounded-2xl overflow-hidden shadow-xs group">
            <Image
              src="/images/products/pure-turmeric-powder.jpg"
              alt="Pure turmeric powder"
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
          </div>
          <div className="relative aspect-square rounded-2xl overflow-hidden shadow-xs group">
            <Image
              src="/images/recipes/foxtail-millet-upma.jpg"
              alt="Millet breakfast dish"
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
          </div>
          <div className="relative aspect-square rounded-2xl overflow-hidden shadow-xs group">
            <Image
              src="/images/products/signature-regional-spice-blend.jpg"
              alt="Signature Spice Blend"
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
          </div>
          <div className="relative aspect-square rounded-2xl overflow-hidden shadow-xs group col-span-2 sm:col-span-1">
            <Image
              src="/images/products/pure-red-chilli-powder.jpg"
              alt="Pure red chilli"
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 09 — SOCIAL PROOF & TESTIMONIALS (4.9/5 Score + Reviews)
          ========================================================================= */}
      <section className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="bg-[#FAF7F2] border border-[#E5DFD4] rounded-[28px] sm:rounded-[36px] p-6 sm:p-10 lg:p-12 shadow-xs grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Big Score Card */}
          <div className="lg:col-span-4 space-y-3 pr-0 lg:pr-6 border-b lg:border-b-0 lg:border-r border-[#E5DFD4] pb-6 lg:pb-0">
            <div className="flex items-baseline space-x-2">
              <span className="text-4xl sm:text-5xl font-serif font-bold text-[#241611]">
                4.9
              </span>
              <span className="text-xl sm:text-2xl text-[#8C7A70] font-light">/ 5</span>
            </div>
            <div className="flex text-[#C5A059] text-base space-x-0.5">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-current stroke-none" />
              ))}
            </div>
            <p className="text-xs sm:text-sm text-[#6B5B52] leading-relaxed">
              More than <strong className="text-[#241611]">12,500+ 5-Star Reviews</strong> for Our
              Award-Winning Pure Millets & Spices.
            </p>
          </div>

          {/* Testimonial Cards Carousel / Grid */}
          <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white rounded-2xl p-5 border border-[#E7E0D5] flex flex-col justify-between shadow-2xs space-y-4">
              <div className="space-y-2">
                <span className="text-2xl font-serif text-[#C5A059] leading-none">&ldquo;</span>
                <p className="text-xs text-[#241611] font-light leading-relaxed">
                  Dharvika&rsquo;s Korralu is clean, stone-free, and cooked like fluffy rice. My family
                  enjoyed the natural nutty flavor.
                </p>
              </div>
              <div className="pt-2 border-t border-[#F0EAE1]">
                <h4 className="text-[11px] font-bold text-[#241611]">Jane Cooper</h4>
                <p className="text-[10px] text-[#8C7A70]">Nutritionist</p>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-5 border border-[#E7E0D5] flex flex-col justify-between shadow-2xs space-y-4">
              <div className="space-y-2">
                <span className="text-2xl font-serif text-[#C5A059] leading-none">&ldquo;</span>
                <p className="text-xs text-[#241611] font-light leading-relaxed">
                  Fantastic products and fast delivery. The Salem turmeric has an authentic aroma and
                  deep golden colour!
                </p>
              </div>
              <div className="pt-2 border-t border-[#F0EAE1]">
                <h4 className="text-[11px] font-bold text-[#241611]">Darlene Robertson</h4>
                <p className="text-[10px] text-[#8C7A70]">Culinary Instructor</p>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-5 border border-[#E7E0D5] flex flex-col justify-between shadow-2xs space-y-4">
              <div className="space-y-2">
                <span className="text-2xl font-serif text-[#C5A059] leading-none">&ldquo;</span>
                <p className="text-xs text-[#241611] font-light leading-relaxed">
                  Love the airtight packaging. Grains stay fresh and dry. Truly wholesome ancient
                  grains for modern kitchens.
                </p>
              </div>
              <div className="pt-2 border-t border-[#F0EAE1]">
                <h4 className="text-[11px] font-bold text-[#241611]">Jacob Jones</h4>
                <p className="text-[10px] text-[#8C7A70]">Food Blogger</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 10 — BRAND ETHOS CLOSING STATEMENT (Matching Homedine Footer Tag)
          ========================================================================= */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 text-center pt-8">
        <p className="text-sm sm:text-base md:text-lg text-[#4A3D36] font-light leading-relaxed">
          Discover our commitment to 🌾 <strong className="font-semibold text-[#241611]">sustainable</strong>{' '}
          materials, low-impact stone milling, and{' '}
          <strong className="font-semibold text-[#241611]">ethical sourcing</strong> partnerships
          &mdash; all crafted to support a healthier planet and a 🌿{' '}
          <strong className="font-semibold text-[#0D3522]">greener kitchen</strong>.
        </p>
      </section>
    </div>
  );
}
