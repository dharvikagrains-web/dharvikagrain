'use client';

import React, { useState } from 'react';
import { availableCoupons } from '@/data/coupons';
import { Coupon } from '@/types';
import {
  TicketPercent,
  Plus,
  CheckCircle,
  Copy,
  Calendar,
  X,
  Sparkles,
} from 'lucide-react';

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState<Coupon[]>(availableCoupons);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newCoupon, setNewCoupon] = useState({
    code: '',
    discountPercent: '',
    discountAmount: '',
    minOrderAmount: '499',
    description: '',
    expiresAt: '31 Dec 2026',
  });

  const handleCreateCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCoupon.code) return;

    const created: Coupon = {
      id: `c-${Date.now()}`,
      code: newCoupon.code.toUpperCase().replace(/\s+/g, ''),
      description: newCoupon.description || 'Promotional seasonal harvest discount.',
      discountPercent: newCoupon.discountPercent ? Number(newCoupon.discountPercent) : undefined,
      discountAmount: newCoupon.discountAmount ? Number(newCoupon.discountAmount) : undefined,
      minOrderValue: Number(newCoupon.minOrderAmount) || 0,
      minOrderAmount: Number(newCoupon.minOrderAmount) || 0,
      expiryDate: newCoupon.expiresAt,
      expiresAt: newCoupon.expiresAt,
      usageCount: 0,
      isActive: true,
    };

    setCoupons([created, ...coupons]);
    setIsModalOpen(false);
    setNewCoupon({
      code: '',
      discountPercent: '',
      discountAmount: '',
      minOrderAmount: '499',
      description: '',
      expiresAt: '31 Dec 2026',
    });
  };

  const handleToggleActive = (code: string) => {
    setCoupons((prev) =>
      prev.map((c) => (c.code === code ? { ...c, isActive: !c.isActive } : c))
    );
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Promotions & Campaigns
          </span>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-gray-900">
            Coupons & Discounts
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Configure welcome codes, first-order incentives, and festival voucher campaigns.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 bg-[#0D3522] hover:bg-[#134B31] text-white text-xs uppercase tracking-wider font-semibold flex items-center space-x-1.5 transition-colors shadow-xs"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Create Coupon Code</span>
        </button>
      </div>

      {/* Coupons Table */}
      <div className="bg-white border border-gray-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-50 text-gray-500 font-semibold uppercase tracking-wider border-b border-gray-200">
              <tr>
                <th className="px-4 py-3">Coupon Code</th>
                <th className="px-4 py-3">Offer Details</th>
                <th className="px-4 py-3">Min Order Spend</th>
                <th className="px-4 py-3">Redemptions</th>
                <th className="px-4 py-3">Valid Until</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Toggle</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {coupons.map((coupon) => (
                <tr key={coupon.code} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3.5 font-mono font-bold text-sm text-[#0D3522]">
                    {coupon.code}
                  </td>
                  <td className="px-4 py-3.5">
                    <p className="font-semibold text-gray-900">
                      {coupon.discountPercent
                        ? `${coupon.discountPercent}% OFF`
                        : coupon.discountAmount
                        ? `₹${coupon.discountAmount} Flat OFF`
                        : 'Free Delivery'}
                    </p>
                    <p className="text-[11px] text-gray-500">{coupon.description}</p>
                  </td>
                  <td className="px-4 py-3.5 font-medium text-gray-800">
                    ₹{coupon.minOrderAmount}
                  </td>
                  <td className="px-4 py-3.5 text-gray-600 font-semibold">
                    {coupon.usageCount} orders
                  </td>
                  <td className="px-4 py-3.5 text-gray-500">
                    {coupon.expiresAt}
                  </td>
                  <td className="px-4 py-3.5">
                    <span
                      className={`inline-block px-2.5 py-0.5 text-[10px] font-semibold border ${
                        coupon.isActive
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : 'bg-gray-100 text-gray-500 border-gray-200'
                      }`}
                    >
                      {coupon.isActive ? 'Active' : 'Disabled'}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-right">
                    <button
                      type="button"
                      onClick={() => handleToggleActive(coupon.code)}
                      className={`px-3 py-1 text-[10px] font-semibold border transition-colors ${
                        coupon.isActive
                          ? 'bg-gray-100 hover:bg-gray-200 text-gray-700 border-gray-300'
                          : 'bg-emerald-600 hover:bg-emerald-700 text-white border-emerald-600'
                      }`}
                    >
                      {coupon.isActive ? 'Deactivate' : 'Activate'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white max-w-md w-full p-6 space-y-4 shadow-xl border border-gray-200">
            <div className="flex items-center justify-between pb-3 border-b border-gray-200">
              <h3 className="font-serif font-bold text-base text-gray-900">
                New Promotion Code
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateCoupon} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-gray-700 mb-1">Coupon Code</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. SANKRANTI15"
                  value={newCoupon.code}
                  onChange={(e) => setNewCoupon({ ...newCoupon, code: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-xs uppercase font-mono font-bold focus:outline-none focus:border-[#0D3522]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Discount %</label>
                  <input
                    type="number"
                    placeholder="15"
                    value={newCoupon.discountPercent}
                    onChange={(e) => setNewCoupon({ ...newCoupon, discountPercent: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded-xs focus:outline-none focus:border-[#0D3522]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Or Flat OFF (₹)</label>
                  <input
                    type="number"
                    placeholder="100"
                    value={newCoupon.discountAmount}
                    onChange={(e) => setNewCoupon({ ...newCoupon, discountAmount: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded-xs focus:outline-none focus:border-[#0D3522]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Minimum Cart Spend (₹)</label>
                <input
                  type="number"
                  placeholder="500"
                  value={newCoupon.minOrderAmount}
                  onChange={(e) => setNewCoupon({ ...newCoupon, minOrderAmount: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-xs focus:outline-none focus:border-[#0D3522]"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Description / Customer Banner</label>
                <input
                  type="text"
                  placeholder="Get 15% off on your wholesome harvest order."
                  value={newCoupon.description}
                  onChange={(e) => setNewCoupon({ ...newCoupon, description: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-xs focus:outline-none focus:border-[#0D3522]"
                />
              </div>

              <div className="pt-3 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#0D3522] hover:bg-[#134B31] text-white font-semibold"
                >
                  Publish Coupon
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
