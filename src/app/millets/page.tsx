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

const culinaryGuide = [
  {
    name: 'Korralu (Foxtail Millet)',
    telugu: 'కొర్రలు',
    cooking: 'Fluffy Rice Substitute',
    ratio: '1 : 2.5 Water',
    time: '20 mins',
    desc: 'Best daily replacement for polished white rice. Cooks separate and light; pairs beautifully with dal, sambar, and tomato rasam.',
  },
  {
    name: 'Samalu (Little Millet)',
    telugu: 'సామలు',
    cooking: 'Delicate & Soft',
    ratio: '1 : 2.25 Water',
    time: '15 mins',
    desc: 'Smallest grain in the family. Ideal for soft fermented idlis, crispy dosas, and soothing lemon rice.',
  },
  {
    name: 'Arikelu (Kodo Millet)',
    telugu: 'అరికెలు',
    cooking: 'High Satiety Staple',
    ratio: '1 : 3 Water',
    time: '25 mins',
    desc: 'Deep earthy flavour with high natural fiber. Excellent for temple-style Ven Pongal and wholesome Bisi Bele Bath.',
  },
  {
    name: 'Udalu (Barnyard Millet)',
    telugu: 'ఊదలు',
    cooking: 'Fast Cooking',
    ratio: '1 : 2.5 Water',
    time: '12 mins',
    desc: 'Rapidly cooks into tender grains. Rich in iron, light on digestion, and an age-old fasting favorite.',
  },
  {
    name: 'Ragi (Finger Millet)',
    telugu: 'రాగులు',
    cooking: 'Calcium Powerhouse',
    ratio: 'Coarse / Fine Flour',
    time: '10 mins',
    desc: 'Champion of southern culinary heritage (344mg calcium/100g). Traditional base for Ragi Sankati / Mudde and malt.',
  },
  {
    name: 'Jowar (White Sorghum)',
    telugu: 'జొన్నలు',
    cooking: 'Soft Hand-Patted Rotis',
    ratio: 'Stone-Milled Flour',
    time: '15 mins',
    desc: 'Cooling, gluten-free dryland grain yielding soft, nutritious Jonna Rotte to enjoy with roasted brinjal curry.',
  },
];

export default function MilletsPage() {
  const millets = products.filter((p) => p.category === 'millets');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-12 sm:space-y-16">
      {/* Category Hero Banner */}
      <section className="relative rounded-[14px] bg-[#F4EFEA] border border-[#E2D9CE] overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-12 items-center">
          <div className="lg:col-span-7 p-6 sm:p-10 lg:p-12 space-y-4">
            <span className="text-[12px] uppercase tracking-wider font-semibold text-[#9E462A] block font-data">
              Traditional Indian Agriculture
            </span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-semibold text-[#221814] leading-tight">
              Chiru Dhanyalu <br />
              <span className="font-serif italic font-normal text-[#1A382B]">Native Rain-Fed Millets</span>
            </h1>
            <p className="text-sm text-[#685950] leading-relaxed max-w-xl">
              &ldquo;Chiru Dhanyalu&rdquo; is the traditional Telugu honorific for small grains—the resilient, rain-fed staples that sustained the Deccan plateau for generations. Our grains are 100% unpolished, stone-picked, and air-cleaned to protect the natural bran layer.
            </p>

            <div className="pt-2 flex flex-wrap gap-2 text-[12px] text-[#685950]">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-[4px] bg-white border border-[#E2D9CE]">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#1A382B]" /> 100% Unpolished
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-[4px] bg-white border border-[#E2D9CE]">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#1A382B]" /> Zero Chemical Fumigation
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-[4px] bg-white border border-[#E2D9CE]">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#1A382B]" /> Direct Farmer Clusters
              </span>
            </div>
          </div>

          <div className="lg:col-span-5 relative h-64 sm:h-80 lg:h-full min-h-[300px] m-4 sm:m-6 rounded-[10px] overflow-hidden border border-[#E2D9CE]">
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

      {/* Culinary Cooking Matrix */}
      <section>
        <div className="rounded-[14px] bg-[#F4EFEA] border border-[#E2D9CE] p-6 sm:p-10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <span className="text-[12px] uppercase tracking-wider font-semibold text-[#9E462A] block font-data">
                Kitchen Preparation
              </span>
              <h2 className="text-2xl sm:text-3xl font-serif font-semibold text-[#221814] mt-1">
                Quick Cooking & Texture Matrix
              </h2>
              <p className="text-[13px] text-[#685950] mt-1">
                Water ratios, cooking times, and culinary pairings for everyday meals.
              </p>
            </div>
            <Link
              href="/recipes"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-[6px] bg-white border border-[#E2D9CE] text-[13px] font-semibold text-[#1A382B] hover:bg-[#1A382B] hover:text-white transition-all self-start sm:self-auto"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>View Tested Recipes</span>
            </Link>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {culinaryGuide.map((item) => (
              <div
                key={item.name}
                className="rounded-[10px] bg-white border border-[#E2D9CE] p-3 sm:p-5 flex flex-col justify-between hover:border-[#1A382B]/40 transition-colors shadow-2xs"
              >
                <div>
                  <div className="flex items-start justify-between gap-1.5 mb-1.5 sm:mb-2">
                    <div>
                      <span className="font-telugu text-[14px] sm:text-[17px] text-[#9E462A] font-semibold block leading-tight truncate">
                        {item.telugu}
                      </span>
                      <h4 className="text-[13px] sm:text-[15px] font-semibold text-[#221814] mt-0.5 truncate">
                        {item.name}
                      </h4>
                    </div>
                    <span className="text-[9px] sm:text-[10px] font-data font-medium px-1.5 sm:px-2 py-0.5 rounded-[4px] bg-[#FAF7F2] text-[#1A382B] border border-[#E2D9CE] shrink-0">
                      {item.cooking}
                    </span>
                  </div>

                  <p className="text-[11px] sm:text-[12px] text-[#685950] leading-relaxed mt-1 sm:mt-2 line-clamp-2">
                    {item.desc}
                  </p>
                </div>

                <div className="mt-2.5 sm:mt-4 pt-2 sm:pt-3 border-t border-[#F0EAE1] flex items-center justify-between text-[10px] sm:text-[11px] font-data text-[#8C7A70]">
                  <span>Water: <strong className="text-[#221814]">{item.ratio}</strong></span>
                  <span>Cooks: <strong className="text-[#221814]">{item.time}</strong></span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Product Grid */}
      <section>
        <div className="mb-6 flex items-center justify-between border-b border-[#E2D9CE] pb-4">
          <div>
            <h2 className="text-2xl font-serif font-semibold text-[#221814]">
              All Chiru Dhanyalu ({millets.length} Varieties)
            </h2>
            <p className="text-[13px] text-[#685950] mt-0.5">
              Available in 500g and 1kg aroma-barrier packaging
            </p>
          </div>
          <Link
            href="/shop"
            className="text-[13px] font-semibold text-[#1A382B] hover:text-[#9E462A] flex items-center gap-1"
          >
            <span>All Staples</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
          {millets.map((millet) => (
            <ProductCard key={millet.id} product={millet} />
          ))}
        </div>
      </section>
    </div>
  );
}
