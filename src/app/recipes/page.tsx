'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { recipes } from '@/data/recipes';
import { Clock, ArrowRight, Utensils, Sparkles, ChefHat } from 'lucide-react';

export default function RecipesIndexPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [quickFilter, setQuickFilter] = useState<string>('all');

  const categories = [
    'All',
    'Breakfast',
    'Lunch',
    'Traditional',
    'Quick Recipes',
  ];

  const filteredRecipes = recipes.filter((r) => {
    if (selectedCategory !== 'All' && r.category !== selectedCategory) {
      return false;
    }
    if (quickFilter === 'quick') {
      const minutes = parseInt(r.cookTime, 10);
      if (minutes > 20) return false;
    }
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10 sm:space-y-12 pb-20">
      {/* Visual & Interactive Asymmetric Split Hero Banner */}
      <section className="relative rounded-[14px] bg-[#F4EFEA] border border-[#E2D9CE] overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-12 items-center">
          {/* Left Column: Culinary Copy & Interactive Tags */}
          <div className="lg:col-span-7 p-6 sm:p-10 lg:p-12 space-y-5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[12px] uppercase tracking-wider font-semibold text-[#9E462A] font-data">
                Culinary Heritage
              </span>
              <span className="text-[11px] text-[#8C7A70]">·</span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-[4px] bg-white text-[#1A382B] border border-[#E2D9CE] text-[11px] font-data font-medium">
                <ChefHat className="w-3.5 h-3.5 text-[#1A382B]" />
                {recipes.length} Tested Kitchen Recipes
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-semibold text-[#221814] leading-tight">
              Traditional Millet <br />
              <span className="font-serif italic font-normal text-[#1A382B]">Kitchen Recipes</span>
            </h1>

            <p className="text-sm text-[#685950] leading-relaxed max-w-xl">
              Wholesome, deeply satisfying, and perfected in everyday Indian homes. Transform unpolished grains and pure single-origin spices into comforting breakfasts, hearty lunches, and nourishing dinners.
            </p>

            {/* Interactive Recipe Filter Tags */}
            <div className="pt-1">
              <span className="text-[11px] uppercase tracking-wider text-[#8C7A70] font-data font-semibold block mb-2">
                Filter by Meal Style:
              </span>
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedCategory('Breakfast');
                    setQuickFilter('all');
                  }}
                  className={`px-3 py-1.5 rounded-[6px] text-[12px] font-medium transition-all border flex items-center gap-1.5 ${
                    selectedCategory === 'Breakfast'
                      ? 'bg-[#1A382B] text-white border-[#1A382B] shadow-2xs'
                      : 'bg-white text-[#221814] border-[#E2D9CE] hover:border-[#1A382B]/60'
                  }`}
                >
                  <span>🥞</span>
                  <span>Breakfast Staples</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setSelectedCategory('Traditional');
                    setQuickFilter('all');
                  }}
                  className={`px-3 py-1.5 rounded-[6px] text-[12px] font-medium transition-all border flex items-center gap-1.5 ${
                    selectedCategory === 'Traditional'
                      ? 'bg-[#1A382B] text-white border-[#1A382B] shadow-2xs'
                      : 'bg-white text-[#221814] border-[#E2D9CE] hover:border-[#1A382B]/60'
                  }`}
                >
                  <span>🍲</span>
                  <span>One-Pot Comfort</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setQuickFilter(quickFilter === 'quick' ? 'all' : 'quick');
                    setSelectedCategory('All');
                  }}
                  className={`px-3 py-1.5 rounded-[6px] text-[12px] font-medium transition-all border flex items-center gap-1.5 ${
                    quickFilter === 'quick'
                      ? 'bg-[#1A382B] text-white border-[#1A382B] shadow-2xs'
                      : 'bg-white text-[#221814] border-[#E2D9CE] hover:border-[#1A382B]/60'
                  }`}
                >
                  <span>⚡</span>
                  <span>15–20 Min Preps</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setSelectedCategory('All');
                    setQuickFilter('all');
                  }}
                  className={`px-3 py-1.5 rounded-[6px] text-[12px] font-medium transition-all border flex items-center gap-1.5 ${
                    selectedCategory === 'All' && quickFilter === 'all'
                      ? 'bg-[#1A382B] text-white border-[#1A382B] shadow-2xs'
                      : 'bg-white text-[#221814] border-[#E2D9CE] hover:border-[#1A382B]/60'
                  }`}
                >
                  <span>🌾</span>
                  <span>View All Recipes</span>
                </button>
              </div>
            </div>

            {/* Preparation Attributes */}
            <div className="pt-2 flex flex-wrap gap-2 text-[11px] text-[#685950] font-data">
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-[4px] bg-white border border-[#E2D9CE]">
                ⏱️ 15–30 Min Preps
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-[4px] bg-white border border-[#E2D9CE]">
                🥗 High-Fiber Balanced
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-[4px] bg-white border border-[#E2D9CE]">
                🥣 Tested in Indian Homes
              </span>
            </div>
          </div>

          {/* Right Column: Visual Appetite Showcase Image */}
          <div className="lg:col-span-5 relative h-64 sm:h-80 lg:h-full min-h-[300px] m-4 sm:m-6 rounded-[10px] overflow-hidden border border-[#E2D9CE] group bg-white shadow-2xs">
            <Image
              src="/images/recipes/foxtail-millet-upma.jpg"
              alt="Steaming hot foxtail millet upma prepared with mustard seeds and curry leaves"
              fill
              priority
              className="object-cover card-image-zoom"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#140E0A]/70 via-transparent to-transparent" />
            <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-white text-[11px] font-data z-10">
              <span className="bg-[#1A382B]/90 backdrop-blur-xs px-2.5 py-1 rounded-[4px] border border-white/20">
                Featured: Korralu Upma
              </span>
              <span className="text-[#FAF7F2]/90 flex items-center gap-1">
                <Clock className="w-3 h-3 text-[#86EFAC]" /> 20 mins
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Category Segmented Tabs */}
      <div className="flex items-center overflow-x-auto no-scrollbar gap-2 pb-1">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => {
              setSelectedCategory(cat);
              setQuickFilter('all');
            }}
            className={`flex-shrink-0 px-4 py-2 rounded-[6px] text-[13px] font-medium transition-all ${
              selectedCategory === cat && quickFilter === 'all'
                ? 'bg-[#1A382B] text-white shadow-2xs'
                : 'bg-white text-[#685950] hover:text-[#221814] border border-[#E2D9CE]'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Recipe Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredRecipes.map((recipe) => (
          <Link
            key={recipe.id}
            href={`/recipes/${recipe.slug}`}
            className="group rounded-[10px] bg-white border border-[#E2D9CE] p-3 sm:p-4 hover:border-[#1A382B]/40 hover:shadow-sm transition-all flex flex-col justify-between"
          >
            <div>
              {/* Inner Image Stage */}
              <div className="relative aspect-[16/10] w-full rounded-[6px] overflow-hidden bg-[#FAF7F2]">
                <Image
                  src={recipe.image}
                  alt={recipe.title}
                  fill
                  className="object-cover card-image-zoom"
                />
                <span className="absolute top-2.5 left-2.5 rounded-[4px] bg-white/95 px-2.5 py-0.5 text-[10px] font-data font-semibold text-[#1A382B] uppercase tracking-wider border border-[#E2D9CE] shadow-2xs">
                  {recipe.category}
                </span>
              </div>

              {/* Recipe Info */}
              <div className="pt-3 pb-1 space-y-1">
                {recipe.localName && (
                  <p className="font-telugu text-[12px] text-[#9E462A] font-medium">
                    {recipe.localName}
                  </p>
                )}
                <h3 className="text-[16px] font-semibold text-[#221814] group-hover:text-[#1A382B] transition-colors leading-snug font-dmsans">
                  {recipe.title}
                </h3>
                <p className="text-[12px] text-[#685950] line-clamp-2 leading-relaxed mt-1">
                  {recipe.description}
                </p>
              </div>
            </div>

            {/* Bottom Meta */}
            <div className="pt-3 mt-3 border-t border-[#F0EAE1] flex items-center justify-between text-[11px] font-data text-[#8C7A70]">
              <span className="flex items-center gap-1 text-[#221814]">
                <Clock className="w-3.5 h-3.5 text-[#1A382B]" /> {recipe.cookTime}
              </span>
              <span>Serves {recipe.servings}</span>
              <span className="text-[#1A382B] font-semibold group-hover:translate-x-0.5 transition-transform flex items-center gap-0.5">
                <span>Recipe</span>
                <ArrowRight className="w-3 h-3" />
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
