'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { products } from '@/data/products';
import { recipes } from '@/data/recipes';
import { journalArticles } from '@/data/journal';
import { formatCurrency } from '@/lib/utils';
import { Search, X, ArrowUpRight, BookOpen, Utensils } from 'lucide-react';

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SearchOverlay({ isOpen, onClose }: SearchOverlayProps) {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
      setQuery('');
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Handle ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!isOpen) return null;

  const cleanQuery = query.toLowerCase().trim();

  const matchingProducts = cleanQuery
    ? products.filter(
        (p) =>
          p.name.toLowerCase().includes(cleanQuery) ||
          p.localName.toLowerCase().includes(cleanQuery) ||
          p.shortDescription.toLowerCase().includes(cleanQuery) ||
          p.category.toLowerCase().includes(cleanQuery) ||
          p.ingredients.some((i) => i.toLowerCase().includes(cleanQuery))
      )
    : [];

  const matchingRecipes = cleanQuery
    ? recipes.filter(
        (r) =>
          r.title.toLowerCase().includes(cleanQuery) ||
          (r.localName && r.localName.toLowerCase().includes(cleanQuery)) ||
          r.milletOrSpiceUsed.toLowerCase().includes(cleanQuery) ||
          r.description.toLowerCase().includes(cleanQuery)
      )
    : [];

  const matchingArticles = cleanQuery
    ? journalArticles.filter(
        (a) =>
          a.title.toLowerCase().includes(cleanQuery) ||
          a.excerpt.toLowerCase().includes(cleanQuery) ||
          a.tags.some((t) => t.toLowerCase().includes(cleanQuery))
      )
    : [];

  const hasResults =
    matchingProducts.length > 0 || matchingRecipes.length > 0 || matchingArticles.length > 0;

  const popularSearches = [
    'Korralu',
    'Foxtail Millet',
    'Samalu',
    'Pure Turmeric',
    'Malabar Pepper',
    'Signature Masala',
    'Dosa Recipe',
    'Ragi Mudde',
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[#1E120D]/80 backdrop-blur-sm p-4 sm:p-6 md:p-10 flex justify-center items-start">
      <div className="w-full max-w-3xl bg-[#FAF7F2] rounded-none border border-[#E7DED4] shadow-2xl overflow-hidden mt-6 sm:mt-12">
        {/* Search Input Bar */}
        <div className="relative border-b border-[#E7DED4] p-4 sm:p-6 bg-white flex items-center">
          <Search className="w-6 h-6 text-[#6B5B52] mr-3 stroke-[1.5]" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search grains, spices, recipes, or articles (e.g. Korralu, Turmeric)..."
            className="w-full text-base sm:text-lg text-[#241611] placeholder-[#9E8E84] bg-transparent focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1.5 text-[#6B5B52] hover:text-[#241611] mr-2"
              aria-label="Clear search input"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="p-2 text-[#6B5B52] hover:text-[#B35638] transition-colors"
            aria-label="Close search overlay"
          >
            <span className="text-xs uppercase font-bold tracking-widest hidden sm:inline mr-1">ESC</span>
            <X className="w-6 h-6 inline stroke-[1.5]" />
          </button>
        </div>

        {/* Search Body */}
        <div className="max-h-[70vh] overflow-y-auto p-6 space-y-8">
          {!query && (
            <div>
              <p className="text-xs uppercase tracking-widest font-semibold text-[#6B5B52] mb-3">
                Suggested Searches
              </p>
              <div className="flex flex-wrap gap-2">
                {popularSearches.map((item) => (
                  <button
                    key={item}
                    onClick={() => setQuery(item)}
                    className="text-xs bg-[#F5EFEB] hover:bg-[#E8DFD5] text-[#241611] px-3.5 py-1.5 border border-[#E7DED4] transition-colors"
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
          )}

          {query && !hasResults && (
            <div className="text-center py-12">
              <p className="text-base text-[#241611] font-serif">No matches found for &ldquo;{query}&rdquo;</p>
              <p className="text-xs text-[#6B5B52] mt-2">
                Try searching for specific grain names like Korralu, Samalu, Arikelu, or spices like Turmeric or Pepper.
              </p>
            </div>
          )}

          {/* Product Results */}
          {matchingProducts.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-3 border-b border-[#E7DED4] pb-2">
                <span className="text-xs uppercase tracking-widest font-semibold text-[#241611]">
                  Products ({matchingProducts.length})
                </span>
                <Link
                  href="/shop"
                  onClick={onClose}
                  className="text-xs text-[#B35638] hover:underline flex items-center font-medium"
                >
                  View All Shop <ArrowUpRight className="w-3 h-3 ml-1" />
                </Link>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {matchingProducts.map((p) => (
                  <Link
                    key={p.id}
                    href={`/products/${p.slug}`}
                    onClick={onClose}
                    className="group flex items-center space-x-3 p-2.5 bg-white border border-[#E7DED4] hover:border-[#B35638] transition-all"
                  >
                    <div className="w-14 h-14 relative bg-[#F5EFEB] flex-shrink-0 overflow-hidden">
                      <Image
                        src={p.images[0]}
                        alt={p.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs text-[#B35638] uppercase tracking-wider font-semibold">
                        {p.category}
                      </p>
                      <h4 className="text-sm font-semibold text-[#241611] truncate group-hover:text-[#B35638]">
                        {p.name}
                      </h4>
                      <p className="text-[11px] text-[#6B5B52] truncate">{p.localName}</p>
                      <p className="text-xs font-medium text-[#241611] mt-0.5">
                        {formatCurrency(p.weights[0].price)} <span className="text-[10px] text-[#6B5B52]">/ {p.weights[0].size}</span>
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Recipe Results */}
          {matchingRecipes.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-3 border-b border-[#E7DED4] pb-2">
                <span className="text-xs uppercase tracking-widest font-semibold text-[#241611] flex items-center">
                  <Utensils className="w-3.5 h-3.5 mr-1.5 text-[#B35638]" /> Recipes ({matchingRecipes.length})
                </span>
                <Link
                  href="/recipes"
                  onClick={onClose}
                  className="text-xs text-[#B35638] hover:underline flex items-center font-medium"
                >
                  All Recipes <ArrowUpRight className="w-3 h-3 ml-1" />
                </Link>
              </div>
              <div className="space-y-2">
                {matchingRecipes.map((r) => (
                  <Link
                    key={r.id}
                    href={`/recipes/${r.slug}`}
                    onClick={onClose}
                    className="group block p-3 bg-white border border-[#E7DED4] hover:border-[#B35638] transition-all"
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-semibold text-[#241611] group-hover:text-[#B35638]">
                        {r.title}
                      </h4>
                      <span className="text-[11px] text-[#6B5B52]">{r.cookTime}</span>
                    </div>
                    <p className="text-xs text-[#6B5B52] mt-1 line-clamp-1">{r.description}</p>
                    <span className="inline-block mt-1 text-[10px] uppercase tracking-wider font-semibold text-[#C4924A]">
                      Uses: {r.milletOrSpiceUsed}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Journal Results */}
          {matchingArticles.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-3 border-b border-[#E7DED4] pb-2">
                <span className="text-xs uppercase tracking-widest font-semibold text-[#241611] flex items-center">
                  <BookOpen className="w-3.5 h-3.5 mr-1.5 text-[#B35638]" /> Kitchen Journal ({matchingArticles.length})
                </span>
                <Link
                  href="/journal"
                  onClick={onClose}
                  className="text-xs text-[#B35638] hover:underline flex items-center font-medium"
                >
                  All Articles <ArrowUpRight className="w-3 h-3 ml-1" />
                </Link>
              </div>
              <div className="space-y-2">
                {matchingArticles.map((a) => (
                  <Link
                    key={a.id}
                    href={`/journal/${a.slug}`}
                    onClick={onClose}
                    className="group block p-3 bg-white border border-[#E7DED4] hover:border-[#B35638] transition-all"
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-semibold text-[#241611] group-hover:text-[#B35638]">
                        {a.title}
                      </h4>
                      <span className="text-[11px] text-[#6B5B52]">{a.readTime}</span>
                    </div>
                    <p className="text-xs text-[#6B5B52] mt-1 line-clamp-1">{a.excerpt}</p>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
