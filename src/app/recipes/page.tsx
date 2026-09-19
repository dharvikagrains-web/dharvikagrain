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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-10">
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="text-xs uppercase tracking-widest font-bold text-[#B35638]">
          Culinary Heritage
        </span>
        <h1 className="text-3xl sm:text-5xl font-serif font-semibold text-[#241611]">
          Traditional Millet Recipes
        </h1>
        <p className="text-xs sm:text-sm text-[#6B5B52] leading-relaxed">
          Wholesome, delicious, and tested in everyday Indian family kitchens.
          Transform unpolished grains and pure spices into comforting breakfasts, hearty lunches, and nourishing dinners.
        </p>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center justify-center flex-wrap gap-2 pb-2 border-b border-[#E7DED4]">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 text-xs uppercase tracking-wider font-semibold transition-all ${
              selectedCategory === cat
                ? 'bg-[#241611] text-white'
                : 'bg-white text-[#6B5B52] hover:bg-[#F5EFEB] border border-[#E7DED4]'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Recipe Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredRecipes.map((recipe) => (
          <Link
            key={recipe.id}
            href={`/recipes/${recipe.slug}`}
            className="group bg-white border border-[#E7DED4] hover:border-[#B35638] transition-all flex flex-col h-full"
          >
            <div className="relative aspect-16/10 w-full bg-[#F5EFEB] overflow-hidden">
              <Image
                src={recipe.image}
                alt={recipe.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <span className="absolute top-3 left-3 bg-[#241611] text-white text-[10px] uppercase font-bold tracking-wider px-2.5 py-1">
                {recipe.category}
              </span>
            </div>

            <div className="p-6 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="text-lg font-serif font-semibold text-[#241611] group-hover:text-[#B35638] transition-colors leading-snug">
                  {recipe.title}
                </h3>
                {recipe.localName && (
                  <p className="text-xs text-[#B35638] font-medium mt-0.5">{recipe.localName}</p>
                )}
                <p className="text-xs text-[#7A6B62] mt-2 line-clamp-2 leading-relaxed">
                  {recipe.description}
                </p>
                <div className="mt-3 pt-2 border-t border-[#F0E8DF]">
                  <span className="text-[11px] text-[#6B5B52] block">
                    Uses: <strong className="text-[#241611]">{recipe.milletOrSpiceUsed}</strong>
                  </span>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-[#F0E8DF] flex items-center justify-between text-xs text-[#8C7A70]">
                <span className="flex items-center">
                  <Clock className="w-3.5 h-3.5 mr-1" /> {recipe.cookTime}
                </span>
                <span className="font-semibold text-[#241611] flex items-center group-hover:text-[#B35638]">
                  View Recipe <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
