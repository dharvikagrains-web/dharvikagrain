import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { brandConfig } from '@/data/brandConfig';
import { ShieldCheck, Compass, Heart, ArrowRight } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Our Story & Philosophy | Authentic Traditional Indian Food Brand',
  description:
    'Learn why we started our journey to bring unpolished Chiru Dhanyalu (traditional millets) and pure cold-ground spices from Indian dryland farms into modern kitchens.',
};

export default function AboutPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-14 sm:space-y-20 pb-20">
      {/* Editorial Hero */}
      <section className="relative rounded-[28px] sm:rounded-[36px] bg-[#EDE9E1] border border-[#D5CDBD] p-10 sm:p-16 md:p-20 text-center overflow-hidden shadow-xs">
        <div className="max-w-3xl mx-auto space-y-4 relative z-10">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-white/80 border border-[#D5CDBD] text-[11px] font-semibold text-[#0D3522] uppercase tracking-wider mb-2">
            <span>✦ Rooted in Deccan Heritage</span>
          </div>
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-serif font-bold text-[#241611] leading-tight">
            {brandConfig.tagline}
          </h1>
          <p className="text-xs sm:text-sm md:text-base text-[#6B5B52] max-w-2xl mx-auto leading-relaxed">
            Bridging the gap between age-old agricultural wisdom and everyday urban cooking with complete
            transparency, zero chemical polishing, and unadulterated purity.
          </p>
        </div>

        {/* Ambient glow decoration */}
        <div className="absolute -right-20 -bottom-20 w-80 h-80 rounded-full bg-[#E2DACB]/60 blur-3xl pointer-events-none" />
      </section>

      {/* Chapter 1: Why We Started */}
      <section>
        <div className="rounded-[28px] sm:rounded-[36px] bg-[#EDE9E1] border border-[#D5CDBD] p-8 sm:p-12 shadow-xs">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 items-center">
            <div className="md:col-span-6 space-y-4">
              <span className="inline-block px-3 py-0.5 rounded-full bg-white/80 border border-[#D5CDBD] text-[10px] uppercase tracking-wider font-semibold text-[#0D3522]">
                ✦ Chapter 01
              </span>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-[#241611]">
                Why We Started
              </h2>
              <div className="space-y-3.5 text-xs sm:text-sm text-[#6B5B52] leading-relaxed">
                <p>
                  A generation ago, Indian kitchens in semi-arid regions were powered by a diverse rhythm of
                  native grains—Korralu, Samalu, Arikelu, and Ragi. These crops naturally adapted to dry Deccan soils,
                  requiring neither heavy irrigation nor synthetic chemical sprays.
                </p>
                <p>
                  Over recent decades, industrial monoculture standardized our daily plates to polished white
                  rice and ultra-processed wheat. In doing so, we lost touch with the deep nourishment, gut-friendly
                  fiber, and rich earthy taste that sustained our ancestors.
                </p>
                <p>
                  We started {brandConfig.brandName} with a singular focus: to make genuine, unpolished traditional
                  grains and 100% pure single-origin spices accessible, effortless, and trustworthy for modern families.
                </p>
              </div>
            </div>

            <div className="md:col-span-6 relative aspect-4/3 rounded-[24px] overflow-hidden border border-[#D5CDBD] shadow-2xs">
              <Image
                src="/images/showcase/hero-kitchen.jpg"
                alt="Harvest of traditional Indian grains"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Chapter 2: The Sourcing Commitment */}
      <section>
        <div className="rounded-[28px] sm:rounded-[36px] bg-white border border-[#D5CDBD] p-8 sm:p-12 shadow-xs">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 items-center">
            <div className="md:col-span-6 md:order-2 space-y-4">
              <span className="inline-block px-3 py-0.5 rounded-full bg-[#EDE9E1] border border-[#D5CDBD] text-[10px] uppercase tracking-wider font-semibold text-[#0D3522]">
                ✦ Chapter 02
              </span>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-[#241611]">
                Why Sourcing & Transparency Matter
              </h2>
              <div className="space-y-3.5 text-xs sm:text-sm text-[#6B5B52] leading-relaxed">
                <p>
                  Most commercial grains and spices traverse a maze of middlemen, wholesale mandis, and
                  central warehouses where they are subjected to artificial polishing, sulfur fumigation,
                  and anti-caking additives.
                </p>
                <p>
                  We reject that model entirely. We source directly from designated dryland grower clusters
                  in Andhra Pradesh, Telangana, and Karnataka. We disclose the exact processing methods:
                  gentle mechanical de-husking for millets and low-temperature cold grinding below 40°C for spices.
                </p>
              </div>

              <div className="pt-3">
                <Link
                  href="/sourcing"
                  className="inline-flex items-center px-6 py-3 rounded-full bg-[#0D3522] hover:bg-[#072417] text-white text-xs uppercase tracking-wider font-semibold transition-all shadow-sm"
                >
                  <span>Farm-to-Home Sourcing Journey</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                </Link>
              </div>
            </div>

            <div className="md:col-span-6 md:order-1 relative aspect-4/3 rounded-[24px] overflow-hidden border border-[#D5CDBD] shadow-2xs">
              <Image
                src="/images/showcase/bestseller-dish.jpg"
                alt="Pure whole spices and milling"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Chapter 3: The Dharvika Seal & Four Pillars */}
      <section>
        <div className="rounded-[28px] sm:rounded-[36px] bg-[#EDE9E1] border border-[#D5CDBD] p-8 sm:p-12 shadow-xs">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 items-center">
            {/* The Official Luxury Embossed Logo */}
            <div className="md:col-span-5 flex flex-col items-center text-center">
              <div className="relative w-full max-w-[280px] aspect-square rounded-[24px] overflow-hidden shadow-md border border-[#D5CDBD] bg-white p-3">
                <Image
                  src={brandConfig.fullLogoImage || '/images/brand/dharvika-luxury-logo.jpg'}
                  alt="Dharvika Grains Luxury Embossed Logo"
                  fill
                  className="object-contain p-2"
                />
              </div>
              <span className="text-[10px] tracking-[0.25em] text-[#0D3522] uppercase font-bold mt-4">
                ✦ Official Brand Seal
              </span>
            </div>

            {/* The Pillars Narrative */}
            <div className="md:col-span-7 space-y-5">
              <div>
                <span className="text-xs uppercase tracking-widest font-semibold text-[#0D3522]">
                  ✦ The Brand Emblem
                </span>
                <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#0D3522] mt-1">
                  Nourishing a Better Tomorrow
                </h2>
                <p className="text-xs text-[#6B5B52] mt-0.5">
                  The Goodness of India&apos;s Ancient Harvest
                </p>
              </div>

              <p className="text-xs sm:text-sm text-[#6B5B52] leading-relaxed">
                The Dharvika seal reflects our reverence for Indian agriculture. The sculpted golden stalk represents
                the ancient spikelets of traditional millets; the vibrant emerald leaf honors rain-fed vitality and natural purity;
                and the central sun disc evokes solar curing.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
                <div className="p-4 rounded-[20px] bg-white/90 border border-[#D5CDBD] shadow-2xs space-y-1">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#0D3522]">1. Tradition</h4>
                  <p className="text-[11px] text-[#6B5B52] leading-normal">
                    Preserving indigenous seed heirloom varieties and heritage kitchen practices.
                  </p>
                </div>
                <div className="p-4 rounded-[20px] bg-white/90 border border-[#D5CDBD] shadow-2xs space-y-1">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#0D3522]">2. Purity</h4>
                  <p className="text-[11px] text-[#6B5B52] leading-normal">
                    Zero artificial polishing, zero synthetic dyes, and low-temperature stone grinding.
                  </p>
                </div>
                <div className="p-4 rounded-[20px] bg-white/90 border border-[#D5CDBD] shadow-2xs space-y-1">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#0D3522]">3. People</h4>
                  <p className="text-[11px] text-[#6B5B52] leading-normal">
                    Equitable procurement empowering smallholder dryland farmer clusters.
                  </p>
                </div>
                <div className="p-4 rounded-[20px] bg-white/90 border border-[#D5CDBD] shadow-2xs space-y-1">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#0D3522]">4. Planet</h4>
                  <p className="text-[11px] text-[#6B5B52] leading-normal">
                    Drought-resilient crops requiring zero synthetic flood irrigation.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Strip */}
      <section className="text-center">
        <div className="rounded-[28px] sm:rounded-[36px] bg-[#0D3522] text-white p-10 sm:p-14 space-y-4 shadow-sm">
          <span className="text-xs uppercase tracking-widest text-[#C4924A] font-semibold">✦ Fresh Harvest</span>
          <h3 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-white">
            Ready to bring traditional Indian grains to your table?
          </h3>
          <p className="text-xs sm:text-sm text-[#E8DFD5] max-w-md mx-auto leading-relaxed">
            Try our bestselling Korralu (Foxtail Millet) or hand-roasted Signature Deccan Masala today.
          </p>
          <div className="pt-3">
            <Link
              href="/shop"
              className="inline-block px-8 py-3.5 rounded-full bg-[#C4924A] hover:bg-[#b07f37] text-white text-xs uppercase tracking-widest font-semibold transition-all shadow-sm"
            >
              Shop the Collection
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
