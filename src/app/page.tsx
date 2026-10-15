'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { products } from '@/data/products';
import { ProductCard } from '@/components/product/ProductCard';
import {
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Award,
  Sparkles,
  Search,
  Sun,
  Droplets,
} from 'lucide-react';

const heritageMillets = [
  {
    telugu: 'కొర్రలు',
    english: 'Foxtail Millet',
    botanical: 'Setaria italica',
    slug: 'korralu-foxtail-millet',
    benefits: 'Rich in dietary fiber and slow-release complex carbs. Cooks into a light, fluffy daily rice alternative.',
    tag: 'Daily Rice Staple',
    color: '#354C36',
  },
  {
    telugu: 'సామలు',
    english: 'Little Millet',
    botanical: 'Panicum sumatrense',
    slug: 'samalu-little-millet',
    benefits: 'Smallest grain, cooks in 12 minutes. Celebrated for gentle digestive comfort, idli and fermented dosa batter.',
    tag: 'Tender & Fast Cooking',
    color: '#C47B4B',
  },
  {
    telugu: 'అరికెలు',
    english: 'Kodo Millet',
    botanical: 'Paspalum scrobiculatum',
    slug: 'arikelu-kodo-millet',
    benefits: 'High polyphenol antioxidants and low glycemic index. Distinct reddish-brown hull for hearty stews & pongal.',
    tag: 'Low Glycemic Index',
    color: '#354C36',
  },
  {
    telugu: 'ఊదలు',
    english: 'Barnyard Millet',
    botanical: 'Echinochloa esculenta',
    slug: 'udalu-barnyard-millet',
    benefits: 'High bioavailable iron and zinc. The lightest millet on the palate, perfect for fragrant vegetable pulaos.',
    tag: 'Iron & Zinc Rich',
    color: '#C47B4B',
  },
  {
    telugu: 'రాగులు',
    english: 'Finger Millet',
    botanical: 'Eleusine coracana',
    slug: 'ragi-finger-millet',
    benefits: 'Millennia-old calcium powerhouse (344mg/100g). Essential for traditional Ragi Mudde, rotis, and breakfast malt.',
    tag: 'Natural Calcium',
    color: '#354C36',
  },
  {
    telugu: 'జొన్నలు',
    english: 'White Sorghum',
    botanical: 'Sorghum bicolor',
    slug: 'jowar-sorghum',
    benefits: 'Drought-hardy, naturally gluten-free grain yielding soft, wholesome hand-patted Jonna Rotte (flatbreads).',
    tag: 'Gluten-Free Flatbreads',
    color: '#C47B4B',
  },
];

const dailyRoutine = [
  {
    time: '07:30 AM',
    meal: 'Morning Tiffin',
    grain: 'Samalu (Little Millet)',
    title: 'Fermented Soft Idlis & Crisp Dosas',
    desc: 'Light on the digestion, rich in natural probiotics and B-vitamins for a calm, energizing start.',
    icon: Sun,
  },
  {
    time: '01:00 PM',
    meal: 'Midday Meal',
    grain: 'Korralu (Foxtail Millet)',
    title: 'Fluffy Rice Substitute with Pappu & Rasam',
    desc: 'Slow carbohydrate release that prevents post-lunch sluggishness and keeps you satiated for hours.',
    icon: Sparkles,
  },
  {
    time: '08:00 PM',
    meal: 'Evening Supper',
    grain: 'Ragi (Finger Millet)',
    title: 'Traditional Ragi Sankati or Vegetable Soup',
    desc: 'High natural calcium and calming amino acids for soothing sleep and overnight cellular recovery.',
    icon: Droplets,
  },
];

const journeySteps = [
  {
    step: '01',
    title: 'Farmer Procurement',
    telugu: 'రైతు క్లస్టర్ల సేకరణ',
    description:
      'Grown in rain-fed Deccan drylands by generational farmer clusters without synthetic pesticides or chemical boosters.',
  },
  {
    step: '02',
    title: 'Multi-Stage Cleaning',
    telugu: 'నాణ్యత పరిశీలన',
    description:
      'Air-aspirated and optical stone-separated to guarantee 100% foreign-matter-free, immaculately clean whole grains.',
  },
  {
    step: '03',
    title: 'Minimal De-Husking',
    telugu: 'సాంప్రదాయ సంవిధానం',
    description:
      'Gentle mechanical hulling preserves the natural aleurone bran coat, essential fiber, and volatile germ nutrients.',
  },
  {
    step: '04',
    title: 'Aroma-Barrier Pack',
    telugu: 'పరిశుభ్రమైన ప్యాకింగ్',
    description:
      'Packed in certified food-grade moisture-barrier pouches that seal in harvest freshness without toxic chemical fumigants.',
  },
  {
    step: '05',
    title: 'Doorstep Transparency',
    telugu: 'మీ వంటగదికి నేరుగా',
    description:
      'Delivered straight to your home with verifiable lot numbers, harvest district data, and NABL lab clearance.',
  },
];

export default function HomePage() {
  const [activeStapleTab, setActiveStapleTab] = useState<'all' | 'millets' | 'spices' | 'combos'>('all');

  // Filter products for "Choose your staple" section
  const filteredProducts = products.filter((p) => {
    if (activeStapleTab === 'millets') return p.category === 'millets';
    if (activeStapleTab === 'spices') return p.category === 'spices' || p.category === 'masalas';
    if (activeStapleTab === 'combos') return p.category === 'combos';
    return p.bestseller || p.category === 'millets';
  }).slice(0, 4);

  // Spices collection
  const spiceProducts = products.filter((p) => p.category === 'spices' || p.category === 'masalas').slice(0, 3);
  // Combos
  const comboProducts = products.filter((p) => p.category === 'combos');

  return (
    <div className="bg-[#F8F4EA] text-[#292B25] space-y-20 sm:space-y-28 pb-24">
      {/* =========================================================================
          SECTION 01 — EDITORIAL HERO (MATCHING REFERENCE VIDEO 0.0s - 2.0s)
          ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6">
        <div className="relative rounded-[16px] sm:rounded-[24px] overflow-hidden min-h-[580px] sm:min-h-[660px] flex items-center border border-[#E7D8B8] shadow-[0_4px_24px_rgba(41,43,37,0.06)]">
          {/* Background Image Stage */}
          <div className="absolute inset-0 z-0">
            <Image
              src="/images/showcase/hero-kitchen.jpg"
              alt="Authentic Indian kitchen with traditional grains, earthenware, and spices"
              fill
              priority
              loading="eager"
              className="object-cover object-center filter brightness-[0.88] contrast-[1.03]"
            />
            {/* Scrim Overlay for WCAG Contrast & Editorial Readability */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#172017]/95 via-[#172017]/75 to-transparent sm:w-4/5" />
          </div>

          {/* Hero Content Left */}
          <div className="relative z-10 max-w-2xl px-6 sm:px-12 lg:px-16 py-16 sm:py-20 text-[#F8F4EA] space-y-6">
            {/* Brand Pill Kicker (Matching video top badge) */}
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-[#E7D8B8] text-[11.5px] font-medium tracking-wide">
              <span className="w-2 h-2 rounded-full bg-[#E7D8B8]" />
              <span>✓ 100% UNPOLISHED DECCAN HARVEST · RAIN-FED CROPS</span>
            </div>

            {/* Editorial Heading (Matching reference composition) */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif text-white tracking-tight leading-[1.08]">
              Ancient grains, <br />
              <span className="font-serif italic font-normal text-[#E7D8B8]">
                extraordinary vitality.
              </span>
            </h1>

            {/* Supporting Copy */}
            <p className="text-sm sm:text-base text-[#DCD6C7] leading-relaxed max-w-lg font-normal">
              Stone-cleaned, unpolished native millets and cold-ground spices directly from Andhra dryland collectives to your home kitchen.
            </p>

            {/* CTA Pill Buttons & Trust Indicators */}
            <div className="pt-2 space-y-4">
              <div className="flex flex-wrap items-center gap-4">
                <Link
                  href="/millets"
                  className="inline-flex items-center justify-center px-7 py-3.5 bg-white hover:bg-[#F8F4EA] text-[#243725] text-[13.5px] font-semibold tracking-wide rounded-full transition-all shadow-md group"
                >
                  <span>Start With Millets</span>
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>

                <Link
                  href="/quality"
                  className="inline-flex items-center justify-center px-6 py-3.5 bg-transparent hover:bg-white/10 text-[#F8F4EA] text-[13px] font-medium rounded-full border border-white/30 backdrop-blur-sm transition-all"
                >
                  <span>Verify Lot Provenance</span>
                </Link>
              </div>

              {/* Sub-text micro features with checkmarks */}
              <div className="flex flex-wrap items-center gap-4 text-[11.5px] text-[#C8C2B3] pt-1">
                <span className="inline-flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#E7D8B8]" /> 100% Bran Intact
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#E7D8B8]" /> FSSAI Central Lic. 13626011000284
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#E7D8B8]" /> Free Delivery Above ₹999
                </span>
              </div>
            </div>
          </div>

          {/* Floating Product Provenance Pill Card (Matching video right-side card at 0.0s - 2.0s) */}
          <div className="hidden lg:block absolute bottom-8 right-8 z-10">
            <Link
              href="/products/korralu-foxtail-millet"
              className="group flex items-center gap-4 bg-white/95 backdrop-blur-md p-3.5 pr-6 rounded-[14px] border border-white/80 shadow-[0_8px_32px_rgba(0,0,0,0.18)] hover:bg-white transition-all max-w-sm"
            >
              <div className="relative w-16 h-16 rounded-[10px] overflow-hidden bg-[#FBF9F3] border border-[#E7D8B8] shrink-0">
                <Image
                  src="/images/products/korralu-foxtail-millet.jpg"
                  alt="Korralu Foxtail Millet"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform"
                />
              </div>
              <div className="space-y-0.5">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-[10px] font-data font-semibold text-[#C47B4B] uppercase tracking-wider">
                    Bestseller · Lot Verified
                  </span>
                  <Search className="w-3.5 h-3.5 text-[#5F6156] group-hover:text-[#354C36] transition-colors" />
                </div>
                <h4 className="text-[14px] font-semibold text-[#243725] leading-tight">
                  Korralu (Foxtail Millet)
                </h4>
                <p className="text-[11.5px] text-[#5F6156]">
                  Up to 8x more daily fiber · From ₹95
                </p>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 02 — "CHOOSE YOUR STAPLE" WITH EMBEDDED EDITORIAL CARD (VIDEO 2.0s - 5.0s)
          ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header with Left Pill Filters, Center Title, Right CTA */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-5 border-b border-[#E7D8B8] pb-5">
          {/* Left: Pill Filters */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
            <button
              onClick={() => setActiveStapleTab('all')}
              className={`px-4 py-1.5 rounded-full text-[12px] font-medium tracking-wide transition-all shrink-0 ${
                activeStapleTab === 'all'
                  ? 'bg-[#354C36] text-[#F8F4EA] shadow-xs'
                  : 'bg-white text-[#5F6156] border border-[#E7D8B8] hover:text-[#243725]'
              }`}
            >
              All Harvest
            </button>
            <button
              onClick={() => setActiveStapleTab('millets')}
              className={`px-4 py-1.5 rounded-full text-[12px] font-medium tracking-wide transition-all shrink-0 ${
                activeStapleTab === 'millets'
                  ? 'bg-[#354C36] text-[#F8F4EA] shadow-xs'
                  : 'bg-white text-[#5F6156] border border-[#E7D8B8] hover:text-[#243725]'
              }`}
            >
              Daily Rice Millets
            </button>
            <button
              onClick={() => setActiveStapleTab('spices')}
              className={`px-4 py-1.5 rounded-full text-[12px] font-medium tracking-wide transition-all shrink-0 ${
                activeStapleTab === 'spices'
                  ? 'bg-[#354C36] text-[#F8F4EA] shadow-xs'
                  : 'bg-white text-[#5F6156] border border-[#E7D8B8] hover:text-[#243725]'
              }`}
            >
              Cold-Ground Spices
            </button>
            <button
              onClick={() => setActiveStapleTab('combos')}
              className={`px-4 py-1.5 rounded-full text-[12px] font-medium tracking-wide transition-all shrink-0 ${
                activeStapleTab === 'combos'
                  ? 'bg-[#354C36] text-[#F8F4EA] shadow-xs'
                  : 'bg-white text-[#5F6156] border border-[#E7D8B8] hover:text-[#243725]'
              }`}
            >
              Pantry Boxes
            </button>
          </div>

          {/* Center: Editorial Heading */}
          <div className="text-center md:text-left">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif text-[#292B25] font-semibold">
              Choose your staple
            </h2>
          </div>

          {/* Right: Pill Button */}
          <Link
            href="/shop"
            className="inline-flex items-center justify-center self-start md:self-auto px-5 py-2 rounded-full bg-[#243725] text-[#F8F4EA] text-[12.5px] font-semibold hover:bg-[#354C36] transition-colors gap-1.5 shrink-0"
          >
            <span>Shop Catalogue</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* 4-Item Showcase Grid With Embedded Lifestyle Photography Card (Matching 2.0s - 5.0s) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 items-stretch">
          {/* Card 1: First Product */}
          {filteredProducts[0] && (
            <ProductCard product={filteredProducts[0]} />
          )}

          {/* Card 2: Embedded Editorial Storytelling Card (Identical to video layout composition) */}
          <div className="relative rounded-[8px] sm:rounded-[10px] overflow-hidden min-h-[360px] flex flex-col justify-between p-6 sm:p-7 border border-[#E7D8B8] shadow-xs group">
            <div className="absolute inset-0 z-0">
              <Image
                src="/images/showcase/cat-millets.jpg"
                alt="Deccan dryland regenerative agriculture"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500 filter brightness-[0.75]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1A281B]/95 via-[#1A281B]/40 to-transparent" />
            </div>

            <div className="relative z-10">
              <span className="text-[10px] font-data font-semibold text-[#E7D8B8] uppercase tracking-widest px-2.5 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 inline-block">
                Deccan Heritage
              </span>
            </div>

            <div className="relative z-10 space-y-3">
              <p className="text-white font-serif text-xl sm:text-2xl leading-snug font-medium">
                Traditional wisdom isn&apos;t mass-produced.
              </p>
              <p className="text-[12px] text-[#D8D2C2] leading-relaxed">
                Directly connected to rain-fed farmer clusters in Andhra Pradesh. Zero chemical polish.
              </p>
              <Link
                href="/about"
                className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-[#E7D8B8] hover:text-white transition-colors pt-1"
              >
                <span>Read our sourcing story</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Card 3: Second Product */}
          {filteredProducts[1] && (
            <ProductCard product={filteredProducts[1]} />
          )}

          {/* Card 4: Third Product */}
          {filteredProducts[2] && (
            <ProductCard product={filteredProducts[2]} />
          )}
        </div>
      </section>

      {/* =========================================================================
          SECTION 03 — EDITORIAL MANIFESTO (MATCHING REFERENCE VIDEO 5.0s - 6.0s)
          ========================================================================= */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-6 pt-4">
        {/* Subtle Pill Tag */}
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-white border border-[#E7D8B8] text-[11px] font-medium text-[#354C36] font-data uppercase tracking-wider shadow-2xs">
          <CheckCircle2 className="w-3.5 h-3.5 text-[#354C36]" />
          <span>About Our Agricultural Philosophy</span>
        </div>

        {/* Spacious, Centered Statement With Subtle Serif Emphasis */}
        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-[42px] font-serif text-[#243725] leading-[1.28] tracking-tight font-medium">
          We combine centuries of Deccan dryland wisdom with gentle stone cleaning to create honest daily staples that support steady energy, digestive ease, and sustainable biodiversity — without the guesswork.
        </h2>

        {/* Refined Pill Action Buttons */}
        <div className="pt-2 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/millets"
            className="inline-flex items-center justify-center px-7 py-3 bg-[#243725] hover:bg-[#354C36] text-[#F8F4EA] text-[13px] font-semibold rounded-full transition-all shadow-sm group"
          >
            <span>Get Started with Millets</span>
            <ArrowRight className="w-4 h-4 ml-1.5 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link
            href="/sourcing"
            className="inline-flex items-center justify-center px-6 py-3 bg-white hover:bg-[#FBF9F3] text-[#292B25] text-[13px] font-semibold rounded-full border border-[#E7D8B8] transition-all"
          >
            <span>Read Sourcing Story</span>
          </Link>
        </div>
      </section>

      {/* =========================================================================
          SECTION 04 — SECONDARY FULL-WIDTH LIFESTYLE HERO (MATCHING VIDEO 7.0s)
          ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-[16px] sm:rounded-[20px] overflow-hidden min-h-[440px] sm:min-h-[500px] flex items-center border border-[#E7D8B8] shadow-md">
          <div className="absolute inset-0 z-0">
            <Image
              src="/images/showcase/kitchen-mid-banner.jpg"
              alt="Kitchen culinary preparation with stone-cleaned Indian millets"
              fill
              className="object-cover object-center filter brightness-[0.82]"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#172017]/95 via-[#172017]/70 to-transparent sm:w-3/5" />
          </div>

          {/* Left Narrative Card */}
          <div className="relative z-10 max-w-xl p-6 sm:p-12 text-[#F8F4EA] space-y-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-[#E7D8B8] text-[11px] font-medium tracking-wide">
              <span>✓ DAILY KITCHEN NOURISHMENT</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-serif text-white font-semibold leading-tight">
              Fuel every day with unpolished, honest grains.
            </h2>

            <p className="text-sm text-[#DCD6C7] leading-relaxed">
              Slower carbohydrate breakdown, rich mineral density, and zero chemical polish. Savor the authentic aroma of native Indian agriculture.
            </p>

            <div className="pt-2">
              <Link
                href="/shop"
                className="inline-flex items-center justify-center px-6 py-3 bg-white hover:bg-[#F8F4EA] text-[#243725] text-[13px] font-semibold rounded-full transition-all shadow-sm"
              >
                <span>Find Your Daily Grain</span>
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </div>
          </div>

          {/* Floating Verified Quality Proof Card (Right Side as in video) */}
          <div className="hidden lg:block absolute bottom-8 right-8 z-10 bg-white/95 backdrop-blur-md p-4 rounded-[12px] border border-white/80 shadow-lg text-[#243725] space-y-1.5 max-w-xs">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#354C36]" />
              <span className="font-data text-[12px] font-semibold uppercase tracking-wider text-[#C47B4B]">
                NABL Certified Lot TC-8821
              </span>
            </div>
            <p className="text-[13px] font-semibold leading-snug">
              Up to 8x more fiber than polished rice.
            </p>
            <p className="text-[11px] text-[#5F6156]">
              Zero synthetic bleach · Zero chemical polish.
            </p>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 05 — DAILY WELLNESS ROUTINE & PROVENANCE (MATCHING VIDEO 8.0s - 9.0s)
          ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: Stat Block & Subtext */}
          <div className="lg:col-span-5 space-y-6">
            <span className="text-[11.5px] uppercase tracking-wider font-semibold text-[#C47B4B] block font-data">
              Daily Living Rhythm
            </span>

            <p className="text-sm text-[#5F6156] leading-relaxed">
              Supports metabolic comfort with low glycemic index, magnesium, bioavailable iron, and zinc.
            </p>

            {/* Stat Callout Block */}
            <div className="p-6 rounded-[12px] bg-white border border-[#E7D8B8] space-y-1 shadow-2xs">
              <div className="text-4xl sm:text-5xl font-serif font-bold text-[#243725]">
                4,800+
              </div>
              <p className="text-[13px] font-semibold text-[#292B25]">
                Families Nourished Across South India
              </p>
              <p className="text-[11.5px] text-[#8A8B80]">
                Supplying fresh unpolished grains directly to households every month.
              </p>
            </div>

            <div className="space-y-2">
              <Link
                href="/millets"
                className="inline-flex items-center justify-center px-6 py-3 rounded-full bg-[#243725] text-[#F8F4EA] text-[13px] font-semibold hover:bg-[#354C36] transition-all"
              >
                <span>Start Strong</span>
                <ArrowRight className="w-3.5 h-3.5 ml-2" />
              </Link>
              <p className="text-[11.5px] text-[#8A8B80]">
                One daily bowl, lasting metabolic comfort.
              </p>
            </div>
          </div>

          {/* Right Column: Routine Cards Collage */}
          <div className="lg:col-span-7 space-y-4">
            <h2 className="text-2xl sm:text-3xl font-serif text-[#292B25] font-semibold">
              Feel lighter from morning to night, every day.
            </h2>

            {/* Horizontal Timeline Tracker */}
            <div className="space-y-3 pt-2">
              {dailyRoutine.map((item) => {
                const IconComponent = item.icon;
                return (
                  <div
                    key={item.time}
                    className="p-4 sm:p-5 rounded-[10px] bg-white border border-[#E7D8B8] hover:border-[#354C36]/50 transition-all flex items-start gap-4 shadow-2xs group"
                  >
                    <div className="w-10 h-10 rounded-full bg-[#F8F4EA] border border-[#E7D8B8] flex items-center justify-center shrink-0 text-[#354C36]">
                      <IconComponent className="w-5 h-5" />
                    </div>
                    <div className="space-y-0.5 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[10px] font-data font-semibold text-[#C47B4B] uppercase tracking-wider">
                          {item.time} · {item.meal}
                        </span>
                        <span className="text-[11px] font-medium text-[#354C36] font-data">
                          {item.grain}
                        </span>
                      </div>
                      <h4 className="text-[14.5px] font-semibold text-[#292B25] group-hover:text-[#354C36] transition-colors">
                        {item.title}
                      </h4>
                      <p className="text-[12px] text-[#5F6156] leading-relaxed">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 06 — ICONIC STATISTIC & PERFORMANCE BAR (MATCHING VIDEO 10.0s - 12.0s)
          ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-[16px] sm:rounded-[24px] p-6 sm:p-10 lg:p-12 border border-[#E7D8B8] shadow-sm space-y-8">
          <div>
            <span className="text-[11.5px] uppercase tracking-wider font-semibold text-[#C47B4B] block font-data">
              ✓ Clinically &amp; Lab Verified Metrics
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif text-[#292B25] font-semibold mt-1">
              The smarter way to nourish every day.
            </h2>
          </div>

          {/* Visual Data Graphic: 80% / 8x Callout + Vertical Color Blocks */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-end">
            {/* Left Big Metric */}
            <div className="lg:col-span-5 space-y-2">
              <span className="text-[12px] uppercase tracking-wider text-[#5F6156] font-data font-medium">
                Whole-Grain Dietary Fiber
              </span>
              <div className="text-6xl sm:text-7xl lg:text-8xl font-serif font-bold text-[#243725] leading-none tracking-tight">
                8x
              </div>
              <p className="text-sm text-[#5F6156] leading-relaxed pt-1">
                Natural insoluble &amp; soluble dietary fiber compared to polished white rice, slowing starch digestion and feeding a thriving gut microbiome.
              </p>
            </div>

            {/* Right Contrasting Color Blocks (Matching Yellow & Green blocks in video 11.0s) */}
            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Warm Mustard/Terracotta Box */}
              <div className="bg-[#C47B4B] rounded-[14px] p-6 sm:p-8 text-white space-y-3 flex flex-col justify-between shadow-xs min-h-[220px]">
                <div className="text-4xl sm:text-5xl font-serif font-bold leading-none">
                  32%
                </div>
                <div>
                  <h4 className="text-[15px] font-semibold leading-snug">
                    Lower Glycemic Load
                  </h4>
                  <p className="text-[12px] text-white/90 leading-relaxed mt-1">
                    Slow and sustained carbohydrate breakdown to maintain balanced glucose levels throughout the workday.
                  </p>
                </div>
              </div>

              {/* Deep Heritage Green Box */}
              <div className="bg-[#354C36] rounded-[14px] p-6 sm:p-8 text-white space-y-3 flex flex-col justify-between shadow-xs min-h-[220px]">
                <div className="text-4xl sm:text-5xl font-serif font-bold leading-none">
                  68%
                </div>
                <div>
                  <h4 className="text-[15px] font-semibold leading-snug">
                    Less Irrigation Water
                  </h4>
                  <p className="text-[12px] text-[#E7D8B8] leading-relaxed mt-1">
                    Indigenous drought-hardy dryland grains that thrive on natural monsoon showers without depleting ground aquifers.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 07 — THE SIX SACRED CHIRU DHANYALU (TRADITIONAL MILLETS)
          ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#F3ECE0] rounded-[14px] sm:rounded-[20px] p-6 sm:p-10 lg:p-12 border border-[#E2D5B7]">
          <div className="max-w-2xl mb-8">
            <span className="text-[12px] uppercase tracking-wider font-semibold text-[#C47B4B] block font-data">
              Traditional Indian Agriculture
            </span>
            <h2 className="text-2xl sm:text-4xl font-serif text-[#292B25] mt-1 font-semibold leading-tight">
              The Six Sacred Chiru Dhanyalu
            </h2>
            <p className="text-xs sm:text-sm text-[#5F6156] mt-2 leading-relaxed">
              Cultivated for over 4,000 years in the Deccan plateau. Drought-resilient, naturally rich in dietary fiber, and minimally de-hulled to protect their living nutrition.
            </p>
          </div>

          {/* 6 Millets Cultural Matrix */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4">
            {heritageMillets.map((millet) => (
              <div
                key={millet.english}
                className="bg-white rounded-[10px] p-4 sm:p-5 border border-[#E7D8B8] hover:border-[#354C36]/50 transition-all flex flex-col justify-between shadow-2xs group"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <span className="font-telugu text-[17px] sm:text-[22px] text-[#C47B4B] font-semibold leading-tight">
                      {millet.telugu}
                    </span>
                    <span className="text-[9px] font-data uppercase tracking-wider px-2 py-0.5 rounded-[4px] bg-[#F8F4EA] text-[#5F6156] border border-[#E7D8B8] shrink-0 font-medium">
                      {millet.tag}
                    </span>
                  </div>

                  <h3 className="text-[15px] sm:text-[17px] font-semibold text-[#292B25] leading-snug">
                    {millet.english}
                  </h3>
                  <p className="text-[11px] text-[#8A8B80] italic font-serif">
                    {millet.botanical}
                  </p>

                  <p className="text-[11.5px] sm:text-[13px] text-[#5F6156] leading-relaxed mt-2.5">
                    {millet.benefits}
                  </p>
                </div>

                <div className="pt-3 mt-3 border-t border-[#F1E8D6] flex items-center justify-between text-[12px] sm:text-[13px]">
                  <Link
                    href={`/products/${millet.slug}`}
                    className="font-semibold text-[#354C36] hover:text-[#C47B4B] flex items-center gap-1 transition-colors"
                  >
                    <span>View Product Details</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                  <Link
                    href="/recipes"
                    className="text-[11px] text-[#8A8B80] hover:text-[#292B25] font-medium"
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
          SECTION 08 — 5-STAGE SOURCING & PROVENANCE PROTOCOL
          ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-10">
          <span className="text-[12px] uppercase tracking-wider font-semibold text-[#C47B4B] block font-data">
            The Dharvika Protocol
          </span>
          <h2 className="text-3xl sm:text-4xl font-serif text-[#292B25] mt-1 font-semibold">
            From Indian Drylands to Your Kitchen
          </h2>
          <p className="text-sm text-[#5F6156] mt-2">
            Every step is documented and managed to protect nutrient density, grain purity, and volatile aroma.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-3.5">
          {journeySteps.map((s, idx) => (
            <div
              key={s.step}
              className="bg-white rounded-[10px] p-5 border border-[#E7D8B8] flex flex-col justify-between relative group hover:border-[#354C36]/50 transition-all shadow-2xs"
            >
              <div>
                <span className="font-data text-2xl font-bold text-[#354C36]/20 group-hover:text-[#354C36] transition-colors block mb-2">
                  {s.step}
                </span>
                <h3 className="text-[15px] font-semibold text-[#292B25]">
                  {s.title}
                </h3>
                <p className="font-telugu text-[12px] text-[#C47B4B] mt-0.5">
                  {s.telugu}
                </p>
                <p className="text-[12px] text-[#5F6156] leading-relaxed mt-2.5">
                  {s.description}
                </p>
              </div>

              {idx < 4 && (
                <div className="hidden md:block absolute -right-2 top-1/2 -translate-y-1/2 z-10 w-4 h-4 rounded-full bg-[#F8F4EA] border border-[#E7D8B8] text-[9px] font-data text-[#8A8B80] flex items-center justify-center">
                  &rarr;
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* =========================================================================
          SECTION 09 — SINGLE-ORIGIN SPICES & MASALAS
          ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4 border-b border-[#E7D8B8] pb-4">
          <div>
            <span className="text-[12px] uppercase tracking-wider font-semibold text-[#C47B4B] block font-data">
              Cold-Ground Milling (&lt;40°C)
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif text-[#292B25] mt-1 font-semibold">
              Pure Spices &amp; Deccan Masalas
            </h2>
          </div>

          <Link
            href="/spices"
            className="text-[14px] font-semibold text-[#354C36] hover:text-[#C47B4B] flex items-center gap-1.5 transition-colors group"
          >
            <span>Explore All Spices</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {spiceProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* =========================================================================
          SECTION 10 — CURATED PANTRY COMBOS & VALUE BOXES
          ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#F3ECE0] rounded-[14px] sm:rounded-[20px] p-6 sm:p-10 border border-[#E2D5B7]">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-3 border-b border-[#E7D8B8] pb-4">
            <div>
              <span className="text-[12px] uppercase tracking-wider font-semibold text-[#C47B4B] block font-data">
                Thoughtfully Packaged
              </span>
              <h2 className="text-2xl sm:text-3xl font-serif text-[#292B25] mt-1 font-semibold">
                Curated Pantry Starter Kits
              </h2>
            </div>
            <p className="text-xs text-[#5F6156]">
              Bundled in food-grade moisture canisters and eco gift boxes with up to 24% in savings.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {comboProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 11 — TESTED RECIPES & CULINARY INSPIRATION
          ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-8 border-b border-[#E7D8B8] pb-4">
          <div>
            <span className="text-[12px] uppercase tracking-wider font-semibold text-[#C47B4B] block font-data">
              Culinary Heritage
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif text-[#292B25] mt-1 font-semibold">
              Tested South Indian Recipes
            </h2>
          </div>
          <Link
            href="/recipes"
            className="text-[14px] font-semibold text-[#354C36] hover:text-[#C47B4B] flex items-center gap-1"
          >
            <span>All Recipes</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5">
          <Link
            href="/recipes/foxtail-millet-upma"
            className="group bg-white rounded-[10px] overflow-hidden border border-[#E7D8B8] hover:border-[#354C36]/50 transition-all shadow-2xs flex flex-col justify-between"
          >
            <div>
              <div className="relative aspect-[16/10] bg-[#F8F4EA]">
                <Image
                  src="/images/recipes/foxtail-millet-upma.jpg"
                  alt="Foxtail millet upma with mustard seeds and curry leaves"
                  fill
                  className="object-cover card-image-zoom"
                />
              </div>
              <div className="p-4 space-y-1">
                <span className="text-[11px] font-data text-[#C47B4B] font-semibold uppercase">
                  Breakfast · 20 mins
                </span>
                <h3 className="text-[16px] font-semibold text-[#292B25] group-hover:text-[#354C36] transition-colors leading-snug">
                  Fluffy Korralu Upma
                </h3>
                <p className="text-[12px] text-[#5F6156] line-clamp-2 mt-0.5">
                  A nutrient-dense morning breakfast prepared with seasonal vegetables, ginger, and curry leaves.
                </p>
              </div>
            </div>
          </Link>

          <Link
            href="/recipes/crisp-little-millet-dosa"
            className="group bg-white rounded-[10px] overflow-hidden border border-[#E7D8B8] hover:border-[#354C36]/50 transition-all shadow-2xs flex flex-col justify-between"
          >
            <div>
              <div className="relative aspect-[16/10] bg-[#F8F4EA]">
                <Image
                  src="/images/showcase/kitchen-mid-banner.jpg"
                  alt="Crisp little millet dosa with coconut chutney"
                  fill
                  className="object-cover card-image-zoom"
                />
              </div>
              <div className="p-4 space-y-1">
                <span className="text-[11px] font-data text-[#C47B4B] font-semibold uppercase">
                  Traditional · Fermented
                </span>
                <h3 className="text-[16px] font-semibold text-[#292B25] group-hover:text-[#354C36] transition-colors leading-snug">
                  Golden Samalu Dosa
                </h3>
                <p className="text-[12px] text-[#5F6156] line-clamp-2 mt-0.5">
                  Crisp, paper-thin golden dosas made with a 3:1 ratio of Little Millet and whole Urad Dal.
                </p>
              </div>
            </div>
          </Link>

          <Link
            href="/recipes/kodo-millet-ven-pongal"
            className="group bg-white rounded-[10px] overflow-hidden border border-[#E7D8B8] hover:border-[#354C36]/50 transition-all shadow-2xs flex flex-col justify-between"
          >
            <div>
              <div className="relative aspect-[16/10] bg-[#F8F4EA]">
                <Image
                  src="/images/showcase/hero-kitchen.jpg"
                  alt="Comforting kodo millet ven pongal"
                  fill
                  className="object-cover card-image-zoom"
                />
              </div>
              <div className="p-4 space-y-1">
                <span className="text-[11px] font-data text-[#C47B4B] font-semibold uppercase">
                  Comfort Meal · 25 mins
                </span>
                <h3 className="text-[16px] font-semibold text-[#292B25] group-hover:text-[#354C36] transition-colors leading-snug">
                  Arikelu Ven Pongal
                </h3>
                <p className="text-[12px] text-[#5F6156] line-clamp-2 mt-0.5">
                  Soothing South Indian temple-style pongal tempered with crushed black pepper, cumin, and cashews.
                </p>
              </div>
            </div>
          </Link>
        </div>
      </section>

      {/* =========================================================================
          SECTION 12 — VERIFIED CUSTOMER REVIEWS (BIS IS 19000:2022 COMPLIANT)
          ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-[14px] p-6 sm:p-10 border border-[#E7D8B8]">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-6 border-b border-[#E7D8B8] gap-4">
            <div>
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-[#354C36]" />
                <span className="font-data text-[12px] font-semibold text-[#C47B4B] uppercase tracking-wider">
                  BIS IS 19000:2022 Verified Buyer Standards
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-serif text-[#292B25] mt-1 font-semibold">
                Quiet Notes from Real Kitchens
              </h2>
            </div>
            <Link
              href="/account/reviews"
              className="text-[13px] font-semibold text-[#354C36] hover:text-[#C47B4B] underline underline-offset-4"
            >
              Submit review via Order ID &rarr;
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6">
            <div className="p-5 rounded-[10px] bg-[#F8F4EA] border border-[#E7D8B8] space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-[#292B25] text-[14px]">S. Reddy</span>
                <span className="text-[10px] bg-[#E7D8B8]/50 text-[#354C36] px-2 py-0.5 rounded-[4px] font-data font-medium">
                  Verified Order #DG10248
                </span>
              </div>
              <p className="text-[13px] text-[#5F6156] leading-relaxed italic">
                &ldquo;Remarkably stone-free and clean. We cook Korralu every morning without needing to sieve or hand-sort multiple times. Naturally fragrant.&rdquo;
              </p>
            </div>

            <div className="p-5 rounded-[10px] bg-[#F8F4EA] border border-[#E7D8B8] space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-[#292B25] text-[14px]">Dr. R. Rao</span>
                <span className="text-[10px] bg-[#E7D8B8]/50 text-[#354C36] px-2 py-0.5 rounded-[4px] font-data font-medium">
                  Verified Order #DG10192
                </span>
              </div>
              <p className="text-[13px] text-[#5F6156] leading-relaxed italic">
                &ldquo;Authentic unpolished grains with natural bran layers intact. Truly low glycemic impact, excellent for balanced daily cooking.&rdquo;
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 13 — EDITORIAL BRAND COMMITMENT
          ========================================================================= */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 text-center pt-6 border-t border-[#E7D8B8]">
        <h3 className="text-xl sm:text-2xl font-serif text-[#292B25] font-medium">
          Dharvika Grains: Pure Chiru Dhanyalu for Contemporary Living
        </h3>
        <p className="text-xs sm:text-sm text-[#5F6156] leading-relaxed mt-2 max-w-2xl mx-auto">
          We work directly with dryland farming communities to bring genuine unpolished grains, single-origin spices, and cold-milled pantry essentials to Indian households without bleaching agents, synthetic polishes, or false claims.
        </p>
      </section>
    </div>
  );
}
