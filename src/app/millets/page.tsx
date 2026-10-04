import React from 'react';
import { products } from '@/data/products';
import { ProductCard } from '@/components/product/ProductCard';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, CheckCircle2, BookOpen } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Chiru Dhanyalu (Traditional Millets) | Unpolished & Pure Grains',
  description:
    'Discover authentic unpolished Indian millets: Korralu (Foxtail), Samalu (Little), Arikelu (Kodo), Udalu (Barnyard), Ragi (Finger), and Jowar (Sorghum). Direct from rain-fed drylands.',
};

export default function MilletsPage() {
  const millets = products.filter((p) => p.category === 'millets');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-12 sm:space-y-16">
      {/* Category Hero Banner */}
      <section className="relative rounded-[28px] sm:rounded-[36px] bg-[#EDE9E1] border border-[#D5CDBD] overflow-hidden shadow-xs">
        <div className="grid grid-cols-1 lg:grid-cols-12 items-center">
          <div className="lg:col-span-7 p-8 sm:p-12 md:p-14 space-y-4">
            <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-white/80 border border-[#D5CDBD] text-[11px] font-semibold text-[#0D3522] uppercase tracking-wider">
              <span>✦ Traditional Dryland Agriculture</span>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-[#241611] leading-tight">
              Chiru Dhanyalu <br />
              <span className="italic font-normal text-[#0D3522]">Native Indian Millets</span>
            </h1>
            <p className="text-xs sm:text-sm text-[#6B5B52] leading-relaxed max-w-xl">
              &ldquo;Chiru Dhanyalu&rdquo; is the traditional Telugu honorific for small grains—the resilient,
              rain-fed millets that nourished the Deccan plateau for thousands of years.
              Our grains are 100% unpolished, stone-picked, and air-cleaned to preserve the nutrient-dense natural bran layer.
            </p>

            <div className="pt-3 flex flex-wrap gap-2 text-xs">
              <span className="inline-flex items-center px-3.5 py-1.5 rounded-full bg-white/80 border border-[#D5CDBD] font-semibold text-[#0D3522]">
                <CheckCircle2 className="w-3.5 h-3.5 mr-1.5 text-[#0D3522]" /> 100% Unpolished
              </span>
              <span className="inline-flex items-center px-3.5 py-1.5 rounded-full bg-white/80 border border-[#D5CDBD] font-semibold text-[#0D3522]">
                <CheckCircle2 className="w-3.5 h-3.5 mr-1.5 text-[#0D3522]" /> Zero Chemical Fumigation
              </span>
              <span className="inline-flex items-center px-3.5 py-1.5 rounded-full bg-white/80 border border-[#D5CDBD] font-semibold text-[#0D3522]">
                <CheckCircle2 className="w-3.5 h-3.5 mr-1.5 text-[#0D3522]" /> Direct Farmer Clusters
              </span>
            </div>
          </div>

          <div className="lg:col-span-5 relative h-64 sm:h-80 lg:h-full min-h-[320px] m-4 sm:m-6 rounded-[24px] overflow-hidden border border-[#D5CDBD]">
            <Image
              src="/images/showcase/cat-millets.jpg"
              alt="Authentic Chiru Dhanyalu grains display"
              fill
              priority
              className="object-cover"
            />
          </div>
        </div>
      </section>

      {/* Educational Grain Table / Quick Guide */}
      <section>
        <div className="rounded-[28px] sm:rounded-[32px] bg-[#EDE9E1] border border-[#D5CDBD] p-6 sm:p-10 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <span className="text-xs uppercase tracking-widest font-semibold text-[#0D3522]">
                ✦ Culinary Guide
              </span>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#241611] mt-1">
                Quick Cooking & Texture Matrix
              </h2>
              <p className="text-xs sm:text-sm text-[#6B5B52] mt-1.5">
                How to select and prepare traditional millets for your family meals.
              </p>
            </div>
            <Link
              href="/recipes"
              className="inline-flex items-center px-5 py-2.5 rounded-full bg-white/90 border border-[#D5CDBD] text-xs font-semibold text-[#0D3522] hover:bg-[#0D3522] hover:text-white transition-all shadow-2xs self-start sm:self-auto"
            >
              <BookOpen className="w-3.5 h-3.5 mr-1.5" /> View Millet Recipes
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            <div className="rounded-[22px] bg-white/90 border border-[#D5CDBD] p-5 shadow-2xs hover:shadow-sm transition-shadow">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-serif font-bold text-[#241611]">Korralu (Foxtail)</h4>
                <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-[#EBF7EE] text-[#0D3522] border border-[#0D3522]/20">
                  Fluffy Rice
                </span>
              </div>
              <p className="text-xs text-[#6B5B52] leading-relaxed">
                Best daily replacement for white rice. Perfect with dal, sambar, and rasam. Soak 30 mins.
              </p>
            </div>

            <div className="rounded-[22px] bg-white/90 border border-[#D5CDBD] p-5 shadow-2xs hover:shadow-sm transition-shadow">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-serif font-bold text-[#241611]">Samalu (Little Millet)</h4>
                <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-[#EBF7EE] text-[#0D3522] border border-[#0D3522]/20">
                  Soft & Delicate
                </span>
              </div>
              <p className="text-xs text-[#6B5B52] leading-relaxed">
                Delicate, melt-in-mouth grains. Ideal for comforting khichdi, idli/dosa, and curd rice.
              </p>
            </div>

            <div className="rounded-[22px] bg-white/90 border border-[#D5CDBD] p-5 shadow-2xs hover:shadow-sm transition-shadow">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-serif font-bold text-[#241611]">Arikelu (Kodo Millet)</h4>
                <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-[#EBF7EE] text-[#0D3522] border border-[#0D3522]/20">
                  High Satiety
                </span>
              </div>
              <p className="text-xs text-[#6B5B52] leading-relaxed">
                Hearty grain with deep satisfaction. Excellent for traditional Pongal and Bisi Bele Bath.
              </p>
            </div>

            <div className="rounded-[22px] bg-white/90 border border-[#D5CDBD] p-5 shadow-2xs hover:shadow-sm transition-shadow">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-serif font-bold text-[#241611]">Udalu (Barnyard)</h4>
                <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-[#EBF7EE] text-[#0D3522] border border-[#0D3522]/20">
                  Light & Easy
                </span>
              </div>
              <p className="text-xs text-[#6B5B52] leading-relaxed">
                Rapidly cooks in 12 mins. Absorbs aromatics gracefully. Great for light pulaos and upmas.
              </p>
            </div>

            <div className="rounded-[22px] bg-white/90 border border-[#D5CDBD] p-5 shadow-2xs hover:shadow-sm transition-shadow">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-serif font-bold text-[#241611]">Ragi (Finger Millet)</h4>
                <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-[#EBF7EE] text-[#0D3522] border border-[#0D3522]/20">
                  Calcium Rich
                </span>
              </div>
              <p className="text-xs text-[#6B5B52] leading-relaxed">
                The legend of southern homes. Stone-mill for Ragi Mudde, crispy dosas, and breakfast malt.
              </p>
            </div>

            <div className="rounded-[22px] bg-white/90 border border-[#D5CDBD] p-5 shadow-2xs hover:shadow-sm transition-shadow">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-serif font-bold text-[#241611]">Jowar (White Sorghum)</h4>
                <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-[#EBF7EE] text-[#0D3522] border border-[#0D3522]/20">
                  Soft Rotis
                </span>
              </div>
              <p className="text-xs text-[#6B5B52] leading-relaxed">
                Cooling grain yielding soft, hand-patted Jonna Rotte (rotis) to enjoy with spicy curries.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Product Grid */}
      <section>
        <div className="mb-8 flex items-center justify-between border-b border-[#D5CDBD] pb-4">
          <div>
            <h2 className="text-2xl font-serif font-bold text-[#241611]">
              All Chiru Dhanyalu ({millets.length} Varieties)
            </h2>
            <p className="text-xs text-[#6B5B52] mt-0.5">Available in 500g and 1kg vacuum sealed packages</p>
          </div>
          <Link
            href="/shop"
            className="text-xs font-semibold text-[#0D3522] hover:underline flex items-center"
          >
            Explore All Provisions <ArrowRight className="w-3.5 h-3.5 ml-1" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {millets.map((millet) => (
            <ProductCard key={millet.id} product={millet} />
          ))}
        </div>
      </section>
    </div>
  );
}
