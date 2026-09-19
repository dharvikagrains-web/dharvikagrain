'use client';

import React, { useState } from 'react';
import { activeBatches } from '@/data/batches';
import { BatchRecord } from '@/types';
import {
  Wheat,
  ShieldCheck,
  Download,
  Calendar,
  MapPin,
  FileCheck,
  CheckCircle,
  Plus,
  Search,
  ExternalLink,
} from 'lucide-react';

export default function AdminBatchesPage() {
  const [batches, setBatches] = useState<BatchRecord[]>(activeBatches);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedBatch, setSelectedBatch] = useState<BatchRecord | null>(null);

  const filteredBatches = batches.filter((b) => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const batchCode = (b.batchId || b.batchNumber || '').toLowerCase();
      const crop = (b.cropName || b.productName || '').toLowerCase();
      const cluster = (b.farmerCluster || b.sourceRegion || '').toLowerCase();
      return batchCode.includes(q) || crop.includes(q) || cluster.includes(q);
    }
    return true;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Traceability & Food Safety
          </span>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-gray-900">
            Batches & Lab Quality Reports
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            100% traceable harvest lots, moisture analysis, and NABL-accredited purity checks.
          </p>
        </div>

        <button
          type="button"
          onClick={() => alert('New lot registration initialized for Kharif 2026 harvest.')}
          className="px-4 py-2 bg-[#0D3522] hover:bg-[#134B31] text-white text-xs uppercase tracking-wider font-semibold flex items-center space-x-1.5 transition-colors shadow-xs"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Register New Harvest Lot</span>
        </button>
      </div>

      {/* Trust & Compliance Banner */}
      <div className="bg-[#FAF7F2] border border-[#C5A059]/40 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-3 text-xs text-[#241611]">
          <ShieldCheck className="w-6 h-6 text-[#0D3522] flex-shrink-0" />
          <div>
            <strong className="font-semibold text-sm">Every batch undergoes rigorous 4-stage purity verification.</strong>
            <p className="text-[#6B5B52] mt-0.5">
              Moisture levels under 12%, negative aflatoxin B1/B2, zero artificial polishing, and stone-free sorting.
            </p>
          </div>
        </div>
        <div className="text-[11px] font-mono text-[#0D3522] bg-white px-3 py-1.5 border border-[#E7DED4] font-semibold whitespace-nowrap">
          FSSAI STANDARD COMPLIANT
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white border border-gray-200 p-4 shadow-xs flex items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by batch code, grain, or cluster..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-gray-50 border border-gray-200 focus:outline-none focus:border-[#0D3522]"
          />
        </div>

        <span className="text-xs text-gray-500 hidden sm:inline">
          Showing <strong>{filteredBatches.length}</strong> verified batch lots
        </span>
      </div>

      {/* Batches Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredBatches.map((batch) => (
          <div
            key={batch.batchId}
            className="bg-white border border-gray-200 p-5 shadow-xs flex flex-col justify-between space-y-4 hover:border-[#0D3522] transition-colors"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-mono font-bold text-sm text-[#0D3522]">
                  {batch.batchId}
                </span>
                <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 text-[10px] font-semibold border border-emerald-200 flex items-center space-x-1">
                  <CheckCircle className="w-3 h-3" />
                  <span>Lab Verified</span>
                </span>
              </div>

              <div>
                <h3 className="font-serif font-bold text-base text-gray-900">
                  {batch.cropName}
                </h3>
                <p className="text-xs text-gray-500 flex items-center space-x-1 mt-0.5">
                  <MapPin className="w-3 h-3 text-[#B35638]" />
                  <span>{batch.farmerCluster}</span>
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-gray-100">
                <div className="p-2 bg-gray-50 rounded-xs">
                  <span className="text-[10px] text-gray-400 block">Harvest Date</span>
                  <strong className="text-gray-800">{batch.harvestDate}</strong>
                </div>
                <div className="p-2 bg-gray-50 rounded-xs">
                  <span className="text-[10px] text-gray-400 block">Milled Date</span>
                  <strong className="text-gray-800">{batch.millingDate}</strong>
                </div>
                <div className="p-2 bg-gray-50 rounded-xs">
                  <span className="text-[10px] text-gray-400 block">Moisture Content</span>
                  <strong className="text-emerald-700">{batch.moisturePercentage}% (Safe)</strong>
                </div>
                <div className="p-2 bg-gray-50 rounded-xs">
                  <span className="text-[10px] text-gray-400 block">Total Lot Size</span>
                  <strong className="text-gray-800">{batch.totalQuantityKg} kg</strong>
                </div>
              </div>

              <div className="pt-2 text-[11px] text-gray-600 space-y-1">
                <p>• Heavy Metals & Pesticides: <strong className="text-emerald-700">None Detected</strong></p>
                <p>• Aflatoxin Purity: <strong className="text-emerald-700">Passed (&lt;4 ppb)</strong></p>
                <p>• Lab Certificate: <span className="font-mono text-gray-500">[ADD BATCH LAB REPORT]</span></p>
              </div>
            </div>

            <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
              <button
                type="button"
                onClick={() => alert(`Lab Certificate for batch ${batch.batchId} generated. Traceability QR code ready for packaging printing.`)}
                className="w-full py-2 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 text-xs font-semibold flex items-center justify-center space-x-1.5 transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download Lab Certificate</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
