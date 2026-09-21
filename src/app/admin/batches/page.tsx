'use client';

import React, { useState } from 'react';
import { activeBatches } from '@/data/batches';
import { BatchRecord } from '@/types';
import {
  ShieldCheck,
  Download,
  Calendar,
  MapPin,
  CheckCircle,
  Plus,
  Search,
  Layers,
  Truck,
  IndianRupee,
  AlertTriangle,
  Boxes,
  TrendingUp,
  X,
  Sparkles,
  ArrowRight,
  Filter,
} from 'lucide-react';

interface ProductGroup {
  id: string;
  name: string;
  category: string;
  batches: BatchRecord[];
}

export default function AdminBatchesPage() {
  const [batches, setBatches] = useState<BatchRecord[]>(activeBatches);
  const [selectedProductId, setSelectedProductId] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<'hierarchy' | 'cards'>('hierarchy');

  // Form state for creating a new batch
  const [formData, setFormData] = useState({
    productId: 'millet-ragi',
    productName: 'Ragi Flour (Finger Millet)',
    batchNumber: 'B004',
    manufacturingDate: '2026-09-15',
    expiryDate: '2027-09-14',
    quantity: 1500,
    remainingQuantity: 1500,
    supplier: 'Chittoor Rain-fed Grower Union',
    purchaseCost: 44,
    sellingPrice: 120,
    status: 'ACTIVE' as BatchRecord['status'],
    sourceRegion: 'Chittoor, Andhra Pradesh',
    moisturePercent: '10.8%',
  });

  // Unique products present in the batches
  const productOptions = [
    { id: 'millet-ragi', name: 'Ragi Flour (Finger Millet)' },
    { id: 'millet-korralu', name: 'Foxtail Millet (Korralu)' },
    { id: 'spice-turmeric', name: 'Turmeric Powder (Lakadong)' },
    { id: 'millet-samalu', name: 'Samalu (Little Millet)' },
    { id: 'millet-arikelu', name: 'Arikelu (Kodo Millet)' },
    { id: 'spice-chilli', name: 'Pure Red Chilli Powder' },
  ];

  // Group batches by product
  const groupedProducts: ProductGroup[] = [
    {
      id: 'millet-ragi',
      name: 'Ragi Flour',
      category: 'Millets & Flours',
      batches: batches.filter((b) => b.productId === 'millet-ragi'),
    },
    {
      id: 'millet-korralu',
      name: 'Foxtail Millet',
      category: 'Whole Millets',
      batches: batches.filter((b) => b.productId === 'millet-korralu'),
    },
    {
      id: 'spice-turmeric',
      name: 'Turmeric Powder',
      category: 'Heritage Spices',
      batches: batches.filter((b) => b.productId === 'spice-turmeric'),
    },
    {
      id: 'millet-samalu',
      name: 'Little Millet (Samalu)',
      category: 'Whole Millets',
      batches: batches.filter((b) => b.productId === 'millet-samalu'),
    },
    {
      id: 'millet-arikelu',
      name: 'Kodo Millet (Arikelu)',
      category: 'Whole Millets',
      batches: batches.filter((b) => b.productId === 'millet-arikelu'),
    },
    {
      id: 'spice-chilli',
      name: 'Red Chilli Powder',
      category: 'Heritage Spices',
      batches: batches.filter((b) => b.productId === 'spice-chilli'),
    },
  ].filter((group) => group.batches.length > 0);

  // Filter batches based on product selection and search query
  const filteredBatches = batches.filter((b) => {
    const matchesProduct = selectedProductId === 'all' || b.productId === selectedProductId;
    if (!matchesProduct) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const bNum = (b.batchNumber || b.batchId || '').toLowerCase();
      const pName = (b.productName || b.cropName || '').toLowerCase();
      const supp = (b.supplier || b.farmerCluster || '').toLowerCase();
      return bNum.includes(q) || pName.includes(q) || supp.includes(q);
    }
    return true;
  });

  const handleRegisterBatch = (e: React.FormEvent) => {
    e.preventDefault();
    const newBatchRecord: BatchRecord = {
      batchNumber: formData.batchNumber.toUpperCase(),
      batchId: formData.batchNumber.toUpperCase(),
      productId: formData.productId,
      productName: formData.productName,
      cropName: formData.productName,
      manufacturingDate: formData.manufacturingDate,
      expiryDate: formData.expiryDate,
      harvestDate: 'Current Season',
      quantity: Number(formData.quantity),
      totalQuantityKg: Number(formData.quantity),
      remainingQuantity: Number(formData.remainingQuantity),
      remainingQuantityKg: Number(formData.remainingQuantity),
      supplier: formData.supplier,
      farmerCluster: formData.supplier,
      sourceRegion: formData.sourceRegion,
      purchaseCost: Number(formData.purchaseCost),
      sellingPrice: Number(formData.sellingPrice),
      status: formData.status,
      qualityCheckStatus: 'Passed',
      qualityPassed: true,
      moisturePercent: formData.moisturePercent,
      moisturePercentage: parseFloat(formData.moisturePercent) || 10.5,
      purityPercent: '99.9%',
      packagingDate: formData.manufacturingDate,
      bestBefore: formData.expiryDate,
      processingDate: 'Recent',
    };

    setBatches([newBatchRecord, ...batches]);
    setIsRegisterModalOpen(false);
    alert(`Batch ${newBatchRecord.batchNumber} registered successfully for ${newBatchRecord.productName}!`);
  };

  const getStatusBadge = (status?: string) => {
    switch (status) {
      case 'ACTIVE':
        return (
          <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 text-[10px] font-semibold border border-emerald-200 flex items-center space-x-1">
            <CheckCircle className="w-3 h-3" />
            <span>ACTIVE</span>
          </span>
        );
      case 'LOW_STOCK':
        return (
          <span className="px-2 py-0.5 bg-amber-50 text-amber-700 text-[10px] font-semibold border border-amber-200 flex items-center space-x-1">
            <AlertTriangle className="w-3 h-3" />
            <span>LOW STOCK</span>
          </span>
        );
      case 'EXPIRED':
        return (
          <span className="px-2 py-0.5 bg-rose-50 text-rose-700 text-[10px] font-semibold border border-rose-200 flex items-center space-x-1">
            <span>EXPIRED</span>
          </span>
        );
      case 'DEPLETED':
        return (
          <span className="px-2 py-0.5 bg-gray-100 text-gray-700 text-[10px] font-semibold border border-gray-300 flex items-center space-x-1">
            <span>DEPLETED</span>
          </span>
        );
      default:
        return (
          <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 text-[10px] font-semibold border border-emerald-200 flex items-center space-x-1">
            <CheckCircle className="w-3 h-3" />
            <span>ACTIVE</span>
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E7DED4] pb-5">
        <div>
          <span className="text-xs font-semibold text-[#8C7A6B] uppercase tracking-widest flex items-center space-x-1">
            <Layers className="w-3.5 h-3.5 text-[#0D3522]" />
            <span>Product-to-Batch Traceability Hierarchy</span>
          </span>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#241611] mt-1">
            Product & Batch Lifecycle Management
          </h1>
          <p className="text-xs text-[#6B5B52] mt-0.5">
            Hierarchical lot tracking: Manufacturing dates, expiry timelines, supplier costs, selling margins & stock health.
          </p>
        </div>

        <div className="flex items-center space-x-2.5">
          <button
            type="button"
            onClick={() => setIsRegisterModalOpen(true)}
            className="px-4 py-2 bg-[#0D3522] hover:bg-[#134B31] text-white text-xs uppercase tracking-wider font-semibold flex items-center space-x-1.5 transition-colors shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Register New Batch</span>
          </button>
        </div>
      </div>

      {/* Visual Hierarchy Architecture Tree Banner */}
      <div className="bg-[#FAF7F2] border border-[#C5A059]/40 p-5 rounded-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center space-x-2 text-xs font-semibold text-[#0D3522] uppercase tracking-wider">
              <Boxes className="w-4 h-4" />
              <span>Hierarchical Structure</span>
            </div>
            <p className="text-xs text-[#6B5B52]">
              Each Product (e.g. <strong>Ragi Flour</strong>, <strong>Foxtail Millet</strong>, <strong>Turmeric Powder</strong>) maintains multiple distinct active harvest lots (<strong>B001</strong>, <strong>B002</strong>, <strong>B003</strong>).
            </p>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto py-1">
            <div className="bg-white border border-[#E7DED4] px-3 py-2 rounded-xs text-center min-w-[120px]">
              <span className="text-[10px] text-gray-500 uppercase tracking-wider block font-semibold">Total Products</span>
              <strong className="text-lg font-serif font-bold text-[#0D3522]">{groupedProducts.length}</strong>
            </div>
            <ArrowRight className="w-4 h-4 text-[#C5A059] flex-shrink-0" />
            <div className="bg-white border border-[#E7DED4] px-3 py-2 rounded-xs text-center min-w-[120px]">
              <span className="text-[10px] text-gray-500 uppercase tracking-wider block font-semibold">Active Batches</span>
              <strong className="text-lg font-serif font-bold text-[#0D3522]">{batches.length}</strong>
            </div>
            <ArrowRight className="w-4 h-4 text-[#C5A059] flex-shrink-0" />
            <div className="bg-white border border-[#E7DED4] px-3 py-2 rounded-xs text-center min-w-[140px]">
              <span className="text-[10px] text-gray-500 uppercase tracking-wider block font-semibold">Stock in Batches</span>
              <strong className="text-lg font-serif font-bold text-[#0D3522]">
                {batches.reduce((acc, b) => acc + (b.remainingQuantity || b.remainingQuantityKg || 0), 0).toLocaleString()} kg
              </strong>
            </div>
          </div>
        </div>
      </div>

      {/* Product Filter Tabs & Search Controls */}
      <div className="bg-white border border-gray-200 p-4 shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Search */}
          <div className="relative w-full md:w-80">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search batch (e.g. B001), product, or supplier..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-gray-50 border border-gray-200 focus:outline-none focus:border-[#0D3522]"
            />
          </div>

          {/* View Toggle */}
          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={() => setViewMode('hierarchy')}
              className={`px-3 py-1 text-xs font-semibold rounded-xs border transition-colors ${
                viewMode === 'hierarchy'
                  ? 'bg-[#0D3522] text-white border-[#0D3522]'
                  : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
              }`}
            >
              Hierarchical Product View
            </button>
            <button
              type="button"
              onClick={() => setViewMode('cards')}
              className={`px-3 py-1 text-xs font-semibold rounded-xs border transition-colors ${
                viewMode === 'cards'
                  ? 'bg-[#0D3522] text-white border-[#0D3522]'
                  : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
              }`}
            >
              All Batches Grid ({filteredBatches.length})
            </button>
          </div>
        </div>

        {/* Product Filter Pills */}
        <div className="flex items-center space-x-1.5 overflow-x-auto pt-2 border-t border-gray-100">
          <button
            type="button"
            onClick={() => setSelectedProductId('all')}
            className={`px-3 py-1 text-[11px] font-semibold whitespace-nowrap transition-colors ${
              selectedProductId === 'all'
                ? 'bg-[#241611] text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            All Products ({batches.length} lots)
          </button>
          {productOptions.map((prod) => {
            const count = batches.filter((b) => b.productId === prod.id).length;
            if (count === 0) return null;
            return (
              <button
                key={prod.id}
                type="button"
                onClick={() => setSelectedProductId(prod.id)}
                className={`px-3 py-1 text-[11px] font-semibold whitespace-nowrap transition-colors flex items-center space-x-1.5 ${
                  selectedProductId === prod.id
                    ? 'bg-[#0D3522] text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <span>{prod.name}</span>
                <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                  selectedProductId === prod.id ? 'bg-white/20 text-white' : 'bg-gray-200 text-gray-700'
                }`}>
                  {count} batches
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* VIEW MODE 1: HIERARCHICAL PRODUCT VIEW */}
      {viewMode === 'hierarchy' && (
        <div className="space-y-8">
          {groupedProducts
            .filter((group) => selectedProductId === 'all' || group.id === selectedProductId)
            .map((group) => {
              const groupBatches = group.batches.filter((b) => {
                if (searchQuery.trim()) {
                  const q = searchQuery.toLowerCase();
                  const bNum = (b.batchNumber || b.batchId || '').toLowerCase();
                  const supp = (b.supplier || b.farmerCluster || '').toLowerCase();
                  return bNum.includes(q) || supp.includes(q);
                }
                return true;
              });

              if (groupBatches.length === 0) return null;

              const totalGroupQty = groupBatches.reduce((acc, b) => acc + (b.quantity || b.totalQuantityKg || 0), 0);
              const remainingGroupQty = groupBatches.reduce((acc, b) => acc + (b.remainingQuantity || b.remainingQuantityKg || 0), 0);

              return (
                <div key={group.id} className="bg-white border border-gray-200 shadow-xs overflow-hidden">
                  {/* Product Header */}
                  <div className="bg-[#FAF7F2] border-b border-[#E7DED4] p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-9 h-9 bg-[#0D3522] text-white rounded-xs flex items-center justify-center font-bold text-sm">
                        {group.name.charAt(0)}
                      </div>
                      <div>
                        <span className="text-[10px] font-semibold text-[#8C7A6B] uppercase tracking-wider block">
                          PRODUCT • {group.category}
                        </span>
                        <h2 className="text-lg font-serif font-bold text-[#241611]">
                          {group.name}
                        </h2>
                      </div>
                    </div>

                    {/* Stock Overview for Product */}
                    <div className="flex items-center space-x-4 text-xs">
                      <div>
                        <span className="text-[10px] text-gray-500 uppercase block font-medium">Active Batches</span>
                        <strong className="text-gray-900 font-mono">{groupBatches.length} Lots</strong>
                      </div>
                      <div className="h-6 w-px bg-[#E7DED4]" />
                      <div>
                        <span className="text-[10px] text-gray-500 uppercase block font-medium">Total Quantity</span>
                        <strong className="text-gray-900 font-mono">{totalGroupQty.toLocaleString()} kg</strong>
                      </div>
                      <div className="h-6 w-px bg-[#E7DED4]" />
                      <div>
                        <span className="text-[10px] text-gray-500 uppercase block font-medium">Remaining Stock</span>
                        <strong className="text-[#0D3522] font-mono">{remainingGroupQty.toLocaleString()} kg</strong>
                      </div>
                    </div>
                  </div>

                  {/* Batches Sub-tree: B001, B002, B003 */}
                  <div className="p-4 grid grid-cols-1 lg:grid-cols-3 gap-4 bg-gray-50/40">
                    {groupBatches.map((batch) => {
                      const total = batch.quantity || batch.totalQuantityKg || 1000;
                      const remaining = batch.remainingQuantity !== undefined ? batch.remainingQuantity : (batch.remainingQuantityKg || 800);
                      const percentRemaining = Math.round((remaining / total) * 100);
                      const purchase = batch.purchaseCost || 45;
                      const selling = batch.sellingPrice || 120;
                      const grossMargin = selling - purchase;
                      const marginPercent = Math.round((grossMargin / selling) * 100);

                      return (
                        <div
                          key={`${batch.productId}-${batch.batchNumber}`}
                          className="bg-white border border-gray-200 p-4 shadow-xs flex flex-col justify-between hover:border-[#0D3522] transition-colors relative"
                        >
                          <div className="space-y-3">
                            {/* Card Top: Batch Number & Status */}
                            <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                              <div className="flex items-center space-x-2">
                                <span className="px-2 py-0.5 bg-[#0D3522] text-white font-mono font-bold text-xs tracking-wider">
                                  {batch.batchNumber}
                                </span>
                                <span className="text-[10px] text-gray-400 font-mono">
                                  #{batch.productId}
                                </span>
                              </div>
                              {getStatusBadge(batch.status)}
                            </div>

                            {/* Supplier info */}
                            <div className="space-y-0.5">
                              <span className="text-[10px] text-gray-400 uppercase font-semibold block flex items-center space-x-1">
                                <Truck className="w-3 h-3 text-[#C5A059]" />
                                <span>Supplier / Farm Cluster</span>
                              </span>
                              <p className="text-xs font-semibold text-gray-800 line-clamp-1">
                                {batch.supplier || batch.farmerCluster || 'Regional FPO'}
                              </p>
                              <p className="text-[11px] text-gray-500 flex items-center space-x-1">
                                <MapPin className="w-3 h-3 text-gray-400" />
                                <span>{batch.sourceRegion}</span>
                              </p>
                            </div>

                            {/* Dates: Manufacturing & Expiry */}
                            <div className="grid grid-cols-2 gap-2 text-xs pt-1 border-t border-gray-100">
                              <div className="p-2 bg-gray-50 rounded-xs">
                                <span className="text-[10px] text-gray-400 uppercase block font-semibold">Mfg Date</span>
                                <strong className="text-gray-800 font-mono text-[11px]">
                                  {batch.manufacturingDate || batch.packagingDate || '2026-08-01'}
                                </strong>
                              </div>
                              <div className="p-2 bg-gray-50 rounded-xs">
                                <span className="text-[10px] text-gray-400 uppercase block font-semibold">Expiry Date</span>
                                <strong className="text-rose-700 font-mono text-[11px]">
                                  {batch.expiryDate || batch.bestBefore || '2027-07-31'}
                                </strong>
                              </div>
                            </div>

                            {/* Quantity & Remaining Stock Bar */}
                            <div className="space-y-1.5 pt-1 border-t border-gray-100">
                              <div className="flex items-center justify-between text-xs">
                                <span className="text-[10px] text-gray-500 uppercase font-semibold">Stock Level</span>
                                <span className="font-mono text-xs">
                                  <strong>{remaining.toLocaleString()}</strong> / {total.toLocaleString()} kg ({percentRemaining}%)
                                </span>
                              </div>
                              <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                                <div
                                  className={`h-full transition-all ${
                                    percentRemaining < 20
                                      ? 'bg-amber-500'
                                      : percentRemaining < 50
                                      ? 'bg-blue-500'
                                      : 'bg-[#0D3522]'
                                  }`}
                                  style={{ width: `${Math.min(100, Math.max(5, percentRemaining))}%` }}
                                />
                              </div>
                            </div>

                            {/* Purchase Cost & Selling Price */}
                            <div className="grid grid-cols-2 gap-2 text-xs pt-1 border-t border-gray-100">
                              <div className="p-2 bg-[#FAF7F2] border border-[#E7DED4] rounded-xs">
                                <span className="text-[10px] text-gray-500 uppercase block font-semibold flex items-center space-x-0.5">
                                  <span>Purchase Cost</span>
                                </span>
                                <strong className="text-gray-900 font-mono text-xs">₹{purchase} / kg</strong>
                              </div>
                              <div className="p-2 bg-emerald-50/50 border border-emerald-100 rounded-xs">
                                <span className="text-[10px] text-emerald-800 uppercase block font-semibold">
                                  Selling Price
                                </span>
                                <strong className="text-emerald-900 font-mono text-xs">₹{selling} / kg</strong>
                              </div>
                            </div>

                            {/* Margin summary */}
                            <div className="flex items-center justify-between text-[11px] text-gray-500 px-1">
                              <span className="flex items-center space-x-1">
                                <TrendingUp className="w-3 h-3 text-emerald-600" />
                                <span>Gross Margin:</span>
                              </span>
                              <strong className="text-emerald-700 font-mono">
                                +₹{grossMargin}/kg ({marginPercent}%)
                              </strong>
                            </div>
                          </div>

                          {/* Action Button */}
                          <div className="pt-3 mt-3 border-t border-gray-100">
                            <button
                              type="button"
                              onClick={() => alert(`Lab Report & QR Traceability code generated for Lot ${batch.batchNumber} (${batch.productName}). Ready for consumer packaging scanning.`)}
                              className="w-full py-1.5 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 text-xs font-semibold flex items-center justify-center space-x-1.5 transition-colors"
                            >
                              <Download className="w-3 h-3" />
                              <span>Download Traceability QR & CoA</span>
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
        </div>
      )}

      {/* VIEW MODE 2: FLAT BATCHES GRID */}
      {viewMode === 'cards' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBatches.map((batch) => {
            const total = batch.quantity || batch.totalQuantityKg || 1000;
            const remaining = batch.remainingQuantity !== undefined ? batch.remainingQuantity : (batch.remainingQuantityKg || 800);
            const percentRemaining = Math.round((remaining / total) * 100);

            return (
              <div
                key={`${batch.productId}-${batch.batchNumber}-${batch.id || ''}`}
                className="bg-white border border-gray-200 p-5 shadow-xs flex flex-col justify-between space-y-4 hover:border-[#0D3522] transition-colors"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="font-mono font-bold text-sm text-[#0D3522] bg-[#FAF7F2] px-2 py-0.5 border border-[#E7DED4]">
                        {batch.batchNumber}
                      </span>
                      <span className="text-[11px] text-gray-500 font-medium">
                        {batch.cropName || batch.productName}
                      </span>
                    </div>
                    {getStatusBadge(batch.status)}
                  </div>

                  <div>
                    <h3 className="font-serif font-bold text-base text-gray-900">
                      {batch.productName}
                    </h3>
                    <p className="text-xs text-gray-500 flex items-center space-x-1 mt-0.5">
                      <MapPin className="w-3 h-3 text-[#B35638]" />
                      <span>{batch.supplier || batch.farmerCluster}</span>
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-gray-100">
                    <div className="p-2 bg-gray-50 rounded-xs">
                      <span className="text-[10px] text-gray-400 uppercase block">Mfg Date</span>
                      <strong className="text-gray-800 font-mono text-[11px]">{batch.manufacturingDate || '2026-08-01'}</strong>
                    </div>
                    <div className="p-2 bg-gray-50 rounded-xs">
                      <span className="text-[10px] text-gray-400 uppercase block">Expiry Date</span>
                      <strong className="text-gray-800 font-mono text-[11px]">{batch.expiryDate || '2027-07-31'}</strong>
                    </div>
                    <div className="p-2 bg-gray-50 rounded-xs">
                      <span className="text-[10px] text-gray-400 uppercase block">Total Lot</span>
                      <strong className="text-gray-800 font-mono">{total} kg</strong>
                    </div>
                    <div className="p-2 bg-gray-50 rounded-xs">
                      <span className="text-[10px] text-gray-400 uppercase block">Remaining</span>
                      <strong className="text-emerald-700 font-mono">{remaining} kg ({percentRemaining}%)</strong>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs pt-1">
                    <div className="p-1.5 bg-[#FAF7F2] border border-[#E7DED4] rounded-xs text-center">
                      <span className="text-[10px] text-gray-500 block">Cost / kg</span>
                      <strong className="font-mono text-gray-800">₹{batch.purchaseCost || 45}</strong>
                    </div>
                    <div className="p-1.5 bg-emerald-50 border border-emerald-200 rounded-xs text-center">
                      <span className="text-[10px] text-emerald-800 block">Selling / kg</span>
                      <strong className="font-mono text-emerald-900">₹{batch.sellingPrice || 120}</strong>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={() => alert(`Certificate of Analysis (CoA) for Lot ${batch.batchNumber} downloaded.`)}
                    className="w-full py-1.5 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 text-xs font-semibold flex items-center justify-center space-x-1.5 transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download Lab Certificate</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* REGISTER NEW BATCH MODAL */}
      {isRegisterModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white border border-[#C5A059] shadow-2xl max-w-xl w-full p-6 space-y-5 animate-in fade-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div>
                <span className="text-[10px] text-[#8C7A6B] uppercase font-semibold tracking-wider">
                  New Lot Registration
                </span>
                <h3 className="text-lg font-serif font-bold text-gray-900">
                  Register Harvest Batch
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsRegisterModalOpen(false)}
                className="p-1 text-gray-400 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleRegisterBatch} className="space-y-4 text-xs">
              {/* Product Selection */}
              <div>
                <label className="block font-semibold text-gray-700 mb-1">
                  Target Product (Parent)
                </label>
                <select
                  value={formData.productId}
                  onChange={(e) => {
                    const selected = productOptions.find((p) => p.id === e.target.value);
                    setFormData({
                      ...formData,
                      productId: e.target.value,
                      productName: selected ? selected.name : formData.productName,
                    });
                  }}
                  className="w-full p-2 border border-gray-300 bg-white focus:outline-none focus:border-[#0D3522]"
                >
                  {productOptions.map((opt) => (
                    <option key={opt.id} value={opt.id}>
                      {opt.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Batch Number & Status */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">
                    Batch Number (e.g. B001, B002)
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.batchNumber}
                    onChange={(e) => setFormData({ ...formData, batchNumber: e.target.value })}
                    className="w-full p-2 border border-gray-300 font-mono uppercase focus:outline-none focus:border-[#0D3522]"
                    placeholder="B004"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">
                    Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                    className="w-full p-2 border border-gray-300 bg-white focus:outline-none focus:border-[#0D3522]"
                  >
                    <option value="ACTIVE">ACTIVE</option>
                    <option value="LOW_STOCK">LOW STOCK</option>
                    <option value="EXPIRED">EXPIRED</option>
                    <option value="DEPLETED">DEPLETED</option>
                  </select>
                </div>
              </div>

              {/* Manufacturing Date & Expiry Date */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">
                    Manufacturing Date
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.manufacturingDate}
                    onChange={(e) => setFormData({ ...formData, manufacturingDate: e.target.value })}
                    className="w-full p-2 border border-gray-300 font-mono focus:outline-none focus:border-[#0D3522]"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">
                    Expiry Date
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.expiryDate}
                    onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                    className="w-full p-2 border border-gray-300 font-mono focus:outline-none focus:border-[#0D3522]"
                  />
                </div>
              </div>

              {/* Quantity & Remaining Quantity */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">
                    Total Quantity (kg)
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={formData.quantity}
                    onChange={(e) => setFormData({ ...formData, quantity: Number(e.target.value) })}
                    className="w-full p-2 border border-gray-300 font-mono focus:outline-none focus:border-[#0D3522]"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">
                    Remaining Quantity (kg)
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={formData.remainingQuantity}
                    onChange={(e) => setFormData({ ...formData, remainingQuantity: Number(e.target.value) })}
                    className="w-full p-2 border border-gray-300 font-mono focus:outline-none focus:border-[#0D3522]"
                  />
                </div>
              </div>

              {/* Supplier & Source Region */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">
                    Supplier / Farmer Cluster
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.supplier}
                    onChange={(e) => setFormData({ ...formData, supplier: e.target.value })}
                    className="w-full p-2 border border-gray-300 focus:outline-none focus:border-[#0D3522]"
                    placeholder="e.g. Chittoor Rain-fed Grower Union"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">
                    Source Region
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.sourceRegion}
                    onChange={(e) => setFormData({ ...formData, sourceRegion: e.target.value })}
                    className="w-full p-2 border border-gray-300 focus:outline-none focus:border-[#0D3522]"
                    placeholder="e.g. Chittoor, Andhra Pradesh"
                  />
                </div>
              </div>

              {/* Purchase Cost & Selling Price */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">
                    Purchase Cost (₹ / kg)
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={formData.purchaseCost}
                    onChange={(e) => setFormData({ ...formData, purchaseCost: Number(e.target.value) })}
                    className="w-full p-2 border border-gray-300 font-mono focus:outline-none focus:border-[#0D3522]"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">
                    Selling Price (₹ / kg)
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={formData.sellingPrice}
                    onChange={(e) => setFormData({ ...formData, sellingPrice: Number(e.target.value) })}
                    className="w-full p-2 border border-gray-300 font-mono focus:outline-none focus:border-[#0D3522]"
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end space-x-2 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsRegisterModalOpen(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 font-semibold hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#0D3522] hover:bg-[#134B31] text-white font-semibold flex items-center space-x-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Create Batch Lot</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
