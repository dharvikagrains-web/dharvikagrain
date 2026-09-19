'use client';

import React, { useState } from 'react';
import { brandConfig } from '@/data/brandConfig';
import {
  Settings,
  Save,
  Truck,
  ShieldCheck,
  Building,
  Mail,
  Phone,
  CheckCircle2,
} from 'lucide-react';

export default function AdminSettingsPage() {
  const [isSaved, setIsSaved] = useState(false);
  const [form, setForm] = useState({
    freeShippingThreshold: brandConfig.freeShippingThreshold.toString(),
    flatShippingRate: brandConfig.flatShippingRate.toString(),
    codFee: '40',
    supportEmail: brandConfig.supportEmail,
    supportPhone: brandConfig.supportPhone,
    fssaiNumber: '[ADD FSSAI LICENCE NUMBER]',
    gstin: '36AABCD1234E1Z5',
    warehouseAddress: 'Plot 42, APIIC Industrial Park, Patancheru, Hyderabad, Telangana - 502319',
    returnWindowDays: '7',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Configuration & Legal Compliance
          </span>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-gray-900">
            Store & Logistics Settings
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Manage shipping rules, delivery thresholds, FSSAI compliance, and warehouse points.
          </p>
        </div>

        {isSaved && (
          <div className="px-3.5 py-1.5 bg-emerald-100 text-emerald-800 text-xs font-semibold rounded-xs flex items-center space-x-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Settings saved successfully!</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 text-xs">
        {/* Shipping & Delivery Thresholds */}
        <div className="bg-white border border-gray-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center space-x-2 pb-3 border-b border-gray-100 text-gray-900 font-serif font-bold text-sm">
            <Truck className="w-4 h-4 text-[#0D3522]" />
            <h3>Delivery & Freight Rules</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block font-semibold text-gray-700 mb-1">
                Free Delivery Threshold (₹)
              </label>
              <input
                type="number"
                value={form.freeShippingThreshold}
                onChange={(e) => setForm({ ...form, freeShippingThreshold: e.target.value })}
                className="w-full p-2.5 border border-gray-300 rounded-xs focus:outline-none focus:border-[#0D3522] font-semibold"
              />
              <p className="text-[10px] text-gray-400 mt-1">Orders above this amount ship free</p>
            </div>

            <div>
              <label className="block font-semibold text-gray-700 mb-1">
                Standard Shipping Charge (₹)
              </label>
              <input
                type="number"
                value={form.flatShippingRate}
                onChange={(e) => setForm({ ...form, flatShippingRate: e.target.value })}
                className="w-full p-2.5 border border-gray-300 rounded-xs focus:outline-none focus:border-[#0D3522] font-semibold"
              />
              <p className="text-[10px] text-gray-400 mt-1">Applied on orders below threshold</p>
            </div>

            <div>
              <label className="block font-semibold text-gray-700 mb-1">
                Cash On Delivery (COD) Fee (₹)
              </label>
              <input
                type="number"
                value={form.codFee}
                onChange={(e) => setForm({ ...form, codFee: e.target.value })}
                className="w-full p-2.5 border border-gray-300 rounded-xs focus:outline-none focus:border-[#0D3522] font-semibold"
              />
              <p className="text-[10px] text-gray-400 mt-1">Courier collection surcharge</p>
            </div>
          </div>
        </div>

        {/* Legal & Food Safety Compliance */}
        <div className="bg-white border border-gray-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center space-x-2 pb-3 border-b border-gray-100 text-gray-900 font-serif font-bold text-sm">
            <ShieldCheck className="w-4 h-4 text-[#0D3522]" />
            <h3>FSSAI & Regulatory Compliance</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-gray-700 mb-1">
                FSSAI Central License Number
              </label>
              <input
                type="text"
                value={form.fssaiNumber}
                onChange={(e) => setForm({ ...form, fssaiNumber: e.target.value })}
                className="w-full p-2.5 border border-gray-300 rounded-xs focus:outline-none focus:border-[#0D3522] font-mono"
              />
              <p className="text-[10px] text-gray-400 mt-1">Displayed in website footer and invoice slips</p>
            </div>

            <div>
              <label className="block font-semibold text-gray-700 mb-1">
                GSTIN Registration
              </label>
              <input
                type="text"
                value={form.gstin}
                onChange={(e) => setForm({ ...form, gstin: e.target.value })}
                className="w-full p-2.5 border border-gray-300 rounded-xs focus:outline-none focus:border-[#0D3522] font-mono uppercase"
              />
              <p className="text-[10px] text-gray-400 mt-1">Goods and Services Tax Identification Number</p>
            </div>
          </div>
        </div>

        {/* Customer Support & Contact Info */}
        <div className="bg-white border border-gray-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center space-x-2 pb-3 border-b border-gray-100 text-gray-900 font-serif font-bold text-sm">
            <Building className="w-4 h-4 text-[#0D3522]" />
            <h3>Support & Warehouse Logistics</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-gray-700 mb-1">
                Customer Care Email
              </label>
              <input
                type="email"
                value={form.supportEmail}
                onChange={(e) => setForm({ ...form, supportEmail: e.target.value })}
                className="w-full p-2.5 border border-gray-300 rounded-xs focus:outline-none focus:border-[#0D3522]"
              />
            </div>

            <div>
              <label className="block font-semibold text-gray-700 mb-1">
                Customer Care Phone & WhatsApp
              </label>
              <input
                type="text"
                value={form.supportPhone}
                onChange={(e) => setForm({ ...form, supportPhone: e.target.value })}
                className="w-full p-2.5 border border-gray-300 rounded-xs focus:outline-none focus:border-[#0D3522]"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block font-semibold text-gray-700 mb-1">
                Central Dispatch Warehouse Address
              </label>
              <textarea
                rows={2}
                value={form.warehouseAddress}
                onChange={(e) => setForm({ ...form, warehouseAddress: e.target.value })}
                className="w-full p-2.5 border border-gray-300 rounded-xs focus:outline-none focus:border-[#0D3522]"
              />
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="px-6 py-3 bg-[#0D3522] hover:bg-[#134B31] text-white text-xs uppercase tracking-widest font-semibold flex items-center space-x-2 shadow-md transition-colors"
          >
            <Save className="w-4 h-4" />
            <span>Save Store Settings</span>
          </button>
        </div>
      </form>
    </div>
  );
}
