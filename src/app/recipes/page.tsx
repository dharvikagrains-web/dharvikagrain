'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { recipes } from '@/data/recipes';
import { Clock, ArrowRight, Utensils } from 'lucide-react';

export default function RecipesIndexPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = [
    'All',
    'Breakfast',
    'Lunch',
    'Traditional',
    'Quick Recipes',
  ];

  const filteredRecipes = selectedCategory === 'All'
    ? recipes
    : recipes.filter((r) => r.category === selectedCategory);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10 sm:space-y-12">
      {/* Curved Linen Hero Banner */}
      <div className="relative rounded-[28px] sm:rounded-[36px] bg-[#EDE9E1] border border-[#D5CDBD] p-8 sm:p-12 md:p-14 overflow-hidden shadow-xs">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-white/80 border border-[#D5CDBD] text-[11px] font-semibold text-[#0D3522] uppercase tracking-wider mb-4">
            <Utensils className="w-3.5 h-3.5 text-[#C4924A]" />
            <span>✦ Culinary Heritage</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-[#241611] leading-tight">
            Traditional Millet <br />
            <span className="italic font-normal text-[#0D3522]">Kitchen Recipes</span>
          </h1>
          <p className="text-xs sm:text-sm text-[#6B5B52] mt-3.5 leading-relaxed max-w-xl">
            Wholesome, deeply satisfying, and perfected in everyday Indian homes.
            Transform unpolished grains and pure single-origin spices into comforting breakfasts, hearty lunches, and nourishing dinners.
          </p>

          <div className="mt-5 flex flex-wrap gap-2.5">
            <span className="inline-flex items-center px-3 py-1 rounded-full bg-white/70 border border-[#D5CDBD] text-[11px] font-medium text-[#241611]">
              ⏱️ 15–30 Min Preps
            </span>
            <span className="inline-flex items-center px-3 py-1 rounded-full bg-white/70 border border-[#D5CDBD] text-[11px] font-medium text-[#241611]">
              🥗 High-Fiber Balanced
            </span>
            <span className="inline-flex items-center px-3 py-1 rounded-full bg-white/70 border border-[#D5CDBD] text-[11px] font-medium text-[#241611]">
              🥣 Step-by-Step Cooking
            </span>
          </div>
        </div>

        {/* Ambient glow decoration */}
        <div className="absolute -right-16 -bottom-16 w-80 h-80 rounded-full bg-[#E2DACB]/60 blur-3xl pointer-events-none" />
      </div>

      {/* Pill Category Tabs */}
      <div className="flex items-center justify-start sm:justify-center overflow-x-auto no-scrollbar gap-2 sm:gap-3 pb-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`flex-shrink-0 px-5 py-2.5 rounded-full text-xs font-semibold tracking-wide transition-all ${
              selectedCategory === cat
                ? 'bg-[#0D3522] text-white shadow-sm'
                : 'bg-[#EDE9E1] text-[#6B5B52] hover:bg-[#E3DDD3] hover:text-[#241611] border border-[#D5CDBD]'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Recipe Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
        {filteredRecipes.map((recipe) => (
          <Link
            key={recipe.id}
            href={`/recipes/${recipe.slug}`}
            className="group rounded-[28px] bg-[#EDE9E1] border border-[#D5CDBD] p-3 sm:p-4 hover:shadow-lg transition-all flex flex-col justify-between"
          >
            <div>
              {/* Inner Image Stage */}
              <div className="relative aspect-[16/10] w-full rounded-[22px] overflow-hidden bg-white/70 shadow-2xs">
                <Image
                  src={recipe.image}
                  alt={recipe.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-3 left-3 rounded-full bg-white/90 backdrop-blur-md px-3 py-1 text-[10px] font-bold text-[#0D3522] uppercase tracking-wider border border-[#D5CDBD]/60 shadow-2xs">
                  {recipe.category}
                </span>
              </div>

              {/* Recipe Info */}
              <div className="p-3 sm:p-4">
                <h3 className="text-lg font-serif font-bold text-[#241611] group-hover:text-[#0D3522] transition-colors leading-snug">
                  {recipe.title}
                </h3>
                {recipe.localName && (
                  <p className="text-xs text-[#0D3522] font-semibold mt-0.5">{recipe.localName}</p>
                )}
                <p className="text-xs text-[#6B5B52] mt-2 line-clamp-2 leading-relaxed">
                  {recipe.description}
                </p>
                <div className="mt-3 pt-2.5 border-t border-[#D5CDBD]/60">
                  <span className="text-[11px] text-[#6B5B52] block">
                    Uses: <strong className="text-[#0D3522] font-semibold">{recipe.milletOrSpiceUsed}</strong>
                  </span>
                </div>
              </div>
            </div>

            {/* Bottom meta row */}
            <div className="px-3 sm:px-4 pb-2 pt-2 border-t border-[#D5CDBD]/60 flex items-center justify-between text-xs text-[#8C7A70]">
              <span className="flex items-center text-[#6B5B52]">
                <Clock className="w-3.5 h-3.5 mr-1 text-[#0D3522]" /> {recipe.cookTime}
              </span>
              <span className="font-semibold text-[#0D3522] flex items-center group-hover:translate-x-1 transition-transform">
                View Recipe <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
