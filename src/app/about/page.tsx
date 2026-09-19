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
    <div className="space-y-16 sm:space-y-20 pb-20">
      {/* Editorial Hero */}
      <section className="bg-[#241611] text-[#FAF7F2] py-16 sm:py-24 relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4 relative z-10">
          <span className="text-xs uppercase tracking-widest font-bold text-[#C4924A]">
            Rooted in Deccan Heritage
          </span>
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-serif font-semibold text-white leading-tight">
            {brandConfig.tagline}
          </h1>
          <p className="text-xs sm:text-sm md:text-base text-[#E8DFD5] max-w-2xl mx-auto font-light leading-relaxed">
            Bridging the gap between age-old agricultural wisdom and everyday urban cooking with complete
            transparency, zero chemical polishing, and unadulterated purity.
          </p>
        </div>
      </section>

      {/* Chapter 1: Why We Started */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 items-center">
          <div className="md:col-span-6 space-y-4">
            <span className="text-xs uppercase tracking-widest font-bold text-[#B35638]">
              Chapter 01
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif font-semibold text-[#241611]">
              Why We Started
            </h2>
            <div className="space-y-3 text-xs sm:text-sm text-[#6B5B52] leading-relaxed">
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

          <div className="md:col-span-6 relative aspect-4/3 bg-[#F5EFEB] border border-[#E7DED4] overflow-hidden">
            <Image
              src="/images/products/korralu-foxtail-millet.jpg"
              alt="Harvest of traditional Indian grains"
              fill
              className="object-cover"
            />
          </div>
        </div>
      </section>

      {/* Chapter 2: The Sourcing Commitment */}
      <section className="bg-[#F5EFEB] border-y border-[#E7DED4] py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 items-center">
            <div className="md:col-span-6 md:order-2 space-y-4">
              <span className="text-xs uppercase tracking-widest font-bold text-[#B35638]">
                Chapter 02
              </span>
              <h2 className="text-2xl sm:text-3xl font-serif font-semibold text-[#241611]">
                Why Sourcing & Transparency Matter
              </h2>
              <div className="space-y-3 text-xs sm:text-sm text-[#6B5B52] leading-relaxed">
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

              <div className="pt-2">
                <Link
                  href="/sourcing"
                  className="inline-flex items-center text-xs uppercase tracking-widest font-bold text-[#241611] hover:text-[#B35638]"
                >
                  <span>Read our Farm-to-Home Sourcing Journey</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                </Link>
              </div>
            </div>

            <div className="md:col-span-6 md:order-1 relative aspect-4/3 bg-white border border-[#E7DED4] overflow-hidden">
              <Image
                src="/images/products/pure-black-peppercorns.jpg"
                alt="Pure whole spices and milling"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Chapter 3: The Dharvika Seal & Four Pillars */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#FAF7F2] border border-[#C5A059]/40 shadow-xl p-8 sm:p-12">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            {/* The Official Luxury Embossed Logo */}
            <div className="md:col-span-5 flex flex-col items-center text-center">
              <div className="relative w-full max-w-[280px] aspect-square rounded-2xl overflow-hidden shadow-2xl border border-[#C5A059]/30 bg-white p-2">
                <Image
                  src={brandConfig.fullLogoImage || '/images/brand/dharvika-luxury-logo.jpg'}
                  alt="Dharvika Grains Luxury Embossed Logo"
                  fill
                  className="object-contain p-2"
                />
              </div>
              <span className="text-[10px] tracking-[0.25em] text-[#C5A059] uppercase font-bold mt-4">
                Official Brand Seal
              </span>
            </div>

            {/* The Pillars Narrative */}
            <div className="md:col-span-7 space-y-5">
              <div>
                <span className="text-xs uppercase tracking-widest font-bold text-[#0D3522]">
                  The Brand Emblem
                </span>
                <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#0D3522] mt-1">
                  Nourishing a Better Tomorrow
                </h2>
                <p className="text-xs text-[#C5A059] uppercase tracking-widest font-semibold mt-0.5">
                  The Goodness of India&apos;s Harvest
                </p>
              </div>

              <p className="text-xs sm:text-sm text-[#6B5B52] leading-relaxed">
                The Dharvika seal reflects our reverence for Indian agriculture. The sculpted golden stalk represents
                the ancient spikelets of traditional millets; the vibrant emerald leaf honors rain-fed vitality and natural purity;
                and the central sun disc evokes solar curing.
              </p>

              <div className="grid grid-cols-2 gap-4 pt-2 border-t border-[#E7DED4]">
                <div className="space-y-1">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#0D3522]">1. Tradition</h4>
                  <p className="text-[11px] text-[#6B5B52] leading-normal">
                    Preserving indigenous seed heirloom varieties and heritage kitchen practices.
                  </p>
                </div>
                <div className="space-y-1">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#0D3522]">2. Purity</h4>
                  <p className="text-[11px] text-[#6B5B52] leading-normal">
                    Zero artificial polishing, zero synthetic dyes, and low-temperature stone grinding.
                  </p>
                </div>
                <div className="space-y-1">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#0D3522]">3. People</h4>
                  <p className="text-[11px] text-[#6B5B52] leading-normal">
                    Equitable procurement empowering smallholder dryland farmer clusters.
                  </p>
                </div>
                <div className="space-y-1">
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
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-8">
        <div className="bg-[#241611] text-white p-8 sm:p-12 space-y-4">
          <h3 className="text-xl sm:text-2xl font-serif font-semibold">
            Ready to bring traditional Indian grains to your table?
          </h3>
          <p className="text-xs text-[#E8DFD5] max-w-md mx-auto">
            Try our bestselling Korralu (Foxtail Millet) or hand-roasted Signature Deccan Masala today.
          </p>
          <div className="pt-2">
            <Link
              href="/shop"
              className="inline-block px-8 py-3.5 bg-[#B35638] hover:bg-[#9E462A] text-white text-xs uppercase tracking-widest font-semibold transition-colors"
            >
              Shop the Collection
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
