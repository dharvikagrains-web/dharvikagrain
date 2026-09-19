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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
      {/* Page Header */}
      <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-12">
        <span className="text-xs uppercase tracking-[0.25em] font-semibold text-[#B35638]">
          The Complete Harvest
        </span>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-semibold text-[#241611] mt-2">
          Shop All Provisions
        </h1>
        <p className="text-xs sm:text-sm text-[#6B5B52] mt-3 leading-relaxed">
          Authentic, unpolished Indian millets and single-origin pure spices.
          Direct from traditional grower clusters with verifiable batch transparency.
        </p>
      </div>

      {/* Category Tabs: [All] [Millets] [Spices] [Masalas] [Combos] */}
      <div className="flex items-center justify-center flex-wrap gap-2 sm:gap-3 mb-8 pb-4 border-b border-[#E7DED4]">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-4 py-2.5 text-xs uppercase tracking-wider font-semibold transition-all ${
              selectedCategory === cat.id
                ? 'bg-[#0D3522] text-white shadow-sm'
                : 'bg-white text-[#6B5B52] hover:bg-[#F5EFEB] border border-[#E7DED4]'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Search & Top Controls */}
      <div className="bg-white border border-[#E7DED4] p-4 sm:p-5 mb-8 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Search bar inside shop */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8C7A70]" />
            <input
              type="text"
              placeholder="Search products by grain, spice, or recipe..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-8 py-2 text-xs bg-[#FAF7F2] border border-[#E7DED4] text-[#241611] placeholder:text-[#8C7A70] focus:outline-none focus:border-[#0D3522]"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#8C7A70] hover:text-[#241611]"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Sort & Filter Trigger Buttons */}
          <div className="flex items-center justify-between w-full md:w-auto gap-4">
            <button
              type="button"
              onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}
              className="md:hidden px-3.5 py-2 bg-[#FAF7F2] border border-[#E7DED4] text-xs font-semibold text-[#241611] flex items-center space-x-2"
            >
              <Filter className="w-3.5 h-3.5 text-[#B35638]" />
              <span>Filters {activeFiltersCount > 0 && `(${activeFiltersCount})`}</span>
            </button>

            <div className="flex items-center space-x-2 text-xs">
              <span className="text-[#6B5B52] hidden sm:inline">Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-[#FAF7F2] border border-[#E7DED4] px-3 py-2 text-xs text-[#241611] focus:outline-none font-medium"
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

        {/* Detailed Desktop Filters Row */}
        <div className={`pt-4 border-t border-[#E7DED4] ${isMobileFilterOpen ? 'block' : 'hidden md:block'}`}>
          <div className="flex flex-wrap items-center justify-between gap-4 text-xs">
            <div className="flex flex-wrap items-center gap-4">
              {/* Dietary preference filter */}
              <div className="flex items-center space-x-2">
                <span className="text-[#6B5B52] font-medium">Dietary:</span>
                <select
                  value={selectedDietary}
                  onChange={(e) => setSelectedDietary(e.target.value)}
                  className="bg-[#FAF7F2] border border-[#E7DED4] px-2.5 py-1.5 text-xs text-[#241611] focus:outline-none"
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
                <span className="text-[#6B5B52] font-medium">Weight:</span>
                <select
                  value={selectedWeight}
                  onChange={(e) => setSelectedWeight(e.target.value)}
                  className="bg-[#FAF7F2] border border-[#E7DED4] px-2.5 py-1.5 text-xs text-[#241611] focus:outline-none"
                >
                  <option value="all">All Sizes</option>
                  <option value="500g">500g</option>
                  <option value="1kg">1kg</option>
                  <option value="250g">250g</option>
                  <option value="200g">200g</option>
                  <option value="Combo Pack">Combo Pack</option>
                </select>
              </div>

              {/* Max Price Range */}
              <div className="flex items-center space-x-2">
                <span className="text-[#6B5B52] font-medium">Price:</span>
                <span className="text-[#241611] font-semibold">Under ₹{maxPrice}</span>
                <input
                  type="range"
                  min="100"
                  max="1000"
                  step="50"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  className="w-24 sm:w-32 accent-[#0D3522]"
                />
              </div>

              {/* In stock toggle */}
              <label className="flex items-center space-x-1.5 cursor-pointer text-[#6B5B52] hover:text-[#241611]">
                <input
                  type="checkbox"
                  checked={inStockOnly}
                  onChange={(e) => setInStockOnly(e.target.checked)}
                  className="accent-[#0D3522] rounded-none"
                />
                <span>In Stock Only</span>
              </label>
            </div>

            {/* Reset button */}
            {activeFiltersCount > 0 && (
              <button
                type="button"
                onClick={resetAllFilters}
                className="text-[#B35638] hover:text-[#241611] flex items-center space-x-1 font-semibold text-xs transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Filters ({activeFiltersCount})</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Results Count Bar */}
      <div className="flex items-center justify-between text-xs text-[#6B5B52] mb-6">
        <p>
          Showing <strong className="text-[#241611]">{filteredProducts.length}</strong> provisions
          {selectedCategory !== 'all' && ` in ${categories.find((c) => c.id === selectedCategory)?.label}`}
        </p>
        <span className="hidden sm:inline text-[#8C7A70] italic">
          100% Verifiable Batches · Stone-Picked · Zero Preservatives
        </span>
      </div>

      {/* Product Grid: 2-col on mobile, 3-col on tablet, 4-col on desktop */}
      {filteredProducts.length === 0 ? (
        <div className="text-center py-20 bg-white border border-[#E7DED4] p-8 max-w-md mx-auto">
          <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-[#FAF7F2] flex items-center justify-center text-[#8C7A70]">
            <Search className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-serif font-bold text-[#241611]">No products match these filters</h3>
          <p className="text-xs text-[#6B5B52] mt-2 leading-relaxed">
            Try adjusting your price range, dietary preference, or search query to find our authentic provisions.
          </p>
          <button
            type="button"
            onClick={resetAllFilters}
            className="mt-5 px-6 py-2.5 bg-[#0D3522] hover:bg-[#134B31] text-white text-xs uppercase tracking-widest font-semibold transition-colors"
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
