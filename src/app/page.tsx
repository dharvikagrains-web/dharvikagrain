'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { products } from '@/data/products';
import { ProductCard } from '@/components/product/ProductCard';
import {
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  MapPin,
  Calendar,
  Layers,
  Search,
} from 'lucide-react';

const heritageMillets = [
  {
    telugu: 'కొర్రలు',
    english: 'Foxtail Millet',
    slug: 'foxtail-millet-korralu',
    benefits: 'Rich in dietary fiber & slow-release carbs. Cooks fluffy like rice.',
    tag: 'Daily Staple',
  },
  {
    telugu: 'సామలు',
    english: 'Little Millet',
    slug: 'little-millet-samalu',
    benefits: 'Smallest grain, cooks in 12 minutes. Ideal for light idli & dosa.',
    tag: 'Light Digestion',
  },
  {
    telugu: 'అరికెలు',
    english: 'Kodo Millet',
    slug: 'kodo-millet-arikelu',
    benefits: 'High polyphenol antioxidants & low glycemic index. Great pongal base.',
    tag: 'Low GI',
  },
  {
    telugu: 'ఊదలు',
    english: 'Barnyard Millet',
    slug: 'barnyard-millet-udalu',
    benefits: 'Exceptional bioavailable iron & zinc. Excellent for fasting khichdi.',
    tag: 'High Iron',
  },
  {
    telugu: 'రాగులు',
    english: 'Finger Millet',
    slug: 'finger-millet-ragi',
    benefits: 'Highest natural plant-based calcium (344mg/100g). Perfect for mudde & porridge.',
    tag: 'Calcium Rich',
  },
  {
    telugu: 'జొన్నలు',
    english: 'Sorghum',
    slug: 'sorghum-jowar',
    benefits: 'Traditional gluten-free drought grain for soft, wholesome jolada rotis.',
    tag: 'Gluten-Free',
  },
];

const journeySteps = [
  {
    step: '01',
    title: 'Source',
    telugu: 'రైతు క్లస్టర్ల సేకరణ',
    description:
      'Grown in rain-fed Deccan drylands by partner farmer clusters using non-chemical traditional farming.',
  },
  {
    step: '02',
    title: 'Quality Check',
    telugu: 'నాణ్యత పరిశీలన',
    description:
      'Multi-stage gravity separation and grading to ensure 100% stone-free, foreign-matter-free clean grains.',
  },
  {
    step: '03',
    title: 'Process',
    telugu: 'సాంప్రదాయ సంవిధానం',
    description:
      'Gentle de-husking that retains 100% natural bran and aleurone layer; spices ground below 40°C.',
  },
  {
    step: '04',
    title: 'Pack',
    telugu: 'పరిశుభ్రమైన ప్యాకింగ్',
    description:
      'Food-grade moisture and aroma-barrier packaging that locks in freshness without artificial fumigants.',
  },
  {
    step: '05',
    title: 'Deliver',
    telugu: 'మీ వంటగదికి నేరుగా',
    description:
      'Dispatched directly to your kitchen with verifiable lot numbers and batch transparency.',
  },
];

export default function HomePage() {
  // Select top bestsellers for the primary shelf
  const bestsellers = products.filter((p) => p.bestseller || ['millet-korralu', 'spice-turmeric', 'millet-samalu', 'spice-red-chilli'].includes(p.id)).slice(0, 4);

  return (
    <div className="bg-[#FAF7F2] text-[#221814] space-y-16 sm:space-y-24 pb-20">
      {/* =========================================================================
          SECTION 01 — EDITORIAL HERO
          ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6">
        <div className="relative rounded-[16px] overflow-hidden min-h-[560px] sm:min-h-[640px] flex items-center border border-[#E2D9CE] shadow-[0_2px_12px_rgba(0,0,0,0.04)]">
          {/* Background Image Stage */}
          <div className="absolute inset-0 z-0">
            <Image
              src="/images/showcase/hero-kitchen.jpg"
              alt="Authentic Indian kitchen with traditional grains, earthenware, and spices"
              fill
              priority
              className="object-cover object-center filter brightness-[0.88] contrast-[1.02]"
            />
            {/* Scrim Overlay for WCAG-compliant Contrast */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#140E0A]/92 via-[#140E0A]/65 to-transparent sm:w-3/4" />
          </div>

          {/* Hero Content */}
          <div className="relative z-10 max-w-2xl px-6 sm:px-12 lg:px-16 py-16 sm:py-20 text-white space-y-6">
            {/* Brand Kicker */}
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur-md border border-white/20 rounded-[6px] text-[#FAF7F2] text-[12px] font-medium tracking-wide">
              <span className="w-2 h-2 rounded-full bg-[#7BB294]" />
              <span>Dharvika Grains · Single-Origin Chiru Dhanyalu & Spices</span>
            </div>

            {/* Editorial Heading */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif text-white tracking-tight leading-[1.12]">
              Traditional grains. <br />
              <span className="font-serif italic font-normal text-[#E8DFD3]">
                Authentic Indian flavours.
              </span>
            </h1>

            {/* Supporting Copy */}
            <p className="text-sm sm:text-base text-[#E2D7CC] leading-relaxed max-w-lg font-normal">
              Naturally grown across rain-fed Deccan drylands. 100% unpolished to protect natural bran, fiber, and trace minerals — brought with honest batch traceability straight to your kitchen.
            </p>

            {/* Dual Restrained CTAs */}
            <div className="pt-2 flex flex-wrap items-center gap-3 sm:gap-4">
              <Link
                href="/millets"
                className="inline-flex items-center justify-center px-6 py-3.5 bg-[#1A382B] hover:bg-[#132B21] text-white text-[14px] font-semibold rounded-[6px] transition-colors shadow-sm"
              >
                <span>Shop Millets</span>
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>

              <Link
                href="/spices"
                className="inline-flex items-center justify-center px-6 py-3.5 bg-white/90 hover:bg-white text-[#221814] text-[14px] font-semibold rounded-[6px] transition-colors border border-white/60 shadow-sm"
              >
                <span>Explore Spices</span>
              </Link>
            </div>

            {/* Trust Badges Bar */}
            <div className="pt-6 border-t border-white/15 grid grid-cols-2 sm:grid-cols-4 gap-3 text-[12px] text-[#D8CCC0]">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#7BB294] shrink-0" />
                <span>100% Unpolished</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#7BB294] shrink-0" />
                <span>Stone-Cleaned</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#7BB294] shrink-0" />
                <span>Cold-Milled Spices</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#7BB294] shrink-0" />
                <span>Batch Traceable</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 02 — BESTSELLING HARVEST SHELF
          ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4 border-b border-[#E2D9CE] pb-4">
          <div>
            <span className="text-[12px] uppercase tracking-wider font-semibold text-[#9E462A] block font-data">
              Single-Origin Harvest
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif text-[#221814] mt-1 font-semibold">
              Bestselling Staples
            </h2>
          </div>

          <Link
            href="/shop"
            className="text-[14px] font-semibold text-[#1A382B] hover:text-[#9E462A] flex items-center gap-1.5 transition-colors group"
          >
            <span>View All Products</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* 4-Column Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {bestsellers.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* =========================================================================
          SECTION 03 — EDITORIAL HERITAGE: ANCIENT GRAINS MATRIX (TELUGU & ENGLISH)
          ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#F4EFEA] rounded-[14px] p-6 sm:p-10 lg:p-12 border border-[#E2D9CE]">
          <div className="max-w-2xl mb-8">
            <span className="text-[12px] uppercase tracking-wider font-semibold text-[#9E462A] block font-data">
              Traditional Indian Agriculture
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif text-[#221814] mt-1 font-semibold">
              Ancient grains. A modern way of living.
            </h2>
            <p className="text-sm sm:text-base text-[#685950] mt-2 leading-relaxed">
              For thousands of years, Deccan farmers cultivated hardy drought-resilient Chiru Dhanyalu. We honour these heritage grains by keeping them unpolished and unbleached.
            </p>
          </div>

          {/* 6 Millets Cultural Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {heritageMillets.map((millet) => (
              <div
                key={millet.english}
                className="bg-white rounded-[10px] p-5 border border-[#E2D9CE] hover:border-[#1A382B]/40 transition-all flex flex-col justify-between shadow-[0_1px_3px_rgba(0,0,0,0.03)]"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <span className="font-telugu text-[19px] sm:text-[21px] text-[#9E462A] font-semibold block leading-tight">
                        {millet.telugu}
                      </span>
                      <h3 className="text-[16px] font-semibold text-[#221814] mt-0.5">
                        {millet.english}
                      </h3>
                    </div>
                    <span className="text-[10px] font-data uppercase tracking-wider px-2 py-0.5 rounded-[4px] bg-[#FAF7F2] text-[#685950] border border-[#E2D9CE]">
                      {millet.tag}
                    </span>
                  </div>

                  <p className="text-[13px] text-[#685950] leading-relaxed mt-2">
                    {millet.benefits}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-[#F0EAE1] flex items-center justify-between">
                  <Link
                    href={`/products/${millet.slug}`}
                    className="text-[13px] font-semibold text-[#1A382B] hover:text-[#9E462A] flex items-center gap-1 transition-colors"
                  >
                    <span>View Grain</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                  <Link
                    href="/recipes"
                    className="text-[12px] text-[#8C7A70] hover:text-[#221814]"
                  >
                    Recipes &rarr;
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 04 — VISUAL JOURNEY: 01 SOURCE TO 05 DELIVER
          ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-10">
          <span className="text-[12px] uppercase tracking-wider font-semibold text-[#9E462A] block font-data">
            The Dharvika Protocol
          </span>
          <h2 className="text-3xl sm:text-4xl font-serif text-[#221814] mt-1 font-semibold">
            From Indian Drylands to Your Kitchen
          </h2>
          <p className="text-sm text-[#685950] mt-2">
            Every step is documented and managed to protect nutrient density, grain purity, and aroma.
          </p>
        </div>

        {/* 5-Step Editorial Journey */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {journeySteps.map((s, idx) => (
            <div
              key={s.step}
              className="bg-white rounded-[10px] p-5 border border-[#E2D9CE] flex flex-col justify-between relative group hover:border-[#1A382B]/50 transition-all shadow-[0_1px_3px_rgba(0,0,0,0.03)]"
            >
              <div>
                <span className="font-data text-2xl font-bold text-[#1A382B]/25 group-hover:text-[#1A382B] transition-colors block mb-2">
                  {s.step}
                </span>
                <h3 className="text-[16px] font-semibold text-[#221814]">
                  {s.title}
                </h3>
                <p className="font-telugu text-[12px] text-[#9E462A] mt-0.5">
                  {s.telugu}
                </p>
                <p className="text-[12px] text-[#685950] leading-relaxed mt-3">
                  {s.description}
                </p>
              </div>

              {idx < 4 && (
                <div className="hidden md:block absolute -right-2.5 top-1/2 -translate-y-1/2 z-10 w-5 h-5 rounded-full bg-[#FAF7F2] border border-[#E2D9CE] text-[10px] font-data text-[#8C7A70] flex items-center justify-center">
                  &rarr;
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* =========================================================================
          SECTION 05 — AUTHENTIC BATCH TRACEABILITY HIGHLIGHT
          ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#1A382B] rounded-[14px] p-6 sm:p-10 lg:p-12 text-white grid grid-cols-1 lg:grid-cols-12 gap-8 items-center shadow-md">
          <div className="lg:col-span-6 space-y-4">
            <span className="text-[12px] uppercase tracking-wider font-semibold text-[#A3C7B5] block font-data">
              Real Transparency · Real Provenance
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif text-white font-semibold leading-tight">
              Know where your food was harvested.
            </h2>
            <p className="text-sm sm:text-base text-[#D4E3DB] leading-relaxed font-normal">
              Commercial grains pass through dozens of middlemen where old and new harvests are mixed. Dharvika maintains segregated lot traceability. Every package links to its harvest district, processing run, and purity checks.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-4">
              <Link
                href="/quality"
                className="inline-flex items-center justify-center px-5 py-3 bg-[#FAF7F2] hover:bg-white text-[#1A382B] text-[13px] font-semibold rounded-[6px] transition-colors"
              >
                <span>Read Our Quality Standards</span>
                <ArrowRight className="w-4 h-4 ml-1.5" />
              </Link>
              <Link
                href="/sourcing"
                className="text-[13px] font-semibold text-white/90 hover:text-white underline underline-offset-4"
              >
                Farm Sourcing Network &rarr;
              </Link>
            </div>
          </div>

          {/* Sample Traceability Passport Block */}
          <div className="lg:col-span-6">
            <div className="bg-white/10 backdrop-blur-md rounded-[10px] p-5 sm:p-6 border border-white/20 text-white space-y-4">
              <div className="flex items-center justify-between border-b border-white/15 pb-3">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-[#86EFAC]" />
                  <span className="font-data text-[13px] font-semibold">
                    Sample Batch Passport
                  </span>
                </div>
                <span className="font-data text-[12px] bg-white/20 px-2 py-0.5 rounded-[4px]">
                  LOT #DH-FX-2024-09
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-[12px]">
                <div className="bg-black/20 p-2.5 rounded-[6px]">
                  <span className="text-[#A3C7B5] block text-[10px] uppercase font-data">Crop & Grain</span>
                  <span className="font-semibold text-white">Foxtail Millet (కొర్రలు)</span>
                </div>
                <div className="bg-black/20 p-2.5 rounded-[6px]">
                  <span className="text-[#A3C7B5] block text-[10px] uppercase font-data">Harvest Cluster</span>
                  <span className="font-semibold text-white">Kurnool District, AP</span>
                </div>
                <div className="bg-black/20 p-2.5 rounded-[6px]">
                  <span className="text-[#A3C7B5] block text-[10px] uppercase font-data">De-Husking Method</span>
                  <span className="font-semibold text-white">Cold Rubber-Roll De-husker</span>
                </div>
                <div className="bg-black/20 p-2.5 rounded-[6px]">
                  <span className="text-[#A3C7B5] block text-[10px] uppercase font-data">Moisture Checked</span>
                  <span className="font-semibold text-white">10.8% (Target &lt; 12%)</span>
                </div>
              </div>

              <p className="text-[11px] text-[#D4E3DB]/80 pt-1">
                *Enter the batch code printed on your product pouch on our Traceability portal to view lot origin.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 06 — EXPLORE CATEGORIES (4 CRISP CARDS)
          ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-8 border-b border-[#E2D9CE] pb-4">
          <div>
            <span className="text-[12px] uppercase tracking-wider font-semibold text-[#9E462A] block font-data">
              Purity in Every Shelf
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif text-[#221814] mt-1 font-semibold">
              Explore Our Categories
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Card 1: Millets */}
          <Link
            href="/millets"
            className="group relative aspect-[4/5] rounded-[12px] overflow-hidden border border-[#E2D9CE] flex flex-col justify-end p-5 text-white"
          >
            <Image
              src="/images/showcase/cat-millets.jpg"
              alt="Earthenware bowl with unpolished raw millets"
              fill
              className="object-cover card-image-zoom"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#140F0A]/90 via-[#140F0A]/35 to-transparent" />
            <div className="relative z-10 space-y-1.5">
              <span className="text-[11px] font-data uppercase tracking-wider text-[#E8DFD3] block">
                Chiru Dhanyalu
              </span>
              <h3 className="text-lg font-serif font-semibold text-white">
                Unpolished Millets
              </h3>
              <p className="text-[12px] text-[#D8CCC0] line-clamp-2">
                Foxtail, Little, Kodo, Barnyard, Finger & Sorghum grains.
              </p>
              <div className="pt-2">
                <span className="text-[12px] font-semibold text-[#86EFAC] group-hover:underline flex items-center gap-1">
                  <span>Explore Millets</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          </Link>

          {/* Card 2: Spices */}
          <Link
            href="/spices"
            className="group relative aspect-[4/5] rounded-[12px] overflow-hidden border border-[#E2D9CE] flex flex-col justify-end p-5 text-white"
          >
            <Image
              src="/images/showcase/cat-spices.jpg"
              alt="Brass bowls filled with rich South Indian spices"
              fill
              className="object-cover card-image-zoom"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#140F0A]/90 via-[#140F0A]/35 to-transparent" />
            <div className="relative z-10 space-y-1.5">
              <span className="text-[11px] font-data uppercase tracking-wider text-[#E8DFD3] block">
                Pure Masala
              </span>
              <h3 className="text-lg font-serif font-semibold text-white">
                Single-Origin Spices
              </h3>
              <p className="text-[12px] text-[#D8CCC0] line-clamp-2">
                Salem Lakadong turmeric, Guntur chilli, and roasted spice blends.
              </p>
              <div className="pt-2">
                <span className="text-[12px] font-semibold text-[#86EFAC] group-hover:underline flex items-center gap-1">
                  <span>Explore Spices</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          </Link>

          {/* Card 3: Oils */}
          <Link
            href="/shop?category=oils"
            className="group relative aspect-[4/5] rounded-[12px] overflow-hidden border border-[#E2D9CE] flex flex-col justify-end p-5 text-white"
          >
            <Image
              src="/images/showcase/cat-oils.jpg"
              alt="Cold pressed groundnut and sesame oil"
              fill
              className="object-cover card-image-zoom"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#140F0A]/90 via-[#140F0A]/35 to-transparent" />
            <div className="relative z-10 space-y-1.5">
              <span className="text-[11px] font-data uppercase tracking-wider text-[#E8DFD3] block">
                Wood Pressed
              </span>
              <h3 className="text-lg font-serif font-semibold text-white">
                Traditional Oils
              </h3>
              <p className="text-[12px] text-[#D8CCC0] line-clamp-2">
                Cold-pressed below 45°C without chemical solvent extraction.
              </p>
              <div className="pt-2">
                <span className="text-[12px] font-semibold text-[#86EFAC] group-hover:underline flex items-center gap-1">
                  <span>Explore Oils</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          </Link>

          {/* Card 4: Flours & Rava */}
          <Link
            href="/shop?category=flours"
            className="group relative aspect-[4/5] rounded-[12px] overflow-hidden border border-[#E2D9CE] flex flex-col justify-end p-5 text-white"
          >
            <Image
              src="/images/showcase/cat-flours.jpg"
              alt="Stone ground millet flour in jute sack"
              fill
              className="object-cover card-image-zoom"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#140F0A]/90 via-[#140F0A]/35 to-transparent" />
            <div className="relative z-10 space-y-1.5">
              <span className="text-[11px] font-data uppercase tracking-wider text-[#E8DFD3] block">
                Stone Ground
              </span>
              <h3 className="text-lg font-serif font-semibold text-white">
                Millet Flours & Rava
              </h3>
              <p className="text-[12px] text-[#D8CCC0] line-clamp-2">
                Freshly milled coarse and fine flours for rotis, dosas, and upma.
              </p>
              <div className="pt-2">
                <span className="text-[12px] font-semibold text-[#86EFAC] group-hover:underline flex items-center gap-1">
                  <span>Explore Flours</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          </Link>
        </div>
      </section>

      {/* =========================================================================
          SECTION 07 — EDITORIAL STORY FEATURE: STONE MILLING DIFFERENCE
          ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#F4EFEA] rounded-[14px] p-6 sm:p-10 lg:p-12 border border-[#E2D9CE] grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-5 space-y-4">
            <span className="text-[12px] uppercase tracking-wider font-semibold text-[#9E462A] block font-data">
              Traditional Craft
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif text-[#221814] font-semibold leading-tight">
              Why unpolished grains cook and taste different.
            </h2>
            <p className="text-sm text-[#685950] leading-relaxed">
              Industrial grain processing shears away the brown outer bran coat to prolong shelf life indefinitely on supermarket aisles. In doing so, up to 75% of dietary fiber, B-vitamins, and essential minerals are stripped away.
            </p>
            <p className="text-sm text-[#685950] leading-relaxed">
              Dharvika grains are minimally de-hulled. You get whole nutrition, natural nutty fragrance, and a light, easily digestible texture in every meal.
            </p>
            <div className="pt-2">
              <Link
                href="/about"
                className="inline-flex items-center gap-1.5 text-[14px] font-semibold text-[#1A382B] hover:text-[#9E462A] transition-colors"
              >
                <span>Read Our Sourcing & Milling Philosophy</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          <div className="lg:col-span-7 relative aspect-[4/3] rounded-[12px] overflow-hidden border border-[#E2D9CE]">
            <Image
              src="/images/showcase/bestseller-dish.jpg"
              alt="Steaming hot traditional foxtail millet pulao cooked with authentic farm spices"
              fill
              className="object-cover"
            />
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 08 — RECIPE & KITCHEN INSPIRATION
          ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-8 border-b border-[#E2D9CE] pb-4">
          <div>
            <span className="text-[12px] uppercase tracking-wider font-semibold text-[#9E462A] block font-data">
              In the Kitchen
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif text-[#221814] mt-1 font-semibold">
              Tested South Indian Recipes
            </h2>
          </div>
          <Link
            href="/recipes"
            className="text-[14px] font-semibold text-[#1A382B] hover:text-[#9E462A] flex items-center gap-1"
          >
            <span>All Recipes</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <Link
            href="/recipes/foxtail-millet-upma"
            className="group bg-white rounded-[10px] overflow-hidden border border-[#E2D9CE] hover:border-[#1A382B]/40 transition-all shadow-[0_1px_3px_rgba(0,0,0,0.03)]"
          >
            <div className="relative aspect-[16/10] bg-[#FAF7F2]">
              <Image
                src="/images/recipes/foxtail-millet-upma.jpg"
                alt="Foxtail millet upma with mustard seeds and curry leaves"
                fill
                className="object-cover card-image-zoom"
              />
            </div>
            <div className="p-4 space-y-1">
              <span className="text-[11px] font-data text-[#9E462A] font-semibold uppercase">
                Breakfast · 20 mins
              </span>
              <h3 className="text-[16px] font-semibold text-[#221814] group-hover:text-[#1A382B] transition-colors">
                Fluffy Korralu Upma
              </h3>
              <p className="text-[12px] text-[#685950] line-clamp-2">
                A nutrient-dense morning breakfast prepared with seasonal vegetables, ginger, and curry leaves.
              </p>
            </div>
          </Link>

          <Link
            href="/recipes/crisp-little-millet-dosa"
            className="group bg-white rounded-[10px] overflow-hidden border border-[#E2D9CE] hover:border-[#1A382B]/40 transition-all shadow-[0_1px_3px_rgba(0,0,0,0.03)]"
          >
            <div className="relative aspect-[16/10] bg-[#FAF7F2]">
              <Image
                src="/images/showcase/kitchen-mid-banner.jpg"
                alt="Crisp little millet dosa with coconut chutney"
                fill
                className="object-cover card-image-zoom"
              />
            </div>
            <div className="p-4 space-y-1">
              <span className="text-[11px] font-data text-[#9E462A] font-semibold uppercase">
                Traditional · Fermented
              </span>
              <h3 className="text-[16px] font-semibold text-[#221814] group-hover:text-[#1A382B] transition-colors">
                Golden Samalu Dosa
              </h3>
              <p className="text-[12px] text-[#685950] line-clamp-2">
                Crisp, golden dosas made with a 3:1 ratio of Little Millet and Urad Dal.
              </p>
            </div>
          </Link>

          <Link
            href="/recipes/kodo-millet-ven-pongal"
            className="group bg-white rounded-[10px] overflow-hidden border border-[#E2D9CE] hover:border-[#1A382B]/40 transition-all shadow-[0_1px_3px_rgba(0,0,0,0.03)]"
          >
            <div className="relative aspect-[16/10] bg-[#FAF7F2]">
              <Image
                src="/images/showcase/hero-kitchen.jpg"
                alt="Comforting kodo millet ven pongal"
                fill
                className="object-cover card-image-zoom"
              />
            </div>
            <div className="p-4 space-y-1">
              <span className="text-[11px] font-data text-[#9E462A] font-semibold uppercase">
                Comfort Food · 25 mins
              </span>
              <h3 className="text-[16px] font-semibold text-[#221814] group-hover:text-[#1A382B] transition-colors">
                Arikelu Ven Pongal
              </h3>
              <p className="text-[12px] text-[#685950] line-clamp-2">
                Soothing South Indian temple-style pongal tempered with crushed black pepper, cumin, and cashews.
              </p>
            </div>
          </Link>
        </div>
      </section>

      {/* =========================================================================
          SECTION 09 — EDITORIAL BRAND COMMITMENT FOOTNOTE
          ========================================================================= */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 text-center pt-8 border-t border-[#E2D9CE]">
        <h3 className="text-xl sm:text-2xl font-serif text-[#221814] font-medium">
          Dharvika Grains: Pure Chiru Dhanyalu for Contemporary Living
        </h3>
        <p className="text-xs sm:text-sm text-[#685950] leading-relaxed mt-2 max-w-2xl mx-auto">
          We work directly with dryland farming communities to bring genuine unpolished grains, single-origin spices, and wood-pressed oils to Indian households without bleaching agents, synthetic polishes, or false claims.
        </p>
      </section>
    </div>
  );
}
