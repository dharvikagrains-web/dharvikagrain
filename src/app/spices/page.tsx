import React from 'react';
import Image from 'next/image';
import { products } from '@/data/products';
import { ProductCard } from '@/components/product/ProductCard';
import Link from 'next/link';
import { Sparkles, CheckCircle2, ShieldAlert } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Pure Single-Origin Indian Spices & Signature Blends | Cold-Ground',
  description:
    'Pure, unadulterated Indian spices: Lakadong Turmeric, Stemless Guntur Chilli, Roasted Dhaniya, Fragrant Cumin, Malabar Pepper, and Heritage Regional Masala.',
};

export default function SpicesPage() {
  const spicesAndBlends = products.filter(
    (p) => p.category === 'spices' || p.category === 'signature'
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-12 sm:space-y-16">
      {/* Category Hero Banner */}
      <section className="relative rounded-[28px] sm:rounded-[36px] bg-[#EDE9E1] border border-[#D5CDBD] overflow-hidden shadow-xs">
        <div className="grid grid-cols-1 lg:grid-cols-12 items-center">
          <div className="lg:col-span-7 p-8 sm:p-12 md:p-14 space-y-4">
            <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-white/80 border border-[#D5CDBD] text-[11px] font-semibold text-[#0D3522] uppercase tracking-wider">
              <span>✦ Single-Origin & Cold-Ground</span>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-[#241611] leading-tight">
              Pure Indian Spices <br />
              <span className="italic font-normal text-[#0D3522]">& Signature Blends</span>
            </h1>
            <p className="text-xs sm:text-sm text-[#6B5B52] leading-relaxed max-w-xl">
              Indian cuisine lives and breathes through the vitality of its spices.
              Our single-origin spices are harvested at full maturity, sun-cured, and pulverized below
              40°C in low-temperature mills to safeguard volatile essential oils, deep colours, and intoxicating aromas.
            </p>

            <div className="pt-3 flex flex-wrap gap-2 text-xs">
              <span className="inline-flex items-center px-3.5 py-1.5 rounded-full bg-white/80 border border-[#D5CDBD] font-semibold text-[#0D3522]">
                <CheckCircle2 className="w-3.5 h-3.5 mr-1.5 text-[#0D3522]" /> 100% Pure Rhizomes & Berries
              </span>
              <span className="inline-flex items-center px-3.5 py-1.5 rounded-full bg-white/80 border border-[#D5CDBD] font-semibold text-[#0D3522]">
                <CheckCircle2 className="w-3.5 h-3.5 mr-1.5 text-[#0D3522]" /> Zero Added Starch or Dyes
              </span>
              <span className="inline-flex items-center px-3.5 py-1.5 rounded-full bg-white/80 border border-[#D5CDBD] font-semibold text-[#0D3522]">
                <CheckCircle2 className="w-3.5 h-3.5 mr-1.5 text-[#0D3522]" /> Low-Temperature Milling
              </span>
            </div>
          </div>

          <div className="lg:col-span-5 relative h-64 sm:h-80 lg:h-full min-h-[320px] m-4 sm:m-6 rounded-[24px] overflow-hidden border border-[#D5CDBD]">
            <Image
              src="/images/showcase/cat-spices.jpg"
              alt="Single origin Indian spices showcase"
              fill
              priority
              className="object-cover"
            />
          </div>
        </div>
      </section>

      {/* Sourcing Integrity Note */}
      <section>
        <div className="rounded-[28px] sm:rounded-[32px] bg-[#EDE9E1] border border-[#D5CDBD] p-8 sm:p-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xs">
          <div className="space-y-2 max-w-2xl">
            <span className="text-xs uppercase tracking-widest font-semibold text-[#0D3522]">
              ✦ The Purity Difference
            </span>
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#241611]">
              Why We Destem Chillies and Cold-Grind Our Spices
            </h2>
            <p className="text-xs sm:text-sm text-[#6B5B52] leading-relaxed">
              Commercial spice powders often grind stems, leaves, and low-grade fillers to artificially
              boost weight. We remove all chilli stems by hand, calibrate peppercorns for oil density, and
              test each batch for adulterants like Sudan dye, lead chromate, and heavy metals.
            </p>
          </div>
          <Link
            href="/quality"
            className="flex-shrink-0 px-7 py-3.5 rounded-full bg-[#0D3522] hover:bg-[#072417] text-white text-xs uppercase tracking-wider font-semibold shadow-sm transition-all"
          >
            View Quality Protocols
          </Link>
        </div>
      </section>

      {/* Product Grid */}
      <section>
        <div className="mb-8 flex items-center justify-between border-b border-[#D5CDBD] pb-4">
          <div>
            <h2 className="text-2xl font-serif font-bold text-[#241611]">
              Spices & Signature Blends ({spicesAndBlends.length} Varieties)
            </h2>
            <p className="text-xs text-[#6B5B52] mt-0.5">Aroma-sealed nitrogen flushed packaging to retain potency</p>
          </div>
          <Link
            href="/shop"
            className="text-xs font-semibold text-[#0D3522] hover:underline flex items-center"
          >
            Explore All Provisions <span className="ml-1">→</span>
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {spicesAndBlends.map((spice) => (
            <ProductCard key={spice.id} product={spice} />
          ))}
        </div>
      </section>
    </div>
  );
}
