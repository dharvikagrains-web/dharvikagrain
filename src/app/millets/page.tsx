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
    <div className="space-y-12 sm:space-y-16 pb-16">
      {/* Category Hero Banner */}
      <section className="bg-[#241611] text-[#FAF7F2] py-14 sm:py-20 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl space-y-4">
            <span className="text-xs uppercase tracking-widest font-bold text-[#C4924A]">
              Traditional Dryland Agriculture
            </span>
            <h1 className="text-3xl sm:text-5xl font-serif font-semibold text-white leading-tight">
              Chiru Dhanyalu
            </h1>
            <p className="text-xs sm:text-sm md:text-base text-[#E8DFD5] leading-relaxed font-light">
              &ldquo;Chiru Dhanyalu&rdquo; is the traditional Telugu honorific for small grains—the resilient,
              rain-fed millets that nourished the Deccan plateau for thousands of years.
              Our grains are 100% unpolished, stone-picked, and air-cleaned to preserve the natural bran layer.
            </p>

            <div className="pt-2 flex flex-wrap gap-4 text-xs text-[#C4924A]">
              <span className="flex items-center">
                <CheckCircle2 className="w-4 h-4 mr-1.5" /> 100% Unpolished
              </span>
              <span className="flex items-center">
                <CheckCircle2 className="w-4 h-4 mr-1.5" /> Zero Chemical Fumigation
              </span>
              <span className="flex items-center">
                <CheckCircle2 className="w-4 h-4 mr-1.5" /> Direct Farmer Clusters
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Educational Grain Table / Quick Guide */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#F5EFEB] border border-[#E7DED4] p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="text-xl font-serif font-semibold text-[#241611]">
                Quick Millet Cooking & Texture Matrix
              </h2>
              <p className="text-xs text-[#6B5B52] mt-1">
                How to select and prepare traditional millets for your family meals.
              </p>
            </div>
            <Link
              href="/recipes"
              className="text-xs font-semibold uppercase tracking-widest text-[#B35638] hover:underline flex items-center"
            >
              <BookOpen className="w-4 h-4 mr-1.5" /> View Millet Recipes
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="bg-white p-4 border border-[#E7DED4]">
              <h4 className="text-sm font-semibold text-[#241611]">Korralu (Foxtail)</h4>
              <p className="text-[11px] text-[#B35638] font-medium">Fluffy Rice Texture</p>
              <p className="text-xs text-[#6B5B52] mt-1.5 leading-relaxed">
                Best daily replacement for white rice. Perfect with dal, sambar, and rasam. Soak 30 mins.
              </p>
            </div>
            <div className="bg-white p-4 border border-[#E7DED4]">
              <h4 className="text-sm font-semibold text-[#241611]">Samalu (Little Millet)</h4>
              <p className="text-[11px] text-[#B35638] font-medium">Soft & Fast Cooking</p>
              <p className="text-xs text-[#6B5B52] mt-1.5 leading-relaxed">
                Delicate, melt-in-mouth grains. Ideal for comforting khichdi, idli/dosa, and curd rice.
              </p>
            </div>
            <div className="bg-white p-4 border border-[#E7DED4]">
              <h4 className="text-sm font-semibold text-[#241611]">Arikelu (Kodo Millet)</h4>
              <p className="text-[11px] text-[#B35638] font-medium">Earthy & High Satiety</p>
              <p className="text-xs text-[#6B5B52] mt-1.5 leading-relaxed">
                Hearty grain with deep satisfaction. Excellent for traditional Pongal and Bisi Bele Bath.
              </p>
            </div>
            <div className="bg-white p-4 border border-[#E7DED4]">
              <h4 className="text-sm font-semibold text-[#241611]">Udalu (Barnyard)</h4>
              <p className="text-[11px] text-[#B35638] font-medium">Light Digestibility</p>
              <p className="text-xs text-[#6B5B52] mt-1.5 leading-relaxed">
                Rapidly cooks in 12 mins. Absorbs aromatics gracefully. Great for light pulaos and upmas.
              </p>
            </div>
            <div className="bg-white p-4 border border-[#E7DED4]">
              <h4 className="text-sm font-semibold text-[#241611]">Ragi (Finger Millet)</h4>
              <p className="text-[11px] text-[#B35638] font-medium">Calcium-Dense Powerhouse</p>
              <p className="text-xs text-[#6B5B52] mt-1.5 leading-relaxed">
                The legend of southern homes. Stone-mill for Ragi Mudde, crispy dosas, and breakfast malt.
              </p>
            </div>
            <div className="bg-white p-4 border border-[#E7DED4]">
              <h4 className="text-sm font-semibold text-[#241611]">Jowar (White Sorghum)</h4>
              <p className="text-[11px] text-[#B35638] font-medium">Gluten-Free Flatbreads</p>
              <p className="text-xs text-[#6B5B52] mt-1.5 leading-relaxed">
                Cooling grain yielding soft, hand-patted Jonna Rotte (rotis) to enjoy with spicy curries.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Product Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-center justify-between border-b border-[#E7DED4] pb-3">
          <h2 className="text-lg font-serif font-semibold text-[#241611]">
            All Chiru Dhanyalu ({millets.length} Varieties)
          </h2>
          <span className="text-xs text-[#6B5B52]">Available in 500g and 1kg packs</span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
          {millets.map((millet) => (
            <ProductCard key={millet.id} product={millet} />
          ))}
        </div>
      </section>
    </div>
  );
}
