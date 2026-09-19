'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { products } from '@/data/products';
import { recipes } from '@/data/recipes';
import { brandConfig } from '@/data/brandConfig';
import { ProductCard } from '@/components/product/ProductCard';
import {
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  RefreshCw,
  Truck,
  Leaf,
  Clock,
  Compass,
  ChefHat,
} from 'lucide-react';
import { InstagramIcon } from '@/components/ui/Icons';

export default function HomePage() {
  const bestsellers = products.filter((p) => p.bestseller);
  const featuredSpices = products.filter((p) => p.category === 'spices');
  const signatureProduct = products.find((p) => p.id === 'signature-spice-blend');

  return (
    <div className="space-y-16 sm:space-y-24 pb-16">
      {/* ==========================================
          SECTION 01 — HERO
          ========================================== */}
      <section className="relative min-h-[85vh] sm:min-h-[90vh] flex items-center justify-center bg-[#1E120D] text-white overflow-hidden">
        {/* Editorial Background Image with subtle scrim overlay */}
        <div className="absolute inset-0 z-0 opacity-40">
          <Image
            src="/images/products/signature-regional-spice-blend.jpg"
            alt="Authentic traditional Indian grains and pure spices"
            fill
            priority
            className="object-cover object-center filter brightness-90 contrast-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1E120D] via-[#1E120D]/60 to-transparent" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 text-center space-y-6">
          {/* Dharvika Luxury Embossed Monogram Badge */}
          <div className="flex flex-col items-center justify-center space-y-3">
            <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-[#FAF7F2] p-1 border-2 border-[#C5A059] shadow-2xl overflow-hidden flex items-center justify-center filter drop-shadow-[0_10px_25px_rgba(0,0,0,0.5)]">
              <Image
                src={brandConfig.logoImage || '/images/brand/dharvika-emblem-transparent.png'}
                alt="Dharvika Grains Luxury Embossed Seal"
                width={96}
                height={96}
                className="w-full h-full object-contain"
                priority
              />
            </div>
            <div className="inline-flex items-center space-x-2 px-4 py-1.5 border border-[#C5A059]/50 bg-[#160E0A]/85 backdrop-blur-md text-[#C5A059] text-[11px] sm:text-xs font-semibold uppercase tracking-[0.25em]">
              <span>{brandConfig.brandName}</span>
              <span>•</span>
              <span>{brandConfig.mission}</span>
            </div>
            <div className="text-[10px] tracking-[0.25em] text-[#E8DFD5]/80 uppercase font-medium">
              {brandConfig.pillars?.join('  |  ')}
            </div>
          </div>

          <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-serif font-normal tracking-tight text-[#FAF7F2] max-w-4xl mx-auto leading-[1.12]">
            Traditional grains.<br />
            Authentic Indian flavours.<br />
            <span className="italic font-serif text-[#C4924A]">{brandConfig.tagline}</span>
          </h1>

          <p className="text-sm sm:text-base md:text-lg text-[#E8DFD5] max-w-2xl mx-auto font-light leading-relaxed">
            Carefully sourced Chiru Dhanyalu (millets) and pure, cold-ground spices.
            Bridging rain-fed Indian farming traditions with wholesome everyday cooking.
          </p>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/millets"
              className="w-full sm:w-auto px-8 py-4 bg-[#B35638] hover:bg-[#9E462A] text-white text-xs uppercase tracking-widest font-semibold transition-all duration-200 text-center shadow-lg hover:shadow-xl"
            >
              Explore Millets
            </Link>
            <Link
              href="/spices"
              className="w-full sm:w-auto px-8 py-4 bg-transparent border border-[#FAF7F2]/80 hover:bg-[#FAF7F2] hover:text-[#241611] text-[#FAF7F2] text-xs uppercase tracking-widest font-semibold transition-all duration-200 text-center"
            >
              Explore Pure Spices
            </Link>
          </div>
        </div>
      </section>

      {/* ==========================================
          SECTION 02 — TRUST STRIP
          ========================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20">
        <div className="bg-[#FAF7F2] border border-[#E7DED4] shadow-xl grid grid-cols-2 md:grid-cols-5 divide-y md:divide-y-0 md:divide-x divide-[#E7DED4]">
          <div className="p-4 sm:p-5 flex flex-col items-center text-center space-y-1.5">
            <Compass className="w-5 h-5 text-[#B35638] stroke-[1.5]" />
            <h4 className="text-xs font-semibold text-[#241611] uppercase tracking-wider">Carefully Sourced</h4>
            <p className="text-[11px] text-[#6B5B52]">Direct from dryland grower clusters</p>
          </div>
          <div className="p-4 sm:p-5 flex flex-col items-center text-center space-y-1.5">
            <ShieldCheck className="w-5 h-5 text-[#B35638] stroke-[1.5]" />
            <h4 className="text-xs font-semibold text-[#241611] uppercase tracking-wider">Quality Checked</h4>
            <p className="text-[11px] text-[#6B5B52]">Destoned, winnowed & lab verified</p>
          </div>
          <div className="p-4 sm:p-5 flex flex-col items-center text-center space-y-1.5">
            <RefreshCw className="w-5 h-5 text-[#B35638] stroke-[1.5]" />
            <h4 className="text-xs font-semibold text-[#241611] uppercase tracking-wider">Traceable Batches</h4>
            <p className="text-[11px] text-[#6B5B52]">Crop season & milling timestamps</p>
          </div>
          <div className="p-4 sm:p-5 flex flex-col items-center text-center space-y-1.5">
            <Sparkles className="w-5 h-5 text-[#B35638] stroke-[1.5]" />
            <h4 className="text-xs font-semibold text-[#241611] uppercase tracking-wider">Thoughtfully Packed</h4>
            <p className="text-[11px] text-[#6B5B52]">Food-grade aroma barrier pouches</p>
          </div>
          <div className="p-4 sm:p-5 flex flex-col items-center text-center space-y-1.5 col-span-2 md:col-span-1">
            <Truck className="w-5 h-5 text-[#B35638] stroke-[1.5]" />
            <h4 className="text-xs font-semibold text-[#241611] uppercase tracking-wider">Direct to Home</h4>
            <p className="text-[11px] text-[#6B5B52]">Delivered fresh across India</p>
          </div>
        </div>
      </section>

      {/* ==========================================
          SECTION 03 — SHOP BY CATEGORY
          ========================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs uppercase tracking-widest font-semibold text-[#B35638]">
            Two Pillars of Indian Nutrition
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-semibold text-[#241611] mt-2">
            Essential Provisions for the Conscious Kitchen
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Card 1: Millets */}
          <div className="group relative bg-[#F5EFEB] border border-[#E7DED4] overflow-hidden flex flex-col justify-between p-8 sm:p-12">
            <div className="relative z-10 space-y-4 max-w-md">
              <span className="text-xs uppercase tracking-widest font-bold text-[#B35638]">
                Category 01
              </span>
              <h3 className="text-2xl sm:text-3xl font-serif font-semibold text-[#241611]">
                Chiru Dhanyalu
              </h3>
              <p className="text-xs sm:text-sm text-[#6B5B52] leading-relaxed">
                Traditional Indian grains for everyday cooking. Unpolished Korralu, Samalu, Arikelu, Udalu,
                Ragi, and Jowar—cultivated in rain-fed red soils without chemical polishes.
              </p>
              <div className="pt-2">
                <Link
                  href="/millets"
                  className="inline-flex items-center space-x-2 text-xs uppercase tracking-widest font-bold text-[#241611] group-hover:text-[#B35638] transition-colors"
                >
                  <span>Explore Millets</span>
                  <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
            <div className="relative h-64 sm:h-72 mt-6 overflow-hidden">
              <Image
                src="/images/products/korralu-foxtail-millet.jpg"
                alt="Chiru Dhanyalu traditional unpolished grains"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-700"
              />
            </div>
          </div>

          {/* Card 2: Spices */}
          <div className="group relative bg-[#F5EFEB] border border-[#E7DED4] overflow-hidden flex flex-col justify-between p-8 sm:p-12">
            <div className="relative z-10 space-y-4 max-w-md">
              <span className="text-xs uppercase tracking-widest font-bold text-[#B35638]">
                Category 02
              </span>
              <h3 className="text-2xl sm:text-3xl font-serif font-semibold text-[#241611]">
                Pure Spices
              </h3>
              <p className="text-xs sm:text-sm text-[#6B5B52] leading-relaxed">
                Authentic, single-origin spices for everyday Indian kitchens. Sun-cured Lakadong turmeric,
                stemless Guntur chillies, slow-roasted dhaniya, fragrant cumin, and bold Malabar pepper.
              </p>
              <div className="pt-2">
                <Link
                  href="/spices"
                  className="inline-flex items-center space-x-2 text-xs uppercase tracking-widest font-bold text-[#241611] group-hover:text-[#B35638] transition-colors"
                >
                  <span>Explore Spices</span>
                  <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
            <div className="relative h-64 sm:h-72 mt-6 overflow-hidden">
              <Image
                src="/images/products/pure-turmeric-powder.jpg"
                alt="Pure aromatic spices"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-700"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ==========================================
          SECTION 04 — BESTSELLERS
          ========================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-8 pb-4 border-b border-[#E7DED4]">
          <div>
            <span className="text-xs uppercase tracking-widest font-semibold text-[#B35638]">
              Proven in Modern Kitchens
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif font-semibold text-[#241611] mt-1">
              Customer Bestsellers
            </h2>
          </div>
          <Link
            href="/shop"
            className="mt-3 sm:mt-0 text-xs uppercase tracking-widest font-bold text-[#241611] hover:text-[#B35638] flex items-center"
          >
            <span>View All Catalogue</span>
            <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
          </Link>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {bestsellers.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* ==========================================
          SECTION 05 — WHY CHIRU DHANYALU?
          ========================================== */}
      <section className="bg-[#F5EFEB] border-y border-[#E7DED4] py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-6 relative aspect-4/3 sm:aspect-16/10 overflow-hidden border border-[#E7DED4]">
              <Image
                src="/images/products/ragi-finger-millet.jpg"
                alt="Traditional Indian millets cultivation and grain texture"
                fill
                className="object-cover"
              />
            </div>

            <div className="lg:col-span-6 space-y-6">
              <span className="text-xs uppercase tracking-widest font-bold text-[#B35638]">
                Heritage & Nourishment
              </span>
              <h2 className="text-2xl sm:text-4xl font-serif font-semibold text-[#241611] leading-tight">
                Why Chiru Dhanyalu Matter in Today&rsquo;s Kitchen
              </h2>
              <div className="space-y-4 text-xs sm:text-sm text-[#6B5B52] leading-relaxed">
                <p>
                  Chiru Dhanyalu—the historic Telugu term for resilient small grains like Korralu, Samalu,
                  Arikelu, and Udalu—are not a modern health fad. For over 4,000 years, they were the dietary
                  foundation of the Deccan, naturally drought-hardy and needing minimal water to yield
                  dense nourishment.
                </p>
                <p>
                  Unlike modern polished white rice that has had its nutrient-dense husk and bran stripped away,
                  unpolished millets provide sustained energy, natural prebiotic fibers, and wholesome micronutrients.
                </p>
                <p>
                  Introducing them is effortless: a 30-minute soak before cooking transforms them into fluffy rice
                  substitutes, comforting breakfast upmas, or fermented batter for crisp dosas.
                </p>
              </div>

              <div className="pt-2 flex flex-wrap gap-3">
                <Link
                  href="/millets"
                  className="px-6 py-3 bg-[#241611] hover:bg-[#B35638] text-white text-xs uppercase tracking-widest font-semibold transition-colors"
                >
                  Explore Chiru Dhanyalu
                </Link>
                <Link
                  href="/journal/what-are-chiru-dhanyalu-traditional-grains-explained"
                  className="px-6 py-3 border border-[#241611] text-[#241611] hover:bg-white text-xs uppercase tracking-widest font-semibold transition-colors"
                >
                  Read the Full Guide
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==========================================
          SECTION 06 — OUR SOURCING (FARM-TO-HOME)
          ========================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs uppercase tracking-widest font-semibold text-[#B35638]">
            Complete Transparency
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-semibold text-[#241611] mt-1">
            The Farm-to-Home Journey
          </h2>
          <p className="text-xs sm:text-sm text-[#6B5B52] mt-3">
            No intermediaries, no opaque broker warehouses. We trace each harvest directly from cultivation
            to packaging with uncompromised quality standards.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-6">
          <div className="bg-white border border-[#E7DED4] p-6 space-y-3">
            <span className="text-2xl font-serif font-bold text-[#C4924A]">01</span>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-[#241611]">Source</h4>
            <p className="text-xs text-[#6B5B52] leading-relaxed">
              Harvested at full maturity from smallholder dryland clusters in Andhra Pradesh, Telangana, and Karnataka.
            </p>
          </div>

          <div className="bg-white border border-[#E7DED4] p-6 space-y-3">
            <span className="text-2xl font-serif font-bold text-[#C4924A]">02</span>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-[#241611]">Quality Check</h4>
            <p className="text-xs text-[#6B5B52] leading-relaxed">
              Batch testing for moisture levels, foreign matter calibration, and pesticide residue verification.
            </p>
          </div>

          <div className="bg-white border border-[#E7DED4] p-6 space-y-3">
            <span className="text-2xl font-serif font-bold text-[#C4924A]">03</span>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-[#241611]">Process</h4>
            <p className="text-xs text-[#6B5B52] leading-relaxed">
              Gentle mechanical de-husking for millets and cold-milling below 40°C for spices to preserve aroma oils.
            </p>
          </div>

          <div className="bg-white border border-[#E7DED4] p-6 space-y-3">
            <span className="text-2xl font-serif font-bold text-[#C4924A]">04</span>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-[#241611]">Pack</h4>
            <p className="text-xs text-[#6B5B52] leading-relaxed">
              Sealed in certified food-grade multi-layer moisture and UV barrier pouches with complete batch codes.
            </p>
          </div>

          <div className="bg-white border border-[#E7DED4] p-6 space-y-3 sm:col-span-2 lg:col-span-1">
            <span className="text-2xl font-serif font-bold text-[#C4924A]">05</span>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-[#241611]">Deliver</h4>
            <p className="text-xs text-[#6B5B52] leading-relaxed">
              Dispatched directly to your doorstep with transparent tracking and zero shelf stagnation.
            </p>
          </div>
        </div>

        <div className="text-center mt-8">
          <Link
            href="/sourcing"
            className="inline-flex items-center text-xs uppercase tracking-widest font-bold text-[#B35638] hover:underline"
          >
            <span>Discover Our Detailed Sourcing Standards</span>
            <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
          </Link>
        </div>
      </section>

      {/* ==========================================
          SECTION 07 — FEATURED SPICES
          ========================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-8 pb-4 border-b border-[#E7DED4]">
          <div>
            <span className="text-xs uppercase tracking-widest font-semibold text-[#B35638]">
              Cold-Ground Purity
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif font-semibold text-[#241611] mt-1">
              Essential Indian Spices
            </h2>
          </div>
          <Link
            href="/spices"
            className="mt-3 sm:mt-0 text-xs uppercase tracking-widest font-bold text-[#241611] hover:text-[#B35638] flex items-center"
          >
            <span>View All Spices</span>
            <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6">
          {featuredSpices.map((spice) => (
            <ProductCard key={spice.id} product={spice} />
          ))}
        </div>
      </section>

      {/* ==========================================
          SECTION 08 — SIGNATURE PRODUCT
          ========================================== */}
      {signatureProduct && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-[#241611] text-[#FAF7F2] border border-[#38241C] p-8 sm:p-12 lg:p-16 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-6 space-y-6">
              <div className="inline-flex items-center space-x-2 px-3 py-1 bg-[#C4924A]/20 text-[#C4924A] text-[11px] font-bold uppercase tracking-widest">
                <span>The Flagship Masala</span>
              </div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-semibold leading-tight text-white">
                Signature Regional Spice Blend
              </h2>
              <p className="text-xs text-[#C4924A] font-medium tracking-wider uppercase">
                {signatureProduct.localName}
              </p>
              <p className="text-xs sm:text-sm text-[#E8DFD5] leading-relaxed font-light">
                Our crowning small-batch masala crafted from an authentic generational Deccan recipe.
                Every spice is roasted individually at specific temperatures on cast iron griddles before
                being coarsely stone-ground together. Infuses daily millet bowls, hot rice with ghee, and
                vegetable curries with deep roasted aroma.
              </p>

              <div className="pt-2 flex items-center space-x-6 text-xs text-[#C4924A]">
                <div>
                  <span className="block font-bold text-white text-base">Cast-Iron</span>
                  <span>Slow-Roasted</span>
                </div>
                <div className="h-8 w-px bg-[#38241C]" />
                <div>
                  <span className="block font-bold text-white text-base">Stone-Crushed</span>
                  <span>Coarse Texture</span>
                </div>
                <div className="h-8 w-px bg-[#38241C]" />
                <div>
                  <span className="block font-bold text-white text-base">Zero Additives</span>
                  <span>100% Pure Herbs</span>
                </div>
              </div>

              <div className="pt-4 flex flex-wrap gap-4">
                <Link
                  href={`/products/${signatureProduct.slug}`}
                  className="px-8 py-3.5 bg-[#B35638] hover:bg-[#9E462A] text-white text-xs uppercase tracking-widest font-semibold transition-colors"
                >
                  Order Signature Blend
                </Link>
              </div>
            </div>

            <div className="lg:col-span-6 relative aspect-square w-full bg-[#38241C] overflow-hidden border border-[#4A342B]">
              <Image
                src={signatureProduct.images[0]}
                alt={signatureProduct.name}
                fill
                className="object-cover"
              />
            </div>
          </div>
        </section>
      )}

      {/* ==========================================
          SECTION 09 — HOW TO USE / RECIPES
          ========================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-8 pb-4 border-b border-[#E7DED4]">
          <div>
            <span className="text-xs uppercase tracking-widest font-semibold text-[#B35638]">
              From Grain to Table
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif font-semibold text-[#241611] mt-1">
              Everyday Indian Kitchen Recipes
            </h2>
          </div>
          <Link
            href="/recipes"
            className="mt-3 sm:mt-0 text-xs uppercase tracking-widest font-bold text-[#241611] hover:text-[#B35638] flex items-center"
          >
            <span>View All Recipes</span>
            <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {recipes.slice(0, 3).map((recipe) => (
            <Link
              key={recipe.id}
              href={`/recipes/${recipe.slug}`}
              className="group bg-white border border-[#E7DED4] hover:border-[#B35638] transition-all flex flex-col h-full"
            >
              <div className="relative aspect-16/10 w-full bg-[#F5EFEB] overflow-hidden">
                <Image
                  src={recipe.image}
                  alt={recipe.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-3 left-3 bg-[#241611] text-white text-[10px] uppercase font-bold tracking-wider px-2.5 py-1">
                  {recipe.category}
                </span>
              </div>
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-base font-serif font-semibold text-[#241611] group-hover:text-[#B35638] transition-colors">
                    {recipe.title}
                  </h3>
                  {recipe.localName && (
                    <p className="text-xs text-[#6B5B52] mt-0.5">{recipe.localName}</p>
                  )}
                  <p className="text-xs text-[#7A6B62] mt-2 line-clamp-2 leading-relaxed">
                    {recipe.description}
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-[#F0E8DF] flex items-center justify-between text-xs text-[#8C7A70]">
                  <span className="flex items-center">
                    <Clock className="w-3.5 h-3.5 mr-1" /> {recipe.cookTime}
                  </span>
                  <span className="font-medium text-[#B35638]">
                    {recipe.difficulty}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ==========================================
          SECTION 10 — CUSTOMER REVIEWS (AUTHENTIC PLACEHOLDER)
          ========================================== */}
      <section className="bg-[#FAF7F2] border-y border-[#E7DED4] py-14">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-4">
          <span className="text-xs uppercase tracking-widest font-semibold text-[#B35638]">
            Customer Experience
          </span>
          <h2 className="text-2xl sm:text-3xl font-serif font-semibold text-[#241611]">
            Verified Batch Reviews
          </h2>
          <div className="bg-white border border-[#E7DED4] p-8 max-w-2xl mx-auto space-y-3">
            <p className="text-xs font-semibold uppercase tracking-wider text-[#6B5B52]">
              [TRANSPARENCY NOTE: REAL REVIEWS ONBOARDING]
            </p>
            <p className="text-xs text-[#6B5B52] leading-relaxed">
              We do not publish fabricated testimonials or automated five-star ratings.
              Authentic reviews from verified order batches are currently being onboarded as early customers
              complete their kitchen tests.
            </p>
            <div className="pt-2">
              <Link
                href="/contact"
                className="text-xs font-semibold text-[#B35638] hover:underline"
              >
                Have you cooked with our batch? Share your feedback with our kitchen team →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ==========================================
          SECTION 11 — INSTAGRAM / SOCIAL
          ========================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs uppercase tracking-widest font-semibold text-[#B35638]">
            Kitchen Chronicles
          </span>
          <h2 className="text-2xl sm:text-3xl font-serif font-semibold text-[#241611] mt-1">
            Follow The Journey
          </h2>
          <p className="text-xs text-[#6B5B52] mt-2">
            Recipes, grain harvests, and daily cooking rituals on Instagram{' '}
            <a
              href={brandConfig.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#B35638] font-semibold hover:underline"
            >
              {brandConfig.instagramHandle}
            </a>
          </p>
        </div>

        {/* 4-Image Editorial Social Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="relative aspect-square bg-[#F5EFEB] overflow-hidden group">
            <Image
              src="/images/recipes/foxtail-millet-upma.jpg"
              alt="Millet breakfast preparation"
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-[#241611]/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
              <InstagramIcon className="w-6 h-6" />
            </div>
          </div>
          <div className="relative aspect-square bg-[#F5EFEB] overflow-hidden group">
            <Image
              src="/images/products/pure-red-chilli-powder.jpg"
              alt="Whole and ground spices"
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-[#241611]/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
              <InstagramIcon className="w-6 h-6" />
            </div>
          </div>
          <div className="relative aspect-square bg-[#F5EFEB] overflow-hidden group">
            <Image
              src="/images/products/pure-cumin-seeds.jpg"
              alt="Raw grain harvested"
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-[#241611]/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
              <InstagramIcon className="w-6 h-6" />
            </div>
          </div>
          <div className="relative aspect-square bg-[#F5EFEB] overflow-hidden group">
            <Image
              src="/images/products/pure-black-peppercorns.jpg"
              alt="Malabar bold black pepper"
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-[#241611]/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
              <InstagramIcon className="w-6 h-6" />
            </div>
          </div>
        </div>

        <div className="text-center mt-6">
          <a
            href={brandConfig.instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center space-x-2 text-xs uppercase tracking-widest font-semibold px-6 py-3 border border-[#241611] text-[#241611] hover:bg-[#241611] hover:text-white transition-colors"
          >
            <InstagramIcon className="w-4 h-4" />
            <span>Follow us on Instagram</span>
          </a>
        </div>
      </section>

      {/* ==========================================
          SECTION 12 — NEWSLETTER SIGNUP
          ========================================== */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="bg-[#F5EFEB] border border-[#E7DED4] p-8 sm:p-12 text-center space-y-4">
          <span className="text-xs uppercase tracking-widest font-semibold text-[#B35638]">
            The Traditional Kitchen Guild
          </span>
          <h2 className="text-2xl sm:text-3xl font-serif font-semibold text-[#241611]">
            Recipes, harvests, and stories from our kitchen.
          </h2>
          <p className="text-xs sm:text-sm text-[#6B5B52] max-w-lg mx-auto">
            Join our private community of home cooks rediscovering traditional Indian grains and unadulterated spices.
            No spam, only thoughtful seasonal updates.
          </p>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              alert('Thank you for subscribing to our kitchen updates.');
            }}
            className="max-w-md mx-auto pt-2 flex flex-col sm:flex-row gap-2"
          >
            <input
              type="email"
              required
              placeholder="Enter your email address"
              className="flex-1 bg-white border border-[#E7DED4] py-3 px-4 text-xs text-[#241611] placeholder-[#9E8E84] focus:outline-none focus:border-[#B35638]"
            />
            <button
              type="submit"
              className="px-6 py-3 bg-[#241611] hover:bg-[#B35638] text-white text-xs uppercase tracking-widest font-semibold transition-colors"
            >
              Join the Community
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}
