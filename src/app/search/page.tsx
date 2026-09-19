'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { products } from '@/data/products';
import { recipes } from '@/data/recipes';
import { journalArticles } from '@/data/journal';
import { Search, X, ArrowRight, Sparkles, ChefHat, BookOpen, ShoppingBag } from 'lucide-react';

const popularSearches = ['Korralu', 'Ragi', 'Turmeric', 'Samalu', 'Deccan Masala', 'Combos', 'Foxtail Upma'];

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'products' | 'recipes' | 'articles'>('all');
  const [recentSearches, setRecentSearches] = useState<string[]>([
    'Foxtail Millet',
    'Pure Cumin Seeds',
    'Kodo Pongal',
  ]);

  // Search logic with simple typo tolerance / prefix & substring matching
  const results = useMemo(() => {
    const clean = query.trim().toLowerCase();
    if (!clean) return { products: [], recipes: [], articles: [] };

    // Substring / word matching
    const matchedProducts = products.filter(
      (p) =>
        p.name.toLowerCase().includes(clean) ||
        p.localName.toLowerCase().includes(clean) ||
        p.category.toLowerCase().includes(clean) ||
        p.shortDescription.toLowerCase().includes(clean) ||
        p.ingredients.some((i) => i.toLowerCase().includes(clean))
    );

    const matchedRecipes = recipes.filter(
      (r) =>
        r.title.toLowerCase().includes(clean) ||
        (r.localName && r.localName.toLowerCase().includes(clean)) ||
        r.milletOrSpiceUsed.toLowerCase().includes(clean) ||
        r.ingredients.some((i) => i.toLowerCase().includes(clean))
    );

    const matchedArticles = journalArticles.filter(
      (a) =>
        a.title.toLowerCase().includes(clean) ||
        a.excerpt.toLowerCase().includes(clean) ||
        a.tags.some((t) => t.toLowerCase().includes(clean))
    );

    return {
      products: matchedProducts,
      recipes: matchedRecipes,
      articles: matchedArticles,
    };
  }, [query]);

  const totalResults =
    results.products.length + results.recipes.length + results.articles.length;

  const handleSelectSearch = (term: string) => {
    setQuery(term);
    if (!recentSearches.includes(term)) {
      setRecentSearches((prev) => [term, ...prev.slice(0, 4)]);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-10">
      {/* Header & Search Bar */}
      <div className="max-w-3xl mx-auto text-center space-y-6">
        <span className="text-xs uppercase tracking-widest font-semibold text-[#B35638]">
          Find Your Heritage Pantry
        </span>
        <h1 className="text-3xl sm:text-5xl font-serif font-bold text-[#0D3522]">
          Search Dharvika Grains
        </h1>

        <div className="relative">
          <div className="relative flex items-center">
            <Search className="w-5 h-5 text-[#6B5B52] absolute left-4 pointer-events-none" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by grain, spice, recipe (e.g., 'Ragi', 'Turmeric', 'Upma')..."
              className="w-full bg-white border-2 border-[#E7DED4] focus:border-[#0D3522] py-4 pl-12 pr-12 text-sm sm:text-base text-[#241611] rounded-xs shadow-xs focus:outline-none transition-all"
              autoFocus
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery('')}
                className="absolute right-4 p-1 text-[#6B5B52] hover:text-[#241611]"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

        {/* Popular & Recent searches chips */}
        {!query && (
          <div className="space-y-4 pt-2 text-left bg-white border border-[#E7DED4] p-6">
            <div>
              <span className="text-[10px] tracking-widest uppercase font-bold text-[#6B5B52] block mb-2">
                Popular Searches
              </span>
              <div className="flex flex-wrap gap-2">
                {popularSearches.map((term) => (
                  <button
                    key={term}
                    type="button"
                    onClick={() => handleSelectSearch(term)}
                    className="px-3 py-1.5 bg-[#FAF7F2] border border-[#E7DED4] text-xs text-[#241611] hover:border-[#0D3522] hover:text-[#0D3522] transition-colors rounded-xs"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>

            {recentSearches.length > 0 && (
              <div className="pt-3 border-t border-[#E7DED4]">
                <span className="text-[10px] tracking-widest uppercase font-bold text-[#6B5B52] block mb-2">
                  Recent Searches
                </span>
                <div className="flex flex-wrap gap-2">
                  {recentSearches.map((term) => (
                    <button
                      key={term}
                      type="button"
                      onClick={() => handleSelectSearch(term)}
                      className="px-3 py-1 bg-[#F5EFEB] text-xs text-[#6B5B52] hover:text-[#241611] transition-colors rounded-xs"
                    >
                      {term}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Results Section */}
      {query && (
        <div className="space-y-8">
          {/* Filter Tabs */}
          <div className="flex items-center justify-between border-b border-[#E7DED4] pb-4">
            <div className="flex items-center space-x-2 sm:space-x-4">
              <button
                type="button"
                onClick={() => setActiveFilter('all')}
                className={`px-3 py-1.5 text-xs font-semibold uppercase tracking-wider transition-colors ${
                  activeFilter === 'all'
                    ? 'bg-[#0D3522] text-white'
                    : 'text-[#6B5B52] hover:text-[#241611]'
                }`}
              >
                All ({totalResults})
              </button>
              <button
                type="button"
                onClick={() => setActiveFilter('products')}
                className={`px-3 py-1.5 text-xs font-semibold uppercase tracking-wider transition-colors ${
                  activeFilter === 'products'
                    ? 'bg-[#0D3522] text-white'
                    : 'text-[#6B5B52] hover:text-[#241611]'
                }`}
              >
                Products ({results.products.length})
              </button>
              <button
                type="button"
                onClick={() => setActiveFilter('recipes')}
                className={`px-3 py-1.5 text-xs font-semibold uppercase tracking-wider transition-colors ${
                  activeFilter === 'recipes'
                    ? 'bg-[#0D3522] text-white'
                    : 'text-[#6B5B52] hover:text-[#241611]'
                }`}
              >
                Recipes ({results.recipes.length})
              </button>
              <button
                type="button"
                onClick={() => setActiveFilter('articles')}
                className={`px-3 py-1.5 text-xs font-semibold uppercase tracking-wider transition-colors ${
                  activeFilter === 'articles'
                    ? 'bg-[#0D3522] text-white'
                    : 'text-[#6B5B52] hover:text-[#241611]'
                }`}
              >
                Journal ({results.articles.length})
              </button>
            </div>
            <p className="text-xs text-[#6B5B52]">
              Showing results for &ldquo;<strong>{query}</strong>&rdquo;
            </p>
          </div>

          {totalResults === 0 ? (
            <div className="text-center py-16 bg-white border border-[#E7DED4] p-8 space-y-3 max-w-lg mx-auto">
              <p className="text-lg font-serif text-[#241611]">No matches found for &ldquo;{query}&rdquo;</p>
              <p className="text-xs text-[#6B5B52]">
                Try checking for spelling or searching with broader terms like &ldquo;millet&rdquo;, &ldquo;spice&rdquo;, or &ldquo;masala&rdquo;.
              </p>
            </div>
          ) : (
            <div className="space-y-12">
              {/* Matched Products */}
              {(activeFilter === 'all' || activeFilter === 'products') && results.products.length > 0 && (
                <div className="space-y-4">
                  <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-[#0D3522]">
                    <ShoppingBag className="w-4 h-4 text-[#C5A059]" />
                    <span>Products ({results.products.length})</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {results.products.map((p) => (
                      <Link
                        key={p.id}
                        href={`/products/${p.slug}`}
                        className="bg-white border border-[#E7DED4] p-4 flex flex-col justify-between group hover:border-[#C5A059] transition-all"
                      >
                        <div>
                          <div className="relative aspect-square bg-[#FAF7F2] overflow-hidden mb-3">
                            <Image
                              src={p.images[0]}
                              alt={p.name}
                              fill
                              className="object-cover group-hover:scale-105 transition-transform"
                            />
                          </div>
                          <span className="text-[10px] tracking-widest uppercase font-semibold text-[#C5A059]">
                            {p.category}
                          </span>
                          <h3 className="text-sm font-serif font-bold text-[#241611] group-hover:text-[#0D3522] transition-colors line-clamp-1">
                            {p.name}
                          </h3>
                          <p className="text-[11px] text-[#6B5B52] italic line-clamp-1">{p.localName}</p>
                        </div>
                        <div className="mt-4 pt-3 border-t border-[#E7DED4] flex items-center justify-between">
                          <span className="text-sm font-bold text-[#0D3522]">₹{p.weights[0].price}</span>
                          <span className="text-[11px] text-[#C5A059] font-semibold group-hover:underline">
                            View &rarr;
                          </span>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Matched Recipes */}
              {(activeFilter === 'all' || activeFilter === 'recipes') && results.recipes.length > 0 && (
                <div className="space-y-4">
                  <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-[#0D3522]">
                    <ChefHat className="w-4 h-4 text-[#C5A059]" />
                    <span>Recipes ({results.recipes.length})</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    {results.recipes.map((r) => (
                      <Link
                        key={r.id}
                        href={`/recipes/${r.slug}`}
                        className="bg-white border border-[#E7DED4] p-4 flex flex-col justify-between group hover:border-[#C5A059] transition-all"
                      >
                        <div className="relative aspect-video bg-[#FAF7F2] overflow-hidden mb-3">
                          <Image
                            src={r.image}
                            alt={r.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform"
                          />
                        </div>
                        <div>
                          <span className="text-[10px] tracking-widest text-[#B35638] uppercase font-semibold">
                            {r.category} • {r.cookTime}
                          </span>
                          <h3 className="text-sm font-serif font-bold text-[#241611] group-hover:text-[#0D3522] transition-colors mt-1">
                            {r.title}
                          </h3>
                          <p className="text-xs text-[#6B5B52] line-clamp-2 mt-1">{r.description}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Matched Articles */}
              {(activeFilter === 'all' || activeFilter === 'articles') && results.articles.length > 0 && (
                <div className="space-y-4">
                  <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-[#0D3522]">
                    <BookOpen className="w-4 h-4 text-[#C5A059]" />
                    <span>Kitchen Journal ({results.articles.length})</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    {results.articles.map((a) => (
                      <Link
                        key={a.id}
                        href={`/journal/${a.slug}`}
                        className="bg-white border border-[#E7DED4] p-5 space-y-2 group hover:border-[#C5A059] transition-all"
                      >
                        <span className="text-[10px] tracking-widest uppercase font-semibold text-[#C5A059]">
                          {a.category} • {a.readTime}
                        </span>
                        <h3 className="text-base font-serif font-bold text-[#241611] group-hover:text-[#0D3522] transition-colors">
                          {a.title}
                        </h3>
                        <p className="text-xs text-[#6B5B52] line-clamp-2">{a.excerpt}</p>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
