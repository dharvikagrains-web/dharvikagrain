'use client';

import React, { useState, useMemo } from 'react';
import { products } from '@/data/products';
import { ProductCategory } from '@/types';
import { ProductCard } from '@/components/product/ProductCard';
import { SlidersHorizontal, ArrowUpDown, Check } from 'lucide-react';

export default function ShopPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('featured');
  const [selectedWeight, setSelectedWeight] = useState<string>('all');
  const [inStockOnly, setInStockOnly] = useState<boolean>(false);
  const [maxPrice, setMaxPrice] = useState<number>(500);

  const categories = [
    { id: 'all', label: 'All Products' },
    { id: 'millets', label: 'Chiru Dhanyalu (Millets)' },
    { id: 'spices', label: 'Pure Spices' },
    { id: 'signature', label: 'Signature Blends' },
  ];

  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        // Category filter
        if (selectedCategory !== 'all' && p.category !== selectedCategory) {
          return false;
        }
        // Weight filter
        if (selectedWeight !== 'all' && !p.weights.some((w) => w.size === selectedWeight)) {
          return false;
        }
        // Price filter
        if (p.weights[0].price > maxPrice) {
          return false;
        }
        // In stock
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
        if (sortBy === 'name') {
          return a.name.localeCompare(b.name);
        }
        // default 'featured'
        return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
      });
  }, [selectedCategory, sortBy, selectedWeight, inStockOnly, maxPrice]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
      {/* Page Header */}
      <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-12">
        <span className="text-xs uppercase tracking-widest font-semibold text-[#B35638]">
          The Complete Harvest
        </span>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-semibold text-[#241611] mt-2">
          Shop All Provisions
        </h1>
        <p className="text-xs sm:text-sm text-[#6B5B52] mt-3 leading-relaxed">
          Authentic, unpolished Indian millets and single-origin pure spices.
          Direct from traditional grower clusters to your everyday kitchen.
        </p>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center justify-center flex-wrap gap-2 sm:gap-3 mb-8 pb-4 border-b border-[#E7DED4]">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-4 py-2 text-xs uppercase tracking-wider font-semibold transition-all ${
              selectedCategory === cat.id
                ? 'bg-[#241611] text-white'
                : 'bg-white text-[#6B5B52] hover:bg-[#F5EFEB] border border-[#E7DED4]'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Filter & Sort Controls Bar */}
      <div className="bg-white border border-[#E7DED4] p-4 mb-8 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Left: Filter Indicators & Options */}
        <div className="flex flex-wrap items-center gap-4 text-xs">
          <div className="flex items-center space-x-1.5 text-[#241611] font-semibold">
            <SlidersHorizontal className="w-4 h-4 text-[#B35638]" />
            <span>Filters:</span>
          </div>

          {/* Pack size filter */}
          <div className="flex items-center space-x-2">
            <span className="text-[#6B5B52]">Pack:</span>
            <select
              value={selectedWeight}
              onChange={(e) => setSelectedWeight(e.target.value)}
              className="bg-[#FAF7F2] border border-[#E7DED4] px-2 py-1 text-xs text-[#241611] focus:outline-none"
            >
              <option value="all">All Sizes</option>
              <option value="500g">500g</option>
              <option value="1kg">1kg</option>
              <option value="250g">250g</option>
              <option value="200g">200g</option>
            </select>
          </div>

          {/* Max Price Range */}
          <div className="flex items-center space-x-2">
            <span className="text-[#6B5B52]">Under ₹{maxPrice}:</span>
            <input
              type="range"
              min="100"
              max="500"
              step="50"
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-24 accent-[#B35638]"
            />
          </div>

          {/* In stock toggle */}
          <label className="flex items-center space-x-1.5 cursor-pointer text-[#6B5B52]">
            <input
              type="checkbox"
              checked={inStockOnly}
              onChange={(e) => setInStockOnly(e.target.checked)}
              className="accent-[#B35638] rounded-none"
            />
            <span>In Stock Only</span>
          </label>
        </div>

        {/* Right: Sort & Results Counter */}
        <div className="flex items-center space-x-4 w-full md:w-auto justify-between md:justify-end text-xs">
          <span className="text-[#6B5B52]">
            Showing <strong className="text-[#241611]">{filteredProducts.length}</strong> items
          </span>

          <div className="flex items-center space-x-1.5">
            <span className="text-[#6B5B52] hidden sm:inline">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-[#FAF7F2] border border-[#E7DED4] px-2 py-1 text-xs text-[#241611] focus:outline-none"
            >
              <option value="featured">Featured</option>
              <option value="bestseller">Best Selling</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="name">Product Name (A-Z)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Product Grid: 2-col on mobile, 4-col on desktop */}
      {filteredProducts.length === 0 ? (
        <div className="text-center py-16 bg-white border border-[#E7DED4] p-8">
          <h3 className="text-lg font-serif text-[#241611]">No products match these filters</h3>
          <p className="text-xs text-[#6B5B52] mt-2">
            Try resetting your price or pack size filters to view our full collection.
          </p>
          <button
            onClick={() => {
              setSelectedCategory('all');
              setSelectedWeight('all');
              setMaxPrice(500);
              setInStockOnly(false);
            }}
            className="mt-4 px-6 py-2.5 bg-[#241611] text-white text-xs uppercase tracking-widest font-semibold"
          >
            Reset Filters
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
