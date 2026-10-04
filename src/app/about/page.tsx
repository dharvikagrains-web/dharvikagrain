'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { brandConfig } from '@/data/brandConfig';
import { ShieldCheck, Compass, Heart, ArrowRight, CheckCircle2, Leaf, Award } from 'lucide-react';

const chapters = [
  {
    id: '01',
    title: 'Deccan Heritage',
    tagline: 'Ancestral dryland grains cultivated for thousands of years without chemical fertilizers.',
    detail: 'Rain-fed millets naturally adapted to drought-prone red and black soils of the Deccan plateau.',
  },
  {
    id: '02',
    title: 'Farmer Clusters',
    tagline: 'Direct partnerships with smallholder farmer collectives in Andhra Pradesh & Telangana.',
    detail: 'Fair-value farmgate procurement that protects rural farming livelihoods and encourages zero-pesticide methods.',
  },
  {
    id: '03',
    title: 'Unpolished Purity',
    tagline: 'Zero chemical bleaching, zero artificial polishes, and low-temperature spice milling.',
    detail: 'Retaining 100% of the nutrient-dense grain bran layer and natural volatile aroma oils below 40°C.',
  },
  {
    id: '04',
    title: 'Direct Traceability',
    tagline: 'Verifiable lot records connecting each pouch directly to its harvest district.',
    detail: 'Batch testing for moisture limits (<12%), aflatoxins, and physical cleanliness with open lab transparency.',
  },
];

export default function AboutPage() {
  const [activeChapterIndex, setActiveChapterIndex] = useState(0);
  const activeChapter = chapters[activeChapterIndex];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-12 sm:space-y-16 pb-20">
      {/* Visual & Interactive Asymmetric Split Hero */}
      <section className="relative rounded-[14px] bg-[#F4EFEA] border border-[#E2D9CE] overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-12 items-center">
          {/* Left Column: Story Copy & Interactive Chapter Timeline */}
          <div className="lg:col-span-7 p-6 sm:p-10 lg:p-12 space-y-5">
            <span className="text-[12px] uppercase tracking-wider font-semibold text-[#9E462A] block font-data">
              Deccan Agrarian Heritage
            </span>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-semibold text-[#221814] leading-tight">
              The Goodness of <br />
              <span className="font-serif italic font-normal text-[#1A382B]">India&apos;s Ancient Harvest.</span>
            </h1>

            <p className="text-sm sm:text-base text-[#685950] leading-relaxed max-w-xl">
              Bridging the gap between age-old agricultural wisdom and everyday modern cooking with complete transparency, zero chemical polishing, and unadulterated food purity.
            </p>

            {/* Interactive Chapter Timeline Selector */}
            <div className="pt-2">
              <span className="text-[11px] uppercase tracking-wider text-[#8C7A70] font-data font-semibold block mb-2">
                Explore Our Core Foundations:
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {chapters.map((ch, idx) => (
                  <button
                    key={ch.id}
                    type="button"
                    onClick={() => setActiveChapterIndex(idx)}
                    className={`p-2.5 rounded-[6px] border text-left transition-all ${
                      activeChapterIndex === idx
                        ? 'bg-[#1A382B] text-white border-[#1A382B] shadow-2xs'
                        : 'bg-white text-[#221814] border-[#E2D9CE] hover:border-[#1A382B]/60'
                    }`}
                  >
                    <span className={`text-[10px] font-data font-bold block ${activeChapterIndex === idx ? 'text-[#A3C7B5]' : 'text-[#9E462A]'}`}>
                      {ch.id}
                    </span>
                    <span className="text-[12px] font-semibold block leading-tight mt-0.5 truncate">
                      {ch.title}
                    </span>
                  </button>
                ))}
              </div>

              {/* Dynamic Interactive Callout */}
              <div className="mt-3.5 p-3.5 rounded-[6px] bg-white border border-[#E2D9CE] text-[12px] space-y-1">
                <p className="font-semibold text-[#1A382B] font-dmsans">
                  {activeChapter.tagline}
                </p>
                <p className="text-[#685950] leading-relaxed">
                  {activeChapter.detail}
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Visual Agricultural Showcase Image */}
          <div className="lg:col-span-5 relative h-64 sm:h-80 lg:h-full min-h-[320px] m-4 sm:m-6 rounded-[10px] overflow-hidden border border-[#E2D9CE] group bg-white shadow-2xs">
            <Image
              src="/images/showcase/hero-kitchen.jpg"
              alt="Authentic harvest of native Indian millets and heritage spices"
              fill
              priority
              className="object-cover card-image-zoom"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#140E0A]/70 via-transparent to-transparent" />
            <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-white text-[11px] font-data z-10">
              <span className="bg-[#1A382B]/90 backdrop-blur-xs px-2.5 py-1 rounded-[4px] border border-white/20">
                Rain-Fed Deccan Plateau
              </span>
              <span className="text-[#FAF7F2]/90">
                100% Unpolished
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Chapter 1: Why We Started */}
      <section>
        <div className="rounded-[12px] bg-white border border-[#E2D9CE] p-6 sm:p-10 lg:p-12 shadow-2xs">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-10 items-center">
            <div className="md:col-span-6 space-y-4">
              <span className="text-[11px] font-semibold text-[#9E462A] uppercase tracking-wider font-data block">
                Chapter 01 · Origin Story
              </span>
              <h2 className="text-2xl sm:text-3xl font-serif font-semibold text-[#221814]">
                Why We Started Dharvika Grains
              </h2>
              <div className="space-y-3 text-[13px] sm:text-[14px] text-[#685950] leading-relaxed">
                <p>
                  A generation ago, Indian kitchens in semi-arid regions were powered by a diverse rhythm of native grains—Korralu, Samalu, Arikelu, and Ragi. These crops naturally adapted to dry Deccan soils, requiring neither heavy irrigation nor synthetic chemical sprays.
                </p>
                <p>
                  Over recent decades, industrial monoculture standardized our daily plates to polished white rice and ultra-processed wheat. In doing so, we lost touch with the deep nourishment, gut-friendly fiber, and rich nutty taste that sustained our ancestors.
                </p>
                <p>
                  We started Dharvika Grains with a singular focus: to make genuine, unpolished traditional grains and 100% pure single-origin spices accessible, effortless, and trustworthy for modern families.
                </p>
              </div>
            </div>

            <div className="md:col-span-6 relative aspect-4/3 rounded-[10px] overflow-hidden border border-[#E2D9CE] shadow-2xs">
              <Image
                src="/images/showcase/cat-millets.jpg"
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
        <div className="rounded-[12px] bg-[#F4EFEA] border border-[#E2D9CE] p-6 sm:p-10 lg:p-12 shadow-2xs">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-10 items-center">
            <div className="md:col-span-6 md:order-2 space-y-4">
              <span className="text-[11px] font-semibold text-[#9E462A] uppercase tracking-wider font-data block">
                Chapter 02 · Honest Sourcing
              </span>
              <h2 className="text-2xl sm:text-3xl font-serif font-semibold text-[#221814]">
                Why Traceability & Purity Matter
              </h2>
              <div className="space-y-3 text-[13px] sm:text-[14px] text-[#685950] leading-relaxed">
                <p>
                  Most commercial grains and spices traverse a maze of middlemen, wholesale mandis, and central warehouses where they are subjected to artificial polishing, sulfur fumigation, and anti-caking additives.
                </p>
                <p>
                  We reject that model entirely. We source directly from designated dryland grower clusters in Andhra Pradesh and Telangana. We disclose the exact processing methods: gentle mechanical de-husking for millets and low-temperature cold grinding below 40°C for spices.
                </p>
              </div>

              <div className="pt-2">
                <Link
                  href="/sourcing"
                  className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-[6px] bg-[#1A382B] hover:bg-[#132B21] text-white text-[13px] font-semibold transition-colors shadow-2xs"
                >
                  <span>Farm-to-Home Sourcing Journey</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            <div className="md:col-span-6 md:order-1 relative aspect-4/3 rounded-[10px] overflow-hidden border border-[#E2D9CE] shadow-2xs">
              <Image
                src="/images/showcase/bestseller-dish.jpg"
                alt="Pure whole spices and traditional cooking"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Chapter 3: The Four Pillars */}
      <section>
        <div className="rounded-[12px] bg-white border border-[#E2D9CE] p-6 sm:p-10 lg:p-12 shadow-2xs">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            {/* Brand Logo Box */}
            <div className="md:col-span-5 flex flex-col items-center text-center">
              <div className="relative w-full max-w-[240px] aspect-square rounded-[10px] overflow-hidden border border-[#E2D9CE] bg-[#FAF7F2] p-4 flex items-center justify-center">
                <Image
                  src={brandConfig.fullLogoImage || '/images/brand/dharvika-luxury-logo.jpg'}
                  alt="Dharvika Grains Official Logo"
                  fill
                  className="object-contain p-3"
                />
              </div>
              <span className="text-[10px] tracking-[0.2em] text-[#1A382B] uppercase font-bold mt-3 font-data">
                Official Brand Emblem
              </span>
            </div>

            {/* The Pillars Narrative */}
            <div className="md:col-span-7 space-y-4">
              <div>
                <span className="text-[11px] uppercase tracking-wider font-semibold text-[#9E462A] block font-data">
                  Our Guiding Principles
                </span>
                <h2 className="text-2xl sm:text-3xl font-serif font-semibold text-[#1A382B] mt-0.5">
                  Nourishing a Better Tomorrow
                </h2>
              </div>

              <p className="text-[13px] text-[#685950] leading-relaxed">
                The Dharvika seal reflects our deep reverence for traditional Indian agriculture. The sculpted golden stalk represents the resilient spikelets of native millets; the vibrant emerald leaf honors rain-fed vitality and chemical-free cultivation; and the central sun disc evokes solar curing.
              </p>

              <div className="grid grid-cols-2 gap-2.5 sm:gap-3 pt-2">
                <div className="p-2.5 sm:p-3.5 rounded-[6px] bg-[#FAF7F2] border border-[#E2D9CE] space-y-0.5 sm:space-y-1">
                  <h4 className="text-[11px] sm:text-[12px] font-semibold uppercase tracking-wider text-[#1A382B] font-data">1. Tradition</h4>
                  <p className="text-[11px] sm:text-[12px] text-[#685950] line-clamp-3">
                    Preserving indigenous seed varieties and heritage kitchen practices.
                  </p>
                </div>
                <div className="p-2.5 sm:p-3.5 rounded-[6px] bg-[#FAF7F2] border border-[#E2D9CE] space-y-0.5 sm:space-y-1">
                  <h4 className="text-[11px] sm:text-[12px] font-semibold uppercase tracking-wider text-[#1A382B] font-data">2. Purity</h4>
                  <p className="text-[11px] sm:text-[12px] text-[#685950] line-clamp-3">
                    Zero artificial polishing, zero synthetic dyes, and stone grinding.
                  </p>
                </div>
                <div className="p-2.5 sm:p-3.5 rounded-[6px] bg-[#FAF7F2] border border-[#E2D9CE] space-y-0.5 sm:space-y-1">
                  <h4 className="text-[11px] sm:text-[12px] font-semibold uppercase tracking-wider text-[#1A382B] font-data">3. People</h4>
                  <p className="text-[11px] sm:text-[12px] text-[#685950] line-clamp-3">
                    Fair farmgate procurement empowering dryland farmer clusters.
                  </p>
                </div>
                <div className="p-2.5 sm:p-3.5 rounded-[6px] bg-[#FAF7F2] border border-[#E2D9CE] space-y-0.5 sm:space-y-1">
                  <h4 className="text-[11px] sm:text-[12px] font-semibold uppercase tracking-wider text-[#1A382B] font-data">4. Planet</h4>
                  <p className="text-[11px] sm:text-[12px] text-[#685950] line-clamp-3">
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
        <div className="rounded-[12px] bg-[#1A382B] text-white p-8 sm:p-12 space-y-3 shadow-sm">
          <span className="text-[11px] uppercase tracking-wider text-[#86EFAC] font-semibold font-data">
            Fresh Season Harvest
          </span>
          <h3 className="text-2xl sm:text-3xl font-serif font-semibold text-white">
            Ready to bring authentic Indian grains to your table?
          </h3>
          <p className="text-[13px] text-[#D4E3DB] max-w-md mx-auto leading-relaxed">
            Try our unpolished Korralu (Foxtail Millet) or hand-roasted Signature Deccan Masala today.
          </p>
          <div className="pt-2">
            <Link
              href="/shop"
              className="inline-block px-6 py-3 rounded-[6px] bg-[#FAF7F2] hover:bg-white text-[#1A382B] text-[13px] font-semibold transition-colors shadow-2xs"
            >
              Shop the Collection
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
