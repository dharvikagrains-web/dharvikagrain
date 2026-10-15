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
  Award,
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
  // Select top bestsellers
  const bestsellers = products.filter((p) => p.bestseller).slice(0, 4);
  // Spices collection
  const spiceProducts = products.filter((p) => p.category === 'spices' || p.category === 'masalas').slice(0, 3);
  // Combos
  const comboProducts = products.filter((p) => p.category === 'combos');

  return (
    <div className="bg-[#F8F4EA] text-[#292B25] space-y-20 sm:space-y-28 pb-24">
      {/* =========================================================================
          SECTION 01 — EDITORIAL HERO
          ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6">
        <div className="relative rounded-[12px] sm:rounded-[16px] overflow-hidden min-h-[580px] sm:min-h-[660px] flex items-center border border-[#E7D8B8] shadow-[0_2px_12px_rgba(41,43,37,0.04)]">
          {/* Background Image Stage */}
          <div className="absolute inset-0 z-0">
            <Image
              src="/images/showcase/hero-kitchen.jpg"
              alt="Authentic Indian kitchen with traditional grains, earthenware, and spices"
              fill
              priority
              loading="eager"
              className="object-cover object-center filter brightness-[0.85] contrast-[1.02]"
            />
            {/* Scrim Overlay for WCAG Contrast */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#172017]/95 via-[#172017]/75 to-transparent sm:w-4/5" />
          </div>

          {/* Hero Content */}
          <div className="relative z-10 max-w-2xl px-6 sm:px-12 lg:px-16 py-16 sm:py-20 text-[#F8F4EA] space-y-6">
            {/* Brand Kicker */}
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur-md border border-white/20 rounded-[4px] text-[#E7D8B8] text-[11.5px] font-medium tracking-wide">
              <span className="w-2 h-2 rounded-full bg-[#E7D8B8]" />
              <span>Dharvika Grains · Single-Origin Chiru Dhanyalu &amp; Pure Spices</span>
            </div>

            {/* Editorial Heading */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif text-white tracking-tight leading-[1.12]">
              Sacred grains of the Deccan. <br />
              <span className="font-serif italic font-normal text-[#E7D8B8]">
                Ancient nourishment, honestly milled.
              </span>
            </h1>

            {/* Supporting Copy */}
            <p className="text-sm sm:text-base text-[#DCD6C7] leading-relaxed max-w-lg font-normal">
              Naturally grown across rain-fed Indian drylands. 100% unpolished to protect natural bran, fiber, and trace minerals — brought with honest batch traceability straight to your kitchen.
            </p>

            {/* Restrained Editorial CTAs */}
            <div className="pt-2 flex flex-wrap items-center gap-3 sm:gap-4">
              <Link
                href="/millets"
                className="inline-flex items-center justify-center px-6 py-3.5 bg-[#354C36] hover:bg-[#243725] text-white text-[14px] font-semibold rounded-[5px] transition-colors shadow-sm"
              >
                <span>Shop Chiru Dhanyalu</span>
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>

              <Link
                href="/spices"
                className="inline-flex items-center justify-center px-6 py-3.5 bg-[#F8F4EA] hover:bg-white text-[#292B25] text-[14px] font-semibold rounded-[5px] transition-colors border border-[#E7D8B8] shadow-sm"
              >
                <span>Explore Pure Spices</span>
              </Link>
            </div>

            {/* Trust Badges Bar */}
            <div className="pt-6 border-t border-white/15 grid grid-cols-2 sm:grid-cols-4 gap-3 text-[12px] text-[#D8D2C2] font-data">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#E7D8B8] shrink-0" />
                <span>100% Unpolished</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#E7D8B8] shrink-0" />
                <span>Stone-Cleaned</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#E7D8B8] shrink-0" />
                <span>Cold-Milled Spices</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#E7D8B8] shrink-0" />
                <span>Lot Traceable</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 02 — BESTSELLING HARVEST SHELF
          ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4 border-b border-[#E7D8B8] pb-4">
          <div>
            <span className="text-[12px] uppercase tracking-wider font-semibold text-[#C47B4B] block font-data">
              Single-Origin Harvest
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif text-[#292B25] mt-1 font-semibold">
              Bestselling Kitchen Staples
            </h2>
          </div>

          <Link
            href="/shop"
            className="text-[14px] font-semibold text-[#354C36] hover:text-[#C47B4B] flex items-center gap-1.5 transition-colors group"
          >
            <span>View Complete Catalogue</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* 4-Column Product Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
          {bestsellers.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* =========================================================================
          SECTION 03 — EDITORIAL HERITAGE: THE SIX SACRED CHIRU DHANYALU
          ========================================================================= */}
      <section className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="bg-[#F3ECE0] rounded-[12px] sm:rounded-[16px] p-5 sm:p-10 lg:p-12 border border-[#E2D5B7]">
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
                className="bg-white rounded-[8px] p-4 sm:p-5 border border-[#E7D8B8] hover:border-[#354C36]/50 transition-all flex flex-col justify-between shadow-[0_1px_3px_rgba(41,43,37,0.03)] group"
              >
                <div>
                  {/* Top Bar: Telugu Name + Category Tag */}
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <span className="font-telugu text-[17px] sm:text-[22px] text-[#C47B4B] font-semibold leading-tight">
                      {millet.telugu}
                    </span>
                    <span className="text-[9px] font-data uppercase tracking-wider px-2 py-0.5 rounded-[3px] bg-[#F8F4EA] text-[#5F6156] border border-[#E7D8B8] shrink-0 font-medium">
                      {millet.tag}
                    </span>
                  </div>

                  {/* English & Botanical Name */}
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
          SECTION 04 — VISUAL JOURNEY: FROM DECCAN SOIL TO YOUR HEARTH
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

        {/* 5-Step Editorial Journey */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3.5">
          {journeySteps.map((s, idx) => (
            <div
              key={s.step}
              className="bg-white rounded-[8px] p-5 border border-[#E7D8B8] flex flex-col justify-between relative group hover:border-[#354C36]/50 transition-all shadow-[0_1px_3px_rgba(41,43,37,0.03)]"
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
          SECTION 05 — PROVENANCE & LOT TRANSPARENCY
          ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#243725] rounded-[12px] sm:rounded-[16px] p-6 sm:p-10 lg:p-12 text-[#F8F4EA] grid grid-cols-1 lg:grid-cols-12 gap-8 items-center shadow-lg border border-[#354C36]">
          <div className="lg:col-span-6 space-y-4">
            <span className="text-[12px] uppercase tracking-wider font-semibold text-[#E7D8B8] block font-data">
              Real Transparency · Real Provenance
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif text-white font-semibold leading-tight">
              Know where your food was harvested.
            </h2>
            <p className="text-sm sm:text-base text-[#D4CDC0] leading-relaxed font-normal">
              Commercial grains pass through dozens of middlemen where old and new harvests are mixed. Dharvika maintains segregated lot traceability. Every package links to its harvest district, processing run, and purity checks.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-4">
              <Link
                href="/quality"
                className="inline-flex items-center justify-center px-5 py-3 bg-[#F8F4EA] hover:bg-white text-[#243725] text-[13px] font-semibold rounded-[5px] transition-colors"
              >
                <span>Read Our Quality Standards</span>
                <ArrowRight className="w-4 h-4 ml-1.5" />
              </Link>
              <Link
                href="/sourcing"
                className="text-[13px] font-semibold text-[#E7D8B8] hover:text-white underline underline-offset-4"
              >
                Farm Sourcing Network &rarr;
              </Link>
            </div>
          </div>

          {/* Sample Traceability Block */}
          <div className="lg:col-span-6">
            <div className="bg-white/10 backdrop-blur-md rounded-[8px] p-5 sm:p-6 border border-white/20 text-white space-y-4">
              <div className="flex items-center justify-between border-b border-white/15 pb-3">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-[#E7D8B8]" />
                  <span className="font-data text-[13px] font-semibold text-[#F8F4EA]">
                    Sample Batch Passport
                  </span>
                </div>
                <span className="font-data text-[12px] bg-white/20 px-2 py-0.5 rounded-[4px] text-[#E7D8B8]">
                  LOT #DH-FX-2026-09
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-[12px]">
                <div className="bg-black/20 p-2.5 rounded-[5px]">
                  <span className="text-[#E7D8B8] block text-[10px] uppercase font-data">Crop &amp; Grain</span>
                  <span className="font-semibold text-white">Foxtail Millet (కొర్రలు)</span>
                </div>
                <div className="bg-black/20 p-2.5 rounded-[5px]">
                  <span className="text-[#E7D8B8] block text-[10px] uppercase font-data">Harvest Cluster</span>
                  <span className="font-semibold text-white">Kurnool District, AP</span>
                </div>
                <div className="bg-black/20 p-2.5 rounded-[5px]">
                  <span className="text-[#E7D8B8] block text-[10px] uppercase font-data">De-Husking Method</span>
                  <span className="font-semibold text-white">Cold Rubber-Roll De-husker</span>
                </div>
                <div className="bg-black/20 p-2.5 rounded-[5px]">
                  <span className="text-[#E7D8B8] block text-[10px] uppercase font-data">Moisture Checked</span>
                  <span className="font-semibold text-white">10.8% (&lt; 12% Standard)</span>
                </div>
              </div>

              <p className="text-[11px] text-[#D8D2C2] pt-1">
                *Every retail pouch carries lot numbers matching certified NABL laboratory testing reports.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 06 — SINGLE-ORIGIN SPICES & MASALAS
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
          SECTION 07 — CURATED PANTRY COMBOS & VALUE BOXES
          ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#F3ECE0] rounded-[12px] sm:rounded-[16px] p-6 sm:p-10 border border-[#E2D5B7]">
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
          SECTION 08 — TESTED RECIPES & CULINARY INSPIRATION
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

        {/* Recipe Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5">
          <Link
            href="/recipes/foxtail-millet-upma"
            className="group bg-white rounded-[8px] overflow-hidden border border-[#E7D8B8] hover:border-[#354C36]/50 transition-all shadow-[0_1px_3px_rgba(41,43,37,0.03)] flex flex-col justify-between"
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
            className="group bg-white rounded-[8px] overflow-hidden border border-[#E7D8B8] hover:border-[#354C36]/50 transition-all shadow-[0_1px_3px_rgba(41,43,37,0.03)] flex flex-col justify-between"
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
            className="group bg-white rounded-[8px] overflow-hidden border border-[#E7D8B8] hover:border-[#354C36]/50 transition-all shadow-[0_1px_3px_rgba(41,43,37,0.03)] flex flex-col justify-between"
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
          SECTION 09 — VERIFIED CUSTOMER REVIEWS (BIS IS 19000:2022 COMPLIANT)
          ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-[12px] p-6 sm:p-10 border border-[#E7D8B8]">
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
            <div className="p-5 rounded-[8px] bg-[#F8F4EA] border border-[#E7D8B8] space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-[#292B25] text-[14px]">S. Reddy</span>
                <span className="text-[10px] bg-[#E7D8B8]/50 text-[#354C36] px-2 py-0.5 rounded-[3px] font-data font-medium">
                  Verified Order #DG10248
                </span>
              </div>
              <p className="text-[13px] text-[#5F6156] leading-relaxed italic">
                &ldquo;Remarkably stone-free and clean. We cook Korralu every morning without needing to sieve or hand-sort multiple times. Naturally fragrant.&rdquo;
              </p>
            </div>

            <div className="p-5 rounded-[8px] bg-[#F8F4EA] border border-[#E7D8B8] space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-[#292B25] text-[14px]">Dr. R. Rao</span>
                <span className="text-[10px] bg-[#E7D8B8]/50 text-[#354C36] px-2 py-0.5 rounded-[3px] font-data font-medium">
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
          SECTION 10 — EDITORIAL BRAND COMMITMENT
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
