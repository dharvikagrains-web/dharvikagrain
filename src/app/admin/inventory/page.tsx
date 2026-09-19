'use client';

import React, { useState } from 'react';
import { adminInventoryItems } from '@/data/admin';
import { InventoryItem } from '@/types';
import {
  Boxes,
  AlertTriangle,
  Plus,
  Minus,
  Search,
  CheckCircle2,
  RefreshCw,
  ArrowDownToLine,
} from 'lucide-react';

export default function AdminInventoryPage() {
  const [items, setItems] = useState<InventoryItem[]>(adminInventoryItems);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filterState, setFilterState] = useState<'all' | 'low' | 'normal'>('all');

  const handleAdjustStock = (itemId: string, delta: number) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.id === itemId) {
          const newStock = Math.max(0, item.stock + delta);
          let newStatus: InventoryItem['status'] = 'In Stock';
          if (newStock === 0) newStatus = 'Out of Stock';
          else if (newStock <= item.threshold) newStatus = 'Low Stock';
          return { ...item, stock: newStock, status: newStatus };
        }
        return item;
      })
    );
  };

  const filteredItems = items.filter((item) => {
    if (filterState === 'low' && item.stock > item.threshold) return false;
    if (filterState === 'normal' && item.stock <= item.threshold) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        item.productName.toLowerCase().includes(q) ||
        item.sku.toLowerCase().includes(q) ||
        item.batchNumber.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const lowStockCount = items.filter((i) => i.stock <= i.threshold).length;

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Warehouse Operations
          </span>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-gray-900">
            Stock Control & Thresholds
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Monitor real-time bag counts, lot numbers, and automated reorder alerts.
          </p>
        </div>

        <button
          type="button"
          onClick={() => alert('Stock replenishment request dispatched to Ananthapur milling facility.')}
          className="px-4 py-2 bg-[#0D3522] hover:bg-[#134B31] text-white text-xs uppercase tracking-wider font-semibold flex items-center space-x-1.5 transition-colors shadow-xs"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Trigger Lot Restock</span>
        </button>
      </div>

      {/* Threshold Alert Card */}
      {lowStockCount > 0 && (
        <div className="bg-amber-50 border border-amber-200 p-4 flex items-center justify-between gap-4">
          <div className="flex items-center space-x-3 text-xs text-amber-900">
            <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0" />
            <div>
              <strong className="font-semibold">{lowStockCount} SKUs are below critical threshold.</strong>
              <p className="text-amber-700 mt-0.5">
                Consider reordering from processing clusters to avoid customer stockouts.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setFilterState('low')}
            className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold whitespace-nowrap"
          >
            Show Low Stock Only
          </button>
        </div>
      )}

      {/* Filter & Search Bar */}
      <div className="bg-white border border-gray-200 p-4 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex gap-2 text-xs font-semibold">
          <button
            type="button"
            onClick={() => setFilterState('all')}
            className={`px-3 py-1.5 ${
              filterState === 'all' ? 'bg-[#0D3522] text-white' : 'bg-gray-100 text-gray-600'
            }`}
          >
            All Provisions ({items.length})
          </button>
          <button
            type="button"
            onClick={() => setFilterState('low')}
            className={`px-3 py-1.5 ${
              filterState === 'low' ? 'bg-amber-600 text-white' : 'bg-gray-100 text-gray-600'
            }`}
          >
            Low Stock ({lowStockCount})
          </button>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by SKU, product, or batch..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-gray-50 border border-gray-200 focus:outline-none focus:border-[#0D3522]"
          />
        </div>
      </div>

      {/* Inventory Table */}
      <div className="bg-white border border-gray-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-50 text-gray-500 font-semibold uppercase tracking-wider border-b border-gray-200">
              <tr>
                <th className="px-4 py-3">SKU & Product</th>
                <th className="px-4 py-3">Variant</th>
                <th className="px-4 py-3">Batch Reference</th>
                <th className="px-4 py-3">Available Stock</th>
                <th className="px-4 py-3">Min Threshold</th>
                <th className="px-4 py-3">Health Status</th>
                <th className="px-4 py-3 text-right">Quick Adjust</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredItems.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3.5">
                    <p className="font-semibold text-gray-900">{item.productName}</p>
                    <p className="text-[10px] text-gray-400 font-mono">SKU: {item.sku}</p>
                  </td>
                  <td className="px-4 py-3.5 font-medium text-gray-700">
                    {item.variant}
                  </td>
                  <td className="px-4 py-3.5 font-mono text-[11px] text-gray-600">
                    {item.batchNumber}
                  </td>
                  <td className="px-4 py-3.5 font-bold text-sm text-gray-900">
                    {item.stock} units
                  </td>
                  <td className="px-4 py-3.5 text-gray-500">
                    {item.threshold} units
                  </td>
                  <td className="px-4 py-3.5">
                    <span
                      className={`inline-block px-2.5 py-0.5 text-[10px] font-semibold border ${
                        item.status === 'In Stock'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : item.status === 'Low Stock'
                          ? 'bg-amber-50 text-amber-700 border-amber-200'
                          : 'bg-red-50 text-red-700 border-red-200'
                      }`}
                    >
                      {item.status}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-right">
                    <div className="inline-flex items-center space-x-1 border border-gray-200 bg-white">
                      <button
                        type="button"
                        onClick={() => handleAdjustStock(item.id, -10)}
                        className="p-1.5 text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                        title="Reduce 10"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleAdjustStock(item.id, +25)}
                        className="p-1.5 text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                        title="Add 25"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
