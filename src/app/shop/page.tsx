'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { products } from '@/data/products';
import { ProductCategory } from '@/types';
import { ProductCard } from '@/components/product/ProductCard';
import { SlidersHorizontal, Search, RotateCcw, Sparkles, Filter, X } from 'lucide-react';

export default function ShopPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('featured');
  const [selectedWeight, setSelectedWeight] = useState<string>('all');
  const [selectedDietary, setSelectedDietary] = useState<string>('all');
  const [inStockOnly, setInStockOnly] = useState<boolean>(false);
  const [maxPrice, setMaxPrice] = useState<number>(1000);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState<boolean>(false);

  const categories = [
    { id: 'all', label: 'All Provisions' },
    { id: 'millets', label: 'Millets (Chiru Dhanyalu)' },
    { id: 'spices', label: 'Pure Spices' },
    { id: 'masalas', label: 'Signature Masalas' },
    { id: 'combos', label: 'Curated Combos' },
  ];

  const dietaryOptions = [
    'Gluten-Free',
    'Low Glycemic Index',
    'High Fiber',
    'Single-Origin',
    'Cold-Ground',
    'Stone-Picked Purity',
    '100% Unpolished',
  ];

  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        // Search
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const match =
            p.name.toLowerCase().includes(q) ||
            p.localName.toLowerCase().includes(q) ||
            p.description.toLowerCase().includes(q);
          if (!match) return false;
        }

        // Category filter
        if (selectedCategory !== 'all') {
          if (selectedCategory === 'masalas') {
            if (p.category !== 'masalas' && p.category !== 'signature') return false;
          } else if (p.category !== selectedCategory) {
            return false;
          }
        }

        // Weight filter
        if (selectedWeight !== 'all' && !p.weights.some((w) => w.size === selectedWeight)) {
          return false;
        }

        // Dietary preference filter
        if (selectedDietary !== 'all') {
          const hasPref = p.dietaryPreferences?.some(
            (pref) => pref.toLowerCase() === selectedDietary.toLowerCase()
          );
          if (!hasPref) return false;
        }

        // Price filter
        if (p.weights[0].price > maxPrice) {
          return false;
        }

        // In stock filter
        if (inStockOnly && !p.weights.some((w) => w.inStock)) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price-asc') {
          return a.weights[0].price - b.weights[0].price;
        }
        if (sortBy === 'price-desc') {
          return b.weights[0].price - a.weights[0].price;
        }
        if (sortBy === 'bestseller') {
          return (b.bestseller ? 1 : 0) - (a.bestseller ? 1 : 0);
        }
        if (sortBy === 'newest') {
          return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
        }
        if (sortBy === 'name') {
          return a.name.localeCompare(b.name);
        }
        // default 'featured'
        return (b.bestseller ? 1 : 0) - (a.bestseller ? 1 : 0);
      });
  }, [selectedCategory, searchQuery, sortBy, selectedWeight, selectedDietary, inStockOnly, maxPrice]);

  const resetAllFilters = () => {
    setSelectedCategory('all');
    setSearchQuery('');
    setSelectedWeight('all');
    setSelectedDietary('all');
    setMaxPrice(1000);
    setInStockOnly(false);
    setSortBy('featured');
  };

  const activeFiltersCount =
    (selectedCategory !== 'all' ? 1 : 0) +
    (selectedWeight !== 'all' ? 1 : 0) +
    (selectedDietary !== 'all' ? 1 : 0) +
    (inStockOnly ? 1 : 0) +
    (maxPrice < 1000 ? 1 : 0) +
    (searchQuery.trim() ? 1 : 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Curved Linen Hero Banner */}
      <div className="relative rounded-[28px] sm:rounded-[36px] bg-[#EDE9E1] border border-[#D5CDBD] p-8 sm:p-12 md:p-14 mb-8 sm:mb-10 overflow-hidden shadow-xs">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/80 border border-[#D5CDBD] text-[11px] font-semibold text-[#0D3522] uppercase tracking-wider mb-4">
            <Sparkles className="w-3 h-3 text-[#C4924A]" />
            <span>✦ The Complete Harvest</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-[#241611] leading-tight">
            Pure Millets & <br className="hidden sm:inline" />
            <span className="italic font-normal text-[#0D3522]">Single-Origin Spices</span>
          </h1>
          <p className="text-xs sm:text-sm text-[#6B5B52] mt-3.5 leading-relaxed max-w-xl">
            Authentic, 100% unpolished Indian millets and direct single-origin spices.
            Harvested from traditional dryland farmer clusters with verifiable batch transparency.
          </p>

          <div className="mt-5 flex flex-wrap gap-2.5">
            <span className="inline-flex items-center px-3 py-1 rounded-full bg-white/70 border border-[#D5CDBD] text-[11px] font-medium text-[#241611]">
              🌾 100% Unpolished
            </span>
            <span className="inline-flex items-center px-3 py-1 rounded-full bg-white/70 border border-[#D5CDBD] text-[11px] font-medium text-[#241611]">
              🌿 Zero Additives
            </span>
            <span className="inline-flex items-center px-3 py-1 rounded-full bg-white/70 border border-[#D5CDBD] text-[11px] font-medium text-[#241611]">
              🧪 Lab Tested Batches
            </span>
          </div>
        </div>

        {/* Ambient glow decoration */}
        <div className="absolute -right-16 -bottom-16 w-80 h-80 rounded-full bg-[#E2DACB]/60 blur-3xl pointer-events-none" />
      </div>

      {/* Pill Category Tabs */}
      <div className="flex items-center justify-start sm:justify-center overflow-x-auto no-scrollbar gap-2 sm:gap-3 mb-8 pb-2">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`flex-shrink-0 px-5 py-2.5 rounded-full text-xs font-semibold tracking-wide transition-all ${
              selectedCategory === cat.id
                ? 'bg-[#0D3522] text-white shadow-sm'
                : 'bg-[#EDE9E1] text-[#6B5B52] hover:bg-[#E3DDD3] hover:text-[#241611] border border-[#D5CDBD]'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Floating Control & Filter Container */}
      <div className="rounded-[28px] bg-[#EDE9E1]/80 backdrop-blur-sm border border-[#D5CDBD] p-4 sm:p-5 mb-8 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Pill Search bar */}
          <div className="relative w-full md:w-88">
            <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-[#8C7A70]" />
            <input
              type="text"
              placeholder="Search grains, spices, or health benefits..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-9 py-2.5 text-xs bg-white/90 rounded-full border border-[#D5CDBD] text-[#241611] placeholder:text-[#8C7A70] focus:outline-none focus:border-[#0D3522] shadow-2xs"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#8C7A70] hover:text-[#241611]"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Sort & Mobile Filter Trigger */}
          <div className="flex items-center justify-between w-full md:w-auto gap-3">
            <button
              type="button"
              onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}
              className="md:hidden px-4 py-2.5 bg-white/90 rounded-full border border-[#D5CDBD] text-xs font-semibold text-[#241611] flex items-center space-x-2"
            >
              <Filter className="w-3.5 h-3.5 text-[#0D3522]" />
              <span>Filters {activeFiltersCount > 0 && `(${activeFiltersCount})`}</span>
            </button>

            <div className="flex items-center space-x-2 text-xs">
              <span className="text-[#6B5B52] hidden sm:inline font-medium">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-white/90 rounded-full border border-[#D5CDBD] px-4 py-2 text-xs text-[#241611] focus:outline-none font-semibold cursor-pointer shadow-2xs"
              >
                <option value="featured">Popular / Featured</option>
                <option value="bestseller">Bestsellers First</option>
                <option value="newest">New Harvest / Newest</option>
                <option value="price-asc">Price: Low → High</option>
                <option value="price-desc">Price: High → Low</option>
                <option value="name">Product Name (A-Z)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Detailed Filters Row */}
        <div className={`pt-4 border-t border-[#D5CDBD]/70 ${isMobileFilterOpen ? 'block' : 'hidden md:block'}`}>
          <div className="flex flex-wrap items-center justify-between gap-4 text-xs">
            <div className="flex flex-wrap items-center gap-3 sm:gap-4">
              {/* Dietary filter */}
              <div className="flex items-center space-x-2">
                <span className="text-[#6B5B52] font-medium">Dietary:</span>
                <select
                  value={selectedDietary}
                  onChange={(e) => setSelectedDietary(e.target.value)}
                  className="bg-white/90 rounded-full border border-[#D5CDBD] px-3.5 py-1.5 text-xs text-[#241611] focus:outline-none font-medium cursor-pointer"
                >
                  <option value="all">All Dietary Preferences</option>
                  {dietaryOptions.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>

              {/* Weight filter */}
              <div className="flex items-center space-x-2">
                <span className="text-[#6B5B52] font-medium">Size:</span>
                <select
                  value={selectedWeight}
                  onChange={(e) => setSelectedWeight(e.target.value)}
                  className="bg-white/90 rounded-full border border-[#D5CDBD] px-3.5 py-1.5 text-xs text-[#241611] focus:outline-none font-medium cursor-pointer"
                >
                  <option value="all">All Pack Sizes</option>
                  <option value="500g">500g</option>
                  <option value="1kg">1kg</option>
                  <option value="250g">250g</option>
                  <option value="200g">200g</option>
                  <option value="Combo Pack">Combo Pack</option>
                </select>
              </div>

              {/* Max Price Range */}
              <div className="flex items-center space-x-2 bg-white/70 px-3 py-1.5 rounded-full border border-[#D5CDBD]">
                <span className="text-[#6B5B52] font-medium">Max:</span>
                <span className="text-[#0D3522] font-bold">₹{maxPrice}</span>
                <input
                  type="range"
                  min="100"
                  max="1000"
                  step="50"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  className="w-20 sm:w-28 accent-[#0D3522] cursor-pointer"
                />
              </div>

              {/* In stock toggle */}
              <label className="flex items-center space-x-2 cursor-pointer bg-white/70 px-3 py-1.5 rounded-full border border-[#D5CDBD] text-[#6B5B52] hover:text-[#241611]">
                <input
                  type="checkbox"
                  checked={inStockOnly}
                  onChange={(e) => setInStockOnly(e.target.checked)}
                  className="accent-[#0D3522] rounded cursor-pointer"
                />
                <span className="font-medium text-xs">In Stock Only</span>
              </label>
            </div>

            {/* Reset button */}
            {activeFiltersCount > 0 && (
              <button
                type="button"
                onClick={resetAllFilters}
                className="px-3.5 py-1.5 rounded-full bg-white/80 border border-[#D5CDBD] text-[#B35638] hover:bg-[#B35638] hover:text-white flex items-center space-x-1.5 font-semibold text-xs transition-colors shadow-2xs"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset ({activeFiltersCount})</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Results Count Bar */}
      <div className="flex items-center justify-between text-xs text-[#6B5B52] mb-6 px-1">
        <p>
          Showing <strong className="text-[#0D3522] font-bold">{filteredProducts.length}</strong> provisions
          {selectedCategory !== 'all' && ` in ${categories.find((c) => c.id === selectedCategory)?.label}`}
        </p>
        <span className="hidden sm:inline text-[#8C7A70] italic">
          100% Verifiable Batches · Stone-Picked · Zero Preservatives
        </span>
      </div>

      {/* Product Grid */}
      {filteredProducts.length === 0 ? (
        <div className="text-center py-20 rounded-[28px] bg-[#EDE9E1] border border-[#D5CDBD] p-8 max-w-md mx-auto shadow-xs">
          <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-white/80 border border-[#D5CDBD] flex items-center justify-center text-[#8C7A70]">
            <Search className="w-6 h-6 text-[#0D3522]" />
          </div>
          <h3 className="text-xl font-serif font-bold text-[#241611]">No products match these filters</h3>
          <p className="text-xs text-[#6B5B52] mt-2 leading-relaxed">
            Try adjusting your price range, dietary preference, or search query to find our authentic provisions.
          </p>
          <button
            type="button"
            onClick={resetAllFilters}
            className="mt-6 px-7 py-3 rounded-full bg-[#0D3522] hover:bg-[#072417] text-white text-xs uppercase tracking-wider font-semibold shadow-sm transition-all"
          >
            Clear All Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
