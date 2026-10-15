import React from 'react';
import Image from 'next/image';
import { products } from '@/data/products';
import { ProductCard } from '@/components/product/ProductCard';
import Link from 'next/link';
import { CheckCircle2, ArrowRight } from 'lucide-react';
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
      <section className="relative rounded-[14px] bg-[#FBF9F3] border border-[#E7D8B8] overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-12 items-center">
          <div className="lg:col-span-7 p-6 sm:p-10 lg:p-12 space-y-4">
            <span className="text-[12px] uppercase tracking-wider font-semibold text-[#C47B4B] block font-data">
              Single-Origin & Cold-Ground
            </span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-semibold text-[#292B25] leading-tight">
              Pure Indian Spices <br />
              <span className="font-serif italic font-normal text-[#354C36]">& Signature Blends</span>
            </h1>
            <p className="text-sm text-[#5F6156] leading-relaxed max-w-xl">
              Indian cuisine lives and breathes through the vitality of its spices. Our single-origin spices are harvested at full maturity, sun-cured, and pulverized below 40°C in low-temperature stone mills to protect volatile aromatic oils, natural pigments, and naturally occurring curcuminoids.
            </p>

            <div className="pt-2 flex flex-wrap gap-2 text-[12px] text-[#5F6156]">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-[4px] bg-white border border-[#E7D8B8]">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#354C36]" /> 100% Pure Rhizomes & Berries
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-[4px] bg-white border border-[#E7D8B8]">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#354C36]" /> Zero Added Starch or Dyes
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-[4px] bg-white border border-[#E7D8B8]">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#354C36]" /> Low-Temperature Milling
              </span>
            </div>
          </div>

          <div className="lg:col-span-5 relative h-64 sm:h-80 lg:h-full min-h-[300px] m-4 sm:m-6 rounded-[10px] overflow-hidden border border-[#E7D8B8]">
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
        <div className="rounded-[14px] bg-[#FBF9F3] border border-[#E7D8B8] p-6 sm:p-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <span className="text-[12px] uppercase tracking-wider font-semibold text-[#C47B4B] block font-data">
              The Purity Difference
            </span>
            <h2 className="text-xl sm:text-2xl font-serif font-semibold text-[#292B25]">
              Why We Destem Chillies and Cold-Grind Our Spices
            </h2>
            <p className="text-sm text-[#5F6156] leading-relaxed">
              Commercial spice powders often grind stems, leaves, and low-grade fillers to artificially boost weight. We remove all chilli stems by hand, calibrate peppercorns for oil density, and test each batch for adulterants like Sudan dye, lead chromate, and heavy metals.
            </p>
          </div>
          <Link
            href="/quality"
            className="flex-shrink-0 px-5 py-3 rounded-[6px] bg-[#354C36] hover:bg-[#132B21] text-white text-[13px] font-semibold transition-colors"
          >
            View Quality Protocols
          </Link>
        </div>
      </section>

      {/* Product Grid */}
      <section>
        <div className="mb-6 flex flex-col sm:flex-row sm:items-end justify-between border-b border-[#E7D8B8] pb-4 gap-2">
          <div>
            <h2 className="text-xl sm:text-2xl font-serif font-semibold text-[#292B25]">
              Spices & Signature Blends ({spicesAndBlends.length} Varieties)
            </h2>
            <p className="text-[12px] sm:text-[13px] text-[#5F6156] mt-0.5">
              Aroma-sealed nitrogen-flushed packaging to retain natural fragrance
            </p>
          </div>
          <Link
            href="/shop"
            className="text-[13px] font-semibold text-[#354C36] hover:text-[#C47B4B] flex items-center gap-1 self-start sm:self-auto shrink-0 whitespace-nowrap"
          >
            <span>All Staples</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
          {spicesAndBlends.map((spice) => (
            <ProductCard key={spice.id} product={spice} />
          ))}
        </div>
      </section>
    </div>
  );
}
