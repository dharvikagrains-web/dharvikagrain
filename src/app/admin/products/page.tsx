'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { products } from '@/data/products';
import { Product } from '@/types';
import {
  Plus,
  Search,
  Tag,
  Star,
  CheckCircle,
  Eye,
  SlidersHorizontal,
  X,
  Edit2,
} from 'lucide-react';

export default function AdminProductsPage() {
  const [productList, setProductList] = useState<Product[]>(products);
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);

  // New product form state
  const [newProduct, setNewProduct] = useState({
    name: '',
    localName: '',
    category: 'millets',
    size: '1kg',
    price: '',
    mrp: '',
    description: '',
  });

  const filteredProducts = productList.filter((p) => {
    if (categoryFilter !== 'all' && p.category !== categoryFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const match =
        p.name.toLowerCase().includes(q) ||
        p.localName.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q);
      if (!match) return false;
    }
    return true;
  });

  const handleToggleBestseller = (productId: string) => {
    setProductList((prev) =>
      prev.map((p) => (p.id === productId ? { ...p, bestseller: !p.bestseller } : p))
    );
  };

  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProduct.name || !newProduct.price) return;

    const created: Product = {
      id: `dg-custom-${Date.now()}`,
      slug: newProduct.name.toLowerCase().replace(/\s+/g, '-'),
      name: newProduct.name,
      localName: newProduct.localName || newProduct.name,
      category: newProduct.category as any,
      tagline: 'Hand-harvested and stone-picked for pure nourishment.',
      shortDescription: 'Traditional single-origin provisions directly from growers.',
      description: newProduct.description || 'Authentic unpolished grains and spices.',
      images: ['/images/products/korralu-foxtail-millet.jpg'],
      weights: [
        {
          size: newProduct.size,
          price: Number(newProduct.price),
          mrp: Number(newProduct.mrp) || Number(newProduct.price) + 30,
          inStock: true,
        },
      ],
      ingredients: ['100% Pure Harvest'],
      origin: 'Ananthapuramu & Bellary Clustered Farms',
      processing: 'Destoned, winnowed and cold-processed',
      cookingInstructions: ['Rinse gently once', 'Soak for 30 mins', 'Cook until tender'],
      culinaryUses: ['Daily porridge', 'Upma', 'Idli-dosa batter'],
      storage: 'Store in cool dry place',
      nutrition: {
        servingSize: '100g',
        energyKcal: '350 kcal',
        protein: '12g',
        carbohydrates: '65g',
        dietaryFiber: '8g',
        fat: '3.5g',
      },
      certificationsPlaceholder: '[ADD FSSAI CERTIFICATION]',
      labTestPlaceholder: '[ADD BATCH LAB REPORT]',
      bestseller: false,
      featured: true,
      batchInfo: {
        batchPrefix: 'DG-HARVEST',
        shelfLifeMonths: 12,
        fssaiCategory: 'Chiru Dhanyalu / Whole Grains',
        packagingType: 'Aroma-sealed zip standup pouch',
      },
    };

    setProductList([created, ...productList]);
    setIsAddModalOpen(false);
    setNewProduct({
      name: '',
      localName: '',
      category: 'millets',
      size: '1kg',
      price: '',
      mrp: '',
      description: '',
    });
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Catalog Administration
          </span>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-gray-900">
            Provisions & Grains ({productList.length})
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Manage product metadata, pack weight variants, pricing, and live inventory visibility.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsAddModalOpen(true)}
          className="px-4 py-2 bg-[#0D3522] hover:bg-[#134B31] text-white text-xs uppercase tracking-wider font-semibold flex items-center space-x-1.5 transition-colors shadow-xs"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add New Provision</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white border border-gray-200 p-4 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-wrap gap-2">
          {[
            { id: 'all', label: 'All' },
            { id: 'millets', label: 'Millets' },
            { id: 'spices', label: 'Spices' },
            { id: 'masalas', label: 'Masalas' },
            { id: 'combos', label: 'Combos' },
          ].map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setCategoryFilter(cat.id)}
              className={`px-3 py-1.5 text-xs font-semibold transition-colors ${
                categoryFilter === cat.id
                  ? 'bg-[#0D3522] text-white shadow-xs'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-72">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search provision by name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-gray-50 border border-gray-200 focus:outline-none focus:border-[#0D3522]"
          />
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white border border-gray-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-50 text-gray-500 font-semibold uppercase tracking-wider border-b border-gray-200">
              <tr>
                <th className="px-4 py-3">Provision & Image</th>
                <th className="px-4 py-3">Regional Name</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Pack Weights & Prices</th>
                <th className="px-4 py-3">Bestseller</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredProducts.map((p) => {
                const defaultWeight = p.weights[0];
                return (
                  <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 flex items-center space-x-3">
                      <div className="relative w-10 h-10 bg-gray-100 border border-gray-200 flex-shrink-0 overflow-hidden">
                        <Image
                          src={p.images[0] || '/images/products/korralu-foxtail-millet.jpg'}
                          alt={p.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{p.name}</p>
                        <p className="text-[10px] text-gray-400 font-mono">SKU: {p.id}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-600 font-serif italic">
                      {p.localName}
                    </td>
                    <td className="px-4 py-3">
                      <span className="capitalize px-2 py-0.5 text-[10px] bg-gray-100 text-gray-700 font-medium">
                        {p.category}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="space-y-0.5">
                        {p.weights.map((w) => (
                          <div key={w.size} className="text-[11px] text-gray-700">
                            <span className="font-semibold">{w.size}:</span> ₹{w.price}{' '}
                            <span className="line-through text-gray-400 text-[10px]">₹{w.mrp}</span>
                          </div>
                        ))}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        type="button"
                        onClick={() => handleToggleBestseller(p.id)}
                        className={`text-xs p-1 rounded-xs ${
                          p.bestseller ? 'text-amber-500 hover:text-gray-400' : 'text-gray-300 hover:text-amber-500'
                        }`}
                        title="Toggle Bestseller Badge"
                      >
                        <Star className={`w-4 h-4 ${p.bestseller ? 'fill-current' : ''}`} />
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <span className="inline-block px-2 py-0.5 text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        Live / Active
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right space-x-2">
                      <Link
                        href={`/products/${p.slug}`}
                        target="_blank"
                        className="p-1.5 text-gray-500 hover:text-gray-900 inline-block"
                        title="View Live Storefront Page"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add New Provision Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white max-w-md w-full p-6 space-y-4 shadow-xl border border-gray-200">
            <div className="flex items-center justify-between pb-3 border-b border-gray-200">
              <h3 className="font-serif font-bold text-base text-gray-900">
                Add New Provision
              </h3>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddProduct} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-gray-700 mb-1">Product Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Navane (Foxtail Millet)"
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-xs focus:outline-none focus:border-[#0D3522]"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Local / Regional Script Name</label>
                <input
                  type="text"
                  placeholder="e.g. కొర్రలు / नवणे"
                  value={newProduct.localName}
                  onChange={(e) => setNewProduct({ ...newProduct, localName: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-xs focus:outline-none focus:border-[#0D3522]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Category</label>
                  <select
                    value={newProduct.category}
                    onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded-xs focus:outline-none focus:border-[#0D3522]"
                  >
                    <option value="millets">Millets</option>
                    <option value="spices">Spices</option>
                    <option value="masalas">Masalas</option>
                    <option value="combos">Combos</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Default Pack Size</label>
                  <select
                    value={newProduct.size}
                    onChange={(e) => setNewProduct({ ...newProduct, size: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded-xs focus:outline-none focus:border-[#0D3522]"
                  >
                    <option value="500g">500g</option>
                    <option value="1kg">1kg</option>
                    <option value="250g">250g</option>
                    <option value="Combo Pack">Combo Pack</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Selling Price (₹)</label>
                  <input
                    type="number"
                    required
                    placeholder="120"
                    value={newProduct.price}
                    onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded-xs focus:outline-none focus:border-[#0D3522]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-gray-700 mb-1">MRP (₹)</label>
                  <input
                    type="number"
                    placeholder="150"
                    value={newProduct.mrp}
                    onChange={(e) => setNewProduct({ ...newProduct, mrp: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded-xs focus:outline-none focus:border-[#0D3522]"
                  />
                </div>
              </div>

              <div className="pt-3 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#0D3522] hover:bg-[#134B31] text-white font-semibold"
                >
                  Save Provision
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
