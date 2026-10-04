'use client';

import React, { useState, useMemo } from 'react';
import { products } from '@/data/products';
import { ProductCard } from '@/components/product/ProductCard';
import { Search, RotateCcw, Filter, X, CheckCircle2 } from 'lucide-react';

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
    { id: 'masalas', label: 'Signature Blends' },
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Editorial Header Banner */}
      <div className="rounded-[12px] bg-[#F4EFEA] border border-[#E2D9CE] p-6 sm:p-10 lg:p-12">
        <div className="max-w-2xl">
          <span className="text-[12px] uppercase tracking-wider font-semibold text-[#9E462A] block font-data">
            The Complete Harvest
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-semibold text-[#221814] mt-1 leading-tight">
            Unpolished Millets & <br className="hidden sm:inline" />
            <span className="font-serif italic font-normal text-[#1A382B]">Single-Origin Spices</span>
          </h1>
          <p className="text-sm text-[#685950] mt-3 leading-relaxed">
            Naturally harvested from partner dryland clusters in Andhra Pradesh and Telangana. Unpolished, stone-picked, and cold-milled with honest lot traceability.
          </p>

          <div className="mt-4 flex flex-wrap gap-2 text-[12px] text-[#685950]">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[4px] bg-white border border-[#E2D9CE]">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#1A382B]" /> 100% Unpolished Bran
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[4px] bg-white border border-[#E2D9CE]">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#1A382B]" /> Chemical-Free Cleaning
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[4px] bg-white border border-[#E2D9CE]">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#1A382B]" /> Direct Lot Traceability
            </span>
          </div>
        </div>
      </div>

      {/* Category Segmented Tabs */}
      <div className="flex items-center overflow-x-auto no-scrollbar gap-2 pb-1">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`flex-shrink-0 px-4 py-2 rounded-[6px] text-[13px] font-medium transition-all ${
              selectedCategory === cat.id
                ? 'bg-[#1A382B] text-white shadow-2xs'
                : 'bg-white text-[#685950] hover:text-[#221814] border border-[#E2D9CE]'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Filter and Search Bar Container */}
      <div className="rounded-[10px] bg-white border border-[#E2D9CE] p-4 sm:p-5 shadow-2xs space-y-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-3">
          {/* Search bar */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8C7A70]" />
            <input
              type="text"
              placeholder="Search grains, spices, recipes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-8 py-2 text-[13px] bg-[#FAF7F2] rounded-[6px] border border-[#E2D9CE] text-[#221814] placeholder:text-[#8C7A70] focus:outline-none focus:border-[#1A382B]"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8C7A70] hover:text-[#221814]"
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
              className="md:hidden px-3.5 py-2 bg-[#FAF7F2] rounded-[6px] border border-[#E2D9CE] text-[13px] font-medium text-[#221814] flex items-center gap-2"
            >
              <Filter className="w-3.5 h-3.5 text-[#1A382B]" />
              <span>Filters {activeFiltersCount > 0 && `(${activeFiltersCount})`}</span>
            </button>

            <div className="flex items-center gap-2 text-[13px]">
              <span className="text-[#685950] hidden sm:inline font-medium">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-[#FAF7F2] rounded-[6px] border border-[#E2D9CE] px-3 py-2 text-[13px] text-[#221814] focus:outline-none font-medium cursor-pointer"
              >
                <option value="featured">Featured Harvest</option>
                <option value="bestseller">Bestsellers First</option>
                <option value="newest">New Harvest Arrivals</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="name">Product Name (A-Z)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Detailed Filters Drawer / Row */}
        <div className={`pt-3 border-t border-[#EDE6DC] ${isMobileFilterOpen ? 'block' : 'hidden md:block'}`}>
          <div className="flex flex-wrap items-center justify-between gap-3 text-[12px]">
            <div className="flex flex-wrap items-center gap-3 sm:gap-4">
              {/* Dietary filter */}
              <div className="flex items-center gap-1.5">
                <span className="text-[#685950] font-medium">Dietary:</span>
                <select
                  value={selectedDietary}
                  onChange={(e) => setSelectedDietary(e.target.value)}
                  className="bg-[#FAF7F2] rounded-[6px] border border-[#E2D9CE] px-2.5 py-1.5 text-[12px] text-[#221814] focus:outline-none"
                >
                  <option value="all">All Preferences</option>
                  {dietaryOptions.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>

              {/* Weight filter */}
              <div className="flex items-center gap-1.5">
                <span className="text-[#685950] font-medium">Size:</span>
                <select
                  value={selectedWeight}
                  onChange={(e) => setSelectedWeight(e.target.value)}
                  className="bg-[#FAF7F2] rounded-[6px] border border-[#E2D9CE] px-2.5 py-1.5 text-[12px] text-[#221814] focus:outline-none"
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
              <div className="flex items-center gap-2 bg-[#FAF7F2] px-2.5 py-1.5 rounded-[6px] border border-[#E2D9CE]">
                <span className="text-[#685950] font-medium">Max:</span>
                <span className="font-data text-[#1A382B] font-bold">₹{maxPrice}</span>
                <input
                  type="range"
                  min="100"
                  max="1000"
                  step="50"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  className="w-20 sm:w-24 accent-[#1A382B] cursor-pointer"
                />
              </div>

              {/* In stock toggle */}
              <label className="flex items-center gap-2 cursor-pointer bg-[#FAF7F2] px-2.5 py-1.5 rounded-[6px] border border-[#E2D9CE] text-[#685950] hover:text-[#221814]">
                <input
                  type="checkbox"
                  checked={inStockOnly}
                  onChange={(e) => setInStockOnly(e.target.checked)}
                  className="accent-[#1A382B] rounded cursor-pointer"
                />
                <span className="font-medium">In Stock Only</span>
              </label>
            </div>

            {/* Reset button */}
            {activeFiltersCount > 0 && (
              <button
                type="button"
                onClick={resetAllFilters}
                className="px-3 py-1.5 rounded-[6px] bg-[#FAF7F2] border border-[#E2D9CE] text-[#9E462A] hover:bg-[#9E462A] hover:text-white flex items-center gap-1.5 font-medium text-[12px] transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset ({activeFiltersCount})</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Results Count Bar */}
      <div className="flex items-center justify-between text-[13px] text-[#685950] px-1">
        <p>
          Showing <strong className="font-data text-[#1A382B] font-bold">{filteredProducts.length}</strong> items
          {selectedCategory !== 'all' && ` in ${categories.find((c) => c.id === selectedCategory)?.label}`}
        </p>
        <span className="hidden sm:inline text-[#8C7A70] text-[12px] font-data">
          Segregated Lots · Stone-Picked · Zero Chemical Bleach
        </span>
      </div>

      {/* Product Grid */}
      {filteredProducts.length === 0 ? (
        <div className="text-center py-16 rounded-[12px] bg-white border border-[#E2D9CE] p-8 max-w-md mx-auto">
          <div className="w-12 h-12 mx-auto mb-3 rounded-[6px] bg-[#FAF7F2] border border-[#E2D9CE] flex items-center justify-center text-[#8C7A70]">
            <Search className="w-5 h-5 text-[#1A382B]" />
          </div>
          <h3 className="text-lg font-serif font-semibold text-[#221814]">No products match these filters</h3>
          <p className="text-[13px] text-[#685950] mt-1.5 leading-relaxed">
            Try adjusting your search term, dietary preferences, or pack size options.
          </p>
          <button
            type="button"
            onClick={resetAllFilters}
            className="mt-5 px-6 py-2.5 rounded-[6px] bg-[#1A382B] hover:bg-[#132B21] text-white text-[13px] font-semibold transition-colors"
          >
            Clear All Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
