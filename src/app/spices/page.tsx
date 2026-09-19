import React from 'react';
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
    <div className="space-y-12 sm:space-y-16 pb-16">
      {/* Category Hero Banner */}
      <section className="bg-[#1E120D] text-[#FAF7F2] py-14 sm:py-20 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl space-y-4">
            <span className="text-xs uppercase tracking-widest font-bold text-[#C4924A]">
              Single-Origin & Cold-Ground
            </span>
            <h1 className="text-3xl sm:text-5xl font-serif font-semibold text-white leading-tight">
              Pure Indian Spices
            </h1>
            <p className="text-xs sm:text-sm md:text-base text-[#E8DFD5] leading-relaxed font-light">
              Indian cuisine lives and breathes through the vitality of its spices.
              Our single-origin spices are harvested at full maturity, sun-cured, and pulverized below
              40°C in low-temperature mills to safeguard volatile essential oils and pure aromas.
            </p>

            <div className="pt-2 flex flex-wrap gap-4 text-xs text-[#C4924A]">
              <span className="flex items-center">
                <CheckCircle2 className="w-4 h-4 mr-1.5" /> 100% Pure Rhizomes & Berries
              </span>
              <span className="flex items-center">
                <CheckCircle2 className="w-4 h-4 mr-1.5" /> Zero Added Starch or Dyes
              </span>
              <span className="flex items-center">
                <CheckCircle2 className="w-4 h-4 mr-1.5" /> Low-Temperature Milling
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Sourcing Integrity Note */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#F5EFEB] border border-[#E7DED4] p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-1.5 max-w-2xl">
            <span className="text-xs uppercase tracking-widest font-bold text-[#B35638]">
              The Purity Difference
            </span>
            <h2 className="text-lg sm:text-xl font-serif font-semibold text-[#241611]">
              Why We Destem Chillies and Cold-Grind Our Spices
            </h2>
            <p className="text-xs text-[#6B5B52] leading-relaxed">
              Commercial spice powders often grind stems, leaves, and low-grade fillers to artificially
              boost weight. We remove all chilli stems by hand, calibrate peppercorns for oil density, and
              test each batch for adulterants like Sudan dye, lead chromate, and heavy metals.
            </p>
          </div>
          <Link
            href="/quality"
            className="flex-shrink-0 px-6 py-3 bg-[#241611] text-white hover:bg-[#B35638] text-xs uppercase tracking-widest font-semibold transition-colors"
          >
            View Quality Protocols
          </Link>
        </div>
      </section>

      {/* Product Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-center justify-between border-b border-[#E7DED4] pb-3">
          <h2 className="text-lg font-serif font-semibold text-[#241611]">
            Spices & Signature Blends ({spicesAndBlends.length} Varieties)
          </h2>
          <span className="text-xs text-[#6B5B52]">Aroma-sealed nitrogen flushed packaging</span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
          {spicesAndBlends.map((spice) => (
            <ProductCard key={spice.id} product={spice} />
          ))}
        </div>
      </section>
    </div>
  );
}
